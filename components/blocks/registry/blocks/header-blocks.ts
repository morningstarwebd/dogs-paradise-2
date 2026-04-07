import { BlockTypeSchema } from "@/types/schema.types";

export const headerBlocks: BlockTypeSchema[] = [
    {
        type: 'header_brand',
        label: 'Logo / Brand',
        icon: 'Image',
        limit: 1,
        titleField: 'logo_text',
        schema: [
            { key: 'logo_image', label: 'Logo Image', type: 'image' },
            { key: 'show_brand_text', label: 'Show Brand Text With Logo', type: 'toggle', default: false },
            { key: 'logo_text', label: 'Brand Name (Text Fallback)', type: 'text', placeholder: 'Brand Name' },
        ],
    },
    {
        type: 'header_nav_link',
        label: 'Navigation Link',
        icon: 'MousePointerClick',
        titleField: 'label',
        schema: [
            { key: 'label', label: 'Label', type: 'text', placeholder: 'Menu Label', default: 'Home' },
            { key: 'url', label: 'URL', type: 'text', placeholder: '/path', default: '/' },
            { key: 'icon', label: 'Icon', type: 'select', options: ['none', 'Home', 'Dog', 'BookOpen', 'Info', 'Phone', 'Heart', 'Star', 'PawPrint'], default: 'none' },
            { key: 'text_color', label: 'Text Color', type: 'color' },
            { key: 'icon_color', label: 'Icon Color', type: 'color' },
            { key: 'icon_bg_color', label: 'Icon Background', type: 'color' },
            { key: 'active_bg_color', label: 'Active Card Background', type: 'color' },
            { key: 'active_text_color', label: 'Active Card Text Color', type: 'color' },
        ],
    },
];
