'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Link as LinkIcon } from 'lucide-react'
import { useAdminDataStore } from '@/store/admin-data-store'
import { LinkPickerDropdown } from './link-picker/LinkPickerDropdown'
import type { LinkOption } from './link-picker/link-picker-types'
import { isExternalUrl, queryToLabel } from './link-picker/link-picker-utils'

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

    const options: LinkOption[] = useMemo(() => {
        const nextOptions: LinkOption[] = []
        pages?.forEach((page) => nextOptions.push({ label: page.title || page.slug, url: `/${page.slug}`, type: 'page' }))
        projects?.forEach((project) => nextOptions.push({ label: project.title || project.slug, url: `/projects/${project.slug}`, type: 'project' }))
        blogPosts?.forEach((post) => nextOptions.push({ label: post.title || post.slug, url: `/blog/${post.slug}`, type: 'blog' }))
        return nextOptions
    }, [blogPosts, pages, projects])

    const filteredOptions = useMemo(() => {
        if (!searchQuery) return options
        const normalizedQuery = searchQuery.toLowerCase()
        return options.filter((option) => option.label.toLowerCase().includes(normalizedQuery) || option.url.toLowerCase().includes(normalizedQuery))
    }, [options, searchQuery])

    const currentExternalValue = useMemo(() => {
        if (!searchQuery) return null
        if (searchQuery.startsWith('/') || isExternalUrl(searchQuery)) {
            return { label: queryToLabel(searchQuery), url: searchQuery, type: 'external' } as LinkOption
        }
        return { label: searchQuery, url: searchQuery, type: 'external' } as LinkOption
    }, [searchQuery])

    const displayValue = useMemo(() => {
        if (!value) return ''
        const existingOption = options.find((option) => option.url === value)
        return existingOption ? existingOption.label : queryToLabel(value)
    }, [options, value])

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

    return (
        <div className="relative" ref={containerRef}>
            <div className="relative flex items-center">
                <div className="absolute left-3 text-gray-400">
                    <LinkIcon size={16} />
                </div>
                <input
                    type="text"
                    value={isOpen ? searchQuery : displayValue}
                    onChange={(event) => {
                        setSearchQuery(event.target.value)
                        setIsOpen(true)
                    }}
                    onFocus={() => {
                        setSearchQuery(value)
                        setIsOpen(true)
                    }}
                    onKeyDown={(event) => {
                        if (event.key === 'Escape') setIsOpen(false)
                        if (event.key !== 'Enter' || !isOpen) return
                        event.preventDefault()
                        if (filteredOptions.length > 0) return handleSelect(filteredOptions[0].url)
                        if (currentExternalValue) return handleSelect(currentExternalValue.url)
                        handleSelect(searchQuery)
                    }}
                    placeholder={placeholder}
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
            </div>

            {isOpen && (
                <LinkPickerDropdown
                    currentExternalValue={currentExternalValue}
                    filteredOptions={filteredOptions}
                    onSelect={handleSelect}
                />
            )}
        </div>
    )
}
