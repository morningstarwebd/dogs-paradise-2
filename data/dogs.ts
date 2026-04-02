import type { Dog } from '@/types';

export const dogs: Dog[] = [
  {
    id: 'dog-001',
    slug: 'golden-retriever-male-001',
    breedName: 'Golden Retriever',
    name: null,
    categorySlug: 'family-dogs',
    status: 'available',
    price: 25000,
    age: '8 weeks',
    gender: 'male',
    images: [
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800&h=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1612774412771-005ed8e861d2?w=800&h=600&q=80&auto=format&fit=crop',
    ],
    thumbnailImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=600&q=80&auto=format&fit=crop',
    description:
      'Beautiful pure-bred Golden Retriever puppy with champion bloodline. KCI registered, fully vaccinated, and dewormed. Perfect family companion.',
    longDescription: `Golden Retrievers are one of India's most beloved family dogs, and for good reason. Known for their gentle temperament, intelligence, and unwavering loyalty, they make the perfect addition to any household.

This gorgeous male Golden Retriever puppy comes from a champion bloodline with both parents being KCI-certified show dogs. He has been raised in a loving home environment from birth, ensuring excellent socialization with humans and other pets.

**Temperament:** Friendly, reliable, and trustworthy. Golden Retrievers are naturally patient with children and eager to please, making training a joy rather than a chore. They are known for their "soft mouth" — gentle enough to carry an egg without breaking it.

**Health:** This puppy has received all age-appropriate vaccinations, has been dewormed on schedule, and has undergone a thorough veterinary health examination. His parents have been screened for hip dysplasia, elbow dysplasia, and progressive retinal atrophy.

**What You Get:** KCI registration papers, vaccination records, deworming schedule, a puppy starter kit with food samples, and lifetime breeder support for any questions about your new family member.`,
    characteristics: {
      size: 'large',
      coatLength: 'long',
      energyLevel: 'high',
      goodWithKids: true,
      goodWithPets: true,
      apartmentFriendly: false,
      trainingDifficulty: 'easy',
      grooming: 'high',
      lifespan: '10–12 years',
      weight: '25–34 kg',
      height: '55–61 cm',
    },
    healthInfo: {
      vaccinated: true,
      dewormed: true,
      vetChecked: true,
      microchipped: false,
      kciRegistered: true,
      parentsCertified: true,
    },
    tags: ['KCI Registered', 'Champion Bloodline', 'Vaccinated', 'Dewormed'],
    featured: true,
    createdAt: '2025-01-15T00:00:00Z',
  },
  {
    id: 'dog-002',
    slug: 'labrador-retriever-female-001',
    breedName: 'Labrador Retriever',
    name: null,
    categorySlug: 'family-dogs',
    status: 'available',
    price: 20000,
    age: '10 weeks',
    gender: 'female',
    images: [
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&h=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&h=600&q=80&auto=format&fit=crop',
    ],
    thumbnailImage: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&h=600&q=80&auto=format&fit=crop',
    description:
      'Adorable chocolate Labrador Retriever puppy. Extremely friendly, great with kids, and ready for her forever home. Fully vaccinated and vet-checked.',
    longDescription: `The Labrador Retriever consistently ranks as one of the most popular dog breeds worldwide, and this beautiful chocolate female is a perfect example of why.

Labradors are renowned for their friendly, outgoing nature. They are excellent companions for families with children, active singles, and even first-time dog owners. Their intelligence and eagerness to please make them highly trainable.

**Temperament:** This puppy has been socialized extensively — she's comfortable around children, other dogs, and everyday household sounds. She's playful, curious, and already shows the gentle, loving nature that Labs are famous for.

**Health & Certification:** She comes with complete vaccination records, deworming history, and a clean bill of health from our veterinarian. Both parents are KCI-registered Labradors with excellent health clearances.

**Ideal For:** Families looking for a loyal, energetic, and loving companion. Labradors excel at obedience, agility, and are natural swimmers. They adapt well to Indian climates with proper care.`,
    characteristics: {
      size: 'large',
      coatLength: 'short',
      energyLevel: 'high',
      goodWithKids: true,
      goodWithPets: true,
      apartmentFriendly: false,
      trainingDifficulty: 'easy',
      grooming: 'moderate',
      lifespan: '10–13 years',
      weight: '25–36 kg',
      height: '54–62 cm',
    },
    healthInfo: {
      vaccinated: true,
      dewormed: true,
      vetChecked: true,
      microchipped: false,
      kciRegistered: true,
      parentsCertified: true,
    },
    tags: ['KCI Registered', 'Vaccinated', 'Family Friendly', 'Dewormed'],
    featured: true,
    createdAt: '2025-01-20T00:00:00Z',
  },
  {
    id: 'dog-003',
    slug: 'german-shepherd-male-001',
    breedName: 'German Shepherd',
    name: 'Rex',
    categorySlug: 'guard-dogs',
    status: 'available',
    price: 30000,
    age: '12 weeks',
    gender: 'male',
    images: [
      'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=800&h=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1568572933382-74d440642b75?w=800&h=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1619447510631-5148cc3e517c?w=800&h=600&q=80&auto=format&fit=crop',
    ],
    thumbnailImage: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=800&h=600&q=80&auto=format&fit=crop',
    description:
      'Stunning German Shepherd with strong build and alert temperament. Excellent guard dog potential with a gentle family side. Champion sire lineage.',
    longDescription: `Meet Rex — a magnificent German Shepherd puppy who embodies the breed's hallmark combination of intelligence, courage, and loyalty. His father is a KCI champion show dog with multiple Best in Breed titles.

German Shepherds are the world's premier working dog breed, serving as police dogs, search-and-rescue dogs, and family protectors. Despite their formidable reputation, they are incredibly gentle and devoted with their families.

**Temperament:** Rex is confident, curious, and already showing signs of the breed's legendary intelligence. He's alert but not aggressive, protective but gentle with children. He has been raised alongside our family cats and is well-socialized.

**Build & Appearance:** Rex has the classic saddleback coloring with a rich tan and black coat. His bone structure and angulation suggest he will mature into a powerful, well-proportioned adult. His ears are beginning to stand, and his gait is smooth and ground-covering.

**Training Potential:** German Shepherds are among the most trainable breeds in the world. Rex already responds to basic commands and is eager to learn. We recommend professional obedience training to bring out his full potential.`,
    characteristics: {
      size: 'large',
      coatLength: 'medium',
      energyLevel: 'very_high',
      goodWithKids: true,
      goodWithPets: true,
      apartmentFriendly: false,
      trainingDifficulty: 'moderate',
      grooming: 'moderate',
      lifespan: '9–13 years',
      weight: '30–40 kg',
      height: '55–65 cm',
    },
    healthInfo: {
      vaccinated: true,
      dewormed: true,
      vetChecked: true,
      microchipped: true,
      kciRegistered: true,
      parentsCertified: true,
    },
    tags: ['KCI Registered', 'Champion Sire', 'Microchipped', 'Guard Dog'],
    featured: true,
    createdAt: '2025-02-01T00:00:00Z',
  },
  {
    id: 'dog-004',
    slug: 'siberian-husky-female-001',
    breedName: 'Siberian Husky',
    name: 'Luna',
    categorySlug: 'large-breeds',
    status: 'available',
    price: 35000,
    age: '9 weeks',
    gender: 'female',
    images: [
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=600&q=80&auto=format&fit=crop',
    ],
    thumbnailImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=600&q=80&auto=format&fit=crop',
    description:
      'Breathtaking Siberian Husky with striking blue eyes and classic wolf-grey coat. Energetic, playful, and absolutely gorgeous.',
    longDescription: `Luna is a showstopper — a Siberian Husky female with piercing ice-blue eyes and a luxurious wolf-grey and white coat that turns heads wherever she goes.

Siberian Huskies are one of the most visually stunning dog breeds in the world. Originally bred as sled dogs in the harsh Siberian tundra, they are incredibly resilient, athletic, and spirited.

**Important Climate Note:** While Huskies can adapt to Indian climates, they require air-conditioned environments during summer months. We only place Huskies with families who can provide a cool, comfortable living space. Luna's comfort and wellbeing are our top priority.

**Temperament:** Luna is exceptionally friendly and social — Huskies are known for being great with people, including strangers. She loves to play, explore, and "talk" (Huskies are famously vocal!). She gets along wonderfully with other dogs.

**Exercise Needs:** Huskies are high-energy dogs that need significant daily exercise. Luna will require long walks, runs, or play sessions to stay happy and healthy. A bored Husky is a destructive Husky — they need mental stimulation too.

**What Makes Her Special:** Luna's blue eyes and symmetrical facial markings make her a standout. She comes from imported bloodlines and both parents have excellent temperaments.`,
    characteristics: {
      size: 'large',
      coatLength: 'double',
      energyLevel: 'very_high',
      goodWithKids: true,
      goodWithPets: true,
      apartmentFriendly: false,
      trainingDifficulty: 'hard',
      grooming: 'high',
      lifespan: '12–15 years',
      weight: '16–27 kg',
      height: '50–60 cm',
    },
    healthInfo: {
      vaccinated: true,
      dewormed: true,
      vetChecked: true,
      microchipped: false,
      kciRegistered: true,
      parentsCertified: true,
    },
    tags: ['KCI Registered', 'Blue Eyes', 'Imported Line', 'Vaccinated'],
    featured: true,
    createdAt: '2025-02-10T00:00:00Z',
  },
  {
    id: 'dog-005',
    slug: 'rottweiler-male-001',
    breedName: 'Rottweiler',
    name: 'Bruno',
    categorySlug: 'guard-dogs',
    status: 'available',
    price: 28000,
    age: '11 weeks',
    gender: 'male',
    images: [
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=600&q=80&auto=format&fit=crop',
    ],
    thumbnailImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=600&q=80&auto=format&fit=crop',
    description:
      'Powerful Rottweiler puppy with excellent bone structure and confident temperament. Born to protect, raised to love. Heavy-boned European line.',
    longDescription: `Bruno is a robust Rottweiler male with an impressive bone structure and the calm, confident temperament that makes this breed one of the most popular guard dogs in India.

Rottweilers are often misunderstood as aggressive, but well-bred and properly socialized Rotties are among the most loyal, gentle, and trainable breeds. Bruno has been raised with our family and is comfortable with children, other dogs, and visitors.

**Build:** Bruno comes from European working lines known for heavy bone structure, broad heads, and powerful builds. He is expected to mature at 45–55 kg — a true gentle giant.

**Temperament:** Calm, confident, and naturally protective. Bruno is alert but never nervous or anxious. He follows family members around the house and already shows the breed's characteristic "lean" — pressing his body against you for affection.

**Guarding Instinct:** Rottweilers are natural guardians. Even without formal training, they are instinctively protective of their family and territory. Bruno will be an excellent watchdog while being completely safe and gentle with your family.

**Health Clearances:** Bruno's parents have been screened for hip and elbow dysplasia, heart conditions, and eye issues. He comes with a comprehensive health guarantee.`,
    characteristics: {
      size: 'large',
      coatLength: 'short',
      energyLevel: 'moderate',
      goodWithKids: true,
      goodWithPets: false,
      apartmentFriendly: false,
      trainingDifficulty: 'moderate',
      grooming: 'low',
      lifespan: '8–10 years',
      weight: '42–60 kg',
      height: '56–69 cm',
    },
    healthInfo: {
      vaccinated: true,
      dewormed: true,
      vetChecked: true,
      microchipped: true,
      kciRegistered: true,
      parentsCertified: true,
    },
    tags: ['KCI Registered', 'European Line', 'Heavy Bone', 'Microchipped'],
    featured: true,
    createdAt: '2025-02-15T00:00:00Z',
  },
  {
    id: 'dog-006',
    slug: 'beagle-male-001',
    breedName: 'Beagle',
    name: null,
    categorySlug: 'small-breeds',
    status: 'available',
    price: 18000,
    age: '10 weeks',
    gender: 'male',
    images: [
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=600&q=80&auto=format&fit=crop',
    ],
    thumbnailImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=600&q=80&auto=format&fit=crop',
    description:
      'Cheerful tricolor Beagle puppy with classic markings. Compact, merry, and an excellent apartment-friendly companion.',
    longDescription: `This delightful Beagle puppy is everything the breed is known for — merry, curious, and endlessly charming. With his classic tricolor coat (black, tan, and white) and soulful brown eyes, he's impossible to resist.

Beagles are one of the best small-to-medium breeds for Indian families. They are sturdy, adaptable, and their compact size makes them ideal for apartment living.

**Temperament:** Beagles are pack dogs by nature, which means they thrive on companionship. This puppy is incredibly social — he loves being around people and other dogs. He's playful and curious, with a nose that leads him on adventures.

**Size Advantage:** At 9–11 kg when fully grown, Beagles are the perfect "not too big, not too small" breed. They are robust enough for outdoor play but compact enough for apartment living.

**Exercise & Lifestyle:** Beagles need moderate daily exercise — a couple of good walks and some playtime will keep them happy. They love sniffing games and treat-puzzle toys that engage their incredible sense of smell.

**Family Fit:** Excellent with children of all ages. Beagles are patient, gentle, and have seemingly boundless energy for play. They also get along well with other dogs and even cats.`,
    characteristics: {
      size: 'small',
      coatLength: 'short',
      energyLevel: 'high',
      goodWithKids: true,
      goodWithPets: true,
      apartmentFriendly: true,
      trainingDifficulty: 'moderate',
      grooming: 'low',
      lifespan: '12–15 years',
      weight: '9–11 kg',
      height: '33–41 cm',
    },
    healthInfo: {
      vaccinated: true,
      dewormed: true,
      vetChecked: true,
      microchipped: false,
      kciRegistered: true,
      parentsCertified: false,
    },
    tags: ['KCI Registered', 'Apartment Friendly', 'Vaccinated', 'Tricolor'],
    featured: true,
    createdAt: '2025-02-20T00:00:00Z',
  },
  {
    id: 'dog-007',
    slug: 'shih-tzu-female-001',
    breedName: 'Shih Tzu',
    name: 'Coco',
    categorySlug: 'toy-breeds',
    status: 'available',
    price: 22000,
    age: '9 weeks',
    gender: 'female',
    images: [
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800&h=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800&h=600&q=80&auto=format&fit=crop',
    ],
    thumbnailImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=600&q=80&auto=format&fit=crop',
    description:
      'Adorable Shih Tzu princess with a luxurious gold and white coat. Perfect lap dog — affectionate, calm, and great for apartments.',
    longDescription: `Meet Coco — a gorgeous Shih Tzu female with a flowing gold and white coat that gives her an almost regal appearance. Shih Tzus were originally bred for Chinese royalty, and Coco certainly carries herself with that dignified charm.

**Perfect Apartment Dog:** Shih Tzus are one of the best breeds for apartment living in India. They don't need a yard, they don't bark excessively, and they are content to be your constant lap companion.

**Temperament:** Coco is sweet, affectionate, and loves nothing more than being close to her humans. She's calm and gentle — perfect for families with young children or elderly family members. She's also great with other small pets.

**Grooming:** Shih Tzus do require regular grooming to keep their coat beautiful. We recommend professional grooming every 4-6 weeks, with daily brushing at home. Many owners opt for a "puppy cut" for easier maintenance in the Indian climate.

**Health:** Coco has been vaccinated, dewormed, and vet-checked. Shih Tzus are generally a healthy breed with a long lifespan of 10-18 years. She comes with a health guarantee and ongoing breeder support.

**Climate Suitability:** Shih Tzus do well in air-conditioned homes. Their flat face means they can overheat in extreme temperatures, so we recommend cool indoor environments during Indian summers.`,
    characteristics: {
      size: 'toy',
      coatLength: 'long',
      energyLevel: 'low',
      goodWithKids: true,
      goodWithPets: true,
      apartmentFriendly: true,
      trainingDifficulty: 'moderate',
      grooming: 'high',
      lifespan: '10–18 years',
      weight: '4–7 kg',
      height: '20–28 cm',
    },
    healthInfo: {
      vaccinated: true,
      dewormed: true,
      vetChecked: true,
      microchipped: false,
      kciRegistered: true,
      parentsCertified: false,
    },
    tags: ['KCI Registered', 'Apartment Friendly', 'Lap Dog', 'Vaccinated'],
    featured: false,
    createdAt: '2025-03-01T00:00:00Z',
  },
  {
    id: 'dog-008',
    slug: 'pomeranian-male-001',
    breedName: 'Pomeranian',
    name: 'Teddy',
    categorySlug: 'toy-breeds',
    status: 'available',
    price: 15000,
    age: '11 weeks',
    gender: 'male',
    images: [
      'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800&h=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800&h=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800&h=600&q=80&auto=format&fit=crop',
    ],
    thumbnailImage: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800&h=600&q=80&auto=format&fit=crop',
    description:
      'Fluffy orange Pomeranian with a teddy bear face. Spirited, bold, and full of personality despite his tiny size.',
    longDescription: `Teddy is a vibrant orange Pomeranian with the classic "teddy bear" face that makes this breed social media's favorite. Don't let his small size fool you — Pomeranians have the heart of a lion and personality enough for a dog three times their size.

**Personality Plus:** Pomeranians are confident, curious, and bold. Teddy is already showing his spirited side — he struts around with an infectious confidence that makes everyone smile. He's alert and makes an excellent little watchdog.

**Size & Convenience:** At just 2-3 kg when fully grown, Pomeranians are perfect for city living. They need minimal space, minimal exercise (short walks and indoor play), and are easy to travel with. They are the ultimate portable companion.

**Coat Care:** Teddy's gorgeous double coat requires regular brushing (3-4 times per week) and periodic grooming. His fluffy appearance is a big part of his charm, and with proper care, his coat will be a showstopper.

**Intelligence:** Despite their compact size, Pomeranians are surprisingly intelligent. Teddy already responds to his name and is beginning to understand basic commands. They excel at tricks and love the attention that performing brings.

**Ideal Owner:** Perfect for apartment dwellers, work-from-home professionals, and anyone who wants a lively, loving companion that fits right in their lap.`,
    characteristics: {
      size: 'toy',
      coatLength: 'long',
      energyLevel: 'moderate',
      goodWithKids: false,
      goodWithPets: true,
      apartmentFriendly: true,
      trainingDifficulty: 'moderate',
      grooming: 'high',
      lifespan: '12–16 years',
      weight: '1.5–3 kg',
      height: '18–24 cm',
    },
    healthInfo: {
      vaccinated: true,
      dewormed: true,
      vetChecked: true,
      microchipped: false,
      kciRegistered: true,
      parentsCertified: false,
    },
    tags: ['KCI Registered', 'Teddy Face', 'Apartment Friendly', 'Vaccinated'],
    featured: false,
    createdAt: '2025-03-05T00:00:00Z',
  },
  {
    id: 'dog-009',
    slug: 'doberman-male-001',
    breedName: 'Doberman Pinscher',
    name: 'Shadow',
    categorySlug: 'guard-dogs',
    status: 'reserved',
    price: 32000,
    age: '10 weeks',
    gender: 'male',
    images: [
      'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800&h=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800&h=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800&h=600&q=80&auto=format&fit=crop',
    ],
    thumbnailImage: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800&h=600&q=80&auto=format&fit=crop',
    description:
      'Sleek black-and-rust Doberman with athletic build. Highly intelligent, loyal, and one of the best personal protection dogs in the world.',
    longDescription: `Shadow is a striking Doberman Pinscher with the breed's classic sleek black-and-rust coloring and an athletic build that speaks to his working dog heritage.

Dobermans are often called the "Cadillac of guard dogs" — they combine elegance, intelligence, and fierce loyalty in one package. They are consistently ranked among the top 5 most intelligent dog breeds.

**Why Dobermans Are Special:** Unlike many guard breeds, Dobermans are incredibly attuned to their owners' emotions. They are sensitive, affectionate with family, and form an unbreakable bond with their primary caretaker.

**Temperament:** Shadow is already showing the breed's characteristic alertness and confidence. He's wary of strangers (a desirable guard dog trait) but affectionate and playful with his family. He's excellent with our children.

**Training:** Dobermans are among the easiest guard breeds to train due to their intelligence and desire to please. Shadow will benefit greatly from structured obedience training starting as early as possible.

**Note:** Shadow is currently RESERVED. Please contact us to join the waitlist for upcoming Doberman litters, or inquire about similar guard dog breeds.`,
    characteristics: {
      size: 'large',
      coatLength: 'short',
      energyLevel: 'very_high',
      goodWithKids: true,
      goodWithPets: false,
      apartmentFriendly: false,
      trainingDifficulty: 'moderate',
      grooming: 'low',
      lifespan: '10–13 years',
      weight: '32–45 kg',
      height: '61–72 cm',
    },
    healthInfo: {
      vaccinated: true,
      dewormed: true,
      vetChecked: true,
      microchipped: true,
      kciRegistered: true,
      parentsCertified: true,
    },
    tags: ['KCI Registered', 'Champion Line', 'Guard Dog', 'Reserved'],
    featured: false,
    createdAt: '2025-03-10T00:00:00Z',
  },
  {
    id: 'dog-010',
    slug: 'french-bulldog-female-001',
    breedName: 'French Bulldog',
    name: 'Mochi',
    categorySlug: 'toy-breeds',
    status: 'available',
    price: 45000,
    age: '10 weeks',
    gender: 'female',
    images: [
      'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800&h=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800&h=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1612774412771-005ed8e861d2?w=800&h=600&q=80&auto=format&fit=crop',
    ],
    thumbnailImage: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800&h=600&q=80&auto=format&fit=crop',
    description:
      'Charming fawn French Bulldog with bat ears and a playful personality. Low energy, low maintenance, maximum cuteness.',
    longDescription: `Mochi is an irresistibly cute French Bulldog with the breed's signature bat ears, compact muscular body, and a personality that's equal parts clown and cuddle bug.

French Bulldogs have surged to become one of the most popular breeds globally, and Mochi shows exactly why. She's adaptable, affectionate, and requires surprisingly little exercise compared to other breeds.

**Perfect City Dog:** French Bulldogs are essentially purpose-built for apartment living. They don't need much space, they don't bark excessively, they don't need long walks, and they're happiest curled up next to you on the couch.

**Temperament:** Mochi is playful in short bursts, followed by long naps. She's affectionate without being needy, friendly with strangers, and gets along beautifully with other pets. She has a hilarious habit of "talking" with various snorts, grunts, and sighs.

**Health Considerations:** As a brachycephalic (flat-faced) breed, French Bulldogs require air-conditioning during Indian summers. We take this very seriously and will only place our Frenchies with families who can provide temperature-controlled environments.

**Why Premium Pricing:** French Bulldogs are one of the most expensive breeds due to breeding challenges — they often require C-section deliveries and have small litters. Mochi comes from health-tested parents with excellent breathing and no structural issues.`,
    characteristics: {
      size: 'small',
      coatLength: 'short',
      energyLevel: 'low',
      goodWithKids: true,
      goodWithPets: true,
      apartmentFriendly: true,
      trainingDifficulty: 'easy',
      grooming: 'low',
      lifespan: '10–12 years',
      weight: '8–14 kg',
      height: '28–33 cm',
    },
    healthInfo: {
      vaccinated: true,
      dewormed: true,
      vetChecked: true,
      microchipped: false,
      kciRegistered: true,
      parentsCertified: true,
    },
    tags: ['KCI Registered', 'Apartment Friendly', 'Low Energy', 'Rare Breed'],
    featured: true,
    createdAt: '2025-03-15T00:00:00Z',
  },
  {
    id: 'dog-011',
    slug: 'cocker-spaniel-female-001',
    breedName: 'Cocker Spaniel',
    name: null,
    categorySlug: 'small-breeds',
    status: 'coming_soon',
    price: 20000,
    age: '6 weeks',
    gender: 'female',
    images: [
      'https://images.unsplash.com/photo-1612774412771-005ed8e861d2?w=800&h=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1612774412771-005ed8e861d2?w=800&h=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1612774412771-005ed8e861d2?w=800&h=600&q=80&auto=format&fit=crop',
    ],
    thumbnailImage: 'https://images.unsplash.com/photo-1612774412771-005ed8e861d2?w=800&h=600&q=80&auto=format&fit=crop',
    description:
      'Gorgeous golden Cocker Spaniel with silky ears and the sweetest expression. Will be ready for her new home in 2 weeks.',
    longDescription: `This beautiful golden Cocker Spaniel puppy will be ready for her forever home in approximately 2 weeks. She is currently being weaned and receiving her initial vaccinations.

Cocker Spaniels are often called "the merry cocker" — and for good reason. Their perpetually wagging tail, gentle eyes, and silky coat make them one of the most charming breeds you'll ever meet.

**Temperament:** Cocker Spaniels are gentle, happy, and incredibly loving. They form deep bonds with their families and are excellent with children. They have moderate energy levels — enough for play and walks, but also happy to relax at home.

**Coat Beauty:** The Cocker Spaniel's luxurious, silky coat is their crowning glory. Regular grooming (every 4-6 weeks) keeps it looking stunning. Many Indian owners opt for a practical sport cut during summer months.

**Versatility:** Cockers are adaptable dogs that do well in apartments and houses alike. They're social butterflies who get along with other dogs, cats, and even small pets.

**Reservation:** As this puppy is coming soon, we are accepting advance reservations. A small deposit secures your spot in our priority list. She comes with full vaccination schedule, KCI papers, and lifetime support.`,
    characteristics: {
      size: 'small',
      coatLength: 'long',
      energyLevel: 'moderate',
      goodWithKids: true,
      goodWithPets: true,
      apartmentFriendly: true,
      trainingDifficulty: 'easy',
      grooming: 'high',
      lifespan: '12–15 years',
      weight: '12–16 kg',
      height: '36–43 cm',
    },
    healthInfo: {
      vaccinated: false,
      dewormed: true,
      vetChecked: true,
      microchipped: false,
      kciRegistered: true,
      parentsCertified: false,
    },
    tags: ['KCI Registered', 'Coming Soon', 'Family Dog', 'Silky Coat'],
    featured: false,
    createdAt: '2025-03-20T00:00:00Z',
  },
  {
    id: 'dog-012',
    slug: 'great-dane-male-001',
    breedName: 'Great Dane',
    name: 'Zeus',
    categorySlug: 'large-breeds',
    status: 'sold',
    price: 40000,
    age: '12 weeks',
    gender: 'male',
    images: [
      'https://images.unsplash.com/photo-1612774412771-005ed8e861d2?w=800&h=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1612774412771-005ed8e861d2?w=800&h=600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1612774412771-005ed8e861d2?w=800&h=600&q=80&auto=format&fit=crop',
    ],
    thumbnailImage: 'https://images.unsplash.com/photo-1612774412771-005ed8e861d2?w=800&h=600&q=80&auto=format&fit=crop',
    description:
      'Majestic harlequin Great Dane — the "Apollo of dogs." Gentle giant with a heart as big as his enormous paws. SOLD.',
    longDescription: `Zeus was a magnificent harlequin Great Dane who found his forever home with a wonderful family in Bangalore. While Zeus is no longer available, we share his profile to showcase the quality of Great Danes we breed.

Great Danes are known as "gentle giants" — they are the tallest dog breed in the world, yet they are among the most gentle, patient, and loving. Despite their imposing size, they are often called "the world's biggest lap dog" because they truly believe they are tiny enough to sit on your lap.

**About Our Great Danes:** We specialize in breeding healthy Great Danes with excellent temperaments. Our breeding stock is imported and health-tested for dilated cardiomyopathy (DCM), hip dysplasia, and other breed-specific conditions.

**What to Expect:** Great Danes grow incredibly fast — they can gain 2-3 kg per week during their growth phase. They need high-quality nutrition, careful exercise management during growth, and lots of love.

**Next Litter:** We are expecting our next Great Dane litter in approximately 2-3 months. Contact us to join the waitlist. Available colors will include fawn, brindle, and harlequin.`,
    characteristics: {
      size: 'giant',
      coatLength: 'short',
      energyLevel: 'moderate',
      goodWithKids: true,
      goodWithPets: true,
      apartmentFriendly: false,
      trainingDifficulty: 'moderate',
      grooming: 'low',
      lifespan: '7–10 years',
      weight: '50–90 kg',
      height: '71–86 cm',
    },
    healthInfo: {
      vaccinated: true,
      dewormed: true,
      vetChecked: true,
      microchipped: true,
      kciRegistered: true,
      parentsCertified: true,
    },
    tags: ['KCI Registered', 'Harlequin', 'Giant Breed', 'SOLD'],
    featured: false,
    createdAt: '2025-01-05T00:00:00Z',
  },
];
