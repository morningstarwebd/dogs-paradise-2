'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidateTag, revalidatePath } from 'next/cache'
import { sanitizeContent } from '@/lib/content-pipeline'
import * as Sentry from '@sentry/nextjs'
import { logAuditEntry } from './audit'

type ActionResult<T = null> = { success: true; data: T } | { success: false; error: string }

function revalidatePosts(slug?: string) {
    // @ts-expect-error Next.js 16.1 canary types issue
    revalidateTag('posts')
    if (slug) {
        // @ts-expect-error Next.js 16.1 canary types issue
        revalidateTag(`post-${slug}`)
    }
    revalidatePath('/sitemap.xml', 'page')
}

// ─── Save Post (Create or Update) ───────────────────────────────
export async function savePost(
    payload: {
        title: string
        slug: string
        excerpt: string
        content: string
        category: string
        tags: string[]
        cover_image: string
        published: boolean
        reading_time: number
        scheduled_at: string | null
    },
    existingId?: string,
    expectedVersion?: number,
): Promise<ActionResult> {
    try {
        if (!payload.title.trim() || !payload.slug.trim()) {
            return { success: false, error: 'Title and slug are required' }
        }

        const supabase = await createClient()
        const sanitizedPayload = {
            ...payload,
            content: sanitizeContent(payload.content),
            scheduled_at: payload.scheduled_at ? new Date(payload.scheduled_at).toISOString() : null,
            updated_at: new Date().toISOString(),
        }


        if (existingId) {
            let query = supabase
                .from('blog_posts')
                .update(sanitizedPayload)
                .eq('id', existingId)

            if (expectedVersion !== undefined) {
                query = query.eq('version', expectedVersion)
            }

            const { error } = await query.select('version').single()

            if (error) {
                if (error.code === 'PGRST116' && expectedVersion !== undefined) {
                    return { success: false, error: 'CONFLICT: This post was modified by another user. Please refresh and try again.' }
                }
                Sentry.captureException(error)
                return { success: false, error: error.message }
            }
        } else {
            const { error } = await supabase
                .from('blog_posts')
                .insert(sanitizedPayload)

            if (error) {
                Sentry.captureException(error)
                return { success: false, error: error.message }
            }
        }

        revalidatePosts(payload.slug)
        logAuditEntry({ entityType: 'post', entityId: existingId || payload.slug, action: existingId ? 'update' : 'create', summary: `${existingId ? 'Updated' : 'Created'}: ${payload.title}` })
        return { success: true, data: null }
    } catch (err) {
        Sentry.captureException(err)
        return { success: false, error: 'Unexpected error saving post' }
    }
}

// ─── Delete Post ─────────────────────────────────────────────────
export async function deletePost(id: string): Promise<ActionResult> {
    try {
        const supabase = await createClient()
        const { error } = await supabase.from('blog_posts').delete().eq('id', id)

        if (error) {
            Sentry.captureException(error)
            return { success: false, error: error.message }
        }

        revalidatePosts()
        logAuditEntry({ entityType: 'post', entityId: id, action: 'delete', summary: 'Post deleted' })
        return { success: true, data: null }
    } catch (err) {
        Sentry.captureException(err)
        return { success: false, error: 'Unexpected error deleting post' }
    }
}

// ─── Toggle Post Published ───────────────────────────────────────
export async function togglePostPublished(
    id: string,
    published: boolean,
    slug?: string,
): Promise<ActionResult> {
    try {
        const supabase = await createClient()
        const { error } = await supabase
            .from('blog_posts')
            .update({ published })
            .eq('id', id)

        if (error) {
            Sentry.captureException(error)
            return { success: false, error: error.message }
        }

        revalidatePosts(slug)
        logAuditEntry({ entityType: 'post', entityId: id, action: 'toggle', summary: `Published set to ${published}` })
        return { success: true, data: null }
    } catch (err) {
        Sentry.captureException(err)
        return { success: false, error: 'Unexpected error toggling post' }
    }
}
