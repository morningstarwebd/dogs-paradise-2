'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidateTag, revalidatePath } from 'next/cache'
import { sanitizeContent } from '@/lib/content-pipeline'
import * as Sentry from '@sentry/nextjs'
import { logAuditEntry } from './audit'
import { isAdminAllowed } from '@/lib/admin-whitelist'

type ActionResult<T = null> = { success: true; data: T } | { success: false; error: string }

function revalidatePages(slug?: string) {
    // @ts-expect-error Next.js 16.1 canary types issue
    revalidateTag('pages')
    if (slug) {
        // @ts-expect-error Next.js 16.1 canary types issue
        revalidateTag(`page-${slug}`)
    }
    revalidatePath('/sitemap.xml', 'page')
}

// ─── Save Page (Create or Update) ───────────────────────────────
export async function savePage(
    payload: {
        title: string
        slug: string
        content: string
        published: boolean
        meta_title?: string
        meta_description?: string
    },
    existingId?: string,
    expectedVersion?: number,
): Promise<ActionResult> {
    try {
        if (!payload.title.trim() || !payload.slug.trim()) {
            return { success: false, error: 'Title and slug are required' }
        }

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !(await isAdminAllowed(user.email || ''))) {
            return { success: false, error: 'Unauthorized' }
        }

        const sanitizedPayload = {
            ...payload,
            content: sanitizeContent(payload.content),
            updated_at: new Date().toISOString(),
        }


        if (existingId) {
            let query = supabase
                .from('pages')
                .update(sanitizedPayload)
                .eq('id', existingId)

            if (expectedVersion !== undefined) {
                query = query.eq('version', expectedVersion)
            }

            const { error } = await query.select('version').single()

            if (error) {
                if (error.code === 'PGRST116' && expectedVersion !== undefined) {
                    return { success: false, error: 'CONFLICT: This page was modified by another user. Please refresh and try again.' }
                }
                Sentry.captureException(error)
                return { success: false, error: error.message }
            }
        } else {
            const { error } = await supabase
                .from('pages')
                .insert(sanitizedPayload)

            if (error) {
                Sentry.captureException(error)
                return { success: false, error: error.message }
            }
        }

        revalidatePages(payload.slug)
        logAuditEntry({ entityType: 'page', entityId: existingId || payload.slug, action: existingId ? 'update' : 'create', summary: `${existingId ? 'Updated' : 'Created'}: ${payload.title}` })
        return { success: true, data: null }
    } catch (err) {
        Sentry.captureException(err)
        return { success: false, error: 'Unexpected error saving page' }
    }
}

// ─── Delete Page ─────────────────────────────────────────────────
export async function deletePage(id: string): Promise<ActionResult> {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !(await isAdminAllowed(user.email || ''))) {
            return { success: false, error: 'Unauthorized' }
        }
        const { error } = await supabase.from('pages').delete().eq('id', id)

        if (error) {
            Sentry.captureException(error)
            return { success: false, error: error.message }
        }

        revalidatePages()
        logAuditEntry({ entityType: 'page', entityId: id, action: 'delete', summary: 'Page deleted' })
        return { success: true, data: null }
    } catch (err) {
        Sentry.captureException(err)
        return { success: false, error: 'Unexpected error deleting page' }
    }
}

// ─── Toggle Page Published ───────────────────────────────────────
export async function togglePagePublished(
    id: string,
    published: boolean,
    slug?: string,
): Promise<ActionResult> {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !(await isAdminAllowed(user.email || ''))) {
            return { success: false, error: 'Unauthorized' }
        }
        const { error } = await supabase
            .from('pages')
            .update({ published })
            .eq('id', id)

        if (error) {
            Sentry.captureException(error)
            return { success: false, error: error.message }
        }

        revalidatePages(slug)
        logAuditEntry({ entityType: 'page', entityId: id, action: 'toggle', summary: `Published set to ${published}` })
        return { success: true, data: null }
    } catch (err) {
        Sentry.captureException(err)
        return { success: false, error: 'Unexpected error toggling page' }
    }
}
