'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { PageTemplateSettings } from '@/types/page-template'

export interface PageTemplate {
    id: string
    page_type: string
    label: string
    description: string | null
    settings: PageTemplateSettings
    is_active: boolean
    created_at: string
    updated_at: string
}

export async function getPageTemplate(pageType: string): Promise<PageTemplate | null> {
    const supabase = await createClient()
    
    const { data, error } = await supabase
        .from('page_templates')
        .select('*')
        .eq('page_type', pageType)
        .single()
    
    if (error) {
        console.error('Error fetching template:', error)
        return null
    }
    
    return data as PageTemplate
}

export async function getAllPageTemplates(): Promise<PageTemplate[]> {
    const supabase = await createClient()
    
    const { data, error } = await supabase
        .from('page_templates')
        .select('*')
        .order('page_type')
    
    if (error) {
        console.error('Error fetching templates:', error)
        return []
    }
    
    return data as PageTemplate[]
}

export async function updatePageTemplate(
    pageType: string, 
    settings: PageTemplateSettings
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient()
    
    const { error } = await supabase
        .from('page_templates')
        .update({ 
            settings,
            updated_at: new Date().toISOString()
        })
        .eq('page_type', pageType)
    
    if (error) {
        console.error('Error updating template:', error)
        return { success: false, error: error.message }
    }
    
    // Revalidate breed pages to apply new template
    revalidatePath('/', 'page')
    revalidatePath('/breeds/[slug]', 'page')
    revalidatePath('/breeds', 'page')
    revalidatePath('/sitemap.xml', 'page')
    
    return { success: true }
}

export async function updateTemplateSectionVisibility(
    pageType: string,
    sectionKey: string,
    visible: boolean
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient()
    
    // First get current settings
    const { data: current, error: fetchError } = await supabase
        .from('page_templates')
        .select('settings')
        .eq('page_type', pageType)
        .single()
    
    if (fetchError) {
        return { success: false, error: fetchError.message }
    }
    
    // Update the specific section
    const settings = current.settings as PageTemplateSettings
    if (!settings.sections) settings.sections = {}
    
    const sectionSettings = settings.sections[sectionKey as keyof typeof settings.sections]
    if (sectionSettings) {
        (sectionSettings as { visible?: boolean }).visible = visible
    } else {
        (settings.sections as Record<string, { visible: boolean }>)[sectionKey] = { visible }
    }
    
    // Save back
    const { error } = await supabase
        .from('page_templates')
        .update({ 
            settings,
            updated_at: new Date().toISOString()
        })
        .eq('page_type', pageType)
    
    if (error) {
        return { success: false, error: error.message }
    }
    
    revalidatePath('/breeds/[slug]', 'page')
    revalidatePath('/breeds', 'page')
    
    return { success: true }
}
