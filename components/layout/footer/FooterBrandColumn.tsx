import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';

type FooterBrandColumnProps = {
  address: string;
  brandBadgeText: string;
  brandName: string;
  city: string;
  email: string;
  phone: string;
  tagline: string;
};

export function FooterBrandColumn({
  address,
  brandBadgeText,
  brandName,
  city,
  email,
  phone,
  tagline,
}: FooterBrandColumnProps) {
  return (
    <div className="lg:col-span-1">
      <Link href="/" className="mb-4 flex items-center gap-2">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-full text-base font-bold text-white shadow-md"
          style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-tertiary))' }}
        >
          {brandBadgeText}
        </span>
        <span className="font-display text-xl font-bold text-gradient">{brandName}</span>
      </Link>
      <p className="mb-6 text-sm leading-relaxed text-[var(--text-secondary)]">{tagline}</p>
      <div className="flex flex-col gap-3 text-sm text-[var(--text-secondary)]">
        <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="flex items-center gap-2 transition-colors hover:text-[var(--accent-primary)]">
          <Phone size={14} />
          {phone}
        </a>
        <a href={`mailto:${email}`} className="flex items-center gap-2 transition-colors hover:text-[var(--accent-primary)]">
          <Mail size={14} />
          {email}
        </a>
        <span className="flex items-start gap-2">
          <MapPin size={14} className="mt-0.5 shrink-0" />
          {address}, {city}
        </span>
      </div>
    </div>
  );
}
