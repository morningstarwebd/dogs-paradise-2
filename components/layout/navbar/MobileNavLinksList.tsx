import Link from 'next/link';
import {
  BookOpen,
  Dog,
  Heart,
  Home,
  Info,
  PawPrint,
  Phone,
  Star,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NavLinkItem } from './navbar-content';

type MobileNavLinksListProps = {
  closeMenu: () => void;
  headerTextColor: string;
  mobileMenuActiveBgColor: string;
  mobileMenuActiveTextColor: string;
  mobileMenuCardBgColor: string;
  mobileMenuCardBorderColor: string;
  mobileMenuEnableActiveHighlight: boolean;
  mobileMenuIconActiveBgColor: string;
  mobileMenuIconActiveColor: string;
  mobileMenuIconBgColor: string;
  mobileMenuIconColor: string;
  mobileMenuText?: string;
  navLetterSpacing: number;
  navLinks: NavLinkItem[];
  navTextSize: number;
  navTextTransformStyle: 'none' | 'uppercase' | 'capitalize';
  pathname: string;
};

const iconMap: Record<string, LucideIcon> = {
  Home,
  Dog,
  BookOpen,
  Info,
  Phone,
  Heart,
  Star,
  PawPrint,
};

function getNavIcon(iconName?: string): LucideIcon | null {
  if (!iconName) return null;
  const normalized = iconName.trim();
  if (!normalized || normalized.toLowerCase() === 'none') return null;
  return iconMap[normalized] ?? null;
}

export function MobileNavLinksList({
  closeMenu,
  headerTextColor,
  mobileMenuActiveBgColor,
  mobileMenuActiveTextColor,
  mobileMenuCardBgColor,
  mobileMenuCardBorderColor,
  mobileMenuEnableActiveHighlight,
  mobileMenuIconActiveBgColor,
  mobileMenuIconActiveColor,
  mobileMenuIconBgColor,
  mobileMenuIconColor,
  mobileMenuText,
  navLetterSpacing,
  navLinks,
  navTextSize,
  navTextTransformStyle,
  pathname,
}: MobileNavLinksListProps) {
  const fallbackMenuTextColor = '#e5e7eb';
  const fallbackMenuIconColor = '#cbd5e1';
  const fallbackMenuIconBg = 'rgba(255,255,255,0.08)';
  const fallbackCardBg = 'rgba(255,255,255,0.05)';
  const fallbackCardBorder = 'rgba(255,255,255,0.16)';

  return (
    <div className="flex flex-col gap-2 px-4 py-3">
      {navLinks.map((link, index) => {
        const Icon = getNavIcon(link.icon);
        const normalizedLinkText = (link.textColor || '').trim().toLowerCase();
        const safeLinkTextColor =
          normalizedLinkText && normalizedLinkText !== '#000' && normalizedLinkText !== '#000000'
            ? link.textColor
            : '';
        const normalizedHeaderText = (headerTextColor || '').trim().toLowerCase();
        const safeHeaderTextColor =
          normalizedHeaderText && normalizedHeaderText !== '#000' && normalizedHeaderText !== '#000000'
            ? headerTextColor
            : '';
        const normalizedCardBgColor = (mobileMenuCardBgColor || '').trim().toLowerCase();
        const normalizedCardBorderColor = (mobileMenuCardBorderColor || '').trim().toLowerCase();
        const linkTextColor =
          safeLinkTextColor || mobileMenuText || safeHeaderTextColor || fallbackMenuTextColor;
        const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
        const shouldHighlightActive = mobileMenuEnableActiveHighlight && isActive;
        const activeBgColor = link.activeBgColor || mobileMenuActiveBgColor;
        const activeTextColor = link.activeTextColor || mobileMenuActiveTextColor;
        const baseCardBackground =
          !normalizedCardBgColor || normalizedCardBgColor === 'transparent'
            ? fallbackCardBg
            : mobileMenuCardBgColor;
        const baseBorderColor =
          !normalizedCardBorderColor || normalizedCardBorderColor === 'transparent'
            ? fallbackCardBorder
            : mobileMenuCardBorderColor;
        const iconColor = link.iconColor || mobileMenuIconColor || fallbackMenuIconColor;
        const iconBgColor = link.iconBgColor || mobileMenuIconBgColor || fallbackMenuIconBg;
        const iconActiveColor = mobileMenuIconActiveColor || '#ffffff';
        const iconActiveBgColor = mobileMenuIconActiveBgColor || '#f7944d';

        return (
          <Link
            key={`${link.href}-${link.label}-${index}`}
            href={link.href}
            style={{
              color: shouldHighlightActive ? activeTextColor : linkTextColor || undefined,
              fontSize: `${Math.max(14, navTextSize)}px`,
              letterSpacing: `${navLetterSpacing}em`,
              textTransform: navTextTransformStyle,
              background: shouldHighlightActive ? activeBgColor : baseCardBackground,
              borderColor: shouldHighlightActive ? 'transparent' : baseBorderColor,
            }}
            onClick={closeMenu}
            className={cn(
              'group flex items-center gap-3 rounded-2xl border px-3 py-3.5 font-semibold transition-all duration-200',
              shouldHighlightActive
                ? 'shadow-lg'
                : linkTextColor
                  ? 'hover:bg-black/10'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            {Icon ? (
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors"
                style={{
                  background: shouldHighlightActive ? iconActiveBgColor : iconBgColor,
                  color: shouldHighlightActive ? iconActiveColor : iconColor,
                }}
              >
                <Icon size={17} />
              </span>
            ) : null}
            <span className="leading-none">{link.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
