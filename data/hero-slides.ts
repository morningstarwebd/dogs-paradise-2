import type { HeroSlide } from '@/types';

export const heroSlides: HeroSlide[] = [
  {
    id: 'slide-1',
    imagePath: 'https://eysndjacdnenldnihalh.supabase.co/storage/v1/object/public/dogs-images/breeds/golden-retriever/golden-retriever-lg.webp',
    mobileImagePath: 'https://eysndjacdnenldnihalh.supabase.co/storage/v1/object/public/dogs-images/breeds/golden-retriever/golden-retriever-md.webp',
    heading: 'Find Your Perfect Companion',
    subheading:
      'Premium, KCI-registered puppies raised with love in Bangalore. Healthy, vaccinated, and ready for their forever homes.',
    ctaLabel: 'Browse Breeds →',
    ctaHref: '/breeds',
    eyebrow: 'Welcome to Dogs Paradise Bangalore',
  },
  {
    id: 'slide-2',
    imagePath: 'https://eysndjacdnenldnihalh.supabase.co/storage/v1/object/public/dogs-images/breeds/german-shepherd/german-shepherd-lg.webp',
    mobileImagePath: 'https://eysndjacdnenldnihalh.supabase.co/storage/v1/object/public/dogs-images/breeds/german-shepherd/german-shepherd-md.webp',
    heading: 'Champion Bloodlines, Healthy Puppies',
    subheading:
      'Every puppy is vet-certified, vaccinated, and comes with complete KCI documentation. Quality you can trust.',
    ctaLabel: 'View Available Puppies →',
    ctaHref: '/breeds?status=available',
    eyebrow: '100% Health Guaranteed',
  },
  {
    id: 'slide-3',
    imagePath: 'https://eysndjacdnenldnihalh.supabase.co/storage/v1/object/public/dogs-images/breeds/french-bulldog/french-bulldog-lg.webp',
    mobileImagePath: 'https://eysndjacdnenldnihalh.supabase.co/storage/v1/object/public/dogs-images/breeds/french-bulldog/french-bulldog-md.webp',
    heading: 'Home-Raised With Love',
    subheading:
      'Our puppies grow up in a warm family environment — not a kennel. Better socialization, happier puppies, stronger bonds.',
    ctaLabel: 'Our Story →',
    ctaHref: '/about',
    eyebrow: 'Trusted Since 2018',
  },
];

