import type { ReactNode } from 'react'

export interface LiveBlockEditorProps {
    sectionId: string
    contentKey: string
    blocks: Record<string, unknown>[]
    direction: 'horizontal' | 'vertical' | 'grid'
    className?: string
    renderBlock: (block: Record<string, unknown>, index: number) => ReactNode
    onReorder?: (newBlocks: Record<string, unknown>[]) => void
    blockClassName?: (block: Record<string, unknown>) => string
    activeBlockId?: string
}
