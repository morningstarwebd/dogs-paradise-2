import { createClient } from '@/lib/supabase/server'

export type WebsiteContent = Record<string, {
    content: Record<string, unknown>
    isVisible: boolean
}>

export async function getWebsiteContent(): Promise<WebsiteContent> {
    const supabase = await createClient()
    const { data } = await supabase
        .from('website_sections')
        .select('*')
        .neq('section_id', 'global_settings')
        .order('sort_order', { ascending: true })

    if (!data) return {}

    return data.reduce((acc, row) => {
        acc[row.section_id] = {
            content: row.content || {},
            isVisible: row.is_visible,
        }
        return acc
    }, {} as WebsiteContent)
}

export async function getWebsiteSections() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('website_sections')
        .select('*')
        .neq('section_id', 'global_settings')
        .order('sort_order', { ascending: true })

    if (error) {
        console.error("Supabase Error getting website sections:", error)
        throw error
    }

    return data || []
}

export async function getSeoSettings(pageSlug: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('seo_settings')
        .select('*')
        .eq('page_slug', pageSlug)
        .single()

    if (error && error.code !== 'PGRST116') {
        console.error("Supabase Error getting seo settings:", error)
    }

    return data
}

export async function getSiteFavicon(): Promise<string | null> {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('seo_settings')
        .select('favicon')
        .eq('page_slug', 'home')
        .single()

    if (error && error.code !== 'PGRST116') {
        console.error("Supabase Error getting site favicon:", error)
    }

    return data?.favicon || null
}
