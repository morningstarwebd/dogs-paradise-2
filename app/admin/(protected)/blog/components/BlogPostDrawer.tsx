import { Clock, Loader2, Sparkles, X } from 'lucide-react'
import type { BlogPost } from '@/store/admin-data-store'
import type { BlogFormState } from '../blog-types'

interface BlogPostDrawerProps {
    editingPost: BlogPost | null
    form: BlogFormState
    saving: boolean
    seoGenerating: boolean
    tagsInput: string
    onClose: () => void
    onContentChange: (value: string) => void
    onExcerptChange: (value: string) => void
    onGenerateSeo: () => void
    onReadingTimeChange: (value: number) => void
    onSave: () => void
    onScheduleChange: (value: string) => void
    onSetCategory: (value: string) => void
    onSetCoverImage: (value: string) => void
    onSetPublished: () => void
    onSetSlug: (value: string) => void
    onSetTagsInput: (value: string) => void
    onTitleChange: (value: string) => void
}

export function BlogPostDrawer({
    editingPost,
    form,
    saving,
    seoGenerating,
    tagsInput,
    onClose,
    onContentChange,
    onExcerptChange,
    onGenerateSeo,
    onReadingTimeChange,
    onSave,
    onScheduleChange,
    onSetCategory,
    onSetCoverImage,
    onSetPublished,
    onSetSlug,
    onSetTagsInput,
    onTitleChange,
}: BlogPostDrawerProps) {
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end" onClick={onClose}>
            <div className="w-full max-w-2xl bg-card h-full overflow-y-auto border-l border-border shadow-2xl" onClick={(event) => event.stopPropagation()}>
                <div className="sticky top-0 bg-card z-10 border-b border-border p-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold">{editingPost ? 'Edit Post' : 'New Post'}</h2>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Title *</label>
                        <input
                            value={form.title}
                            onChange={(event) => onTitleChange(event.target.value)}
                            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="Post title"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Slug *</label>
                        <input
                            value={form.slug}
                            onChange={(event) => onSetSlug(event.target.value)}
                            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="post-slug"
                        />
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Excerpt (max 160 chars)</label>
                            <button
                                type="button"
                                onClick={onGenerateSeo}
                                disabled={seoGenerating || !form.content || form.content.trim().length < 50}
                                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
                            >
                                {seoGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                {seoGenerating ? 'Generating...' : 'Auto SEO'}
                            </button>
                        </div>
                        <textarea
                            value={form.excerpt}
                            onChange={(event) => onExcerptChange(event.target.value.slice(0, 160))}
                            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent min-h-[80px] resize-y"
                            placeholder="Brief summary"
                            maxLength={160}
                        />
                        <p className="text-xs text-muted-foreground mt-1">{(form.excerpt || '').length}/160</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Category</label>
                            <input
                                value={form.category}
                                onChange={(event) => onSetCategory(event.target.value)}
                                className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                                placeholder="Next.js"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Tags (comma separated)</label>
                            <input
                                value={tagsInput}
                                onChange={(event) => onSetTagsInput(event.target.value)}
                                className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                                placeholder="React, TypeScript"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Cover Image URL</label>
                        <input
                            value={form.cover_image}
                            onChange={(event) => onSetCoverImage(event.target.value)}
                            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="https://..."
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Status</label>
                            <button
                                type="button"
                                onClick={onSetPublished}
                                className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors border ${
                                    form.published
                                        ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400'
                                        : 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400'
                                }`}
                            >
                                {form.published ? 'Published' : 'Draft'}
                            </button>
                        </div>
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Reading Time (min)</label>
                            <input
                                type="number"
                                value={form.reading_time}
                                onChange={(event) => onReadingTimeChange(parseInt(event.target.value, 10) || 1)}
                                className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                                min={1}
                            />
                        </div>
                    </div>
                    {!form.published && (
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
                                <Clock size={12} /> Schedule Publish (optional)
                            </label>
                            <input
                                type="datetime-local"
                                value={form.scheduled_at}
                                onChange={(event) => onScheduleChange(event.target.value)}
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
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Content (MDX)</label>
                        <textarea
                            value={form.content}
                            onChange={(event) => onContentChange(event.target.value)}
                            className="w-full bg-gray-950 text-green-400 border border-gray-700 rounded-xl px-4 py-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent min-h-[400px] resize-y leading-relaxed"
                            placeholder="Write your blog content in MDX format..."
                            spellCheck={false}
                        />
                    </div>
                    <button
                        onClick={onSave}
                        disabled={saving || !form.title.trim() || !form.slug.trim()}
                        className="w-full bg-accent hover:bg-accent/90 text-white py-3.5 rounded-xl text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                    >
                        {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : editingPost ? 'Update Post' : 'Create Post'}
                    </button>
                </div>
            </div>
        </div>
    )
}
