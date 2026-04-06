import { BlockTypeSchema } from "@/types/schema.types";

export const imageHotspotBlocks: BlockTypeSchema[] = [
    {
        type: 'health_hotspot',
        label: 'Health Hotspot',
        icon: 'ShieldCheck',
        limit: 16,
        titleField: 'title',
        schema: [
            { key: 'title', label: 'Hotspot Title', type: 'text', placeholder: 'Eye Check' },
            { key: 'short_desc', label: 'Short Description', type: 'textarea', placeholder: 'Complete ophthalmologic examination.' },
            { key: 'full_desc', label: 'Full Description', type: 'textarea', placeholder: 'Detailed medical explanation...' },
            { key: 'icon', label: 'Icon', type: 'select', options: ['Eye', 'Ear', 'Bone', 'Heart', 'Activity', 'Shield'] },
            { key: 'color', label: 'Color', type: 'color', default: '#3b82f6' },
            { key: 'x', label: 'X Position (%)', type: 'number', default: 50 },
            { key: 'y', label: 'Y Position (%)', type: 'number', default: 50 },
        ],
    },
    {
        type: 'health_trust_item',
        label: 'Trust Strip Item',
        icon: 'ShieldCheck',
        limit: 6,
        titleField: 'label',
        schema: [
            { key: 'label', label: 'Label', type: 'text', placeholder: 'Registered Vets' },
            { key: 'icon', label: 'Icon', type: 'select', options: ['Shield', 'BadgeCheck', 'Heart'] },
        ],
    },
];
