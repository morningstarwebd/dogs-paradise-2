'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Upload, Trash2, Loader2, FolderOpen, Copy, Check, ExternalLink } from 'lucide-react'
import { listMediaFiles, deleteMediaFile, cleanupOrphanMedia, type MediaFile } from '@/app/actions/media'
import { uploadToSupabase } from '@/lib/upload'

export default function FilesPage() {
    const [files, setFiles] = useState<MediaFile[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [deleting, setDeleting] = useState<string | null>(null)
    const [cleaning, setCleaning] = useState(false)
    const [activeFolder, setActiveFolder] = useState('')
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
    const [toast, setToast] = useState<string | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const fetchFiles = async (folder: string) => {
        setLoading(true)
        const result = await listMediaFiles(folder)
        setFiles(result.files)
        setLoading(false)
    }

    useEffect(() => {
        fetchFiles(activeFolder)
    }, [activeFolder])

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files
        if (!fileList?.length) return
        setUploading(true)
        try {
            for (const file of Array.from(fileList)) {
                await uploadToSupabase(file, activeFolder || 'general')
            }
            await fetchFiles(activeFolder)
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Upload failed')
        } finally {
            setUploading(false)
            if (inputRef.current) inputRef.current.value = ''
        }
    }

    const handleDelete = async (file: MediaFile) => {
        if (!confirm(`Delete "${file.name}"? This cannot be undone.`)) return
        setDeleting(file.fullPath)
        const result = await deleteMediaFile(file.fullPath)
        if (result.success) {
            setFiles(prev => prev.filter(f => f.fullPath !== file.fullPath))
        } else {
            alert(`Failed: ${result.error}`)
        }
        setDeleting(null)
    }

    const handleCopy = (url: string) => {
        navigator.clipboard.writeText(url)
        setCopiedUrl(url)
        setTimeout(() => setCopiedUrl(null), 2000)
    }

    const formatSize = (bytes: number) => {
        if (!bytes) return '—'
        if (bytes < 1024) return `${bytes} B`
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    }

    const folders = ['', 'hero', 'sections', 'general', 'projects']

    return (
        <div className="max-w-7xl mx-auto">
            {/* Toast */}
            {toast && (
                <div className="fixed top-6 right-6 z-[100] bg-foreground text-background px-6 py-3 rounded-xl shadow-2xl text-sm font-semibold animate-in slide-in-from-top-2">
                    {toast}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold">Files</h1>
                    <p className="text-muted-foreground mt-1">Manage your uploaded media assets</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={async () => {
                            setCleaning(true)
                            const result = await cleanupOrphanMedia()
                            setCleaning(false)
                            if (result.error) {
                                setToast(`Cleanup failed: ${result.error}`)
                            } else {
                                setToast(`Cleaned ${result.deleted} orphan file${result.deleted !== 1 ? 's' : ''}`)
                                await fetchFiles(activeFolder)
                            }
                            setTimeout(() => setToast(null), 3000)
                        }}
                        disabled={cleaning}
                        className="flex items-center gap-2 px-4 py-2.5 bg-secondary hover:bg-secondary/80 rounded-full text-sm font-bold transition-all disabled:opacity-50"
                    >
                        {cleaning ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                        {cleaning ? 'Cleaning...' : 'Clean Orphans'}
                    </button>
                    <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
                    <button
                        onClick={() => inputRef.current?.click()}
                        disabled={uploading}
                        className="flex items-center gap-2 px-5 py-2.5 bg-black text-white dark:bg-white dark:text-black rounded-full text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50"
                    >
                        {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                        {uploading ? 'Uploading...' : 'Upload Files'}
                    </button>
                </div>
            </div>

            {/* Folder Tabs */}
            <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
                {folders.map(f => (
                    <button
                        key={f || 'all'}
                        onClick={() => setActiveFolder(f)}
                        className={`text-sm font-semibold px-4 py-2 rounded-full transition-colors capitalize ${activeFolder === f
                            ? 'bg-black text-white dark:bg-white dark:text-black'
                            : 'bg-secondary hover:bg-secondary/80'
                            }`}
                    >
                        {f || 'All Files'}
                    </button>
                ))}
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center py-32">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
            ) : files.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
                    <FolderOpen className="w-20 h-20 mb-6 opacity-30" />
                    <p className="text-xl font-display font-bold mb-2">No files found</p>
                    <p className="text-sm">Upload images to see them here</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {files.map(file => (
                        <div
                            key={file.fullPath}
                            className="group relative bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                        >
                            {/* Image */}
                            <div className="relative aspect-square overflow-hidden bg-secondary">
                                <Image
                                    src={file.publicUrl}
                                    alt={file.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                />
                            </div>

                            {/* Overlay Actions */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                <button
                                    onClick={() => handleCopy(file.publicUrl)}
                                    className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                                    title="Copy URL"
                                >
                                    {copiedUrl === file.publicUrl ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                                </button>
                                <a
                                    href={file.publicUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                                    title="Open in new tab"
                                >
                                    <ExternalLink size={16} />
                                </a>
                                <button
                                    onClick={() => handleDelete(file)}
                                    disabled={deleting === file.fullPath}
                                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                                    title="Delete"
                                >
                                    {deleting === file.fullPath ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                </button>
                            </div>

                            {/* Info */}
                            <div className="p-3">
                                <p className="text-sm font-medium truncate">{file.name}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{formatSize(file.size)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
