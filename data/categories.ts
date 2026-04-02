import type { BreedCategory } from '@/types';

export const categories: BreedCategory[] = [
  {
    id: 'cat-1',
    slug: 'all',
    name: 'All Breeds',
    iconPath: '/images/breeds/all.svg',
    description: 'Browse all available puppies',
    count: 0,
  },
  {
    id: 'cat-2',
    slug: 'large-breeds',
    name: 'Large Breeds',
    iconPath: '/images/breeds/large.svg',
    description: 'German Shepherd, Labrador, Golden Retriever',
    count: 0,
  },
  {
    id: 'cat-3',
    slug: 'small-breeds',
    name: 'Small Breeds',
    iconPath: '/images/breeds/small.svg',
    description: 'Shih Tzu, Beagle, Cocker Spaniel',
    count: 0,
  },
  {
    id: 'cat-4',
    slug: 'guard-dogs',
    name: 'Guard Dogs',
    iconPath: '/images/breeds/guard.svg',
    description: 'Rottweiler, Doberman, German Shepherd',
    count: 0,
  },
  {
    id: 'cat-5',
    slug: 'family-dogs',
    name: 'Family Dogs',
    iconPath: '/images/breeds/family.svg',
    description: 'Golden Retriever, Labrador, Beagle',
    count: 0,
  },
  {
    id: 'cat-6',
    slug: 'toy-breeds',
    name: 'Toy Breeds',
    iconPath: '/images/breeds/toy.svg',
    description: 'Pomeranian, Shih Tzu, French Bulldog',
    count: 0,
  },
];
