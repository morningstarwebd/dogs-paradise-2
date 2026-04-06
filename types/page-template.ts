export interface PageTemplateSettings {
    layout?: {
        type?: 'two-column' | 'single-column'
        gallery_position?: 'left' | 'right'
        sticky_sidebar?: boolean
    }
    sections?: {
        back_button?: { visible?: boolean; text?: string }
        image_gallery?: { visible?: boolean; max_thumbnails?: number; show_status_badge?: boolean }
        details_card?: { visible?: boolean }
        about_section?: { visible?: boolean; title?: string }
        characteristics?: { visible?: boolean; title?: string; columns?: number }
        health_info?: { visible?: boolean; title?: string }
        faq_section?: { visible?: boolean; title?: string; sticky?: boolean }
    }
    styling?: {
        card_style?: 'glass' | 'solid' | 'minimal'
        border_radius?: 'none' | 'md' | 'xl' | '2xl' | '3xl'
        accent_color?: 'purple' | 'blue' | 'pink' | 'gold'
        show_gradients?: boolean
    }
}

export const DEFAULT_PRODUCT_TEMPLATE_SETTINGS: PageTemplateSettings = {
    layout: {
        type: 'two-column',
        gallery_position: 'left',
        sticky_sidebar: true,
    },
    sections: {
        back_button: { visible: true, text: 'Back to all dogs' },
        image_gallery: { visible: true, max_thumbnails: 4, show_status_badge: true },
        details_card: { visible: true },
        about_section: { visible: true, title: 'About the {breed}' },
        characteristics: { visible: true, title: 'Temperament & Characteristics', columns: 3 },
        health_info: { visible: true, title: 'Health & Vaccinations' },
        faq_section: { visible: true, title: 'Frequently Asked Questions', sticky: true },
    },
    styling: {
        card_style: 'glass',
        border_radius: '2xl',
        accent_color: 'purple',
        show_gradients: true,
    },
}

export function mergeProductTemplateSettings(
    incoming: PageTemplateSettings | null | undefined
): PageTemplateSettings {
    const source = incoming || {}
    return {
        layout: {
            ...DEFAULT_PRODUCT_TEMPLATE_SETTINGS.layout,
            ...(source.layout || {}),
        },
        sections: {
            back_button: {
                ...DEFAULT_PRODUCT_TEMPLATE_SETTINGS.sections?.back_button,
                ...(source.sections?.back_button || {}),
            },
            image_gallery: {
                ...DEFAULT_PRODUCT_TEMPLATE_SETTINGS.sections?.image_gallery,
                ...(source.sections?.image_gallery || {}),
            },
            details_card: {
                ...DEFAULT_PRODUCT_TEMPLATE_SETTINGS.sections?.details_card,
                ...(source.sections?.details_card || {}),
            },
            about_section: {
                ...DEFAULT_PRODUCT_TEMPLATE_SETTINGS.sections?.about_section,
                ...(source.sections?.about_section || {}),
            },
            characteristics: {
                ...DEFAULT_PRODUCT_TEMPLATE_SETTINGS.sections?.characteristics,
                ...(source.sections?.characteristics || {}),
            },
            health_info: {
                ...DEFAULT_PRODUCT_TEMPLATE_SETTINGS.sections?.health_info,
                ...(source.sections?.health_info || {}),
            },
            faq_section: {
                ...DEFAULT_PRODUCT_TEMPLATE_SETTINGS.sections?.faq_section,
                ...(source.sections?.faq_section || {}),
            },
        },
        styling: {
            ...DEFAULT_PRODUCT_TEMPLATE_SETTINGS.styling,
            ...(source.styling || {}),
        },
    }
}
