import { FolderOpen, Loader2, Upload } from 'lucide-react'

interface MultiImageUploadDropzoneProps {
    dragOver: boolean
    inputRef: React.RefObject<HTMLInputElement | null>
    remainingSlots: number
    uploadProgress: number
    uploading: boolean
    onDragLeave: () => void
    onDragOver: (event: React.DragEvent) => void
    onDrop: (event: React.DragEvent) => void
    onOpenLibrary: () => void
    onSelectFiles: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export function MultiImageUploadDropzone({
    dragOver,
    inputRef,
    remainingSlots,
    uploadProgress,
    uploading,
    onDragLeave,
    onDragOver,
    onDrop,
    onOpenLibrary,
    onSelectFiles,
}: MultiImageUploadDropzoneProps) {
    return (
        <div className="space-y-3">
            <div
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onClick={() => !uploading && inputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                    dragOver
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/20'
                } ${uploading ? 'pointer-events-none opacity-60' : ''}`}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    onChange={onSelectFiles}
                    className="hidden"
                />

                {uploading ? (
                    <>
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        <div className="w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                            <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                        </div>
                        <span className="text-sm text-gray-500">Uploading... {uploadProgress}%</span>
                    </>
                ) : (
                    <>
                        <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <Upload className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="text-center">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Drop images here or click to upload
                            </span>
                            <p className="text-xs text-gray-400 mt-1">
                                JPG, PNG, WebP, GIF — Max 5MB each — {remainingSlots} slots remaining
                            </p>
                        </div>
                    </>
                )}
            </div>

            <button
                type="button"
                onClick={onOpenLibrary}
                disabled={uploading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all disabled:opacity-50"
            >
                <FolderOpen size={18} />
                Choose from Media Library
            </button>
        </div>
    )
}
