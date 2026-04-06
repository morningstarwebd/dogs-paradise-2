'use client'

import {
    DndContext,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import {
    SortableContext,
    horizontalListSortingStrategy,
    rectSortingStrategy,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { SortableBlockItem } from './live-block-editor/SortableBlockItem'
import type { LiveBlockEditorProps } from './live-block-editor/types'
import { useLiveBlockEditor } from './live-block-editor/use-live-block-editor'

export function LiveBlockEditor({
    activeBlockId,
    blockClassName,
    blocks,
    className,
    contentKey,
    direction,
    onReorder,
    renderBlock,
    sectionId,
}: LiveBlockEditorProps) {
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))
    const { handleBlockClick, handleDragEnd, isInIframe, itemIds } = useLiveBlockEditor({
        blocks,
        contentKey,
        onReorder,
        sectionId,
    })

    const content = (
        <div className={className}>
            {blocks.map((block, index) => (
                <SortableBlockItem
                    key={`live-block-${index}`}
                    id={`live-block-${index}`}
                    isEditing={isInIframe}
                    isActive={`live-block-${index}` === activeBlockId}
                    onClick={() => handleBlockClick(`live-block-${index}`)}
                    className={blockClassName ? blockClassName(block) : ''}
                >
                    {renderBlock(block, index)}
                </SortableBlockItem>
            ))}
        </div>
    )

    if (!isInIframe) {
        return content
    }

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
                items={itemIds}
                strategy={direction === 'grid' ? rectSortingStrategy : direction === 'horizontal' ? horizontalListSortingStrategy : verticalListSortingStrategy}
            >
                {content}
            </SortableContext>
        </DndContext>
    )
}
