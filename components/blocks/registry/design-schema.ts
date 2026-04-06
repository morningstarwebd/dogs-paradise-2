import { SchemaField } from "@/types/schema.types";

// ─── Design Schema (shared across sections) ──────────────────────────
export const designSchemaFields: SchemaField[] = [
    {
        key: 'section_use_custom_bg_color',
        label: 'Use Custom Background For This Section',
        type: 'toggle',
        group: 'Design',
        default: false,
    },
    {
        key: 'section_bg_color',
        label: 'Custom Background Color / Gradient',
        type: 'color',
        group: 'Design',
        placeholder: 'e.g. #302b63 or linear-gradient(...)',
    },
    { key: 'section_text_color', label: 'Text Color', type: 'color', group: 'Design' },
    { key: 'decorative_blob_enabled', label: 'Show Pink Decorative Shape', type: 'toggle', group: 'Design', default: true },
    {
        key: 'decorative_blob_color',
        label: 'Pink Shape Color / Gradient',
        type: 'color',
        group: 'Design',
        default: '#ea728c',
        placeholder: 'e.g. gold-glitter, white-glitter, #D4AF37, or linear-gradient(...)',
    },
    { key: 'decorative_blob_size_scale', label: 'Pink Shape Size Scale', type: 'range', group: 'Design', default: 1, min: 0.5, max: 2.5, step: 0.05 },
    { key: 'decorative_shape_top_offset_x', label: 'Top Shape Set X Offset (Pink + Yellow)', type: 'range', group: 'Design', default: 0, min: -120, max: 120, step: 1 },
    { key: 'decorative_shape_top_offset_y', label: 'Top Shape Set Y Offset (Pink + Yellow)', type: 'range', group: 'Design', default: 0, min: -120, max: 120, step: 1 },
    { key: 'decorative_shape_bottom_offset_x', label: 'Bottom Shape Set X Offset (Pink + Yellow)', type: 'range', group: 'Design', default: 0, min: -120, max: 120, step: 1 },
    { key: 'decorative_shape_bottom_offset_y', label: 'Bottom Shape Set Y Offset (Pink + Yellow)', type: 'range', group: 'Design', default: 0, min: -120, max: 120, step: 1 },
    { key: 'decorative_outline_enabled', label: 'Show Yellow Decorative Shape', type: 'toggle', group: 'Design', default: true },
    { key: 'decorative_outline_color', label: 'Yellow Shape Color', type: 'color', group: 'Design', default: '#f5c842' },
    { key: 'decorative_outline_size_scale', label: 'Yellow Shape Size Scale', type: 'range', group: 'Design', default: 1, min: 0.5, max: 2.5, step: 0.05 },
    { key: 'section_padding_top', label: 'Padding Top (rem/px)', type: 'text', group: 'Design', placeholder: 'e.g. 4rem' },
    { key: 'section_padding_bottom', label: 'Padding Bottom (rem/px)', type: 'text', group: 'Design', placeholder: 'e.g. 4rem' },
    { key: 'section_margin_top', label: 'Margin Top (rem/px)', type: 'text', group: 'Design', placeholder: 'e.g. 2rem' },
    { key: 'section_margin_bottom', label: 'Margin Bottom (rem/px)', type: 'text', group: 'Design', placeholder: 'e.g. 2rem' },
];

export function buildSchema(contentFields: SchemaField[]): SchemaField[] {
    const withGroup = contentFields.map(f => ({ ...f, group: f.group || 'Content' }));
    return [...withGroup, ...designSchemaFields];
}

export function buildSchemaWithoutSectionTextColor(contentFields: SchemaField[]): SchemaField[] {
    const withGroup = contentFields.map(f => ({ ...f, group: f.group || 'Content' }));
    const designFieldsWithoutGlobalText = designSchemaFields.filter((field) => field.key !== 'section_text_color');
    return [...withGroup, ...designFieldsWithoutGlobalText];
}
