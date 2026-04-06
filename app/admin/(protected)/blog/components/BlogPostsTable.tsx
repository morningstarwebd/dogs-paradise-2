import { Eye, EyeOff, Pencil, Trash2 } from 'lucide-react'
import type { BlogPost } from '@/store/admin-data-store'
import { formatBlogPostDate } from '../blog-utils'

interface BlogPostsTableProps {
    posts: BlogPost[]
    onDelete: (id: string) => void
    onEdit: (post: BlogPost) => void
    onTogglePublished: (post: BlogPost) => void
}

export function BlogPostsTable({
    posts,
    onDelete,
    onEdit,
    onTogglePublished,
}: BlogPostsTableProps) {
    return (
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
                                    onClick={() => onTogglePublished(post)}
                                    className={`text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors ${
                                        post.published
                                            ? 'text-green-600 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50'
                                            : 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50'
                                    }`}
                                >
                                    {post.published ? <><Eye size={12} /> Published</> : <><EyeOff size={12} /> Draft</>}
                                </button>
                            </td>
                            <td className="px-6 py-4 hidden lg:table-cell text-muted-foreground text-xs">
                                {formatBlogPostDate(post.created_at)}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center justify-end gap-2">
                                    <button onClick={() => onEdit(post)} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors" title="Edit">
                                        <Pencil size={15} />
                                    </button>
                                    <button onClick={() => onDelete(post.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Delete">
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
