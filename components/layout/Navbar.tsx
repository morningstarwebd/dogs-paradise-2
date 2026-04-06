'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, MoreHorizontal, X } from 'lucide-react';
import { resolveBackgroundStyle } from '@/lib/gradient-style';
import { type EditorViewport } from '@/lib/responsive-content';
import { cn } from '@/lib/utils';
import { useSectionPreviewContent } from '@/components/layout/shared/use-section-preview-content';
import { DesktopNavLinks } from './navbar/DesktopNavLinks';
import { MobileMenu } from './navbar/MobileMenu';
import { buildNavbarViewModel, isHeaderSection } from './navbar/navbar-content';

type NavbarProps = {
  initialContent?: Record<string, unknown>;
  initialViewport?: EditorViewport;
};

export default function Navbar({ initialContent = {}, initialViewport = 'desktop' }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const {
    previewViewport,
    rawContent: headerRawContent,
    content: headerContent,
  } = useSectionPreviewContent({
    initialContent,
    initialViewport,
    matchesSection: isHeaderSection,
  });

  const model = useMemo(
    () => buildNavbarViewModel(headerContent, headerRawContent, previewViewport),
    [headerContent, headerRawContent, previewViewport]
  );

  useEffect(() => {
    if (!mobileOpen || model.isDropdownMobileMenu) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [mobileOpen, model.isDropdownMobileMenu]);

  return (
    <header
      className={cn(
        model.stickyHeader ? 'sticky top-0' : 'relative',
        'z-50 border-b',
        model.headerShadow ? 'shadow-sm' : 'shadow-none'
      )}
      style={{
        ...resolveBackgroundStyle(model.headerBgColor, 'var(--color-surface)'),
        borderColor: model.headerBorderColor,
        color: model.headerTextColor || undefined,
      }}
    >
      <nav
        className={cn(
          'mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8',
          model.mobilePaddingClass,
          model.desktopPaddingClass
        )}
      >
        <Link href="/" className="group flex items-center" aria-label={model.brandName ? `${model.brandName} Home` : 'Home'}>
          {model.logoImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={model.logoImage}
              alt={model.computedLogoImageAlt}
              className="rounded-xl object-cover shadow-sm"
              style={{ height: `${model.logoSize}px`, width: `${model.logoSize}px` }}
            />
          ) : model.brandName ? (
            <span
              className={cn('font-display leading-tight tracking-tight', model.brandWeightClass)}
              style={{ color: model.headerTextColor || undefined, fontSize: `${Math.max(14, model.logoSize - 16)}px` }}
            >
              {model.brandName}
            </span>
          ) : null}

          {model.logoImage && model.brandName ? (
            <span
              className={cn('ml-3 hidden font-display leading-tight tracking-tight md:inline-flex', model.brandWeightClass)}
              style={{ color: model.headerTextColor || undefined, fontSize: `${Math.max(14, model.logoSize - 18)}px` }}
            >
              {model.brandName}
            </span>
          ) : null}

          {!model.hasBrandContent ? <span className="sr-only">Home</span> : null}
        </Link>

        <DesktopNavLinks
          headerTextColor={model.headerTextColor}
          navAlignmentClass={model.navAlignmentClass}
          navLetterSpacing={model.navLetterSpacing}
          navLinks={model.navLinks}
          navTextSize={model.navTextSize}
          navTextTransformStyle={model.navTextTransformStyle}
          navWeightClass={model.navWeightClass}
          pathname={pathname}
        />

        {model.canRenderMobileMenu ? (
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileOpen((open) => !open)}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full',
                model.headerTextColor
                  ? 'bg-black/5 text-current hover:bg-black/10'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X size={20} />
              ) : model.mobileMenuIcon === 'three-dot' ? (
                <MoreHorizontal size={20} />
              ) : (
                <Menu size={20} />
              )}
            </button>
          </div>
        ) : null}
      </nav>

      <MobileMenu
        closeMenu={() => setMobileOpen(false)}
        headerBorderColor={model.headerBorderColor}
        headerTextColor={model.headerTextColor}
        isDropdownMobileMenu={model.isDropdownMobileMenu}
        isLeftDrawerMobileMenu={model.isLeftDrawerMobileMenu}
        isSideDrawerMobileMenu={model.isSideDrawerMobileMenu}
        mobileMenuBackdropColor={model.mobileMenuBackdropColor}
        mobileMenuBackdropEnabled={model.mobileMenuBackdropEnabled}
        mobileMenuBackdropOpacity={model.mobileMenuBackdropOpacity}
        mobileMenuBgColor={model.mobileMenuBgColor}
        mobileMenuRadius={model.mobileMenuRadius}
        mobileMenuText={model.mobileMenuText}
        mobileMenuTitle={model.mobileMenuTitle}
        mobileMenuWidth={model.mobileMenuWidth}
        mobileOpen={mobileOpen}
        navLetterSpacing={model.navLetterSpacing}
        navLinks={model.navLinks}
        navTextSize={model.navTextSize}
        navTextTransformStyle={model.navTextTransformStyle}
        pathname={pathname}
      />
    </header>
  );
}
