import { Briefcase, ExternalLink, FileSignature, FileText } from 'lucide-react'
import type { LinkOption } from './link-picker-types'

export function isExternalUrl(url: string) {
    try {
        new URL(url)
        return true
    } catch {
        return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:') || url.startsWith('tel:') || url.startsWith('#')
    }
}

export function queryToLabel(query: string) {
    if (!query) return ''
    if (query === '/') return 'Home'

    let label = query.replace('https://', '').replace('http://', '').replace('mailto:', '').replace('tel:', '')
    if (label.endsWith('/')) label = label.slice(0, -1)
    return label
}

export function getTypeIcon(type: LinkOption['type']) {
    switch (type) {
        case 'page':
            return <FileText size={14} className="text-blue-500" />
        case 'project':
            return <Briefcase size={14} className="text-emerald-500" />
        case 'blog':
            return <FileSignature size={14} className="text-amber-500" />
        default:
            return <ExternalLink size={14} className="text-gray-500" />
    }
}
