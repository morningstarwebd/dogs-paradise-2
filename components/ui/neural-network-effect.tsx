"use client";

import { useEffect, useRef, useState } from "react";
import { useGlobalSettings } from "@/components/global-settings-provider";
import { usePathname } from "next/navigation";

/* ─────────────────────────────────────────────────────────────────────────────
 *  Electric Neural Network Effect
 *  Floating nodes connected by electric lines that react to the mouse.
 * ───────────────────────────────────────────────────────────────────────────── */

interface NeuralNode {
    x: number; y: number;
    vx: number; vy: number;
    radius: number;
}

const NODE_COUNT = 80;
const CONNECTION_DIST = 150;

export function NeuralNetworkEffect() {
    const [mounted] = useState(() => typeof window !== "undefined");
    const { neuralEnabled } = useGlobalSettings();
    const pathname = usePathname();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number>(0);
    const mouseRef = useRef({ x: -1000, y: -1000 });



    useEffect(() => {
        const isAdmin = pathname?.startsWith('/admin');
        if (!mounted || !neuralEnabled || isAdmin || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d')!;
        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const nodes: NeuralNode[] = Array.from({ length: NODE_COUNT }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: 1.5 + Math.random() * 2,
        }));

        const onMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY;
        };
        const onResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('mousemove', onMouseMove, { passive: true });
        window.addEventListener('resize', onResize);

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;

            // Update nodes
            for (const node of nodes) {
                node.x += node.vx;
                node.y += node.vy;

                // Bounce off edges
                if (node.x < 0 || node.x > width) node.vx *= -1;
                if (node.y < 0 || node.y > height) node.vy *= -1;
                node.x = Math.max(0, Math.min(width, node.x));
                node.y = Math.max(0, Math.min(height, node.y));

                // Subtle mouse repulsion
                const dx = node.x - mx;
                const dy = node.y - my;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120 && dist > 0) {
                    const force = (120 - dist) / 120 * 0.3;
                    node.vx += (dx / dist) * force;
                    node.vy += (dy / dist) * force;
                }

                // Damping
                node.vx *= 0.99;
                node.vy *= 0.99;
            }

            // Draw connections
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < CONNECTION_DIST) {
                        const alpha = (1 - dist / CONNECTION_DIST) * 0.15;

                        // Brighter near mouse
                        const midX = (nodes[i].x + nodes[j].x) / 2;
                        const midY = (nodes[i].y + nodes[j].y) / 2;
                        const mouseDistSq = (midX - mx) ** 2 + (midY - my) ** 2;
                        const mouseFactor = mouseDistSq < 20000 ? 1.5 : 1;

                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.strokeStyle = `rgba(100, 180, 255, ${alpha * mouseFactor})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            // Draw nodes
            for (const node of nodes) {
                const mouseDist = Math.sqrt((node.x - mx) ** 2 + (node.y - my) ** 2);
                const glow = mouseDist < 120 ? 0.8 : 0.3;

                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(120, 200, 255, ${glow})`;
                ctx.fill();
            }

            rafRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', onResize);
        };
    }, [mounted, neuralEnabled, pathname]);

    const isAdmin = pathname?.startsWith('/admin');
    if (!mounted || !neuralEnabled || isAdmin) return null;

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed', top: 0, left: 0,
                width: '100%', height: '100%',
                pointerEvents: 'none', zIndex: 9996,
            }}
        />
    );
}
