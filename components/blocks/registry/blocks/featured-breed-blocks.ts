import { BlockTypeSchema } from "@/types/schema.types";

export const featuredBreedBlocks: BlockTypeSchema[] = [
    {
        type: 'featured_breed',
        label: 'Featured Breed',
        icon: 'Image',
        limit: 24,
        titleField: 'title',
        previewImageField: 'image',
        schema: [
            { key: 'breed_search', label: '🔍 Search Breed', type: 'breed_lookup', placeholder: 'Type breed name to auto-fill...', autoFillMap: { title: 'title', url: 'url', image: 'image' } },
            { key: 'title', label: 'Breed Title', type: 'text', placeholder: 'Toy Poodle' },
            { key: 'url', label: 'Breed URL', type: 'text', placeholder: '/breeds/toy-poodle' },
            { key: 'image', label: 'Breed Image', type: 'image' },
            { key: 'accent_color', label: 'Accent Color', type: 'color', default: '#ea728c' },
            { key: 'show_badge', label: 'Show Priority Badge', type: 'toggle', default: false },
            { key: 'badge_text', label: 'Badge Text', type: 'text', placeholder: 'Best Seller' },
        ],
    },
];
