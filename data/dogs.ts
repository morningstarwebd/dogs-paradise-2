import type { BreedFAQ, Dog, DogCharacteristics, HealthInfo } from '@/types';
import breedImageMap from './supabase-breed-images.json';

interface BreedSeed {
  breedName: string;
  categorySlug: string;
  status: Dog['status'];
  gender: Dog['gender'];
  age: string;
  featured: boolean;
  summary: string;
  characteristics: DogCharacteristics;
  tags: string[];
}

const defaultHealthInfo: HealthInfo = {
  vaccinated: true,
  dewormed: true,
  vetChecked: true,
  microchipped: false,
  kciRegistered: true,
  parentsCertified: true,
};

interface BreedImageSet {
  sourceFile: string;
  images: string[];
  thumbnailImage: string;
  usedFallback: boolean;
}

const breedImagesByName = breedImageMap as Record<string, BreedImageSet>;
const fallbackBreedImages = breedImagesByName['Golden Retriever']?.images ?? [];
const fallbackThumbnailImage = fallbackBreedImages[0] ?? '';

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function getBreedImages(breedName: string): { images: string[]; thumbnailImage: string } {
  const mappedImages = breedImagesByName[breedName];

  if (!mappedImages || mappedImages.images.length === 0) {
    return {
      images: fallbackBreedImages,
      thumbnailImage: fallbackThumbnailImage,
    };
  }

  return {
    images: mappedImages.images,
    thumbnailImage: mappedImages.thumbnailImage || mappedImages.images[0],
  };
}

function getClimateAnswer(breedName: string): string {
  if (breedName === 'Siberian Husky' || breedName === 'St. Bernard') {
    return `Yes, but ${breedName} needs cool indoor conditions, hydration, and regular grooming during Bengaluru summers.`;
  }

  return `Yes, ${breedName} adapts well to Bengaluru weather with proper hydration, nutrition, and routine grooming.`;
}

function getApartmentAnswer(breedName: string, apartmentFriendly: boolean): string {
  if (apartmentFriendly) {
    return `Yes, ${breedName} can do well in apartments when given daily walks and mental stimulation.`;
  }

  return `${breedName} is better suited to homes with more space, but can adapt in large apartments with structured exercise.`;
}

function buildFaqs(breedName: string, apartmentFriendly: boolean): BreedFAQ[] {
  return [
    {
      question: `What is the price of ${breedName} puppy in Bangalore?`,
      answer:
        'Contact Dogs Paradise Bangalore at +91 90663 80952 for current pricing and availability.',
    },
    {
      question: `Where to buy ${breedName} puppy in Bangalore?`,
      answer:
        'Dogs Paradise Bangalore, Benson Town, Bengaluru. WhatsApp: +91 90663 80952.',
    },
    {
      question: `Is ${breedName} good for Bangalore climate?`,
      answer: getClimateAnswer(breedName),
    },
    {
      question: `Is ${breedName} apartment-friendly in Bangalore?`,
      answer: getApartmentAnswer(breedName, apartmentFriendly),
    },
  ];
}

const breedSeeds: BreedSeed[] = [
  {
    breedName: 'Golden Retriever',
    categorySlug: 'family-dogs',
    status: 'available',
    gender: 'male',
    age: '8 weeks',
    featured: true,
    summary: 'Friendly and gentle family companion from KCI lines, raised with children and regular socialization.',
    characteristics: {
      size: 'large',
      coatLength: 'long',
      energyLevel: 'high',
      goodWithKids: true,
      goodWithPets: true,
      apartmentFriendly: false,
      trainingDifficulty: 'easy',
      grooming: 'high',
      lifespan: '10-12 years',
      weight: '25-34 kg',
      height: '55-61 cm',
    },
    tags: ['KCI Registered', 'Family Friendly', 'Vaccinated'],
  },
  {
    breedName: 'Labrador Retriever',
    categorySlug: 'family-dogs',
    status: 'available',
    gender: 'female',
    age: '9 weeks',
    featured: true,
    summary: 'Outgoing and easy-to-train Labrador puppies with strong health records and balanced temperament.',
    characteristics: {
      size: 'large',
      coatLength: 'short',
      energyLevel: 'high',
      goodWithKids: true,
      goodWithPets: true,
      apartmentFriendly: false,
      trainingDifficulty: 'easy',
      grooming: 'moderate',
      lifespan: '10-13 years',
      weight: '25-36 kg',
      height: '54-62 cm',
    },
    tags: ['KCI Registered', 'Home Raised', 'Dewormed'],
  },
  {
    breedName: 'German Shepherd',
    categorySlug: 'guard-dogs',
    status: 'available',
    gender: 'male',
    age: '10 weeks',
    featured: true,
    summary: 'Intelligent working-line shepherd puppies with confident temperament and strong trainability.',
    characteristics: {
      size: 'large',
      coatLength: 'medium',
      energyLevel: 'very_high',
      goodWithKids: true,
      goodWithPets: true,
      apartmentFriendly: false,
      trainingDifficulty: 'moderate',
      grooming: 'moderate',
      lifespan: '9-13 years',
      weight: '30-40 kg',
      height: '55-65 cm',
    },
    tags: ['KCI Registered', 'Guard Dog', 'Champion Lineage'],
  },
  {
    breedName: 'Siberian Husky',
    categorySlug: 'large-breeds',
    status: 'available',
    gender: 'female',
    age: '9 weeks',
    featured: true,
    summary: 'Energetic and affectionate Husky puppies suited for active families with cool indoor spaces.',
    characteristics: {
      size: 'large',
      coatLength: 'double',
      energyLevel: 'very_high',
      goodWithKids: true,
      goodWithPets: true,
      apartmentFriendly: false,
      trainingDifficulty: 'hard',
      grooming: 'high',
      lifespan: '12-15 years',
      weight: '16-27 kg',
      height: '50-60 cm',
    },
    tags: ['KCI Registered', 'Double Coat', 'Active Breed'],
  },
  {
    breedName: 'Rottweiler',
    categorySlug: 'guard-dogs',
    status: 'available',
    gender: 'male',
    age: '11 weeks',
    featured: true,
    summary: 'Confident and loyal Rottweiler puppies from carefully selected parents with stable temperament.',
    characteristics: {
      size: 'large',
      coatLength: 'short',
      energyLevel: 'moderate',
      goodWithKids: true,
      goodWithPets: false,
      apartmentFriendly: false,
      trainingDifficulty: 'moderate',
      grooming: 'low',
      lifespan: '8-10 years',
      weight: '42-60 kg',
      height: '56-69 cm',
    },
    tags: ['KCI Registered', 'Protective', 'Vet Checked'],
  },
  {
    breedName: 'Beagle',
    categorySlug: 'small-breeds',
    status: 'available',
    gender: 'male',
    age: '8 weeks',
    featured: true,
    summary: 'Cheerful Beagle puppies with compact size and playful nature for family homes and apartments.',
    characteristics: {
      size: 'small',
      coatLength: 'short',
      energyLevel: 'high',
      goodWithKids: true,
      goodWithPets: true,
      apartmentFriendly: true,
      trainingDifficulty: 'moderate',
      grooming: 'low',
      lifespan: '12-15 years',
      weight: '9-11 kg',
      height: '33-41 cm',
    },
    tags: ['KCI Registered', 'Apartment Friendly', 'Family Dog'],
  },
  {
    breedName: 'Shih Tzu',
    categorySlug: 'toy-breeds',
    status: 'available',
    gender: 'female',
    age: '8 weeks',
    featured: false,
    summary: 'Affectionate Shih Tzu puppies with gentle temperament and strong companionship traits.',
    characteristics: {
      size: 'toy',
      coatLength: 'long',
      energyLevel: 'low',
      goodWithKids: true,
      goodWithPets: true,
      apartmentFriendly: true,
      trainingDifficulty: 'moderate',
      grooming: 'high',
      lifespan: '10-16 years',
      weight: '4-7 kg',
      height: '20-28 cm',
    },
    tags: ['KCI Registered', 'Toy Breed', 'Home Raised'],
  },
  {
    breedName: 'Pomeranian',
    categorySlug: 'toy-breeds',
    status: 'available',
    gender: 'male',
    age: '10 weeks',
    featured: false,
    summary: 'Fluffy and confident Pomeranian puppies ideal for compact homes and active indoor bonding.',
    characteristics: {
      size: 'toy',
      coatLength: 'long',
      energyLevel: 'moderate',
      goodWithKids: false,
      goodWithPets: true,
      apartmentFriendly: true,
      trainingDifficulty: 'moderate',
      grooming: 'high',
      lifespan: '12-16 years',
      weight: '1.5-3 kg',
      height: '18-24 cm',
    },
    tags: ['KCI Registered', 'Toy Breed', 'Vaccinated'],
  },
  {
    breedName: 'Doberman Pinscher',
    categorySlug: 'guard-dogs',
    status: 'reserved',
    gender: 'male',
    age: '10 weeks',
    featured: false,
    summary: 'Athletic Doberman puppies known for intelligence, loyalty, and quick response training ability.',
    characteristics: {
      size: 'large',
      coatLength: 'short',
      energyLevel: 'very_high',
      goodWithKids: true,
      goodWithPets: false,
      apartmentFriendly: false,
      trainingDifficulty: 'moderate',
      grooming: 'low',
      lifespan: '10-13 years',
      weight: '32-45 kg',
      height: '61-72 cm',
    },
    tags: ['KCI Registered', 'Guard Dog', 'Reserved'],
  },
  {
    breedName: 'French Bulldog',
    categorySlug: 'toy-breeds',
    status: 'available',
    gender: 'female',
    age: '9 weeks',
    featured: true,
    summary: 'Compact French Bulldog puppies with playful personality and excellent adaptation to city life.',
    characteristics: {
      size: 'small',
      coatLength: 'short',
      energyLevel: 'low',
      goodWithKids: true,
      goodWithPets: true,
      apartmentFriendly: true,
      trainingDifficulty: 'easy',
      grooming: 'low',
      lifespan: '10-12 years',
      weight: '8-14 kg',
      height: '28-33 cm',
    },
    tags: ['KCI Registered', 'Companion Breed', 'City Friendly'],
  },
  {
    breedName: 'Cocker Spaniel',
    categorySlug: 'small-breeds',
    status: 'coming_soon',
    gender: 'female',
    age: '7 weeks',
    featured: false,
    summary: 'Sweet-natured Cocker Spaniel puppies with beautiful coats and strong family compatibility.',
    characteristics: {
      size: 'small',
      coatLength: 'long',
      energyLevel: 'moderate',
      goodWithKids: true,
      goodWithPets: true,
      apartmentFriendly: true,
      trainingDifficulty: 'easy',
      grooming: 'high',
      lifespan: '12-15 years',
      weight: '12-16 kg',
      height: '36-43 cm',
    },
    tags: ['KCI Registered', 'Coming Soon', 'Family Friendly'],
  },
  {
    breedName: 'Great Dane',
    categorySlug: 'large-breeds',
    status: 'sold',
    gender: 'male',
    age: '12 weeks',
    featured: false,
    summary: 'Gentle giant Great Dane puppies from healthy bloodlines with calm and affectionate disposition.',
    characteristics: {
      size: 'giant',
      coatLength: 'short',
      energyLevel: 'moderate',
      goodWithKids: true,
      goodWithPets: true,
      apartmentFriendly: false,
      trainingDifficulty: 'moderate',
      grooming: 'low',
      lifespan: '7-10 years',
      weight: '50-90 kg',
      height: '71-86 cm',
    },
    tags: ['KCI Registered', 'Giant Breed', 'Sold'],
  },
  {
    breedName: 'Poodle',
    categorySlug: 'small-breeds',
    status: 'available',
    gender: 'female',
    age: '9 weeks',
    featured: true,
    summary: 'Highly intelligent Poodle puppies with low shedding coats and excellent trainability.',
    characteristics: {
      size: 'small',
      coatLength: 'long',
      energyLevel: 'high',
      goodWithKids: true,
      goodWithPets: true,
      apartmentFriendly: true,
      trainingDifficulty: 'easy',
      grooming: 'high',
      lifespan: '12-15 years',
      weight: '20-32 kg',
      height: '38-60 cm',
    },
    tags: ['KCI Registered', 'Smart Breed', 'Low Shedding'],
  },
  {
    breedName: 'Maltipoo',
    categorySlug: 'small-breeds',
    status: 'available',
    gender: 'male',
    age: '8 weeks',
    featured: false,
    summary: 'Friendly Maltipoo puppies with playful energy and adaptable temperament for apartment families.',
    characteristics: {
      size: 'small',
      coatLength: 'long',
      energyLevel: 'moderate',
      goodWithKids: true,
      goodWithPets: true,
      apartmentFriendly: true,
      trainingDifficulty: 'easy',
      grooming: 'high',
      lifespan: '12-15 years',
      weight: '3-9 kg',
      height: '20-35 cm',
    },
    tags: ['Small Breed', 'Family Friendly', 'Vaccinated'],
  },
  {
    breedName: 'Bichon Frise',
    categorySlug: 'small-breeds',
    status: 'available',
    gender: 'female',
    age: '8 weeks',
    featured: false,
    summary: 'Bichon Frise puppies with cheerful personality, compact size, and affectionate behavior.',
    characteristics: {
      size: 'small',
      coatLength: 'long',
      energyLevel: 'moderate',
      goodWithKids: true,
      goodWithPets: true,
      apartmentFriendly: true,
      trainingDifficulty: 'easy',
      grooming: 'high',
      lifespan: '12-15 years',
      weight: '5-8 kg',
      height: '23-30 cm',
    },
    tags: ['Small Breed', 'Companion Dog', 'Home Raised'],
  },
  {
    breedName: 'Welsh Corgi',
    categorySlug: 'family-dogs',
    status: 'available',
    gender: 'male',
    age: '10 weeks',
    featured: false,
    summary: 'Active and affectionate Welsh Corgi puppies with confident personality and family-friendly traits.',
    characteristics: {
      size: 'small',
      coatLength: 'medium',
      energyLevel: 'high',
      goodWithKids: true,
      goodWithPets: true,
      apartmentFriendly: true,
      trainingDifficulty: 'moderate',
      grooming: 'moderate',
      lifespan: '12-15 years',
      weight: '10-14 kg',
      height: '25-30 cm',
    },
    tags: ['Family Dog', 'KCI Registered', 'Vaccinated'],
  },
  {
    breedName: 'Cavapoo',
    categorySlug: 'small-breeds',
    status: 'available',
    gender: 'female',
    age: '8 weeks',
    featured: false,
    summary: 'Cavapoo puppies with gentle nature and social behavior, suitable for first-time pet parents.',
    characteristics: {
      size: 'small',
      coatLength: 'long',
      energyLevel: 'moderate',
      goodWithKids: true,
      goodWithPets: true,
      apartmentFriendly: true,
      trainingDifficulty: 'easy',
      grooming: 'high',
      lifespan: '12-15 years',
      weight: '5-12 kg',
      height: '23-35 cm',
    },
    tags: ['Small Breed', 'First-Time Friendly', 'Vaccinated'],
  },
  {
    breedName: 'Pug',
    categorySlug: 'toy-breeds',
    status: 'available',
    gender: 'male',
    age: '9 weeks',
    featured: false,
    summary: 'Charming Pug puppies that thrive on companionship and fit well into city apartment lifestyles.',
    characteristics: {
      size: 'toy',
      coatLength: 'short',
      energyLevel: 'low',
      goodWithKids: true,
      goodWithPets: true,
      apartmentFriendly: true,
      trainingDifficulty: 'moderate',
      grooming: 'low',
      lifespan: '12-15 years',
      weight: '6-8 kg',
      height: '25-33 cm',
    },
    tags: ['Toy Breed', 'Apartment Friendly', 'Companion Dog'],
  },
  {
    breedName: 'Chow Chow',
    categorySlug: 'large-breeds',
    status: 'coming_soon',
    gender: 'female',
    age: '7 weeks',
    featured: false,
    summary: 'Calm and dignified Chow Chow puppies with thick coats and independent yet loyal temperament.',
    characteristics: {
      size: 'large',
      coatLength: 'double',
      energyLevel: 'moderate',
      goodWithKids: true,
      goodWithPets: false,
      apartmentFriendly: false,
      trainingDifficulty: 'hard',
      grooming: 'high',
      lifespan: '9-12 years',
      weight: '20-32 kg',
      height: '43-56 cm',
    },
    tags: ['Large Breed', 'Double Coat', 'Coming Soon'],
  },
  {
    breedName: 'St. Bernard',
    categorySlug: 'large-breeds',
    status: 'available',
    gender: 'male',
    age: '10 weeks',
    featured: false,
    summary: 'St. Bernard puppies with gentle giant temperament and strong family bonding behavior.',
    characteristics: {
      size: 'giant',
      coatLength: 'medium',
      energyLevel: 'low',
      goodWithKids: true,
      goodWithPets: true,
      apartmentFriendly: false,
      trainingDifficulty: 'moderate',
      grooming: 'high',
      lifespan: '8-10 years',
      weight: '54-82 kg',
      height: '65-90 cm',
    },
    tags: ['Giant Breed', 'Family Dog', 'Vaccinated'],
  },
  {
    breedName: 'Cavalier King Charles Spaniel',
    categorySlug: 'small-breeds',
    status: 'available',
    gender: 'female',
    age: '8 weeks',
    featured: false,
    summary: 'Elegant and affectionate spaniel puppies that are gentle with children and easy to integrate at home.',
    characteristics: {
      size: 'small',
      coatLength: 'long',
      energyLevel: 'moderate',
      goodWithKids: true,
      goodWithPets: true,
      apartmentFriendly: true,
      trainingDifficulty: 'easy',
      grooming: 'moderate',
      lifespan: '12-15 years',
      weight: '5-8 kg',
      height: '30-33 cm',
    },
    tags: ['Small Breed', 'Family Friendly', 'KCI Registered'],
  },
  {
    breedName: 'Cane Corso',
    categorySlug: 'guard-dogs',
    status: 'available',
    gender: 'male',
    age: '11 weeks',
    featured: false,
    summary: 'Powerful Cane Corso puppies with protective instincts and stable temperament when trained early.',
    characteristics: {
      size: 'large',
      coatLength: 'short',
      energyLevel: 'high',
      goodWithKids: true,
      goodWithPets: false,
      apartmentFriendly: false,
      trainingDifficulty: 'hard',
      grooming: 'low',
      lifespan: '9-12 years',
      weight: '40-50 kg',
      height: '58-70 cm',
    },
    tags: ['Guard Dog', 'Large Breed', 'KCI Registered'],
  },
  {
    breedName: 'Maltese',
    categorySlug: 'toy-breeds',
    status: 'available',
    gender: 'female',
    age: '8 weeks',
    featured: false,
    summary: 'Elegant Maltese puppies with gentle behavior, compact size, and affectionate indoor temperament.',
    characteristics: {
      size: 'toy',
      coatLength: 'long',
      energyLevel: 'low',
      goodWithKids: true,
      goodWithPets: true,
      apartmentFriendly: true,
      trainingDifficulty: 'easy',
      grooming: 'high',
      lifespan: '12-15 years',
      weight: '3-4 kg',
      height: '20-25 cm',
    },
    tags: ['Toy Breed', 'Companion Dog', 'Home Raised'],
  },
  {
    breedName: 'Yorkshire Terrier',
    categorySlug: 'toy-breeds',
    status: 'available',
    gender: 'male',
    age: '9 weeks',
    featured: false,
    summary: 'Yorkshire Terrier puppies with bold personality, small size, and ideal fit for urban homes.',
    characteristics: {
      size: 'toy',
      coatLength: 'long',
      energyLevel: 'moderate',
      goodWithKids: false,
      goodWithPets: true,
      apartmentFriendly: true,
      trainingDifficulty: 'moderate',
      grooming: 'high',
      lifespan: '11-15 years',
      weight: '2-3.5 kg',
      height: '18-23 cm',
    },
    tags: ['Toy Breed', 'Apartment Friendly', 'Vaccinated'],
  },
  {
    breedName: 'American Bully',
    categorySlug: 'guard-dogs',
    status: 'available',
    gender: 'female',
    age: '10 weeks',
    featured: false,
    summary: 'American Bully puppies with strong structure, affectionate family behavior, and confident temperament.',
    characteristics: {
      size: 'medium',
      coatLength: 'short',
      energyLevel: 'moderate',
      goodWithKids: true,
      goodWithPets: true,
      apartmentFriendly: true,
      trainingDifficulty: 'moderate',
      grooming: 'low',
      lifespan: '10-12 years',
      weight: '25-40 kg',
      height: '33-50 cm',
    },
    tags: ['Guard Dog', 'Family Friendly', 'KCI Registered'],
  },
];

export const dogs: Dog[] = breedSeeds.map((seed, index) => {
  const breedImages = getBreedImages(seed.breedName);
  const images = breedImages.images;
  const createdAt = new Date(Date.UTC(2025, 0, index + 1)).toISOString();

  // Create base variations (Small, Medium, Large)
  // Use deterministic pseudo-random values based on index to prevent SSR hydration errors
  const basePrice = 15000 + ((index * 2357) % 20000);
  
  const variants = [
    {
      id: `var-${index}-sm`,
      sizeName: 'Small',
      price: basePrice + 5000, // Small/Teacup usually more expensive or different
      age: '6 weeks',
    },
    {
      id: `var-${index}-md`,
      sizeName: 'Medium',
      price: basePrice,
      age: '8 weeks',
    },
    {
      id: `var-${index}-lg`,
      sizeName: 'Large',
      price: basePrice - 3000,
      age: '12 weeks',
    }
  ];

  return {
    id: `dog-${String(index + 1).padStart(3, '0')}`,
    slug: toSlug(seed.breedName),
    breedName: seed.breedName,
    name: null,
    categorySlug: seed.categorySlug,
    status: seed.status,
    price: variants[1].price, // default base price
    age: seed.age,
    gender: seed.gender,
    images,
    thumbnailImage: breedImages.thumbnailImage,
    description: seed.summary,
    longDescription: `${seed.breedName} puppies at Dogs Paradise Bangalore are home-raised in Benson Town, Bengaluru.\n\n${seed.summary}\n\nEvery puppy is KCI registered, age-appropriately vaccinated, and dewormed before joining your family. You receive vaccination records, feeding guidance, and lifetime breeder support for a smooth transition.`,
    characteristics: seed.characteristics,
    healthInfo: defaultHealthInfo,
    faqs: buildFaqs(seed.breedName, seed.characteristics.apartmentFriendly),
    tags: seed.tags,
    featured: seed.featured,
    createdAt,
    variants,
  };
});
