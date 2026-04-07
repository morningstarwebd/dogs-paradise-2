// ─── Product Template Block Types ─────────────────────────────────────────

export type ProductBlockType =
    // Product-specific blocks
    | 'social_proof'
    | 'breed_header'
    | 'stats_grid'
    | 'personality_badge'
    | 'description'
    | 'image_gallery'
    | 'details_card'
    | 'about_section'
    | 'characteristics'
    | 'health_info'
    | 'faq_section'
    | 'inquiry_cta'
    | 'custom_banner'
    | 'related_breeds'
    // Homepage section blocks (reused from BlockRegistry, independent data)
    | 'homepage_section'

export interface ProductTemplateBlock {
    id: string
    type: ProductBlockType
    /** For homepage_section type, this stores the BlockRegistry key (e.g. 'hero', 'featured-dogs') */
    blockRegistryKey?: string
    visible: boolean
    /** Custom display name set by admin */
    label?: string
    settings: Record<string, unknown>
}

/** List of homepage section keys that can be added to product template */
export const HOMEPAGE_SECTION_KEYS = [
    'hero',
    'featured-dogs',
    'breed-explorer',
    'happy-stories',
    'about-preview',
    'stats-counter',
    'adoption-process',
    'call-to-action',
    'image-hotspot',
    'newsletter-cta',
    'blog-preview',
    'why-choose-us',
    'puppy-care-tips',
    'trust-badges',
    'credibility-strip',
    'instagram-feed',
] as const;

export type HomepageSectionKey = typeof HOMEPAGE_SECTION_KEYS[number];

// ─── Product Block Definition (for the admin block registry) ───────────

export interface ProductBlockDefinition {
    type: ProductBlockType
    label: string
    icon: string  // lucide icon name
    description: string
    defaultSettings: Record<string, unknown>
    settingsSchema: ProductBlockField[]
    maxInstances?: number  // if limited (e.g., only 1 image_gallery)
}

export interface ProductBlockField {
    key: string
    label: string
    type: 'text' | 'textarea' | 'toggle' | 'color' | 'select' | 'number' | 'range' | 'list'
    placeholder?: string
    options?: string[]
    default?: any
    min?: number
    max?: number
    step?: number
    group?: 'content' | 'design'
}

// ─── Product Block Registry ───────────────────────────────────────────

export const PRODUCT_BLOCK_REGISTRY: ProductBlockDefinition[] = [
    {
        type: 'social_proof',
        label: 'Social Proof Bar',
        icon: 'Users',
        description: 'Shows people viewing & inquiry count',
        defaultSettings: {
            viewing_text: '{count} people inquiring today',
            show_avatars: true,
            avatar_count: 3,
        },
        settingsSchema: [
            { key: 'viewing_text', label: 'Viewing Text', type: 'text', placeholder: '{count} people inquiring today' },
            { key: 'show_avatars', label: 'Show Avatars', type: 'toggle', default: true },
            { key: 'avatar_count', label: 'Avatar Count', type: 'range', default: 3, min: 1, max: 6, step: 1 },
        ],
    },
    {
        type: 'breed_header',
        label: 'Breed Name & Title',
        icon: 'Type',
        description: 'Main breed name with certification badge',
        defaultSettings: {
            show_certification: true,
            certification_text: 'Certified Health',
            show_wishlist: true,
            title_size: 'large',
            show_price: true,
            show_variants: true,
            show_tags: true,
            show_share: true,
            primary_cta_text: 'Enquire on WhatsApp',
            secondary_cta_text: 'Add to Cart',
            whatsapp_number: '',
            phone_number: '',
            primary_btn_bg: '#25D366',
            primary_btn_text: '#ffffff',
            secondary_btn_bg: '#000000',
            secondary_btn_text: '#ffffff',
        },
        settingsSchema: [
            { key: 'show_certification', label: 'Show Certification Badge', type: 'toggle', default: true },
            { key: 'certification_text', label: 'Certification Text', type: 'text', default: 'Certified Health' },
            { key: 'show_wishlist', label: 'Show Wishlist Button', type: 'toggle', default: true },
            { key: 'title_size', label: 'Title Size', type: 'select', options: ['small', 'medium', 'large'], default: 'large' },
            { key: 'title_color', label: 'Title Color', type: 'color', default: '#111827' },
            { key: 'brand_color', label: 'Brand Name Color', type: 'color', default: '#f97316' },
        ],
    },
    {
        type: 'stats_grid',
        label: 'Quick Stats Grid',
        icon: 'BarChart3',
        description: 'Age, Gender, Weight, Lifespan stats cards',
        defaultSettings: {
            show_age: true,
            show_gender: true,
            show_weight: true,
            show_lifespan: true,
            card_style: 'outlined',
            columns: 2,
        },
        settingsSchema: [
            { key: 'show_age', label: 'Show Age', type: 'toggle', default: true },
            { key: 'show_gender', label: 'Show Gender', type: 'toggle', default: true },
            { key: 'show_weight', label: 'Show Weight', type: 'toggle', default: true },
            { key: 'show_lifespan', label: 'Show Lifespan', type: 'toggle', default: true },
            { key: 'card_style', label: 'Card Style', type: 'select', options: ['outlined', 'filled', 'minimal'], default: 'outlined' },
            { key: 'columns', label: 'Columns', type: 'select', options: ['2', '4'], default: '2' },
            { key: 'card_bg', label: 'Card Background', type: 'color', default: '#f9fafb' },
            { key: 'label_color', label: 'Label Color', type: 'color', default: '#9ca3af' },
            { key: 'value_color', label: 'Value Color', type: 'color', default: '#111827' },
            { key: 'icon_color', label: 'Icon Color', type: 'color', default: '#4b5563' },
            { key: 'icon_bg', label: 'Icon Background', type: 'color', default: '#f3f4f6' },
        ],
    },
    {
        type: 'personality_badge',
        label: 'Personality Badge',
        icon: 'Sparkles',
        description: 'Shows personality trait summary (e.g., "Divine Personality")',
        defaultSettings: {
            badge_icon: '🌟',
            badge_text: 'Divine Personality',
            show_icon: true,
        },
        settingsSchema: [
            { key: 'badge_icon', label: 'Badge Icon', type: 'text', default: '🌟' },
            { key: 'badge_text', label: 'Badge Text', type: 'text', default: 'Divine Personality' },
            { key: 'show_traits', label: 'Show Trait Tags', type: 'toggle', default: true },
            { key: 'show_db_tags', label: 'Show Database Tags (e.g. Friendly)', type: 'toggle', default: true },
            { key: 'show_smart_traits', label: 'Show Smart Traits (Auto)', type: 'toggle', default: true },
            { key: 'traits', label: 'Custom Traits (Optional)', type: 'list' },
            { key: 'show_icon', label: 'Show Icon', type: 'toggle', default: true },
            { key: 'bg_color', label: 'Background Color', type: 'color', default: '#f9fafb' },
            { key: 'text_color', label: 'Text Color', type: 'color', default: '#1f2937' },
            { key: 'border_color', label: 'Border Color', type: 'color', default: '#f3f4f6' },
        ],
    },
    {
        type: 'description',
        label: 'Breed Description',
        icon: 'FileText',
        description: 'Long breed description text',
        defaultSettings: {
            title: 'About the {breed}',
            show_title: true,
            title_color: '#FFD700',
            text_color: '#4b5563',
        },
        settingsSchema: [
            { key: 'title', label: 'Section Title', type: 'text', default: 'About the {breed}' },
            { key: 'show_title', label: 'Show Title', type: 'toggle', default: true },
            { key: 'title_color', label: 'Title Color', type: 'color', default: '#FFD700' },
            { key: 'text_color', label: 'Text Color', type: 'color', default: '#4b5563' },
        ],
    },
    {
        type: 'image_gallery',
        label: 'Image Gallery',
        icon: 'Image',
        description: 'Main image with thumbnail strip',
        maxInstances: 1,
        defaultSettings: {
            max_thumbnails: 4,
            show_status_badge: true,
            gallery_style: 'rounded',
            show_nav_arrows: true,
            aspect_ratio: '4:3',
            autoplay: false,
            autoplay_speed: 5,
        },
        settingsSchema: [
            { key: 'max_thumbnails', label: 'Max Thumbnails', type: 'range', default: 4, min: 2, max: 8, step: 1 },
            { key: 'show_thumbnails', label: 'Show Thumbnails', type: 'toggle', default: true },
            { key: 'show_status_badge', label: 'Show Status Badge', type: 'toggle', default: true },
            { key: 'gallery_style', label: 'Gallery Style', type: 'select', options: ['rounded', 'square', 'pill'], default: 'rounded' },
            { key: 'show_nav_arrows', label: 'Show Navigation Arrows', type: 'toggle', default: true },
            { key: 'aspect_ratio', label: 'Aspect Ratio', type: 'select', options: ['4:3', '3:4', '1:1', '16:9'], default: '4:3' },
            { key: 'image_fit', label: 'Image Fit', type: 'select', options: ['cover', 'contain'], default: 'cover' },
            { key: 'animation_style', label: 'Animation Style', type: 'select', options: ['cinematic', 'slide', '3d-flip', 'ken-burns', 'fade', 'v-slide', 'parallax', 'book-flip'], default: 'cinematic' },
            { key: 'reduced_motion', label: 'Reduced Motion', type: 'toggle', default: false },
            { key: 'autoplay', label: 'Enable Autoplay', type: 'toggle', default: false },
            { key: 'autoplay_speed', label: 'Autoplay Speed (seconds)', type: 'range', default: 5, min: 2, max: 15, step: 1 },
        ],
    },
    {
        type: 'details_card',
        label: 'Details & CTA Card',
        icon: 'CreditCard',
        description: 'Price, variants, WhatsApp & Cart buttons',
        maxInstances: 1,
        defaultSettings: {
            show_price: true,
            show_variants: true,
            cta_text: 'Enquire on WhatsApp',
            secondary_cta_text: 'Add to Cart',
            show_secondary_cta: true,
            show_tertiary_cta: true,
            show_tags: true,
            show_share: true,
            whatsapp_number: '',
            phone_number: '',
            primary_btn_bg: '#25D366',
            primary_btn_text: '#ffffff',
            secondary_btn_bg: '#111827',
            secondary_btn_text: '#ffffff',
            tertiary_btn_bg: '#f97316',
            tertiary_btn_text: '#ffffff',
            share_btn_bg: 'transparent',
            share_btn_text: '#9ca3af',
            share_btn_border: '#f3f4f6',
            share_btn_hover_bg: '#f9fafb',
            share_btn_hover_text: '#4b5563',
        },
        settingsSchema: [
            { key: 'show_price', label: 'Show Price', type: 'toggle', default: true },
            { key: 'show_variants', label: 'Show Variants', type: 'toggle', default: true },
            { key: 'cta_text', label: 'Primary CTA Text', type: 'text', default: 'Enquire on WhatsApp' },
            { key: 'show_secondary_cta', label: 'Show Secondary Button (Cart)', type: 'toggle', default: true },
            { key: 'secondary_cta_text', label: 'Secondary CTA Text', type: 'text', default: 'Add to Cart' },
            { key: 'show_tertiary_cta', label: 'Show Tertiary Button (Phone)', type: 'toggle', default: true },
            { key: 'tertiary_cta_text', label: 'Tertiary CTA Text', type: 'text', default: 'Call Now' },
            { key: 'whatsapp_number', label: 'WhatsApp Number', type: 'text', placeholder: 'e.g. +8801700000000' },
            { key: 'phone_number', label: 'Phone Number', type: 'text', placeholder: 'e.g. +8801700000000' },
            { key: 'show_tags', label: 'Show Tags', type: 'toggle', default: true },
            { key: 'show_share', label: 'Show Share Button', type: 'toggle', default: true },
            { key: 'primary_btn_bg', label: 'Primary Button BG', type: 'color', default: '#25D366' },
            { key: 'primary_btn_text', label: 'Primary Button Text', type: 'color', default: '#ffffff' },
            { key: 'secondary_btn_bg', label: 'Secondary Button BG', type: 'color', default: '#111827' },
            { key: 'secondary_btn_text', label: 'Secondary Button Text Color', type: 'color', default: '#ffffff' },
            { key: 'tertiary_btn_bg', label: 'Tertiary Button BG', type: 'color', default: '#f97316' },
            { key: 'tertiary_btn_text', label: 'Tertiary Button Text Color', type: 'color', default: '#ffffff' },
            { key: 'share_btn_bg', label: 'Share Button BG', type: 'color', default: 'transparent' },
            { key: 'share_btn_text', label: 'Share Button Text/Icon', type: 'color', default: '#9ca3af' },
            { key: 'share_btn_border', label: 'Share Button Border', type: 'color', default: '#f3f4f6' },
            { key: 'share_btn_hover_bg', label: 'Share Button Hover BG', type: 'color', default: '#f9fafb' },
            { key: 'share_btn_hover_text', label: 'Share Button Hover Text', type: 'color', default: '#4b5563' },
        ],
    },
    {
        type: 'about_section',
        label: 'About Section',
        icon: 'BookOpen',
        description: 'Detailed breed information',
        defaultSettings: {
            title: 'About the {breed}',
        },
        settingsSchema: [
            { key: 'title', label: 'Section Title', type: 'text', default: 'About the {breed}' },
        ],
    },
    {
        type: 'characteristics',
        label: 'Characteristics Grid',
        icon: 'Grid3x3',
        description: 'Size, coat, energy, training traits',
        defaultSettings: {
            title: 'Temperament & Characteristics',
            columns: 3,
            show_icons: true,
            card_style: 'outlined',
        },
        settingsSchema: [
            { key: 'title', label: 'Section Title', type: 'text', default: 'Temperament & Characteristics' },
            { key: 'columns', label: 'Grid Columns', type: 'select', options: ['2', '3', '4'], default: '3' },
            { key: 'show_icons', label: 'Show Icons', type: 'toggle', default: true },
            { key: 'card_style', label: 'Card Style', type: 'select', options: ['outlined', 'filled', 'minimal'], default: 'outlined' },
        ],
    },
    {
        type: 'health_info',
        label: 'Health & Vaccinations',
        icon: 'HeartPulse',
        description: 'Vaccination and health check status',
        defaultSettings: {
            title: 'Health & Vaccinations',
            card_style: 'glass',
        },
        settingsSchema: [
            { key: 'title', label: 'Section Title', type: 'text', default: 'Health & Vaccinations' },
            { key: 'card_style', label: 'Card Style', type: 'select', options: ['glass', 'solid', 'minimal'], default: 'glass' },
        ],
    },
    {
        type: 'faq_section',
        label: 'FAQ Section',
        icon: 'HelpCircle',
        description: 'Breed-specific frequently asked questions',
        defaultSettings: {
            title: 'Frequently Asked Questions',
            expand_first: false,
            accordion_style: 'bordered',
        },
        settingsSchema: [
            { key: 'title', label: 'Section Title', type: 'text', default: 'Frequently Asked Questions' },
            { key: 'show_global_faqs', label: 'Show Global FAQs', type: 'toggle', default: true },
            { key: 'faqs', label: 'Custom Global FAQs', type: 'list', default: [
              { question: 'What is the adoption process?', answer: 'Our process includes a consultation, home visit check, and welcome kit.' },
              { question: 'Do puppies come with a health guarantee?', answer: 'Yes, all puppies come with a 1-year genetic health guarantee.' }
            ] },
            { key: 'expand_first', label: 'Expand First Item', type: 'toggle', default: false },
            { key: 'accordion_style', label: 'Accordion Style', type: 'select', options: ['bordered', 'separated', 'minimal'], default: 'bordered' },
        ],
    },
    {
        type: 'inquiry_cta',
        label: 'Inquiry CTA',
        icon: 'MessageCircle',
        description: 'Contact section with WhatsApp prompt',
        defaultSettings: {
            heading: 'Interested in this {breed}?',
            subtext: 'Talk to our breed specialist on WhatsApp',
            cta_text: 'Chat Now',
            bg_color: '#f97316',
        },
        settingsSchema: [
            { key: 'heading', label: 'Heading', type: 'text', default: 'Interested in this {breed}?' },
            { key: 'subtext', label: 'Subtext', type: 'textarea', default: 'Talk to our breed specialist on WhatsApp' },
            { key: 'cta_text', label: 'CTA Text', type: 'text', default: 'Chat Now' },
            { key: 'bg_color', label: 'Background Color', type: 'color', default: '#f97316', group: 'design' },
        ],
    },
    {
        type: 'custom_banner',
        label: 'Custom Banner',
        icon: 'AlertCircle',
        description: 'Custom info/promo banner',
        defaultSettings: {
            text: 'Free delivery across India! 🚚',
            bg_color: '#eef2ff',
            text_color: '#4338ca',
            icon: '🚚',
        },
        settingsSchema: [
            { key: 'text', label: 'Banner Text', type: 'text', default: 'Free delivery across India! 🚚' },
            { key: 'icon', label: 'Banner Icon', type: 'text', default: '🚚' },
            { key: 'bg_color', label: 'Background Color', type: 'color', default: '#eef2ff', group: 'design' },
            { key: 'text_color', label: 'Text Color', type: 'color', default: '#4338ca', group: 'design' },
        ],
    },
    {
        type: 'related_breeds',
        label: 'Related Breeds',
        icon: 'Users',
        description: 'Show similar breed cards',
        maxInstances: 1,
        defaultSettings: {
            title: 'You Might Also Like',
            subtitle: 'Similar breeds that match your preference',
            max_items: 3,
        },
        settingsSchema: [
            { key: 'title', label: 'Section Title', type: 'text', default: 'You Might Also Like' },
            { key: 'subtitle', label: 'Subtitle', type: 'text', default: 'Similar breeds that match your preference' },
            { key: 'max_items', label: 'Max Items', type: 'range', default: 3, min: 2, max: 6, step: 1 },
        ],
    },
    {
        type: 'homepage_section',
        label: 'General Page Section',
        icon: 'Layout',
        description: 'Reuses a section from the homepage (Hero, CTA, etc.)',
        defaultSettings: {},
        settingsSchema: [], // Populated dynamically by the inspector
    },
]

// ─── Lookup helper (avoid O(n) scans) ─────────────────────────────

export function getProductBlockDefinition(type: ProductBlockType): ProductBlockDefinition | undefined {
    return PRODUCT_BLOCK_REGISTRY.find((def) => def.type === type);
}

// ─── Page Template Settings ───────────────────────────────────────

export interface PageTemplateSettings {
    layout?: {
        type?: 'two-column' | 'single-column'
        gallery_position?: 'left' | 'right'
        sticky_sidebar?: boolean
    }
    // NOW: ordered array of blocks (block-based like home editor)
    sections?: ProductTemplateBlock[]
    // LEGACY: structured sections object (for backward compat)
    _legacySections?: Record<string, { visible?: boolean; title?: string; columns?: number; sticky?: boolean; text?: string; max_thumbnails?: number; show_status_badge?: boolean }>
    styling?: {
        card_style?: 'glass' | 'solid' | 'minimal'
        border_radius?: 'none' | 'md' | 'xl' | '2xl' | '3xl'
        accent_color?: string
        page_bg_color?: string
        show_gradients?: boolean
        primary_color?: string
        heading_font?: string
    }
    gallery?: {
        max_thumbnails?: number
        show_status_badge?: boolean
    }
    characteristics?: {
        columns?: number
        title?: string
    }
}

// ─── Default Block List ───────────────────────────────────────

export const DEFAULT_PRODUCT_BLOCKS: ProductTemplateBlock[] = [
    { id: 'social-proof-1', type: 'social_proof', visible: true, settings: {} },
    { id: 'breed-header-1', type: 'breed_header', visible: true, settings: {} },
    { id: 'stats-grid-1', type: 'stats_grid', visible: true, settings: {} },
    { id: 'personality-1', type: 'personality_badge', visible: true, settings: {} },
    { id: 'description-1', type: 'description', visible: true, settings: {} },
    { id: 'image-gallery-1', type: 'image_gallery', visible: true, settings: {} },
    { id: 'details-card-1', type: 'details_card', visible: true, settings: {} },
    { id: 'characteristics-1', type: 'characteristics', visible: true, settings: {} },
    { id: 'health-info-1', type: 'health_info', visible: true, settings: {} },
    { id: 'faq-section-1', type: 'faq_section', visible: true, settings: {} },
    { id: 'related-breeds-1', type: 'related_breeds', visible: true, settings: {} },
]

export const DEFAULT_PRODUCT_TEMPLATE_SETTINGS: PageTemplateSettings = {
    layout: {
        type: 'two-column',
        gallery_position: 'left',
        sticky_sidebar: true,
    },
    sections: DEFAULT_PRODUCT_BLOCKS,
    styling: {
        card_style: 'solid',
        border_radius: '2xl',
        accent_color: '#f97316',
        show_gradients: true,
        primary_color: '#1a1a1a',
    },
}

// ─── Migration Helper ─────────────────────────────────────────────

/** Convert legacy static-section settings to new block array */
function migrateLegacySections(
    legacy: Record<string, { visible?: boolean; title?: string; columns?: number; sticky?: boolean; text?: string; max_thumbnails?: number; show_status_badge?: boolean }>
): ProductTemplateBlock[] {
    const blocks: ProductTemplateBlock[] = [...DEFAULT_PRODUCT_BLOCKS]

    // Map legacy keys to block types
    const legacyMap: Record<string, ProductBlockType> = {
        back_button: 'breed_header',
        image_gallery: 'image_gallery',
        details_card: 'details_card',
        about_section: 'about_section',
        characteristics: 'characteristics',
        health_info: 'health_info',
        faq_section: 'faq_section',
    }

    for (const [legacyKey, legacyValue] of Object.entries(legacy)) {
        const blockType = legacyMap[legacyKey]
        if (!blockType) continue
        const block = blocks.find((b) => b.type === blockType)
        if (block) {
            block.visible = legacyValue.visible ?? true
            block.settings = { ...block.settings }
            if (legacyValue.title) block.settings.title = legacyValue.title
            if (legacyValue.columns) block.settings.columns = legacyValue.columns
            if (legacyValue.max_thumbnails) block.settings.max_thumbnails = legacyValue.max_thumbnails
            if (legacyValue.show_status_badge != null) block.settings.show_status_badge = legacyValue.show_status_badge
        }
    }

    return blocks
}

export function mergeProductTemplateSettings(
    incoming: PageTemplateSettings | null | undefined
): PageTemplateSettings {
    const source = incoming || {}

    // Handle legacy migration: if sections is an object (not array), migrate it
    let mergedSections: ProductTemplateBlock[]
    if (Array.isArray(source.sections)) {
        mergedSections = source.sections
    } else if (source.sections && typeof source.sections === 'object' && !Array.isArray(source.sections)) {
        // Old format: { back_button: { visible: true }, ... }
        mergedSections = migrateLegacySections(source.sections as unknown as Record<string, { visible?: boolean; title?: string; columns?: number; sticky?: boolean; text?: string; max_thumbnails?: number; show_status_badge?: boolean }>)
    } else {
        mergedSections = DEFAULT_PRODUCT_BLOCKS
    }

    return {
        layout: {
            ...DEFAULT_PRODUCT_TEMPLATE_SETTINGS.layout,
            ...(source.layout || {}),
        },
        sections: mergedSections,
        styling: {
            ...DEFAULT_PRODUCT_TEMPLATE_SETTINGS.styling,
            ...(source.styling || {}),
        },
    }
}
