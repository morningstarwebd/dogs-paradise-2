import { unstable_cache } from 'next/cache'
import * as Sentry from '@sentry/nextjs'
import { createStaticClient } from '@/lib/supabase/server'
import { REVALIDATE_SECONDS } from './cached-data-constants'

export const getCachedSeoSettings = (pageSlug: string) =>
    unstable_cache(
        async () => {
            try {
                const supabase = createStaticClient()
                const { data } = await supabase
                    .from('seo_settings')
                    .select('*')
                    .eq('page_slug', pageSlug)
                    .single()
                return data
            } catch (error) {
                Sentry.captureException(error)
                return null
            }
        },
        [`seo-${pageSlug}`],
        { revalidate: REVALIDATE_SECONDS, tags: ['seo', `seo-${pageSlug}`] },
    )()

export const getCachedProjectBySlug = (slug: string) =>
    unstable_cache(
        async () => {
            const supabase = createStaticClient()
            const { data } = await supabase
                .from('projects')
                .select('*')
                .eq('slug', slug)
                .single()
            return data ?? null
        },
        [`project-${slug}`],
        { revalidate: REVALIDATE_SECONDS, tags: ['projects', `project-${slug}`] },
    )()

export const getCachedPageBySlug = (slug: string) =>
    unstable_cache(
        async () => {
            const supabase = createStaticClient()
            const { data } = await supabase
                .from('pages')
                .select('*')
                .eq('slug', slug)
                .eq('published', true)
                .maybeSingle()
            return data ?? null
        },
        [`page-${slug}`],
        { revalidate: REVALIDATE_SECONDS, tags: ['pages', `page-${slug}`] },
    )()
