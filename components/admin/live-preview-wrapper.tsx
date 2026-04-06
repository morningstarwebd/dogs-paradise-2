'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { SectionData, getSectionBlockType, isFixedWebsiteSection } from '@/types/schema.types'
import { BlockRegistry } from '@/components/blocks/registry'
import GoldDustOverlay from '@/components/layout/GoldDustOverlay'
import { EditorViewport, getViewportContent, updateViewportFieldsWithSync } from '@/lib/responsive-content'
import { getHeaderThemeSettings, getWebsiteBodyStyle, withGlobalSectionBackground } from '@/lib/header-theme'

interface LivePreviewWrapperProps {
    initialSections: SectionData[]
    dogs: unknown[] // to pass down to blocks that need it
    initialViewport?: EditorViewport
}

export function LivePreviewWrapper({ initialSections, dogs, initialViewport = 'desktop' }: LivePreviewWrapperProps) {
    const [sections, setSections] = useState<SectionData[]>(initialSections)
    const [activeSectionId, setActiveSectionId] = useState<string | null>(null)
    const [previewViewport, setPreviewViewport] = useState<EditorViewport>(initialViewport)
    const containerRef = useRef<HTMLDivElement>(null)
    const isEditorMode = useSyncExternalStore(
        () => () => undefined,
        () => typeof window !== 'undefined' && window.parent !== window,
        () => false,
    )

    // Listen for iframe postMessages from the Admin Editor
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return

            const data = event.data
            if (data?.type === 'LIVE_PREVIEW_UPDATE') {
                // The admin panel pushed a totally new ordered/updated array of sections
                setSections(data.sections)
                if (data.viewport === 'desktop' || data.viewport === 'mobile') {
                    setPreviewViewport(data.viewport)
                }
            } else if (data?.type === 'UPDATE_SECTION_CONTENT_PARTIAL') {
                // Fast partial update to ensure smooth typing
                setSections(prev => prev.map(s => {
                    if (s.id === data.sectionId) {
                        const baseContent = (s.content || {}) as Record<string, unknown>
                        const targetViewport: EditorViewport =
                            data.viewport === 'desktop' || data.viewport === 'mobile'
                                ? data.viewport
                                : previewViewport
                        return {
                            ...s,
                            content: updateViewportFieldsWithSync(
                                baseContent,
                                targetViewport,
                                (data.partialContent || {}) as Record<string, unknown>,
                            ),
                        }
                    }
                    return s
                }))
            } else if (data?.type === 'SET_PREVIEW_VIEWPORT') {
                if (data.viewport === 'desktop' || data.viewport === 'mobile') {
                    setPreviewViewport(data.viewport)
                }
            } else if (data?.type === 'HIGHLIGHT_SECTION') {
                setActiveSectionId(data.sectionId)
                // Scroll to the active block
                const el = document.getElementById(`section-${data.sectionId}`)
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }
            }
        }

        window.addEventListener('message', handleMessage)
        return () => window.removeEventListener('message', handleMessage)
    }, [previewViewport])

    const headerSection = sections.find((section) => getSectionBlockType(section) === 'header')
    const headerViewportContent = getViewportContent(
        (headerSection?.content || {}) as Record<string, unknown>,
        previewViewport
    )
    const headerThemeSettings = getHeaderThemeSettings(headerViewportContent)
    const bodyStyle = getWebsiteBodyStyle(headerThemeSettings, '#302b63')

    return (
        <div ref={containerRef} className="flex flex-col min-h-screen" style={bodyStyle}>
            <GoldDustOverlay
                enabled={headerThemeSettings.enableGoldDustOverlay}
                density={headerThemeSettings.goldDustDensity}
                speed={headerThemeSettings.goldDustSpeed}
                size={headerThemeSettings.goldDustSize}
                opacity={headerThemeSettings.goldDustOpacity}
                color={headerThemeSettings.goldDustColor}
            />
            {sections
                .filter(s => s.is_visible && s.status === 'published' && !isFixedWebsiteSection(s))
                .map((section) => {
                    const blockType = getSectionBlockType(section)
                    const blockDef = BlockRegistry[blockType]

                    if (!blockDef) {
                        return (
                            <div key={section.id} className="p-8 text-center text-red-500 bg-red-50">
                                Unknown block type: {blockType}
                            </div>
                        )
                    }

                    const Component = blockDef.Component
                    const isSelected = activeSectionId === section.id
                    const renderedContent = getViewportContent(
                        (section.content || {}) as Record<string, unknown>,
                        previewViewport
                    )
                    const themedContent = withGlobalSectionBackground(
                        renderedContent,
                        headerThemeSettings
                    )

                    // Inject cursor-pointer logic so clicking the section tells the admin to select it
                    const handleClick = (e: React.MouseEvent) => {
                        // Tell parent iframe to select this section
                        if (window.parent && window.parent !== window) {
                            e.preventDefault()
                            e.stopPropagation()
                            window.parent.postMessage({ type: 'SELECT_SECTION', sectionId: section.id }, window.location.origin)
                        }
                    }

                    return (
                        <div 
                            key={section.id} 
                            id={`section-${section.id}`}
                            onClick={handleClick}
                            className={`relative transition-all duration-300 ${isSelected ? 'ring-4 ring-[#ea728c] ring-inset z-10' : ''}`}
                            style={{ 
                                cursor: isEditorMode ? 'pointer' : 'default',
                            }}
                        >
                            {isSelected && isEditorMode && (
                                <div className="absolute top-0 left-0 bg-[#ea728c] text-white text-xs font-bold px-2 py-1 rounded-br z-20">
                                    {blockDef.label}
                                </div>
                            )}
                            <div className="">
                                <Component 
                                    dogs={blockType === 'featured-dogs' || blockType === 'breed-explorer' ? dogs : undefined}
                                    sectionId={section.id}
                                    isEditorMode={isEditorMode}
                                    {...(themedContent || {})} 
                                />
                            </div>
                        </div>
                    )
                })}
        </div>
    )
}
