'use client';

import { Heart } from 'lucide-react';
import { resolveBackgroundStyle, resolveColorToken } from '@/lib/gradient-style';
import { type EditorViewport } from '@/lib/responsive-content';
import { useSectionPreviewContent } from '@/components/layout/shared/use-section-preview-content';
import { FooterBrandColumn } from './footer/FooterBrandColumn';
import { FooterLinksColumn } from './footer/FooterLinksColumn';
import { FooterPromiseColumn } from './footer/FooterPromiseColumn';
import { buildFooterViewModel, isFooterSection } from './footer/footer-content';

type FooterProps = {
  initialContent?: Record<string, unknown>;
  initialViewport?: EditorViewport;
};

export default function Footer({ initialContent = {}, initialViewport = 'desktop' }: FooterProps) {
  const { content: footerContent } = useSectionPreviewContent({
    initialContent,
    initialViewport,
    matchesSection: isFooterSection,
  });

  const model = buildFooterViewModel(footerContent);
  const footerBorderColor = resolveColorToken(model.footerBorderColor, 'var(--color-border)');

  return (
    <footer
      className="border-t"
      style={{
        ...resolveBackgroundStyle(model.footerBgColor, 'var(--color-surface)'),
        borderColor: footerBorderColor,
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <FooterBrandColumn
            address={model.address}
            brandBadgeText={model.brandBadgeText}
            brandName={model.brandName}
            city={model.city}
            email={model.email}
            phone={model.phone}
            tagline={model.tagline}
          />
          <FooterLinksColumn links={model.quickLinks} title="Quick Links" />
          <FooterLinksColumn links={model.breedLinks} title="Popular Breeds" />
          <FooterPromiseColumn items={model.promiseItems} />
        </div>
      </div>

      <div className="border-t" style={{ borderColor: footerBorderColor }}>
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-xs text-[var(--text-tertiary)]">{model.copyrightText}</p>
          <p className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
            <Heart size={12} className="text-red-500" /> {model.madeWithText}
          </p>
        </div>
      </div>
    </footer>
  );
}
