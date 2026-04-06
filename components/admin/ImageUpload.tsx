'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, ImageIcon, FolderOpen } from 'lucide-react'
import { uploadToSupabase } from '@/lib/upload'
import { MediaPickerModal } from './MediaPickerModal'

type ImageUploadProps = {
    value?: string
    onChange: (url: string) => void
    folder?: string
}

export function ImageUpload({ value, onChange, folder = 'sections' }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState<string | null>(null)
    const [showPicker, setShowPicker] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setError(null)
        setUploading(true)
        setProgress(30)

        try {
            setProgress(60)
            const url = await uploadToSupabase(file, folder)
            setProgress(100)
            onChange(url)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed')
        } finally {
            setUploading(false)
            setProgress(0)
            if (inputRef.current) inputRef.current.value = ''
        }
    }

    const handleRemove = () => {
        onChange('')
    }

    return (
        <div className="space-y-2">
            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleUpload}
                className="hidden"
            />

            {!value ? (
                <div className="space-y-2">
                    {/* Upload button */}
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        disabled={uploading}
                        className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 flex flex-col items-center gap-2 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploading ? (
                            <>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <span className="text-sm text-gray-500">Uploading...</span>
                            </>
                        ) : (
                            <>
                                <Upload className="w-7 h-7 text-gray-400" />
                                <span className="text-sm text-gray-500 font-medium">Click to upload image</span>
                                <span className="text-xs text-gray-400">JPG, PNG, WebP, GIF — Max 5MB</span>
                            </>
                        )}
                    </button>

                    {/* Choose from library button */}
                    <button
                        type="button"
                        onClick={() => setShowPicker(true)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                    >
                        <FolderOpen size={16} />
                        Choose from Library
                    </button>
                </div>
            ) : (
                <div className="relative h-48 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    <Image src={value} alt="Uploaded" fill className="object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors group flex items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => setShowPicker(true)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black text-xs font-semibold px-4 py-2 rounded-lg"
                        >
                            <FolderOpen size={14} className="inline mr-1.5" />
                            Library
                        </button>
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black text-xs font-semibold px-4 py-2 rounded-lg"
                        >
                            <ImageIcon size={14} className="inline mr-1.5" />
                            Change
                        </button>
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white text-xs font-semibold px-4 py-2 rounded-lg"
                        >
                            <X size={14} className="inline mr-1.5" />
                            Remove
                        </button>
                    </div>
                </div>
            )}

            {error && (
                <p className="text-sm text-red-500 font-medium">{error}</p>
            )}

            {/* Media Picker Modal */}
            <MediaPickerModal
                open={showPicker}
                onClose={() => setShowPicker(false)}
                onSelect={(url) => {
                    onChange(url)
                    setShowPicker(false)
                }}
                folder={folder}
            />
        </div>
    )
}
