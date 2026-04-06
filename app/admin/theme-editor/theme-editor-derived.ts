import { BlockRegistry, getSchemaWithLiquidBg } from '@/components/blocks/registry';
import { getViewportContent, type EditorViewport } from '@/lib/responsive-content';
import type { BlockInstance, SectionData, SchemaField } from '@/types/schema.types';
import { getSectionBlockType, isFixedWebsiteSection } from '@/types/schema.types';
import {
  BOTTOM_DECORATIVE_FIELD_KEYS,
  BOTTOM_DECORATIVE_SECTION_TYPES,
  DESKTOP_ONLY_FIELD_KEYS,
  GOLD_DUST_VISUAL_PRESETS,
  YELLOW_DECORATIVE_FIELD_KEYS,
  YELLOW_DECORATIVE_SECTION_TYPES,
} from './theme-editor-config';

export function isDesktopOnlyFieldKey(key: string): boolean {
  return key.startsWith('desktop_') || DESKTOP_ONLY_FIELD_KEYS.has(key);
}

export function isMobileOnlyFieldKey(key: string): boolean {
  return key.startsWith('mobile_');
}

export function getActiveSectionValues(activeSection: SectionData | undefined, viewport: EditorViewport) {
  if (!activeSection) {
    return {};
  }

  const viewportContent = getViewportContent((activeSection.content || {}) as Record<string, unknown>, viewport);
  if (getSectionBlockType(activeSection) !== 'header') {
    return viewportContent;
  }

  const presetValue =
    typeof viewportContent.global_visual_preset === 'string'
      ? viewportContent.global_visual_preset.trim().toLowerCase()
      : 'custom';
  const hasExplicitOverlayToggle = Object.prototype.hasOwnProperty.call(
    viewportContent,
    'enable_gold_dust_overlay'
  );

  return GOLD_DUST_VISUAL_PRESETS.has(presetValue) && !hasExplicitOverlayToggle
    ? { ...viewportContent, enable_gold_dust_overlay: true }
    : viewportContent;
}

export function getFilteredEditorSchema(
  activeBlockType: string | null,
  activeSchema: SchemaField[] | null,
  viewport: EditorViewport
) {
  return (activeSchema || []).filter((field) => {
    if (viewport === 'mobile' && isDesktopOnlyFieldKey(field.key)) return false;
    if (viewport === 'desktop' && isMobileOnlyFieldKey(field.key)) return false;
    if (YELLOW_DECORATIVE_FIELD_KEYS.has(field.key) && !YELLOW_DECORATIVE_SECTION_TYPES.has(activeBlockType || '')) return false;
    if (BOTTOM_DECORATIVE_FIELD_KEYS.has(field.key) && !BOTTOM_DECORATIVE_SECTION_TYPES.has(activeBlockType || '')) return false;
    return true;
  });
}

export function getThemeEditorDerivedState(sections: SectionData[], activeSectionId: string | null, viewport: EditorViewport) {
  const activeSection = sections.find((section) => section.id === activeSectionId);
  const editableSections = sections.filter((section) => !isFixedWebsiteSection(section));
  const headerSection = sections.find((section) => getSectionBlockType(section) === 'header');
  const footerSection = sections.find((section) => getSectionBlockType(section) === 'footer');
  const activeBlockType = activeSection ? getSectionBlockType(activeSection) : null;
  const activeSchema = activeBlockType && BlockRegistry[activeBlockType] ? getSchemaWithLiquidBg(activeBlockType) : null;
  const activeBlockSchemas = activeBlockType && BlockRegistry[activeBlockType] ? BlockRegistry[activeBlockType].blocks || null : null;
  const activeValues = getActiveSectionValues(activeSection, viewport);
  const editorSchema = getFilteredEditorSchema(activeBlockType, activeSchema, viewport);
  const activeBlocks = ((activeValues as Record<string, unknown>).blocks as BlockInstance[]) || [];

  return {
    activeBlockSchemas,
    activeBlockType,
    activeBlocks,
    activeSection,
    activeValues,
    editableSections,
    editorSchema,
    footerSection,
    headerSection,
  };
}
