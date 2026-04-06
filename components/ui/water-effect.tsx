"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from 'three';
import { useGlobalSettings } from "@/components/global-settings-provider";
import { usePathname } from "next/navigation";

/* ─────────────────────────────────────────────────────────────────────────────
 *  Content-Aware Magnetic Particle Field + DOM Distortion
 *
 *  1. Scans the DOM for visible content elements (text, images, headings).
 *  2. Spawns particles ONLY near those content regions.
 *  3. Particles are magnetically attracted to the mouse cursor.
 *  4. An SVG displacement filter subtly warps the background near the mouse.
 * ───────────────────────────────────────────────────────────────────────────── */

const PARTICLE_COUNT = 2500;
const ATTRACT_RADIUS = 18;      // World-space units to attract particles
const ATTRACT_STRENGTH = 0.06;
const RETURN_STRENGTH = 0.015;
const DAMPING = 0.92;
const MAX_SPEED = 0.6;

/* ── Shaders ── */

const vertexShader = `
    attribute float aScale;
    attribute float aAlpha;
    varying float vAlpha;
    uniform float uPixelRatio;

    void main() {
        vAlpha = aAlpha;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aScale * uPixelRatio * (70.0 / -mv.z);
        gl_PointSize = max(gl_PointSize, 1.0);
        gl_Position = projectionMatrix * mv;
    }
`;

const fragmentShader = `
    varying float vAlpha;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform float uTime;

    void main() {
        vec2 c = gl_PointCoord - 0.5;
        float d = length(c);
        if (d > 0.5) discard;
        float s = pow(1.0 - d * 2.0, 1.5);
        vec3 col = mix(uColor1, uColor2, vAlpha * 0.6 + sin(uTime * 0.4) * 0.15);
        gl_FragColor = vec4(col, s * vAlpha * 0.75);
    }
`;

/* ── DOM Scanner ──
 * Gathers bounding-rects of visible content elements and converts them to
 * normalised "content regions" the particle system can use for spawning. */

interface ContentRect {
    x: number; y: number; w: number; h: number;   // screen px
    cx: number; cy: number;                         // screen centre
}

function scanDOMContent(): ContentRect[] {
    const selectors = 'h1,h2,h3,h4,p,img,video,span,a,button,li,td,th,figcaption,blockquote,label';
    const els = document.querySelectorAll(selectors);
    const rects: ContentRect[] = [];
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    els.forEach(el => {
        const r = el.getBoundingClientRect();
        // Only visible ones within the viewport
        if (r.width < 4 || r.height < 4) return;
        if (r.bottom < 0 || r.top > vh || r.right < 0 || r.left > vw) return;
        rects.push({
            x: r.left, y: r.top, w: r.width, h: r.height,
            cx: r.left + r.width / 2, cy: r.top + r.height / 2,
        });
    });
    return rects;
}

/* ── Convert screen‐px to THREE world coords on z=0 plane ── */
function screenToWorld(sx: number, sy: number, camera: THREE.PerspectiveCamera, width: number, height: number): [number, number] {
    const ndc = new THREE.Vector3((sx / width) * 2 - 1, -(sy / height) * 2 + 1, 0.5);
    ndc.unproject(camera);
    const dir = ndc.sub(camera.position).normalize();
    const t = -camera.position.z / dir.z;
    const hit = camera.position.clone().add(dir.multiplyScalar(t));
    return [hit.x, hit.y];
}

/* ──────────────────────────── Component ──────────────────────────── */

export function WaterEffect() {
    const [mounted] = useState(() => typeof window !== "undefined");
    const { globalWaterEnabled } = useGlobalSettings();
    const pathname = usePathname();
    const containerRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number>(0);
    const mouseScreen = useRef({ x: 0, y: 0 });
    const mouseWorld = useRef({ x: 0, y: 0 });



    /* ── Main effect ── */
    useEffect(() => {
        const isAdmin = pathname?.startsWith('/admin');
        if (!mounted || !globalWaterEnabled || isAdmin || !containerRef.current) return;

        const container = containerRef.current;
        let width = window.innerWidth;
        let height = window.innerHeight;

        // --- THREE.js Scene ---
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
        camera.position.z = 30;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // --- Scan DOM for content regions → world coords ---
        let contentRegions: { wx: number; wy: number; hw: number; hh: number }[] = [];

        const rescanContent = () => {
            const rects = scanDOMContent();
            contentRegions = rects.map(r => {
                const [wx, wy] = screenToWorld(r.cx, r.cy, camera, width, height);
                // Approximate half-extents in world-space
                const [wx2] = screenToWorld(r.cx + r.w / 2, r.cy, camera, width, height);
                const [, wy2] = screenToWorld(r.cx, r.cy + r.h / 2, camera, width, height);
                return { wx, wy, hw: Math.abs(wx2 - wx), hh: Math.abs(wy2 - wy) };
            });
        };
        rescanContent();

        // --- Particle data ---
        const positions = new Float32Array(PARTICLE_COUNT * 3);
        const velocities = new Float32Array(PARTICLE_COUNT * 3);
        const homePositions = new Float32Array(PARTICLE_COUNT * 3);
        const scales = new Float32Array(PARTICLE_COUNT);
        const alphas = new Float32Array(PARTICLE_COUNT);

        // Spawn particles near content regions
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3;
            let x: number, y: number, z: number;

            if (contentRegions.length > 0) {
                // Pick a random content region
                const region = contentRegions[Math.floor(Math.random() * contentRegions.length)];
                // Random position within that region (with some spread)
                x = region.wx + (Math.random() - 0.5) * region.hw * 2.5;
                y = region.wy + (Math.random() - 0.5) * region.hh * 2.5;
                z = (Math.random() - 0.5) * 10;
            } else {
                // Fallback: random spread
                x = (Math.random() - 0.5) * 60;
                y = (Math.random() - 0.5) * 40;
                z = (Math.random() - 0.5) * 10;
            }

            positions[i3] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;
            homePositions[i3] = x;
            homePositions[i3 + 1] = y;
            homePositions[i3 + 2] = z;
            velocities[i3] = velocities[i3 + 1] = velocities[i3 + 2] = 0;
            scales[i] = Math.random() * 2.5 + 0.5;
            alphas[i] = Math.random() * 0.5 + 0.3;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
        geometry.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1));

        const material = new THREE.ShaderMaterial({
            vertexShader, fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
                uColor1: { value: new THREE.Color('#4f46e5') },   // Indigo
                uColor2: { value: new THREE.Color('#06b6d4') },   // Cyan
            },
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);

        // --- Input ---
        const onMouseMove = (e: MouseEvent) => {
            mouseScreen.current.x = e.clientX;
            mouseScreen.current.y = e.clientY;
            // Convert to world
            const ndc = new THREE.Vector3((e.clientX / width) * 2 - 1, -(e.clientY / height) * 2 + 1, 0.5);
            ndc.unproject(camera);
            const dir = ndc.sub(camera.position).normalize();
            const t = -camera.position.z / dir.z;
            const pos = camera.position.clone().add(dir.multiplyScalar(t));
            mouseWorld.current.x = pos.x;
            mouseWorld.current.y = pos.y;
        };

        const onResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            rescanContent();
        };

        // Rescan content on scroll (positions shift)
        let scrollTimeout: ReturnType<typeof setTimeout>;
        const onScroll = () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                rescanContent();
                // Re-home particles to new content positions
                for (let i = 0; i < PARTICLE_COUNT; i++) {
                    const i3 = i * 3;
                    if (contentRegions.length > 0) {
                        const region = contentRegions[Math.floor(Math.random() * contentRegions.length)];
                        homePositions[i3] = region.wx + (Math.random() - 0.5) * region.hw * 2.5;
                        homePositions[i3 + 1] = region.wy + (Math.random() - 0.5) * region.hh * 2.5;
                    }
                }
            }, 200);
        };

        window.addEventListener('mousemove', onMouseMove, { passive: true });
        window.addEventListener('resize', onResize);
        window.addEventListener('scroll', onScroll, { passive: true });

        // --- Animation ---
        const clock = new THREE.Clock();

        const animate = () => {
            const time = clock.getElapsedTime();
            material.uniforms.uTime.value = time;

            const mx = mouseWorld.current.x;
            const my = mouseWorld.current.y;
            const posAttr = geometry.attributes.position as THREE.BufferAttribute;
            const alphaAttr = geometry.attributes.aAlpha as THREE.BufferAttribute;

            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const i3 = i * 3;
                const px = positions[i3];
                const py = positions[i3 + 1];

                const dx = mx - px;
                const dy = my - py;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < ATTRACT_RADIUS) {
                    const force = ATTRACT_STRENGTH * (1.0 - dist / ATTRACT_RADIUS);
                    velocities[i3] += (dx / (dist + 0.001)) * force;
                    velocities[i3 + 1] += (dy / (dist + 0.001)) * force;
                    alphas[i] = Math.min(1.0, alphas[i] + 0.025);
                } else {
                    velocities[i3] += (homePositions[i3] - px) * RETURN_STRENGTH;
                    velocities[i3 + 1] += (homePositions[i3 + 1] - py) * RETURN_STRENGTH;
                    alphas[i] = Math.max(0.25, alphas[i] - 0.004);
                }

                // Ambient drift
                velocities[i3] += Math.sin(time * 0.3 + i * 0.01) * 0.001;
                velocities[i3 + 1] += Math.cos(time * 0.25 + i * 0.013) * 0.001;

                // Damping + speed clamp
                velocities[i3] *= DAMPING;
                velocities[i3 + 1] *= DAMPING;
                velocities[i3 + 2] *= DAMPING;

                const spd = Math.sqrt(velocities[i3] ** 2 + velocities[i3 + 1] ** 2);
                if (spd > MAX_SPEED) {
                    const s = MAX_SPEED / spd;
                    velocities[i3] *= s;
                    velocities[i3 + 1] *= s;
                }

                positions[i3] += velocities[i3];
                positions[i3 + 1] += velocities[i3 + 1];
                positions[i3 + 2] += velocities[i3 + 2];
            }

            posAttr.needsUpdate = true;
            alphaAttr.needsUpdate = true;

            renderer.render(scene, camera);
            rafRef.current = requestAnimationFrame(animate);
        };

        animate();

        // --- Cleanup ---
        return () => {
            cancelAnimationFrame(rafRef.current);
            clearTimeout(scrollTimeout);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', onResize);
            window.removeEventListener('scroll', onScroll);
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, [mounted, globalWaterEnabled, pathname]);

    const isAdmin = pathname?.startsWith('/admin');
    if (!mounted || !globalWaterEnabled || isAdmin) return null;

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 9998,
            }}
        />
    );
}

