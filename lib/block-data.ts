import { createClient } from '@/lib/supabase/server'
import * as Sentry from '@sentry/nextjs'

/**
 * Fetch the latest published blog posts for the Blog block.
 * Called server-side in page.tsx so HTML arrives pre-rendered.
 */
export async function getBlogPostsForBlock() {
    try {
        const supabase = await createClient()
        const { data } = await supabase
            .from('blog_posts')
            .select('slug, title, excerpt, category, reading_time, created_at, cover_image')
            .eq('published', true)
            .order('created_at', { ascending: false })
            .limit(3)

        return data ?? []
    } catch (error) {
        Sentry.captureException(error)
        return []
    }
}

/**
 * Fetch projects for the Projects block.
 * Called server-side in page.tsx so HTML arrives pre-rendered.
 */
export async function getProjectsForBlock() {
    try {
        const supabase = await createClient()
        const { data } = await supabase
            .from('projects')
            .select('title, category, tags, slug')
            .order('sort_order', { ascending: true })
            .limit(4)

        return data ?? []
    } catch (error) {
        Sentry.captureException(error)
        return []
    }
}
