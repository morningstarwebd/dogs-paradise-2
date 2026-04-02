import type { HeroSlide } from '@/types';

export const heroSlides: HeroSlide[] = [
  {
    id: 'slide-1',
    imagePath: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1920&q=80&auto=format&fit=crop',
    mobileImagePath: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=828&q=80&auto=format&fit=crop',
    heading: 'Find Your Perfect Companion',
    subheading:
      'Premium, KCI-registered puppies raised with love in Bangalore. Healthy, vaccinated, and ready for their forever homes.',
    ctaLabel: 'Browse Breeds →',
    ctaHref: '/breeds',
    eyebrow: 'Welcome to Dogs Paradice',
  },
  {
    id: 'slide-2',
    imagePath: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1920&q=80&auto=format&fit=crop',
    mobileImagePath: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=828&q=80&auto=format&fit=crop',
    heading: 'Champion Bloodlines, Healthy Puppies',
    subheading:
      'Every puppy is vet-certified, vaccinated, and comes with complete KCI documentation. Quality you can trust.',
    ctaLabel: 'View Available Puppies →',
    ctaHref: '/breeds?status=available',
    eyebrow: '100% Health Guaranteed',
  },
  {
    id: 'slide-3',
    imagePath: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1920&q=80&auto=format&fit=crop',
    mobileImagePath: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=828&q=80&auto=format&fit=crop',
    heading: 'Home-Raised With Love',
    subheading:
      'Our puppies grow up in a warm family environment — not a kennel. Better socialization, happier puppies, stronger bonds.',
    ctaLabel: 'Our Story →',
    ctaHref: '/about',
    eyebrow: 'Trusted Since 2018',
  },
];
