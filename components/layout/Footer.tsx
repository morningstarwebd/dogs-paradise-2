"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Heart, Mail, MapPin, Phone } from 'lucide-react';
import { siteConfig } from '@/data/site-config';
import { EditorViewport, getViewportContent } from '@/lib/responsive-content';
import { resolveBackgroundStyle, resolveColorToken } from '@/lib/gradient-style';

type FooterSectionPayload = {
  section_id?: string;
  block_type?: string | null;
  content?: Record<string, unknown>;
};

type FooterProps = {
  initialContent?: Record<string, unknown>;
  initialViewport?: EditorViewport;
};

type FooterLink = {
  href: string;
  label: string;
};

const defaultQuickLinks: FooterLink[] = [
  { href: '/breeds', label: 'All Breeds' },
  { href: '/breeds?status=available', label: 'Available Puppies' },
  { href: '/happy-customers', label: 'Happy Customers' },
  { href: '/about', label: 'About Us' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

const defaultBreedLinks: FooterLink[] = [
  { href: '/breeds/golden-retriever', label: 'Golden Retriever' },
  { href: '/breeds/labrador-retriever', label: 'Labrador Retriever' },
  { href: '/breeds/german-shepherd', label: 'German Shepherd' },
  { href: '/breeds/siberian-husky', label: 'Siberian Husky' },
  { href: '/breeds/french-bulldog', label: 'French Bulldog' },
  { href: '/breeds/rottweiler', label: 'Rottweiler' },
];

const defaultPromiseItems = [
  'Select KCI Registration Options',
  'Age-Appropriate Vaccination',
  'Vet Health Checks',
  'Home-Raised Puppies',
  'Lifetime Breeder Support',
  'Clear Health Guidance',
];

function getStringValue(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

function getListLinks(
  content: Record<string, unknown>,
  prefix: 'quick_link' | 'breed_link',
  fallback: FooterLink[]
): FooterLink[] {
  const customLinks: FooterLink[] = [];

  for (let i = 1; i <= 6; i += 1) {
    const label = getStringValue(content[`${prefix}_${i}_label`], '');
    const href = getStringValue(content[`${prefix}_${i}_url`], '');
    if (label && href) {
      customLinks.push({ label, href });
    }
  }

  return customLinks.length > 0 ? customLinks : fallback;
}

function getPromiseItems(content: Record<string, unknown>): string[] {
  const customItems: string[] = [];

  for (let i = 1; i <= 6; i += 1) {
    const item = getStringValue(content[`promise_item_${i}`], '');
    if (item) {
      customItems.push(item);
    }
  }

  return customItems.length > 0 ? customItems : defaultPromiseItems;
}

function isEditorViewport(value: unknown): value is EditorViewport {
  return value === 'desktop' || value === 'mobile';
}

function resolveFooterContentByViewport(
  content: Record<string, unknown>,
  viewport: EditorViewport
): Record<string, unknown> {
  return getViewportContent(content, viewport);
}

export default function Footer({ initialContent = {}, initialViewport = 'desktop' }: FooterProps) {
  const [previewViewport, setPreviewViewport] = useState<EditorViewport>(initialViewport);
  const [footerRawContent, setFooterRawContent] = useState<Record<string, unknown>>(initialContent);
  const [footerContent, setFooterContent] = useState<Record<string, unknown>>(
    resolveFooterContentByViewport(initialContent, initialViewport)
  );

  useEffect(() => {
    setFooterRawContent(initialContent);
    setFooterContent(resolveFooterContentByViewport(initialContent, previewViewport));
  }, [initialContent, previewViewport]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === 'SET_PREVIEW_VIEWPORT' && isEditorViewport(event.data?.viewport)) {
        const nextViewport = event.data.viewport;
        setPreviewViewport(nextViewport);
        setFooterContent(resolveFooterContentByViewport(footerRawContent, nextViewport));
        return;
      }

      if (event.data?.type !== 'LIVE_PREVIEW_UPDATE') return;

      const nextViewport = isEditorViewport(event.data?.viewport)
        ? event.data.viewport
        : previewViewport;

      if (isEditorViewport(event.data?.viewport)) {
        setPreviewViewport(nextViewport);
      }

      const sections = event.data.sections as FooterSectionPayload[] | undefined;
      if (!Array.isArray(sections)) return;

      const footerSection = sections.find(
        (section) => section.section_id === 'footer' || section.block_type === 'footer'
      );

      if (footerSection?.content && typeof footerSection.content === 'object') {
        const nextRawContent = footerSection.content;
        setFooterRawContent(nextRawContent);
        setFooterContent(resolveFooterContentByViewport(nextRawContent, nextViewport));
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [footerRawContent, previewViewport]);

  const quickLinks = useMemo(
    () => getListLinks(footerContent, 'quick_link', defaultQuickLinks),
    [footerContent]
  );
  const breedLinks = useMemo(
    () => getListLinks(footerContent, 'breed_link', defaultBreedLinks),
    [footerContent]
  );
  const promiseItems = useMemo(() => getPromiseItems(footerContent), [footerContent]);

  const brandBadgeText = getStringValue(footerContent.footer_brand_badge_text, 'P');
  const brandName = getStringValue(footerContent.footer_brand_name, siteConfig.brandName);
  const tagline = getStringValue(
    footerContent.footer_tagline,
    `${siteConfig.tagline}. Health details are shared clearly for every puppy, with breeder support before and after pickup.`
  );
  const phone = getStringValue(footerContent.footer_phone, siteConfig.phone);
  const email = getStringValue(footerContent.footer_email, siteConfig.email);
  const address = getStringValue(footerContent.footer_address, siteConfig.address);
  const city = getStringValue(footerContent.footer_city, siteConfig.city);
  const footerBgColor = getStringValue(footerContent.footer_bg_color, 'var(--color-surface)');
  const footerBorderColor = resolveColorToken(
    getStringValue(footerContent.footer_border_color, 'var(--color-border)'),
    'var(--color-border)'
  );
  const copyrightText = getStringValue(
    footerContent.footer_copyright_text,
    `© ${new Date().getFullYear()} ${brandName}. All rights reserved.`
  );
  const madeWithText = getStringValue(footerContent.footer_made_with_text, `Made with love in ${city}`);

  return (
    <footer
      className="border-t"
      style={{
        ...resolveBackgroundStyle(footerBgColor, 'var(--color-surface)'),
        borderColor: footerBorderColor,
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full text-base font-bold text-white shadow-md"
                style={{
                  background:
                    'linear-gradient(135deg, var(--accent-primary), var(--accent-tertiary))',
                }}
              >
                {brandBadgeText}
              </span>
              <span className="font-display text-xl font-bold text-gradient">
                {brandName}
              </span>
            </Link>
            <p className="mb-6 text-sm leading-relaxed text-[var(--text-secondary)]">
              {tagline}
            </p>
            <div className="flex flex-col gap-3 text-sm text-[var(--text-secondary)]">
              <a
                href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                className="flex items-center gap-2 transition-colors hover:text-[var(--accent-primary)]"
              >
                <Phone size={14} />
                {phone}
              </a>
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 transition-colors hover:text-[var(--accent-primary)]"
              >
                <Mail size={14} />
                {email}
              </a>
              <span className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0" />
                {address}, {city}
              </span>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-[var(--text-primary)]">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-primary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-[var(--text-primary)]">
              Popular Breeds
            </h3>
            <ul className="flex flex-col gap-2.5">
              {breedLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-primary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-[var(--text-primary)]">
              Our Promise
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm text-[var(--text-secondary)]">
              {promiseItems.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--status-available)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t" style={{ borderColor: footerBorderColor }}>
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-xs text-[var(--text-tertiary)]">
            {copyrightText}
          </p>
          <p className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
            <Heart size={12} className="text-red-500" /> {madeWithText}
          </p>
        </div>
      </div>
    </footer>
  );
}
