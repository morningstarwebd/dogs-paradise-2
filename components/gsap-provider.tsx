"use client";

import { createContext, useContext, useEffect, useState } from "react";

type GsapContextValue = {
    ready: boolean;
    reducedMotion: boolean;
};

const GsapContext = createContext<GsapContextValue>({
    // Keep animations enabled by default even when no provider wrapper is mounted.
    ready: true,
    reducedMotion: false,
});

export function useGsap() {
    return useContext(GsapContext);
}

export function GsapProvider({ children }: { children: React.ReactNode }) {
    const [reducedMotion, setReducedMotion] = useState(
        () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        const handleChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    return (
        <GsapContext.Provider value={{ ready: true, reducedMotion }}>
            {children}
        </GsapContext.Provider>
    );
}
