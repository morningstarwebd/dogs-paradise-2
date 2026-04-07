import { notFound, redirect } from 'next/navigation';
import { getDogBySlug, getDogs } from '@/lib/supabase/dogs-mapper';
import { createClient } from '@/lib/supabase/server';
import { mergeProductTemplateSettings } from '@/types/page-template';
import type { PageTemplateSettings } from '@/types/page-template';
import { ProductTemplateRenderer } from './components/ProductTemplateRenderer';

export async function generateStaticParams() {
  const dogs = await getDogs();
  return dogs.map((dog) => ({
    slug: dog.slug,
  }));
}

export default async function BreedPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const isPreviewMode = resolvedSearchParams?.preview === 'true';
  let dog = await getDogBySlug(slug);

  if (!dog && isPreviewMode) {
    const availableDogs = await getDogs();
    const fallbackDog = availableDogs.find(
      (entry) => typeof entry.slug === 'string' && entry.slug.trim().length > 0
    ) || null;
    if (fallbackDog) {
      redirect(`/breeds/${fallbackDog.slug}?preview=true`);
    }
  }

  if (!dog) {
    notFound();
  }

  const supabase = await createClient();
  const { data: productTemplate } = await supabase
    .from('page_templates')
    .select('settings')
    .eq('page_type', 'product')
    .single();

  const templateSettings = mergeProductTemplateSettings(
    productTemplate?.settings as PageTemplateSettings | undefined
  );

  // Get related dogs
  const allDogs = await getDogs();
  const relatedDogs = allDogs
    .filter((d) => d.id !== dog.id && d.breedName !== dog.breedName)
    .slice(0, 3);

  return (
    <ProductTemplateRenderer
      initialSettings={templateSettings}
      pageType="product"
      dog={dog}
      relatedDogs={relatedDogs}
      isPreview={isPreviewMode}
    />
  );
}
