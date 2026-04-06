import type { Dispatch, SetStateAction } from 'react';
import type { Project } from '@/store/admin-data-store';

export const CATEGORIES = [
  'Sporting Group',
  'Working Group',
  'Toy Group',
  'Terrier Group',
  'Hound Group',
  'Non-Sporting Group',
  'Herding Group',
] as const;

export const SIZES = [
  { value: 'toy', label: 'Toy' },
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
  { value: 'giant', label: 'Giant' },
] as const;

export const ENERGY_LEVELS = [
  { value: 'low', label: 'Low' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'high', label: 'High' },
  { value: 'very_high', label: 'Very High' },
] as const;

export const COAT_LENGTHS = [
  { value: 'short', label: 'Short' },
  { value: 'medium', label: 'Medium' },
  { value: 'long', label: 'Long' },
  { value: 'double', label: 'Double' },
  { value: 'wire', label: 'Wire' },
] as const;

export const STATUSES = [
  { value: 'available', label: 'Available', color: 'green' },
  { value: 'reserved', label: 'Reserved', color: 'amber' },
  { value: 'coming_soon', label: 'Coming Soon', color: 'blue' },
  { value: 'sold', label: 'Sold', color: 'red' },
] as const;

export const CHARACTERISTIC_TOGGLES = [
  { key: 'good_with_kids', label: 'Good with Kids' },
  { key: 'good_with_pets', label: 'Good with Pets' },
  { key: 'apartment_friendly', label: 'Apartment Friendly' },
] as const;

export const HEALTH_TOGGLES = [
  { key: 'vaccinated', label: 'Vaccinated' },
  { key: 'dewormed', label: 'Dewormed' },
  { key: 'vet_checked', label: 'Vet Checked' },
  { key: 'microchipped', label: 'Microchipped' },
  { key: 'kci_registered', label: 'KCI Registered' },
  { key: 'parents_certified', label: 'Parents Certified' },
] as const;

export type DogFormState = Omit<Project, 'id' | 'created_at'>;
export type DogFormSetter = Dispatch<SetStateAction<DogFormState>>;
export type SizeValue = (typeof SIZES)[number]['value'];
export type EnergyValue = (typeof ENERGY_LEVELS)[number]['value'];
export type CoatValue = (typeof COAT_LENGTHS)[number]['value'];
export type StatusValue = (typeof STATUSES)[number]['value'];

export const emptyDogForm: DogFormState = {
  title: '',
  slug: '',
  description: '',
  long_description: '',
  category: 'Working Group',
  tags: [],
  cover_image: '',
  images: [],
  live_url: '',
  github_url: '',
  featured: false,
  sort_order: 0,
  price: null,
  status: 'available',
  gender: null,
  age: '',
  characteristics: {
    size: 'medium',
    energy_level: 'moderate',
    coat_length: 'medium',
    good_with_kids: true,
    good_with_pets: true,
    apartment_friendly: false,
    training_difficulty: 'moderate',
    grooming: 'moderate',
    lifespan: '',
    weight: '',
    height: '',
  },
  health_info: {
    vaccinated: true,
    dewormed: true,
    vet_checked: true,
    microchipped: false,
    kci_registered: false,
    parents_certified: false,
  },
};
