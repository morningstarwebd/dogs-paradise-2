import type { Metadata } from 'next';
import BreedsClient from './BreedsClient';
import { getDogs } from '@/lib/supabase/dogs-mapper';

export const metadata: Metadata = {
  title: 'All Dog Breeds for Sale in Bangalore',
  description:
    'Browse 25+ dog breeds in Bangalore. Healthy, vaccinated, home-raised puppies are available, with select litters offering KCI registration.',
};

export default async function BreedsPage() {
  const dogs = await getDogs();
  return <BreedsClient dogs={dogs} />;
}

