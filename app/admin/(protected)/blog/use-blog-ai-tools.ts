'use client'

import { useRef, useState } from 'react'
import { type BlogFormState } from './blog-types'
import { estimateReadingTime, slugify } from './blog-utils'

interface UseBlogAiToolsOptions {
    form: BlogFormState
    onApplyDraft: (updater: (current: BlogFormState) => BlogFormState) => void
    onOpenNewDrawer: () => void
    onShowToast: (message: string) => void
}

export function useBlogAiTools({
    form,
    onApplyDraft,
    onOpenNewDrawer,
    onShowToast,
}: UseBlogAiToolsOptions) {
    const [aiPanelOpen, setAiPanelOpen] = useState(false)
    const [aiTopic, setAiTopic] = useState('')
    const [aiKeywords, setAiKeywords] = useState('')
    const [aiTone, setAiTone] = useState('Professional')
    const [aiDraft, setAiDraft] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [seoGenerating, setSeoGenerating] = useState(false)
    const aiDraftRef = useRef<HTMLDivElement>(null)

    const generateAiDraft = async () => {
        if (!aiTopic.trim()) {
            onShowToast('Please enter a topic')
            return
        }

        setIsGenerating(true)
        setAiDraft('')

        try {
            const res = await fetch('/api/ai/blog-draft', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic: aiTopic, keywords: aiKeywords, tone: aiTone }),
            })

            if (!res.ok) throw new Error('Failed to generate draft')

            const reader = res.body?.getReader()
            if (!reader) throw new Error('No streaming response')

            const decoder = new TextDecoder()
            let fullText = ''

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                fullText += decoder.decode(value, { stream: true })
                setAiDraft(fullText)

                if (aiDraftRef.current) {
                    aiDraftRef.current.scrollTop = aiDraftRef.current.scrollHeight
                }
            }
        } catch (error: unknown) {
            onShowToast(error instanceof Error ? error.message : 'Error generating draft')
        } finally {
            setIsGenerating(false)
        }
    }

    const copyAiDraftToEditor = () => {
        const titleMatch = aiDraft.match(/^#\s+(.+)$/m)
        const metaDescriptionMatch = aiDraft.match(/Meta Description:\s*(.+)$/m)
        const title = titleMatch ? titleMatch[1].trim() : aiTopic
        const excerpt = metaDescriptionMatch ? metaDescriptionMatch[1].trim().slice(0, 160) : ''

        onOpenNewDrawer()
        setTimeout(() => {
            onApplyDraft((current) => ({
                ...current,
                title,
                slug: slugify(title),
                excerpt,
                content: aiDraft,
                reading_time: estimateReadingTime(aiDraft),
            }))
            setAiPanelOpen(false)
        }, 100)
    }

    const generateSeo = async () => {
        if (!form.content || form.content.trim().length < 50) {
            onShowToast('Add at least 50 characters of content first')
            return
        }

        setSeoGenerating(true)

        try {
            const res = await fetch('/api/ai/seo-metadata', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: form.content,
                    currentTitle: form.title || undefined,
                }),
            })

            if (!res.ok) throw new Error('Failed to generate SEO metadata')

            const data = await res.json()
            onApplyDraft((current) => ({
                ...current,
                excerpt: data.meta_description || current.excerpt,
            }))
            onShowToast('SEO metadata generated!')
        } catch (error: unknown) {
            onShowToast(error instanceof Error ? error.message : 'Error generating SEO')
        } finally {
            setSeoGenerating(false)
        }
    }

    return {
        aiDraft,
        aiDraftRef,
        aiKeywords,
        aiPanelOpen,
        aiTone,
        aiTopic,
        isGenerating,
        seoGenerating,
        copyAiDraftToEditor,
        generateAiDraft,
        generateSeo,
        setAiKeywords,
        setAiPanelOpen,
        setAiTone,
        setAiTopic,
    }
}
