'use client'

import React, { useState, useEffect } from 'react'
import { SchemaField, BlockTypeSchema, BlockInstance } from '@/types/schema.types'
import { EditorViewport } from '@/lib/responsive-content'
import { createClient } from '@/lib/supabase/client'
import { STORAGE_BUCKET } from '@/lib/storage'
import { ImageUpload } from './ImageUpload'
import {
    Upload,
    Loader2,
    GripVertical,
    ChevronDown,
    ChevronRight,
    Trash2,
    Plus,
    Image as ImageIcon,
    MousePointerClick,
    BarChart3,
    ShieldCheck,
    CircleHelp,
    ListChecks,
} from 'lucide-react'
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
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// ─── Icon lookup for blocks ──────────────────────────────────────────
const blockIconMap: Record<string, React.ReactNode> = {
    'Image': <ImageIcon size={14} />,
    'MousePointerClick': <MousePointerClick size={14} />,
    'BarChart3': <BarChart3 size={14} />,
    'ShieldCheck': <ShieldCheck size={14} />,
    'CircleHelp': <CircleHelp size={14} />,
    'ListChecks': <ListChecks size={14} />,
}

const MAX_COLOR_LIBRARY_ITEMS = 10
const COMMON_COLOR_TOKENS = new Set([
    '#000000',
    '#ffffff',
    '#ff0000',
    '#00ff00',
    '#0000ff',
    '#ffff00',
    '#ffa500',
    '#800080',
    '#ffc0cb',
    '#808080',
    'transparent',
    'black',
    'white',
    'red',
    'green',
    'blue',
    'yellow',
    'orange',
    'purple',
    'pink',
    'gray',
    'grey',
])

function normalizeColorEntry(value: string): string {
    return value.trim().replace(/\s+/g, ' ')
}

function toPickerHex(value: string): string {
    const trimmed = value.trim()
    const hexMatch = trimmed.match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
    if (!hexMatch) return '#000000'

    const raw = hexMatch[1]
    if (raw.length === 3) {
        return `#${raw.split('').map((char) => `${char}${char}`).join('').toLowerCase()}`
    }

    return `#${raw.toLowerCase()}`
}

function isGradientValue(value: string): boolean {
    return /(?:repeating-)?(?:linear|radial|conic)-gradient\s*\(/i.test(value)
}

function isColorFunctionValue(value: string): boolean {
    return /^(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch|color)\s*\(/i.test(value.trim())
}

function normalizeColorToken(value: string): string {
    const normalized = normalizeColorEntry(value).toLowerCase()
    if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(normalized)) {
        return toPickerHex(normalized)
    }
    return normalized
}

function isCustomSavedColor(value: string): boolean {
    const normalized = normalizeColorEntry(value)
    if (!normalized) return false
    if (isGradientValue(normalized) || isColorFunctionValue(normalized)) return true
    return !COMMON_COLOR_TOKENS.has(normalizeColorToken(normalized))
}

function getColorSwatchStyle(colorValue: string): React.CSSProperties {
    if (isGradientValue(colorValue)) {
        return { backgroundImage: colorValue, backgroundColor: 'transparent' }
    }

    return { backgroundColor: colorValue }
}

function ColorInputWithLibrary({
    value,
    onChange,
    onRemember,
    savedColors,
    placeholder,
}: {
    value: string
    onChange: (nextValue: string) => void
    onRemember: (colorValue: string) => void
    savedColors: string[]
    placeholder?: string
}) {
    const normalizedValue = typeof value === 'string' ? value : String(value ?? '')

    const rememberCurrentValue = () => {
        onRemember(normalizedValue)
    }

    return (
        <div className="space-y-2 rounded-xl border border-[#ea728c]/25 bg-[#1b1836]/70 p-2.5">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex-shrink-0 cursor-pointer overflow-hidden rounded border border-gray-600 relative">
                    <input
                        type="color"
                        value={toPickerHex(normalizedValue)}
                        onChange={(e) => onChange(e.target.value)}
                        onBlur={(e) => onRemember(e.currentTarget.value)}
                        className="absolute top-[-10px] left-[-10px] w-20 h-20 cursor-pointer p-0 m-0 border-0"
                    />
                </div>
                <input
                    type="text"
                    value={normalizedValue}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={rememberCurrentValue}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            rememberCurrentValue()
                        }
                    }}
                    placeholder={placeholder || 'e.g. #000000 or linear-gradient(...)'}
                    className="w-full bg-[#1b1836] border border-[#ea728c]/30 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ea728c]"
                />
            </div>

            {savedColors.length > 0 && (
                <div className="space-y-1.5 rounded-lg border border-[#ea728c]/20 bg-[#14112b]/80 p-2">
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Saved Colors (Session)</p>
                    <div className="flex flex-wrap gap-2">
                        {savedColors.map((savedColor) => {
                            const normalizedSaved = normalizeColorEntry(savedColor)
                            const isActive = normalizeColorEntry(normalizedValue).toLowerCase() === normalizedSaved.toLowerCase()
                            return (
                                <button
                                    key={normalizedSaved}
                                    type="button"
                                    onClick={() => {
                                        onChange(normalizedSaved)
                                    }}
                                    title={normalizedSaved}
                                    className={`h-8 w-8 rounded border transition-all ${isActive ? 'border-white ring-2 ring-[#ea728c]' : 'border-white/30 hover:border-white/70'}`}
                                    style={getColorSwatchStyle(normalizedSaved)}
                                />
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

interface SchemaFormBuilderProps {
    schema: SchemaField[]
    values: Record<string, unknown>
    onChange: (key: string, value: unknown) => void
    viewport?: EditorViewport
    focusedField?: string | null
    sectionBlockType?: string | null
    // Shopify-style blocks support
    blockSchemas?: BlockTypeSchema[]
    blocks?: BlockInstance[]
    onBlockAdd?: (block: BlockInstance) => void
    onBlockRemove?: (index: number) => void
    onBlockReorder?: (oldIndex: number, newIndex: number) => void
    onBlockUpdate?: (index: number, settings: Record<string, unknown>) => void
    focusedBlockId?: string | null
    focusedBlockIndex?: number | null
    saveStatus?: 'idle' | 'saving' | 'saved' | 'error'
}

export function SchemaFormBuilder({
    schema,
    values,
    onChange,
    viewport = 'desktop',
    focusedField,
    sectionBlockType,
    blockSchemas,
    blocks,
    onBlockAdd,
    onBlockRemove,
    onBlockReorder,
    onBlockUpdate,
    focusedBlockId,
    focusedBlockIndex,
    saveStatus = 'idle',
}: SchemaFormBuilderProps) {
    const [activeTab, setActiveTab] = useState<'Content' | 'Design' | 'Blocks'>('Content')
    const [uploadingState, setUploadingState] = useState<Record<string, boolean>>({})
    const [savedColors, setSavedColors] = useState<string[]>([])
    const [pendingSavedColor, setPendingSavedColor] = useState<string | null>(null)
    const mediaLibraryEnabled = true
    const imageUploadFolder = sectionBlockType === 'hero' ? 'hero' : 'sections'

    const hasBlocks = blockSchemas && blockSchemas.length > 0

    useEffect(() => {
        if (!focusedField || !schema) return;
        const fieldOpts = schema.find(f => f.key === focusedField);
        if (fieldOpts) {
           const grp = fieldOpts.group === 'Design' ? 'Design' : 'Content';
           // eslint-disable-next-line react-hooks/set-state-in-effect
           if (activeTab !== grp) setActiveTab(grp);
        }
    }, [focusedField, schema, activeTab]);

    // Auto-switch to Blocks tab when a block is focused from the preview
    useEffect(() => {
        if (focusedBlockId != null && hasBlocks) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setActiveTab('Blocks');
        }
    }, [focusedBlockId, hasBlocks]);

    useEffect(() => {
        if (focusedField) {
            // small delay to let tab switch render
            setTimeout(() => {
                const el = document.getElementById(`field-${focusedField}`)
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    
                    // Flash effect
                    el.classList.add('ring-2', 'ring-[#ea728c]', 'bg-[#ea728c]/10', 'scale-[1.02]')
                    setTimeout(() => {
                        el.classList.remove('ring-2', 'ring-[#ea728c]', 'bg-[#ea728c]/10', 'scale-[1.02]')
                    }, 1500)
                }
            }, 50)
        }
    }, [focusedField, activeTab])

    const queueRememberColor = (colorValue: string) => {
        const normalized = normalizeColorEntry(colorValue)
        if (!isCustomSavedColor(normalized)) return

        setPendingSavedColor(normalized)
    }

    useEffect(() => {
        if (saveStatus !== 'saved' || !pendingSavedColor) return

        const normalizedToken = normalizeColorToken(pendingSavedColor)

        // Only persist a color in the session library after content save succeeds.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSavedColors((prev) => {
            const withoutDupes = prev.filter((entry) => normalizeColorToken(entry) !== normalizedToken)
            const next = [pendingSavedColor, ...withoutDupes].slice(0, MAX_COLOR_LIBRARY_ITEMS)
            return next
        })

        setPendingSavedColor(null)
    }, [saveStatus, pendingSavedColor])

    if (!schema || schema.length === 0) {
        if (!hasBlocks) {
            return (
                <div className="p-6 text-center border-2 border-dashed border-[#ea728c]/20 rounded-xl bg-[#24204b]/50">
                    <p className="text-gray-400 text-sm">No configurable fields for this section.</p>
                </div>
            )
        }
    }

    const normalizeFieldKey = (fieldKey: string): string => {
        const markerIndex = fieldKey.indexOf('__')
        if (markerIndex === -1) return fieldKey
        return fieldKey.slice(markerIndex + 2)
    }

    const isFieldVisibleInViewport = (field: SchemaField): boolean => {
        const normalizedKey = normalizeFieldKey(field.key)

        if (viewport === 'desktop' && normalizedKey.startsWith('mobile_')) return false
        if (viewport === 'mobile' && normalizedKey.startsWith('desktop_')) return false

        return true
    }

    const visibleSchema = schema.filter(isFieldVisibleInViewport)

    const contentFields = visibleSchema.filter(f => f.group === 'Content' || !f.group)
    const designFields = visibleSchema.filter(f => f.group === 'Design')

    const tabList: ('Content' | 'Design' | 'Blocks')[] = ['Content'];
    if (hasBlocks) tabList.push('Blocks');
    tabList.push('Design');

    return (
        <div className="space-y-6">
            {/* Tab Switcher */}
            <div className="flex bg-[#1b1836] p-1 rounded-lg border border-[#ea728c]/20">
                {tabList.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-1.5 text-xs font-bold rounded shadow-sm text-center transition-colors ${
                            activeTab === tab ? 'bg-[#ea728c] text-white' : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        {tab === 'Blocks' ? `Blocks (${(blocks || []).length})` : tab === 'Design' ? 'Design & Spacing' : tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
                {activeTab === 'Content' && (
                    <>
                        {contentFields.length === 0 && (
                            <div className="text-sm text-gray-500 text-center py-4">
                                No content settings for {viewport} view. Switch viewport or use Blocks for this section.
                            </div>
                        )}
                        {contentFields.map((field) => (
                            <FieldRenderer
                                key={field.key}
                                field={field}
                                value={values[field.key] ?? field.default ?? ''}
                                onChange={onChange}
                                uploadingState={uploadingState}
                                setUploadingState={setUploadingState}
                                useMediaLibraryForImage={mediaLibraryEnabled}
                                imageUploadFolder={imageUploadFolder}
                                savedColors={savedColors}
                                onRememberColor={queueRememberColor}
                            />
                        ))}
                    </>
                )}

                {activeTab === 'Design' && (
                    <>
                        {designFields.length === 0 && (
                            <div className="text-sm text-gray-500 text-center py-4">
                                No design settings for {viewport} view.
                            </div>
                        )}
                        {designFields.map((field) => (
                            <FieldRenderer
                                key={field.key}
                                field={field}
                                value={values[field.key] ?? field.default ?? ''}
                                onChange={onChange}
                                uploadingState={uploadingState}
                                setUploadingState={setUploadingState}
                                useMediaLibraryForImage={mediaLibraryEnabled}
                                imageUploadFolder={imageUploadFolder}
                                savedColors={savedColors}
                                onRememberColor={queueRememberColor}
                            />
                        ))}
                    </>
                )}

                {activeTab === 'Blocks' && hasBlocks && (
                    <BlocksEditor
                        blockSchemas={blockSchemas!}
                        blocks={blocks || []}
                        onBlockAdd={onBlockAdd!}
                        onBlockRemove={onBlockRemove!}
                        onBlockReorder={onBlockReorder!}
                        onBlockUpdate={onBlockUpdate!}
                        focusedBlockId={focusedBlockId}
                        focusedBlockIndex={focusedBlockIndex}
                        viewport={viewport}
                        useMediaLibraryForImage={mediaLibraryEnabled}
                        imageUploadFolder={imageUploadFolder}
                        savedColors={savedColors}
                        onRememberColor={queueRememberColor}
                    />
                )}
            </div>
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════════════
// Field Renderer (individual form field)
// ═══════════════════════════════════════════════════════════════════════

function getRepeaterItems(value: unknown): Record<string, unknown>[] {
    if (!Array.isArray(value)) return []

    return value.map((item) => {
        if (item && typeof item === 'object' && !Array.isArray(item)) {
            return { ...(item as Record<string, unknown>) }
        }
        return {}
    })
}

function getRepeaterItemDefaults(fields: SchemaField[]): Record<string, unknown> {
    return fields.reduce((acc, subField) => {
        if (subField.default !== undefined) {
            acc[subField.key] = subField.default
            return acc
        }

        if (subField.type === 'toggle') {
            acc[subField.key] = false
            return acc
        }

        if (subField.type === 'number' || subField.type === 'range') {
            acc[subField.key] = 0
            return acc
        }

        acc[subField.key] = ''
        return acc
    }, {} as Record<string, unknown>)
}

function FieldRenderer({
    field,
    value,
    onChange,
    uploadingState,
    setUploadingState,
    useMediaLibraryForImage,
    imageUploadFolder,
    savedColors,
    onRememberColor,
}: {
    field: SchemaField
    value: unknown
    onChange: (key: string, value: unknown) => void
    uploadingState: Record<string, boolean>
    setUploadingState: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
    useMediaLibraryForImage?: boolean
    imageUploadFolder?: string
    savedColors: string[]
    onRememberColor: (colorValue: string) => void
}) {
    const repeaterFields = field.fields || []
    const repeaterItems = getRepeaterItems(value)

    const setRepeaterItems = (nextItems: Record<string, unknown>[]) => {
        onChange(field.key, nextItems)
    }

    const handleAddRepeaterItem = () => {
        const defaults = getRepeaterItemDefaults(repeaterFields)
        setRepeaterItems([...repeaterItems, defaults])
    }

    const handleRemoveRepeaterItem = (index: number) => {
        setRepeaterItems(repeaterItems.filter((_, itemIndex) => itemIndex !== index))
    }

    const handleRepeaterItemChange = (index: number, key: string, nextValue: unknown) => {
        setRepeaterItems(
            repeaterItems.map((item, itemIndex) =>
                itemIndex === index ? { ...item, [key]: nextValue } : item
            )
        )
    }

    return (
        <div 
            id={`field-${field.key}`}
            className="space-y-1.5 flex flex-col p-2 -mx-2 rounded-lg transition-all duration-500"
        >
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                {field.label}
            </label>

            {field.type === 'repeater' && (
                <div className="space-y-3">
                    {repeaterItems.length === 0 && (
                        <div className="rounded-lg border border-dashed border-[#ea728c]/30 px-3 py-3 text-xs text-gray-500">
                            No items added yet.
                        </div>
                    )}

                    {repeaterItems.map((item, itemIndex) => (
                        <div
                            key={`${field.key}-item-${itemIndex}`}
                            className="space-y-3 rounded-lg border border-[#ea728c]/20 bg-[#1b1836]/60 p-3"
                        >
                            <div className="flex items-center justify-between">
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                                    Item {itemIndex + 1}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveRepeaterItem(itemIndex)}
                                    className="inline-flex items-center gap-1 rounded-md border border-red-400/40 px-2 py-1 text-[11px] font-semibold text-red-300 hover:bg-red-500/10"
                                >
                                    <Trash2 size={12} />
                                    Remove
                                </button>
                            </div>

                            <div className="space-y-2.5">
                                {repeaterFields.map((subField) => {
                                    const subValue = item[subField.key] ?? subField.default ?? ''
                                    const subFieldId = `${field.key}-${itemIndex}-${subField.key}`
                                    const toggleValue =
                                        typeof subValue === 'boolean'
                                            ? subValue
                                            : String(subValue).toLowerCase() === 'true'

                                    return (
                                        <div key={subFieldId} className="space-y-1.5">
                                            <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-300">
                                                {subField.label}
                                            </label>

                                            {(subField.type === 'text' || subField.type === 'link') && (
                                                <input
                                                    type="text"
                                                    value={String(subValue)}
                                                    onChange={(e) => handleRepeaterItemChange(itemIndex, subField.key, e.target.value)}
                                                    placeholder={subField.placeholder}
                                                    className="w-full rounded-lg border border-[#ea728c]/30 bg-[#1b1836] px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#ea728c]"
                                                />
                                            )}

                                            {subField.type === 'textarea' && (
                                                <textarea
                                                    value={String(subValue)}
                                                    onChange={(e) => handleRepeaterItemChange(itemIndex, subField.key, e.target.value)}
                                                    placeholder={subField.placeholder}
                                                    rows={3}
                                                    className="w-full resize-y rounded-lg border border-[#ea728c]/30 bg-[#1b1836] px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#ea728c]"
                                                />
                                            )}

                                            {subField.type === 'number' && (
                                                <input
                                                    type="number"
                                                    value={Number.isFinite(Number(subValue)) ? Number(subValue) : 0}
                                                    onChange={(e) => handleRepeaterItemChange(itemIndex, subField.key, Number(e.target.value))}
                                                    placeholder={subField.placeholder}
                                                    className="w-full rounded-lg border border-[#ea728c]/30 bg-[#1b1836] px-3 py-2 text-sm text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#ea728c]"
                                                />
                                            )}

                                            {subField.type === 'select' && subField.options && (
                                                <select
                                                    value={String(subValue)}
                                                    onChange={(e) => handleRepeaterItemChange(itemIndex, subField.key, e.target.value)}
                                                    className="w-full cursor-pointer rounded-lg border border-[#ea728c]/30 bg-[#1b1836] px-3 py-2 text-sm text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#ea728c]"
                                                >
                                                    <option value="">Select...</option>
                                                    {subField.options.map((option) => (
                                                        <option key={option} value={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}

                                            {subField.type === 'toggle' && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRepeaterItemChange(itemIndex, subField.key, !toggleValue)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#ea728c] focus:ring-offset-2 focus:ring-offset-[#24204b] ${
                                                        toggleValue ? 'bg-[#ea728c]' : 'bg-[#1b1836] border border-[#ea728c]/30'
                                                    }`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                            toggleValue ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                    />
                                                </button>
                                            )}

                                            {subField.type === 'color' && (
                                                <ColorInputWithLibrary
                                                    value={String(subValue)}
                                                    onChange={(nextValue) => handleRepeaterItemChange(itemIndex, subField.key, nextValue)}
                                                    onRemember={onRememberColor}
                                                    savedColors={savedColors}
                                                    placeholder={subField.placeholder || '#000000'}
                                                />
                                            )}

                                            {!['text', 'link', 'textarea', 'number', 'select', 'toggle', 'color'].includes(subField.type) && (
                                                <input
                                                    type="text"
                                                    value={String(subValue)}
                                                    onChange={(e) => handleRepeaterItemChange(itemIndex, subField.key, e.target.value)}
                                                    placeholder={subField.placeholder}
                                                    className="w-full rounded-lg border border-[#ea728c]/30 bg-[#1b1836] px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#ea728c]"
                                                />
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={handleAddRepeaterItem}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#ea728c]/40 bg-[#ea728c]/10 px-3 py-2 text-xs font-semibold text-[#ea728c] transition-colors hover:bg-[#ea728c] hover:text-white"
                    >
                        <Plus size={14} />
                        Add Item
                    </button>
                </div>
            )}

            {field.type === 'text' && (
                <input
                    type="text"
                    value={String(value)}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full bg-[#1b1836] border border-[#ea728c]/30 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ea728c] focus:border-transparent transition-all placeholder:text-gray-600"
                />
            )}

            {field.type === 'image' && (
                useMediaLibraryForImage ? (
                    <ImageUpload
                        value={typeof value === 'string' ? value : ''}
                        onChange={(url) => onChange(field.key, url)}
                        folder={imageUploadFolder || 'sections'}
                    />
                ) : (
                    <ImageField
                        fieldKey={field.key}
                        value={value}
                        onChange={(val) => onChange(field.key, val)}
                        uploading={uploadingState[field.key]}
                        setUploading={(v) => setUploadingState(prev => ({ ...prev, [field.key]: v }))}
                    />
                )
            )}

            {field.type === 'color' && (
                <ColorInputWithLibrary
                    value={String(value)}
                    onChange={(nextValue) => onChange(field.key, nextValue)}
                    onRemember={onRememberColor}
                    savedColors={savedColors}
                    placeholder={field.placeholder || 'e.g. gold-glitter, white-glitter, #D4AF37, gold, or linear-gradient(...)'}
                />
            )}

            {field.type === 'textarea' && (
                <textarea
                    value={String(value)}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    rows={4}
                    className="w-full bg-[#1b1836] border border-[#ea728c]/30 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ea728c] focus:border-transparent transition-all placeholder:text-gray-600 resize-y"
                />
            )}

            {field.type === 'number' && (
                <input
                    type="number"
                    value={Number(value)}
                    onChange={(e) => onChange(field.key, Number(e.target.value))}
                    placeholder={field.placeholder}
                    className="w-full bg-[#1b1836] border border-[#ea728c]/30 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ea728c] focus:border-transparent transition-all"
                />
            )}

            {field.type === 'range' && (() => {
                const min = typeof field.min === 'number' ? field.min : 0
                const max = typeof field.max === 'number' ? field.max : 100
                const step = typeof field.step === 'number' ? field.step : 1
                const parsed = typeof value === 'number' ? value : Number(value)
                const fallback = typeof field.default === 'number' ? field.default : min
                const sliderValue = Number.isFinite(parsed) ? parsed : fallback

                return (
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <input
                                type="range"
                                min={min}
                                max={max}
                                step={step}
                                value={sliderValue}
                                onChange={(e) => onChange(field.key, Number(e.target.value))}
                                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[#1b1836] accent-[#ea728c]"
                            />
                            <span className="min-w-[52px] text-right text-xs font-semibold text-[#ea728c]">
                                {Number(sliderValue).toFixed(2).replace(/\.00$/, '')}
                            </span>
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-500">
                            <span>{min}</span>
                            <span>{max}</span>
                        </div>
                    </div>
                )
            })()}

            {field.type === 'toggle' && (
                <button
                    type="button"
                    onClick={() => onChange(field.key, !value)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#ea728c] focus:ring-offset-2 focus:ring-offset-[#24204b] ${
                        value ? 'bg-[#ea728c]' : 'bg-[#1b1836] border border-[#ea728c]/30'
                    }`}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                </button>
            )}
            
            {field.type === 'select' && field.options && (
                <select
                    value={String(value)}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    className="w-full bg-[#1b1836] border border-[#ea728c]/30 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ea728c] focus:border-transparent cursor-pointer"
                >
                    <option value="">Select...</option>
                    {field.options.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
            )}
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════════════
// Image Field (with upload)
// ═══════════════════════════════════════════════════════════════════════

function ImageField({
    fieldKey,
    value,
    onChange,
    uploading,
    setUploading,
}: {
    fieldKey: string
    value: unknown
    onChange: (val: string) => void
    uploading: boolean
    setUploading: (v: boolean) => void
}) {
    const imageValue = typeof value === 'string' ? value : ''

    return (
        <div className="space-y-3">
            {imageValue && (
                <div className="relative w-full h-32 rounded-lg overflow-hidden border border-[#ea728c]/30 bg-black/50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageValue} alt="Preview" className="w-full h-full object-contain" />
                </div>
            )}
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={imageValue}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="URL of the image"
                    className="flex-1 min-w-0 bg-[#1b1836] border border-[#ea728c]/30 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#ea728c] transition-all"
                />
                <input
                    type="file"
                    id={`file-${fieldKey}`}
                    className="hidden"
                    accept="image/*"
                    onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploading(true);
                        try {
                            const supabase = createClient();
                            const ext = file.name.split('.').pop();
                            const fileName = `${fieldKey}_${Date.now()}.${ext}`;
                            const uniquePath = `legacy/${fileName}`;
                            const { data, error } = await supabase.storage.from(STORAGE_BUCKET).upload(uniquePath, file, { cacheControl: '3600', upsert: false });
                            if (error) throw error;
                            const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(data.path);
                            onChange(urlData.publicUrl);
                        } catch(err) {
                            console.error(err);
                            alert('Image upload failed');
                        } finally {
                            setUploading(false);
                        }
                    }}
                />
                <button
                    type="button"
                    onClick={() => document.getElementById(`file-${fieldKey}`)?.click()}
                    disabled={uploading}
                    className="px-3 py-2 h-[34px] bg-[#ea728c] hover:bg-pink-600 rounded-lg text-white font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50 shrink-0"
                >
                    {uploading ? <Loader2 className="animate-spin" size={14} /> : <Upload size={14} />} 
                    Upload
                </button>
            </div>
        </div>
    )
}


// ═══════════════════════════════════════════════════════════════════════
// Blocks Editor — Shopify-style accordion with drag/drop
// ═══════════════════════════════════════════════════════════════════════

function BlocksEditor({
    blockSchemas,
    blocks,
    onBlockAdd,
    onBlockRemove,
    onBlockReorder,
    onBlockUpdate,
    focusedBlockId,
    focusedBlockIndex,
    viewport,
    useMediaLibraryForImage,
    imageUploadFolder,
    savedColors,
    onRememberColor,
}: {
    blockSchemas: BlockTypeSchema[]
    blocks: BlockInstance[]
    onBlockAdd: (block: BlockInstance) => void
    onBlockRemove: (index: number) => void
    onBlockReorder: (oldIndex: number, newIndex: number) => void
    onBlockUpdate: (index: number, settings: Record<string, unknown>) => void
    focusedBlockId?: string | null
    focusedBlockIndex?: number | null
    viewport: EditorViewport
    useMediaLibraryForImage?: boolean
    imageUploadFolder?: string
    savedColors: string[]
    onRememberColor: (colorValue: string) => void
}) {
    const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(new Set())
    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false)
    const [uploadingState, setUploadingState] = useState<Record<string, boolean>>({})

    const buildBlockItemId = (block: BlockInstance, index: number): string => {
        const normalizedId = typeof block.id === 'string' ? block.id.trim() : ''
        return normalizedId ? `block-${normalizedId}` : `block-index-${index}`
    }

    const generateBlockId = (type: string): string => {
        const existingIds = new Set(blocks.map((block) => block.id))
        let nextIndex = blocks.filter((block) => block.type === type).length
        let candidate = `${type}-${nextIndex}`
        while (existingIds.has(candidate)) {
            nextIndex += 1
            candidate = `${type}-${nextIndex}`
        }
        return candidate
    }

    const blockItemIds = blocks.map((block, index) => buildBlockItemId(block, index))

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    // Auto-expand focused block from preview click
    useEffect(() => {
        let targetIndex = -1

        if (focusedBlockId) {
            targetIndex = blocks.findIndex((block) => block.id === focusedBlockId)
        }

        if (
            targetIndex === -1 &&
            focusedBlockIndex != null &&
            focusedBlockIndex >= 0 &&
            focusedBlockIndex < blocks.length
        ) {
            targetIndex = focusedBlockIndex
        }

        if (targetIndex === -1) return

        const targetItemId = buildBlockItemId(blocks[targetIndex], targetIndex)

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setExpandedBlocks((prev) => new Set(prev).add(targetItemId))

        // Scroll to block
        setTimeout(() => {
            const el = document.getElementById(`block-item-${targetItemId}`)
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                el.classList.add('ring-2', 'ring-[#ea728c]', 'bg-[#ea728c]/10')
                setTimeout(() => {
                    el.classList.remove('ring-2', 'ring-[#ea728c]', 'bg-[#ea728c]/10')
                }, 1500)
            }
        }, 100)
    }, [focusedBlockId, focusedBlockIndex, blocks])

    const toggleExpanded = (itemId: string) => {
        setExpandedBlocks(prev => {
            const next = new Set(prev)
            if (next.has(itemId)) next.delete(itemId)
            else next.add(itemId)
            return next
        })
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const oldIndex = blockItemIds.indexOf(String(active.id))
        const newIndex = blockItemIds.indexOf(String(over.id))
        if (oldIndex === -1 || newIndex === -1) return
        onBlockReorder(oldIndex, newIndex)
    }

    const handleAddBlock = (typeSchema: BlockTypeSchema) => {
        // Check limit
        const currentCount = blocks.filter(b => b.type === typeSchema.type).length
        if (typeSchema.limit && currentCount >= typeSchema.limit) {
            alert(`Maximum ${typeSchema.limit} ${typeSchema.label} blocks allowed`)
            return
        }

        const newBlock: BlockInstance = {
            id: generateBlockId(typeSchema.type),
            type: typeSchema.type,
            settings: {}
        }
        // Set defaults from schema
        typeSchema.schema.forEach(f => {
            if (f.default !== undefined) {
                newBlock.settings[f.key] = f.default
            }
        })

        onBlockAdd(newBlock)
        setIsAddMenuOpen(false)
        // Auto-expand the new block
        const newBlockItemId = buildBlockItemId(newBlock, blocks.length)
        setExpandedBlocks((prev) => new Set(prev).add(newBlockItemId))
    }

    const getBlockTitle = (block: BlockInstance, index: number): string => {
        const schema = blockSchemas.find(s => s.type === block.type)
        const configuredLabel = schema?.titleField ? block.settings[schema.titleField] : undefined
        const label =
            (typeof configuredLabel === 'string' ? configuredLabel : typeof configuredLabel === 'number' ? String(configuredLabel) : '') ||
            (block.settings.text as string) ||
            (block.settings.label as string) ||
            (block.settings.alt_text as string) ||
            (block.settings.value as string)
        if (label) return label;
        return `${schema?.label || block.type} ${index + 1}`;
    }

    return (
        <div className="space-y-4">
            {/* Block list with drag & drop */}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={blockItemIds} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                        {blocks.map((block, index) => {
                            const typeSchema = blockSchemas.find(s => s.type === block.type)
                            if (!typeSchema) return null

                            const itemId = buildBlockItemId(block, index)

                            return (
                                <SortableBlockItem
                                    key={itemId}
                                    id={itemId}
                                    domId={itemId}
                                    block={block}
                                    typeSchema={typeSchema}
                                    viewport={viewport}
                                    isExpanded={expandedBlocks.has(itemId)}
                                    onToggle={() => toggleExpanded(itemId)}
                                    onRemove={() => {
                                        if (confirm(`Delete this ${typeSchema.label}?`)) {
                                            onBlockRemove(index)
                                        }
                                    }}
                                    onUpdate={(settings) => onBlockUpdate(index, settings)}
                                    title={getBlockTitle(block, index)}
                                    uploadingState={uploadingState}
                                    setUploadingState={setUploadingState}
                                    useMediaLibraryForImage={useMediaLibraryForImage}
                                    imageUploadFolder={imageUploadFolder}
                                    savedColors={savedColors}
                                    onRememberColor={onRememberColor}
                                />
                            )
                        })}
                    </div>
                </SortableContext>
            </DndContext>

            {blocks.length === 0 && (
                <div className="text-center py-6 border-2 border-dashed border-[#ea728c]/20 rounded-xl bg-[#24204b]/30">
                    <p className="text-gray-400 text-sm mb-2">No blocks added yet</p>
                    <p className="text-gray-500 text-xs">Click &quot;Add Block&quot; below to start building this section</p>
                </div>
            )}

            {/* Add Block Button */}
            <div className="relative">
                <button
                    onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                    className="w-full py-2.5 px-3 bg-[#ea728c]/10 text-[#ea728c] border border-dashed border-[#ea728c]/40 rounded-lg text-sm font-semibold hover:bg-[#ea728c] hover:text-white hover:border-solid transition-all flex items-center justify-center gap-2"
                >
                    <Plus size={16} />
                    Add Block
                </button>

                {isAddMenuOpen && (
                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#24204b] border border-[#ea728c]/30 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden z-50">
                        <div className="text-xs font-bold text-gray-300 bg-[#1b1836] px-4 py-2.5 border-b border-[#ea728c]/20 uppercase tracking-wider">
                            Available Block Types
                        </div>
                        <div className="p-2">
                            {blockSchemas.map(typeSchema => {
                                const count = blocks.filter(b => b.type === typeSchema.type).length
                                const atLimit = typeSchema.limit ? count >= typeSchema.limit : false
                                const icon = blockIconMap[typeSchema.icon || ''] || <Plus size={14} />

                                return (
                                    <button
                                        key={typeSchema.type}
                                        onClick={() => handleAddBlock(typeSchema)}
                                        disabled={atLimit}
                                        className={`w-full text-left px-3 py-2.5 text-sm rounded-lg flex items-center gap-3 transition-colors ${
                                            atLimit
                                                ? 'opacity-40 cursor-not-allowed'
                                                : 'text-gray-300 hover:bg-[#ea728c] hover:text-white'
                                        }`}
                                    >
                                        <div className="w-7 h-7 rounded-lg bg-[#1b1836] flex items-center justify-center text-[#ea728c] shrink-0">
                                            {icon}
                                        </div>
                                        <div className="flex-1">
                                            <span className="font-medium">{typeSchema.label}</span>
                                            {typeSchema.limit && (
                                                <span className="text-[10px] ml-2 opacity-60">
                                                    {count}/{typeSchema.limit}
                                                </span>
                                            )}
                                        </div>
                                        {atLimit && (
                                            <span className="text-[9px] bg-gray-700 text-gray-400 px-1.5 py-0.5 rounded font-bold uppercase">
                                                Max
                                            </span>
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}


// ═══════════════════════════════════════════════════════════════════════
// Sortable Block Item (accordion row)
// ═══════════════════════════════════════════════════════════════════════

function SortableBlockItem({
    id,
    domId,
    block,
    typeSchema,
    viewport,
    isExpanded,
    onToggle,
    onRemove,
    onUpdate,
    title,
    uploadingState,
    setUploadingState,
    useMediaLibraryForImage,
    imageUploadFolder,
    savedColors,
    onRememberColor,
}: {
    id: string
    domId: string
    block: BlockInstance
    typeSchema: BlockTypeSchema
    viewport: EditorViewport
    isExpanded: boolean
    onToggle: () => void
    onRemove: () => void
    onUpdate: (settings: Record<string, unknown>) => void
    title: string
    uploadingState: Record<string, boolean>
    setUploadingState: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
    useMediaLibraryForImage?: boolean
    imageUploadFolder?: string
    savedColors: string[]
    onRememberColor: (colorValue: string) => void
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 99 : 'auto',
    }

    const icon = blockIconMap[typeSchema.icon || ''] || <Plus size={14} />

    // Optional image preview, configured per block type.
    const previewField = typeSchema.previewImageField
    const previewImage = previewField ? block.settings[previewField] : undefined
    const imagePreview = typeof previewImage === 'string' && previewImage ? (
        <div className="w-8 h-8 rounded overflow-hidden border border-[#ea728c]/30 bg-black/50 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewImage} alt="" className="w-full h-full object-cover" />
        </div>
    ) : null;

    const isFieldVisibleInViewport = (fieldKey: string): boolean => {
        if (viewport === 'desktop' && fieldKey.startsWith('mobile_')) return false
        if (viewport === 'mobile' && fieldKey.startsWith('desktop_')) return false
        return true
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            id={`block-item-${domId}`}
            className={`bg-[#1b1836] border rounded-xl overflow-hidden transition-all duration-300 ${
                isExpanded ? 'border-[#ea728c]/50' : 'border-[#ea728c]/20 hover:border-[#ea728c]/40'
            }`}
        >
            {/* Header */}
            <div className="flex items-center gap-2 px-3 py-2.5">
                <button
                    type="button"
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-white shrink-0"
                >
                    <GripVertical size={14} />
                </button>

                <button
                    type="button"
                    onClick={onToggle}
                    className="flex-1 flex items-center gap-2 text-left min-w-0"
                >
                    {isExpanded ? (
                        <ChevronDown size={14} className="text-[#ea728c] shrink-0" />
                    ) : (
                        <ChevronRight size={14} className="text-gray-400 shrink-0" />
                    )}
                    <div className="w-6 h-6 rounded bg-[#24204b] flex items-center justify-center text-[#ea728c] shrink-0">
                        {icon}
                    </div>
                    {imagePreview}
                    <span className="text-sm font-medium text-gray-200 truncate">
                        {title}
                    </span>
                </button>

                <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold shrink-0 hidden sm:block">
                    {typeSchema.label}
                </span>

                <button
                    type="button"
                    onClick={onRemove}
                    className="text-gray-500 hover:text-red-400 transition-colors p-1 shrink-0"
                >
                    <Trash2 size={13} />
                </button>
            </div>

            {/* Expanded settings */}
            {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-[#ea728c]/15 space-y-4">
                    {typeSchema.schema
                        .filter((field) => isFieldVisibleInViewport(field.key))
                        .map((field) => (
                        <FieldRenderer
                            key={`${block.id}-${field.key}`}
                            field={{ ...field, key: `${block.id}__${field.key}` }}
                            value={block.settings[field.key] ?? field.default ?? ''}
                            onChange={(_, val) => onUpdate({ [field.key]: val })}
                            uploadingState={uploadingState}
                            setUploadingState={setUploadingState}
                            useMediaLibraryForImage={useMediaLibraryForImage}
                            imageUploadFolder={imageUploadFolder}
                            savedColors={savedColors}
                            onRememberColor={onRememberColor}
                        />
                        ))}
                </div>
            )}
        </div>
    )
}
