import type { ComponentType } from 'react'

export type RawBlock = {
    id?: string
    type?: string
    settings?: Record<string, unknown>
}

export type IconComponent = ComponentType<{ size?: number; className?: string }>

export type HotspotItem = {
    id: string
    icon: IconComponent
    title: string
    shortDesc: string
    fullDesc: string
    color: string
    x: number
    y: number
}

export type TrustItem = {
    id: string
    label: string
    icon: IconComponent
}

export type ImageHotspotProps = {
    badge_text?: string
    badge_text_size_px?: number | string
    heading?: string
    heading_highlight?: string
    heading_suffix?: string
    heading_text_size_px?: number | string
    subheading?: string
    description_text_size_px?: number | string
    base_image?: string
    blocks?: RawBlock[]
    section_bg_color?: string
    section_text_color?: string
    decorative_blob_enabled?: boolean
    decorative_blob_color?: string
    decorative_blob_size_scale?: number | string
    decorative_shape_top_offset_x?: number | string
    decorative_shape_top_offset_y?: number | string
    decorative_shape_bottom_offset_x?: number | string
    decorative_shape_bottom_offset_y?: number | string
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
