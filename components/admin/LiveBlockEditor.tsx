'use client';

import { useState, useEffect, ReactNode } from 'react';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    useSortable,
    horizontalListSortingStrategy,
    verticalListSortingStrategy,
    rectSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────
interface LiveBlockEditorProps {
    /** The section_id (e.g. 'footer') so we know which section to update */
    sectionId: string;
    /** The content key that holds the blocks array (e.g. 'blocks' or 'mobile_blocks') */
    contentKey: string;
    /** The current blocks array */
    blocks: Record<string, unknown>[];
    /** Direction of the sortable list */
    direction: 'horizontal' | 'vertical' | 'grid';
    /** CSS class for the container grid/flex */
    className?: string;
    /** Render function for each block */
    renderBlock: (block: Record<string, unknown>, index: number) => ReactNode;
    /** Optional callback when blocks are reordered (for local state sync) */
    onReorder?: (newBlocks: Record<string, unknown>[]) => void;
    /** Optional function to calculate class name for the block wrapper */
    blockClassName?: (block: Record<string, unknown>) => string;
    /** The currently active child block ID (for highlighting) */
    activeBlockId?: string;
}

// ─── Sortable Item Wrapper ──────────────────────────────────────
function SortableBlockItem({
    id,
    children,
    isEditing,
    isActive,
    onClick,
    className = '',
}: {
    id: string;
    children: ReactNode;
    isEditing: boolean;
    isActive?: boolean;
    onClick?: () => void;
    className?: string;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        position: 'relative' as const,
    };

    if (!isEditing) {
        return <div className={className}>{children}</div>;
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group/sortable relative ${className}`}
            onClick={(e) => {
                // Prevent interfering with drag events, but allow clicking the block
                e.stopPropagation();
                onClick?.();
            }}
        >
            {/* Drag Handle - Blue when active, gray otherwise */}
            <div
                {...attributes}
                {...listeners}
                className={`absolute -top-3 left-1/2 -translate-x-1/2 z-50 rounded-full p-1 cursor-grab active:cursor-grabbing shadow-lg transition-opacity ${isActive ? 'bg-blue-500 text-white opacity-100' : 'bg-gray-800 text-white opacity-0 group-hover/sortable:opacity-100'
                    }`}
                title="Drag to reorder"
                onClick={(e) => e.stopPropagation()} // don't trigger block select when clicking drag handle
            >
                <GripVertical className="w-4 h-4" />
            </div>
            {/* Hover/Active ring */}
            <div className={`rounded-lg transition-all ${isActive ? 'ring-2 ring-blue-500 bg-blue-50/10' : 'ring-0 group-hover/sortable:ring-2 ring-blue-400/50'
                }`}>
                {children}
            </div>
        </div>
    );
}

// ─── Main Component ─────────────────────────────────────────────
export function LiveBlockEditor({
    sectionId,
    contentKey,
    blocks,
    direction,
    className,
    renderBlock,
    onReorder,
    blockClassName,
    activeBlockId,
}: LiveBlockEditorProps) {
    const [isInIframe, setIsInIframe] = useState(false);

    useEffect(() => {
        // Use ?preview=true to detect admin CMS editor instead of window.parent !== window.
        // Vercel Preview Deployments also wrap the site in an iframe (for their Comments Toolbar),
        // which falsely triggered admin DnD for public visitors.
        const params = new URLSearchParams(window.location.search);
        setIsInIframe(params.get('preview') === 'true'); // eslint-disable-line react-hooks/set-state-in-effect
    }, []);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    );

    const itemIds = blocks.map((_, i) => `live-block-${i}`);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = itemIds.indexOf(active.id as string);
        const newIndex = itemIds.indexOf(over.id as string);
        const newBlocks = arrayMove(blocks, oldIndex, newIndex);

        // Notify local state
        onReorder?.(newBlocks);

        // Notify parent admin panel via postMessage
        if (isInIframe) {
            window.parent.postMessage(
                {
                    type: 'UPDATE_SECTION_CONTENT_PARTIAL',
                    sectionId,
                    partialContent: { [contentKey]: newBlocks },
                },
                window.location.origin
            );
        }
    };

    // Define click handler to notify parent admin panel
    const handleBlockClick = (blockId: string) => {
        if (isInIframe) {
            window.parent.postMessage(
                { type: 'SELECT_BLOCK', sectionId, blockId },
                window.location.origin
            );
        }
    };

    // If not in iframe, render blocks without DND
    if (!isInIframe) {
        return (
            <div className={className}>
                {blocks.map((block, idx) => (
                    <SortableBlockItem
                        key={`live-block-${idx}`}
                        id={`live-block-${idx}`}
                        isEditing={false}
                        className={blockClassName ? blockClassName(block) : ''}
                    >
                        {renderBlock(block, idx)}
                    </SortableBlockItem>
                ))}
            </div>
        );
    }

    // In iframe: wrap with DND context
    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={itemIds}
                strategy={direction === 'grid' ? rectSortingStrategy : direction === 'horizontal' ? horizontalListSortingStrategy : verticalListSortingStrategy}
            >
                <div className={className}>
                    {blocks.map((block, idx) => (
                        <SortableBlockItem
                            key={`live-block-${idx}`}
                            id={`live-block-${idx}`}
                            isEditing={isInIframe}
                            isActive={`live-block-${idx}` === activeBlockId}
                            onClick={() => handleBlockClick(`live-block-${idx}`)}
                            className={blockClassName ? blockClassName(block) : ''}
                        >
                            {renderBlock(block, idx)}
                        </SortableBlockItem>
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}
