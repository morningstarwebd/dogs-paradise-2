import type { BlockInstance } from '@/types/schema.types'

export type EditorViewport = 'desktop' | 'mobile'

const DEVICE_VARIANTS_KEY = '__device_variants'
const DEVICE_VARIANTS_META_KEY = '__device_variants_meta'

type ContentRecord = Record<string, unknown>
type DeviceContentMap = Partial<Record<EditorViewport, ContentRecord>>
type TouchMap = Record<string, true>
type BlockSettingTouchMap = Record<string, TouchMap>

export type DeviceVariantMeta = {
  desktopTouched: boolean
  mobileTouched: boolean
  mobileFieldTouched: TouchMap
  mobileBlockSettingTouched: BlockSettingTouchMap
  mobileBlockStructureTouched: boolean
}

function isRecord(value: unknown): value is ContentRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function deepClone<T>(value: T): T {
  if (value === null || value === undefined) return value
  return JSON.parse(JSON.stringify(value)) as T
}

function stripDeviceMeta(content: ContentRecord): ContentRecord {
  const rest = { ...content }
  delete rest[DEVICE_VARIANTS_KEY]
  delete rest[DEVICE_VARIANTS_META_KEY]
  return rest
}

function getStoredDeviceVariants(content: ContentRecord): DeviceContentMap | null {
  const raw = content[DEVICE_VARIANTS_KEY]
  if (!isRecord(raw)) return null

  const variants: DeviceContentMap = {}
  if (isRecord(raw.desktop)) {
    variants.desktop = deepClone(raw.desktop)
  }
  if (isRecord(raw.mobile)) {
    variants.mobile = deepClone(raw.mobile)
  }

  return variants.desktop || variants.mobile ? variants : null
}

function parseTouchMap(value: unknown): TouchMap {
  if (!isRecord(value)) return {}
  const parsed: TouchMap = {}
  for (const [key, raw] of Object.entries(value)) {
    if (raw === true) {
      parsed[key] = true
    }
  }
  return parsed
}

function parseBlockSettingTouchMap(value: unknown): BlockSettingTouchMap {
  if (!isRecord(value)) return {}
  const parsed: BlockSettingTouchMap = {}
  for (const [blockId, raw] of Object.entries(value)) {
    const perBlock = parseTouchMap(raw)
    if (Object.keys(perBlock).length > 0) {
      parsed[blockId] = perBlock
    }
  }
  return parsed
}

function inferDeviceVariantMeta(content: ContentRecord): DeviceVariantMeta {
  const raw = content[DEVICE_VARIANTS_META_KEY]
  if (isRecord(raw)) {
    const mobileFieldTouched = parseTouchMap(raw.mobileFieldTouched)
    const mobileBlockSettingTouched = parseBlockSettingTouchMap(raw.mobileBlockSettingTouched)
    const hasExplicitMobileDivergenceMeta =
      Object.keys(mobileFieldTouched).length > 0 ||
      Object.keys(mobileBlockSettingTouched).length > 0 ||
      typeof raw.mobileBlockStructureTouched === 'boolean'

    // Legacy metadata (pre divergence tracking) may have mobileTouched=true even when
    // users never intentionally diverged mobile. Treat those as untouched so desktop
    // edits immediately mirror to mobile by default.
    const mobileTouched = hasExplicitMobileDivergenceMeta ? raw.mobileTouched === true : false

    return {
      desktopTouched: raw.desktopTouched !== false,
      mobileTouched,
      mobileFieldTouched,
      mobileBlockSettingTouched,
      mobileBlockStructureTouched:
        typeof raw.mobileBlockStructureTouched === 'boolean'
          ? raw.mobileBlockStructureTouched
          : false,
    }
  }

  return {
    desktopTouched: true,
    mobileTouched: false,
    mobileFieldTouched: {},
    mobileBlockSettingTouched: {},
    mobileBlockStructureTouched: false,
  }
}

function ensureDeviceVariants(content: ContentRecord): {
  variants: Required<DeviceContentMap>
  meta: DeviceVariantMeta
} {
  const fallbackBase = stripDeviceMeta(content)
  const stored = getStoredDeviceVariants(content)
  const meta = inferDeviceVariantMeta(content)

  const desktop = stored?.desktop ? deepClone(stored.desktop) : deepClone(fallbackBase)
  const mobile = meta.mobileTouched && stored?.mobile ? deepClone(stored.mobile) : {}

  return {
    variants: {
      desktop,
      mobile,
    },
    meta,
  }
}

function getEffectiveViewportContentForEdit(
  variants: Required<DeviceContentMap>,
  meta: DeviceVariantMeta,
  viewport: EditorViewport,
): ContentRecord {
  if (viewport === 'desktop') {
    return deepClone(variants.desktop)
  }
  if (meta.mobileTouched) {
    return deepClone(variants.mobile)
  }
  return deepClone(variants.desktop)
}

function getBlocks(content: ContentRecord): BlockInstance[] {
  const raw = content.blocks
  if (!Array.isArray(raw)) return []
  return deepClone(raw as BlockInstance[])
}

function setBlocks(content: ContentRecord, blocks: BlockInstance[]): ContentRecord {
  return {
    ...content,
    blocks: deepClone(blocks),
  }
}

function moveArrayItem<T>(items: T[], oldIndex: number, newIndex: number): T[] {
  if (oldIndex < 0 || newIndex < 0 || oldIndex >= items.length || newIndex >= items.length) {
    return items
  }
  const next = [...items]
  const [moved] = next.splice(oldIndex, 1)
  next.splice(newIndex, 0, moved)
  return next
}

function isMobileFieldTouched(meta: DeviceVariantMeta, key: string): boolean {
  return meta.mobileFieldTouched[key] === true
}

function isMobileBlockSettingTouched(
  meta: DeviceVariantMeta,
  blockId: string,
  settingKey: string,
): boolean {
  return meta.mobileBlockSettingTouched[blockId]?.[settingKey] === true
}

function toPersistedContent(
  variants: Required<DeviceContentMap>,
  meta: DeviceVariantMeta,
): ContentRecord {
  const desktopContent = deepClone(variants.desktop)

  const nextMeta: ContentRecord = {
    desktopTouched: meta.desktopTouched,
    mobileTouched: meta.mobileTouched,
  }
  if (Object.keys(meta.mobileFieldTouched).length > 0) {
    nextMeta.mobileFieldTouched = deepClone(meta.mobileFieldTouched)
  }
  if (Object.keys(meta.mobileBlockSettingTouched).length > 0) {
    nextMeta.mobileBlockSettingTouched = deepClone(meta.mobileBlockSettingTouched)
  }
  if (meta.mobileBlockStructureTouched) {
    nextMeta.mobileBlockStructureTouched = true
  }

  return {
    ...desktopContent,
    [DEVICE_VARIANTS_KEY]: {
      desktop: deepClone(variants.desktop),
      mobile: deepClone(variants.mobile),
    },
    [DEVICE_VARIANTS_META_KEY]: nextMeta,
  }
}

export function getViewportContent(content: ContentRecord, viewport: EditorViewport): ContentRecord {
  const { variants, meta } = ensureDeviceVariants(content)

  if (viewport === 'desktop') {
    return deepClone(variants.desktop)
  }

  if (!meta.mobileTouched) {
    // Fall back to desktop values until mobile-specific overrides exist.
    return deepClone(variants.desktop)
  }

  return deepClone(variants.mobile)
}

export function setViewportContent(
  content: ContentRecord,
  viewport: EditorViewport,
  viewportContent: ContentRecord,
): ContentRecord {
  const { variants, meta } = ensureDeviceVariants(content)
  if (viewport === 'desktop') {
    variants.desktop = deepClone(viewportContent)
    meta.desktopTouched = true
  } else {
    variants.mobile = deepClone(viewportContent)
    meta.mobileTouched = true
  }

  return toPersistedContent(variants, meta)
}

export function updateViewportFieldsWithSync(
  content: ContentRecord,
  viewport: EditorViewport,
  updates: ContentRecord,
): ContentRecord {
  const { variants, meta } = ensureDeviceVariants(content)

  if (viewport === 'desktop') {
    variants.desktop = {
      ...variants.desktop,
      ...deepClone(updates),
    }
    meta.desktopTouched = true

    if (meta.mobileTouched) {
      const nextMobile = deepClone(variants.mobile)
      for (const [key, value] of Object.entries(updates)) {
        if (!isMobileFieldTouched(meta, key)) {
          nextMobile[key] = deepClone(value)
        }
      }
      variants.mobile = nextMobile
    }
  } else {
    const mobileBase = getEffectiveViewportContentForEdit(variants, meta, 'mobile')
    variants.mobile = {
      ...mobileBase,
      ...deepClone(updates),
    }
    meta.mobileTouched = true
    for (const key of Object.keys(updates)) {
      meta.mobileFieldTouched[key] = true
    }
  }

  return toPersistedContent(variants, meta)
}

export function addViewportBlockWithSync(
  content: ContentRecord,
  viewport: EditorViewport,
  block: BlockInstance,
): ContentRecord {
  const { variants, meta } = ensureDeviceVariants(content)

  if (viewport === 'desktop') {
    const desktopContent = deepClone(variants.desktop)
    const desktopBlocks = getBlocks(desktopContent)
    desktopBlocks.push(deepClone(block))
    variants.desktop = setBlocks(desktopContent, desktopBlocks)
    meta.desktopTouched = true

    if (meta.mobileTouched && !meta.mobileBlockStructureTouched) {
      const mobileContent = deepClone(variants.mobile)
      const mobileBlocks = getBlocks(mobileContent)
      if (!mobileBlocks.some((item) => item.id === block.id)) {
        mobileBlocks.push(deepClone(block))
        variants.mobile = setBlocks(mobileContent, mobileBlocks)
      }
    }
  } else {
    const mobileContent = getEffectiveViewportContentForEdit(variants, meta, 'mobile')
    const mobileBlocks = getBlocks(mobileContent)
    mobileBlocks.push(deepClone(block))
    variants.mobile = setBlocks(mobileContent, mobileBlocks)
    meta.mobileTouched = true
    meta.mobileBlockStructureTouched = true
  }

  return toPersistedContent(variants, meta)
}

export function removeViewportBlockWithSync(
  content: ContentRecord,
  viewport: EditorViewport,
  blockIndex: number,
): ContentRecord {
  const { variants, meta } = ensureDeviceVariants(content)

  if (viewport === 'desktop') {
    const desktopContent = deepClone(variants.desktop)
    const desktopBlocks = getBlocks(desktopContent)
    if (blockIndex < 0 || blockIndex >= desktopBlocks.length) {
      return toPersistedContent(variants, meta)
    }

    const [removedBlock] = desktopBlocks.splice(blockIndex, 1)
    variants.desktop = setBlocks(desktopContent, desktopBlocks)
    meta.desktopTouched = true

    if (removedBlock) {
      delete meta.mobileBlockSettingTouched[removedBlock.id]
      if (meta.mobileTouched && !meta.mobileBlockStructureTouched) {
        const mobileContent = deepClone(variants.mobile)
        const mobileBlocks = getBlocks(mobileContent).filter((item) => item.id !== removedBlock.id)
        variants.mobile = setBlocks(mobileContent, mobileBlocks)
      }
    }
  } else {
    const mobileContent = getEffectiveViewportContentForEdit(variants, meta, 'mobile')
    const mobileBlocks = getBlocks(mobileContent)
    if (blockIndex < 0 || blockIndex >= mobileBlocks.length) {
      return toPersistedContent(variants, meta)
    }

    const [removedBlock] = mobileBlocks.splice(blockIndex, 1)
    variants.mobile = setBlocks(mobileContent, mobileBlocks)
    meta.mobileTouched = true
    meta.mobileBlockStructureTouched = true
    if (removedBlock) {
      delete meta.mobileBlockSettingTouched[removedBlock.id]
    }
  }

  return toPersistedContent(variants, meta)
}

export function reorderViewportBlocksWithSync(
  content: ContentRecord,
  viewport: EditorViewport,
  oldIndex: number,
  newIndex: number,
): ContentRecord {
  const { variants, meta } = ensureDeviceVariants(content)

  if (viewport === 'desktop') {
    const desktopContent = deepClone(variants.desktop)
    const desktopBlocks = getBlocks(desktopContent)
    const reorderedDesktopBlocks = moveArrayItem(desktopBlocks, oldIndex, newIndex)
    variants.desktop = setBlocks(desktopContent, reorderedDesktopBlocks)
    meta.desktopTouched = true

    if (meta.mobileTouched && !meta.mobileBlockStructureTouched) {
      const mobileContent = deepClone(variants.mobile)
      const mobileBlocks = getBlocks(mobileContent)
      const byId = new Map(mobileBlocks.map((blockItem) => [blockItem.id, blockItem]))
      const reorderedMobileBlocks: BlockInstance[] = []

      for (const desktopBlock of reorderedDesktopBlocks) {
        const matched = byId.get(desktopBlock.id)
        if (matched) {
          reorderedMobileBlocks.push(matched)
          byId.delete(desktopBlock.id)
        }
      }
      for (const remaining of byId.values()) {
        reorderedMobileBlocks.push(remaining)
      }

      variants.mobile = setBlocks(mobileContent, reorderedMobileBlocks)
    }
  } else {
    const mobileContent = getEffectiveViewportContentForEdit(variants, meta, 'mobile')
    const mobileBlocks = getBlocks(mobileContent)
    const reorderedMobileBlocks = moveArrayItem(mobileBlocks, oldIndex, newIndex)
    variants.mobile = setBlocks(mobileContent, reorderedMobileBlocks)
    meta.mobileTouched = true
    meta.mobileBlockStructureTouched = true
  }

  return toPersistedContent(variants, meta)
}

export function updateViewportBlockSettingsWithSync(
  content: ContentRecord,
  viewport: EditorViewport,
  blockIndex: number,
  settings: Record<string, unknown>,
): ContentRecord {
  const { variants, meta } = ensureDeviceVariants(content)

  if (viewport === 'desktop') {
    const desktopContent = deepClone(variants.desktop)
    const desktopBlocks = getBlocks(desktopContent)
    if (blockIndex < 0 || blockIndex >= desktopBlocks.length) {
      return toPersistedContent(variants, meta)
    }

    const desktopBlock = desktopBlocks[blockIndex]
    const blockId = desktopBlock.id
    desktopBlocks[blockIndex] = {
      ...desktopBlock,
      settings: {
        ...(desktopBlock.settings || {}),
        ...deepClone(settings),
      },
    }
    variants.desktop = setBlocks(desktopContent, desktopBlocks)
    meta.desktopTouched = true

    if (meta.mobileTouched) {
      const mobileContent = deepClone(variants.mobile)
      const mobileBlocks = getBlocks(mobileContent)
      const mobileBlockIndex = mobileBlocks.findIndex((item) => item.id === blockId)
      if (mobileBlockIndex >= 0) {
        const mobileBlock = mobileBlocks[mobileBlockIndex]
        const mergedSettings = {
          ...(mobileBlock.settings || {}),
        }
        for (const [key, value] of Object.entries(settings)) {
          if (!isMobileBlockSettingTouched(meta, blockId, key)) {
            mergedSettings[key] = deepClone(value)
          }
        }
        mobileBlocks[mobileBlockIndex] = {
          ...mobileBlock,
          settings: mergedSettings,
        }
        variants.mobile = setBlocks(mobileContent, mobileBlocks)
      }
    }
  } else {
    const mobileContent = getEffectiveViewportContentForEdit(variants, meta, 'mobile')
    const mobileBlocks = getBlocks(mobileContent)
    if (blockIndex < 0 || blockIndex >= mobileBlocks.length) {
      return toPersistedContent(variants, meta)
    }

    const mobileBlock = mobileBlocks[blockIndex]
    const blockId = mobileBlock.id
    mobileBlocks[blockIndex] = {
      ...mobileBlock,
      settings: {
        ...(mobileBlock.settings || {}),
        ...deepClone(settings),
      },
    }
    variants.mobile = setBlocks(mobileContent, mobileBlocks)
    meta.mobileTouched = true

    const blockTouchMap = {
      ...(meta.mobileBlockSettingTouched[blockId] || {}),
    }
    for (const key of Object.keys(settings)) {
      blockTouchMap[key] = true
    }
    meta.mobileBlockSettingTouched[blockId] = blockTouchMap
  }

  return toPersistedContent(variants, meta)
}

export function hasDeviceVariants(content: ContentRecord): boolean {
  return getStoredDeviceVariants(content) !== null
}
