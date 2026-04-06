import { BlockTypeSchema } from "@/types/schema.types";

export const statsCounterBlocks: BlockTypeSchema[] = [
    {
        type: 'stat_item',
        label: 'Stat Item',
        icon: 'BarChart3',
        limit: 12,
        titleField: 'label',
        schema: [
            { key: 'value', label: 'Value', type: 'text', placeholder: '12+' },
            { key: 'label', label: 'Label', type: 'text', placeholder: 'Years Experience' },
            { key: 'icon', label: 'Icon', type: 'select', options: ['Award', 'Users', 'Dog', 'Heart', 'Star', 'ShieldCheck'] },
            { key: 'color', label: 'Icon Color', type: 'color', default: '#ea728c' },
        ],
    },
];
