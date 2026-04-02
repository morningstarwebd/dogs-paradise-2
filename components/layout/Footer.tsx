import Link from 'next/link';
import { Heart, MapPin, Phone, Mail } from 'lucide-react';
import { siteConfig } from '@/data/site-config';

const quickLinks = [
  { href: '/breeds', label: 'All Breeds' },
  { href: '/breeds?status=available', label: 'Available Puppies' },
  { href: '/about', label: 'About Us' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
  { href: '/cart', label: 'Enquiry Cart' },
];

const breedLinks = [
  { href: '/breeds/golden-retriever-male-001', label: 'Golden Retriever' },
  { href: '/breeds/labrador-retriever-female-001', label: 'Labrador Retriever' },
  { href: '/breeds/german-shepherd-male-001', label: 'German Shepherd' },
  { href: '/breeds/siberian-husky-female-001', label: 'Siberian Husky' },
  { href: '/breeds/french-bulldog-female-001', label: 'French Bulldog' },
  { href: '/breeds/rottweiler-male-001', label: 'Rottweiler' },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🐾</span>
              <span className="font-display text-xl font-bold text-gradient">
                {siteConfig.brandName}
              </span>
            </Link>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
              {siteConfig.tagline}. Home-raised, KCI-registered puppies with champion bloodlines and lifetime breeder support.
            </p>
            <div className="flex flex-col gap-3 text-sm text-[var(--text-secondary)]">
              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone size={14} />
                {siteConfig.phone}
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
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

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-sm uppercase tracking-wider mb-4 text-white">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Breeds */}
          <div>
            <h3 className="font-display font-semibold text-sm uppercase tracking-wider mb-4 text-white">
              Popular Breeds
            </h3>
            <ul className="flex flex-col gap-2.5">
              {breedLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust Column */}
          <div>
            <h3 className="font-display font-semibold text-sm uppercase tracking-wider mb-4 text-white">
              Our Promise
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm text-[var(--text-secondary)]">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-available)]" />
                KCI Registered
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-available)]" />
                Fully Vaccinated
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-available)]" />
                Vet Health Certified
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-available)]" />
                Home-Raised Puppies
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-available)]" />
                Lifetime Breeder Support
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-available)]" />
                Champion Bloodlines
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--text-tertiary)]">
            © {new Date().getFullYear()} {siteConfig.brandName}. All rights reserved.
          </p>
          <p className="text-xs text-[var(--text-tertiary)] flex items-center gap-1">
            Made with <Heart size={12} className="text-red-400" /> in {siteConfig.city}
          </p>
        </div>
      </div>
    </footer>
  );
}
