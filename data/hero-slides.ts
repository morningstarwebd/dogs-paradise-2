import type { HeroSlide } from '@/types';
import { STORAGE_ONLY_IMAGE_PLACEHOLDER } from '@/lib/storage-only-images';

export const heroSlides: HeroSlide[] = [
  {
    id: 'slide-1',
    imagePath: STORAGE_ONLY_IMAGE_PLACEHOLDER,
    mobileImagePath: STORAGE_ONLY_IMAGE_PLACEHOLDER,
    heading: 'Find Your Perfect Companion',
    subheading:
      'Healthy, home-raised puppies in Bangalore — 2000+ happy families and 12 years of trusted experience.',
    ctaLabel: 'Browse Breeds',
    ctaHref: '/breeds',
    eyebrow: 'Welcome to Dogs Paradise Bangalore',
  },
  {
    id: 'slide-2',
    imagePath: STORAGE_ONLY_IMAGE_PLACEHOLDER,
    mobileImagePath: STORAGE_ONLY_IMAGE_PLACEHOLDER,
    heading: 'Quality Breeds, Honest Details',
    subheading:
      'Every puppy comes with clear health notes, age-appropriate vaccinations, and genuine breeder guidance.',
    ctaLabel: 'View Available Puppies',
    ctaHref: '/breeds',
    eyebrow: 'Transparent Puppy Matching',
  },
  {
    id: 'slide-3',
    imagePath: STORAGE_ONLY_IMAGE_PLACEHOLDER,
    mobileImagePath: STORAGE_ONLY_IMAGE_PLACEHOLDER,
    heading: 'Home-Raised With Love',
    subheading:
      'Our puppies grow up in a caring family environment. Better socialization, smooth transitions, happier homes.',
    ctaLabel: 'Our Story',
    ctaHref: '/about',
    eyebrow: 'Trusted Since 2017 — 1500+ Puppies Delivered',
  },
];
