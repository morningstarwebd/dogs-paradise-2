import { BlockTypeSchema } from "@/types/schema.types";

export const blogCardBlocks: BlockTypeSchema[] = [
    {
        type: 'blog_card',
        label: 'Blog Card',
        icon: 'Image',
        limit: 12,
        titleField: 'title',
        previewImageField: 'image',
        schema: [
            { key: 'title', label: 'Title', type: 'text', placeholder: 'How to choose the right puppy' },
            { key: 'excerpt', label: 'Excerpt', type: 'textarea', placeholder: 'A practical guide for first-time pet parents.' },
            { key: 'category', label: 'Category', type: 'text', placeholder: 'Care Guide' },
            { key: 'reading_time', label: 'Reading Time', type: 'text', placeholder: '5 min read' },
            { key: 'published_at', label: 'Published At', type: 'text', placeholder: 'Mar 12, 2026' },
            { key: 'url', label: 'Post URL', type: 'text', placeholder: '/blog/how-to-choose-right-puppy' },
            { key: 'image', label: 'Cover Image', type: 'image' },
            { key: 'featured', label: 'Featured Large Card', type: 'toggle', default: false },
        ],
    },
];
