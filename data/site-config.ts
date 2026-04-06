import type { SiteConfig } from '@/types';
import { STORAGE_ONLY_IMAGE_PLACEHOLDER } from '@/lib/storage-only-images';

export const siteConfig: SiteConfig = {
  brandName: 'Dogs Paradise Bangalore',
  tagline: 'Quality Puppies | Honest Guidance | Bangalore',
  phone: '+91 90606 02037',
  whatsappNumber: '919060602037',
  email: 'hello@dogsparadisebangalore.com',
  address: '23, 5th Cross, Narayanappa Block, Anjenappa Block, Benson Town',
  city: 'Bengaluru',
  state: 'Karnataka',
  googleMapsUrl:
    'https://maps.google.com/?q=23,+5th+Cross,+Narayanappa+Block,+Anjenappa+Block,+Benson+Town,+Bengaluru+560046',
  registrationNote:
    'KCI registration is available for select puppies and litters. Please confirm the paperwork for the exact puppy before booking.',
  businessHours: [
    {
      days: 'Monday - Saturday',
      hours: '10 AM - 7 PM',
    },
    {
      days: 'Sunday',
      hours: 'By Appointment',
    },
  ],
  socialLinks: {
    instagram: 'https://www.instagram.com/bangalore_dogs_paradise',
    facebook: null,
    youtube: 'https://youtube.com/@dogsparadisebangalore',
  },
  seo: {
    defaultTitle: 'Dogs Paradise Bangalore | Quality Puppies in Bangalore',
    titleTemplate: '%s | Dogs Paradise Bangalore',
    defaultDescription:
      'Explore healthy, vaccinated, home-raised puppies in Bangalore with transparent health details, honest breeder guidance, and select KCI registration options. 2000+ happy families served.',
    keywords: [
      'dog breeder bangalore',
      'puppies for sale bangalore',
      'buy puppy bangalore',
      'healthy puppies bangalore',
      'dog breeders bengaluru',
      'golden retriever puppy bangalore',
      'labrador puppy bangalore',
      'husky puppy bangalore',
      'german shepherd puppy bangalore',
      'toy poodle puppy bangalore',
      'maltipoo puppy bangalore',
      'shih tzu puppy bangalore',
      'bichon frise puppy bangalore',
      'pet puppies bangalore',
      'premium dog breeds india',
      'dogs paradise bangalore',
    ],
    ogImage: STORAGE_ONLY_IMAGE_PLACEHOLDER,
  },
};
