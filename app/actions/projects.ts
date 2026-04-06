'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidateTag, revalidatePath } from 'next/cache'
import * as Sentry from '@sentry/nextjs'
import { logAuditEntry } from './audit'
import { isAdminAllowed } from '@/lib/admin-whitelist'

type ActionResult<T = null> = { success: true; data: T } | { success: false; error: string }

function revalidateProjects(slug?: string) {
    // @ts-expect-error Next.js 16.1 canary types issue
    revalidateTag('projects')
    if (slug) {
        // @ts-expect-error Next.js 16.1 canary types issue
        revalidateTag(`project-${slug}`)
    }
    revalidatePath('/sitemap.xml', 'page')
}

// ─── Save Project (Create or Update) ────────────────────────────
export async function saveProject(
    payload: {
        title: string
        slug: string
        description: string | null
        long_description: string | null
        category: string | null
        tags: string[] | null
        cover_image: string | null
        live_url: string | null
        github_url: string | null
        featured: boolean | null
        sort_order: number | null
    },
    existingId?: string,
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

        if (existingId) {
            const { error } = await supabase
                .from('projects')
                .update(payload)
                .eq('id', existingId)

            if (error) {
                Sentry.captureException(error)
                return { success: false, error: error.message }
            }
        } else {
            const { error } = await supabase
                .from('projects')
                .insert(payload)

            if (error) {
                Sentry.captureException(error)
                return { success: false, error: error.message }
            }
        }

        revalidateProjects(payload.slug)
        logAuditEntry({ entityType: 'project', entityId: existingId || payload.slug, action: existingId ? 'update' : 'create', summary: `${existingId ? 'Updated' : 'Created'}: ${payload.title}` })
        return { success: true, data: null }
    } catch (err) {
        Sentry.captureException(err)
        return { success: false, error: 'Unexpected error saving project' }
    }
}

// ─── Delete Project ──────────────────────────────────────────────
export async function deleteProject(id: string): Promise<ActionResult> {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !(await isAdminAllowed(user.email || ''))) {
            return { success: false, error: 'Unauthorized' }
        }
        const { error } = await supabase.from('projects').delete().eq('id', id)

        if (error) {
            Sentry.captureException(error)
            return { success: false, error: error.message }
        }

        revalidateProjects()
        logAuditEntry({ entityType: 'project', entityId: id, action: 'delete', summary: 'Project deleted' })
        return { success: true, data: null }
    } catch (err) {
        Sentry.captureException(err)
        return { success: false, error: 'Unexpected error deleting project' }
    }
}
