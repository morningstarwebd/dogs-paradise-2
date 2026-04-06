import type { CSSProperties } from 'react'
import { resolveBackgroundStyle } from '@/lib/gradient-style'

const DEFAULT_BODY_BACKGROUND = '#302b63'
const WEBSITE_VISUAL_PRESETS = ['custom', 'black-gold-dust-soft', 'black-gold-dust-rich'] as const

type WebsiteVisualPreset = (typeof WEBSITE_VISUAL_PRESETS)[number]

type WebsiteVisualPresetDefaults = {
    sectionBackground: string
    bodyBackground: string
    enableGoldDustOverlay: boolean
    goldDustDensity: number
    goldDustSpeed: number
    goldDustSize: number
    goldDustOpacity: number
    goldDustColor: string
}

const WEBSITE_VISUAL_PRESET_DEFAULTS: Record<Exclude<WebsiteVisualPreset, 'custom'>, WebsiteVisualPresetDefaults> = {
    'black-gold-dust-soft': {
        sectionBackground:
            'radial-gradient(125% 190% at 50% -135%, rgba(219, 170, 78, 0.16) 0%, rgba(219, 170, 78, 0) 38%), linear-gradient(145deg, #030303 0%, #0a0a0a 62%, #15110d 100%)',
        bodyBackground:
            'radial-gradient(130% 220% at 18% -145%, rgba(224, 173, 80, 0.14) 0%, rgba(224, 173, 80, 0) 44%), linear-gradient(145deg, #020202 0%, #080808 52%, #120f0b 100%)',
        enableGoldDustOverlay: true,
        goldDustDensity: 0.42,
        goldDustSpeed: 1,
        goldDustSize: 1,
        goldDustOpacity: 0.45,
        goldDustColor: '#d4af37',
    },
    'black-gold-dust-rich': {
        sectionBackground:
            'radial-gradient(140% 210% at 14% -140%, rgba(222, 162, 58, 0.24) 0%, rgba(222, 162, 58, 0) 42%), linear-gradient(150deg, #010101 0%, #080707 46%, #181108 100%)',
        bodyBackground:
            'radial-gradient(130% 210% at 86% -150%, rgba(232, 171, 68, 0.18) 0%, rgba(232, 171, 68, 0) 45%), linear-gradient(150deg, #010101 0%, #060606 48%, #160f08 100%)',
        enableGoldDustOverlay: true,
        goldDustDensity: 0.62,
        goldDustSpeed: 1.15,
        goldDustSize: 1.08,
        goldDustOpacity: 0.58,
        goldDustColor: '#e1b75a',
    },
}

export type HeaderThemeSettings = {
    forceGlobalVisualPreset: boolean
    enableGlobalSectionBackground: boolean
    globalSectionBackground: string
    bodyBackground: string
    enableGoldDustOverlay: boolean
    goldDustDensity: number
    goldDustSpeed: number
    goldDustSize: number
    goldDustOpacity: number
    goldDustColor: string
}

function readString(value: unknown): string {
    if (typeof value !== 'string') return ''
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : ''
}

function readBoolean(value: unknown, fallback = false): boolean {
    if (typeof value === 'boolean') return value
    if (typeof value === 'string') {
        const normalized = value.trim().toLowerCase()
        if (normalized === 'true') return true
        if (normalized === 'false') return false
    }
    return fallback
}

function readNumber(value: unknown, fallback: number, min?: number, max?: number): number {
    const parsed = typeof value === 'number' ? value : Number(value)
    let normalized = Number.isFinite(parsed) ? parsed : fallback

    if (typeof min === 'number') normalized = Math.max(min, normalized)
    if (typeof max === 'number') normalized = Math.min(max, normalized)

    return normalized
}

function readChoice<T extends readonly string[]>(
    value: unknown,
    choices: T,
    fallback: T[number]
): T[number] {
    if (typeof value !== 'string') return fallback
    const normalized = value.trim().toLowerCase()
    return (choices as readonly string[]).includes(normalized) ? (normalized as T[number]) : fallback
}

export function getHeaderThemeSettings(
    headerContent: Record<string, unknown> | null | undefined
): HeaderThemeSettings {
    const safeContent = headerContent || {}
    const globalVisualPreset = readChoice(safeContent.global_visual_preset, WEBSITE_VISUAL_PRESETS, 'custom')
    const presetDefaults =
        globalVisualPreset === 'custom' ? null : WEBSITE_VISUAL_PRESET_DEFAULTS[globalVisualPreset]

    const explicitGlobalSectionBackground = readString(safeContent.global_section_bg_color)
    const explicitBodyBackground = readString(safeContent.body_bg_color)
    const effectiveGlobalSectionBackground =
        explicitGlobalSectionBackground || presetDefaults?.sectionBackground || ''
    const effectiveBodyBackground = explicitBodyBackground || presetDefaults?.bodyBackground || ''
    const explicitGlobalSectionToggle = readBoolean(safeContent.enable_global_section_bg, false)
    const forceGlobalFromPreset =
        globalVisualPreset !== 'custom' && effectiveGlobalSectionBackground.length > 0

    const hasExplicitDustToggle = Object.prototype.hasOwnProperty.call(
        safeContent,
        'enable_gold_dust_overlay'
    )
    const explicitDustToggle = hasExplicitDustToggle
        ? readBoolean(
              safeContent.enable_gold_dust_overlay,
              presetDefaults?.enableGoldDustOverlay ?? false
          )
        : undefined
    const enableGoldDustOverlay =
        explicitDustToggle ?? (presetDefaults?.enableGoldDustOverlay ?? false)
    const defaultDensity = presetDefaults?.goldDustDensity ?? 0.45
    const defaultSpeed = presetDefaults?.goldDustSpeed ?? 1
    const defaultSize = presetDefaults?.goldDustSize ?? 1
    const defaultOpacity = presetDefaults?.goldDustOpacity ?? 0.45
    const defaultColor = presetDefaults?.goldDustColor ?? '#d4af37'

    return {
        forceGlobalVisualPreset: globalVisualPreset !== 'custom',
        enableGlobalSectionBackground: explicitGlobalSectionToggle || forceGlobalFromPreset,
        globalSectionBackground: effectiveGlobalSectionBackground,
        bodyBackground: effectiveBodyBackground,
        enableGoldDustOverlay,
        goldDustDensity: readNumber(safeContent.gold_dust_density, defaultDensity, 0.1, 1),
        goldDustSpeed: readNumber(safeContent.gold_dust_speed, defaultSpeed, 0.6, 2),
        goldDustSize: readNumber(safeContent.gold_dust_size, defaultSize, 0.6, 1.8),
        goldDustOpacity: readNumber(safeContent.gold_dust_opacity, defaultOpacity, 0.1, 1),
        goldDustColor: readString(safeContent.gold_dust_color) || defaultColor,
    }
}

export function withGlobalSectionBackground<T extends Record<string, unknown>>(
    sectionContent: T,
    themeSettings: HeaderThemeSettings
): T {
    if (!themeSettings.enableGlobalSectionBackground || !themeSettings.globalSectionBackground) {
        return sectionContent
    }

    const currentSectionBackground = readString(sectionContent.section_bg_color)
    const useCustomSectionBackground = readBoolean(sectionContent.section_use_custom_bg_color, false)

    // Explicit section custom color/gradient must always win.
    if (useCustomSectionBackground && currentSectionBackground.length > 0) {
        return sectionContent
    }

    if (useCustomSectionBackground && !themeSettings.forceGlobalVisualPreset) {
        return sectionContent
    }

    if (currentSectionBackground === themeSettings.globalSectionBackground) {
        return sectionContent
    }

    return {
        ...sectionContent,
        section_bg_color: themeSettings.globalSectionBackground,
    } as T
}

export function getWebsiteBodyStyle(
    themeSettings: HeaderThemeSettings,
    fallback = DEFAULT_BODY_BACKGROUND
): CSSProperties {
    return resolveBackgroundStyle(themeSettings.bodyBackground, fallback)
}
