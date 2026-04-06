'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { Link as LinkIcon, FileText, Briefcase, FileSignature, ExternalLink } from 'lucide-react'
import { useAdminDataStore } from '@/store/admin-data-store'

interface LinkOption {
    label: string
    url: string
    type: 'page' | 'project' | 'blog' | 'external'
}

interface LinkPickerProps {
    value: string
    onChange: (url: string) => void
    placeholder?: string
}

export function LinkPicker({ value, onChange, placeholder = 'Search or enter link...' }: LinkPickerProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const { pages, projects, blogPosts } = useAdminDataStore()
    const containerRef = useRef<HTMLDivElement>(null)

    // Collect all internal links
    const options: LinkOption[] = useMemo(() => {
        const opts: LinkOption[] = []

        if (pages && Array.isArray(pages)) {
            pages.forEach((p) => {
                opts.push({
                    label: p.title || p.slug,
                    url: `/${p.slug}`,
                    type: 'page'
                })
            })
        }

        if (projects && Array.isArray(projects)) {
            projects.forEach((p) => {
                opts.push({
                    label: p.title || p.slug,
                    url: `/projects/${p.slug}`,
                    type: 'project'
                })
            })
        }

        if (blogPosts && Array.isArray(blogPosts)) {
            blogPosts.forEach((p) => {
                opts.push({
                    label: p.title || p.slug,
                    url: `/blog/${p.slug}`,
                    type: 'blog'
                })
            })
        }

        return opts
    }, [pages, projects, blogPosts])

    // Filter by search query
    const filteredOptions = useMemo(() => {
        if (!searchQuery) return options
        const q = searchQuery.toLowerCase()
        return options.filter(opt =>
            opt.label.toLowerCase().includes(q) ||
            opt.url.toLowerCase().includes(q)
        )
    }, [options, searchQuery])

    const isExternalUrl = (url: string) => {
        try {
            new URL(url)
            return true
        } catch {
            return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:') || url.startsWith('tel:') || url.startsWith('#')
        }
    }

    const currentExternalVal = useMemo(() => {
        if (!searchQuery) return null
        // If it starts with / it's considered internal but custom
        if (searchQuery.startsWith('/')) {
            return { label: queryToLabel(searchQuery), url: searchQuery, type: 'external' } as LinkOption
        }
        // If it looks like a URL, add it
        if (isExternalUrl(searchQuery)) {
            return { label: searchQuery, url: searchQuery, type: 'external' } as LinkOption
        }
        // Otherwise prepended http:// or just plain string
        return { label: searchQuery, url: searchQuery, type: 'external' } as LinkOption
    }, [searchQuery])

    // Derive display name for current value
    const displayValue = useMemo(() => {
        if (!value) return ''
        const found = options.find(o => o.url === value)
        if (found) return found.label
        return queryToLabel(value)
    }, [value, options])


    // Initial selection sync
    useEffect(() => {
        if (value && !searchQuery) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSearchQuery(value)
        }
    }, [value, searchQuery])

    // Handle clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelect = (url: string) => {
        onChange(url)
        setIsOpen(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && isOpen) {
            e.preventDefault()
            if (filteredOptions.length > 0) {
                handleSelect(filteredOptions[0].url)
            } else if (currentExternalVal) {
                handleSelect(currentExternalVal.url)
            } else {
                handleSelect(searchQuery)
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false)
        }
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'page': return <FileText size={14} className="text-blue-500" />
            case 'project': return <Briefcase size={14} className="text-emerald-500" />
            case 'blog': return <FileSignature size={14} className="text-amber-500" />
            default: return <ExternalLink size={14} className="text-gray-500" />
        }
    }

    return (
        <div className="relative" ref={containerRef}>
            <div className="relative flex items-center">
                <div className="absolute left-3 text-gray-400">
                    <LinkIcon size={16} />
                </div>
                <input
                    type="text"
                    value={isOpen ? searchQuery : displayValue}
                    onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setIsOpen(true)
                    }}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
            </div>

            {isOpen && (
                <div className="absolute mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 max-h-[300px] overflow-y-auto">
                    {filteredOptions.length > 0 || currentExternalVal ? (
                        <ul className="py-2">
                            {filteredOptions.map((opt, i) => (
                                <li key={`${opt.url}-${i}`}>
                                    <button
                                        type="button"
                                        onClick={() => handleSelect(opt.url)}
                                        className="w-full flex justify-between items-center px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                                    >
                                        <div className="flex items-center gap-3 w-full overflow-hidden">
                                            <div className="shrink-0">{getTypeIcon(opt.type)}</div>
                                            <div className="truncate flex-1">
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{opt.label}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 truncate font-mono">{opt.url}</div>
                                            </div>
                                        </div>
                                    </button>
                                </li>
                            ))}
                            {currentExternalVal && filteredOptions.findIndex(o => o.url === currentExternalVal.url) === -1 && (
                                <li key="external">
                                    <button
                                        type="button"
                                        onClick={() => handleSelect(currentExternalVal.url)}
                                        className="w-full flex justify-between items-center px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left border-t border-gray-100 dark:border-gray-800"
                                    >
                                        <div className="flex items-center gap-3 w-full overflow-hidden">
                                            <div className="shrink-0">{getTypeIcon('external')}</div>
                                            <div className="truncate flex-1">
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">Link to &quot;{currentExternalVal.label}&quot;</div>
                                                {isExternalUrl(currentExternalVal.url) || currentExternalVal.url.startsWith('/') ? null : (
                                                    <div className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                                                        Make sure the link includes http:// or https://
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                </li>
                            )}
                        </ul>
                    ) : (
                        <div className="px-4 py-6 text-center text-sm text-gray-500">
                            No matching pages or links found.
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

function queryToLabel(query: string) {
    if (!query) return ''
    if (query === '/') return 'Home'
    let label = query.replace('https://', '').replace('http://', '').replace('mailto:', '').replace('tel:', '')
    if (label.endsWith('/')) label = label.slice(0, -1)
    return label
}
