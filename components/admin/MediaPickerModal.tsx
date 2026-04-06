'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { X, Upload, Check, Loader2, FolderOpen } from 'lucide-react'
import { listMediaFiles, type MediaFile } from '@/app/actions/media'
import { uploadToSupabase } from '@/lib/upload'

type MediaPickerModalProps = {
    open: boolean
    onClose: () => void
    onSelect: (url: string) => void
    folder?: string
}

export function MediaPickerModal({ open, onClose, onSelect, folder = '' }: MediaPickerModalProps) {
    const [files, setFiles] = useState<MediaFile[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [selected, setSelected] = useState<string | null>(null)
    const [activeFolder, setActiveFolder] = useState(folder)
    const inputRef = useRef<HTMLInputElement>(null)

    const fetchFiles = async (dir: string) => {
        setLoading(true)
        const result = await listMediaFiles(dir)
        setFiles(result.files)

        // Extract unique folder prefixes from file paths
        const folderSet = new Set<string>()
        result.files.forEach(f => {
            const parts = f.fullPath.split('/')
            if (parts.length > 1) folderSet.add(parts[0])
        })

        setLoading(false)
    }

    useEffect(() => {
        if (open) {
            fetchFiles(activeFolder)
            setSelected(null)
        }
    }, [open, activeFolder])


    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setUploading(true)
        try {
            const url = await uploadToSupabase(file, activeFolder || 'general')
            onSelect(url)
            onClose()
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Upload failed')
        } finally {
            setUploading(false)
            if (inputRef.current) inputRef.current.value = ''
        }
    }

    const handleSelect = () => {
        if (selected) {
            onSelect(selected)
            onClose()
        }
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <h2 className="text-lg font-bold font-display">Media Library</h2>
                        <p className="text-sm text-gray-500">Select an image or upload a new one</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-3 px-6 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/50">
                    {/* Folder tabs */}
                    <button
                        onClick={() => setActiveFolder('')}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${activeFolder === '' ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                    >
                        All Files
                    </button>
                    {['hero', 'sections', 'general', 'projects'].map(f => (
                        <button
                            key={f}
                            onClick={() => setActiveFolder(f)}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors capitalize ${activeFolder === f ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                        >
                            {f}
                        </button>
                    ))}
                    <div className="flex-1" />
                    <input ref={inputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                    <button
                        onClick={() => inputRef.current?.click()}
                        disabled={uploading}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
                    >
                        {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                        </div>
                    ) : files.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                            <FolderOpen className="w-16 h-16 mb-4 opacity-50" />
                            <p className="font-medium">No files found</p>
                            <p className="text-sm mt-1">Upload images to see them here</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                            {files.map(file => (
                                <button
                                    key={file.fullPath}
                                    onClick={() => setSelected(file.publicUrl)}
                                    className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer ${selected === file.publicUrl
                                        ? 'border-blue-500 ring-2 ring-blue-500/30 scale-[0.97]'
                                        : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                                        }`}
                                >
                                    <Image
                                        src={file.publicUrl}
                                        alt={file.name}
                                        fill
                                        className="object-cover"
                                        loading="lazy"
                                    />
                                    {selected === file.publicUrl && (
                                        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                                <Check size={16} className="text-white" />
                                            </div>
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-white text-xs truncate">{file.name}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950/50">
                    <p className="text-sm text-gray-500">
                        {files.length} file{files.length !== 1 ? 's' : ''}
                        {selected && ' • 1 selected'}
                    </p>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            Cancel
                        </button>
                        <button
                            onClick={handleSelect}
                            disabled={!selected}
                            className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black text-sm font-bold rounded-lg hover:opacity-90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            Select Image
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
