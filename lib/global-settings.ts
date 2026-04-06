"use server";

import { createClient } from '@/lib/supabase/server';
import { isAdminAllowed } from '@/lib/admin-whitelist';

const defaultGlobalSettings = {
    animationsEnabled: true,
    animationStyle: 'fade-up' as const,
};

export async function getGlobalSettingsServer() {
    try {
        const supabase = await createClient();
        const { data } = await supabase
            .from('website_sections')
            .select('content')
            .eq('section_id', 'global_settings')
            .maybeSingle();

        if (data && data.content) {
            return {
                ...defaultGlobalSettings,
                ...(data.content as Record<string, unknown>),
            };
        }
        return defaultGlobalSettings;
    } catch {
        return defaultGlobalSettings;
    }
}

export async function updateGlobalSettingsServer(settings: Partial<{ animationsEnabled: boolean; animationStyle: string }>) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !(await isAdminAllowed(user.email || ''))) throw new Error('Unauthorized');

    // First, try to get existing
    const { data: existing } = await supabase
        .from('website_sections')
        .select('id, content')
        .eq('section_id', 'global_settings')
        .maybeSingle();

    const newContent = {
        ...(existing?.content || defaultGlobalSettings),
        ...settings,
    };

    const { error } = existing?.id
        ? await supabase
            .from('website_sections')
            .update({
                block_type: 'global_settings',
                content: newContent,
                updated_at: new Date().toISOString(),
            })
            .eq('id', existing.id)
        : await supabase
            .from('website_sections')
            .insert({
                section_id: 'global_settings',
                block_type: 'global_settings',
                label: 'Global Settings',
                is_visible: false,
                content: newContent,
                sort_order: -1,
                status: 'published',
            });

    if (error) {
        console.error('Global settings upsert error:', JSON.stringify(error));
        throw new Error('Failed to update global settings: ' + error.message);
    }

    return newContent;
}
