import { create } from 'zustand'
import { arrayMove } from '@dnd-kit/sortable'

export interface PageSection {
    id: string
    block_type: string
    label: string
    content: Record<string, unknown>
    is_visible: boolean
    sort_order: number
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

interface PageEditorState {
    pageId: string | null
    pageTitle: string
    pageSlug: string
    pagePublished: boolean
    sections: PageSection[]
    activeSectionId: string | null
    activeBlockId: string | null
    saveStatus: SaveStatus

    setPageMeta: (meta: { id: string; title: string; slug: string; published: boolean }) => void
    setSections: (sections: PageSection[]) => void
    setActiveSection: (id: string | null) => void
    setActiveBlock: (id: string | null) => void
    updateSectionContent: (sectionId: string, content: Record<string, unknown>) => void
    updateSectionVisibility: (sectionId: string, visible: boolean) => void
    reorderSections: (oldIndex: number, newIndex: number) => void
    addSection: (section: PageSection) => void
    removeSection: (sectionId: string) => void
    setSaveStatus: (status: SaveStatus) => void
}

export const usePageEditorStore = create<PageEditorState>((set) => ({
    pageId: null,
    pageTitle: '',
    pageSlug: '',
    pagePublished: false,
    sections: [],
    activeSectionId: null,
    activeBlockId: null,
    saveStatus: 'idle',

    setPageMeta: (meta) =>
        set({ pageId: meta.id, pageTitle: meta.title, pageSlug: meta.slug, pagePublished: meta.published }),

    setSections: (sections) => set({ sections }),

    setActiveSection: (id) => set({ activeSectionId: id, activeBlockId: null }),
    setActiveBlock: (id) => set({ activeBlockId: id }),

    updateSectionContent: (sectionId, content) =>
        set((state) => ({
            sections: state.sections.map((s) =>
                s.id === sectionId ? { ...s, content } : s
            ),
        })),

    updateSectionVisibility: (sectionId, visible) =>
        set((state) => ({
            sections: state.sections.map((s) =>
                s.id === sectionId ? { ...s, is_visible: visible } : s
            ),
        })),

    addSection: (section) =>
        set((state) => ({
            sections: [...state.sections, section],
        })),

    removeSection: (sectionId) =>
        set((state) => ({
            sections: state.sections.filter((s) => s.id !== sectionId),
            activeSectionId: state.activeSectionId === sectionId ? null : state.activeSectionId,
        })),

    reorderSections: (oldIndex, newIndex) =>
        set((state) => {
            const reordered = arrayMove(state.sections, oldIndex, newIndex).map(
                (s, i) => ({ ...s, sort_order: i })
            )
            return { sections: reordered }
        }),

    setSaveStatus: (status) => set({ saveStatus: status }),
}))
