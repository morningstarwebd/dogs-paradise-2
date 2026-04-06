import { unstable_cache } from 'next/cache'
import { createStaticClient } from '@/lib/supabase/server'
import type { Post, PostMeta } from '@/lib/mdx'
import { REVALIDATE_SECONDS } from './cached-data-constants'

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

export const getCachedRelatedPosts = (
    currentSlug: string,
    currentTitle: string,
    currentExcerpt: string,
    candidates: Array<{ slug: string; title: string; excerpt?: string; category?: string }>,
) =>
    unstable_cache(
        async () => {
            try {
                const { groq, GROQ_MODEL } = await import('@/lib/groq')
                if (!groq || candidates.length === 0) return []

                const candidateList = candidates
                    .slice(0, 15)
                    .map((candidate, index) => `${index + 1}. "${candidate.title}" [${candidate.category || 'General'}] — ${(candidate.excerpt || '').slice(0, 80)}`)
                    .join('\n')

                const completion = await groq.chat.completions.create({
                    model: GROQ_MODEL,
                    messages: [
                        { role: 'system', content: 'You are a content recommendation engine. Return ONLY valid JSON.' },
                        {
                            role: 'user',
                            content: `CURRENT: "${currentTitle}" — ${(currentExcerpt || '').slice(0, 100)}\n\nCANDIDATES:\n${candidateList}\n\nPick the 2 best "next reads". Return ONLY: { "picks": [1, 5] }`,
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
                return picks.map((pick: number) => limited[pick - 1]?.slug).filter(Boolean).slice(0, 2) as string[]
            } catch {
                return []
            }
        },
        [`related-${currentSlug}`],
        { revalidate: 86400, tags: ['related-posts', 'posts'] },
    )()
