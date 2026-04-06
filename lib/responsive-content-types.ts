export type EditorViewport = 'desktop' | 'mobile';

export type ContentRecord = Record<string, unknown>;
export type DeviceContentMap = Partial<Record<EditorViewport, ContentRecord>>;
export type TouchMap = Record<string, true>;
export type BlockSettingTouchMap = Record<string, TouchMap>;

export type DeviceVariantMeta = {
  desktopTouched: boolean;
  mobileTouched: boolean;
  mobileFieldTouched: TouchMap;
  mobileBlockSettingTouched: BlockSettingTouchMap;
  mobileBlockStructureTouched: boolean;
};

export const DEVICE_VARIANTS_KEY = '__device_variants';
export const DEVICE_VARIANTS_META_KEY = '__device_variants_meta';
