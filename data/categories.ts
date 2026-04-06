import type { BreedCategory } from '@/types';
import { STORAGE_ONLY_IMAGE_PLACEHOLDER } from '@/lib/storage-only-images';

export const categories: BreedCategory[] = [
  {
    id: 'cat-1',
    slug: 'all',
    name: 'All Breeds',
    iconPath: STORAGE_ONLY_IMAGE_PLACEHOLDER,
    description: 'Browse all available puppies',
    count: 0,
  },
  {
    id: 'cat-2',
    slug: 'large-breeds',
    name: 'Large Breeds',
    iconPath: STORAGE_ONLY_IMAGE_PLACEHOLDER,
    description: 'German Shepherd, Labrador, Golden Retriever',
    count: 0,
  },
  {
    id: 'cat-3',
    slug: 'small-breeds',
    name: 'Small Breeds',
    iconPath: STORAGE_ONLY_IMAGE_PLACEHOLDER,
    description: 'Shih Tzu, Beagle, Cocker Spaniel',
    count: 0,
  },
  {
    id: 'cat-4',
    slug: 'guard-dogs',
    name: 'Guard Dogs',
    iconPath: STORAGE_ONLY_IMAGE_PLACEHOLDER,
    description: 'Rottweiler, Doberman, German Shepherd',
    count: 0,
  },
  {
    id: 'cat-5',
    slug: 'family-dogs',
    name: 'Family Dogs',
    iconPath: STORAGE_ONLY_IMAGE_PLACEHOLDER,
    description: 'Golden Retriever, Labrador, Beagle',
    count: 0,
  },
  {
    id: 'cat-6',
    slug: 'toy-breeds',
    name: 'Toy Breeds',
    iconPath: STORAGE_ONLY_IMAGE_PLACEHOLDER,
    description: 'Pomeranian, Shih Tzu, French Bulldog',
    count: 0,
  },
];
