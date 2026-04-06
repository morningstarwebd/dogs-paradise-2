"use client";

import { useEffect, useRef, useState } from "react";
import { useGlobalSettings } from "@/components/global-settings-provider";
import { usePathname } from "next/navigation";

/* ─────────────────────────────────────────────────────────────────────────────
 *  Atmospheric Fog / Smoke Effect
 *  Soft fog layers drift from the edges of the screen.
 * ───────────────────────────────────────────────────────────────────────────── */

interface FogLayer {
    x: number; y: number; radius: number;
    speedX: number; speedY: number;
    opacity: number; phase: number;
}

export function FogEffect() {
    const [mounted] = useState(() => typeof window !== "undefined");
    const { fogEnabled } = useGlobalSettings();
    const pathname = usePathname();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number>(0);



    useEffect(() => {
        const isAdmin = pathname?.startsWith('/admin');
        if (!mounted || !fogEnabled || isAdmin || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d')!;
        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        // Generate fog blobs at screen edges
        const fogLayers: FogLayer[] = Array.from({ length: 12 }, () => {
            const edge = Math.floor(Math.random() * 4); // 0=top,1=right,2=bottom,3=left
            let x = 0, y = 0;
            if (edge === 0) { x = Math.random() * width; y = -100; }
            else if (edge === 1) { x = width + 100; y = Math.random() * height; }
            else if (edge === 2) { x = Math.random() * width; y = height + 100; }
            else { x = -100; y = Math.random() * height; }

            return {
                x, y,
                radius: 150 + Math.random() * 300,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.2,
                opacity: 0.03 + Math.random() * 0.06,
                phase: Math.random() * Math.PI * 2,
            };
        });

        const onResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        window.addEventListener('resize', onResize);

        let time = 0;
        const animate = () => {
            time += 0.005;
            ctx.clearRect(0, 0, width, height);

            for (const fog of fogLayers) {
                fog.x += fog.speedX + Math.sin(time + fog.phase) * 0.3;
                fog.y += fog.speedY + Math.cos(time * 0.7 + fog.phase) * 0.2;

                // Wrap around screen edges with padding
                if (fog.x > width + fog.radius * 2) fog.x = -fog.radius;
                if (fog.x < -fog.radius * 2) fog.x = width + fog.radius;
                if (fog.y > height + fog.radius * 2) fog.y = -fog.radius;
                if (fog.y < -fog.radius * 2) fog.y = height + fog.radius;

                const pulsing = fog.opacity + Math.sin(time * 2 + fog.phase) * 0.01;

                const grad = ctx.createRadialGradient(fog.x, fog.y, 0, fog.x, fog.y, fog.radius);
                grad.addColorStop(0, `rgba(200, 210, 230, ${pulsing})`);
                grad.addColorStop(0.5, `rgba(180, 190, 210, ${pulsing * 0.5})`);
                grad.addColorStop(1, `rgba(160, 170, 190, 0)`);

                ctx.globalCompositeOperation = 'screen';
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(fog.x, fog.y, fog.radius, 0, Math.PI * 2);
                ctx.fill();
            }

            rafRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener('resize', onResize);
        };
    }, [mounted, fogEnabled, pathname]);

    const isAdmin = pathname?.startsWith('/admin');
    if (!mounted || !fogEnabled || isAdmin) return null;

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed', top: 0, left: 0,
                width: '100%', height: '100%',
                pointerEvents: 'none', zIndex: 9995,
            }}
        />
    );
}
