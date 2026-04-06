import { BlockTypeSchema } from "@/types/schema.types";

export const headerBlocks: BlockTypeSchema[] = [
    {
        type: 'header_brand',
        label: 'Logo / Brand',
        icon: 'Image',
        limit: 1,
        titleField: 'logo_text',
        schema: [
            { key: 'logo_image', label: 'Logo Image', type: 'image' },
            { key: 'logo_text', label: 'Brand Name (Text Fallback)', type: 'text', placeholder: 'Brand Name' },
        ],
    },
    {
        type: 'header_nav_link',
        label: 'Navigation Link',
        icon: 'MousePointerClick',
        titleField: 'label',
        schema: [
            { key: 'label', label: 'Label', type: 'text', placeholder: 'Menu Label', default: 'Home' },
            { key: 'url', label: 'URL', type: 'text', placeholder: '/path', default: '/' },
        ],
    },
];
