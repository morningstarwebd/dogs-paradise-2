import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Dogs Paradise Bangalore — Bengaluru\'s premium dog breeder. Home-raised, KCI-registered puppies with champion bloodlines since 2018.',
};

export default function AboutPage() {
  return <AboutClient />;
}
