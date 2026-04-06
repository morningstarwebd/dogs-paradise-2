import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { resolveBackgroundStyle } from '@/lib/gradient-style';
import { cn } from '@/lib/utils';
import { MobileNavLinksList } from './MobileNavLinksList';
import type { NavLinkItem } from './navbar-content';

type MobileMenuProps = {
  closeMenu: () => void;
  headerBorderColor: string;
  headerTextColor: string;
  isDropdownMobileMenu: boolean;
  isLeftDrawerMobileMenu: boolean;
  isSideDrawerMobileMenu: boolean;
  mobileMenuBackdropColor: string;
  mobileMenuBackdropEnabled: boolean;
  mobileMenuBackdropOpacity: number;
  mobileMenuBgColor: string;
  mobileMenuRadius: number;
  mobileMenuText?: string;
  mobileMenuTitle: string;
  mobileMenuWidth: number;
  mobileOpen: boolean;
  navLetterSpacing: number;
  navLinks: NavLinkItem[];
  navTextSize: number;
  navTextTransformStyle: 'none' | 'uppercase' | 'capitalize';
  pathname: string;
};

export function MobileMenu({
  closeMenu,
  headerBorderColor,
  headerTextColor,
  isDropdownMobileMenu,
  isLeftDrawerMobileMenu,
  isSideDrawerMobileMenu,
  mobileMenuBackdropColor,
  mobileMenuBackdropEnabled,
  mobileMenuBackdropOpacity,
  mobileMenuBgColor,
  mobileMenuRadius,
  mobileMenuText,
  mobileMenuTitle,
  mobileMenuWidth,
  mobileOpen,
  navLetterSpacing,
  navLinks,
  navTextSize,
  navTextTransformStyle,
  pathname,
}: MobileMenuProps) {
  return (
    <AnimatePresence>
      {mobileOpen && navLinks.length > 0 && isDropdownMobileMenu ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden border-t md:hidden"
          style={{
            ...resolveBackgroundStyle(mobileMenuBgColor, 'var(--color-surface)'),
            borderColor: headerBorderColor,
            color: mobileMenuText,
          }}
        >
          <div className="px-4 pb-1 pt-3 text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: mobileMenuText, opacity: 0.75 }}>
            {mobileMenuTitle}
          </div>
          <MobileNavLinksList
            closeMenu={closeMenu}
            headerTextColor={headerTextColor}
            mobileMenuText={mobileMenuText}
            navLetterSpacing={navLetterSpacing}
            navLinks={navLinks}
            navTextSize={navTextSize}
            navTextTransformStyle={navTextTransformStyle}
            pathname={pathname}
          />
        </motion.div>
      ) : null}

      {mobileOpen && navLinks.length > 0 && !isDropdownMobileMenu ? (
        <motion.div className="fixed inset-0 z-[70] md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {mobileMenuBackdropEnabled ? (
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
              onClick={closeMenu}
            />
          ) : null}

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
                ...resolveBackgroundStyle(mobileMenuBgColor, 'var(--color-surface)'),
                borderColor: headerBorderColor,
                color: mobileMenuText,
                width: `${mobileMenuWidth}px`,
              }}
            >
              <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: headerBorderColor }}>
                <span className="text-sm font-semibold uppercase tracking-[0.12em]">{mobileMenuTitle}</span>
                <button
                  type="button"
                  onClick={closeMenu}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 hover:bg-black/10"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>
              <MobileNavLinksList
                closeMenu={closeMenu}
                headerTextColor={headerTextColor}
                mobileMenuText={mobileMenuText}
                navLetterSpacing={navLetterSpacing}
                navLinks={navLinks}
                navTextSize={navTextSize}
                navTextTransformStyle={navTextTransformStyle}
                pathname={pathname}
              />
            </motion.aside>
          ) : (
            <motion.div
              initial={{ y: -24, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -24, opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.22 }}
              className="absolute left-1/2 top-20 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 border shadow-2xl"
              style={{
                ...resolveBackgroundStyle(mobileMenuBgColor, 'var(--color-surface)'),
                borderColor: headerBorderColor,
                borderRadius: `${mobileMenuRadius}px`,
                color: mobileMenuText,
              }}
            >
              <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: headerBorderColor }}>
                <span className="text-sm font-semibold uppercase tracking-[0.12em]">{mobileMenuTitle}</span>
                <button
                  type="button"
                  onClick={closeMenu}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 hover:bg-black/10"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>
              <MobileNavLinksList
                closeMenu={closeMenu}
                headerTextColor={headerTextColor}
                mobileMenuText={mobileMenuText}
                navLetterSpacing={navLetterSpacing}
                navLinks={navLinks}
                navTextSize={navTextSize}
                navTextTransformStyle={navTextTransformStyle}
                pathname={pathname}
              />
            </motion.div>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
