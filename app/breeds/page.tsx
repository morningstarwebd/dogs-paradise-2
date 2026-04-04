import type { Metadata } from 'next';
import BreedsClient from './BreedsClient';

export const metadata: Metadata = {
  title: 'All Dog Breeds for Sale in Bangalore',
  description:
    'Browse 25+ dog breeds in Bangalore. Healthy, vaccinated, home-raised puppies are available, with select litters offering KCI registration.',
};

export default function BreedsPage() {
  return <BreedsClient />;
}
