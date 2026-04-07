export type FieldType =
    | 'text'
    | 'textarea'
    | 'image'
    | 'toggle'
    | 'color'
    | 'select'
    | 'link'
    | 'number'
    | 'repeater'
    | 'range'
    | 'breed_lookup'


export type SchemaField = {
    key: string
    label: string
    type: FieldType
    group?: string // To separate Content vs Design tabs
    placeholder?: string
    options?: string[]
    fields?: SchemaField[] // for repeater
    min?: number // for range
    max?: number // for range
    step?: number // for range
    default?: number | string | boolean // for range and text toggles
    showIf?: (values: Record<string, unknown>) => boolean // for conditional rendering
    autoFillMap?: Record<string, string> // for breed_lookup: maps result keys to sibling field keys
}

// Shopify-style block type definition (defines what blocks a section supports)
export type BlockTypeSchema = {
    type: string          // e.g. 'hero_slide', 'hero_button', 'hero_stat'
    label: string         // e.g. 'Hero Slide', 'CTA Button'
    icon?: string         // lucide icon name
    limit?: number        // max instances allowed
    titleField?: string   // field key to use as row title in editor
    previewImageField?: string // optional image field for thumbnail preview
    schema: SchemaField[] // per-block-instance settings
}

// A single block instance stored in content.blocks[]
export type BlockInstance = {
    id: string            // unique ID for this instance
    type: string          // matches BlockTypeSchema.type
    settings: Record<string, unknown>
}

export type SectionSchema = {
    sectionId: string
    label: string
    icon: string
    fields: SchemaField[]
}

export type SectionData = {
    id: string
    section_id: string
    block_type?: string | null
    label: string
    content: Record<string, unknown>
    is_visible: boolean
    sort_order: number
    updated_at: string
    status: 'draft' | 'published'
    version?: number
}

export function getSectionBlockType(section: Pick<SectionData, 'section_id' | 'block_type'>): string {
    return section.block_type || section.section_id
}

export function isFixedWebsiteSection(section: Pick<SectionData, 'section_id' | 'block_type'> | string): boolean {
    const blockType = typeof section === 'string' ? section : getSectionBlockType(section)
    return blockType === 'header' || blockType === 'footer'
}
