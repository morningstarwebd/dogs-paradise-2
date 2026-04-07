'use server'

import { revalidateTag, revalidatePath } from 'next/cache'
import * as Sentry from '@sentry/nextjs'
import { logAuditEntry } from './audit'
import { createClient } from '@/lib/supabase/server'

type ActionResult<T = null> = { success: true; data: T } | { success: false; error: string }

function revalidateProjects(slug?: string) {
    // @ts-expect-error Next.js 16.1 canary types issue
    revalidateTag('projects')
    if (slug) {
        // @ts-expect-error Next.js 16.1 canary types issue
        revalidateTag(`project-${slug}`)
        revalidatePath(`/breeds/${slug}`, 'page')
    }
    revalidatePath('/', 'page')
    revalidatePath('/breeds', 'page')
    revalidatePath('/sitemap.xml', 'page')
}

// ─── Project Payload Type ────────────────────────────────────────
export type ProjectPayload = {
    title: string
    slug: string
    description: string | null
    long_description: string | null
    category: string | null
    tags: string[] | null
    cover_image: string | null
    images: string[] | null
    live_url: string | null
    github_url: string | null
    featured: boolean | null
    sort_order: number | null
    price: number | null
    status: 'available' | 'sold' | 'coming_soon' | 'reserved' | null
    gender: 'male' | 'female' | null
    age: string | null
    characteristics: {
        size?: 'toy' | 'small' | 'medium' | 'large' | 'giant'
        energy_level?: 'low' | 'moderate' | 'high' | 'very_high'
        coat_length?: 'short' | 'medium' | 'long' | 'double' | 'wire'
        good_with_kids?: boolean
        good_with_pets?: boolean
        apartment_friendly?: boolean
        training_difficulty?: 'easy' | 'moderate' | 'hard'
        grooming?: 'low' | 'moderate' | 'high'
        lifespan?: string
        weight?: string
        height?: string
    } | null
    health_info: {
        vaccinated?: boolean
        dewormed?: boolean
        vet_checked?: boolean
        microchipped?: boolean
        kci_registered?: boolean
        parents_certified?: boolean
    } | null
    faqs: {
        question: string
        answer: string
    }[] | null
}

// ─── Save Project (Create or Update) ────────────────────────────
export async function saveProject(
    payload: ProjectPayload,
    existingId?: string,
): Promise<ActionResult> {
    try {
        if (!payload.title.trim() || !payload.slug.trim()) {
            return { success: false, error: 'Title and slug are required' }
        }

        const supabase = await createClient()

        if (existingId) {
            // Auto-set cover_image from first image if not set
            const dataToSave = {
                ...payload,
                cover_image: payload.cover_image || (payload.images && payload.images[0]) || null
            }
            
            const { error } = await supabase
                .from('projects')
                .update(dataToSave)
                .eq('id', existingId)

            if (error) {
                Sentry.captureException(error)
                return { success: false, error: error.message }
            }
        } else {
            // Auto-set cover_image from first image if not set
            const dataToSave = {
                ...payload,
                cover_image: payload.cover_image || (payload.images && payload.images[0]) || null
            }
            
            const { error } = await supabase
                .from('projects')
                .insert(dataToSave)

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
