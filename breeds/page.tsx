import type { Metadata } from 'next';
import BreedsClient from './BreedsClient';

export const metadata: Metadata = {
  title: 'All Dog Breeds for Sale in Bangalore',
  description:
    'Browse 25+ KCI-registered dog breeds in Bangalore. Healthy, vaccinated, home-raised puppies available at Dogs Paradise Bangalore.',
};

export default function BreedsPage() {
  return <BreedsClient />;
}
