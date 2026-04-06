import { BlockTypeSchema } from "@/types/schema.types";

export const instagramGalleryBlocks: BlockTypeSchema[] = [
    {
        type: 'gallery_image',
        label: 'Gallery Image',
        icon: 'Image',
        limit: 40,
        titleField: 'alt_text',
        previewImageField: 'image',
        schema: [
            { key: 'image', label: 'Image', type: 'image' },
            { key: 'alt_text', label: 'Alt Text', type: 'text', placeholder: 'Puppy playtime moment' },
            { key: 'row', label: 'Row', type: 'select', options: ['top', 'bottom'] },
            { key: 'url', label: 'Optional Link', type: 'text', placeholder: 'https://instagram.com/...' },
        ],
    },
];
