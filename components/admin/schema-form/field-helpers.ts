import type { SchemaField } from '@/types/schema.types';
import type { EditorViewport } from '@/lib/responsive-content';

export function getRepeaterItems(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => (item && typeof item === 'object' && !Array.isArray(item) ? { ...(item as Record<string, unknown>) } : {}));
}

export function getRepeaterItemDefaults(fields: SchemaField[]): Record<string, unknown> {
  return fields.reduce((accumulator, field) => {
    if (field.default !== undefined) accumulator[field.key] = field.default;
    else if (field.type === 'toggle') accumulator[field.key] = false;
    else if (field.type === 'number' || field.type === 'range') accumulator[field.key] = 0;
    else accumulator[field.key] = '';
    return accumulator;
  }, {} as Record<string, unknown>);
}

export function normalizeFieldKey(fieldKey: string): string {
  const markerIndex = fieldKey.indexOf('__');
  return markerIndex === -1 ? fieldKey : fieldKey.slice(markerIndex + 2);
}

export function isFieldVisibleInViewport(field: SchemaField, viewport: EditorViewport): boolean {
  const normalizedKey = normalizeFieldKey(field.key);
  if (viewport === 'desktop' && normalizedKey.startsWith('mobile_')) return false;
  if (viewport === 'mobile' && normalizedKey.startsWith('desktop_')) return false;
  return true;
}
