'use client'

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useEditorStore } from '@/store/editor-store'
import { BlockRegistry, getSchemaWithLiquidBg } from '@/components/blocks/registry'
import { SectionData, getSectionBlockType, BlockInstance, isFixedWebsiteSection } from '@/types/schema.types'
import { EditorViewport, getViewportContent, updateViewportFieldsWithSync } from '@/lib/responsive-content'
import { GripVertical, Eye, EyeOff, Loader2, Check, AlertCircle, Monitor, Smartphone, ArrowLeft, Plus, Trash2, PanelLeftOpen, Globe, Lock } from 'lucide-react'
import Link from 'next/link'
import {
    saveSectionContent,
    toggleSectionVisibility,
    deleteSection as deleteSectionAction,
    reorderSections as reorderSectionsAction,
    addSection as addSectionAction,
    publishSection as publishSectionAction,
    unpublishSection as unpublishSectionAction
} from '@/actions/sections'

import {
    DndContext,
    closestCenter,
    PointerSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core'
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { SchemaFormBuilder } from '@/components/admin/SchemaFormBuilder'

const DESKTOP_ONLY_FIELD_KEYS = new Set([
    'decorative_blob_enabled',
    'decorative_blob_color',
    'decorative_blob_size_scale',
    'decorative_shape_top_offset_x',
    'decorative_shape_top_offset_y',
    'decorative_shape_bottom_offset_x',
    'decorative_shape_bottom_offset_y',
    'decorative_outline_enabled',
    'decorative_outline_color',
    'decorative_outline_size_scale',
])

const YELLOW_DECORATIVE_FIELD_KEYS = new Set([
    'decorative_shape_top_offset_x',
    'decorative_shape_top_offset_y',
    'decorative_shape_bottom_offset_x',
    'decorative_shape_bottom_offset_y',
    'decorative_outline_enabled',
    'decorative_outline_color',
    'decorative_outline_size_scale',
])

const BOTTOM_DECORATIVE_FIELD_KEYS = new Set([
    'decorative_shape_bottom_offset_x',
    'decorative_shape_bottom_offset_y',
])

const YELLOW_DECORATIVE_SECTION_TYPES = new Set([
    'hero',
    'breed-explorer',
    'happy-stories',
    'image-hotspot',
])

const BOTTOM_DECORATIVE_SECTION_TYPES = new Set([
    'breed-explorer',
    'happy-stories',
    'image-hotspot',
])

const GOLD_DUST_VISUAL_PRESETS = new Set([
    'black-gold-dust-soft',
    'black-gold-dust-rich',
])

function isDesktopOnlyFieldKey(key: string): boolean {
    return key.startsWith('desktop_') || DESKTOP_ONLY_FIELD_KEYS.has(key)
}

function isMobileOnlyFieldKey(key: string): boolean {
    return key.startsWith('mobile_')
}

export default function ThemeEditorPage() {
    const {
        sections,
        activeSectionId,
        saveStatus,
        setSections,
        setActiveSection,
        setActiveBlock,
        updateSectionContent,
        updateSectionVisibility,
        removeSection,
        setSaveStatus,
        addBlock,
        removeBlock,
        reorderBlocks,
        updateBlockSettings,
    } = useEditorStore()

    const [loading, setLoading] = useState(true)
    const [focusedField, setFocusedField] = useState<string | null>(null)
    const [focusedBlockId_local, setFocusedBlockId] = useState<string | null>(null)
    const [focusedBlockIndex_local, setFocusedBlockIndex] = useState<number | null>(null)
    const [viewport, setViewport] = useState<EditorViewport>('desktop')
    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false)
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const iframeRef = useRef<HTMLIFrameElement>(null)
    const supabase = useMemo(() => createClient(), [])

    // Sync live preview
    useEffect(() => {
        if (iframeRef.current?.contentWindow && !loading) {
            iframeRef.current.contentWindow.postMessage(
                { type: 'LIVE_PREVIEW_UPDATE', sections, viewport },
                window.location.origin
            )
        }
    }, [sections, loading, viewport])

    useEffect(() => {
        if (iframeRef.current?.contentWindow && !loading) {
            iframeRef.current.contentWindow.postMessage(
                { type: 'SET_PREVIEW_VIEWPORT', viewport },
                window.location.origin
            )
        }
    }, [viewport, loading])

    // Listen to iframe select events
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return
            if (event.source !== iframeRef.current?.contentWindow) return
            
            if (event.data?.type === 'SELECT_SECTION') {
                setActiveSection(event.data.sectionId)
            } else if (event.data?.type === 'FOCUS_FIELD') {
                setActiveSection(event.data.sectionId)
                setFocusedField(event.data.fieldKey)
                setFocusedBlockId(null)
                setFocusedBlockIndex(null)
                setTimeout(() => setFocusedField(null), 100)
            } else if (event.data?.type === 'FOCUS_BLOCK') {
                // Shopify-style: focus a specific block in the right panel
                setActiveSection(event.data.sectionId)
                setActiveBlock(event.data.blockId, event.data.blockIndex)
                setFocusedBlockId(event.data.blockId)
                setFocusedBlockIndex(event.data.blockIndex ?? 0)
                // Clear after animation
                setTimeout(() => {
                    setFocusedBlockId(null)
                    setFocusedBlockIndex(null)
                }, 100)
            } else if (event.data?.type === 'REQUEST_CONTENT_UPDATE') {
                const newContent = { [event.data.key]: event.data.value }
                
                const store = useEditorStore.getState()
                const section = store.sections.find((s) => s.id === event.data.sectionId)
                if (section) {
                    const baseContent = (section.content || {}) as Record<string, unknown>
                    const merged = updateViewportFieldsWithSync(baseContent, viewport, newContent)
                    store.updateSectionContent(event.data.sectionId, merged)
                    
                    setSaveStatus('saving')
                    saveSectionContent(event.data.sectionId, merged).then(res => {
                        if (res.success) {
                            setSaveStatus('saved')
                            setTimeout(() => setSaveStatus('idle'), 2000)
                        } else {
                            setSaveStatus('error')
                        }
                    })
                }
            } else if (event.data?.type === 'REQUEST_CONTENT_UPDATE_MULTIPLE') {
                const store = useEditorStore.getState()
                const section = store.sections.find((s) => s.id === event.data.sectionId)
                if (section) {
                    const baseContent = (section.content || {}) as Record<string, unknown>
                    const merged = updateViewportFieldsWithSync(baseContent, viewport, event.data.updates as Record<string, unknown>)
                    store.updateSectionContent(event.data.sectionId, merged)
                    
                    setSaveStatus('saving')
                    saveSectionContent(event.data.sectionId, merged).then(res => {
                        if (res.success) {
                            setSaveStatus('saved')
                            setTimeout(() => setSaveStatus('idle'), 2000)
                        } else {
                            setSaveStatus('error')
                        }
                    })
                }
            }
        }
        window.addEventListener('message', handleMessage)
        return () => window.removeEventListener('message', handleMessage)
    }, [setActiveSection, setActiveBlock, setSaveStatus, viewport])

    // Fetch initial
    useEffect(() => {
        async function fetchSections() {
            const { data, error } = await supabase
                .from('website_sections')
                .select('*')
                .order('sort_order', { ascending: true })

            if (!error && data) {
                let nextSections = data as SectionData[]

                if (!nextSections.some((section) => getSectionBlockType(section) === 'header')) {
                    const { data: insertedHeader } = await supabase
                        .from('website_sections')
                        .insert({
                            section_id: 'header',
                            block_type: 'header',
                            label: 'Header',
                            content: {},
                            is_visible: true,
                            status: 'published',
                            sort_order: -1,
                        })
                        .select('*')
                        .single()

                    if (insertedHeader) {
                        nextSections = [insertedHeader as SectionData, ...nextSections]
                    }
                }

                if (!nextSections.some((section) => getSectionBlockType(section) === 'footer')) {
                    const { data: insertedFooter } = await supabase
                        .from('website_sections')
                        .insert({
                            section_id: 'footer',
                            block_type: 'footer',
                            label: 'Footer',
                            content: {},
                            is_visible: true,
                            status: 'published',
                            sort_order: 999,
                        })
                        .select('*')
                        .single()

                    if (insertedFooter) {
                        nextSections = [...nextSections, insertedFooter as SectionData]
                    }
                }

                const orderedSections = [...nextSections].sort((a, b) => a.sort_order - b.sort_order)

                setSections(orderedSections)
                if (orderedSections.length > 0 && !activeSectionId) {
                    setActiveSection(orderedSections[0].id)
                }
            }
            setLoading(false)
        }
        fetchSections()
    }, [supabase, setSections, setActiveSection, activeSectionId])

    const saveSection = useCallback(
        async (sectionId: string, content: Record<string, unknown>) => {
            setSaveStatus('saving')
            const result = await saveSectionContent(sectionId, content)
            if (!result.success) {
                setSaveStatus('error')
            } else {
                setSaveStatus('saved')
                setTimeout(() => setSaveStatus('idle'), 2000)
            }
        }, [setSaveStatus]
    )

    const handleContentChange = useCallback(
        (sectionId: string, key: string, value: unknown) => {
            const section = useEditorStore.getState().sections.find((s) => s.id === sectionId)
            if (!section) return

            const baseContent = (section.content || {}) as Record<string, unknown>
            const nextContent = updateViewportFieldsWithSync(baseContent, viewport, { [key]: value })

            updateSectionContent(sectionId, nextContent)

            // live update iframe partial
            if (iframeRef.current?.contentWindow) {
                iframeRef.current.contentWindow.postMessage(
                    {
                        type: 'UPDATE_SECTION_CONTENT_PARTIAL',
                        sectionId,
                        partialContent: { [key]: value },
                        viewport,
                    },
                    window.location.origin
                )
            }

            if (debounceRef.current) clearTimeout(debounceRef.current)
            debounceRef.current = setTimeout(() => {
                saveSection(sectionId, nextContent)
            }, 800)
        }, [saveSection, updateSectionContent, viewport]
    )

    // ─── Block-level handlers ─────────────────────────────────────
    const handleBlockAdd = useCallback(
        (sectionId: string, block: BlockInstance) => {
            addBlock(sectionId, block, viewport)
            // Immediately sync iframe
            if (iframeRef.current?.contentWindow) {
                iframeRef.current.contentWindow.postMessage(
                    {
                        type: 'LIVE_PREVIEW_UPDATE',
                        sections: useEditorStore.getState().sections,
                        viewport,
                    },
                    window.location.origin
                )
            }
            // Trigger save of full content (including blocks)
            if (debounceRef.current) clearTimeout(debounceRef.current)
            debounceRef.current = setTimeout(() => {
                const section = useEditorStore.getState().sections.find(s => s.id === sectionId)
                if (section) {
                    saveSection(sectionId, section.content as Record<string, unknown>)
                }
            }, 300)
        }, [addBlock, saveSection, viewport]
    )

    const handleBlockRemove = useCallback(
        (sectionId: string, blockIndex: number) => {
            removeBlock(sectionId, blockIndex, viewport)
            if (iframeRef.current?.contentWindow) {
                iframeRef.current.contentWindow.postMessage(
                    {
                        type: 'LIVE_PREVIEW_UPDATE',
                        sections: useEditorStore.getState().sections,
                        viewport,
                    },
                    window.location.origin
                )
            }
            if (debounceRef.current) clearTimeout(debounceRef.current)
            debounceRef.current = setTimeout(() => {
                const section = useEditorStore.getState().sections.find(s => s.id === sectionId)
                if (section) {
                    saveSection(sectionId, section.content as Record<string, unknown>)
                }
            }, 300)
        }, [removeBlock, saveSection, viewport]
    )

    const handleBlockReorder = useCallback(
        (sectionId: string, oldIndex: number, newIndex: number) => {
            reorderBlocks(sectionId, oldIndex, newIndex, viewport)
            if (iframeRef.current?.contentWindow) {
                iframeRef.current.contentWindow.postMessage(
                    {
                        type: 'LIVE_PREVIEW_UPDATE',
                        sections: useEditorStore.getState().sections,
                        viewport,
                    },
                    window.location.origin
                )
            }
            if (debounceRef.current) clearTimeout(debounceRef.current)
            debounceRef.current = setTimeout(() => {
                const section = useEditorStore.getState().sections.find(s => s.id === sectionId)
                if (section) {
                    saveSection(sectionId, section.content as Record<string, unknown>)
                }
            }, 300)
        }, [reorderBlocks, saveSection, viewport]
    )

    const handleBlockUpdate = useCallback(
        (sectionId: string, blockIndex: number, settings: Record<string, unknown>) => {
            updateBlockSettings(sectionId, blockIndex, settings, viewport)
            
            if (iframeRef.current?.contentWindow) {
                iframeRef.current.contentWindow.postMessage(
                    {
                        type: 'LIVE_PREVIEW_UPDATE',
                        sections: useEditorStore.getState().sections,
                        viewport,
                    },
                    window.location.origin
                )
            }

            if (debounceRef.current) clearTimeout(debounceRef.current)
            debounceRef.current = setTimeout(() => {
                const section = useEditorStore.getState().sections.find(s => s.id === sectionId)
                if (section) {
                    saveSection(sectionId, section.content as Record<string, unknown>)
                }
            }, 800)
        }, [updateBlockSettings, saveSection, viewport]
    )

    const handleVisibilityToggle = async (sectionId: string, visible: boolean) => {
        updateSectionVisibility(sectionId, visible)
        await toggleSectionVisibility(sectionId, visible)
    }

    const handleDeleteSection = async (sectionId: string) => {
        if (!confirm('Delete this section completely from Dogs Paradise Home?')) return
        setSaveStatus('saving')
        const result = await deleteSectionAction(sectionId)
        if (!result.success) {
            setSaveStatus('error')
            alert('Failed to delete: ' + result.error)
            return
        }
        removeSection(sectionId)
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2000)
    }

    const handlePublishToggle = async (sectionId: string, currentStatus: string) => {
        setSaveStatus('saving')
        const action = currentStatus === 'published' ? unpublishSectionAction : publishSectionAction
        const result = await action(sectionId)
        if (!result.success) {
            setSaveStatus('error')
            return
        }
        const nextStatus: SectionData['status'] = currentStatus === 'published' ? 'draft' : 'published'
        const updatedSections = [...sections].map(s =>
            s.id === sectionId ? { ...s, status: nextStatus } : s
        )
        setSections(updatedSections)
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2000)
    }

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const fixedHeader = sections.find((s) => getSectionBlockType(s) === 'header')
        const fixedFooter = sections.find((s) => getSectionBlockType(s) === 'footer')
        const editable = sections.filter((s) => !isFixedWebsiteSection(s))

        const oldIndex = editable.findIndex((s) => s.id === active.id)
        const newIndex = editable.findIndex((s) => s.id === over.id)
        if (oldIndex === -1 || newIndex === -1) return

        const reorderedEditable = arrayMove(editable, oldIndex, newIndex)
        const reorderedAll = [
            ...(fixedHeader ? [fixedHeader] : []),
            ...reorderedEditable,
            ...(fixedFooter ? [fixedFooter] : []),
        ].map((section, index) => ({ ...section, sort_order: index }))

        setSections(reorderedAll)
        await reorderSectionsAction(
            reorderedAll.map((section) => ({ id: section.id, sortOrder: section.sort_order }))
        )
    }

    const handleAddSection = async (blockKey: string) => {
        setIsAddMenuOpen(false)
        if (isFixedWebsiteSection(blockKey)) return
        setSaveStatus('saving')
        const label = blockKey.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        const newOrder = sections.length > 0 ? Math.max(...sections.map(s => s.sort_order)) + 1 : 0
        const result = await addSectionAction(blockKey, label, newOrder)

        if (!result.success) {
            setSaveStatus('error')
            return
        }
        if (result.data) {
            useEditorStore.getState().addSection(result.data as SectionData)
            setActiveSection(result.data.id)
            setSaveStatus('saved')
            setTimeout(() => setSaveStatus('idle'), 2000)
        }
    }

    const activeSection = sections.find((s) => s.id === activeSectionId)
    const editableSections = sections.filter((s) => !isFixedWebsiteSection(s))
    const headerSection = sections.find((s) => getSectionBlockType(s) === 'header')
    const footerSection = sections.find((s) => getSectionBlockType(s) === 'footer')
    const activeBlockType = activeSection ? getSectionBlockType(activeSection) : null
    const activeSchema = activeBlockType && BlockRegistry[activeBlockType] ? getSchemaWithLiquidBg(activeBlockType) : null
    const activeBlockSchemas = activeBlockType && BlockRegistry[activeBlockType] ? BlockRegistry[activeBlockType].blocks || null : null
    const activeValues = (() => {
        if (!activeSection) return {}

        const viewportContent = getViewportContent(
            (activeSection.content || {}) as Record<string, unknown>,
            viewport
        )

        if (getSectionBlockType(activeSection) !== 'header') {
            return viewportContent
        }

        const presetValue =
            typeof viewportContent.global_visual_preset === 'string'
                ? viewportContent.global_visual_preset.trim().toLowerCase()
                : 'custom'

        const hasExplicitOverlayToggle = Object.prototype.hasOwnProperty.call(
            viewportContent,
            'enable_gold_dust_overlay'
        )

        if (GOLD_DUST_VISUAL_PRESETS.has(presetValue) && !hasExplicitOverlayToggle) {
            return {
                ...viewportContent,
                enable_gold_dust_overlay: true,
            }
        }

        return viewportContent
    })()
    const editorSchema = (activeSchema || []).filter((field) => {
        if (viewport === 'mobile' && isDesktopOnlyFieldKey(field.key)) {
            return false
        }

        if (viewport === 'desktop' && isMobileOnlyFieldKey(field.key)) {
            return false
        }

        if (
            YELLOW_DECORATIVE_FIELD_KEYS.has(field.key) &&
            !YELLOW_DECORATIVE_SECTION_TYPES.has(activeBlockType || '')
        ) {
            return false
        }

        if (
            BOTTOM_DECORATIVE_FIELD_KEYS.has(field.key) &&
            !BOTTOM_DECORATIVE_SECTION_TYPES.has(activeBlockType || '')
        ) {
            return false
        }

        return true
    })
    const activeBlocks = ((activeValues as Record<string, unknown>)?.blocks as BlockInstance[]) || []

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#302b63]">
                <Loader2 className="animate-spin text-[#ea728c]" size={40} />
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-[#302b63] font-sans overflow-hidden">
            {/* Sidebar List */}
            <div className="w-[280px] bg-[#24204b] border-r border-[#ea728c]/20 flex flex-col h-full shadow-2xl z-20 shrink-0">
                <div className="p-4 border-b border-[#ea728c]/20 flex items-center justify-between bg-[#1b1836]">
                    <div className="flex items-center gap-3 text-white">
                        <Link href="/admin" className="p-1.5 rounded-lg bg-[#24204b] hover:bg-[#ea728c]/20 transition-colors">
                            <ArrowLeft size={16} className="text-[#ea728c]" />
                        </Link>
                        <div>
                            <h2 className="text-sm font-bold tracking-wider">theme editor</h2>
                            <p className="text-[10px] text-gray-400 font-medium">Dogs Paradise Web</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar">
                    <h3 className="text-[10px] uppercase tracking-widest text-[#ea728c] font-bold mb-3 pl-1">Homepage Sections</h3>
                    <p className="text-[10px] text-gray-400 mb-3 pl-1">Header and Footer are fixed layout areas. Their positions cannot be changed.</p>

                    {headerSection && (
                        <FixedLayoutRow
                            section={headerSection}
                            isActive={headerSection.id === activeSectionId}
                            onSelect={() => setActiveSection(headerSection.id)}
                        />
                    )}

                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={editableSections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                            <div className="space-y-1.5">
                                {editableSections.map((section) => (
                                    <SortableSectionRow
                                        key={section.id}
                                        section={section}
                                        isActive={section.id === activeSectionId}
                                        onSelect={() => setActiveSection(section.id)}
                                        onToggleVisibility={(v) => handleVisibilityToggle(section.id, v)}
                                        onDelete={() => handleDeleteSection(section.id)}
                                        onPublishToggle={() => handlePublishToggle(section.id, section.status)}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>

                    <div className="mt-1.5">
                        {footerSection && (
                            <FixedLayoutRow
                                section={footerSection}
                                isActive={footerSection.id === activeSectionId}
                                onSelect={() => setActiveSection(footerSection.id)}
                            />
                        )}
                    </div>
                </div>

                {/* Add Section */}
                <div className="p-4 bg-[#1b1836] border-t border-[#ea728c]/20 relative">
                    <button
                        onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                        className="w-full py-2.5 px-3 bg-[#ea728c]/10 text-[#ea728c] border border-[#ea728c]/30 rounded-lg text-sm font-semibold hover:bg-[#ea728c] hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                        <Plus size={16} /> Add Block
                    </button>

                    {isAddMenuOpen && (
                        <div className="absolute bottom-full left-4 right-4 mb-2 bg-[#24204b] border border-[#ea728c]/30 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden z-50 flex flex-col max-h-[350px]">
                            <div className="text-xs font-bold text-gray-300 bg-[#1b1836] px-4 py-3 border-b border-[#ea728c]/20 uppercase tracking-wider">
                                Component Library
                            </div>
                            <div className="overflow-y-auto p-2">
                                {Object.keys(BlockRegistry).map(key => {
                                    if (isFixedWebsiteSection(key)) return null
                                    const label = key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => handleAddSection(key)}
                                            className="w-full text-left px-3 py-2 text-sm text-gray-300 rounded-md hover:bg-[#ea728c] hover:text-white transition-colors flex items-center justify-between"
                                        >
                                            <span className="font-medium">{label}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Center Live Preview */}
            <div className="flex-1 bg-[#1b1836] flex flex-col relative z-10 overflow-hidden">
                <div className="h-14 border-b border-[#ea728c]/20 bg-[#24204b] flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ea728c] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ea728c]"></span>
                        </span>
                        <span className="text-xs font-semibold text-gray-300 uppercase tracking-widest">Live Sync Active</span>
                    </div>

                    <div className="flex bg-[#1b1836] p-1 rounded-lg border border-[#ea728c]/20">
                        <button
                            onClick={() => setViewport('desktop')}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded text-xs font-bold transition-colors ${viewport === 'desktop' ? 'bg-[#ea728c] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Monitor size={14} /> Desktop
                        </button>
                        <button
                            onClick={() => setViewport('mobile')}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded text-xs font-bold transition-colors ${viewport === 'mobile' ? 'bg-[#ea728c] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Smartphone size={14} /> Mobile
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
                    <div className={`transition-all duration-500 ease-in-out bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] border-4 border-[#24204b] overflow-hidden ${viewport === 'mobile' ? 'w-[400px]' : 'w-full'} h-full relative`}>
                        <iframe
                            ref={iframeRef}
                            src="/?preview=true"
                            className="w-full h-full border-none"
                            title="Live Edit"
                        />
                    </div>
                </div>
            </div>

            {/* Right Panel */}
            <div className="w-[360px] bg-[#24204b] border-l border-[#ea728c]/20 shadow-[-10px_0_30px_rgba(0,0,0,0.2)] shrink-0 flex flex-col">
                {activeSection ? (
                    <>
                        <div className="p-5 border-b border-[#ea728c]/20 bg-[#1b1836]">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-base font-bold text-white">{activeSection.label}</h2>
                                <div className="flex items-center gap-2">
                                    {saveStatus === 'saving' && <Loader2 size={16} className="text-[#ea728c] animate-spin" />}
                                    {saveStatus === 'saved' && <Check size={16} className="text-green-400" />}
                                    {saveStatus === 'error' && <AlertCircle size={16} className="text-red-400" />}
                                </div>
                            </div>
                            
                            {/* Shopify-style info bar */}
                            {activeBlockSchemas && activeBlockSchemas.length > 0 && (
                                <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                    <span className="bg-[#ea728c]/20 text-[#ea728c] px-2 py-0.5 rounded-full font-bold uppercase">
                                        {activeBlocks.length} blocks
                                    </span>
                                    <span>•</span>
                                    <span>{activeBlockSchemas.map(s => s.label).join(', ')}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                            <SchemaFormBuilder
                                schema={editorSchema}
                                values={activeValues || {}}
                                onChange={(key, value) => handleContentChange(activeSection.id, key, value)}
                                saveStatus={saveStatus}
                                viewport={viewport}
                                focusedField={focusedField}
                                sectionBlockType={activeBlockType}
                                // Shopify-style blocks
                                blockSchemas={activeBlockSchemas || undefined}
                                blocks={activeBlocks}
                                onBlockAdd={(block) => handleBlockAdd(activeSection.id, block)}
                                onBlockRemove={(idx) => handleBlockRemove(activeSection.id, idx)}
                                onBlockReorder={(old, newIdx) => handleBlockReorder(activeSection.id, old, newIdx)}
                                onBlockUpdate={(idx, settings) => handleBlockUpdate(activeSection.id, idx, settings)}
                                focusedBlockId={focusedBlockId_local}
                                focusedBlockIndex={focusedBlockIndex_local}
                            />
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
                        <PanelLeftOpen size={48} className="mb-4 text-[#ea728c]/50" />
                        <h3 className="text-sm font-bold text-white mb-2">Editor Ready</h3>
                        <p className="text-xs">Select a section from the left sidebar to start editing its content and appearance.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

function FixedLayoutRow({
    section,
    isActive,
    onSelect,
}: {
    section: SectionData
    isActive: boolean
    onSelect: () => void
}) {
    return (
        <button
            onClick={onSelect}
            className={`w-full flex items-center gap-2 p-2.5 rounded-lg border mb-1.5 ${isActive ? 'bg-[#ea728c]/20 border-[#ea728c] shadow-[inset_4px_0_0_#ea728c]' : 'bg-[#1b1836] border-[#ea728c]/20 hover:border-[#ea728c]/40'} transition-all`}
        >
            <Lock size={13} className="text-[#ea728c]" />
            <span className={`text-sm font-semibold flex-1 text-left ${isActive ? 'text-white' : 'text-gray-300'}`}>
                {section.label}
            </span>
            {section.status === 'draft' && (
                <span className="text-[9px] bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded font-bold uppercase">Draft</span>
            )}
            <span className="text-[9px] bg-[#ea728c]/20 text-[#ea728c] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
                Fixed
            </span>
        </button>
    )
}

function SortableSectionRow({
    section,
    isActive,
    onSelect,
    onToggleVisibility,
    onDelete,
    onPublishToggle
}: {
    section: SectionData
    isActive: boolean
    onSelect: () => void
    onToggleVisibility: (visible: boolean) => void
    onDelete: () => void
    onPublishToggle: () => void
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: section.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 99 : 'auto'
    }

    // Check if this section has blocks
    const blockType = getSectionBlockType(section)
    const hasBlocks = BlockRegistry[blockType]?.blocks && BlockRegistry[blockType].blocks!.length > 0
    const sectionContent = (section.content || {}) as Record<string, unknown>
    const sectionBlocks = Array.isArray(sectionContent.blocks) ? sectionContent.blocks : []
    const blockCount = hasBlocks ? sectionBlocks.length : 0

    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={onSelect}
            className={`group flex items-center gap-2 p-2.5 rounded-lg cursor-pointer border ${isActive ? 'bg-[#ea728c]/20 border-[#ea728c] shadow-[inset_4px_0_0_#ea728c]' : 'bg-[#1b1836] border-transparent hover:border-[#ea728c]/30'} transition-all`}
        >
            <button {...attributes} {...listeners} className="text-gray-500 hover:text-white cursor-grab active:cursor-grabbing">
                <GripVertical size={14} />
            </button>
            <div className="flex-1 flex items-center gap-2 truncate">
                <span className={`text-sm font-semibold truncate ${isActive ? 'text-white' : 'text-gray-300'}`}>
                    {section.label}
                </span>
                {section.status === 'draft' && (
                    <span className="text-[9px] bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded font-bold uppercase">Draft</span>
                )}
                {hasBlocks && blockCount > 0 && (
                    <span className="text-[9px] bg-[#ea728c]/20 text-[#ea728c] px-1.5 py-0.5 rounded font-bold">
                        {blockCount}
                    </span>
                )}
            </div>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleVisibility(!section.is_visible) }}
                    className={`p-1.5 rounded hover:bg-black/20 ${section.is_visible ? 'text-gray-400 hover:text-white' : 'text-red-400'}`}
                >
                    {section.is_visible ? <Eye size={12} /> : <EyeOff size={12} />}
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onPublishToggle() }}
                    className={`p-1.5 rounded hover:bg-black/20 ${section.status === 'published' ? 'text-green-400' : 'text-gray-400 hover:text-white'}`}
                >
                    <Globe size={12} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete() }}
                    className="p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-500/10"
                >
                    <Trash2 size={12} />
                </button>
            </div>
        </div>
    )
}
