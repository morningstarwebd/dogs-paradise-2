import { createStaticClient } from "@/lib/supabase/server";
import { dogs as fallbackDogs } from "@/data/dogs";
import type { Dog } from "@/types";

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
      
      return data.map((project: any) => {
         return {
             id: project.id,
             slug: project.slug,
             breedName: project.title,
             name: project.title,
             categorySlug: project.category || "all",
             status: project.live_url || "available",
             price: project.sort_order ? project.sort_order * 1000 : 25000,
             age: project.github_url || "8 weeks",
             gender: "male",
             images: project.cover_image ? [project.cover_image] : [],
             thumbnailImage: project.cover_image || "/images/placeholder.jpg",
             description: project.description || "",
             longDescription: project.long_description || "",
             characteristics: {
                size: "medium",
                coatLength: "short",
                energyLevel: "moderate",
                goodWithKids: true,
                goodWithPets: true,
                apartmentFriendly: true,
                trainingDifficulty: "moderate",
                grooming: "moderate",
                lifespan: "10-12 years",
                weight: "10-30 kg",
                height: "15-25 inches"
             },
             healthInfo: {
                vaccinated: true,
                dewormed: true,
                vetChecked: true,
                microchipped: false,
                kciRegistered: false,
                parentsCertified: false
             },
             faqs: [],
             tags: project.tags || [],
             featured: project.featured || false,
             createdAt: project.created_at,
             variants: []
         } as Dog;
      });
  } catch {
      return fallbackDogs;
  }
}

export async function getDogBySlug(slug: string): Promise<Dog | null> {
    const allDogs = await getDogs();
    return allDogs.find((d) => d.slug === slug) || null;
}
