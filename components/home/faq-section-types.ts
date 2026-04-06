export type RawBlock = {
    id?: string
    type?: string
    settings?: Record<string, unknown>
}

export type FAQItem = {
    id: string
    question: string
    answer: string
    blockId?: string
    questionKey: string
    answerKey: string
}

export type FAQSectionProps = {
    heading?: string
    subheading?: string
    blocks?: RawBlock[]
    sectionId?: string
    isEditorMode?: boolean
    section_bg_color?: string
    section_text_color?: string
    section_padding_top?: string
    section_padding_bottom?: string
    section_margin_top?: string
    section_margin_bottom?: string
}
