import { BlockTypeSchema } from "@/types/schema.types";

export const trustBadgeBlocks: BlockTypeSchema[] = [
    {
        type: 'trust_badge',
        label: 'Trust Badge',
        icon: 'ShieldCheck',
        limit: 12,
        titleField: 'title',
        schema: [
            { key: 'title', label: 'Title', type: 'text', placeholder: 'KCI Guidance' },
            { key: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'Breeding best practices' },
            { key: 'icon', label: 'Icon', type: 'select', options: ['ShieldCheck', 'Stethoscope', 'FileCheck', 'Award', 'BadgeCheck', 'Star'] },
            { key: 'color', label: 'Icon Color', type: 'color', default: '#ea728c' },
        ],
    },
];
