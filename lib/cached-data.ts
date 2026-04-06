import { unstable_cache } from 'next/cache'
import { createStaticClient } from '@/lib/supabase/server'
import type { PostMeta, Post } from '@/lib/mdx'
import type { WebsiteContent } from '@/lib/website-content'
import * as Sentry from '@sentry/nextjs'

/**
 * Cached data-fetching layer for generateMetadata() and similar.
 * Uses Next.js unstable_cache with revalidation tags so that
 * admin actions can selectively invalidate specific caches.
 *
 * Default revalidation: 60 seconds (stale-while-revalidate pattern).
 */

const REVALIDATE_SECONDS = 60

// ── Blog ────────────────────────────────────────────────────────────

export const getCachedAllPosts = unstable_cache(
    async (): Promise<PostMeta[]> => {
        const supabase = createStaticClient()
        const { data } = await supabase
            .from('blog_posts')
            .select('id, title, slug, excerpt, category, tags, reading_time, created_at, cover_image, published')
            .eq('published', true)
            .order('created_at', { ascending: false })
        return data ?? []
    },
    ['all-posts'],
    { revalidate: REVALIDATE_SECONDS, tags: ['posts'] },
)

export const getCachedPostBySlug = (slug: string) =>
    unstable_cache(
        async (): Promise<Post | null> => {
            const supabase = createStaticClient()
            const { data } = await supabase
                .from('blog_posts')
                .select('*')
                .eq('slug', slug)
                .eq('published', true)
                .single()
            return data ?? null
        },
        [`post-${slug}`],
        { revalidate: REVALIDATE_SECONDS, tags: ['posts', `post-${slug}`] },
    )()

// ── Website Content / Sections ──────────────────────────────────────

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

            return data.reduce((acc, row) => {
                acc[row.section_id] = {
                    content: row.content || {},
                    isVisible: row.is_visible,
                }
                return acc
            }, {} as WebsiteContent)
        } catch (error) {
            Sentry.captureException(error)
            return {}
        }
    },
    ['website-content'],
    { revalidate: REVALIDATE_SECONDS, tags: ['website-content'] },
)

/**
 * Cached website sections in array format (for homepage SSR).
 * Uses the same 'website-content' tag so admin revalidateTag() covers this path.
 */
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
    { revalidate: REVALIDATE_SECONDS, tags: ['website-content'] }
)

// ── SEO Settings ────────────────────────────────────────────────────

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

// ── Projects ────────────────────────────────────────────────────────

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

// ── Page ────────────────────────────────────────────────────────────

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

/**
 * AI-powered related post recommendations, cached for 24 hours.
 * Calls Groq SDK directly (not via API route) to work during SSG builds.
 * Falls back to an empty array if Groq is unavailable.
 */
export const getCachedRelatedPosts = (
    currentSlug: string,
    currentTitle: string,
    currentExcerpt: string,
    candidates: Array<{ slug: string; title: string; excerpt?: string; category?: string }>
) =>
    unstable_cache(
        async () => {
            try {
                const { groq, GROQ_MODEL } = await import('@/lib/groq')
                if (!groq || candidates.length === 0) return []

                const candidateList = candidates
                    .slice(0, 15)
                    .map((c, i) => `${i + 1}. "${c.title}" [${c.category || 'General'}] — ${(c.excerpt || '').slice(0, 80)}`)
                    .join('\n')

                const completion = await groq.chat.completions.create({
                    model: GROQ_MODEL,
                    messages: [
                        { role: 'system', content: 'You are a content recommendation engine. Return ONLY valid JSON.' },
                        {
                            role: 'user',
                            content: `CURRENT: "${currentTitle}" — ${(currentExcerpt || '').slice(0, 100)}\n\nCANDIDATES:\n${candidateList}\n\nPick the 2 best "next reads". Return ONLY: { "picks": [1, 5] }`
                        },
                    ],
                    max_tokens: 50,
                    temperature: 0.3,
                })

                const raw = completion.choices[0]?.message?.content?.trim() || ''
                const jsonStr = raw.replace(/```json?\n?/g, '').replace(/```/g, '').trim()
                const parsed = JSON.parse(jsonStr)
                const picks = Array.isArray(parsed.picks) ? parsed.picks : []
                const limited = candidates.slice(0, 15)
                return picks
                    .map((p: number) => limited[p - 1]?.slug)
                    .filter(Boolean)
                    .slice(0, 2) as string[]
            } catch {
                return []
            }
        },
        [`related-${currentSlug}`],
        { revalidate: 86400, tags: ['related-posts', 'posts'] }, // 24h cache
    )()


