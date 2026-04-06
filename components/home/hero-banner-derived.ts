import type { CSSProperties } from 'react'
import { siteConfig } from '@/data/site-config'
import { normalizeDecorativeColorValue } from '@/lib/decorative-color'
import { buildSectionStyle, resolveBackgroundStyle, resolveColorToken } from '@/lib/gradient-style'
import type { BlockInstance } from '@/types/schema.types'
import type { HeroBannerProps, HeroStatConfig } from './hero-banner-model'

function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value))
}

function toNumber(value: unknown, fallback: number) {
    if (typeof value === 'number' && Number.isFinite(value)) return value
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : fallback
}

export function getHeroStatConfig(
    stat: BlockInstance | undefined,
    trustValueTextColor: string,
    trustLabelTextColor: string,
    trustValueTextSizeDesktop: number,
    trustValueTextSizeMobile: number,
    trustLabelTextSizeDesktop: number,
    trustLabelTextSizeMobile: number,
): HeroStatConfig {
    const settings = (stat?.settings || {}) as Record<string, unknown>
    const cardColor = normalizeDecorativeColorValue(typeof settings.card_bg_color === 'string' ? settings.card_bg_color.trim() : '', '#ffffff')
    const valueColor = normalizeDecorativeColorValue(typeof settings.value_text_color === 'string' ? settings.value_text_color.trim() : '', trustValueTextColor)
    const labelColor = normalizeDecorativeColorValue(typeof settings.label_text_color === 'string' ? settings.label_text_color.trim() : '', trustLabelTextColor)

    return {
        cardBackgroundStyle: resolveBackgroundStyle(cardColor, '#ffffff'),
        valueTextSizeDesktop: trustValueTextSizeDesktop,
        valueTextSizeMobile: trustValueTextSizeMobile,
        labelTextSizeDesktop: trustLabelTextSizeDesktop,
        labelTextSizeMobile: trustLabelTextSizeMobile,
        valueTextColor: resolveColorToken(valueColor, trustValueTextColor) || trustValueTextColor,
        labelTextColor: resolveColorToken(labelColor, trustLabelTextColor) || trustLabelTextColor,
    }
}

export function getHeroBannerDerived(props: HeroBannerProps, stats: BlockInstance[]) {
    const sectionStyle: CSSProperties = buildSectionStyle({
        background: props.section_bg_color,
        text: props.section_text_color,
        paddingTop: props.section_padding_top,
        paddingBottom: props.section_padding_bottom,
        marginTop: props.section_margin_top,
        marginBottom: props.section_margin_bottom,
    })
    const sectionTextColor = resolveColorToken(props.section_text_color, '#FFF0D9') || '#FFF0D9'
    const accentColor = resolveColorToken(normalizeDecorativeColorValue(props.accent_color, '#ea728c'), '#ea728c') || '#ea728c'
    const headingLine1Color = resolveColorToken(normalizeDecorativeColorValue(props.heading_line1_color, sectionTextColor), sectionTextColor) || sectionTextColor
    const headingLine2Color = resolveColorToken(normalizeDecorativeColorValue(props.heading_line2_color, headingLine1Color), headingLine1Color) || headingLine1Color
    const descriptionTextColor = resolveColorToken(normalizeDecorativeColorValue(props.description_text_color, sectionTextColor), sectionTextColor) || sectionTextColor
    const trustValueTextColor = resolveColorToken(normalizeDecorativeColorValue(props.trust_value_text_color, '#1f2937'), '#1f2937') || '#1f2937'
    const trustLabelTextColor = resolveColorToken(normalizeDecorativeColorValue(props.trust_label_text_color, '#6b7280'), '#6b7280') || '#6b7280'
    const phoneIconColor = resolveColorToken(normalizeDecorativeColorValue(props.phone_icon_color, accentColor), accentColor) || accentColor
    const locationMapIconColor = resolveColorToken(normalizeDecorativeColorValue(props.location_map_icon_color, accentColor), accentColor) || accentColor
    const badgeTextColor = resolveColorToken(normalizeDecorativeColorValue(props.badge_text_color, accentColor), accentColor) || accentColor
    const badgeStarColor = resolveColorToken(normalizeDecorativeColorValue(props.badge_star_color, accentColor), accentColor) || accentColor
    const decorativeOutlineColor = resolveColorToken(normalizeDecorativeColorValue(props.decorative_outline_color, '#f5c842'), '#f5c842') || '#f5c842'

    const resolvedLocationMapLink = typeof props.location_map_link === 'string' && props.location_map_link.trim() ? props.location_map_link.trim() : siteConfig.googleMapsUrl
    const locationTitleText = typeof props.location_title_text === 'string' ? props.location_title_text.trim() : ''
    const locationSubtext = typeof props.location_subtext === 'string' ? props.location_subtext.trim() : ''
    const locationMobileCtaText = typeof props.location_mobile_cta_text === 'string' ? props.location_mobile_cta_text.trim() : ''

    const locationCardColor = normalizeDecorativeColorValue(props.location_card_bg_color, '#ffffff')
    const resolvedLocationCardBackground = resolveColorToken(locationCardColor, '#ffffff') || '#ffffff'
    const locationCardBackgroundStyle: CSSProperties = { ...resolveBackgroundStyle(locationCardColor, resolvedLocationCardBackground), borderColor: resolvedLocationCardBackground }
    const locationTextColor = resolveColorToken(normalizeDecorativeColorValue(props.location_text_color, '#374151'), '#374151') || '#374151'
    const locationTextSize = clamp(toNumber(props.location_text_size_px, 12), 10, 24)
    const phoneIconBackgroundStyle = resolveBackgroundStyle(normalizeDecorativeColorValue(props.phone_icon_bg_color, '#ffffff'), '#ffffff')
    const badgeBackgroundStyle = resolveBackgroundStyle(normalizeDecorativeColorValue(props.badge_bg_color, '#ffffff'), '#ffffff')

    const phoneNumber = typeof props.phone_number === 'string' && props.phone_number.trim() ? props.phone_number : siteConfig.phone
    const sanitizedPhoneNumber = phoneNumber.replace(/[^\d+]/g, '')
    const shouldShowPhoneIcon = props.show_phone_icon !== false && sanitizedPhoneNumber.length > 0

    const blobScale = clamp(toNumber(props.decorative_blob_size_scale, 1), 0.5, 2.5)
    const outlineScale = clamp(toNumber(props.decorative_outline_size_scale, 1), 0.5, 2.5)
    const legacyOffsetX = toNumber(props.decorative_shape_offset_x, 0)
    const legacyOffsetY = toNumber(props.decorative_shape_offset_y, 0)
    const topShapeOffsetX = clamp(toNumber(props.decorative_shape_top_offset_x, legacyOffsetX), -200, 200)
    const topShapeOffsetY = clamp(toNumber(props.decorative_shape_top_offset_y, legacyOffsetY), -200, 200)

    const badgeTextSizeDesktop = clamp(toNumber(props.badge_text_size_px, 14), 10, 32)
    const badgeTextSizeMobile = clamp(Math.round(badgeTextSizeDesktop * 0.8), 10, 24)
    const badgeStarCount = clamp(Math.round(toNumber(props.badge_star_count, 5)), 0, 10)
    const headingTextSizeDesktop = clamp(toNumber(props.heading_text_size_px, 56), 24, 96)
    const headingTextSizeMobile = clamp(Math.round(headingTextSizeDesktop * 0.62), 24, 64)
    const descriptionTextSizeDesktop = clamp(toNumber(props.description_text_size_px, 20), 12, 36)
    const descriptionTextSizeMobile = clamp(Math.round(descriptionTextSizeDesktop * 0.75), 12, 24)
    const trustValueTextSizeDesktop = clamp(toNumber(props.trust_value_text_size_px, 20), 12, 36)
    const trustValueTextSizeMobile = clamp(toNumber(props.mobile_trust_value_text_size_px, Math.round(trustValueTextSizeDesktop * 0.7)), 10, 24)
    const trustLabelTextSizeDesktop = clamp(toNumber(props.trust_label_text_size_px, 12), 8, 24)
    const trustLabelTextSizeMobile = clamp(toNumber(props.mobile_trust_label_text_size_px, Math.round(trustLabelTextSizeDesktop * 0.67)), 7, 16)
    const phoneIconSize = clamp(toNumber(props.phone_icon_size_px, 16), 12, 30)
    const phoneIconButtonSize = clamp(toNumber(props.phone_icon_button_size_px, 44), 36, 72)

    const heroImageSize = props.hero_image_size === 'large' || props.hero_image_size === 'small' ? props.hero_image_size : 'medium'
    const heroImageFrameColor = normalizeDecorativeColorValue(props.hero_image_frame_bg_color, '#ffffff')
    const resolvedHeroImageFrameColor = resolveColorToken(heroImageFrameColor, '#ffffff') || '#ffffff'
    const heroImageFrameStyle: CSSProperties = { ...resolveBackgroundStyle(heroImageFrameColor, resolvedHeroImageFrameColor), borderColor: resolvedHeroImageFrameColor }

    const statConfigs = {
        desktop: stats.map((stat) => getHeroStatConfig(stat, trustValueTextColor, trustLabelTextColor, trustValueTextSizeDesktop, trustValueTextSizeMobile, trustLabelTextSizeDesktop, trustLabelTextSizeMobile)),
        mobileTop: getHeroStatConfig(stats[0], trustValueTextColor, trustLabelTextColor, trustValueTextSizeDesktop, trustValueTextSizeMobile, trustLabelTextSizeDesktop, trustLabelTextSizeMobile),
        mobileRight: getHeroStatConfig(stats[1], trustValueTextColor, trustLabelTextColor, trustValueTextSizeDesktop, trustValueTextSizeMobile, trustLabelTextSizeDesktop, trustLabelTextSizeMobile),
        mobileBottom: getHeroStatConfig(stats[2], trustValueTextColor, trustLabelTextColor, trustValueTextSizeDesktop, trustValueTextSizeMobile, trustLabelTextSizeDesktop, trustLabelTextSizeMobile),
    }

    return {
        sectionStyle,
        accentColor,
        badgeBackgroundStyle,
        badgeStarColor,
        badgeStars: Array.from({ length: badgeStarCount }),
        badgeTextColor,
        badgeTextSizeDesktop,
        badgeTextSizeMobile,
        blobScale,
        decorativeOutlineColor,
        descriptionTextColor,
        descriptionTextSizeDesktop,
        descriptionTextSizeMobile,
        headingLine1Color,
        headingLine2Color,
        headingTextSizeDesktop,
        headingTextSizeMobile,
        heroImageFrameStyle,
        heroImageSize,
        locationCardBackgroundStyle,
        locationMapIconColor,
        locationMobileCtaText,
        locationSubtext,
        locationTextColor,
        locationTextSize,
        locationTitleText,
        phoneIconBackgroundStyle,
        phoneIconButtonSize,
        phoneIconColor,
        phoneIconSize,
        resolvedLocationMapLink,
        sanitizedPhoneNumber,
        sectionTextColor,
        shouldShowBadgeStars: props.show_badge_stars !== false && badgeStarCount > 0,
        shouldShowPhoneIcon,
        statConfigs,
        topShapeOffsetX,
        topShapeOffsetY,
        outlineScale,
    }
}
