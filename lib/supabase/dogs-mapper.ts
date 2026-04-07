import { createStaticClient } from "@/lib/supabase/server";
import { dogs as fallbackDogs } from "@/data/dogs";
import { toStorageOnlyImage, toStorageOnlyImageOrNull } from "@/lib/storage-only-images";
import type { Dog, DogCharacteristics, HealthInfo } from "@/types";

type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  status: Dog['status'] | null;
  price: number | null;
  age: string | null;
  gender: Dog['gender'] | null;
  images: unknown[] | null;
  cover_image: string | null;
  description: string | null;
  long_description: string | null;
  characteristics: Record<string, unknown> | null;
  health_info: Record<string, unknown> | null;
  faqs: any[] | null;
  tags: string[] | null;
  featured: boolean | null;
  created_at: string;
};

type ProjectCharacteristicsRow = {
  size?: DogCharacteristics['size'];
  coat_length?: DogCharacteristics['coatLength'];
  energy_level?: DogCharacteristics['energyLevel'];
  good_with_kids?: boolean;
  good_with_pets?: boolean;
  apartment_friendly?: boolean;
  training_difficulty?: DogCharacteristics['trainingDifficulty'];
  grooming?: DogCharacteristics['grooming'];
  lifespan?: string;
  weight?: string;
  height?: string;
};

type ProjectHealthRow = {
  vaccinated?: boolean;
  dewormed?: boolean;
  vet_checked?: boolean;
  microchipped?: boolean;
  kci_registered?: boolean;
  parents_certified?: boolean;
};

export async function getDogs(): Promise<Dog[]> {
  try {
      const supabase = createStaticClient();
      const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) {
          return fallbackDogs;
      }
      
      return data.map((project: ProjectRow) => {
         // Get images from new images array or fallback to cover_image
         const images = project.images && project.images.length > 0 
             ? project.images 
             : (project.cover_image ? [project.cover_image] : []);
         const sanitizedImages = images
             .map((image: unknown) => toStorageOnlyImageOrNull(image))
             .filter((image: string | null): image is string => image !== null);
         
         // Get characteristics from JSONB or use defaults
         const chars = (project.characteristics || {}) as ProjectCharacteristicsRow;
         const health = (project.health_info || {}) as ProjectHealthRow;
         
         const mappedDog: Dog = {
             id: project.id,
             slug: project.slug,
             breedName: project.title,
             name: project.title,
             categorySlug: project.category || "all",
             status: project.status || "available",
             price: project.price || null,
             age: project.age || "8 weeks",
             gender: project.gender || "male",
             images: sanitizedImages.length > 0 ? sanitizedImages : [toStorageOnlyImage(null)],
             thumbnailImage: toStorageOnlyImage(sanitizedImages[0]),
             description: project.description || "",
             longDescription: project.long_description || "",
             characteristics: {
                size: chars.size || "medium",
                coatLength: chars.coat_length || "medium",
                energyLevel: chars.energy_level || "moderate",
                goodWithKids: chars.good_with_kids ?? true,
                goodWithPets: chars.good_with_pets ?? true,
                apartmentFriendly: chars.apartment_friendly ?? false,
                trainingDifficulty: chars.training_difficulty || "moderate",
                grooming: chars.grooming || "moderate",
                lifespan: chars.lifespan || "10-12 years",
                weight: chars.weight || "10-30 kg",
                height: chars.height || "40-60 cm"
             },
             healthInfo: {
                vaccinated: health.vaccinated ?? true,
                dewormed: health.dewormed ?? true,
                vetChecked: health.vet_checked ?? true,
                microchipped: health.microchipped ?? false,
                kciRegistered: health.kci_registered ?? false,
                parentsCertified: health.parents_certified ?? false
             },
             faqs: project.faqs || [],
             tags: project.tags || [],
             featured: project.featured || false,
             createdAt: project.created_at,
             variants: []
         };

         return mappedDog;
      });
  } catch {
      return fallbackDogs;
  }
}

export async function getDogBySlug(slug: string): Promise<Dog | null> {
    const allDogs = await getDogs();
    return allDogs.find((d) => d.slug === slug) || null;
}
