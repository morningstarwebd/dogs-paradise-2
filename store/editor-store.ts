import { create } from 'zustand'
import { SectionData, BlockInstance } from '@/types/schema.types'
import {
    EditorViewport,
    addViewportBlockWithSync,
    removeViewportBlockWithSync,
    reorderViewportBlocksWithSync,
    updateViewportBlockSettingsWithSync,
} from '@/lib/responsive-content'

interface EditorStore {
    isDirty: boolean
    sections: SectionData[]
    activeSectionId: string | null
    activeBlockId: string | null // For nested blocks if needed
    activeBlockIndex: number | null // Index of the currently selected block
    saveStatus: 'idle' | 'saving' | 'saved' | 'error'
    
    setSections: (sections: SectionData[]) => void
    addSection: (section: SectionData) => void
    removeSection: (id: string) => void
    setActiveSection: (id: string | null) => void
    setActiveBlock: (id: string | null, index?: number | null) => void
    updateSectionContent: (id: string, content: Record<string, unknown>) => void
    updateSectionVisibility: (id: string, is_visible: boolean) => void
    reorderSections: (oldIndex: number, newIndex: number) => void
    setSaveStatus: (status: 'idle' | 'saving' | 'saved' | 'error') => void
    setDirty: (isDirty: boolean) => void

    // Block-level CRUD
    addBlock: (sectionId: string, block: BlockInstance, viewport: EditorViewport) => void
    removeBlock: (sectionId: string, blockIndex: number, viewport: EditorViewport) => void
    reorderBlocks: (sectionId: string, oldIndex: number, newIndex: number, viewport: EditorViewport) => void
    updateBlockSettings: (sectionId: string, blockIndex: number, settings: Record<string, unknown>, viewport: EditorViewport) => void
}

export const useEditorStore = create<EditorStore>((set) => ({
    isDirty: false,
    sections: [],
    activeSectionId: null,
    activeBlockId: null,
    activeBlockIndex: null,
    saveStatus: 'idle',

    setSections: (sections) => set({ sections }),
    
    addSection: (section) => 
        set((state) => ({ 
            sections: [...state.sections, section]
        })),
        
    removeSection: (id) =>
        set((state) => ({
            sections: state.sections.filter((s) => s.id !== id),
            activeSectionId: state.activeSectionId === id ? null : state.activeSectionId
        })),

    setActiveSection: (id) => set({ activeSectionId: id, activeBlockId: null, activeBlockIndex: null }),
    setActiveBlock: (id, index = null) => set({ activeBlockId: id, activeBlockIndex: index ?? null }),

    updateSectionContent: (id, content) =>
        set((state) => ({
            isDirty: true,
            sections: state.sections.map((s) =>
                s.id === id ? { ...s, content: { ...s.content, ...content } } : s
            ),
        })),
        
    updateSectionVisibility: (id, is_visible) =>
        set((state) => ({
            sections: state.sections.map((s) =>
                s.id === id ? { ...s, is_visible } : s
            )
        })),

    reorderSections: (oldIndex, newIndex) =>
        set((state) => {
            const newSections = [...state.sections]
            const [movedItem] = newSections.splice(oldIndex, 1)
            newSections.splice(newIndex, 0, movedItem)
            
            const reordered = newSections.map((s, i) => ({...s, sort_order: i}))
            return { sections: reordered, isDirty: true }
        }),

    setSaveStatus: (status) => set({ saveStatus: status }),
    setDirty: (isDirty) => set({ isDirty }),

    // ─── Block-level CRUD ─────────────────────────────────────────

    addBlock: (sectionId, block, viewport) =>
        set((state) => ({
            isDirty: true,
            sections: state.sections.map((s) => {
                if (s.id !== sectionId) return s
                const content = (s.content || {}) as Record<string, unknown>
                return { ...s, content: addViewportBlockWithSync(content, viewport, block) }
            }),
        })),

    removeBlock: (sectionId, blockIndex, viewport) =>
        set((state) => ({
            isDirty: true,
            sections: state.sections.map((s) => {
                if (s.id !== sectionId) return s
                const content = (s.content || {}) as Record<string, unknown>
                return { ...s, content: removeViewportBlockWithSync(content, viewport, blockIndex) }
            }),
            activeBlockIndex: state.activeBlockIndex === blockIndex ? null : state.activeBlockIndex,
            activeBlockId: state.activeBlockIndex === blockIndex ? null : state.activeBlockId,
        })),

    reorderBlocks: (sectionId, oldIndex, newIndex, viewport) =>
        set((state) => ({
            isDirty: true,
            sections: state.sections.map((s) => {
                if (s.id !== sectionId) return s
                const content = (s.content || {}) as Record<string, unknown>
                return { ...s, content: reorderViewportBlocksWithSync(content, viewport, oldIndex, newIndex) }
            }),
        })),

    updateBlockSettings: (sectionId, blockIndex, settings, viewport) =>
        set((state) => ({
            isDirty: true,
            sections: state.sections.map((s) => {
                if (s.id !== sectionId) return s
                const content = (s.content || {}) as Record<string, unknown>
                return { ...s, content: updateViewportBlockSettingsWithSync(content, viewport, blockIndex, settings) }
            }),
        })),
}))
