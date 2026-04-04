import Link from 'next/link';
import { Heart, Mail, MapPin, Phone } from 'lucide-react';
import { dogs } from '@/data/dogs';
import { siteConfig } from '@/data/site-config';

const quickLinks = [
  { href: '/breeds', label: 'All Breeds' },
  { href: '/breeds?status=available', label: 'Available Puppies' },
  { href: '/happy-customers', label: 'Happy Customers' },
  { href: '/about', label: 'About Us' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

const featuredBreedNames = [
  'Golden Retriever',
  'Labrador Retriever',
  'German Shepherd',
  'Siberian Husky',
  'French Bulldog',
  'Rottweiler',
];

const breedLinks = featuredBreedNames
  .map((breedName) => dogs.find((dog) => dog.breedName === breedName))
  .filter((dog): dog is (typeof dogs)[number] => Boolean(dog))
  .map((dog) => ({
    href: `/breeds/${dog.slug}`,
    label: dog.breedName,
  }));

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full text-base font-bold text-white shadow-md"
                style={{
                  background:
                    'linear-gradient(135deg, var(--accent-primary), var(--accent-tertiary))',
                }}
              >
                P
              </span>
              <span className="font-display text-xl font-bold text-gradient">
                {siteConfig.brandName}
              </span>
            </Link>
            <p className="mb-6 text-sm leading-relaxed text-[var(--text-secondary)]">
              {siteConfig.tagline}. Health details are shared clearly for every
              puppy, with breeder support before and after pickup.
            </p>
            <div className="flex flex-col gap-3 text-sm text-[var(--text-secondary)]">
              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-2 transition-colors hover:text-[var(--accent-primary)]"
              >
                <Phone size={14} />
                {siteConfig.phone}
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-2 transition-colors hover:text-[var(--accent-primary)]"
              >
                <Mail size={14} />
                {siteConfig.email}
              </a>
              <span className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0" />
                {siteConfig.address}, {siteConfig.city}
              </span>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-[var(--text-primary)]">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-primary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-[var(--text-primary)]">
              Popular Breeds
            </h3>
            <ul className="flex flex-col gap-2.5">
              {breedLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-primary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-[var(--text-primary)]">
              Our Promise
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm text-[var(--text-secondary)]">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--status-available)]" />
                Select KCI Registration Options
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--status-available)]" />
                Age-Appropriate Vaccination
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--status-available)]" />
                Vet Health Checks
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--status-available)]" />
                Home-Raised Puppies
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--status-available)]" />
                Lifetime Breeder Support
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--status-available)]" />
                Clear Health Guidance
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--color-border)]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-xs text-[var(--text-tertiary)]">
            © {new Date().getFullYear()} {siteConfig.brandName}. All rights
            reserved.
          </p>
          <p className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
            Made with <Heart size={12} className="text-red-500" /> in{' '}
            {siteConfig.city}
          </p>
        </div>
      </div>
    </footer>
  );
}
