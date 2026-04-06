import type { CSSProperties } from 'react'
import { getDecorativeBlobStyle } from '@/lib/decorative-color'
import { buildSectionStyle, resolveColorToken } from '@/lib/gradient-style'
import type { ImageHotspotProps } from './image-hotspot-types'

function toNumber(value: unknown, fallback: number) {
    if (typeof value === 'number' && !Number.isNaN(value)) return value
    if (typeof value === 'string') {
        const parsed = Number(value)
        if (!Number.isNaN(parsed)) return parsed
    }
    return fallback
}

function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value))
}

export function getImageHotspotStyles(props: ImageHotspotProps) {
    const sectionStyle: CSSProperties = buildSectionStyle({
        background: props.section_bg_color,
        backgroundFallback: '#302b63',
        text: props.section_text_color,
        paddingTop: props.section_padding_top,
        paddingBottom: props.section_padding_bottom,
        marginTop: props.section_margin_top,
        marginBottom: props.section_margin_bottom,
    })
    const sectionTextColor = resolveColorToken(props.section_text_color)

    const badgeSizeDesktop = clamp(toNumber(props.badge_text_size_px, 14), 10, 32)
    const badgeSizeMobile = clamp(Math.round(badgeSizeDesktop * 0.9), 10, badgeSizeDesktop)
    const headingSizeDesktop = clamp(toNumber(props.heading_text_size_px, 56), 24, 96)
    const headingSizeMobile = clamp(Math.round(headingSizeDesktop * 0.72), 20, headingSizeDesktop)
    const descriptionSizeDesktop = clamp(toNumber(props.description_text_size_px, 16), 12, 36)
    const descriptionSizeMobile = clamp(Math.round(descriptionSizeDesktop * 0.9), 12, descriptionSizeDesktop)

    const blobScale = clamp(toNumber(props.decorative_blob_size_scale, 1), 0.5, 2.5)
    const outlineScale = clamp(toNumber(props.decorative_outline_size_scale, 1), 0.5, 2.5)
    const legacyOffsetX = toNumber(props.decorative_shape_offset_x, 0)
    const legacyOffsetY = toNumber(props.decorative_shape_offset_y, 0)
    const topShapeOffsetX = clamp(toNumber(props.decorative_shape_top_offset_x, legacyOffsetX), -200, 200)
    const topShapeOffsetY = clamp(toNumber(props.decorative_shape_top_offset_y, legacyOffsetY), -200, 200)
    const bottomShapeOffsetX = clamp(toNumber(props.decorative_shape_bottom_offset_x, legacyOffsetX), -200, 200)
    const bottomShapeOffsetY = clamp(toNumber(props.decorative_shape_bottom_offset_y, legacyOffsetY), -200, 200)

    return {
        sectionStyle,
        sectionTextColor,
        badgeTextStyle: {
            fontSize: `clamp(${badgeSizeMobile}px, calc(${badgeSizeMobile - 1}px + 0.4vw), ${badgeSizeDesktop}px)`,
        } satisfies CSSProperties,
        headingTextStyle: {
            fontSize: `clamp(${headingSizeMobile}px, calc(${headingSizeMobile - 4}px + 1.2vw), ${headingSizeDesktop}px)`,
        } satisfies CSSProperties,
        descriptionTextStyle: {
            fontSize: `clamp(${descriptionSizeMobile}px, calc(${descriptionSizeMobile - 1}px + 0.3vw), ${descriptionSizeDesktop}px)`,
        } satisfies CSSProperties,
        decorativeStyles: {
            blobScale,
            outlineScale,
            topShapeOffsetX,
            topShapeOffsetY,
            bottomShapeOffsetX,
            bottomShapeOffsetY,
            topBlobStyle: {
                ...getDecorativeBlobStyle(props.decorative_blob_color, '#ea728c'),
                transform: `translate(${topShapeOffsetX}px, ${topShapeOffsetY}px) scale(${blobScale})`,
                transformOrigin: 'top right',
            } satisfies CSSProperties,
            bottomBlobStyle: {
                ...getDecorativeBlobStyle(props.decorative_blob_color, '#ea728c'),
                transform: `translate(${bottomShapeOffsetX}px, ${bottomShapeOffsetY}px) scale(${blobScale})`,
                transformOrigin: 'bottom left',
            } satisfies CSSProperties,
            topOutlineStyle: {
                borderColor: props.decorative_outline_color,
                transform: `translate(${topShapeOffsetX}px, ${topShapeOffsetY}px) scale(${outlineScale})`,
                transformOrigin: 'top right',
            } satisfies CSSProperties,
            bottomOutlineStyle: {
                borderColor: props.decorative_outline_color,
                transform: `translate(${bottomShapeOffsetX}px, ${bottomShapeOffsetY}px) scale(${outlineScale})`,
                transformOrigin: 'bottom left',
            } satisfies CSSProperties,
        },
    }
}
