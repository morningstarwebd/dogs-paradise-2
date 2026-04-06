import { BlockTypeSchema } from "@/types/schema.types";

export const ctaButtonBlocks: BlockTypeSchema[] = [
    {
        type: 'cta_button',
        label: 'CTA Button',
        icon: 'MousePointerClick',
        limit: 4,
        titleField: 'text',
        schema: [
            { key: 'text', label: 'Text', type: 'text', placeholder: 'Chat on WhatsApp' },
            { key: 'url', label: 'URL', type: 'text', placeholder: 'https://wa.me/...' },
            { key: 'color', label: 'Button Color', type: 'color', default: '#25d366' },
            { key: 'style', label: 'Style', type: 'select', options: ['filled', 'outline'] },
            { key: 'icon', label: 'Icon (emoji/text)', type: 'text', placeholder: '💬' },
            { key: 'open_new_tab', label: 'Open in New Tab', type: 'toggle', default: false },
        ],
    },
];
