"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────────────
 *  AppLoader — Premium Lusion-style loading screen
 *
 *  Sequence:
 *    1. Dark screen fades in instantly
 *    2. "M" SVG letter draws itself via stroke-dashoffset
 *    3. A thin progress bar fills across the bottom
 *    4. Once done, the "M" scales down → morphs into a star
 *    5. Star spins + scales to 0 while the overlay slides up, revealing the site
 * ───────────────────────────────────────────────────────────────────────────── */

const TOTAL_DURATION = 800; // total ms before exit begins

export function AppLoader() {
    const [phase, setPhase] = useState<"loading" | "exit" | "done">("loading");
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const rafId = window.requestAnimationFrame(() => setMounted(true));
        const t1 = setTimeout(() => setPhase("exit"), TOTAL_DURATION);
        const t2 = setTimeout(() => setPhase("done"), TOTAL_DURATION + 1200);
        return () => {
            cancelAnimationFrame(rafId);
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, []);

    if (pathname?.startsWith("/admin")) return null;
    if (phase === "done") return null;

    return (
        <AnimatePresence>
            <motion.div
                key="app-loader"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="fixed inset-0 z-[9999] flex items-center justify-center"
                style={{
                    background: "radial-gradient(ellipse at center, #0a0a1a 0%, #000000 100%)",
                    pointerEvents: phase === "exit" ? "none" : "all",
                }}
            >
                {/* ── Subtle ambient particles (client-only to avoid SSR mismatch) ── */}
                {mounted && <AmbientParticles />}

                {/* ── Central Logo Animation ── */}
                <motion.div
                    className="relative flex flex-col items-center gap-8"
                    animate={
                        phase === "exit"
                            ? { scale: 0, opacity: 0, rotate: 180 }
                            : { scale: 1, opacity: 1, rotate: 0 }
                    }
                    transition={{
                        duration: phase === "exit" ? 0.8 : 0,
                        ease: [0.76, 0, 0.24, 1],
                    }}
                >
                    {/* SVG "M" Letter — stroke draw animation */}
                    <motion.svg
                        viewBox="0 0 120 100"
                        width="120"
                        height="100"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        {/* Glow filter */}
                        <defs>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                            <linearGradient id="mGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#818cf8" />
                                <stop offset="50%" stopColor="#c084fc" />
                                <stop offset="100%" stopColor="#38bdf8" />
                            </linearGradient>
                        </defs>

                        <motion.path
                            d="M 10 90 L 10 20 L 32.5 55 L 55 20 L 55 90 M 110 20 L 65 20 L 65 55 L 110 55 L 110 90 L 65 90"
                            stroke="url(#mGradient)"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            filter="url(#glow)"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{
                                pathLength: { duration: 1.8, ease: [0.65, 0, 0.35, 1] },
                                opacity: { duration: 0.3 },
                            }}
                        />

                        {/* Star accent — appears after M is drawn */}
                        <motion.path
                            d="M 60 2 L 62 8 L 68 8 L 63 12 L 65 18 L 60 14 L 55 18 L 57 12 L 52 8 L 58 8 Z"
                            fill="#c084fc"
                            filter="url(#glow)"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 1.5, duration: 0.5, ease: "backOut" }}
                        />
                    </motion.svg>

                    {/* Text label */}
                    <motion.span
                        className="text-sm tracking-[0.3em] uppercase font-light"
                        style={{
                            background: "linear-gradient(90deg, #818cf8, #c084fc, #38bdf8)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
                    >
                        Morning Star
                    </motion.span>
                </motion.div>

                {/* ── Bottom Progress Bar ── */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
                    <motion.div
                        className="h-full"
                        style={{
                            background: "linear-gradient(90deg, #818cf8, #c084fc, #38bdf8)",
                        }}
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{
                            duration: TOTAL_DURATION / 1000,
                            ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                    />
                </div>

                {/* ── Exit: slide-up curtain reveal ── */}
                {phase === "exit" && (
                    <motion.div
                        className="absolute inset-0"
                        style={{
                            background: "radial-gradient(ellipse at center, #0a0a1a 0%, #000000 100%)",
                        }}
                        initial={{ y: 0 }}
                        animate={{ y: "-100%" }}
                        transition={{
                            duration: 0.9,
                            delay: 0.3,
                            ease: [0.76, 0, 0.24, 1],
                        }}
                    />
                )}
            </motion.div>
        </AnimatePresence>
    );
}

/* ── Client-only ambient particles (never SSR-rendered) ── */
function AmbientParticles() {
    const [particles] = useState(() =>
        Array.from({ length: 20 }, () => ({
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            r: 120 + Math.random() * 135,
            g: 100 + Math.random() * 155,
            opacity: 0.3 + Math.random() * 0.4,
            left: Math.random() * 100,
            top: Math.random() * 100,
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 2,
        }))
    );

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((p, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                        width: p.width,
                        height: p.height,
                        background: `rgba(${p.r}, ${p.g}, 255, ${p.opacity})`,
                        left: `${p.left}%`,
                        top: `${p.top}%`,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0, 1, 0],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
}
