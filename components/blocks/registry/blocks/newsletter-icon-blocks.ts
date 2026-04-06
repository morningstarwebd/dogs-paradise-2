import { BlockTypeSchema } from "@/types/schema.types";

export const newsletterIconBlocks: BlockTypeSchema[] = [
    {
        type: 'newsletter_icon',
        label: 'Newsletter Icon',
        icon: 'ShieldCheck',
        limit: 6,
        titleField: 'icon',
        schema: [
            { key: 'icon', label: 'Icon', type: 'select', options: ['Bell', 'Gift', 'Send'] },
            { key: 'bg_color', label: 'Background Color', type: 'color', default: '#f3e8ff' },
            { key: 'icon_color', label: 'Icon Color', type: 'color', default: '#7c3aed' },
            { key: 'is_featured', label: 'Featured Icon', type: 'toggle', default: false },
        ],
    },
];
