import { BlockTypeSchema } from "@/types/schema.types";

export const faqBlocks: BlockTypeSchema[] = [
    {
        type: 'faq_item',
        label: 'FAQ Item',
        icon: 'CircleHelp',
        limit: 24,
        titleField: 'question',
        schema: [
            { key: 'question', label: 'Question', type: 'text', placeholder: 'What vaccines are included?' },
            { key: 'answer', label: 'Answer', type: 'textarea', placeholder: 'All puppies are vaccinated, dewormed, and vet-checked.' },
        ],
    },
];
