'use client'

import { useRef, useState } from 'react'
import { MediaPickerModal } from './MediaPickerModal'
import { uploadToSupabase } from '@/lib/upload'
import type { MultiImageUploadProps } from './multi-image-upload/types'
import {
    getAdjustedPrimaryIndexAfterRemoval,
    getAdjustedPrimaryIndexAfterReorder,
    reorderImages,
} from './multi-image-upload/image-order'
import { MultiImageGrid } from './multi-image-upload/MultiImageGrid'
import { MultiImageUploadDropzone } from './multi-image-upload/MultiImageUploadDropzone'

export function MultiImageUpload({
    value = [],
    onChange,
    primaryIndex = 0,
    onPrimaryChange,
    folder = 'projects',
    maxImages = 10,
}: MultiImageUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [showPicker, setShowPicker] = useState(false)
    const [dragOver, setDragOver] = useState(false)
    const [dragIndex, setDragIndex] = useState<number | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleUpload = async (files: FileList | File[]) => {
        const fileArray = Array.from(files)
        const remainingSlots = maxImages - value.length
        const filesToUpload = fileArray.slice(0, remainingSlots)
        if (filesToUpload.length === 0) return alert(`Maximum ${maxImages} images allowed`)

        setUploading(true)
        setUploadProgress(0)

        const newUrls: string[] = []
        for (let index = 0; index < filesToUpload.length; index += 1) {
            try {
                const url = await uploadToSupabase(filesToUpload[index], folder)
                newUrls.push(url)
                setUploadProgress(Math.round(((index + 1) / filesToUpload.length) * 100))
            } catch (error) {
                console.error('Upload failed:', error)
            }
        }

        if (newUrls.length > 0) onChange([...value, ...newUrls])
        setUploading(false)
        setUploadProgress(0)
        if (inputRef.current) inputRef.current.value = ''
    }

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault()
        setDragOver(false)
        if (event.dataTransfer.files) handleUpload(event.dataTransfer.files)
    }

    const removeImage = (index: number) => {
        const nextImages = value.filter((_, imageIndex) => imageIndex !== index)
        onChange(nextImages)
        if (onPrimaryChange) {
            onPrimaryChange(getAdjustedPrimaryIndexAfterRemoval(primaryIndex, index, nextImages.length))
        }
    }

    const handleReorderDragOver = (event: React.DragEvent, index: number) => {
        event.preventDefault()
        if (dragIndex === null || dragIndex === index) return

        const nextImages = reorderImages(value, dragIndex, index)
        onChange(nextImages)
        if (onPrimaryChange) {
            onPrimaryChange(getAdjustedPrimaryIndexAfterReorder(primaryIndex, dragIndex, index))
        }
        setDragIndex(index)
    }

    return (
        <div className="space-y-4">
            {value.length > 0 && (
                <MultiImageGrid
                    dragIndex={dragIndex}
                    images={value}
                    primaryIndex={primaryIndex}
                    onDragEnd={() => setDragIndex(null)}
                    onDragOver={handleReorderDragOver}
                    onDragStart={setDragIndex}
                    onRemove={removeImage}
                    onSetPrimary={(index) => onPrimaryChange?.(index)}
                />
            )}

            {value.length < maxImages && (
                <MultiImageUploadDropzone
                    dragOver={dragOver}
                    inputRef={inputRef}
                    remainingSlots={maxImages - value.length}
                    uploadProgress={uploadProgress}
                    uploading={uploading}
                    onDragLeave={() => setDragOver(false)}
                    onDragOver={(event) => {
                        event.preventDefault()
                        setDragOver(true)
                    }}
                    onDrop={handleDrop}
                    onOpenLibrary={() => setShowPicker(true)}
                    onSelectFiles={(event) => event.target.files && handleUpload(event.target.files)}
                />
            )}

            {value.length >= maxImages && (
                <p className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-4 py-2 rounded-lg">
                    Maximum {maxImages} images reached. Remove some to add more.
                </p>
            )}

            <MediaPickerModal
                open={showPicker}
                onClose={() => setShowPicker(false)}
                onSelect={(url) => {
                    if (value.length < maxImages) onChange([...value, url])
                    setShowPicker(false)
                }}
                folder={folder}
            />
        </div>
    )
}
