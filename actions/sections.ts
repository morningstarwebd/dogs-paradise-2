'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveSectionContent(id: string, content: Record<string, unknown>) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('website_sections')
        .update({ content })
        .eq('id', id)

    if (error) return { success: false, error: error.message }
    return { success: true }
}

export async function toggleSectionVisibility(id: string, visible: boolean) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('website_sections')
        .update({ is_visible: visible })
        .eq('id', id)

    if (error) return { success: false, error: error.message }
    
    revalidatePath('/')
    return { success: true }
}

export async function reorderSections(orderedSections: { id: string; sortOrder: number }[]) {
    const supabase = await createClient()

    // Using a simple loop for updates since bulk updating via RPC would require DB schema changes
    for (const section of orderedSections) {
        await supabase
            .from('website_sections')
            .update({ sort_order: section.sortOrder })
            .eq('id', section.id)
    }

    revalidatePath('/')
    return { success: true }
}

export async function addSection(sectionId: string, label: string, sortOrder: number) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('website_sections')
        .insert({
            section_id: sectionId,
            label,
            sort_order: sortOrder,
            content: {},
            is_visible: true,
            status: 'draft'
        })
        .select()
        .single()

    if (error) return { success: false, error: error.message }
    
    revalidatePath('/')
    return { success: true, data }
}

export async function deleteSection(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('website_sections')
        .delete()
        .eq('id', id)

    if (error) return { success: false, error: error.message }
    
    revalidatePath('/')
    return { success: true }
}

export async function publishSection(id: string) {
    const supabase = await createClient()
    
    const { error } = await supabase
        .from('website_sections')
        .update({ status: 'published' })
        .eq('id', id)
        
    if (error) return { success: false, error: error.message }
    
    revalidatePath('/')
    return { success: true }
}

export async function unpublishSection(id: string) {
    const supabase = await createClient()
    
    const { error } = await supabase
        .from('website_sections')
        .update({ status: 'draft' })
        .eq('id', id)
        
    if (error) return { success: false, error: error.message }
    
    revalidatePath('/')
    return { success: true }
}
