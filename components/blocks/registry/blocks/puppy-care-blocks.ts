import { BlockTypeSchema } from "@/types/schema.types";

export const puppyCareBlocks: BlockTypeSchema[] = [
    {
        type: 'care_tab',
        label: 'Care Tab',
        icon: 'ListChecks',
        limit: 12,
        titleField: 'label',
        schema: [
            { key: 'tab_id', label: 'Tab ID', type: 'text', placeholder: 'feeding' },
            { key: 'label', label: 'Tab Label', type: 'text', placeholder: 'Feeding' },
            { key: 'title', label: 'Tab Title', type: 'text', placeholder: 'Nutrition & Feeding Guide' },
            { key: 'icon', label: 'Icon', type: 'select', options: ['Utensils', 'Dumbbell', 'Scissors', 'Syringe', 'Brain'] },
            { key: 'color', label: 'Tab Color', type: 'color', default: '#f59e0b' },
        ],
    },
    {
        type: 'care_tip',
        label: 'Care Tip',
        icon: 'CircleHelp',
        limit: 72,
        titleField: 'heading',
        schema: [
            { key: 'tab_id', label: 'Tab ID', type: 'text', placeholder: 'feeding' },
            { key: 'heading', label: 'Tip Heading', type: 'text', placeholder: 'Puppy Diet (2-6 months)' },
            { key: 'text', label: 'Tip Description', type: 'textarea', placeholder: 'Feed 3-4 times daily with premium puppy food.' },
        ],
    },
];
