import { siteConfig } from '@/data/site-config';
import type { LiveSectionPayload } from '@/components/layout/shared/use-section-preview-content';

export type FooterLink = {
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

export type FooterViewModel = {
  address: string;
  brandBadgeText: string;
  brandName: string;
  breedLinks: FooterLink[];
  city: string;
  copyrightText: string;
  email: string;
  footerBgColor: string;
  footerBorderColor: string;
  madeWithText: string;
  phone: string;
  promiseItems: string[];
  quickLinks: FooterLink[];
  tagline: string;
};

export function isFooterSection(section: LiveSectionPayload): boolean {
  return section.section_id === 'footer' || section.block_type === 'footer';
}

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
  const customLinks = Array.from({ length: 6 }, (_, index) => index + 1)
    .map((itemIndex) => {
      const label = getStringValue(content[`${prefix}_${itemIndex}_label`], '');
      const href = getStringValue(content[`${prefix}_${itemIndex}_url`], '');
      return label && href ? { label, href } : null;
    })
    .filter((item): item is FooterLink => item !== null);

  return customLinks.length > 0 ? customLinks : fallback;
}

function getPromiseItems(content: Record<string, unknown>): string[] {
  const customItems = Array.from({ length: 6 }, (_, index) => index + 1)
    .map((itemIndex) => getStringValue(content[`promise_item_${itemIndex}`], ''))
    .filter(Boolean);

  return customItems.length > 0 ? customItems : defaultPromiseItems;
}

export function buildFooterViewModel(footerContent: Record<string, unknown>): FooterViewModel {
  const brandName = getStringValue(footerContent.footer_brand_name, siteConfig.brandName);
  const city = getStringValue(footerContent.footer_city, siteConfig.city);

  return {
    address: getStringValue(footerContent.footer_address, siteConfig.address),
    brandBadgeText: getStringValue(footerContent.footer_brand_badge_text, 'P'),
    brandName,
    breedLinks: getListLinks(footerContent, 'breed_link', defaultBreedLinks),
    city,
    copyrightText: getStringValue(
      footerContent.footer_copyright_text,
      `© ${new Date().getFullYear()} ${brandName}. All rights reserved.`
    ),
    email: getStringValue(footerContent.footer_email, siteConfig.email),
    footerBgColor: getStringValue(footerContent.footer_bg_color, 'var(--color-surface)'),
    footerBorderColor: getStringValue(footerContent.footer_border_color, 'var(--color-border)'),
    madeWithText: getStringValue(footerContent.footer_made_with_text, `Made with love in ${city}`),
    phone: getStringValue(footerContent.footer_phone, siteConfig.phone),
    promiseItems: getPromiseItems(footerContent),
    quickLinks: getListLinks(footerContent, 'quick_link', defaultQuickLinks),
    tagline: getStringValue(
      footerContent.footer_tagline,
      `${siteConfig.tagline}. Health details are shared clearly for every puppy, with breeder support before and after pickup.`
    ),
  };
}
