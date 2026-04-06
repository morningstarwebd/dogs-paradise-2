import { type EditorViewport } from '@/lib/responsive-content';
import { resolveColorToken } from '@/lib/gradient-style';
import type { LiveSectionPayload } from '@/components/layout/shared/use-section-preview-content';
import {
  getBooleanValue,
  getBrandValues,
  getChoiceValue,
  getHeaderBlocks,
  getNavLinks,
  getNumberValue,
  getStringValue,
  isMobileVariantTouched,
  resolveWeightClass,
  type NavLinkItem,
} from './navbar-parsers';

export type { NavLinkItem };

export type NavbarViewModel = {
  brandName: string;
  brandWeightClass: string;
  canRenderMobileMenu: boolean;
  computedLogoImageAlt: string;
  desktopPaddingClass: string;
  hasBrandContent: boolean;
  headerBgColor: string;
  headerBorderColor: string;
  headerShadow: boolean;
  headerTextColor: string;
  isDropdownMobileMenu: boolean;
  isLeftDrawerMobileMenu: boolean;
  isSideDrawerMobileMenu: boolean;
  logoImage: string;
  logoSize: number;
  mobileMenuBackdropColor: string;
  mobileMenuBackdropEnabled: boolean;
  mobileMenuBackdropOpacity: number;
  mobileMenuBgColor: string;
  mobileMenuIcon: string;
  mobileMenuRadius: number;
  mobileMenuText?: string;
  mobileMenuTitle: string;
  mobileMenuWidth: number;
  mobilePaddingClass: string;
  navAlignmentClass: string;
  navLetterSpacing: number;
  navLinks: NavLinkItem[];
  navTextSize: number;
  navTextTransformStyle: 'none' | 'uppercase' | 'capitalize';
  navWeightClass: string;
  stickyHeader: boolean;
};

export function isHeaderSection(section: LiveSectionPayload): boolean {
  return section.section_id === 'header' || section.block_type === 'header';
}

export function buildNavbarViewModel(
  headerContent: Record<string, unknown>,
  headerRawContent: Record<string, unknown>,
  previewViewport: EditorViewport
): NavbarViewModel {
  const headerBlocks = getHeaderBlocks(headerContent.blocks);
  const currentViewportLinks = getNavLinks(headerContent, headerBlocks);
  const shouldFallbackDesktopLinks =
    previewViewport === 'mobile' && !isMobileVariantTouched(headerRawContent);
  const desktopContent = shouldFallbackDesktopLinks ? headerRawContent : {};
  const desktopBlocks = shouldFallbackDesktopLinks ? getHeaderBlocks(desktopContent.blocks) : [];
  const navLinks =
    currentViewportLinks.length > 0 ? currentViewportLinks : getNavLinks(desktopContent, desktopBlocks);
  const { logoImage, brandName } = getBrandValues(headerContent, headerBlocks);
  const headerBgColor = getStringValue(headerContent.header_bg_color);
  const headerTextColor = resolveColorToken(getStringValue(headerContent.header_text_color));
  const mobileMenuMode = getChoiceValue(
    headerContent.mobile_menu_mode,
    ['dropdown', 'left-drawer', 'right-drawer', 'front-panel'],
    'right-drawer'
  );
  const mobileMenuTextColor = resolveColorToken(getStringValue(headerContent.mobile_menu_text_color));

  return {
    brandName,
    brandWeightClass: resolveWeightClass(
      getChoiceValue(headerContent.brand_font_weight, ['normal', 'medium', 'semibold', 'bold'], 'bold'),
      'font-bold'
    ),
    canRenderMobileMenu: navLinks.length > 0,
    computedLogoImageAlt: brandName || 'Site logo',
    desktopPaddingClass:
      getChoiceValue(headerContent.desktop_padding_y, ['compact', 'default', 'spacious'], 'default') === 'compact'
        ? 'md:py-2'
        : getChoiceValue(headerContent.desktop_padding_y, ['compact', 'default', 'spacious'], 'default') === 'spacious'
          ? 'md:py-4'
          : 'md:py-3',
    hasBrandContent: Boolean(logoImage || brandName),
    headerBgColor,
    headerBorderColor: resolveColorToken(
      getStringValue(headerContent.header_border_color),
      'var(--color-border)'
    ),
    headerShadow: getBooleanValue(headerContent.header_shadow_enabled, true),
    headerTextColor,
    isDropdownMobileMenu: mobileMenuMode === 'dropdown',
    isLeftDrawerMobileMenu: mobileMenuMode === 'left-drawer',
    isSideDrawerMobileMenu: mobileMenuMode === 'left-drawer' || mobileMenuMode === 'right-drawer',
    logoImage,
    logoSize: getNumberValue(headerContent.logo_size, 40, 24, 64),
    mobileMenuBackdropColor: getStringValue(headerContent.mobile_menu_backdrop_color) || '#0f172a',
    mobileMenuBackdropEnabled: getBooleanValue(headerContent.mobile_menu_backdrop_enabled, true),
    mobileMenuBackdropOpacity: getNumberValue(
      headerContent.mobile_menu_backdrop_opacity,
      0.45,
      0,
      0.9
    ),
    mobileMenuBgColor:
      getStringValue(headerContent.mobile_menu_bg_color) || headerBgColor || 'var(--color-surface)',
    mobileMenuIcon: getChoiceValue(
      headerContent.mobile_menu_icon,
      ['hamburger', 'three-dot'],
      'three-dot'
    ),
    mobileMenuRadius: getNumberValue(headerContent.mobile_menu_radius, 20, 0, 36),
    mobileMenuText: resolveColorToken(mobileMenuTextColor || headerTextColor) || undefined,
    mobileMenuTitle: getStringValue(headerContent.mobile_menu_title) || 'Menu',
    mobileMenuWidth: getNumberValue(headerContent.mobile_menu_width, 300, 220, 420),
    mobilePaddingClass:
      getChoiceValue(headerContent.mobile_padding_y, ['compact', 'default', 'spacious'], 'default') === 'compact'
        ? 'py-2'
        : getChoiceValue(headerContent.mobile_padding_y, ['compact', 'default', 'spacious'], 'default') === 'spacious'
          ? 'py-4'
          : 'py-3',
    navAlignmentClass:
      getChoiceValue(headerContent.nav_alignment, ['left', 'center', 'right'], 'right') === 'left'
        ? 'justify-start'
        : getChoiceValue(headerContent.nav_alignment, ['left', 'center', 'right'], 'right') === 'center'
          ? 'justify-center'
          : 'justify-end',
    navLetterSpacing: getNumberValue(headerContent.nav_letter_spacing, 0, -0.05, 0.2),
    navLinks,
    navTextSize: getNumberValue(headerContent.nav_text_size, 15, 12, 24),
    navTextTransformStyle: getChoiceValue(
      headerContent.nav_text_transform,
      ['none', 'uppercase', 'capitalize'],
      'none'
    ) as NavbarViewModel['navTextTransformStyle'],
    navWeightClass: resolveWeightClass(
      getChoiceValue(headerContent.nav_weight, ['normal', 'medium', 'semibold', 'bold'], 'medium'),
      'font-medium'
    ),
    stickyHeader: getBooleanValue(headerContent.sticky_header, true),
  };
}
