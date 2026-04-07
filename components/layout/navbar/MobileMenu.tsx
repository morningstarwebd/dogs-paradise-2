import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { Camera, MessageCircle, Play, X } from 'lucide-react';
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
  mobileMenuCardBgColor: string;
  mobileMenuCardBorderColor: string;
  mobileMenuEnableActiveHighlight: boolean;
  mobileMenuActiveBgColor: string;
  mobileMenuActiveTextColor: string;
  mobileMenuIconBgColor: string;
  mobileMenuIconColor: string;
  mobileMenuIconActiveBgColor: string;
  mobileMenuIconActiveColor: string;
  mobileMenuRadius: number;
  mobileMenuText?: string;
  mobileMenuBrandName: string;
  mobileMenuLogoImage: string;
  mobileMenuSubtitle: string;
  mobileMenuTitle: string;
  mobileMenuPrimaryCtaText: string;
  mobileMenuPrimaryCtaUrl: string;
  mobileMenuWhatsappUrl: string;
  mobileMenuInstagramUrl: string;
  mobileMenuYoutubeUrl: string;
  mobileMenuWidth: number;
  mobileOpen: boolean;
  navLetterSpacing: number;
  navLinks: NavLinkItem[];
  navTextSize: number;
  navTextTransformStyle: 'none' | 'uppercase' | 'capitalize';
  pathname: string;
};

const FALLBACK_MOBILE_LINKS: NavLinkItem[] = [
  { label: 'Home', href: '/', icon: 'Home' },
  { label: 'Breeds', href: '/breeds', icon: 'Dog' },
  { label: 'About', href: '/about', icon: 'Info' },
  { label: 'Contact', href: '/contact', icon: 'Phone' },
];

function normalizeHref(value: string): string {
  return value.trim();
}

function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href) || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('whatsapp:');
}

function isTransparentBackground(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return true;
  if (normalized === 'transparent') return true;
  if (normalized === '#0000') return true;
  if (normalized === '#00000000') return true;
  if (/^rgba\([^\)]*,\s*0(?:\.0+)?\s*\)$/.test(normalized)) return true;
  if (/^hsla\([^\)]*,\s*0(?:\.0+)?\s*\)$/.test(normalized)) return true;
  return false;
}

type MobileQuickActionsProps = {
  closeMenu: () => void;
  mobileMenuPrimaryCtaText: string;
  mobileMenuPrimaryCtaUrl: string;
  mobileMenuWhatsappUrl: string;
  mobileMenuInstagramUrl: string;
  mobileMenuYoutubeUrl: string;
};

function MobileQuickActions({
  closeMenu,
  mobileMenuPrimaryCtaText,
  mobileMenuPrimaryCtaUrl,
  mobileMenuWhatsappUrl,
  mobileMenuInstagramUrl,
  mobileMenuYoutubeUrl,
}: MobileQuickActionsProps) {
  const primaryText = mobileMenuPrimaryCtaText.trim();
  const primaryUrl = normalizeHref(mobileMenuPrimaryCtaUrl);
  const whatsappUrl = normalizeHref(mobileMenuWhatsappUrl);
  const instagramUrl = normalizeHref(mobileMenuInstagramUrl);
  const youtubeUrl = normalizeHref(mobileMenuYoutubeUrl);

  const hasAnyQuickAction = Boolean(
    (primaryText && primaryUrl) || whatsappUrl || instagramUrl || youtubeUrl
  );

  if (!hasAnyQuickAction) return null;

  return (
    <div className="border-t px-4 pb-4 pt-3" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
      {primaryText && primaryUrl ? (
        isExternalHref(primaryUrl) ? (
          <a
            href={primaryUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            className="mb-3 flex h-12 w-full items-center justify-center rounded-xl bg-[#f97316] px-4 text-sm font-extrabold uppercase tracking-[0.12em] text-white shadow-lg shadow-[#f97316]/30 transition hover:brightness-105"
          >
            {primaryText}
          </a>
        ) : (
          <Link
            href={primaryUrl}
            onClick={closeMenu}
            className="mb-3 flex h-12 w-full items-center justify-center rounded-xl bg-[#f97316] px-4 text-sm font-extrabold uppercase tracking-[0.12em] text-white shadow-lg shadow-[#f97316]/30 transition hover:brightness-105"
          >
            {primaryText}
          </Link>
        )
      ) : null}

      <div className="grid grid-cols-1 gap-2">
        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-[#0a1b14] px-3 text-sm font-bold text-[#3ddc84] transition hover:bg-[#0f261c]"
          >
            <MessageCircle size={17} />
            WhatsApp
          </a>
        ) : null}

        {instagramUrl ? (
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-gradient-to-r from-[#7c3aed] via-[#e11d48] to-[#f59e0b] px-3 text-sm font-bold text-white transition hover:brightness-110"
          >
            <Camera size={17} />
            Instagram
          </a>
        ) : null}

        {youtubeUrl ? (
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-[#2a0f14] px-3 text-sm font-bold text-[#ff4d4d] transition hover:bg-[#34141b]"
          >
            <Play size={17} />
            YouTube
          </a>
        ) : null}
      </div>
    </div>
  );
}

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
  mobileMenuCardBgColor,
  mobileMenuCardBorderColor,
  mobileMenuEnableActiveHighlight,
  mobileMenuActiveBgColor,
  mobileMenuActiveTextColor,
  mobileMenuIconBgColor,
  mobileMenuIconColor,
  mobileMenuIconActiveBgColor,
  mobileMenuIconActiveColor,
  mobileMenuRadius,
  mobileMenuText,
  mobileMenuBrandName,
  mobileMenuLogoImage,
  mobileMenuSubtitle,
  mobileMenuTitle,
  mobileMenuPrimaryCtaText,
  mobileMenuPrimaryCtaUrl,
  mobileMenuWhatsappUrl,
  mobileMenuInstagramUrl,
  mobileMenuYoutubeUrl,
  mobileMenuWidth,
  mobileOpen,
  navLetterSpacing,
  navLinks,
  navTextSize,
  navTextTransformStyle,
  pathname,
}: MobileMenuProps) {
  const resolvedDrawerWidth = '100vw';
  const resolvedSideDrawerWidth = `min(${mobileMenuWidth}px, 64vw)`;
  const resolvedDrawerHeight = '100dvh';
  const drawerOffscreenX = Math.max(mobileMenuWidth, 1200);
  const sideDrawerRadiusPx = Math.max(12, Math.min(22, mobileMenuRadius || 18));
  const effectiveNavLinks = navLinks.length > 0 ? navLinks : FALLBACK_MOBILE_LINKS;
  const safeMenuBgColor = isTransparentBackground(mobileMenuBgColor) ? '#050505' : mobileMenuBgColor;
  const normalizedMenuText = (mobileMenuText || '').trim().toLowerCase();
  const safeMenuTextColor =
    !normalizedMenuText ||
    normalizedMenuText === 'transparent' ||
    normalizedMenuText === '#000' ||
    normalizedMenuText === '#000000'
      ? '#f8fafc'
      : mobileMenuText;
  const resolvedMenuTitle = mobileMenuTitle.trim() || 'Menu';
  const resolvedMenuSubtitle = mobileMenuSubtitle.trim() || mobileMenuBrandName.trim();

  const menuBody = (
    <>
      <div className="h-0 min-h-0 flex-1 overflow-y-auto py-2">
        <MobileNavLinksList
          closeMenu={closeMenu}
          headerTextColor={headerTextColor}
          mobileMenuActiveBgColor={mobileMenuActiveBgColor}
          mobileMenuActiveTextColor={mobileMenuActiveTextColor}
          mobileMenuCardBgColor={mobileMenuCardBgColor}
          mobileMenuCardBorderColor={mobileMenuCardBorderColor}
          mobileMenuEnableActiveHighlight={mobileMenuEnableActiveHighlight}
          mobileMenuIconActiveBgColor={mobileMenuIconActiveBgColor}
          mobileMenuIconActiveColor={mobileMenuIconActiveColor}
          mobileMenuIconBgColor={mobileMenuIconBgColor}
          mobileMenuIconColor={mobileMenuIconColor}
          mobileMenuText={safeMenuTextColor}
          navLetterSpacing={navLetterSpacing}
          navLinks={effectiveNavLinks}
          navTextSize={navTextSize}
          navTextTransformStyle={navTextTransformStyle}
          pathname={pathname}
        />
      </div>

      <MobileQuickActions
        closeMenu={closeMenu}
        mobileMenuPrimaryCtaText={mobileMenuPrimaryCtaText}
        mobileMenuPrimaryCtaUrl={mobileMenuPrimaryCtaUrl}
        mobileMenuWhatsappUrl={mobileMenuWhatsappUrl}
        mobileMenuInstagramUrl={mobileMenuInstagramUrl}
        mobileMenuYoutubeUrl={mobileMenuYoutubeUrl}
      />
    </>
  );

  return (
    <AnimatePresence>
      {mobileOpen && effectiveNavLinks.length > 0 ? (
        <motion.div className="fixed inset-0 z-[120] h-[100dvh] w-screen md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
              initial={{ x: isLeftDrawerMobileMenu ? -drawerOffscreenX : drawerOffscreenX }}
              animate={{ x: 0 }}
              exit={{ x: isLeftDrawerMobileMenu ? -drawerOffscreenX : drawerOffscreenX }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              className={cn(
                'absolute inset-y-0 flex h-[100dvh] flex-col overflow-hidden shadow-2xl',
                isLeftDrawerMobileMenu ? 'left-0 border-r' : 'right-0 border-l'
              )}
              style={{
                ...resolveBackgroundStyle(safeMenuBgColor, '#050505'),
                borderColor: headerBorderColor,
                color: safeMenuTextColor,
                width: resolvedSideDrawerWidth,
                height: resolvedDrawerHeight,
                maxHeight: resolvedDrawerHeight,
                borderRadius: isLeftDrawerMobileMenu
                  ? `0 ${sideDrawerRadiusPx}px ${sideDrawerRadiusPx}px 0`
                  : `${sideDrawerRadiusPx}px 0 0 ${sideDrawerRadiusPx}px`,
              }}
            >
              <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: headerBorderColor }}>
                <div className="flex min-w-0 items-center gap-2">
                  {mobileMenuLogoImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={mobileMenuLogoImage}
                      alt={mobileMenuBrandName || 'Site logo'}
                      className="h-9 w-9 rounded-lg object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold uppercase tracking-[0.12em]">{resolvedMenuTitle}</p>
                    {resolvedMenuSubtitle ? (
                      <p className="truncate text-[11px] font-semibold uppercase tracking-[0.12em] opacity-70">{resolvedMenuSubtitle}</p>
                    ) : null}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeMenu}
                  className="flex h-9 w-9 items-center justify-center text-white/80 hover:text-white"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>
              {menuBody}
            </motion.aside>
          ) : (
            <motion.div
              initial={{ y: -24, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -24, opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.22 }}
              className="absolute inset-0 flex h-[100dvh] flex-col overflow-hidden border shadow-2xl"
              style={{
                ...resolveBackgroundStyle(safeMenuBgColor, '#050505'),
                borderColor: headerBorderColor,
                height: resolvedDrawerHeight,
                maxHeight: resolvedDrawerHeight,
                borderRadius: '0px',
                color: safeMenuTextColor,
              }}
            >
              <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: headerBorderColor }}>
                <div className="flex min-w-0 items-center gap-2">
                  {mobileMenuLogoImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={mobileMenuLogoImage}
                      alt={mobileMenuBrandName || 'Site logo'}
                      className="h-9 w-9 rounded-lg object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold uppercase tracking-[0.12em]">{resolvedMenuTitle}</p>
                    {resolvedMenuSubtitle ? (
                      <p className="truncate text-[11px] font-semibold uppercase tracking-[0.12em] opacity-70">{resolvedMenuSubtitle}</p>
                    ) : null}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeMenu}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 hover:bg-black/10"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>
              {menuBody}
            </motion.div>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
