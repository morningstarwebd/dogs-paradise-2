import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Dogs Paradise Bangalore, our home-raised puppy program, health-first approach, and select KCI-registered litters in Bengaluru.',
};

export default function AboutPage() {
  return <AboutClient />;
}
