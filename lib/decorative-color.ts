import type { CSSProperties } from 'react'

const GRADIENT_PATTERN = /(?:repeating-)?(?:linear|radial|conic)-gradient\s*\(/i
const GRADIENT_SHORTHAND_START_PATTERN = /^\s*(?:to\s+[a-z\s-]+|-?\d+(?:\.\d+)?deg)\s*,/i
const EXPLICIT_COLOR_PATTERN = /#(?:[0-9a-f]{3,8})\b|rgba?\([^)]*\)|hsla?\([^)]*\)/gi

const GLITTER_PRESETS: Record<string, string> = {
    'gold-glitter': 'linear-gradient(135deg, #7a5b00 0%, #ffd700 40%, #fff4b0 52%, #d4af37 68%, #7a5b00 100%)',
    'glitter-gold': 'linear-gradient(135deg, #7a5b00 0%, #ffd700 40%, #fff4b0 52%, #d4af37 68%, #7a5b00 100%)',
    'white-glitter': 'linear-gradient(135deg, #7d7d7d 0%, #ffffff 30%, #fefefe 50%, #e5e5e5 70%, #7d7d7d 100%)',
    'glitter-white': 'linear-gradient(135deg, #7d7d7d 0%, #ffffff 30%, #fefefe 50%, #e5e5e5 70%, #7d7d7d 100%)',
    'silver-glitter': 'linear-gradient(135deg, #5f6670 0%, #dfe6ef 35%, #f8fbff 50%, #c3ccd8 68%, #5f6670 100%)',
    'glitter-silver': 'linear-gradient(135deg, #5f6670 0%, #dfe6ef 35%, #f8fbff 50%, #c3ccd8 68%, #5f6670 100%)',
}

function normalizeColorValue(value: string | undefined, fallbackColor: string): string {
    const trimmed = typeof value === 'string' ? value.trim() : ''
    return trimmed || fallbackColor
}

function looksLikeGradientShorthand(value: string): boolean {
    if (!value.includes(',')) return false

    if (GRADIENT_SHORTHAND_START_PATTERN.test(value)) {
        return true
    }

    const explicitColors = value.match(EXPLICIT_COLOR_PATTERN) ?? []
    return explicitColors.length >= 2
}

export function normalizeDecorativeColorValue(
    value: string | undefined,
    fallbackColor = '#ea728c',
): string {
    const resolved = normalizeColorValue(value, fallbackColor)
    if (!resolved) return resolved

    const preset = GLITTER_PRESETS[resolved.toLowerCase()]
    if (preset) {
        return preset
    }

    if (GRADIENT_PATTERN.test(resolved)) {
        return resolved
    }

    if (looksLikeGradientShorthand(resolved)) {
        return `linear-gradient(${resolved})`
    }

    return resolved
}

export function isGradientColorValue(value: string | undefined): boolean {
    if (typeof value !== 'string') return false
    const normalized = normalizeDecorativeColorValue(value, '')
    return GRADIENT_PATTERN.test(normalized)
}

export function getDecorativeBlobStyle(
    colorOrGradient: string | undefined,
    fallbackColor = '#ea728c',
): CSSProperties {
    const resolved = normalizeDecorativeColorValue(colorOrGradient, fallbackColor)

    if (GRADIENT_PATTERN.test(resolved)) {
        return {
            backgroundImage: resolved,
            backgroundColor: 'transparent',
        }
    }

    return {
        backgroundColor: resolved,
    }
}
