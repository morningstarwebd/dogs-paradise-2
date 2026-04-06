"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGsap } from "@/components/gsap-provider";
import { useGlobalSettings } from "@/components/global-settings-provider";

export type ScrollAnimationType =
    | "fadeUp"
    | "fadeIn"
    | "scaleUp"
    | "slideLeft"
    | "slideRight"
    | "stagger";

export interface ScrollAnimationOptions {
    /** Animation delay in seconds */
    delay?: number;
    /** Animation duration in seconds */
    duration?: number;
    /** Y offset for fadeUp (default 60) */
    y?: number;
    /** X offset for slide animations (default 60) */
    x?: number;
    /** Stagger amount between children (default 0.12) */
    staggerAmount?: number;
    /** ScrollTrigger start position (default "top 85%") */
    start?: string;
    /** Whether to animate only once (default true) */
    once?: boolean;
    /** Custom ease (default "power3.out") */
    ease?: string;
}

/**
 * Hook that wraps gsap.fromTo() + ScrollTrigger for common scroll-reveal patterns.
 *
 * For `stagger` type: attach the ref to a **container** element,
 * and its direct children will be staggered.
 *
 * Respects `animationsEnabled` from global settings and `prefers-reduced-motion`.
 */
export function useScrollAnimation(
    type: ScrollAnimationType = "fadeUp",
    options: ScrollAnimationOptions = {}
) {
    const ref = useRef<HTMLElement>(null);
    const { ready, reducedMotion } = useGsap();
    const { animationsEnabled } = useGlobalSettings();

    const {
        delay = 0,
        duration = 0.9,
        y = 60,
        x = 60,
        staggerAmount = 0.12,
        start = "top 85%",
        once = true,
        ease = "power3.out",
    } = options;

    useEffect(() => {
        const el = ref.current;
        if (!el || !ready) return;

        // If animations are disabled or reduced-motion is active, ensure elements are visible
        if (!animationsEnabled || reducedMotion) {
            gsap.set(el, { opacity: 1, y: 0, x: 0, scale: 1, clearProps: "all" });
            if (type === "stagger") {
                gsap.set(el.children, { opacity: 1, y: 0, x: 0, scale: 1, clearProps: "all" });
            }
            return;
        }

        let ctx: gsap.Context;

        if (type === "stagger") {
            // Stagger children
            ctx = gsap.context(() => {
                gsap.set(el.children, { opacity: 0, y });
                gsap.to(el.children, {
                    opacity: 1,
                    y: 0,
                    duration,
                    delay,
                    ease,
                    force3D: true,
                    stagger: staggerAmount,
                    scrollTrigger: {
                        trigger: el,
                        start,
                        toggleActions: once
                            ? "play none none none"
                            : "play none none reverse",
                    },
                });
            }, el);
        } else {
            // Single element animation
            const fromVars: gsap.TweenVars = { opacity: 0 };
            const toVars: gsap.TweenVars = { opacity: 1, duration, delay, ease, force3D: true };

            switch (type) {
                case "fadeUp":
                    fromVars.y = y;
                    toVars.y = 0;
                    break;
                case "fadeIn":
                    // Only opacity
                    break;
                case "scaleUp":
                    fromVars.scale = 0.9;
                    toVars.scale = 1;
                    break;
                case "slideLeft":
                    fromVars.x = x;
                    toVars.x = 0;
                    break;
                case "slideRight":
                    fromVars.x = -x;
                    toVars.x = 0;
                    break;
            }

            ctx = gsap.context(() => {
                gsap.fromTo(el, fromVars, {
                    ...toVars,
                    scrollTrigger: {
                        trigger: el,
                        start,
                        toggleActions: once
                            ? "play none none none"
                            : "play none none reverse",
                    },
                });
            }, el);
        }

        return () => {
            ctx.revert();
        };
        // Intentionally using serialized deps to avoid re-running on every render
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ready, animationsEnabled, reducedMotion, type]);

    return ref;
}
