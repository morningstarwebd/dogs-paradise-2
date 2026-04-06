import type { ReactNode } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

interface SortableBlockItemProps {
    id: string
    children: ReactNode
    isEditing: boolean
    isActive?: boolean
    onClick?: () => void
    className?: string
}

export function SortableBlockItem({
    id,
    children,
    isEditing,
    isActive,
    onClick,
    className = '',
}: SortableBlockItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

    if (!isEditing) {
        return <div className={className}>{children}</div>
    }

    return (
        <div
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
                opacity: isDragging ? 0.5 : 1,
                position: 'relative',
            }}
            className={`group/sortable relative ${className}`}
            onClick={(event) => {
                event.stopPropagation()
                onClick?.()
            }}
        >
            <div
                {...attributes}
                {...listeners}
                className={`absolute -top-3 left-1/2 -translate-x-1/2 z-50 rounded-full p-1 cursor-grab active:cursor-grabbing shadow-lg transition-opacity ${
                    isActive ? 'bg-blue-500 text-white opacity-100' : 'bg-gray-800 text-white opacity-0 group-hover/sortable:opacity-100'
                }`}
                title="Drag to reorder"
                onClick={(event) => event.stopPropagation()}
            >
                <GripVertical className="w-4 h-4" />
            </div>
            <div className={`rounded-lg transition-all ${isActive ? 'ring-2 ring-blue-500 bg-blue-50/10' : 'ring-0 group-hover/sortable:ring-2 ring-blue-400/50'}`}>
                {children}
            </div>
        </div>
    )
}
