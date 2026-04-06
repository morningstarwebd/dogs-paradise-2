import { BlockTypeSchema } from "@/types/schema.types";

export const happyStoryBlocks: BlockTypeSchema[] = [
    {
        type: 'story_item',
        label: 'Story Item',
        icon: 'Image',
        limit: 24,
        titleField: 'author_name',
        previewImageField: 'image',
        schema: [
            { key: 'author_name', label: 'Author Name', type: 'text', placeholder: 'Rahul S.' },
            { key: 'location', label: 'Location', type: 'text', placeholder: 'Bangalore' },
            { key: 'breed', label: 'Breed', type: 'text', placeholder: 'Toy Poodle' },
            { key: 'rating', label: 'Rating', type: 'number', default: 5 },
            { key: 'text', label: 'Story Text', type: 'textarea', placeholder: 'Our puppy arrived healthy and happy...' },
            { key: 'image', label: 'Avatar Image', type: 'image' },
        ],
    },
];
