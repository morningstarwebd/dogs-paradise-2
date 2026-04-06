import Link from 'next/link';
import type { FooterLink } from './footer-content';

type FooterLinksColumnProps = {
  links: FooterLink[];
  title: string;
};

export function FooterLinksColumn({ links, title }: FooterLinksColumnProps) {
  return (
    <div>
      <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-[var(--text-primary)]">
        {title}
      </h3>
      <ul className="flex flex-col gap-2.5">
        {links.map((link) => (
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
  );
}
