import { BlockTypeSchema } from "@/types/schema.types";

export const adoptionProcessBlocks: BlockTypeSchema[] = [
    {
        type: 'process_step',
        label: 'Process Step',
        icon: 'ListChecks',
        limit: 10,
        titleField: 'title',
        schema: [
            { key: 'step_number', label: 'Step Number', type: 'number', default: 1 },
            { key: 'title', label: 'Title', type: 'text', placeholder: 'Pick Your Breed' },
            { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Explore available breeds and talk to our team.' },
            { key: 'icon', label: 'Icon', type: 'select', options: ['Search', 'MessageCircle', 'Phone', 'Heart', 'Truck', 'Home'] },
            { key: 'color', label: 'Icon Color', type: 'color', default: '#ea728c' },
        ],
    },
];
