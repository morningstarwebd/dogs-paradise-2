import { BlockTypeSchema } from "@/types/schema.types";

export const aboutActionBlocks: BlockTypeSchema[] = [
    {
        type: 'about_action',
        label: 'About CTA',
        icon: 'MousePointerClick',
        limit: 3,
        titleField: 'text',
        schema: [
            { key: 'text', label: 'Button Text', type: 'text', placeholder: 'Read My Full Story' },
            { key: 'url', label: 'Button URL', type: 'text', placeholder: '/about' },
            { key: 'style', label: 'Button Style', type: 'select', options: ['filled', 'outline'] },
            { key: 'color', label: 'Button Color', type: 'color', default: '#ea728c' },
            { key: 'text_color', label: 'Button Text Color', type: 'color', default: '#ffffff' },
            { key: 'open_new_tab', label: 'Open in New Tab', type: 'toggle', default: false },
        ],
    },
];
