import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { dogs } from '@/data/dogs';
import DogDetailClient from './DogDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return dogs.map((dog) => ({ slug: dog.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dog = dogs.find((d) => d.slug === slug);
  if (!dog) return { title: 'Dog Not Found' };

  const breed = dog.breedName.toLowerCase();

  return {
    title: `${dog.breedName} Puppy for Sale in Bangalore | Dogs Paradise`,
    description: `Buy healthy ${dog.breedName} puppies in Bangalore. KCI registered, vaccinated, home-raised in Benson Town, Bengaluru. Call +91 90663 80952.`,
    keywords: [
      `${breed} puppy bangalore`,
      `${breed} for sale bangalore`,
      `buy ${breed} bengaluru`,
      `${breed} breeder bangalore`,
      `${breed} price bangalore`,
    ],
    openGraph: {
      title: `${dog.breedName} Puppy for Sale in Bangalore`,
      description: `Buy healthy ${dog.breedName} puppies in Bangalore. KCI registered, vaccinated, home-raised in Benson Town, Bengaluru. Call +91 90663 80952.`,
      images: [{ url: dog.thumbnailImage, width: 800, height: 600 }],
    },
  };
}

export default async function DogDetailPage({ params }: Props) {
  const { slug } = await params;
  const dog = dogs.find((d) => d.slug === slug);
  if (!dog) notFound();

  const relatedDogs = dogs
    .filter((d) => d.id !== dog.id && d.categorySlug === dog.categorySlug)
    .slice(0, 3);

  return <DogDetailClient dog={dog} relatedDogs={relatedDogs} />;
}
