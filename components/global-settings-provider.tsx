"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { TargetAndTransition, Target, Transition } from "framer-motion";

export type AnimationStyle = 'fade-up' | 'scale-up' | 'slide-left' | 'fade-in' | 'cinematic';

export interface GlobalSettings {
    animationsEnabled: boolean;
    animationStyle: AnimationStyle;
    globalFluidEnabled: boolean;
    globalFluidColor: string;
    globalWaterEnabled: boolean;
    auroraEnabled: boolean;
    bokehEnabled: boolean;
    wireGridEnabled: boolean;
    fogEnabled: boolean;
    neuralEnabled: boolean;
    gradientOrbEnabled: boolean;
}

interface GlobalSettingsContextType extends GlobalSettings {
    refreshSettings: () => Promise<void>;
}

type HeaderVisualSettings = Pick<
    GlobalSettings,
    | 'globalFluidEnabled'
    | 'globalFluidColor'
    | 'globalWaterEnabled'
    | 'auroraEnabled'
    | 'bokehEnabled'
    | 'wireGridEnabled'
    | 'fogEnabled'
    | 'neuralEnabled'
    | 'gradientOrbEnabled'
>;

const defaultSettings: GlobalSettings = {
    animationsEnabled: true,
    animationStyle: 'cinematic',
    globalFluidEnabled: false,
    globalFluidColor: '#38bdf8',
    globalWaterEnabled: false,
    auroraEnabled: false,
    bokehEnabled: false,
    wireGridEnabled: false,
    fogEnabled: false,
    neuralEnabled: false,
    gradientOrbEnabled: false,
};

const GlobalSettingsContext = createContext<GlobalSettingsContextType>({
    ...defaultSettings,
    refreshSettings: async () => { },
});

export function useGlobalSettings() {
    return useContext(GlobalSettingsContext);
}

function readHeaderVisualSettings(headerContent: Record<string, unknown>): HeaderVisualSettings {
    return {
        globalFluidEnabled: headerContent.enable_global_fluid === true || headerContent.enable_global_fluid === 'true',
        globalFluidColor: (headerContent.fluid_color as string) || defaultSettings.globalFluidColor,
        globalWaterEnabled: headerContent.enable_water_effect === true || headerContent.enable_water_effect === 'true',
        auroraEnabled: headerContent.enable_aurora_effect === true || headerContent.enable_aurora_effect === 'true',
        bokehEnabled: headerContent.enable_bokeh_effect === true || headerContent.enable_bokeh_effect === 'true',
        wireGridEnabled: headerContent.enable_wire_grid_effect === true || headerContent.enable_wire_grid_effect === 'true',
        fogEnabled: headerContent.enable_fog_effect === true || headerContent.enable_fog_effect === 'true',
        neuralEnabled: headerContent.enable_neural_effect === true || headerContent.enable_neural_effect === 'true',
        gradientOrbEnabled: headerContent.enable_gradient_orb_effect === true || headerContent.enable_gradient_orb_effect === 'true',
    };
}

export function GlobalSettingsProvider({ children, initialSettings }: { children: React.ReactNode, initialSettings?: Partial<GlobalSettings> }) {
    const [settings, setSettings] = useState<GlobalSettings>({
        ...defaultSettings,
        ...initialSettings,
    });
    const fetchSettings = useCallback(async () => {
        const supabase = createClient();

        // Fetch global settings
        const { data, error } = await supabase
            .from('website_sections')
            .select('content')
            .eq('section_id', 'global_settings')
            .maybeSingle();

        if (error) {
            console.error('Failed to load global settings:', error);
            return;
        }

        const payload = (data?.content ?? {}) as Partial<GlobalSettings>;

        // Also fetch header section to read fluid overlay settings
        const { data: headerData } = await supabase
            .from('website_sections')
            .select('content')
            .eq('section_id', 'header')
            .maybeSingle();

        const headerContent = (headerData?.content ?? {}) as Record<string, unknown>;

        setSettings({
            ...defaultSettings,
            ...payload,
            ...readHeaderVisualSettings(headerContent),
        });
    }, []);

    useEffect(() => {
        if (!initialSettings) {
            fetchSettings(); // eslint-disable-line react-hooks/set-state-in-effect -- intentional: load settings on mount when no SSR data
        }

        // Listen to localStorage events for absolute instant sync if multiple tabs are open
        const handleStorage = (e: StorageEvent) => {
            if (e.key === 'morningstar_global_settings_updated') {
                fetchSettings();
            }
        };

        window.addEventListener('storage', handleStorage);

        // Also setup an interval for the live preview to sync when changed from admin
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'GLOBAL_SETTINGS_UPDATE') {
                fetchSettings();
            }

            // When the admin panel sends a live preview update (all sections),
            // check if the header section has fluid settings and apply instantly
            if (event.data?.type === 'LIVE_PREVIEW_UPDATE') {
                const sections = event.data.sections as Array<{
                    section_id?: string;
                    block_type?: string | null;
                    content?: Record<string, unknown>;
                }>;
                const headerSection = sections?.find(
                    (section) => section.section_id === 'header' || section.block_type === 'header'
                );
                if (headerSection) {
                    const hc = headerSection.content || {};
                    setSettings(prev => ({
                        ...prev,
                        ...readHeaderVisualSettings(hc),
                    }));
                }
            }
        };
        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('message', handleMessage);
        }
    }, [fetchSettings, initialSettings]);

    return (
        <GlobalSettingsContext.Provider value={{ ...settings, refreshSettings: fetchSettings }}>
            {children}
        </GlobalSettingsContext.Provider>
    );
}

export function useAnimationVariants() {
    const { animationsEnabled, animationStyle } = useGlobalSettings();

    // Mobile detect (hook level — once)
    const [isMobile] = useState(() =>
        typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
    );

    return (options?: { y?: number, x?: number, delay?: number, duration?: number }) => {
        const y = options?.y ?? 30;
        const x = options?.x ?? 0;
        const delay = options?.delay ?? 0;
        const duration = options?.duration ?? 0.6;
        const ease: [number, number, number, number] = [0.21, 0.47, 0.32, 0.98];

        if (!animationsEnabled) {
            return {
                initial: false as const,
                whileInView: undefined,
                viewport: { once: true, margin: "0px" as const },
                transition: { duration: 0 }
            };
        }

        const initial: Target = { opacity: 0 };
        const whileInView: TargetAndTransition = { opacity: 1 };

        // On mobile, downgrade cinematic → fade-up (no blur filter, less offset)
        const effectiveStyle = (isMobile && animationStyle === 'cinematic') ? 'fade-up' : animationStyle;
        const effectiveDuration = isMobile ? Math.min(duration, 0.6) : duration;

        let transitionOptions: Transition = { duration: effectiveDuration, delay, ease };

        switch (effectiveStyle) {
            case 'cinematic':
                initial.y = y !== 0 ? y + 40 : 50; // Larger vertical travel offset
                initial.filter = 'blur(4px)'; // Slight blur on reveal
                whileInView.y = 0;
                whileInView.filter = 'blur(0px)';
                transitionOptions = { duration: effectiveDuration + 0.3, delay, ease: [0.16, 1, 0.3, 1] }; // Smooth bezier
                break;
            case 'scale-up':
                initial.scale = 0.95;
                whileInView.scale = 1;
                break;
            case 'slide-left':
                initial.x = -30;
                whileInView.x = 0;
                break;
            case 'fade-in':
                break;
            case 'fade-up':
            default:
                if (x !== 0) initial.x = x;
                if (y !== 0) initial.y = y;
                whileInView.x = 0;
                whileInView.y = 0;
                break;
        }

        return {
            initial,
            whileInView,
            viewport: { once: true, margin: "0px" as const },
            transition: transitionOptions
        };
    };
}
