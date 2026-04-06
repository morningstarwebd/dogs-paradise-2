'use server'

import { createClient } from '@/lib/supabase/server'
import { isAdminAllowed } from '@/lib/admin-whitelist'
import { STORAGE_BUCKET, STORAGE_BUCKET_CANDIDATES, extractStoragePathFromPublicUrl } from '@/lib/storage'

const BUCKET = STORAGE_BUCKET

function isBucketNotFoundMessage(message: string): boolean {
    const lower = message.toLowerCase()
    return lower.includes('bucket') && lower.includes('not found')
}

async function resolveAvailableBucket(
    supabase: Awaited<ReturnType<typeof createClient>>,
): Promise<string> {
    for (const candidate of STORAGE_BUCKET_CANDIDATES) {
        const { error } = await supabase.storage.from(candidate).list('', { limit: 1 })
        if (!error) return candidate
        if (!isBucketNotFoundMessage(error.message)) return candidate
    }

    return BUCKET
}

export type MediaFile = {
    name: string
    fullPath: string
    publicUrl: string
    size: number
    createdAt: string
    type: string
}

export async function listMediaFiles(folder: string = ''): Promise<{ files: MediaFile[]; error?: string }> {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !(await isAdminAllowed(user.email || ''))) throw new Error('Unauthorized')
        const bucket = await resolveAvailableBucket(supabase)

        const { data, error } = await supabase.storage
            .from(bucket)
            .list(folder || undefined, {
                limit: 200,
                sortBy: { column: 'created_at', order: 'desc' },
            })

        if (error) {
            return { files: [], error: error.message }
        }

        const files: MediaFile[] = (data || [])
            .filter(item => item.name !== '.emptyFolderPlaceholder')
            .map(item => {
                const fullPath = folder ? `${folder}/${item.name}` : item.name
                const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fullPath)
                return {
                    name: item.name,
                    fullPath,
                    publicUrl: urlData.publicUrl,
                    size: (item.metadata as Record<string, unknown>)?.size as number || 0,
                    createdAt: (item.metadata as Record<string, unknown>)?.lastModified as string || item.created_at || '',
                    type: (item.metadata as Record<string, unknown>)?.mimetype as string || 'image/*',
                }
            })

        return { files }
    } catch (err) {
        return { files: [], error: err instanceof Error ? err.message : 'Unknown error' }
    }
}

export async function listMediaFolders(): Promise<{ folders: string[]; error?: string }> {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !(await isAdminAllowed(user.email || ''))) throw new Error('Unauthorized')
        const bucket = await resolveAvailableBucket(supabase)

        const { data, error } = await supabase.storage
            .from(bucket)
            .list('', { limit: 100 })

        if (error) {
            return { folders: [], error: error.message }
        }

        const folders = (data || [])
            .filter(item => item.id === null) // folders have null id
            .map(item => item.name)

        return { folders }
    } catch (err) {
        return { folders: [], error: err instanceof Error ? err.message : 'Unknown error' }
    }
}

export async function deleteMediaFile(fullPath: string): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !(await isAdminAllowed(user.email || ''))) throw new Error('Unauthorized')
        const bucket = await resolveAvailableBucket(supabase)

        // Delete from storage
        const { error } = await supabase.storage
            .from(bucket)
            .remove([fullPath])

        if (error) {
            return { success: false, error: error.message }
        }

        // Also clean up media_files table entry
        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fullPath)
        if (urlData?.publicUrl) {
            await supabase.from('media_files').delete().eq('url', urlData.publicUrl)
        }

        return { success: true }
    } catch (err) {
        return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
    }
}

/**
 * Find and remove orphan media_files entries — files not referenced
 * by any projects, blog_posts, website_sections, pages, or seo_settings.
 */
export async function cleanupOrphanMedia(): Promise<{ deleted: number; error?: string }> {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !(await isAdminAllowed(user.email || ''))) throw new Error('Unauthorized')
        const bucket = await resolveAvailableBucket(supabase)

        // Get all media URLs
        const { data: allMedia, error: mediaErr } = await supabase
            .from('media_files')
            .select('id, url')
        if (mediaErr || !allMedia) return { deleted: 0, error: mediaErr?.message }

        // Collect all referenced URLs from content tables
        const referenced = new Set<string>()

        const [projects, posts, sections, pages, seo] = await Promise.all([
            supabase.from('projects').select('cover_image'),
            supabase.from('blog_posts').select('cover_image, content'),
            supabase.from('website_sections').select('content'),
            supabase.from('pages').select('content, sections'),
            supabase.from('seo_settings').select('og_image'),
        ])

        for (const row of projects.data || []) {
            if (row.cover_image) referenced.add(row.cover_image)
        }
        for (const row of posts.data || []) {
            if (row.cover_image) referenced.add(row.cover_image)
            // Also check content for inline image URLs
            if (row.content) {
                const urls = row.content.match(/https?:\/\/[^\s"')<>]+\.(webp|png|jpg|jpeg|gif)/gi)
                urls?.forEach((u: string) => referenced.add(u))
            }
        }
        for (const row of sections.data || []) {
            const jsonStr = JSON.stringify(row.content || {})
            const urls = jsonStr.match(/https?:\/\/[^\s"')<>]+\.(webp|png|jpg|jpeg|gif)/gi)
            urls?.forEach((u: string) => referenced.add(u))
        }
        for (const row of pages.data || []) {
            const combined = JSON.stringify(row.content || '') + JSON.stringify(row.sections || [])
            const urls = combined.match(/https?:\/\/[^\s"')<>]+\.(webp|png|jpg|jpeg|gif)/gi)
            urls?.forEach((u: string) => referenced.add(u))
        }
        for (const row of seo.data || []) {
            if (row.og_image) referenced.add(row.og_image)
        }

        // Find orphans
        const orphans = allMedia.filter(m => !referenced.has(m.url))
        if (orphans.length === 0) return { deleted: 0 }

        // Delete orphan entries from media_files table
        const orphanIds = orphans.map(o => o.id)
        const { error: delErr } = await supabase
            .from('media_files')
            .delete()
            .in('id', orphanIds)

        if (delErr) return { deleted: 0, error: delErr.message }

        // Also try to delete from storage (best-effort)
        const storagePaths = orphans
            .map(o => extractStoragePathFromPublicUrl(o.url, STORAGE_BUCKET_CANDIDATES))
            .filter(Boolean) as string[]

        if (storagePaths.length > 0) {
            await supabase.storage.from(bucket).remove(storagePaths)
        }

        return { deleted: orphans.length }
    } catch (err) {
        return { deleted: 0, error: err instanceof Error ? err.message : 'Unknown error' }
    }
}
