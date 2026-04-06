"use client";

import { useGlobalSettings } from "@/components/global-settings-provider";
import { updateGlobalSettingsServer } from "@/lib/global-settings";
import { useState } from "react";
import { Loader2, Settings2, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function GlobalSettingsCard() {
    const { animationsEnabled, animationStyle, refreshSettings } = useGlobalSettings();
    const [saving, setSaving] = useState(false);

    const handleEnableChange = async (enabled: boolean) => {
        setSaving(true);
        try {
            await updateGlobalSettingsServer({ animationsEnabled: enabled });
            await refreshSettings();
            // Notify other tabs immediately
            window.localStorage.setItem('morningstar_global_settings_updated', Date.now().toString());
            // Notify Live Preview wrapper if open
            window.postMessage({ type: 'GLOBAL_SETTINGS_UPDATE' }, window.location.origin);
        } finally {
            setSaving(false);
        }
    };

    const handleStyleChange = async (style: 'fade-up' | 'scale-up' | 'slide-left' | 'fade-in' | 'cinematic') => {
        setSaving(true);
        try {
            await updateGlobalSettingsServer({ animationStyle: style });
            await refreshSettings();
            window.localStorage.setItem('morningstar_global_settings_updated', Date.now().toString());
            window.postMessage({ type: 'GLOBAL_SETTINGS_UPDATE' }, window.location.origin);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mt-4">
            <div className="bg-gray-50/80 px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-700">
                    <Settings2 size={16} strokeWidth={2.5} />
                    <h3 className="text-sm font-semibold tracking-tight">Website Options</h3>
                </div>
                {saving && <Loader2 size={14} className="animate-spin text-emerald-500" />}
            </div>

            <div className="p-4 space-y-5">
                {/* Animations Toggle */}
                <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 mt-0.5 min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 leading-none">Scroll Animations</p>
                        <p className="text-[11px] text-gray-500 leading-snug pr-2 truncate sm:whitespace-normal">Enable staggered reveal effects when scrolling.</p>
                    </div>

                    <button
                        type="button"
                        role="switch"
                        aria-checked={animationsEnabled}
                        disabled={saving}
                        onClick={() => handleEnableChange(!animationsEnabled)}
                        className={cn(
                            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed shadow-inner",
                            animationsEnabled ? 'bg-emerald-500' : 'bg-gray-200'
                        )}
                    >
                        <span
                            aria-hidden="true"
                            className={cn(
                                "pointer-events-none inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                                animationsEnabled ? 'translate-x-5' : 'translate-x-0'
                            )}
                        >
                            {animationsEnabled && (
                                <Check size={12} strokeWidth={3} className="text-emerald-500" />
                            )}
                        </span>
                    </button>
                </div>

                {/* Animation Style Dropdown */}
                {animationsEnabled && (
                    <div className="animate-in fade-in slide-in-from-top-1 pt-1">
                        <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">Animation Style</label>
                        <div className="relative">
                            <select
                                value={animationStyle}
                                onChange={(e) => handleStyleChange(e.target.value as 'fade-up' | 'scale-up' | 'slide-left' | 'fade-in' | 'cinematic')}
                                disabled={saving}
                                className="block w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50 transition-colors shadow-sm cursor-pointer hover:bg-gray-50"
                            >
                                <option value="cinematic">Cinematic</option>
                                <option value="fade-up">Fade Up & In</option>
                                <option value="scale-up">Scale Up</option>
                                <option value="slide-left">Slide from Left</option>
                                <option value="fade-in">Simple Fade In</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                <ChevronDown size={14} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
