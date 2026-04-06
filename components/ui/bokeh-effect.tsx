"use client";

import { useEffect, useRef, useState } from "react";
import { useGlobalSettings } from "@/components/global-settings-provider";
import { usePathname } from "next/navigation";

/* ─────────────────────────────────────────────────────────────────────────────
 *  Floating Bokeh / Fireflies Effect
 *  Soft, glowing orbs float upward and fade in/out, like fireflies or bokeh.
 * ───────────────────────────────────────────────────────────────────────────── */

interface BokehParticle {
    x: number; y: number; radius: number;
    speedY: number; speedX: number;
    opacity: number; maxOpacity: number;
    hue: number; phase: number; life: number; maxLife: number;
}

export function BokehEffect() {
    const [mounted] = useState(() => typeof window !== "undefined");
    const { bokehEnabled } = useGlobalSettings();
    const pathname = usePathname();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number>(0);



    useEffect(() => {
        const isAdmin = pathname?.startsWith('/admin');
        if (!mounted || !bokehEnabled || isAdmin || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d')!;
        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const particles: BokehParticle[] = [];
        const MAX_PARTICLES = 50;

        const spawn = (): BokehParticle => ({
            x: Math.random() * width,
            y: height + Math.random() * 100,
            radius: 8 + Math.random() * 35,
            speedY: -(0.15 + Math.random() * 0.4),
            speedX: (Math.random() - 0.5) * 0.3,
            opacity: 0,
            maxOpacity: 0.15 + Math.random() * 0.25,
            hue: [45, 200, 280, 340, 160][Math.floor(Math.random() * 5)],
            phase: Math.random() * Math.PI * 2,
            life: 0,
            maxLife: 400 + Math.random() * 600,
        });

        // Pre-populate
        for (let i = 0; i < 20; i++) {
            const p = spawn();
            p.y = Math.random() * height;
            p.life = Math.random() * p.maxLife;
            particles.push(p);
        }

        const onResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        window.addEventListener('resize', onResize);

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Spawn new particles
            if (particles.length < MAX_PARTICLES && Math.random() < 0.05) {
                particles.push(spawn());
            }

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.life++;
                p.x += p.speedX + Math.sin(p.phase + p.life * 0.01) * 0.2;
                p.y += p.speedY;

                // Fade in, hold, fade out
                const lifeRatio = p.life / p.maxLife;
                if (lifeRatio < 0.1) {
                    p.opacity = (lifeRatio / 0.1) * p.maxOpacity;
                } else if (lifeRatio > 0.7) {
                    p.opacity = ((1 - lifeRatio) / 0.3) * p.maxOpacity;
                } else {
                    p.opacity = p.maxOpacity;
                }

                // Remove dead particles
                if (p.life >= p.maxLife || p.y < -50) {
                    particles.splice(i, 1);
                    continue;
                }

                // Draw soft bokeh circle
                const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
                grad.addColorStop(0, `hsla(${p.hue}, 70%, 70%, ${p.opacity})`);
                grad.addColorStop(0.5, `hsla(${p.hue}, 60%, 60%, ${p.opacity * 0.4})`);
                grad.addColorStop(1, `hsla(${p.hue}, 50%, 50%, 0)`);

                ctx.globalCompositeOperation = 'screen';
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();
            }

            rafRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener('resize', onResize);
        };
    }, [mounted, bokehEnabled, pathname]);

    const isAdmin = pathname?.startsWith('/admin');
    if (!mounted || !bokehEnabled || isAdmin) return null;

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed', top: 0, left: 0,
                width: '100%', height: '100%',
                pointerEvents: 'none', zIndex: 9997,
            }}
        />
    );
}
