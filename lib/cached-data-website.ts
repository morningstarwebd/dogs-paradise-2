import { unstable_cache } from 'next/cache'
import * as Sentry from '@sentry/nextjs'
import { createStaticClient } from '@/lib/supabase/server'
import type { WebsiteContent } from '@/lib/website-content'
import { REVALIDATE_SECONDS } from './cached-data-constants'

export const getCachedWebsiteContent = unstable_cache(
    async (): Promise<WebsiteContent> => {
        try {
            const supabase = createStaticClient()
            const { data } = await supabase
                .from('website_sections')
                .select('*')
                .neq('section_id', 'global_settings')
                .eq('status', 'published')
                .order('sort_order', { ascending: true })

            if (!data) return {}

            return data.reduce((accumulator, row) => {
                accumulator[row.section_id] = {
                    content: row.content || {},
                    isVisible: row.is_visible,
                }
                return accumulator
            }, {} as WebsiteContent)
        } catch (error) {
            Sentry.captureException(error)
            return {}
        }
    },
    ['website-content'],
    { revalidate: REVALIDATE_SECONDS, tags: ['website-content'] },
)

export const getCachedWebsiteSections = unstable_cache(
    async () => {
        try {
            const supabase = createStaticClient()
            const { data, error } = await supabase
                .from('website_sections')
                .select('*')
                .neq('section_id', 'global_settings')
                .eq('status', 'published')
                .order('sort_order', { ascending: true })

            if (error) {
                Sentry.captureException(error)
                return []
            }

            return data ?? []
        } catch (error) {
            Sentry.captureException(error)
            return []
        }
    },
    ['website-sections'],
    { revalidate: REVALIDATE_SECONDS, tags: ['website-content'] },
)

export const getCachedGlobalSettings = unstable_cache(
    async () => {
        try {
            const supabase = createStaticClient()
            const { data } = await supabase
                .from('website_sections')
                .select('content')
                .eq('section_id', 'global_settings')
                .single()
            return data?.content || {}
        } catch (error) {
            Sentry.captureException(error)
            return {}
        }
    },
    ['global-settings'],
    { revalidate: REVALIDATE_SECONDS, tags: ['website-content'] },
)
