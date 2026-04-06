"use client";

import { useEffect, useRef, useState } from "react";
import { useGlobalSettings } from "@/components/global-settings-provider";
import { usePathname } from "next/navigation";

/* ─────────────────────────────────────────────────────────────────────────────
 *  Gradient Orb Effect
 *  A large, soft, colorful gradient blob follows the mouse with a blur,
 *  blending into the background like a premium glassmorphism accent.
 * ───────────────────────────────────────────────────────────────────────────── */

export function GradientOrbEffect() {
    const [mounted] = useState(() => typeof window !== "undefined");
    const { gradientOrbEnabled } = useGlobalSettings();
    const pathname = usePathname();
    const orbRef = useRef<HTMLDivElement>(null);
    const posRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
    const rafRef = useRef<number>(0);



    useEffect(() => {
        const isAdmin = pathname?.startsWith('/admin');
        if (!mounted || !gradientOrbEnabled || isAdmin || !orbRef.current) return;

        posRef.current.x = window.innerWidth / 2;
        posRef.current.y = window.innerHeight / 2;
        posRef.current.targetX = posRef.current.x;
        posRef.current.targetY = posRef.current.y;

        const onMouseMove = (e: MouseEvent) => {
            posRef.current.targetX = e.clientX;
            posRef.current.targetY = e.clientY;
        };
        window.addEventListener('mousemove', onMouseMove, { passive: true });

        const animate = () => {
            // Smooth follow (lerp)
            posRef.current.x += (posRef.current.targetX - posRef.current.x) * 0.04;
            posRef.current.y += (posRef.current.targetY - posRef.current.y) * 0.04;

            if (orbRef.current) {
                orbRef.current.style.transform = `translate(${posRef.current.x - 200}px, ${posRef.current.y - 200}px)`;
            }

            rafRef.current = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener('mousemove', onMouseMove);
        };
    }, [mounted, gradientOrbEnabled, pathname]);

    const isAdmin = pathname?.startsWith('/admin');
    if (!mounted || !gradientOrbEnabled || isAdmin) return null;

    return (
        <div
            ref={orbRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: 400,
                height: 400,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.15) 30%, rgba(6,182,212,0.1) 60%, transparent 80%)',
                filter: 'blur(60px)',
                pointerEvents: 'none',
                zIndex: 9994,
                willChange: 'transform',
            }}
        />
    );
}
