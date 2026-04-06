'use client'

import { useEffect, useState, useCallback } from 'react'

import { createClient } from '@/lib/supabase/client'
import { Pencil, Trash2, Plus, Loader2, ExternalLink, X } from 'lucide-react'
import { useAdminDataStore } from '@/store/admin-data-store'
import { saveProject, deleteProject as deleteProjectAction } from '@/app/actions/projects'

interface Project {
    id: string
    title: string
    slug: string
    description: string | null
    long_description: string | null
    category: string | null
    tags: string[] | null
    cover_image: string | null
    live_url: string | null
    github_url: string | null
    featured: boolean | null
    sort_order: number | null
    created_at: string | null
}

const CATEGORIES = ['Sporting Group', 'Working Group', 'Toy Group', 'Terrier Group', 'Hound Group']

function slugify(text: string) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

/**
 * Query existing slugs matching the base pattern and return a unique slug.
 * e.g. if "my-project" exists, returns "my-project-1", then "my-project-2", etc.
 */
async function resolveUniqueSlug(
    supabase: ReturnType<typeof createClient>,
    baseSlug: string,
    excludeId?: string,
): Promise<string> {
    let query = supabase
        .from('projects')
        .select('slug')
        .or(`slug.eq.${baseSlug},slug.like.${baseSlug}-%`)

    if (excludeId) {
        query = query.neq('id', excludeId)
    }

    const { data } = await query
    if (!data || data.length === 0) return baseSlug

    const existing = new Set(data.map((d: { slug: string }) => d.slug))
    if (!existing.has(baseSlug)) return baseSlug

    let suffix = 1
    while (existing.has(`${baseSlug}-${suffix}`)) {
        suffix++
    }
    return `${baseSlug}-${suffix}`
}

const emptyProject: Omit<Project, 'id' | 'created_at'> = {
    title: '',
    slug: '',
    description: '',
    long_description: '',
    category: 'Web Design',
    tags: [],
    cover_image: '',
    live_url: '',
    github_url: '',
    featured: false,
    sort_order: 0,
}

export default function AdminProjectsPage() {
    const { projects: cachedProjects, setProjects: setCachedProjects } = useAdminDataStore()
    const [projects, setProjects] = useState<Project[]>(cachedProjects || [])
    const [loading, setLoading] = useState(!cachedProjects)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [editingProject, setEditingProject] = useState<Project | null>(null)
    const [form, setForm] = useState(emptyProject)
    const [saving, setSaving] = useState(false)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [tagsInput, setTagsInput] = useState('')
    const [toast, setToast] = useState<string | null>(null)
    const supabase = createClient()

    const showToast = (msg: string) => {
        setToast(msg)
        setTimeout(() => setToast(null), 3000)
    }

    const fetchProjects = useCallback(async () => {
        const { data } = await supabase
            .from('projects')
            .select('*')
            .order('sort_order', { ascending: true })
        if (data) {
            setProjects(data)
            setCachedProjects(data)
        }
        setLoading(false)
    }, [supabase, setCachedProjects])

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { fetchProjects() }, [fetchProjects])

    const openNewDrawer = () => {
        setEditingProject(null)
        setForm(emptyProject)
        setTagsInput('')
        setDrawerOpen(true)
    }

    const openEditDrawer = (project: Project) => {
        setEditingProject(project)
        setForm({
            title: project.title,
            slug: project.slug,
            description: project.description || '',
            long_description: project.long_description || '',
            category: project.category || 'Web Design',
            tags: project.tags || [],
            cover_image: project.cover_image || '',
            live_url: project.live_url || '',
            github_url: project.github_url || '',
            featured: project.featured || false,
            sort_order: project.sort_order || 0,
        })
        setTagsInput((project.tags || []).join(', '))
        setDrawerOpen(true)
    }

    const handleTitleChange = (title: string) => {
        setForm(f => ({
            ...f,
            title,
            slug: editingProject ? f.slug : slugify(title),
        }))
    }

    const handleSave = async () => {
        if (!form.title.trim() || !form.slug.trim()) return
        setSaving(true)

        // Resolve unique slug to prevent collisions
        const uniqueSlug = await resolveUniqueSlug(
            supabase,
            slugify(form.slug),
            editingProject?.id,
        )

        const payload = {
            ...form,
            slug: uniqueSlug,
            tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
        }

        const result = await saveProject(payload, editingProject?.id)
        if (!result.success) {
            showToast('Error: ' + result.error)
        } else {
            showToast(editingProject ? 'Project updated successfully!' : 'Project created successfully!')
        }

        setSaving(false)
        setDrawerOpen(false)
        fetchProjects()
    }

    const handleDelete = async (id: string) => {
        const result = await deleteProjectAction(id)
        if (!result.success) {
            showToast('Error: ' + result.error)
        } else {
            showToast('Project deleted successfully!')
        }
        setDeleteId(null)
        fetchProjects()
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
                    <h1 className="text-3xl font-display font-bold">Projects</h1>
                    <p className="text-muted-foreground mt-1">{projects.length} projects total</p>
                </div>
                <button
                    onClick={openNewDrawer}
                    className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                >
                    <Plus size={16} />
                    New Project
                </button>
            </div>

            {/* Table */}
            <div className="border border-border rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-muted/30 text-left">
                            <th className="px-6 py-4 font-semibold">Breed Name</th>
                            <th className="px-6 py-4 font-semibold hidden md:table-cell">Category</th>
                            <th className="px-6 py-4 font-semibold hidden lg:table-cell">Featured</th>
                            <th className="px-6 py-4 font-semibold hidden lg:table-cell">Order</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {projects.map((project) => (
                            <tr key={project.id} className="hover:bg-muted/20 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium">{project.title}</div>
                                    <div className="text-xs text-muted-foreground mt-0.5">/{project.slug}</div>
                                </td>
                                <td className="px-6 py-4 hidden md:table-cell">
                                    <span className="text-xs font-semibold uppercase tracking-wider bg-secondary/50 px-2 py-1 rounded-md">
                                        {project.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 hidden lg:table-cell">
                                    {project.featured ? (
                                        <span className="text-xs font-semibold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-md">Yes</span>
                                    ) : (
                                        <span className="text-xs text-muted-foreground">No</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 hidden lg:table-cell text-muted-foreground">
                                    {project.sort_order}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        {project.live_url && (
                                            <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors" title="Visit live">
                                                <ExternalLink size={15} />
                                            </a>
                                        )}
                                        <button onClick={() => openEditDrawer(project)} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors" title="Edit">
                                            <Pencil size={15} />
                                        </button>
                                        <button onClick={() => setDeleteId(project.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Delete">
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
                        <h3 className="text-xl font-bold mb-3">Delete this project?</h3>
                        <p className="text-muted-foreground mb-6 text-sm">This action cannot be undone. The project will be permanently removed.</p>
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
                    <div className="w-full max-w-lg bg-card h-full overflow-y-auto border-l border-border shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="sticky top-0 bg-card z-10 border-b border-border p-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold">{editingProject ? 'Edit Dog' : 'New Project'}</h2>
                            <button onClick={() => setDrawerOpen(false)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* Breed Name */}
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Breed Name *</label>
                                <input
                                    value={form.title}
                                    onChange={e => handleTitleChange(e.target.value)}
                                    className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                                    placeholder="project.title"
                                />
                            </div>

                            {/* Slug */}
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Slug *</label>
                                <input
                                    value={form.slug}
                                    onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                                    className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent"
                                    placeholder="project-slug"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Description</label>
                                <textarea
                                    value={form.description || ''}
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent min-h-[80px] resize-y"
                                    placeholder="Short description"
                                />
                            </div>

                            {/* Long Description */}
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Long Description</label>
                                <textarea
                                    value={form.long_description || ''}
                                    onChange={e => setForm(f => ({ ...f, long_description: e.target.value }))}
                                    className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent min-h-[120px] resize-y"
                                    placeholder="Detailed project description"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Category</label>
                                <select
                                    value={form.category || 'Web Design'}
                                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                    className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                                >
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Tags (comma separated)</label>
                                <input
                                    value={tagsInput}
                                    onChange={e => setTagsInput(e.target.value)}
                                    className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                                    placeholder="React, Next.js, Tailwind"
                                />
                            </div>

                            {/* Cover Image */}
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Cover Image URL</label>
                                <input
                                    value={form.cover_image || ''}
                                    onChange={e => setForm(f => ({ ...f, cover_image: e.target.value }))}
                                    className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                                    placeholder="https://..."
                                />
                            </div>

                            {/* Live URL */}
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Live URL</label>
                                <input
                                    type="url"
                                    value={form.live_url || ''}
                                    onChange={e => setForm(f => ({ ...f, live_url: e.target.value }))}
                                    className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                                    placeholder="?20000"
                                />
                            </div>

                            {/* GitHub URL */}
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">GitHub URL</label>
                                <input
                                    type="url"
                                    value={form.github_url || ''}
                                    onChange={e => setForm(f => ({ ...f, github_url: e.target.value }))}
                                    className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                                    placeholder="available"
                                />
                            </div>

                            {/* Featured + Sort Order row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Featured</label>
                                    <button
                                        type="button"
                                        onClick={() => setForm(f => ({ ...f, featured: !f.featured }))}
                                        className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors border ${form.featured
                                            ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400'
                                            : 'bg-secondary/50 border-border text-muted-foreground'
                                            }`}
                                    >
                                        {form.featured ? '★ Featured' : 'Not Featured'}
                                    </button>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Sort Order</label>
                                    <input
                                        type="number"
                                        value={form.sort_order || 0}
                                        onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                                        className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                                    />
                                </div>
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
                                    editingProject ? 'Update Project' : 'Create Project'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
