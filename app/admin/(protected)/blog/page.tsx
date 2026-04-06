'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Pencil, Trash2, Plus, Loader2, X, Eye, EyeOff, Clock, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAdminDataStore, type BlogPost } from '@/store/admin-data-store'
import { validateSlug } from '@/lib/content-pipeline'
import { savePost, deletePost as deletePostAction, togglePostPublished } from '@/app/actions/posts'

function slugify(text: string) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

function estimateReadingTime(content: string): number {
    const words = content.trim().split(/\s+/).length
    return Math.max(1, Math.ceil(words / 200))
}

const emptyPost = {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [] as string[],
    cover_image: '',
    published: false,
    reading_time: 1,
    scheduled_at: '' as string,
}

export default function AdminBlogPage() {
    const { blogPosts, setBlogPosts } = useAdminDataStore()
    const [posts, setPosts] = useState<BlogPost[]>(blogPosts || [])
    const [loading, setLoading] = useState(!blogPosts)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
    const [form, setForm] = useState(emptyPost)
    const [saving, setSaving] = useState(false)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [tagsInput, setTagsInput] = useState('')
    const [toast, setToast] = useState<string | null>(null)
    
    // AI Writer State
    const [aiPanelOpen, setAiPanelOpen] = useState(false)
    const [aiTopic, setAiTopic] = useState('')
    const [aiKeywords, setAiKeywords] = useState('')
    const [aiTone, setAiTone] = useState('Professional')
    const [aiDraft, setAiDraft] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const aiDraftRef = useRef<HTMLDivElement>(null)

    // AI SEO Generator State
    const [seoGenerating, setSeoGenerating] = useState(false)

    const supabase = createClient()
    const router = useRouter()

    const showToast = (msg: string) => {
        setToast(msg)
        setTimeout(() => setToast(null), 3000)
    }

    const fetchPosts = useCallback(async () => {
        const { data } = await supabase
            .from('blog_posts')
            .select('*')
            .order('created_at', { ascending: false })
            .range(0, 49)
        if (data) {
            setPosts(data)
            setBlogPosts(data)
        }
        setLoading(false)
    }, [supabase, setBlogPosts])

    useEffect(() => { fetchPosts() }, [fetchPosts])

    const openNewDrawer = () => {
        setEditingPost(null)
        setForm(emptyPost)
        setTagsInput('')
        setDrawerOpen(true)
    }

    const openEditDrawer = (post: BlogPost) => {
        setEditingPost(post)
        setForm({
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt || '',
            content: post.content || '',
            category: post.category || '',
            tags: post.tags || [],
            cover_image: post.cover_image || '',
            published: post.published || false,
            reading_time: post.reading_time || 1,
            scheduled_at: post.scheduled_at || '',
        })
        setTagsInput((post.tags || []).join(', '))
        setDrawerOpen(true)
    }

    const handleTitleChange = (title: string) => {
        setForm(f => ({
            ...f,
            title,
            slug: editingPost ? f.slug : slugify(title),
        }))
    }

    const handleContentChange = (content: string) => {
        setForm(f => ({
            ...f,
            content,
            reading_time: estimateReadingTime(content),
        }))
    }

    const handleSave = async () => {
        if (!form.title.trim() || !form.slug.trim()) return

        if (!validateSlug(form.slug)) {
            showToast('Error: Invalid slug format. Use only lowercase letters, numbers, and hyphens.')
            return
        }

        setSaving(true)

        const payload = {
            ...form,
            tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
            scheduled_at: form.scheduled_at ? new Date(form.scheduled_at).toISOString() : null,
            updated_at: new Date().toISOString(),
        }

        const result = await savePost(payload, editingPost?.id)
        if (!result.success) {
            showToast('Error: ' + result.error)
        } else {
            showToast(editingPost ? 'Post updated!' : 'Post created!')
        }

        setSaving(false)
        setDrawerOpen(false)
        fetchPosts()
        router.refresh()
    }

    const handleDelete = async (id: string) => {
        const result = await deletePostAction(id)
        if (!result.success) {
            showToast('Error: ' + result.error)
        } else {
            showToast('Post deleted!')
        }
        setDeleteId(null)
        fetchPosts()
        router.refresh()
    }

    const togglePublished = async (post: BlogPost) => {
        const result = await togglePostPublished(post.id, !post.published, post.slug)
        if (result.success) {
            showToast(post.published ? 'Post unpublished' : 'Post published!')
            fetchPosts()
            router.refresh()
        }
    }

    const generateAiDraft = async () => {
        if (!aiTopic.trim()) {
            showToast('Please enter a topic')
            return
        }

        setIsGenerating(true)
        setAiDraft('')
        
        try {
            const res = await fetch('/api/ai/blog-draft', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic: aiTopic,
                    keywords: aiKeywords,
                    tone: aiTone
                })
            })

            if (!res.ok) throw new Error('Failed to generate draft')
            
            const reader = res.body?.getReader()
            const decoder = new TextDecoder()
            
            if (!reader) throw new Error('No streaming response')

            let fullText = ''
            while (true) {
                const { done, value } = await reader.read()
                if (done) break
                
                fullText += decoder.decode(value, { stream: true })
                setAiDraft(fullText)
                
                // Auto-scroll
                if (aiDraftRef.current) {
                    aiDraftRef.current.scrollTop = aiDraftRef.current.scrollHeight
                }
            }
        } catch (err: unknown) {
            showToast(err instanceof Error ? err.message : 'Error generating draft')
        } finally {
            setIsGenerating(false)
        }
    }

    const copyAiDraftToEditor = () => {
        // Find title (first H1)
        const titleMatch = aiDraft.match(/^#\s+(.+)$/m)
        const title = titleMatch ? titleMatch[1].trim() : aiTopic
        
        // Find Meta Description
        const mdMatch = aiDraft.match(/Meta Description:\s*(.+)$/m)
        const excerpt = mdMatch ? mdMatch[1].trim().slice(0, 160) : ''

        openNewDrawer()
        setTimeout(() => {
            setForm(prev => ({
                ...prev,
                title,
                slug: slugify(title),
                excerpt,
                content: aiDraft,
                reading_time: estimateReadingTime(aiDraft)
            }))
            setAiPanelOpen(false)
        }, 100)
    }

    const generateSeo = async () => {
        if (!form.content || form.content.trim().length < 50) {
            showToast('Add at least 50 characters of content first')
            return
        }
        setSeoGenerating(true)
        try {
            const res = await fetch('/api/ai/seo-metadata', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: form.content,
                    currentTitle: form.title || undefined
                })
            })
            if (!res.ok) throw new Error('Failed to generate SEO metadata')
            const data = await res.json()
            setForm(f => ({
                ...f,
                excerpt: data.meta_description || f.excerpt,
            }))
            showToast('SEO metadata generated!')
        } catch (err: unknown) {
            showToast(err instanceof Error ? err.message : 'Error generating SEO')
        } finally {
            setSeoGenerating(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="animate-spin text-muted-foreground" size={32} />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Toast */}
            {toast && (
                <div className="fixed top-6 right-6 z-[100] bg-foreground text-background px-6 py-3 rounded-xl shadow-2xl text-sm font-semibold animate-in slide-in-from-top-2">
                    {toast}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold">Blog Posts</h1>
                    <p className="text-muted-foreground mt-1">{posts.length} posts total</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setAiPanelOpen(!aiPanelOpen)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors border ${
                            aiPanelOpen 
                                ? 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:text-indigo-400' 
                                : 'bg-background hover:bg-muted border-border text-foreground'
                        }`}
                    >
                        <Sparkles size={16} className={aiPanelOpen ? "text-indigo-600 dark:text-indigo-400" : ""} />
                        AI Writer
                    </button>
                    <button
                        onClick={openNewDrawer}
                        className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                    >
                        <Plus size={16} />
                        New Post
                    </button>
                </div>
            </div>

            {/* AI Writer Panel */}
            {aiPanelOpen && (
                <div className="bg-gradient-to-br from-indigo-50/50 to-violet-50/50 dark:from-indigo-950/20 dark:to-violet-950/20 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl p-6 animate-in slide-in-from-top-4 fade-in duration-300">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1 space-y-4">
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">What should the post be about?</label>
                                <input
                                    value={aiTopic}
                                    onChange={e => setAiTopic(e.target.value)}
                                    placeholder="e.g. 5 Reasons Your Medical Practice Needs a Website"
                                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Keywords (Optional)</label>
                                    <input
                                        value={aiKeywords}
                                        onChange={e => setAiKeywords(e.target.value)}
                                        placeholder="medical website, patient acquisition"
                                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Tone</label>
                                    <select
                                        value={aiTone}
                                        onChange={e => setAiTone(e.target.value)}
                                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    >
                                        <option>Professional</option>
                                        <option>Casual & Engaging</option>
                                        <option>Technical</option>
                                    </select>
                                </div>
                            </div>
                            <button
                                onClick={generateAiDraft}
                                disabled={isGenerating || !aiTopic.trim()}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm shadow-indigo-600/20"
                            >
                                {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                                {isGenerating ? 'Generating...' : 'Generate Draft'}
                            </button>
                        </div>

                        {/* Output Area */}
                        {(aiDraft || isGenerating) && (
                            <div className="flex-1 flex flex-col mt-6 md:mt-0">
                                <div 
                                    ref={aiDraftRef}
                                    className="flex-1 min-h-[250px] max-h-[300px] overflow-y-auto bg-gray-950 text-indigo-300 border border-indigo-900/50 rounded-xl p-4 text-xs font-mono leading-relaxed whitespace-pre-wrap"
                                >
                                    {aiDraft}
                                    {isGenerating && <span className="inline-block w-1.5 h-3 ml-1 bg-current animate-pulse align-middle" />}
                                </div>
                                {aiDraft && !isGenerating && (
                                    <button
                                        onClick={copyAiDraftToEditor}
                                        className="mt-3 w-full bg-foreground hover:bg-foreground/90 text-background font-semibold py-2.5 rounded-xl text-sm transition-colors"
                                    >
                                        Copy to New Post Editor
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="border border-border rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-muted/30 text-left">
                            <th className="px-6 py-4 font-semibold">Title</th>
                            <th className="px-6 py-4 font-semibold hidden md:table-cell">Category</th>
                            <th className="px-6 py-4 font-semibold hidden lg:table-cell">Status</th>
                            <th className="px-6 py-4 font-semibold hidden lg:table-cell">Date</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {posts.map((post) => (
                            <tr key={post.id} className="hover:bg-muted/20 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium">{post.title}</div>
                                    <div className="text-xs text-muted-foreground mt-0.5">/{post.slug}</div>
                                </td>
                                <td className="px-6 py-4 hidden md:table-cell">
                                    {post.category && (
                                        <span className="text-xs font-semibold uppercase tracking-wider bg-secondary/50 px-2 py-1 rounded-md">
                                            {post.category}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 hidden lg:table-cell">
                                    <button
                                        onClick={() => togglePublished(post)}
                                        className={`text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors ${post.published
                                            ? 'text-green-600 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50'
                                            : 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50'
                                            }`}
                                    >
                                        {post.published ? <><Eye size={12} /> Published</> : <><EyeOff size={12} /> Draft</>}
                                    </button>
                                </td>
                                <td className="px-6 py-4 hidden lg:table-cell text-muted-foreground text-xs">
                                    {post.created_at && new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => openEditDrawer(post)} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors" title="Edit">
                                            <Pencil size={15} />
                                        </button>
                                        <button onClick={() => setDeleteId(post.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Delete">
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Delete Confirm Dialog */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setDeleteId(null)}>
                    <div className="bg-card rounded-2xl p-8 max-w-md w-full border border-border shadow-2xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold mb-3">Delete this post?</h3>
                        <p className="text-muted-foreground mb-6 text-sm">This action cannot be undone. The post will be permanently removed.</p>
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setDeleteId(null)} className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-secondary hover:bg-secondary/80 transition-colors">Cancel</button>
                            <button onClick={() => handleDelete(deleteId)} className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-destructive text-white hover:bg-destructive/90 transition-colors">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Drawer */}
            {drawerOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex justify-end" onClick={() => setDrawerOpen(false)}>
                    <div className="w-full max-w-2xl bg-card h-full overflow-y-auto border-l border-border shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="sticky top-0 bg-card z-10 border-b border-border p-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold">{editingPost ? 'Edit Post' : 'New Post'}</h2>
                            <button onClick={() => setDrawerOpen(false)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* Title */}
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Title *</label>
                                <input
                                    value={form.title}
                                    onChange={e => handleTitleChange(e.target.value)}
                                    className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                                    placeholder="Post title"
                                />
                            </div>

                            {/* Slug */}
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Slug *</label>
                                <input
                                    value={form.slug}
                                    onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                                    className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent"
                                    placeholder="post-slug"
                                />
                            </div>

                            {/* Excerpt */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Excerpt (max 160 chars)</label>
                                    <button
                                        type="button"
                                        onClick={generateSeo}
                                        disabled={seoGenerating || !form.content || form.content.trim().length < 50}
                                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
                                    >
                                        {seoGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                        {seoGenerating ? 'Generating...' : '✨ Auto SEO'}
                                    </button>
                                </div>
                                <textarea
                                    value={form.excerpt}
                                    onChange={e => setForm(f => ({ ...f, excerpt: e.target.value.slice(0, 160) }))}
                                    className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent min-h-[80px] resize-y"
                                    placeholder="Brief summary"
                                    maxLength={160}
                                />
                                <p className="text-xs text-muted-foreground mt-1">{(form.excerpt || '').length}/160</p>
                            </div>

                            {/* Category + Tags row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Category</label>
                                    <input
                                        value={form.category}
                                        onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                        className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                                        placeholder="Next.js"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Tags (comma separated)</label>
                                    <input
                                        value={tagsInput}
                                        onChange={e => setTagsInput(e.target.value)}
                                        className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                                        placeholder="React, TypeScript"
                                    />
                                </div>
                            </div>

                            {/* Cover Image */}
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Cover Image URL</label>
                                <input
                                    value={form.cover_image}
                                    onChange={e => setForm(f => ({ ...f, cover_image: e.target.value }))}
                                    className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                                    placeholder="https://..."
                                />
                            </div>

                            {/* Published + Schedule row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Status</label>
                                    <button
                                        type="button"
                                        onClick={() => setForm(f => ({ ...f, published: !f.published, scheduled_at: '' }))}
                                        className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors border ${form.published
                                            ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400'
                                            : 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400'
                                            }`}
                                    >
                                        {form.published ? '✓ Published' : '◎ Draft'}
                                    </button>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Reading Time (min)</label>
                                    <input
                                        type="number"
                                        value={form.reading_time}
                                        onChange={e => setForm(f => ({ ...f, reading_time: parseInt(e.target.value) || 1 }))}
                                        className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                                        min={1}
                                    />
                                </div>
                            </div>

                            {/* Schedule Publish */}
                            {!form.published && (
                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
                                        <Clock size={12} /> Schedule Publish (optional)
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={form.scheduled_at}
                                        onChange={e => setForm(f => ({ ...f, scheduled_at: e.target.value }))}
                                        className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                                        min={new Date().toISOString().slice(0, 16)}
                                    />
                                    {form.scheduled_at && (
                                        <p className="text-xs text-blue-500 mt-1">
                                            Will auto-publish at {new Date(form.scheduled_at).toLocaleString()}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Content (MDX) */}
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Content (MDX)</label>
                                <textarea
                                    value={form.content}
                                    onChange={e => handleContentChange(e.target.value)}
                                    className="w-full bg-gray-950 text-green-400 border border-gray-700 rounded-xl px-4 py-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent min-h-[400px] resize-y leading-relaxed"
                                    placeholder="Write your blog content in MDX format..."
                                    spellCheck={false}
                                />
                            </div>

                            {/* Save Button */}
                            <button
                                onClick={handleSave}
                                disabled={saving || !form.title.trim() || !form.slug.trim()}
                                className="w-full bg-accent hover:bg-accent/90 text-white py-3.5 rounded-xl text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                            >
                                {saving ? (
                                    <><Loader2 size={16} className="animate-spin" /> Saving...</>
                                ) : (
                                    editingPost ? 'Update Post' : 'Create Post'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
