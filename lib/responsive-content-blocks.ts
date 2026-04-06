import type { BlockInstance } from '@/types/schema.types';
import {
  deepClone,
  ensureDeviceVariants,
  getBlocks,
  getEffectiveViewportContentForEdit,
  isMobileBlockSettingTouched,
  moveArrayItem,
  setBlocks,
  toPersistedContent,
} from './responsive-content-core';
import type { ContentRecord, EditorViewport } from './responsive-content-types';

export function addViewportBlockWithSync(
  content: ContentRecord,
  viewport: EditorViewport,
  block: BlockInstance
): ContentRecord {
  const { variants, meta } = ensureDeviceVariants(content);

  if (viewport === 'desktop') {
    const desktopContent = deepClone(variants.desktop);
    const desktopBlocks = getBlocks(desktopContent);
    desktopBlocks.push(deepClone(block));
    variants.desktop = setBlocks(desktopContent, desktopBlocks);
    meta.desktopTouched = true;

    if (meta.mobileTouched && !meta.mobileBlockStructureTouched) {
      const mobileContent = deepClone(variants.mobile);
      const mobileBlocks = getBlocks(mobileContent);
      if (!mobileBlocks.some((item) => item.id === block.id)) {
        mobileBlocks.push(deepClone(block));
        variants.mobile = setBlocks(mobileContent, mobileBlocks);
      }
    }
  } else {
    const mobileContent = getEffectiveViewportContentForEdit(variants, meta, 'mobile');
    const mobileBlocks = getBlocks(mobileContent);
    mobileBlocks.push(deepClone(block));
    variants.mobile = setBlocks(mobileContent, mobileBlocks);
    meta.mobileTouched = true;
    meta.mobileBlockStructureTouched = true;
  }

  return toPersistedContent(variants, meta);
}

export function removeViewportBlockWithSync(
  content: ContentRecord,
  viewport: EditorViewport,
  blockIndex: number
): ContentRecord {
  const { variants, meta } = ensureDeviceVariants(content);
  const targetContent =
    viewport === 'desktop'
      ? deepClone(variants.desktop)
      : getEffectiveViewportContentForEdit(variants, meta, 'mobile');
  const blocks = getBlocks(targetContent);

  if (blockIndex < 0 || blockIndex >= blocks.length) {
    return toPersistedContent(variants, meta);
  }

  const [removedBlock] = blocks.splice(blockIndex, 1);
  if (viewport === 'desktop') {
    variants.desktop = setBlocks(targetContent, blocks);
    meta.desktopTouched = true;
    if (removedBlock) {
      delete meta.mobileBlockSettingTouched[removedBlock.id];
      if (meta.mobileTouched && !meta.mobileBlockStructureTouched) {
        const mobileContent = deepClone(variants.mobile);
        const mobileBlocks = getBlocks(mobileContent).filter((item) => item.id !== removedBlock.id);
        variants.mobile = setBlocks(mobileContent, mobileBlocks);
      }
    }
  } else {
    variants.mobile = setBlocks(targetContent, blocks);
    meta.mobileTouched = true;
    meta.mobileBlockStructureTouched = true;
    if (removedBlock) {
      delete meta.mobileBlockSettingTouched[removedBlock.id];
    }
  }

  return toPersistedContent(variants, meta);
}

export function reorderViewportBlocksWithSync(
  content: ContentRecord,
  viewport: EditorViewport,
  oldIndex: number,
  newIndex: number
): ContentRecord {
  const { variants, meta } = ensureDeviceVariants(content);

  if (viewport === 'desktop') {
    const desktopContent = deepClone(variants.desktop);
    const reorderedDesktopBlocks = moveArrayItem(getBlocks(desktopContent), oldIndex, newIndex);
    variants.desktop = setBlocks(desktopContent, reorderedDesktopBlocks);
    meta.desktopTouched = true;

    if (meta.mobileTouched && !meta.mobileBlockStructureTouched) {
      const mobileContent = deepClone(variants.mobile);
      const byId = new Map(getBlocks(mobileContent).map((blockItem) => [blockItem.id, blockItem]));
      const reorderedMobileBlocks: BlockInstance[] = [];

      for (const desktopBlock of reorderedDesktopBlocks) {
        const matched = byId.get(desktopBlock.id);
        if (matched) {
          reorderedMobileBlocks.push(matched);
          byId.delete(desktopBlock.id);
        }
      }
      for (const remaining of byId.values()) {
        reorderedMobileBlocks.push(remaining);
      }

      variants.mobile = setBlocks(mobileContent, reorderedMobileBlocks);
    }
  } else {
    const mobileContent = getEffectiveViewportContentForEdit(variants, meta, 'mobile');
    variants.mobile = setBlocks(mobileContent, moveArrayItem(getBlocks(mobileContent), oldIndex, newIndex));
    meta.mobileTouched = true;
    meta.mobileBlockStructureTouched = true;
  }

  return toPersistedContent(variants, meta);
}

export function updateViewportBlockSettingsWithSync(
  content: ContentRecord,
  viewport: EditorViewport,
  blockIndex: number,
  settings: Record<string, unknown>
): ContentRecord {
  const { variants, meta } = ensureDeviceVariants(content);
  const targetContent =
    viewport === 'desktop'
      ? deepClone(variants.desktop)
      : getEffectiveViewportContentForEdit(variants, meta, 'mobile');
  const blocks = getBlocks(targetContent);

  if (blockIndex < 0 || blockIndex >= blocks.length) {
    return toPersistedContent(variants, meta);
  }

  const targetBlock = blocks[blockIndex];
  const blockId = targetBlock.id;
  blocks[blockIndex] = {
    ...targetBlock,
    settings: {
      ...(targetBlock.settings || {}),
      ...deepClone(settings),
    },
  };

  if (viewport === 'desktop') {
    variants.desktop = setBlocks(targetContent, blocks);
    meta.desktopTouched = true;

    if (meta.mobileTouched) {
      const mobileContent = deepClone(variants.mobile);
      const mobileBlocks = getBlocks(mobileContent);
      const mobileBlockIndex = mobileBlocks.findIndex((item) => item.id === blockId);
      if (mobileBlockIndex >= 0) {
        const mobileBlock = mobileBlocks[mobileBlockIndex];
        const mergedSettings = { ...(mobileBlock.settings || {}) };
        for (const [key, value] of Object.entries(settings)) {
          if (!isMobileBlockSettingTouched(meta, blockId, key)) {
            mergedSettings[key] = deepClone(value);
          }
        }
        mobileBlocks[mobileBlockIndex] = { ...mobileBlock, settings: mergedSettings };
        variants.mobile = setBlocks(mobileContent, mobileBlocks);
      }
    }
  } else {
    variants.mobile = setBlocks(targetContent, blocks);
    meta.mobileTouched = true;
    const blockTouchMap = { ...(meta.mobileBlockSettingTouched[blockId] || {}) };
    for (const key of Object.keys(settings)) {
      blockTouchMap[key] = true;
    }
    meta.mobileBlockSettingTouched[blockId] = blockTouchMap;
  }

  return toPersistedContent(variants, meta);
}
