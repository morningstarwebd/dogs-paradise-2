import type { SiteConfig } from '@/types';

export const siteConfig: SiteConfig = {
  brandName: 'Dogs Paradise Bangalore',
  tagline: 'Premium Dog Breeds · Healthy · KCI Registered',
  phone: '+91 90663 80952',
  whatsappNumber: '919066380952',
  email: 'hello@dogsparadisebangalore.com',
  address: 'Narayanappa Block, Anjenappa Block, Benson Town',
  city: 'Bengaluru',
  state: 'Karnataka',
  googleMapsUrl: 'https://maps.google.com/?q=Narayanappa+Block,+Anjenappa+Block,+Benson+Town,+Bengaluru',
  socialLinks: {
    instagram: null,
    facebook: null,
    youtube: null,
  },
  seo: {
    defaultTitle: 'Dogs Paradise Bangalore — Premium KCI Registered Puppies',
    titleTemplate: '%s | Dogs Paradise Bangalore',
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
