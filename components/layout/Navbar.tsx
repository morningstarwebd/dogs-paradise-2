'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, MoreHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EditorViewport, getViewportContent } from '@/lib/responsive-content';
import { resolveBackgroundStyle, resolveColorToken } from '@/lib/gradient-style';

type HeaderSectionPayload = {
  section_id?: string;
  block_type?: string | null;
  content?: Record<string, unknown>;
};

type NavbarProps = {
  initialContent?: Record<string, unknown>;
  initialViewport?: EditorViewport;
};

type NavLinkItem = {
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

function isEditorViewport(value: unknown): value is EditorViewport {
  return value === 'desktop' || value === 'mobile';
}

function resolveHeaderContentByViewport(
  content: Record<string, unknown>,
  viewport: EditorViewport
): Record<string, unknown> {
  return getViewportContent(content, viewport);
}

function getStringValue(value: unknown): string {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : '';
}

function getBooleanValue(value: unknown, fallback: boolean): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
  }
  return fallback;
}

function getChoiceValue(value: unknown, choices: readonly string[], fallback: string): string {
  const normalized = getStringValue(value).toLowerCase();
  return choices.includes(normalized) ? normalized : fallback;
}

function getNumberValue(
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

function getHeaderBlocks(value: unknown): HeaderBlockItem[] {
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

function getBrandValues(content: Record<string, unknown>, blocks: HeaderBlockItem[]) {
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

function getNavLinks(content: Record<string, unknown>, blocks: HeaderBlockItem[]): NavLinkItem[] {
  const blockLinks = getBlockNavLinks(blocks);
  if (blockLinks.length > 0) {
    return blockLinks;
  }

  const repeaterLinks = getRepeaterNavLinks(content.nav_links);
  if (repeaterLinks.length > 0) {
    return repeaterLinks;
  }

  const customLinks: NavLinkItem[] = [];

  for (let i = 1; i <= 8; i += 1) {
    const label = getStringValue(content[`nav_link_${i}_label`]);
    const href = getStringValue(content[`nav_link_${i}_url`]);
    if (label) {
      customLinks.push({ label, href: href || '/' });
    }
  }

  return customLinks;
}

function isMobileVariantTouched(content: Record<string, unknown>): boolean {
  const rawMeta = content.__device_variants_meta;
  if (!rawMeta || typeof rawMeta !== 'object' || Array.isArray(rawMeta)) {
    return false;
  }

  return (rawMeta as DeviceVariantMeta).mobileTouched === true;
}

export default function Navbar({ initialContent = {}, initialViewport = 'desktop' }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [previewViewport, setPreviewViewport] = useState<EditorViewport>(initialViewport);
  const [headerRawContent, setHeaderRawContent] = useState<Record<string, unknown>>(initialContent);
  const [headerContent, setHeaderContent] = useState<Record<string, unknown>>(
    resolveHeaderContentByViewport(initialContent, initialViewport)
  );
  const pathname = usePathname();

  useEffect(() => {
    setHeaderRawContent(initialContent);
    setHeaderContent(resolveHeaderContentByViewport(initialContent, previewViewport));
  }, [initialContent, previewViewport]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === 'SET_PREVIEW_VIEWPORT' && isEditorViewport(event.data?.viewport)) {
        const nextViewport = event.data.viewport;
        setPreviewViewport(nextViewport);
        setHeaderContent(resolveHeaderContentByViewport(headerRawContent, nextViewport));
        return;
      }

      if (event.data?.type !== 'LIVE_PREVIEW_UPDATE') return;

      const nextViewport = isEditorViewport(event.data?.viewport)
        ? event.data.viewport
        : previewViewport;
      if (isEditorViewport(event.data?.viewport)) {
        setPreviewViewport(nextViewport);
      }

      const sections = event.data.sections as HeaderSectionPayload[] | undefined;
      if (!Array.isArray(sections)) return;

      const headerSection = sections.find(
        (section) => section.section_id === 'header' || section.block_type === 'header'
      );

      if (headerSection?.content && typeof headerSection.content === 'object') {
        const nextRawContent = headerSection.content;
        setHeaderRawContent(nextRawContent);
        setHeaderContent(resolveHeaderContentByViewport(nextRawContent, nextViewport));
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [headerRawContent, previewViewport]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const headerBlocks = useMemo(() => getHeaderBlocks(headerContent.blocks), [headerContent.blocks]);
  const navLinks = useMemo(() => {
    const currentViewportLinks = getNavLinks(headerContent, headerBlocks);
    if (currentViewportLinks.length > 0) {
      return currentViewportLinks;
    }

    // If mobile variant is untouched, keep mobile menu usable by falling back to desktop nav links.
    const shouldFallbackDesktopLinks =
      previewViewport === 'mobile' && !isMobileVariantTouched(headerRawContent);

    if (!shouldFallbackDesktopLinks) {
      return currentViewportLinks;
    }

    const desktopContent = resolveHeaderContentByViewport(headerRawContent, 'desktop');
    const desktopBlocks = getHeaderBlocks(desktopContent.blocks);
    return getNavLinks(desktopContent, desktopBlocks);
  }, [headerBlocks, headerContent, headerRawContent, previewViewport]);
  const { logoImage, brandName } = useMemo(
    () => getBrandValues(headerContent, headerBlocks),
    [headerContent, headerBlocks]
  );
  const hasBrandContent = Boolean(logoImage || brandName);
  const computedLogoImageAlt = brandName || 'Site logo';

  const stickyHeader = getBooleanValue(headerContent.sticky_header, true);
  const headerShadow = getBooleanValue(headerContent.header_shadow_enabled, true);
  const headerBgColor = getStringValue(headerContent.header_bg_color);
  const headerBorderColor = resolveColorToken(
    getStringValue(headerContent.header_border_color),
    'var(--color-border)'
  );
  const headerTextColor = resolveColorToken(getStringValue(headerContent.header_text_color));
  const mobileMenuTitle = getStringValue(headerContent.mobile_menu_title) || 'Menu';
  const logoSize = getNumberValue(headerContent.logo_size, 40, 24, 64);
  const brandTextSize = getNumberValue(headerContent.brand_text_size, 24, 14, 42);
  const navTextSize = getNumberValue(headerContent.nav_text_size, 15, 12, 24);
  const navAlignment = getChoiceValue(headerContent.nav_alignment, ['left', 'center', 'right'], 'right');
  const brandWeight = getChoiceValue(headerContent.brand_font_weight, ['normal', 'medium', 'semibold', 'bold'], 'bold');
  const navWeight = getChoiceValue(headerContent.nav_weight, ['normal', 'medium', 'semibold', 'bold'], 'medium');
  const navTextTransform = getChoiceValue(
    headerContent.nav_text_transform,
    ['none', 'uppercase', 'capitalize'],
    'none'
  );
  const navLetterSpacing = getNumberValue(headerContent.nav_letter_spacing, 0, -0.05, 0.2);
  const desktopPaddingY = getChoiceValue(
    headerContent.desktop_padding_y,
    ['compact', 'default', 'spacious'],
    'default'
  );
  const mobilePaddingY = getChoiceValue(
    headerContent.mobile_padding_y,
    ['compact', 'default', 'spacious'],
    'default'
  );
  const mobileMenuIcon = getChoiceValue(
    headerContent.mobile_menu_icon,
    ['hamburger', 'three-dot'],
    'three-dot'
  );
  const mobileMenuMode = getChoiceValue(
    headerContent.mobile_menu_mode,
    ['dropdown', 'left-drawer', 'right-drawer', 'front-panel'],
    'right-drawer'
  );
  const mobileMenuWidth = getNumberValue(headerContent.mobile_menu_width, 300, 220, 420);
  const mobileMenuRadius = getNumberValue(headerContent.mobile_menu_radius, 20, 0, 36);
  const mobileMenuBgColor =
    getStringValue(headerContent.mobile_menu_bg_color) || headerBgColor || 'var(--color-surface)';
  const mobileMenuTextColor = resolveColorToken(getStringValue(headerContent.mobile_menu_text_color));
  const mobileMenuBackdropEnabled = getBooleanValue(headerContent.mobile_menu_backdrop_enabled, true);
  const mobileMenuBackdropColor = getStringValue(headerContent.mobile_menu_backdrop_color) || '#0f172a';
  const mobileMenuBackdropOpacity = getNumberValue(headerContent.mobile_menu_backdrop_opacity, 0.45, 0, 0.9);

  const navAlignmentClass =
    navAlignment === 'left' ? 'justify-start' : navAlignment === 'center' ? 'justify-center' : 'justify-end';
  const brandWeightClass =
    brandWeight === 'normal'
      ? 'font-normal'
      : brandWeight === 'medium'
        ? 'font-medium'
        : brandWeight === 'semibold'
          ? 'font-semibold'
          : 'font-bold';
  const navWeightClass =
    navWeight === 'normal'
      ? 'font-normal'
      : navWeight === 'semibold'
        ? 'font-semibold'
        : navWeight === 'bold'
          ? 'font-bold'
          : 'font-medium';
  const desktopPaddingClass =
    desktopPaddingY === 'compact' ? 'md:py-2' : desktopPaddingY === 'spacious' ? 'md:py-4' : 'md:py-3';
  const mobilePaddingClass =
    mobilePaddingY === 'compact' ? 'py-2' : mobilePaddingY === 'spacious' ? 'py-4' : 'py-3';
  const navTextTransformStyle =
    navTextTransform === 'uppercase'
      ? 'uppercase'
      : navTextTransform === 'capitalize'
        ? 'capitalize'
        : 'none';
  const canRenderMobileMenu = navLinks.length > 0;
  const isDropdownMobileMenu = mobileMenuMode === 'dropdown';
  const isLeftDrawerMobileMenu = mobileMenuMode === 'left-drawer';
  const isRightDrawerMobileMenu = mobileMenuMode === 'right-drawer';
  const isSideDrawerMobileMenu = isLeftDrawerMobileMenu || isRightDrawerMobileMenu;
  const mobileMenuText = resolveColorToken(mobileMenuTextColor || headerTextColor) || undefined;

  useEffect(() => {
    if (!mobileOpen || isDropdownMobileMenu) return;

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [mobileOpen, isDropdownMobileMenu]);

  return (
    <header
      className={cn(
        stickyHeader ? 'sticky top-0' : 'relative',
        'z-50 border-b',
        headerShadow ? 'shadow-sm' : 'shadow-none'
      )}
      style={{
        ...resolveBackgroundStyle(headerBgColor, 'var(--color-surface)'),
        borderColor: headerBorderColor,
        color: headerTextColor || undefined,
      }}
    >
      <nav
        className={cn(
          'mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8',
          mobilePaddingClass,
          desktopPaddingClass
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center"
          aria-label={brandName ? `${brandName} Home` : 'Home'}
        >
          {logoImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoImage}
              alt={computedLogoImageAlt}
              className="rounded-xl object-cover shadow-sm"
              style={{ width: `${logoSize}px`, height: `${logoSize}px` }}
            />
          ) : brandName ? (
            <span
              className={cn('font-display leading-tight tracking-tight', brandWeightClass)}
              style={{
                fontSize: `${brandTextSize}px`,
                color: headerTextColor || undefined,
              }}
            >
              {brandName}
            </span>
          ) : null}
          {logoImage && brandName && (
            <span
              className={cn('ml-3 hidden font-display leading-tight tracking-tight md:inline-flex', brandWeightClass)}
              style={{
                fontSize: `${Math.max(14, brandTextSize - 2)}px`,
                color: headerTextColor || undefined,
              }}
            >
              {brandName}
            </span>
          )}
          {!hasBrandContent && <span className="sr-only">Home</span>}
        </Link>

        {/* Desktop Nav Links */}
        {navLinks.length > 0 && (
          <div className={cn('hidden flex-1 items-center gap-1 md:flex', navAlignmentClass)}>
            {navLinks.map((link, index) => {
              const isActive =
                pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href));

              return (
                <Link
                  key={`${link.href}-${link.label}-${index}`}
                  href={link.href}
                  style={{
                    color: headerTextColor || undefined,
                    fontSize: `${navTextSize}px`,
                    textTransform: navTextTransformStyle,
                    letterSpacing: `${navLetterSpacing}em`,
                  }}
                  className={cn(
                    'rounded-lg px-3 py-2 transition-all duration-200',
                    navWeightClass,
                    isActive
                      ? headerTextColor
                        ? 'bg-black/10 font-semibold'
                        : 'bg-gradient-to-r from-[#d4604a]/10 to-[#2a9d8f]/10 text-[#d4604a] font-semibold'
                      : headerTextColor
                        ? 'hover:bg-black/5'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}

        {/* Mobile Menu Toggle */}
        {canRenderMobileMenu && (
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileOpen((open) => !open)}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full',
                headerTextColor
                  ? 'bg-black/5 text-current hover:bg-black/10'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={20} /> : mobileMenuIcon === 'three-dot' ? <MoreHorizontal size={20} /> : <Menu size={20} />}
            </button>
          </div>
        )}
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && canRenderMobileMenu && isDropdownMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t md:hidden"
            style={{
              borderColor: headerBorderColor,
              ...resolveBackgroundStyle(mobileMenuBgColor, 'var(--color-surface)'),
              color: mobileMenuText,
            }}
          >
            <div
              className="px-4 pb-1 pt-3 text-xs font-semibold uppercase tracking-[0.12em]"
              style={{ color: mobileMenuText, opacity: 0.75 }}
            >
              {mobileMenuTitle}
            </div>
            <div className="flex flex-col gap-1 px-4 py-4">
              {navLinks.map((link, index) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== '/' && pathname.startsWith(link.href));

                return (
                  <Link
                    key={`${link.href}-${link.label}-${index}`}
                    href={link.href}
                    style={{
                      color: mobileMenuText,
                      fontSize: `${Math.max(14, navTextSize)}px`,
                      textTransform: navTextTransformStyle,
                      letterSpacing: `${navLetterSpacing}em`,
                    }}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'rounded-xl px-4 py-3 font-medium transition-all',
                      isActive
                        ? headerTextColor
                          ? 'bg-black/10 font-semibold'
                          : 'bg-[#ea728c]/10 text-[#ea728c] font-semibold'
                        : headerTextColor
                          ? 'hover:bg-black/5'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && canRenderMobileMenu && !isDropdownMobileMenu && (
          <motion.div
            className="fixed inset-0 z-[70] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {mobileMenuBackdropEnabled && (
              <motion.button
                type="button"
                aria-label="Close menu overlay"
                className="absolute inset-0"
                style={{
                  ...resolveBackgroundStyle(mobileMenuBackdropColor, '#0f172a'),
                  opacity: mobileMenuBackdropOpacity,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: mobileMenuBackdropOpacity }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
              />
            )}

            {isSideDrawerMobileMenu ? (
              <motion.aside
                initial={{ x: isLeftDrawerMobileMenu ? -mobileMenuWidth : mobileMenuWidth }}
                animate={{ x: 0 }}
                exit={{ x: isLeftDrawerMobileMenu ? -mobileMenuWidth : mobileMenuWidth }}
                transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                className={cn(
                  'absolute top-0 h-full shadow-2xl',
                  isLeftDrawerMobileMenu ? 'left-0 border-r' : 'right-0 border-l'
                )}
                style={{
                  width: `${mobileMenuWidth}px`,
                  ...resolveBackgroundStyle(mobileMenuBgColor, 'var(--color-surface)'),
                  borderColor: headerBorderColor,
                  color: mobileMenuText,
                }}
              >
                <div
                  className="flex items-center justify-between border-b px-4 py-3"
                  style={{ borderColor: headerBorderColor }}
                >
                  <span className="text-sm font-semibold uppercase tracking-[0.12em]">{mobileMenuTitle}</span>
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 hover:bg-black/10"
                    aria-label="Close menu"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="flex flex-col gap-1 px-3 py-3">
                  {navLinks.map((link, index) => {
                    const isActive =
                      pathname === link.href ||
                      (link.href !== '/' && pathname.startsWith(link.href));

                    return (
                      <Link
                        key={`${link.href}-${link.label}-${index}`}
                        href={link.href}
                        style={{
                          color: mobileMenuText,
                          fontSize: `${Math.max(14, navTextSize)}px`,
                          textTransform: navTextTransformStyle,
                          letterSpacing: `${navLetterSpacing}em`,
                        }}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'rounded-xl px-4 py-3 font-medium transition-all',
                          isActive
                            ? 'bg-black/10 font-semibold'
                            : 'hover:bg-black/5'
                        )}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </motion.aside>
            ) : (
              <motion.div
                initial={{ y: -24, opacity: 0, scale: 0.97 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -24, opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.22 }}
                className="absolute left-1/2 top-20 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 border shadow-2xl"
                style={{
                  borderRadius: `${mobileMenuRadius}px`,
                  ...resolveBackgroundStyle(mobileMenuBgColor, 'var(--color-surface)'),
                  borderColor: headerBorderColor,
                  color: mobileMenuText,
                }}
              >
                <div
                  className="flex items-center justify-between border-b px-4 py-3"
                  style={{ borderColor: headerBorderColor }}
                >
                  <span className="text-sm font-semibold uppercase tracking-[0.12em]">{mobileMenuTitle}</span>
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 hover:bg-black/10"
                    aria-label="Close menu"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="flex flex-col gap-1 px-3 py-3">
                  {navLinks.map((link, index) => {
                    const isActive =
                      pathname === link.href ||
                      (link.href !== '/' && pathname.startsWith(link.href));

                    return (
                      <Link
                        key={`${link.href}-${link.label}-${index}`}
                        href={link.href}
                        style={{
                          color: mobileMenuText,
                          fontSize: `${Math.max(14, navTextSize)}px`,
                          textTransform: navTextTransformStyle,
                          letterSpacing: `${navLetterSpacing}em`,
                        }}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'rounded-xl px-4 py-3 font-medium transition-all',
                          isActive
                            ? 'bg-black/10 font-semibold'
                            : 'hover:bg-black/5'
                        )}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
