// ─── Dog / Breed ────────────────────────────────────────────────────────────

export type DogStatus = 'available' | 'sold' | 'coming_soon' | 'reserved';
export type DogSize = 'toy' | 'small' | 'medium' | 'large' | 'giant';
export type CoatLength = 'short' | 'medium' | 'long' | 'double' | 'wire';
export type EnergyLevel = 'low' | 'moderate' | 'high' | 'very_high';

export interface BreedFAQ {
  question: string;
  answer: string;
}

export interface DogVariant {
  id: string;
  sizeName: string; // 'Small', 'Medium', 'Large'
  price: number | null;
  age: string;
}

export interface Dog {
  id: string;
  slug: string;
  breedName: string;
  name: string | null;
  categorySlug: string;
  status: DogStatus;
  price: number | null; // Keep base footprint, but variations are used primarily
  age: string;
  gender: 'male' | 'female';
  images: string[];
  thumbnailImage: string;
  description: string;
  longDescription: string;
  characteristics: DogCharacteristics;
  healthInfo: HealthInfo;
  faqs: BreedFAQ[];
  tags: string[];
  featured: boolean;
  createdAt: string;
  variants: DogVariant[];
}

export interface DogCharacteristics {
  size: DogSize;
  coatLength: CoatLength;
  energyLevel: EnergyLevel;
  goodWithKids: boolean;
  goodWithPets: boolean;
  apartmentFriendly: boolean;
  trainingDifficulty: 'easy' | 'moderate' | 'hard';
  grooming: 'low' | 'moderate' | 'high';
  lifespan: string;
  weight: string;
  height: string;
}

export interface HealthInfo {
  vaccinated: boolean;
  dewormed: boolean;
  vetChecked: boolean;
  microchipped: boolean;
  kciRegistered: boolean;
  parentsCertified: boolean;
}

// ─── Category ────────────────────────────────────────────────────────────────

export interface BreedCategory {
  id: string;
  slug: string;
  name: string;
  iconPath: string;
  description: string;
  count: number;
}

// ─── Hero Slide ──────────────────────────────────────────────────────────────

export interface HeroSlide {
  id: string;
  imagePath: string;
  mobileImagePath: string;
  heading: string;
  subheading: string;
  ctaLabel: string;
  ctaHref: string;
  eyebrow: string;
  accentColor?: string;
}

// ─── Testimonial ─────────────────────────────────────────────────────────────

export interface Testimonial {
  id: string;
  authorName: string;
  location: string;
  rating: number;
  breedPurchased: string;
  text: string;
  avatarPath: string | null;
  date: string;
}

// ─── Blog ────────────────────────────────────────────────────────────────────

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImagePath: string;
  category: string;
  readingTime: string;
  publishedAt: string;
  author: string;
  seoTitle: string;
  seoDescription: string;
}

// ─── Site Config ─────────────────────────────────────────────────────────────

export interface SiteConfig {
  brandName: string;
  tagline: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  city: string;
  state: string;
  googleMapsUrl: string;
  socialLinks: {
    instagram: string | null;
    facebook: string | null;
    youtube: string | null;
  };
  seo: {
    defaultTitle: string;
    titleTemplate: string;
    defaultDescription: string;
    keywords: string[];
    ogImage: string;
  };
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  dogId: string;
  breedName: string;
  name: string | null;
  price: number | null;
  thumbnailImage: string;
  slug: string;
}

export interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (dogId: string) => void;
  clearCart: () => void;
  itemCount: number;
}
