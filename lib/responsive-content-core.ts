import type { BlockInstance } from '@/types/schema.types';
import {
  DEVICE_VARIANTS_KEY,
  DEVICE_VARIANTS_META_KEY,
  type ContentRecord,
  type DeviceContentMap,
  type DeviceVariantMeta,
  type EditorViewport,
  type TouchMap,
  type BlockSettingTouchMap,
} from './responsive-content-types';

export function isRecord(value: unknown): value is ContentRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function deepClone<T>(value: T): T {
  if (value === null || value === undefined) return value;
  return JSON.parse(JSON.stringify(value)) as T;
}

function stripDeviceMeta(content: ContentRecord): ContentRecord {
  const rest = { ...content };
  delete rest[DEVICE_VARIANTS_KEY];
  delete rest[DEVICE_VARIANTS_META_KEY];
  return rest;
}

export function getStoredDeviceVariants(content: ContentRecord): DeviceContentMap | null {
  const raw = content[DEVICE_VARIANTS_KEY];
  if (!isRecord(raw)) return null;

  const variants: DeviceContentMap = {};
  if (isRecord(raw.desktop)) {
    variants.desktop = deepClone(raw.desktop);
  }
  if (isRecord(raw.mobile)) {
    variants.mobile = deepClone(raw.mobile);
  }

  return variants.desktop || variants.mobile ? variants : null;
}

function parseTouchMap(value: unknown): TouchMap {
  if (!isRecord(value)) return {};
  const parsed: TouchMap = {};
  for (const [key, raw] of Object.entries(value)) {
    if (raw === true || raw === 'true') {
      parsed[key] = true;
    }
  }
  return parsed;
}

function mergeContentRecords(base: ContentRecord, overrides: ContentRecord): ContentRecord {
  const merged: ContentRecord = deepClone(base);

  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) continue;
    const baseValue = merged[key];

    if (isRecord(baseValue) && isRecord(value)) {
      merged[key] = mergeContentRecords(baseValue, value);
    } else {
      merged[key] = deepClone(value);
    }
  }

  return merged;
}

function parseBlockSettingTouchMap(value: unknown): BlockSettingTouchMap {
  if (!isRecord(value)) return {};
  const parsed: BlockSettingTouchMap = {};
  for (const [blockId, raw] of Object.entries(value)) {
    const perBlock = parseTouchMap(raw);
    if (Object.keys(perBlock).length > 0) {
      parsed[blockId] = perBlock;
    }
  }
  return parsed;
}

function areValuesEqual(left: unknown, right: unknown): boolean {
  if (left === right) return true;

  if (Array.isArray(left) && Array.isArray(right)) {
    if (left.length !== right.length) return false;
    for (let index = 0; index < left.length; index += 1) {
      if (!areValuesEqual(left[index], right[index])) return false;
    }
    return true;
  }

  if (isRecord(left) && isRecord(right)) {
    const leftKeys = Object.keys(left);
    const rightKeys = Object.keys(right);
    if (leftKeys.length !== rightKeys.length) return false;

    for (const key of leftKeys) {
      if (!Object.prototype.hasOwnProperty.call(right, key)) return false;
      if (!areValuesEqual(left[key], right[key])) return false;
    }
    return true;
  }

  return false;
}

function hasLegacyMobileOverrides(
  storedVariants: DeviceContentMap | null,
  fallbackDesktopContent: ContentRecord
): boolean {
  if (!storedVariants?.mobile || !isRecord(storedVariants.mobile)) {
    return false;
  }

  const desktopReference =
    storedVariants.desktop && isRecord(storedVariants.desktop)
      ? storedVariants.desktop
      : fallbackDesktopContent;

  return !areValuesEqual(storedVariants.mobile, desktopReference);
}

function inferDeviceVariantMeta(
  content: ContentRecord,
  legacyMobileOverridesDetected: boolean
): DeviceVariantMeta {
  const raw = content[DEVICE_VARIANTS_META_KEY];
  if (isRecord(raw)) {
    const mobileFieldTouched = parseTouchMap(raw.mobileFieldTouched);
    const mobileBlockSettingTouched = parseBlockSettingTouchMap(raw.mobileBlockSettingTouched);
    const hasMobileFieldTouches = Object.keys(mobileFieldTouched).length > 0;
    const hasMobileBlockSettingTouches = Object.keys(mobileBlockSettingTouched).length > 0;
    const hasMobileStructureTouch = raw.mobileBlockStructureTouched === true;
    const hasExplicitMobileDivergenceMeta =
      hasMobileFieldTouches ||
      hasMobileBlockSettingTouches ||
      typeof raw.mobileBlockStructureTouched === 'boolean';
    const inferredMobileTouchedFromMeta =
      hasMobileFieldTouches || hasMobileBlockSettingTouches || hasMobileStructureTouch;
    const explicitMobileTouchedValue =
      typeof raw.mobileTouched === 'boolean' ? raw.mobileTouched : null;

    return {
      desktopTouched: raw.desktopTouched !== false,
      mobileTouched:
        hasExplicitMobileDivergenceMeta
          ? explicitMobileTouchedValue ?? inferredMobileTouchedFromMeta
          : legacyMobileOverridesDetected && raw.mobileTouched !== false,
      mobileFieldTouched,
      mobileBlockSettingTouched,
      mobileBlockStructureTouched:
        typeof raw.mobileBlockStructureTouched === 'boolean'
          ? raw.mobileBlockStructureTouched
          : false,
    };
  }

  return {
    desktopTouched: true,
    mobileTouched: false,
    mobileFieldTouched: {},
    mobileBlockSettingTouched: {},
    mobileBlockStructureTouched: false,
  };
}

export function ensureDeviceVariants(content: ContentRecord): {
  variants: Required<DeviceContentMap>;
  meta: DeviceVariantMeta;
} {
  const fallbackBase = stripDeviceMeta(content);
  const stored = getStoredDeviceVariants(content);
  const meta = inferDeviceVariantMeta(
    content,
    hasLegacyMobileOverrides(stored, fallbackBase)
  );

  return {
    variants: {
      desktop: stored?.desktop ? deepClone(stored.desktop) : deepClone(fallbackBase),
      mobile: meta.mobileTouched && stored?.mobile ? deepClone(stored.mobile) : {},
    },
    meta,
  };
}

// Desktop edits keep flowing into mobile until the user explicitly diverges mobile.
// Once a mobile field or block setting is touched, that mobile value becomes isolated.
export function getEffectiveViewportContentForEdit(
  variants: Required<DeviceContentMap>,
  meta: DeviceVariantMeta,
  viewport: EditorViewport
): ContentRecord {
  if (viewport === 'desktop') {
    return deepClone(variants.desktop);
  }
  return meta.mobileTouched
    ? mergeContentRecords(variants.desktop, variants.mobile)
    : deepClone(variants.desktop);
}

export function getBlocks(content: ContentRecord): BlockInstance[] {
  const raw = content.blocks;
  if (!Array.isArray(raw)) return [];
  return deepClone(raw as BlockInstance[]);
}

export function setBlocks(content: ContentRecord, blocks: BlockInstance[]): ContentRecord {
  return {
    ...content,
    blocks: deepClone(blocks),
  };
}

export function moveArrayItem<T>(items: T[], oldIndex: number, newIndex: number): T[] {
  if (oldIndex < 0 || newIndex < 0 || oldIndex >= items.length || newIndex >= items.length) {
    return items;
  }
  const next = [...items];
  const [moved] = next.splice(oldIndex, 1);
  next.splice(newIndex, 0, moved);
  return next;
}

export function isMobileFieldTouched(meta: DeviceVariantMeta, key: string): boolean {
  return meta.mobileFieldTouched[key] === true;
}

export function isMobileBlockSettingTouched(
  meta: DeviceVariantMeta,
  blockId: string,
  settingKey: string
): boolean {
  return meta.mobileBlockSettingTouched[blockId]?.[settingKey] === true;
}

export function toPersistedContent(
  variants: Required<DeviceContentMap>,
  meta: DeviceVariantMeta
): ContentRecord {
  const desktopContent = deepClone(variants.desktop);
  const nextMeta: ContentRecord = {
    desktopTouched: meta.desktopTouched,
    mobileTouched: meta.mobileTouched,
  };

  if (Object.keys(meta.mobileFieldTouched).length > 0) {
    nextMeta.mobileFieldTouched = deepClone(meta.mobileFieldTouched);
  }
  if (Object.keys(meta.mobileBlockSettingTouched).length > 0) {
    nextMeta.mobileBlockSettingTouched = deepClone(meta.mobileBlockSettingTouched);
  }
  if (meta.mobileBlockStructureTouched) {
    nextMeta.mobileBlockStructureTouched = true;
  }

  return {
    ...desktopContent,
    [DEVICE_VARIANTS_KEY]: {
      desktop: deepClone(variants.desktop),
      mobile: deepClone(variants.mobile),
    },
    [DEVICE_VARIANTS_META_KEY]: nextMeta,
  };
}

export function hasDeviceVariants(content: ContentRecord): boolean {
  return getStoredDeviceVariants(content) !== null;
}
