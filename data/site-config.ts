import type { SiteConfig } from '@/types';

export const siteConfig: SiteConfig = {
  brandName: 'Dogs Paradice',
  tagline: 'Premium Dog Breeds · Healthy · KCI Registered',
  phone: '+91 9876543210',           // REPLACE before launch
  whatsappNumber: '919876543210',    // REPLACE (no spaces/+)
  email: 'hello@dogsparadice.com',   // REPLACE
  address: '45 MG Road, Near Garuda Mall', // REPLACE
  city: 'Bangalore',
  state: 'Karnataka',
  googleMapsUrl: 'https://maps.google.com/?q=Bangalore',  // REPLACE
  socialLinks: {
    instagram: null,
    facebook: null,
    youtube: null,
  },
  seo: {
    defaultTitle: 'Dogs Paradice — Premium Dog Breeds in Bangalore',
    titleTemplate: '%s | Dogs Paradice',
    defaultDescription:
      'Buy healthy, vaccinated, KCI-registered puppies in Bangalore. Golden Retriever, Labrador, Husky, German Shepherd and 20+ breeds available. Home-raised with champion bloodline.',
    keywords: [
      'dog breeder bangalore',
      'puppies for sale bangalore',
      'buy puppy bangalore',
      'KCI registered puppies bangalore',
      'golden retriever puppy bangalore',
      'labrador puppy bangalore',
      'husky puppy bangalore',
      'german shepherd puppy bangalore',
      'dog shop bangalore',
      'premium dog breeds india',
    ],
    ogImage: '/images/og/default.webp',
  },
};
