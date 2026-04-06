'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidateTag, revalidatePath } from 'next/cache'
import * as Sentry from '@sentry/nextjs'
import { logAuditEntry } from './audit'
import { isAdminAllowed } from '@/lib/admin-whitelist'
import type { SectionData } from '@/types/schema.types'

type ActionResult<T = null> = { success: true; data: T } | { success: false; error: string }

function revalidateWebsite() {
    // @ts-expect-error Next.js 16.1 canary types issue
    revalidateTag('website-content')
    revalidatePath('/sitemap.xml', 'page')
}

// ─── Save Section Content ────────────────────────────────────────
export async function saveSectionContent(
    sectionId: string,
    content: Record<string, unknown>,
    expectedVersion?: number,
): Promise<ActionResult> {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !(await isAdminAllowed(user.email || ''))) {
            return { success: false, error: 'Unauthorized' }
        }

        // Content size governance — 500KB hard limit
        const contentSize = new TextEncoder().encode(JSON.stringify(content)).length
        if (contentSize > 512000) {
            return { success: false, error: `Content too large (${(contentSize / 1024).toFixed(0)}KB). Maximum is 500KB. Remove some items or reduce image URLs.` }
        }

        let query = supabase
            .from('website_sections')
            .update({ content, updated_at: new Date().toISOString() })
            .eq('id', sectionId)

        // Optimistic concurrency: only update if version matches
        if (expectedVersion !== undefined) {
            query = query.eq('version', expectedVersion)
        }

        const { error } = await query.select('version').single()

        if (error) {
            // PGRST116 = no rows matched (version conflict)
            if (error.code === 'PGRST116' && expectedVersion !== undefined) {
                return { success: false, error: 'CONFLICT: This section was modified by another user. Please refresh and try again.' }
            }
            Sentry.captureException(error)
            return { success: false, error: error.message }
        }

        revalidateWebsite()
        logAuditEntry({ entityType: 'section', entityId: sectionId, action: 'update', summary: 'Content updated' })
        return { success: true, data: null }
    } catch (err) {
        Sentry.captureException(err)
        return { success: false, error: 'Unexpected error saving section' }
    }
}

// ─── Toggle Section Visibility ───────────────────────────────────
export async function toggleSectionVisibility(
    sectionId: string,
    visible: boolean,
): Promise<ActionResult> {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !(await isAdminAllowed(user.email || ''))) {
            return { success: false, error: 'Unauthorized' }
        }
        const { error } = await supabase
            .from('website_sections')
            .update({ is_visible: visible })
            .eq('id', sectionId)

        if (error) {
            Sentry.captureException(error)
            return { success: false, error: error.message }
        }

        revalidateWebsite()
        logAuditEntry({ entityType: 'section', entityId: sectionId, action: 'toggle', summary: `Visibility set to ${visible}` })
        return { success: true, data: null }
    } catch (err) {
        Sentry.captureException(err)
        return { success: false, error: 'Unexpected error toggling visibility' }
    }
}

// ─── Publish Section ─────────────────────────────────────────────
export async function publishSection(sectionId: string): Promise<ActionResult> {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !(await isAdminAllowed(user.email || ''))) {
            return { success: false, error: 'Unauthorized' }
        }
        const { error } = await supabase
            .from('website_sections')
            .update({ status: 'published', updated_at: new Date().toISOString() })
            .eq('id', sectionId)

        if (error) {
            Sentry.captureException(error)
            return { success: false, error: error.message }
        }

        revalidateWebsite()
        logAuditEntry({ entityType: 'section', entityId: sectionId, action: 'publish', summary: 'Published live' })
        return { success: true, data: null }
    } catch (err) {
        Sentry.captureException(err)
        return { success: false, error: 'Unexpected error publishing section' }
    }
}

// ─── Unpublish Section (Revert to Draft) ─────────────────────────
export async function unpublishSection(sectionId: string): Promise<ActionResult> {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !(await isAdminAllowed(user.email || ''))) {
            return { success: false, error: 'Unauthorized' }
        }
        const { error } = await supabase
            .from('website_sections')
            .update({ status: 'draft', updated_at: new Date().toISOString() })
            .eq('id', sectionId)

        if (error) {
            Sentry.captureException(error)
            return { success: false, error: error.message }
        }

        revalidateWebsite()
        logAuditEntry({ entityType: 'section', entityId: sectionId, action: 'unpublish', summary: 'Reverted to draft' })
        return { success: true, data: null }
    } catch (err) {
        Sentry.captureException(err)
        return { success: false, error: 'Unexpected error unpublishing section' }
    }
}

// ─── Delete Section ──────────────────────────────────────────────
export async function deleteSection(sectionId: string): Promise<ActionResult> {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !(await isAdminAllowed(user.email || ''))) {
            return { success: false, error: 'Unauthorized' }
        }
        const { error } = await supabase
            .from('website_sections')
            .delete()
            .eq('id', sectionId)

        if (error) {
            Sentry.captureException(error)
            return { success: false, error: error.message }
        }

        revalidateWebsite()
        logAuditEntry({ entityType: 'section', entityId: sectionId, action: 'delete', summary: 'Section deleted' })
        return { success: true, data: null }
    } catch (err) {
        Sentry.captureException(err)
        return { success: false, error: 'Unexpected error deleting section' }
    }
}

// ─── Reorder Sections ────────────────────────────────────────────
export async function reorderSections(
    updates: { id: string; sortOrder: number }[],
): Promise<ActionResult> {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !(await isAdminAllowed(user.email || ''))) {
            return { success: false, error: 'Unauthorized' }
        }

        // Parallel updates for performance
        const results = await Promise.all(
            updates.map(({ id, sortOrder }) =>
                supabase
                    .from('website_sections')
                    .update({ sort_order: sortOrder })
                    .eq('id', id)
            )
        )

        const firstError = results.find(r => r.error)
        if (firstError?.error) {
            Sentry.captureException(firstError.error)
            return { success: false, error: firstError.error.message }
        }

        revalidateWebsite()
        logAuditEntry({ entityType: 'section', entityId: 'bulk', action: 'reorder', summary: `Reordered ${updates.length} sections` })
        return { success: true, data: null }
    } catch (err) {
        Sentry.captureException(err)
        return { success: false, error: 'Unexpected error reordering sections' }
    }
}

// ─── Add Section ─────────────────────────────────────────────────
export async function addSection(
    blockType: string,
    label: string,
    sortOrder: number,
): Promise<ActionResult<SectionData>> {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !(await isAdminAllowed(user.email || ''))) {
            return { success: false, error: 'Unauthorized' }
        }
        const { data, error } = await supabase
            .from('website_sections')
            .insert({
                section_id: blockType,
                block_type: blockType,
                label,
                is_visible: true,
                sort_order: sortOrder,
                content: {},
                status: 'draft',
            })
            .select()
            .single()

        if (error) {
            Sentry.captureException(error)
            return { success: false, error: error.message }
        }

        revalidateWebsite()
        logAuditEntry({ entityType: 'section', entityId: data.id, action: 'create', summary: `Added section: ${label} (${blockType})` })
        return { success: true, data: data as SectionData }
    } catch (err) {
        Sentry.captureException(err)
        return { success: false, error: 'Unexpected error adding section' }
    }
}
