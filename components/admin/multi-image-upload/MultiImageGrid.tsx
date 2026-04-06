import Image from 'next/image'
import { GripVertical, Star, X } from 'lucide-react'

interface MultiImageGridProps {
    dragIndex: number | null
    images: string[]
    primaryIndex: number
    onDragEnd: () => void
    onDragOver: (event: React.DragEvent, index: number) => void
    onDragStart: (index: number) => void
    onRemove: (index: number) => void
    onSetPrimary: (index: number) => void
}

export function MultiImageGrid({
    dragIndex,
    images,
    primaryIndex,
    onDragEnd,
    onDragOver,
    onDragStart,
    onRemove,
    onSetPrimary,
}: MultiImageGridProps) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((url, index) => (
                <div
                    key={`${url}-${index}`}
                    draggable
                    onDragStart={() => onDragStart(index)}
                    onDragOver={(event) => onDragOver(event, index)}
                    onDragEnd={onDragEnd}
                    className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-move ${
                        index === primaryIndex
                            ? 'border-amber-400 ring-2 ring-amber-400/30'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    } ${dragIndex === index ? 'opacity-50 scale-95' : ''}`}
                >
                    <Image src={url} alt={`Image ${index + 1}`} fill className="object-cover" loading="lazy" />

                    {index === primaryIndex && (
                        <div className="absolute top-2 left-2 bg-amber-400 text-black text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                            <Star size={12} fill="currentColor" />
                            Primary
                        </div>
                    )}

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        <div className="absolute top-2 left-2 p-1.5 bg-white/90 rounded-lg cursor-grab">
                            <GripVertical size={14} className="text-gray-600" />
                        </div>
                        {index !== primaryIndex && (
                            <button
                                type="button"
                                onClick={() => onSetPrimary(index)}
                                className="p-2 bg-amber-400 hover:bg-amber-500 rounded-lg transition-colors"
                                title="Set as primary"
                            >
                                <Star size={16} className="text-black" />
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => onRemove(index)}
                            className="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                            title="Remove image"
                        >
                            <X size={16} className="text-white" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}
