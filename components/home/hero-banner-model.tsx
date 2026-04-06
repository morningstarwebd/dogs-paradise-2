import type { CSSProperties, ReactNode } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useInView } from 'motion/react'
import { Award, Dog, Heart, MapPin, Phone, Shield, Star, Users } from 'lucide-react'
import { siteConfig } from '@/data/site-config'
import type { BlockInstance } from '@/types/schema.types'
import { STORAGE_ONLY_IMAGE_PLACEHOLDER, toStorageOnlyImage } from '@/lib/storage-only-images'
import { getHeroBannerDerived } from './hero-banner-derived'

export type HeroBannerProps = {
    sectionId?: string
    isEditorMode?: boolean
    badge_text?: string
    badge_bg_color?: string
    badge_text_color?: string
    show_badge_stars?: boolean
    badge_star_count?: number | string
    badge_star_color?: string
    badge_text_size_px?: number | string
    heading_line1?: string
    heading_line1_color?: string
    heading_highlight?: string
    accent_color?: string
    heading_line2?: string
    heading_line2_color?: string
    heading_text_size_px?: number | string
    description?: string
    description_text_color?: string
    description_text_size_px?: number | string
    slideshow_speed?: number | string
    show_floating_card?: boolean
    show_trust_stats?: boolean
    show_phone_icon?: boolean
    phone_number?: string
    phone_icon_color?: string
    phone_icon_bg_color?: string
    phone_icon_size_px?: number | string
    phone_icon_button_size_px?: number | string
    trust_value_text_color?: string
    trust_value_text_size_px?: number | string
    mobile_trust_value_text_size_px?: number | string
    trust_label_text_color?: string
    trust_label_text_size_px?: number | string
    mobile_trust_label_text_size_px?: number | string
    hero_image_size?: string
    hero_image_frame_bg_color?: string
    location_map_link?: string
    location_title_text?: string
    location_subtext?: string
    location_mobile_cta_text?: string
    location_map_icon_color?: string
    location_card_bg_color?: string
    location_text_color?: string
    location_text_size_px?: number | string
    blocks?: BlockInstance[]
    hero_image?: string
    primary_btn_text?: string
    primary_btn_color?: string
    secondary_btn_text?: string
    secondary_btn_color?: string
    section_bg_color?: string
    section_text_color?: string
    decorative_blob_enabled?: boolean
    decorative_blob_color?: string
    decorative_blob_size_scale?: number | string
    decorative_shape_top_offset_x?: number | string
    decorative_shape_top_offset_y?: number | string
    decorative_shape_offset_x?: number | string
    decorative_shape_offset_y?: number | string
    decorative_outline_enabled?: boolean
    decorative_outline_color?: string
    decorative_outline_size_scale?: number | string
    section_padding_top?: string
    section_padding_bottom?: string
    section_margin_top?: string
    section_margin_bottom?: string
}

export type HeroStatConfig = {
    cardBackgroundStyle: CSSProperties
    valueTextSizeDesktop: number
    valueTextSizeMobile: number
    labelTextSizeDesktop: number
    labelTextSizeMobile: number
    valueTextColor: string
    labelTextColor: string
}

export const heroIconMap: Record<string, ReactNode> = {
    Users: <Users size={18} />,
    Dog: <Dog size={18} />,
    Award: <Award size={18} />,
    Heart: <Heart size={18} />,
    Star: <Star size={18} />,
    Shield: <Shield size={18} />,
    MapPin: <MapPin size={18} />,
    Phone: <Phone size={18} />,
}

const defaultSlides: BlockInstance[] = [
    { id: 'default-slide-1', type: 'hero_slide', settings: { image: STORAGE_ONLY_IMAGE_PLACEHOLDER, alt_text: 'Upload hero image from admin' } },
    { id: 'default-slide-2', type: 'hero_slide', settings: { image: STORAGE_ONLY_IMAGE_PLACEHOLDER, alt_text: 'Upload hero image from admin' } },
    { id: 'default-slide-3', type: 'hero_slide', settings: { image: STORAGE_ONLY_IMAGE_PLACEHOLDER, alt_text: 'Upload hero image from admin' } },
    { id: 'default-slide-4', type: 'hero_slide', settings: { image: STORAGE_ONLY_IMAGE_PLACEHOLDER, alt_text: 'Upload hero image from admin' } },
    { id: 'default-slide-5', type: 'hero_slide', settings: { image: STORAGE_ONLY_IMAGE_PLACEHOLDER, alt_text: 'Upload hero image from admin' } },
]

const defaultButtons: BlockInstance[] = [
    { id: 'default-btn-1', type: 'hero_button', settings: { text: '🐾 Browse Breeds', url: '/breeds', color: '#ea728c', text_color: '#ffffff', button_size_scale: 1, style: 'filled', open_new_tab: false } },
    { id: 'default-btn-2', type: 'hero_button', settings: { text: '💬 WhatsApp Us', url: `https://wa.me/${siteConfig.whatsappNumber}`, color: 'transparent', text_color: '#ffffff', button_size_scale: 1, style: 'outline', open_new_tab: true } },
]

const defaultStats: BlockInstance[] = [
    { id: 'default-stat-1', type: 'hero_stat', settings: { icon: 'Users', value: '2000+', label: 'Happy Families', color: '#16a34a' } },
    { id: 'default-stat-2', type: 'hero_stat', settings: { icon: 'Dog', value: '25+', label: 'Breeds', color: '#9333ea' } },
    { id: 'default-stat-3', type: 'hero_stat', settings: { icon: 'Award', value: '12+', label: 'Years', color: '#d97706' } },
    { id: 'default-stat-4', type: 'hero_stat', settings: { icon: 'Heart', value: '1500+', label: 'Puppies', color: '#dc2626' } },
]

function getHeroBannerBlocks(props: HeroBannerProps) {
    const allBlocks = Array.isArray(props.blocks) ? props.blocks : []
    const slides = allBlocks.filter((block) => block.type === 'hero_slide')
    const buttons = allBlocks.filter((block) => block.type === 'hero_button')
    const stats = allBlocks.filter((block) => block.type === 'hero_stat')
    return {
        slides: slides.length > 0 ? slides : props.hero_image ? [{ id: 'legacy-img', type: 'hero_slide', settings: { image: props.hero_image, alt_text: 'Dogs Paradise' } } as BlockInstance] : defaultSlides,
        buttons: buttons.length > 0 ? buttons : props.primary_btn_text || props.secondary_btn_text ? [
            ...(props.primary_btn_text ? [{ id: 'legacy-btn-1', type: 'hero_button', settings: { text: props.primary_btn_text, url: '/breeds', color: props.primary_btn_color || '#ea728c', text_color: '#ffffff', button_size_scale: 1, style: 'filled' } } as BlockInstance] : []),
            ...(props.secondary_btn_text ? [{ id: 'legacy-btn-2', type: 'hero_button', settings: { text: props.secondary_btn_text, url: `https://wa.me/${siteConfig.whatsappNumber}`, color: props.secondary_btn_color || 'transparent', text_color: '#ffffff', button_size_scale: 1, style: 'outline', open_new_tab: true } } as BlockInstance] : []),
        ] : defaultButtons,
        stats: stats.length > 0 ? stats : defaultStats,
    }
}

export function useHeroBannerState(props: HeroBannerProps) {
    const ref = useRef<HTMLElement | null>(null)
    const inView = useInView(ref, { once: true, margin: '-50px' })
    const [currentSlide, setCurrentSlide] = useState(0)
    const { buttons, slides, stats } = useMemo(() => getHeroBannerBlocks(props), [props])
    const speed = Number(props.slideshow_speed) || 4000

    useEffect(() => {
        if (slides.length <= 1) return
        const timer = window.setInterval(() => setCurrentSlide((current) => (current + 1) % slides.length), speed)
        return () => window.clearInterval(timer)
    }, [slides.length, speed])

    const activeImage = toStorageOnlyImage(slides[currentSlide]?.settings?.image)
    const activeAlt = (slides[currentSlide]?.settings?.alt_text as string) || 'Dogs Paradise Puppy'
    const derived = useMemo(() => getHeroBannerDerived(props, stats), [props, stats])

    return { ref, inView, currentSlide, setCurrentSlide, activeImage, activeAlt, slides, buttons, stats, ...derived }
}

export type HeroBannerState = ReturnType<typeof useHeroBannerState>
