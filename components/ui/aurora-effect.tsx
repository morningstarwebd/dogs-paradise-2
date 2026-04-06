"use client";

import { useEffect, useRef, useState } from "react";
import { useGlobalSettings } from "@/components/global-settings-provider";
import { usePathname } from "next/navigation";

/* ─────────────────────────────────────────────────────────────────────────────
 *  Aurora Borealis Effect
 *  Colorful northern-lights ribbons flowing across the screen using Canvas 2D.
 * ───────────────────────────────────────────────────────────────────────────── */

export function AuroraEffect() {
    const [mounted] = useState(() => typeof window !== "undefined");
    const { auroraEnabled } = useGlobalSettings();
    const pathname = usePathname();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number>(0);



    useEffect(() => {
        const isAdmin = pathname?.startsWith('/admin');
        if (!mounted || !auroraEnabled || isAdmin || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d')!;
        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        // Aurora ribbon data
        const ribbons = Array.from({ length: 5 }, (_, i) => ({
            y: height * 0.2 + i * height * 0.12,
            speed: 0.3 + Math.random() * 0.4,
            amplitude: 30 + Math.random() * 50,
            wavelength: 200 + Math.random() * 300,
            hue: [160, 200, 260, 300, 120][i], // green, blue, purple, pink, lime
            opacity: 0.12 + Math.random() * 0.1,
            phase: Math.random() * Math.PI * 2,
            thickness: 60 + Math.random() * 80,
        }));

        const onResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        window.addEventListener('resize', onResize);

        let time = 0;
        const animate = () => {
            time += 0.008;
            ctx.clearRect(0, 0, width, height);

            for (const ribbon of ribbons) {
                ctx.beginPath();
                const segments = 80;

                for (let j = 0; j <= segments; j++) {
                    const x = (j / segments) * (width + 200) - 100;
                    const wave1 = Math.sin((x / ribbon.wavelength) + time * ribbon.speed + ribbon.phase) * ribbon.amplitude;
                    const wave2 = Math.sin((x / (ribbon.wavelength * 0.5)) + time * ribbon.speed * 1.3) * ribbon.amplitude * 0.4;
                    const y = ribbon.y + wave1 + wave2;

                    if (j === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }

                // Draw downward fill to create a ribbon/curtain
                const gradient = ctx.createLinearGradient(0, ribbon.y - ribbon.thickness, 0, ribbon.y + ribbon.thickness);
                gradient.addColorStop(0, `hsla(${ribbon.hue}, 80%, 60%, 0)`);
                gradient.addColorStop(0.3, `hsla(${ribbon.hue}, 80%, 60%, ${ribbon.opacity})`);
                gradient.addColorStop(0.5, `hsla(${ribbon.hue}, 90%, 70%, ${ribbon.opacity * 1.5})`);
                gradient.addColorStop(0.7, `hsla(${ribbon.hue}, 80%, 60%, ${ribbon.opacity})`);
                gradient.addColorStop(1, `hsla(${ribbon.hue}, 80%, 60%, 0)`);

                ctx.strokeStyle = gradient;
                ctx.lineWidth = ribbon.thickness;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.globalCompositeOperation = 'screen';
                ctx.stroke();
            }

            rafRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener('resize', onResize);
        };
    }, [mounted, auroraEnabled, pathname]);

    const isAdmin = pathname?.startsWith('/admin');
    if (!mounted || !auroraEnabled || isAdmin) return null;

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
