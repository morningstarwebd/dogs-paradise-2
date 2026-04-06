'use client'

import { getDecorativeBlobStyle } from '@/lib/decorative-color'
import { HeroBannerLayout } from './hero-banner-layout'
import { type HeroBannerProps, useHeroBannerState } from './hero-banner-model'

export default function HeroBanner({
    sectionId,
    isEditorMode,
    badge_text = 'Trusted by 2000+ Families',
    badge_bg_color = '#ffffff',
    badge_text_color = '#ea728c',
    show_badge_stars = false,
    badge_star_count = 5,
    badge_star_color = '#ea728c',
    badge_text_size_px = 14,
    heading_line1 = 'Find Your',
    heading_line1_color,
    heading_highlight = 'Perfect Puppy',
    accent_color = '#ea728c',
    heading_line2 = 'Companion',
    heading_line2_color,
    heading_text_size_px = 56,
    description = 'Healthy, home-raised puppies in Bangalore with 12+ years of trusted experience. Transparent health details, genuine breeder guidance.',
    description_text_color,
    description_text_size_px = 20,
    slideshow_speed = 4000,
    hero_image_size = 'medium',
    hero_image_frame_bg_color = '#ffffff',
    show_floating_card = true,
    location_map_link,
    location_title_text = 'Dogs Paradise Bangalore',
    location_subtext = 'Benson Town',
    location_mobile_cta_text = 'Visit Us',
    location_map_icon_color,
    location_card_bg_color = '#ffffff',
    location_text_color = '#374151',
    location_text_size_px = 12,
    show_trust_stats = true,
    show_phone_icon = true,
    phone_number,
    phone_icon_color,
    phone_icon_bg_color = '#ffffff',
    phone_icon_size_px = 16,
    phone_icon_button_size_px = 44,
    trust_value_text_color,
    trust_value_text_size_px = 20,
    mobile_trust_value_text_size_px,
    trust_label_text_color,
    trust_label_text_size_px = 12,
    mobile_trust_label_text_size_px,
    blocks,
    hero_image,
    primary_btn_text,
    primary_btn_color,
    secondary_btn_text,
    secondary_btn_color,
    section_bg_color,
    section_text_color,
    decorative_blob_enabled = true,
    decorative_blob_color = '#ea728c',
    decorative_blob_size_scale = 1,
    decorative_shape_top_offset_x = 0,
    decorative_shape_top_offset_y = 0,
    decorative_shape_offset_x = 0,
    decorative_shape_offset_y = 0,
    decorative_outline_enabled = true,
    decorative_outline_color = '#f5c842',
    decorative_outline_size_scale = 1,
    section_padding_top,
    section_padding_bottom,
    section_margin_top,
    section_margin_bottom,
}: HeroBannerProps) {
    const banner: HeroBannerProps = {
        sectionId,
        isEditorMode,
        badge_text,
        badge_bg_color,
        badge_text_color,
        show_badge_stars,
        badge_star_count,
        badge_star_color,
        badge_text_size_px,
        heading_line1,
        heading_line1_color,
        heading_highlight,
        accent_color,
        heading_line2,
        heading_line2_color,
        heading_text_size_px,
        description,
        description_text_color,
        description_text_size_px,
        slideshow_speed,
        hero_image_size,
        hero_image_frame_bg_color,
        show_floating_card,
        location_map_link,
        location_title_text,
        location_subtext,
        location_mobile_cta_text,
        location_map_icon_color,
        location_card_bg_color,
        location_text_color,
        location_text_size_px,
        show_trust_stats,
        show_phone_icon,
        phone_number,
        phone_icon_color,
        phone_icon_bg_color,
        phone_icon_size_px,
        phone_icon_button_size_px,
        trust_value_text_color,
        trust_value_text_size_px,
        mobile_trust_value_text_size_px,
        trust_label_text_color,
        trust_label_text_size_px,
        mobile_trust_label_text_size_px,
        blocks,
        hero_image,
        primary_btn_text,
        primary_btn_color,
        secondary_btn_text,
        secondary_btn_color,
        section_bg_color,
        section_text_color,
        decorative_blob_enabled,
        decorative_blob_color,
        decorative_blob_size_scale,
        decorative_shape_top_offset_x,
        decorative_shape_top_offset_y,
        decorative_shape_offset_x,
        decorative_shape_offset_y,
        decorative_outline_enabled,
        decorative_outline_color,
        decorative_outline_size_scale,
        section_padding_top,
        section_padding_bottom,
        section_margin_top,
        section_margin_bottom,
    }
    const {
        ref,
        sectionStyle,
        topShapeOffsetX,
        topShapeOffsetY,
        blobScale,
        decorativeOutlineColor,
        outlineScale,
        ...hero
    } = useHeroBannerState(banner)

    return (
        <section ref={ref} className="relative overflow-hidden" aria-label="Hero Section" style={sectionStyle}>
            {(banner.decorative_blob_enabled || banner.decorative_outline_enabled) && (
                <div className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none">
                    {banner.decorative_blob_enabled && (
                        <div
                            className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 md:w-[500px] md:h-[500px] rounded-full rounded-bl-[80px] sm:rounded-bl-[100px] md:rounded-bl-[200px]"
                            style={{
                                ...getDecorativeBlobStyle(banner.decorative_blob_color, '#ea728c'),
                                transform: `translate(${topShapeOffsetX}px, ${topShapeOffsetY}px) scale(${blobScale})`,
                                transformOrigin: 'top right',
                            }}
                        />
                    )}
                    {banner.decorative_outline_enabled && (
                        <div
                            className="absolute -top-8 -right-8 sm:-top-[16px] sm:-right-[16px] md:-top-[25px] md:-right-[25px] w-[208px] h-[208px] sm:w-[288px] sm:h-[288px] md:w-[550px] md:h-[550px] border-[3px] sm:border-[4px] rounded-full rounded-bl-[80px] sm:rounded-bl-[100px] md:rounded-bl-[200px] opacity-80"
                            style={{
                                borderColor: decorativeOutlineColor,
                                transform: `translate(${topShapeOffsetX}px, ${topShapeOffsetY}px) scale(${outlineScale})`,
                                transformOrigin: 'top right',
                            }}
                        />
                    )}
                </div>
            )}

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <HeroBannerLayout banner={banner} hero={hero} />
            </div>
        </section>
    )
}
