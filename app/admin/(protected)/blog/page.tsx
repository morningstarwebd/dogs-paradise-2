'use client'

import { Loader2 } from 'lucide-react'
import { BlogAiPanel } from './components/BlogAiPanel'
import { BlogPageHeader } from './components/BlogPageHeader'
import { BlogPostDrawer } from './components/BlogPostDrawer'
import { BlogPostsTable } from './components/BlogPostsTable'
import { DeletePostDialog } from './components/DeletePostDialog'
import { useBlogAiTools } from './use-blog-ai-tools'
import { useBlogPostsManager } from './use-blog-posts-manager'

export default function AdminBlogPage() {
    const {
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
    } = useBlogPostsManager()

    const {
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
    } = useBlogAiTools({
        form,
        onApplyDraft: (updater) => setForm(updater),
        onOpenNewDrawer: openNewDrawer,
        onShowToast: showToast,
    })

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="animate-spin text-muted-foreground" size={32} />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {toast && (
                <div className="fixed top-6 right-6 z-[100] bg-foreground text-background px-6 py-3 rounded-xl shadow-2xl text-sm font-semibold animate-in slide-in-from-top-2">
                    {toast}
                </div>
            )}

            <BlogPageHeader
                aiPanelOpen={aiPanelOpen}
                postsCount={posts.length}
                onCreatePost={openNewDrawer}
                onToggleAiPanel={() => setAiPanelOpen((current) => !current)}
            />

            {aiPanelOpen && (
                <BlogAiPanel
                    aiDraft={aiDraft}
                    aiDraftRef={aiDraftRef}
                    aiKeywords={aiKeywords}
                    aiTone={aiTone}
                    aiTopic={aiTopic}
                    isGenerating={isGenerating}
                    onAiKeywordsChange={setAiKeywords}
                    onAiToneChange={setAiTone}
                    onAiTopicChange={setAiTopic}
                    onCopyToEditor={copyAiDraftToEditor}
                    onGenerateDraft={generateAiDraft}
                />
            )}

            <BlogPostsTable
                posts={posts}
                onDelete={setDeleteId}
                onEdit={openEditDrawer}
                onTogglePublished={handleTogglePublished}
            />

            {deleteId && (
                <DeletePostDialog
                    onCancel={() => setDeleteId(null)}
                    onConfirm={() => handleDelete(deleteId)}
                />
            )}

            {drawerOpen && (
                <BlogPostDrawer
                    editingPost={editingPost}
                    form={form}
                    saving={saving}
                    seoGenerating={seoGenerating}
                    tagsInput={tagsInput}
                    onClose={() => setDrawerOpen(false)}
                    onContentChange={handleContentChange}
                    onExcerptChange={(value) => setForm((current) => ({ ...current, excerpt: value }))}
                    onGenerateSeo={generateSeo}
                    onReadingTimeChange={(value) => setForm((current) => ({ ...current, reading_time: value }))}
                    onSave={handleSave}
                    onScheduleChange={(value) => setForm((current) => ({ ...current, scheduled_at: value }))}
                    onSetCategory={(value) => setForm((current) => ({ ...current, category: value }))}
                    onSetCoverImage={(value) => setForm((current) => ({ ...current, cover_image: value }))}
                    onSetPublished={() => setForm((current) => ({ ...current, published: !current.published, scheduled_at: '' }))}
                    onSetSlug={(value) => setForm((current) => ({ ...current, slug: value }))}
                    onSetTagsInput={setTagsInput}
                    onTitleChange={handleTitleChange}
                />
            )}
        </div>
    )
}
