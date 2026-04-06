import { BlockTypeSchema } from "@/types/schema.types";

export const whyChooseBlocks: BlockTypeSchema[] = [
    {
        type: 'benefit_item',
        label: 'Benefit Item',
        icon: 'ShieldCheck',
        limit: 12,
        titleField: 'title',
        schema: [
            { key: 'title', label: 'Title', type: 'text', placeholder: 'Health First Promise' },
            { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Every pup gets complete health checks before adoption.' },
            { key: 'icon', label: 'Icon', type: 'select', options: ['ShieldCheck', 'Stethoscope', 'Award', 'Home', 'Heart', 'MessageCircle'] },
            { key: 'color', label: 'Icon Color', type: 'color', default: '#ea728c' },
        ],
    },
];
