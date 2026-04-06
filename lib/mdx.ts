import { createStaticClient } from '@/lib/supabase/server';
import * as Sentry from '@sentry/nextjs';

export interface PostMeta {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    category: string | null;
    tags: string[] | null;
    reading_time: number | null;
    created_at: string | null;
    cover_image: string | null;
    published: boolean | null;
}

export interface Post extends PostMeta {
    content: string | null;
    updated_at: string | null;
}

export async function getAllPosts(): Promise<PostMeta[]> {
    const supabase = createStaticClient();
    const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, category, tags, reading_time, created_at, cover_image, published')
        .eq('published', true)
        .order('created_at', { ascending: false });

    if (error) {
        Sentry.captureException(error, {
            tags: { feature: 'blog-fetch', operation: 'getAllPosts' },
        });
    }

    return data ?? [];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
    const supabase = createStaticClient();
    const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

    if (error) {
        Sentry.captureException(error, {
            tags: { feature: 'blog-fetch', operation: 'getPostBySlug' },
        });
    }

    return data ?? null;
}
