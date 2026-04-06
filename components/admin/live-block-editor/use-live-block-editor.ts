'use client'

import { useEffect, useMemo, useState } from 'react'
import type { DragEndEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import type { LiveBlockEditorProps } from './types'

type EditorDependencies = Pick<LiveBlockEditorProps, 'blocks' | 'contentKey' | 'onReorder' | 'sectionId'>

export function useLiveBlockEditor({
    blocks,
    contentKey,
    onReorder,
    sectionId,
}: EditorDependencies) {
    const [isInIframe, setIsInIframe] = useState(false)
    const itemIds = useMemo(() => blocks.map((_, index) => `live-block-${index}`), [blocks])

    useEffect(() => {
        const frameId = window.requestAnimationFrame(() => {
            const params = new URLSearchParams(window.location.search)
            setIsInIframe(params.get('preview') === 'true')
        })

        return () => window.cancelAnimationFrame(frameId)
    }, [])

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const oldIndex = itemIds.indexOf(active.id as string)
        const newIndex = itemIds.indexOf(over.id as string)
        const nextBlocks = arrayMove(blocks, oldIndex, newIndex)

        onReorder?.(nextBlocks)

        if (isInIframe) {
            window.parent.postMessage(
                {
                    type: 'UPDATE_SECTION_CONTENT_PARTIAL',
                    sectionId,
                    partialContent: { [contentKey]: nextBlocks },
                },
                window.location.origin,
            )
        }
    }

    const handleBlockClick = (blockId: string) => {
        if (!isInIframe) return

        window.parent.postMessage(
            { type: 'SELECT_BLOCK', sectionId, blockId },
            window.location.origin,
        )
    }

    return {
        isInIframe,
        itemIds,
        handleBlockClick,
        handleDragEnd,
    }
}
