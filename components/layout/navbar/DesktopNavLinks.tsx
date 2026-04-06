import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { NavLinkItem } from './navbar-content';

type DesktopNavLinksProps = {
  headerTextColor: string;
  navAlignmentClass: string;
  navLetterSpacing: number;
  navLinks: NavLinkItem[];
  navTextSize: number;
  navTextTransformStyle: 'none' | 'uppercase' | 'capitalize';
  navWeightClass: string;
  pathname: string;
};

export function DesktopNavLinks({
  headerTextColor,
  navAlignmentClass,
  navLetterSpacing,
  navLinks,
  navTextSize,
  navTextTransformStyle,
  navWeightClass,
  pathname,
}: DesktopNavLinksProps) {
  if (navLinks.length === 0) {
    return null;
  }

  return (
    <div className={cn('hidden flex-1 items-center gap-1 md:flex', navAlignmentClass)}>
      {navLinks.map((link, index) => {
        const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));

        return (
          <Link
            key={`${link.href}-${link.label}-${index}`}
            href={link.href}
            style={{
              color: headerTextColor || undefined,
              fontSize: `${navTextSize}px`,
              letterSpacing: `${navLetterSpacing}em`,
              textTransform: navTextTransformStyle,
            }}
            className={cn(
              'rounded-lg px-3 py-2 transition-all duration-200',
              navWeightClass,
              isActive
                ? headerTextColor
                  ? 'bg-black/10 font-semibold'
                  : 'bg-gradient-to-r from-[#d4604a]/10 to-[#2a9d8f]/10 font-semibold text-[#d4604a]'
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
  );
}
