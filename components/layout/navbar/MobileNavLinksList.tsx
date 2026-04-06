import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { NavLinkItem } from './navbar-content';

type MobileNavLinksListProps = {
  closeMenu: () => void;
  headerTextColor: string;
  mobileMenuText?: string;
  navLetterSpacing: number;
  navLinks: NavLinkItem[];
  navTextSize: number;
  navTextTransformStyle: 'none' | 'uppercase' | 'capitalize';
  pathname: string;
};

export function MobileNavLinksList({
  closeMenu,
  headerTextColor,
  mobileMenuText,
  navLetterSpacing,
  navLinks,
  navTextSize,
  navTextTransformStyle,
  pathname,
}: MobileNavLinksListProps) {
  return (
    <div className="flex flex-col gap-1 px-3 py-3">
      {navLinks.map((link, index) => {
        const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));

        return (
          <Link
            key={`${link.href}-${link.label}-${index}`}
            href={link.href}
            style={{
              color: mobileMenuText,
              fontSize: `${Math.max(14, navTextSize)}px`,
              letterSpacing: `${navLetterSpacing}em`,
              textTransform: navTextTransformStyle,
            }}
            onClick={closeMenu}
            className={cn(
              'rounded-xl px-4 py-3 font-medium transition-all',
              isActive
                ? headerTextColor
                  ? 'bg-black/10 font-semibold'
                  : 'bg-[#ea728c]/10 font-semibold text-[#ea728c]'
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
  );
}
