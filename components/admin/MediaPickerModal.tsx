import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { X, Upload, Check, Loader2, FolderOpen, Trash2 } from 'lucide-react'
import { listMediaFiles, deleteMediaFile, type MediaFile } from '@/app/actions/media'
import { uploadToSupabase } from '@/lib/upload'

type MediaPickerModalProps = {
    open: boolean
    onClose: () => void
    onSelect: (url: string | string[]) => void
    folder?: string
    multiple?: boolean
    initialSearchQuery?: string
}

export function MediaPickerModal({ open, onClose, onSelect, folder = '', multiple = false, initialSearchQuery = '' }: MediaPickerModalProps) {
    const [files, setFiles] = useState<MediaFile[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [selected, setSelected] = useState<string[]>([])
    const [activeFolder, setActiveFolder] = useState(folder)
    const [deleting, setDeleting] = useState<string | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const [searchQuery, setSearchQuery] = useState('')

    const fetchFiles = async (dir: string) => {
        setLoading(true)
        const result = await listMediaFiles(dir)
        setFiles(result.files)
        setLoading(false)
    }

    useEffect(() => {
        if (open) {
            fetchFiles(activeFolder)
            setSelected([])
            setSearchQuery(initialSearchQuery || '')
        }
    }, [open, activeFolder, initialSearchQuery])

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setUploading(true)
        try {
            const url = await uploadToSupabase(file, activeFolder || 'general')
            if (multiple) {
                setSelected(prev => [...prev, url])
                fetchFiles(activeFolder)
            } else {
                onSelect(url)
                onClose()
            }
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Upload failed')
        } finally {
            setUploading(false)
            if (inputRef.current) inputRef.current.value = ''
        }
    }

    const toggleSelect = (url: string) => {
        if (multiple) {
            setSelected(prev =>
                prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]
            )
        } else {
            setSelected([url])
        }
    }

    const handleDelete = async (e: React.MouseEvent, file: MediaFile) => {
        e.stopPropagation()
        if (!window.confirm(`Are you sure you want to permanently delete "${file.name}"? This cannot be undone.`)) return

        setDeleting(file.fullPath)
        try {
            const result = await deleteMediaFile(file.fullPath)
            if (result.success) {
                setFiles(prev => prev.filter(f => f.fullPath !== file.fullPath))
                setSelected(prev => prev.filter(u => u !== file.publicUrl))
            } else {
                alert(result.error || 'Delete failed')
            }
        } catch (err) {
            alert('An error occurred during deletion')
        } finally {
            setDeleting(null)
        }
    }

    const handleConfirmSelection = () => {
        if (selected.length > 0) {
            onSelect(multiple ? selected : selected[0])
            onClose()
        }
    }

    const filteredFiles = files.filter(f => 
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (!open) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[85vh] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 dark:border-gray-800">
                    <div>
                        <h2 className="text-2xl font-bold font-display tracking-tight">Media Library</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Manage and select your media assets</p>
                    </div>
                    <button onClick={onClose} className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all hover:rotate-90">
                        <X size={20} />
                    </button>
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-2 px-8 py-4 border-b border-gray-50 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-950/30 overflow-x-auto hide-scrollbar">
                    <button
                        onClick={() => setActiveFolder('')}
                        className={`shrink-0 text-xs font-bold px-4 py-2 rounded-full transition-all ${activeFolder === '' ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}
                    >
                        All Files
                    </button>
                    {['hero', 'sections', 'general', 'projects'].map(f => (
                        <button
                            key={f}
                            onClick={() => setActiveFolder(f)}
                            className={`shrink-0 text-xs font-bold px-4 py-2 rounded-full transition-all capitalize ${activeFolder === f ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}
                        >
                            {f}
                        </button>
                    ))}
                    
                    <div className="flex-1 min-w-[200px] ml-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search files..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-white dark:bg-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex-1" />
                    <input ref={inputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                    <button
                        onClick={() => inputRef.current?.click()}
                        disabled={uploading}
                        className="shrink-0 flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                    >
                        {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                        {uploading ? 'Uploading...' : 'Upload New'}
                    </button>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-8">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-4">
                            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                            <p className="text-gray-400 font-medium">Scanning folders...</p>
                        </div>
                    ) : filteredFiles.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 text-gray-400">
                            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-3xl flex items-center justify-center mb-6">
                                <FolderOpen size={40} className="opacity-20" />
                            </div>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">No items found</p>
                            <p className="text-sm mt-1 max-w-[240px] text-center">Your media files will appear here once uploaded.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {filteredFiles.map(file => {
                                const isSelected = selected.includes(file.publicUrl)
                                const isDeleting = deleting === file.fullPath

                                return (
                                    <div
                                        key={file.fullPath}
                                        onClick={() => toggleSelect(file.publicUrl)}
                                        className={`group relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer ${isSelected
                                            ? 'border-blue-500 ring-4 ring-blue-500/10 scale-[0.98]'
                                            : 'border-transparent bg-gray-50 dark:bg-gray-800'
                                            }`}
                                    >
                                        <Image
                                            src={file.publicUrl}
                                            alt={file.name}
                                            fill
                                            className={`object-cover transition-transform duration-500 group-hover:scale-110 ${isSelected ? 'opacity-90' : ''}`}
                                            loading="lazy"
                                        />

                                        {/* Select Indicator */}
                                        {isSelected && (
                                            <div className="absolute top-3 right-3 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-xl border-2 border-white animate-in zoom-in duration-200">
                                                <Check size={16} className="text-white" />
                                            </div>
                                        )}

                                        {/* Delete Button */}
                                        <button
                                            onClick={(e) => handleDelete(e, file)}
                                            disabled={isDeleting}
                                            className="absolute top-3 left-3 w-8 h-8 bg-red-500/90 hover:bg-red-600 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0 disabled:opacity-50"
                                        >
                                          {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                        </button>

                                        {/* Info Overlay */}
                                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 transition-opacity duration-300">
                                            <p className="text-white text-[10px] font-bold uppercase tracking-wider mb-0.5 truncate">{file.name}</p>
                                            <p className="text-white/60 text-[9px] font-medium">{(file.size / 1024).toFixed(0)} KB</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-8 py-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/30">
                    <div className="flex flex-col">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {filteredFiles.length} Total Items {searchQuery && `(filtered from ${files.length})`}
                        </p>
                        {selected.length > 0 && (
                            <p className="text-xs font-semibold text-blue-500 animate-in slide-in-from-left duration-200">
                                {selected.length} {selected.length === 1 ? 'item' : 'items'} selected
                            </p>
                        )}
                    </div>
                    <div className="flex gap-4">
                        <button onClick={onClose} className="px-6 py-2.5 text-sm font-bold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmSelection}
                            disabled={selected.length === 0}
                            className="px-8 py-2.5 bg-black dark:bg-white text-white dark:text-black text-sm font-bold rounded-xl hover:opacity-90 transition-all shadow-xl disabled:opacity-20 disabled:cursor-not-allowed transform active:scale-95"
                        >
                            {multiple ? `Select ${selected.length} Images` : 'Select Image'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
