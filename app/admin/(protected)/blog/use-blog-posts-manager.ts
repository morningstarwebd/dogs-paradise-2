'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAdminDataStore, type BlogPost } from '@/store/admin-data-store'
import { validateSlug } from '@/lib/content-pipeline'
import { deletePost as deletePostAction, savePost, togglePostPublished } from '@/app/actions/posts'
import { EMPTY_BLOG_FORM, getBlogFormFromPost } from './blog-types'
import { estimateReadingTime, slugify } from './blog-utils'

export function useBlogPostsManager() {
    const { blogPosts, setBlogPosts } = useAdminDataStore()
    const [posts, setPosts] = useState<BlogPost[]>(blogPosts || [])
    const [loading, setLoading] = useState(!blogPosts)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
    const [form, setForm] = useState(EMPTY_BLOG_FORM)
    const [saving, setSaving] = useState(false)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [tagsInput, setTagsInput] = useState('')
    const [toast, setToast] = useState<string | null>(null)
    const supabase = useMemo(() => createClient(), [])
    const router = useRouter()

    const showToast = (message: string) => {
        setToast(message)
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
    }, [setBlogPosts, supabase])

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            void fetchPosts()
        }, 0)

        return () => window.clearTimeout(timeoutId)
    }, [fetchPosts])

    const openNewDrawer = () => {
        setEditingPost(null)
        setForm(EMPTY_BLOG_FORM)
        setTagsInput('')
        setDrawerOpen(true)
    }

    const openEditDrawer = (post: BlogPost) => {
        setEditingPost(post)
        setForm(getBlogFormFromPost(post))
        setTagsInput((post.tags || []).join(', '))
        setDrawerOpen(true)
    }

    const handleTitleChange = (title: string) => {
        setForm((current) => ({
            ...current,
            title,
            slug: editingPost ? current.slug : slugify(title),
        }))
    }

    const handleContentChange = (content: string) => {
        setForm((current) => ({
            ...current,
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
            tags: tagsInput.split(',').map((tag) => tag.trim()).filter(Boolean),
            scheduled_at: form.scheduled_at ? new Date(form.scheduled_at).toISOString() : null,
            updated_at: new Date().toISOString(),
        }

        const result = await savePost(payload, editingPost?.id)
        showToast(result.success ? editingPost ? 'Post updated!' : 'Post created!' : `Error: ${result.error}`)

        setSaving(false)
        setDrawerOpen(false)
        fetchPosts()
        router.refresh()
    }

    const handleDelete = async (id: string) => {
        const result = await deletePostAction(id)
        showToast(result.success ? 'Post deleted!' : `Error: ${result.error}`)
        setDeleteId(null)
        fetchPosts()
        router.refresh()
    }

    const handleTogglePublished = async (post: BlogPost) => {
        const result = await togglePostPublished(post.id, !post.published, post.slug)
        if (!result.success) return

        showToast(post.published ? 'Post unpublished' : 'Post published!')
        fetchPosts()
        router.refresh()
    }

    return {
        deleteId,
        drawerOpen,
        editingPost,
        form,
        loading,
        posts,
        saving,
        tagsInput,
        toast,
        handleContentChange,
        handleDelete,
        handleSave,
        handleTitleChange,
        handleTogglePublished,
        openEditDrawer,
        openNewDrawer,
        setDeleteId,
        setDrawerOpen,
        setForm,
        setTagsInput,
        showToast,
    }
}
