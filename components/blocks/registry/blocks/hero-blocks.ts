import { BlockTypeSchema } from "@/types/schema.types";

export const heroBlocks: BlockTypeSchema[] = [
    {
        type: 'hero_slide',
        label: 'Hero Slide',
        icon: 'Image',
        limit: 5,
        titleField: 'alt_text',
        previewImageField: 'image',
        schema: [
            { key: 'image', label: 'Slide Image', type: 'image', placeholder: 'Upload or paste image URL' },
            { key: 'alt_text', label: 'Alt Text', type: 'text', placeholder: 'Describe the image for accessibility' },
        ]
    },
    {
        type: 'hero_button',
        label: 'CTA Button',
        icon: 'MousePointerClick',
        limit: 3,
        titleField: 'text',
        schema: [
            { key: 'text', label: 'Button Text', type: 'text', placeholder: '🐾 Browse Breeds' },
            { key: 'text_size', label: 'Text Size', type: 'select', options: ['small', 'medium', 'large'], default: 'medium' },
            { key: 'url', label: 'Link URL', type: 'text', placeholder: '/breeds' },
            { key: 'color', label: 'Button Color', type: 'color', default: '#ea728c' },
            { key: 'text_color', label: 'Button Text Color', type: 'color', default: '#ffffff' },
            { key: 'button_size_scale', label: 'Button Size Scale', type: 'range', default: 1, min: 0.7, max: 1.6, step: 0.05 },
            { key: 'style', label: 'Button Style', type: 'select', options: ['filled', 'outline'] },
            { key: 'open_new_tab', label: 'Open in New Tab', type: 'toggle', default: false },
        ]
    },
    {
        type: 'hero_stat',
        label: 'Trust Stat',
        icon: 'BarChart3',
        limit: 6,
        titleField: 'label',
        schema: [
            { key: 'value', label: 'Stat Value', type: 'text', placeholder: '2000+' },
            { key: 'label', label: 'Stat Label', type: 'text', placeholder: 'Happy Families' },
            { key: 'icon', label: 'Icon', type: 'select', options: ['Users', 'Dog', 'Award', 'Heart', 'Star', 'Shield', 'MapPin', 'Phone'] },
            { key: 'color', label: 'Icon Color', type: 'color', default: '#16a34a' },
            { key: 'card_bg_color', label: 'Card Background', type: 'color', default: '#ffffff' },
            { key: 'value_text_color', label: 'Value Text Color', type: 'color', default: '#1f2937' },
            { key: 'label_text_color', label: 'Subtext Color', type: 'color', default: '#6b7280' },
        ]
    }
];
