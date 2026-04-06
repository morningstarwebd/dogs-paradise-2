import type { ReactNode } from 'react'
import { Briefcase, ExternalLink, File, FileText, Mail } from 'lucide-react'
import type { SearchResult } from './types'

export const tableIcons: Record<string, ReactNode> = {
    blog_posts: <FileText size={14} />,
    projects: <Briefcase size={14} />,
    contact_messages: <Mail size={14} />,
    pages: <File size={14} />,
}

export const tableLabels: Record<string, string> = {
    blog_posts: 'Blog Posts',
    projects: 'Projects',
    contact_messages: 'Messages',
    pages: 'Pages',
}

export const tableLinks: Record<string, string> = {
    blog_posts: '/admin/blog',
    projects: '/admin/projects',
    contact_messages: '/admin/messages',
    pages: '/admin/pages',
}

export function isActionQuery(query: string): boolean {
    const actionKeywords = /\b(create|draft|write|generate|schedule|publish|make|build|update|set up|convert|turn|summarize)\b/i
    return actionKeywords.test(query)
}

export function getResultTitle(item: SearchResult) {
    return item.title || item.name || item.email || item.slug || 'Untitled'
}

export function getResultSubtitle(item: SearchResult) {
    if (item.slug) return `/${item.slug}`
    if (item.email) return item.email
    if (item.service) return item.service
    return ''
}

export function getExternalIcon() {
    return <ExternalLink size={14} className="text-gray-500" />
}
