import type { Metadata } from 'next';
import HappyCustomersClient from './HappyCustomersClient';

export const metadata: Metadata = {
  title: 'Happy Customers',
  description:
    'See what families say about Dogs Paradise Bangalore and explore the Happy Families gallery placeholders ready for future photo updates.',
};

export default function HappyCustomersPage() {
  return <HappyCustomersClient />;
}
