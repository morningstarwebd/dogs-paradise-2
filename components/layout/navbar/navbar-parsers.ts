export type NavLinkItem = {
  href: string;
  label: string;
};

type HeaderBlockItem = {
  type: string;
  settings: Record<string, unknown>;
};

type DeviceVariantMeta = {
  mobileTouched?: boolean;
};

export function getStringValue(value: unknown): string {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : '';
}

export function getBooleanValue(value: unknown, fallback: boolean): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
  }
  return fallback;
}

export function getChoiceValue(value: unknown, choices: readonly string[], fallback: string): string {
  const normalized = getStringValue(value).toLowerCase();
  return choices.includes(normalized) ? normalized : fallback;
}

export function getNumberValue(
  value: unknown,
  fallback: number,
  min?: number,
  max?: number
): number {
  const parsed = typeof value === 'number' ? value : Number(value);
  let normalized = Number.isFinite(parsed) ? parsed : fallback;

  if (typeof min === 'number') normalized = Math.max(min, normalized);
  if (typeof max === 'number') normalized = Math.min(max, normalized);

  return normalized;
}

export function getHeaderBlocks(value: unknown): HeaderBlockItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((entry) => {
      if (!entry || typeof entry !== 'object') return null;
      const block = entry as Record<string, unknown>;
      if (typeof block.type !== 'string') return null;
      const settings =
        block.settings && typeof block.settings === 'object' && !Array.isArray(block.settings)
          ? (block.settings as Record<string, unknown>)
          : {};

      return { type: block.type, settings };
    })
    .filter((item): item is HeaderBlockItem => item !== null);
}

function getRepeaterNavLinks(value: unknown): NavLinkItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((entry) => {
      if (!entry || typeof entry !== 'object') return null;
      const item = entry as Record<string, unknown>;
      const label = getStringValue(item.label);
      const href = getStringValue(item.url || item.href) || '/';
      if (!label) return null;
      return { label, href };
    })
    .filter((item): item is NavLinkItem => item !== null);
}

function getBlockNavLinks(blocks: HeaderBlockItem[]): NavLinkItem[] {
  return blocks
    .filter((block) => block.type === 'header_nav_link')
    .map((block) => {
      const label = getStringValue(block.settings.label);
      const href = getStringValue(block.settings.url || block.settings.href) || '/';
      if (!label) return null;
      return { label, href };
    })
    .filter((item): item is NavLinkItem => item !== null);
}

export function getBrandValues(content: Record<string, unknown>, blocks: HeaderBlockItem[]) {
  const brandBlock = blocks.find((block) => block.type === 'header_brand');
  const brandSettings = brandBlock?.settings || {};
  const brandName = getStringValue(
    brandSettings.logo_text || brandSettings.brand_name || content.logo_text || content.brand_name
  );

  return {
    logoImage: getStringValue(brandSettings.logo_image || content.logo_image),
    brandName,
  };
}

export function getNavLinks(
  content: Record<string, unknown>,
  blocks: HeaderBlockItem[]
): NavLinkItem[] {
  const blockLinks = getBlockNavLinks(blocks);
  if (blockLinks.length > 0) return blockLinks;

  const repeaterLinks = getRepeaterNavLinks(content.nav_links);
  if (repeaterLinks.length > 0) return repeaterLinks;

  return Array.from({ length: 8 }, (_, index) => index + 1)
    .map((itemIndex) => {
      const label = getStringValue(content[`nav_link_${itemIndex}_label`]);
      const href = getStringValue(content[`nav_link_${itemIndex}_url`]);
      return label ? { label, href: href || '/' } : null;
    })
    .filter((item): item is NavLinkItem => item !== null);
}

export function isMobileVariantTouched(content: Record<string, unknown>): boolean {
  const rawMeta = content.__device_variants_meta;
  if (!rawMeta || typeof rawMeta !== 'object' || Array.isArray(rawMeta)) {
    return false;
  }

  return (rawMeta as DeviceVariantMeta).mobileTouched === true;
}

export function resolveWeightClass(value: string, fallback: string): string {
  switch (value) {
    case 'normal':
      return 'font-normal';
    case 'medium':
      return 'font-medium';
    case 'semibold':
      return 'font-semibold';
    case 'bold':
      return 'font-bold';
    default:
      return fallback;
  }
}
