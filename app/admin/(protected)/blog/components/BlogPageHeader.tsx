import { Plus, Sparkles } from 'lucide-react'

interface BlogPageHeaderProps {
    aiPanelOpen: boolean
    postsCount: number
    onCreatePost: () => void
    onToggleAiPanel: () => void
}

export function BlogPageHeader({
    aiPanelOpen,
    postsCount,
    onCreatePost,
    onToggleAiPanel,
}: BlogPageHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-display font-bold">Blog Posts</h1>
                <p className="text-muted-foreground mt-1">{postsCount} posts total</p>
            </div>
            <div className="flex items-center gap-3">
                <button
                    onClick={onToggleAiPanel}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors border ${
                        aiPanelOpen
                            ? 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:text-indigo-400'
                            : 'bg-background hover:bg-muted border-border text-foreground'
                    }`}
                >
                    <Sparkles size={16} className={aiPanelOpen ? 'text-indigo-600 dark:text-indigo-400' : ''} />
                    AI Writer
                </button>
                <button
                    onClick={onCreatePost}
                    className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                >
                    <Plus size={16} />
                    New Post
                </button>
            </div>
        </div>
    )
}
