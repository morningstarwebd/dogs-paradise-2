import { BlockTypeSchema } from "@/types/schema.types";

export const breedExplorerCardBlocks: BlockTypeSchema[] = [
    {
        type: 'breed_card',
        label: 'Breed Card',
        icon: 'Image',
        limit: 24,
        titleField: 'title',
        previewImageField: 'image',
        schema: [
            { key: 'title', label: 'Breed Name', type: 'text', placeholder: 'Golden Retriever' },
            { key: 'url', label: 'Card URL', type: 'text', placeholder: '/breeds/golden-retriever' },
            { key: 'image', label: 'Card Image', type: 'image' },
            { key: 'gender', label: 'Gender', type: 'select', options: ['male', 'female'] },
            { key: 'is_best_seller', label: 'Best Seller Badge', type: 'toggle', default: false },
            { key: 'badge_text', label: 'Badge Text', type: 'text', placeholder: 'Best Seller' },
        ],
    },
];
