import type { BlogPost } from '@/store/admin-data-store'

export interface BlogFormState {
    title: string
    slug: string
    excerpt: string
    content: string
    category: string
    tags: string[]
    cover_image: string
    published: boolean
    reading_time: number
    scheduled_at: string
}

export const EMPTY_BLOG_FORM: BlogFormState = {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [],
    cover_image: '',
    published: false,
    reading_time: 1,
    scheduled_at: '',
}

export function getBlogFormFromPost(post: BlogPost): BlogFormState {
    return {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || '',
        content: post.content || '',
        category: post.category || '',
        tags: post.tags || [],
        cover_image: post.cover_image || '',
        published: post.published || false,
        reading_time: post.reading_time || 1,
        scheduled_at: post.scheduled_at || '',
    }
}
