/**
 * Typed content interfaces for all CMS blocks.
 *
 * These replace the generic `Record<string, unknown>` content type
 * with compile-time checked interfaces derived from each block's schema.
 *
 * Usage: `BlockDefinition<HeroContent>` instead of `BlockDefinition`
 */

// ─── Hero Block ──────────────────────────────────────────────────
export interface HeroContent {
    badge_text?: string
    headline_line1?: string
    headline_italic?: string
    headline_line3?: string
    description?: string
    button_primary_text?: string
    button_primary_url?: string
    button_secondary_text?: string
    button_secondary_url?: string
    bg_type?: '3d-canvas' | 'solid-color' | 'gradient' | 'image'
    canvas_model?: string
    canvas_color?: string
    canvas_bg_color?: string
    bg_color?: string
    bg_gradient_from?: string
    bg_gradient_to?: string
    bg_image?: string
    overlay_opacity?: number
    section_height?: 'fullscreen' | 'large' | 'medium' | 'small'
    alignment?: 'center' | 'left' | 'right'
    show_scroll_indicator?: boolean
    show_badge?: boolean
    title_color?: string
    italic_color?: string
    description_color?: string
    title_size?: 'default' | 'large' | 'xlarge'
    btn_primary_bg?: string
    btn_primary_text_color?: string
    btn_secondary_bg?: string
    btn_secondary_border_color?: string
    btn_style?: 'rounded-full' | 'rounded-lg' | 'rounded-none'
    // Mobile overrides
    mobile_section_height?: string
    mobile_alignment?: string
    mobile_title_size?: string
    mobile_title_size_px?: number | string
    mobile_desc_size_px?: number | string
    mobile_show_badge?: boolean
    mobile_show_scroll_indicator?: boolean
    mobile_btn_style?: string
    mobile_hide_3d?: boolean
}

// ─── About Block ─────────────────────────────────────────────────
export interface AboutContent {
    tag?: string
    heading?: string
    heading_italic?: string
    description?: string
    image?: string
    image_alt?: string
    stats?: { value: string; label: string }[]
    bg_color?: string
    heading_color?: string
    italic_color?: string
    text_color?: string
    stat_color?: string
    stat_label_color?: string
    layout?: 'image-left' | 'image-right'
    image_rounded?: 'none' | 'rounded-xl' | 'rounded-3xl' | 'rounded-full'
    // Mobile
    mobile_padding_y?: string
    mobile_layout?: string
    mobile_image_position?: string
    mobile_hide_image?: boolean
    mobile_hide_stats?: boolean
}

// ─── Header Block ────────────────────────────────────────────────
export interface HeaderContent {
    brand_name?: string
    brand_logo?: string
    logo_size?: number
    nav_links?: { label: string; url: string }[]
    cta_text?: string
    cta_url?: string
    cta_bg?: string
    cta_text_color?: string
    cta_style?: string
    nav_alignment?: 'left' | 'center' | 'right'
    nav_weight?: 'normal' | 'medium' | 'semibold' | 'bold'
    desktop_padding_y?: 'compact' | 'default' | 'spacious'
    glassmorphism?: boolean
    sticky?: boolean
    bg_color?: string
    text_color?: string
    enable_global_section_bg?: boolean
    global_section_bg_color?: string
    body_bg_color?: string
    global_visual_preset?: 'custom' | 'black-gold-dust-soft' | 'black-gold-dust-rich'
    enable_gold_dust_overlay?: boolean
    gold_dust_density?: number
    gold_dust_speed?: number
    gold_dust_size?: number
    gold_dust_opacity?: number
    gold_dust_color?: string
    // Mobile
    mobile_logo_size?: number
    mobile_padding_y?: string
}

// ─── Footer Block ────────────────────────────────────────────────
export interface FooterBlock {
    type: 'Brand Details' | 'Menu' | 'Text' | 'Newsletter' | 'Social Links'
    desktop_width?: string
    brand_name?: string
    brand_description?: string
    brand_logo?: string
    logo_size?: number
    menu_title?: string
    menu_links?: { label: string; url: string }[]
    heading?: string
    body?: string
    newsletter_title?: string
    newsletter_description?: string
    button_text?: string
    button_color?: string
    button_text_color?: string
    button_size?: 'sm' | 'md' | 'lg'
    social_links?: { label: string; url: string; color?: string }[]
}

export interface FooterContent {
    blocks?: FooterBlock[]
    bg_color?: string
    bg_image?: string
    text_color?: string
    desktop_padding_y?: 'compact' | 'default' | 'spacious'
    copyright_text?: string
    created_by_text?: string
    created_by_url?: string
    show_created_by?: boolean
    bottom_links?: { label: string; url: string }[]
    show_bottom_socials?: boolean
    bottom_social_links?: { label: string; url: string; color?: string }[]
    enable_whatsapp?: boolean
    whatsapp_number?: string
    whatsapp_message?: string
    // Mobile
    mobile_blocks?: FooterBlock[]
    mobile_padding_y?: string
    mobile_center_align?: boolean
}

// ─── Services / Creative Lab Block ───────────────────────────────
export interface ServicesContent {
    heading?: string
    sub_heading?: string
    button_text?: string
    button_link?: string
    bg_color?: string
    text_color?: string
    images?: { image?: string | { url: string }; image_url?: string; link?: string }[]
    // Mobile
    mobile_disable_physics?: boolean
    mobile_card_size?: 'small' | 'medium' | 'large'
}

// ─── Testimonials Block ──────────────────────────────────────────
export interface TestimonialItem {
    name?: string
    role?: string
    company?: string
    quote?: string
    avatar_url?: string
    linkedin_url?: string
}

export interface TestimonialsContent {
    heading?: string
    heading_italic?: string
    subtitle?: string
    testimonials?: TestimonialItem[]
    bg_color?: string
    heading_color?: string
    quote_color?: string
    card_bg?: string
    card_radius?: string
    padding_y?: 'compact' | 'default' | 'spacious'
    // Mobile
    mobile_padding_y?: string
}

// ─── Featured Works Block ────────────────────────────────────────
export interface FeaturedProject {
    client_name?: string
    project_title?: string
    description?: string
    tags?: string
    image_url?: string
    card_bg_color?: string
    text_color?: string
    tag_bg_color?: string
    tag_text_color?: string
    tag_border_color?: string
    tag_hover_bg_color?: string
    tag_hover_text_color?: string
}

export interface FeaturedWorksContent {
    heading?: string
    heading_italic?: string
    subtitle?: string
    projects?: FeaturedProject[]
    bg_color?: string
    heading_color?: string
    text_color?: string
    padding_y?: 'compact' | 'default' | 'spacious'
    // Mobile
    mobile_padding_y?: string
    mobile_hide_description?: boolean
    mobile_hide_tags?: boolean
    mobile_image_aspect?: string
    mobile_use_carousel?: boolean
}

// ─── Contact Block ───────────────────────────────────────────────
export interface ContactContent {
    heading?: string
    heading_italic?: string
    subtitle?: string
    email_address?: string
    location?: string
    business_hours?: string
    form_name_label?: string
    form_email_label?: string
    form_service_label?: string
    form_service_options?: { label: string }[]
    form_budget_label?: string
    form_budget_options?: { label: string }[]
    form_message_label?: string
    form_submit_text?: string
    form_success_message?: string
    section_bg?: string
    card_bg?: string
    card_text?: string
    heading_color?: string
    italic_color?: string
    btn_color?: string
    btn_text_color?: string
    card_radius?: string
    padding_y?: 'compact' | 'default' | 'spacious'
    // Mobile
    mobile_padding_y?: string
    mobile_card_radius?: string
}

// ─── Blog Block ──────────────────────────────────────────────────
export interface BlogContent {
    heading?: string
    heading_italic?: string
    subtitle?: string
    max_posts?: number
    bg_color?: string
    heading_color?: string
    text_color?: string
    card_bg?: string
    card_radius?: string
    padding_y?: 'compact' | 'default' | 'spacious'
    show_read_link?: boolean
    // Mobile
    mobile_padding_y?: string
    mobile_card_radius?: string
    mobile_show_read_link?: boolean
    mobile_horizontal_scroll?: boolean
}

// ─── Projects Block ──────────────────────────────────────────────
export interface ProjectsContent {
    heading?: string
    heading_italic?: string
    subtitle?: string
    bg_color?: string
    heading_color?: string
    text_color?: string
    card_bg?: string
    tag_bg?: string
    tag_text?: string
    padding_y?: 'compact' | 'default' | 'spacious'
    show_view_all?: boolean
    // Mobile
    mobile_padding_y?: string
    mobile_show_view_all?: boolean
    mobile_hide_tags?: boolean
    mobile_horizontal_scroll?: boolean
}

// ─── Timeline Block ─────────────────────────────────────────────
export interface TimelineMilestone {
    year?: string
    headline?: string
    description?: string
    icon?: string
}

export interface TimelineContent {
    title?: string
    subtitle?: string
    milestones?: TimelineMilestone[]
    bg_color?: string
    heading_color?: string
    text_color?: string
    accent_color?: string
    card_bg?: string
    padding_y?: 'compact' | 'default' | 'spacious'
    // Mobile
    mobile_padding_y?: string
}

// ─── Marquee Block ───────────────────────────────────────────────
export interface MarqueeContent {
    items?: { label: string }[]
    bg_color?: string
    text_color?: string
    font_size?: 'small' | 'default' | 'large'
    speed?: number
    auto_scroll?: boolean
    show_border?: boolean
    padding_y?: 'compact' | 'default' | 'spacious'
    // Mobile
    mobile_font_size?: string
    mobile_padding_y?: string
    mobile_speed?: number
    mobile_auto_scroll?: boolean
    mobile_show_border?: boolean
}
