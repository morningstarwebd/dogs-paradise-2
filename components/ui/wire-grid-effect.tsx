"use client";

import { useEffect, useRef, useState } from "react";
import { useGlobalSettings } from "@/components/global-settings-provider";
import { usePathname } from "next/navigation";

/* ─────────────────────────────────────────────────────────────────────────────
 *  Interactive Wire Grid Effect
 *  A subtle perspective grid that reacts to mouse movement.
 * ───────────────────────────────────────────────────────────────────────────── */

export function WireGridEffect() {
    const [mounted] = useState(() => typeof window !== "undefined");
    const { wireGridEnabled } = useGlobalSettings();
    const pathname = usePathname();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number>(0);
    const mouseRef = useRef({ x: 0.5, y: 0.5 });



    useEffect(() => {
        const isAdmin = pathname?.startsWith('/admin');
        if (!mounted || !wireGridEnabled || isAdmin || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d')!;
        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const onMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = e.clientX / width;
            mouseRef.current.y = e.clientY / height;
        };

        const onResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('mousemove', onMouseMove, { passive: true });
        window.addEventListener('resize', onResize);

        const COLS = 30;
        const ROWS = 20;
        let time = 0;

        const animate = () => {
            time += 0.01;
            ctx.clearRect(0, 0, width, height);

            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;

            ctx.strokeStyle = 'rgba(100, 140, 255, 0.08)';
            ctx.lineWidth = 0.5;

            // Horizontal lines
            for (let r = 0; r <= ROWS; r++) {
                ctx.beginPath();
                for (let c = 0; c <= COLS; c++) {
                    const baseX = (c / COLS) * width;
                    const baseY = (r / ROWS) * height;

                    // Displacement by mouse proximity
                    const dx = baseX / width - mx;
                    const dy = baseY / height - my;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const influence = Math.max(0, 1 - dist * 3);

                    const offsetX = dx * influence * 40 + Math.sin(time + c * 0.3) * 2;
                    const offsetY = dy * influence * 40 + Math.cos(time + r * 0.3) * 2;

                    const x = baseX + offsetX;
                    const y = baseY + offsetY;

                    if (c === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }

            // Vertical lines
            for (let c = 0; c <= COLS; c++) {
                ctx.beginPath();
                for (let r = 0; r <= ROWS; r++) {
                    const baseX = (c / COLS) * width;
                    const baseY = (r / ROWS) * height;

                    const dx = baseX / width - mx;
                    const dy = baseY / height - my;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const influence = Math.max(0, 1 - dist * 3);

                    const offsetX = dx * influence * 40 + Math.sin(time + c * 0.3) * 2;
                    const offsetY = dy * influence * 40 + Math.cos(time + r * 0.3) * 2;

                    const x = baseX + offsetX;
                    const y = baseY + offsetY;

                    if (r === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }

            // Draw glow at mouse intersection points
            const glowX = mx * width;
            const glowY = my * height;
            const glowGrad = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, 120);
            glowGrad.addColorStop(0, 'rgba(100, 140, 255, 0.06)');
            glowGrad.addColorStop(1, 'rgba(100, 140, 255, 0)');
            ctx.fillStyle = glowGrad;
            ctx.fillRect(0, 0, width, height);

            rafRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', onResize);
        };
    }, [mounted, wireGridEnabled, pathname]);

    const isAdmin = pathname?.startsWith('/admin');
    if (!mounted || !wireGridEnabled || isAdmin) return null;

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
