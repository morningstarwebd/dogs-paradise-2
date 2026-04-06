import {
  deepClone,
  ensureDeviceVariants,
  isMobileFieldTouched,
  toPersistedContent,
} from './responsive-content-core';
import type { ContentRecord, EditorViewport } from './responsive-content-types';

export function getViewportContent(
  content: ContentRecord,
  viewport: EditorViewport
): ContentRecord {
  const { variants, meta } = ensureDeviceVariants(content);

  if (viewport === 'desktop') {
    return deepClone(variants.desktop);
  }

  return meta.mobileTouched ? deepClone(variants.mobile) : deepClone(variants.desktop);
}

export function setViewportContent(
  content: ContentRecord,
  viewport: EditorViewport,
  viewportContent: ContentRecord
): ContentRecord {
  const { variants, meta } = ensureDeviceVariants(content);

  if (viewport === 'desktop') {
    variants.desktop = deepClone(viewportContent);
    meta.desktopTouched = true;
  } else {
    variants.mobile = deepClone(viewportContent);
    meta.mobileTouched = true;
  }

  return toPersistedContent(variants, meta);
}

export function updateViewportFieldsWithSync(
  content: ContentRecord,
  viewport: EditorViewport,
  updates: ContentRecord
): ContentRecord {
  const { variants, meta } = ensureDeviceVariants(content);

  if (viewport === 'desktop') {
    variants.desktop = {
      ...variants.desktop,
      ...deepClone(updates),
    };
    meta.desktopTouched = true;

    if (meta.mobileTouched) {
      const nextMobile = deepClone(variants.mobile);
      for (const [key, value] of Object.entries(updates)) {
        if (!isMobileFieldTouched(meta, key)) {
          nextMobile[key] = deepClone(value);
        }
      }
      variants.mobile = nextMobile;
    }
  } else {
    variants.mobile = {
      ...deepClone(meta.mobileTouched ? variants.mobile : variants.desktop),
      ...deepClone(updates),
    };
    meta.mobileTouched = true;
    for (const key of Object.keys(updates)) {
      meta.mobileFieldTouched[key] = true;
    }
  }

  return toPersistedContent(variants, meta);
}
