import type { SiteConfig } from '@/types';

export const siteConfig: SiteConfig = {
  brandName: 'Dogs Paradice',
  tagline: 'Premium Dog Breeds · Healthy · KCI Registered',
  phone: '+91 9876543210',           // REPLACE before launch
  whatsappNumber: '919876543210',    // REPLACE (no spaces/+)
  email: 'hello@dogsparadice.com',   // REPLACE
  address: '123 Park Street, Near South City Mall', // REPLACE
  city: 'Kolkata',
  state: 'West Bengal',
  googleMapsUrl: 'https://maps.google.com/?q=Kolkata',  // REPLACE
  socialLinks: {
    instagram: null,
    facebook: null,
    youtube: null,
  },
  seo: {
    defaultTitle: 'Dogs Paradice — Premium Dog Breeds in Kolkata',
    titleTemplate: '%s | Dogs Paradice',
    defaultDescription:
      'Buy healthy, vaccinated, KCI-registered puppies in Kolkata. Golden Retriever, Labrador, Husky, German Shepherd and 20+ breeds available. Home-raised with champion bloodline.',
    keywords: [
      'dog breeder kolkata',
      'puppies for sale kolkata',
      'buy puppy kolkata',
      'KCI registered puppies kolkata',
      'golden retriever puppy kolkata',
      'labrador puppy kolkata',
      'husky puppy kolkata',
      'german shepherd puppy kolkata',
      'dog shop kolkata',
      'premium dog breeds india',
    ],
    ogImage: '/images/og/default.webp',
  },
};
