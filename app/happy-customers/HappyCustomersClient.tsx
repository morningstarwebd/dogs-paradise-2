'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import HappyCustomersBook from '@/components/happy/HappyCustomersBook';
import GlassCard from '@/components/ui/GlassCard';
import SectionHeading from '@/components/ui/SectionHeading';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';
import { siteConfig } from '@/data/site-config';
import { testimonials } from '@/data/testimonials';
import { getWhatsAppLink } from '@/lib/utils';
import { Heart, Sparkles, Users } from 'lucide-react';

const stats = [
  { value: '500+', label: 'Happy Families' },
  { value: '4.9', label: 'Average Rating' },
  { value: '20+', label: 'Breeds Matched' },
];

const familyPlaceholders = [
  'Family Moment 01',
  'Family Moment 02',
  'Family Moment 03',
  'Family Moment 04',
  'Family Moment 05',
  'Family Moment 06',
];

const highlights = [
  {
    icon: <Users size={22} />,
    title: 'Story-first Layout',
    description:
      'The first thing visitors now see here is the customer memory book, so the page opens with social proof instead of generic filler.',
  },
  {
    icon: <Heart size={22} />,
    title: 'Photo-ready Pages',
    description:
      'Family placeholders are already included inside the book, so later you can replace them with real customer images without redesigning the page.',
  },
  {
    icon: <Sparkles size={22} />,
    title: 'Desktop + Mobile Experience',
    description:
      'Mobile visitors can swipe pages, while desktop visitors get an open-book interaction with page-by-page browsing.',
  },
];

export default function HappyCustomersClient() {
  return (
    <div className="pb-0 pt-24">
      <section className="section-shell">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            animate="visible"
            className="mx-auto mb-12 max-w-3xl text-center"
          >
            <span className="label-badge mb-5 inline-block rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-[var(--text-secondary)]">
              Happy Customers
            </span>
            <h1 className="heading-hero mb-5 text-gradient">A Storybook of Real Puppy Families</h1>
            <p className="text-lg leading-relaxed text-[var(--text-secondary)]">
              This page now opens with an interactive memory book. On mobile it feels like swiping
              through pages, and on desktop it opens like a real book so visitors can browse happy
              customer stories in a more premium way.
            </p>
          </motion.div>

          <HappyCustomersBook
            testimonials={testimonials.slice(0, 6)}
            familyPlaceholders={familyPlaceholders}
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-12 grid gap-4 sm:grid-cols-3"
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={fadeUpVariant}>
                <GlassCard hover={false} variant="solid" className="p-6 text-center">
                  <p className="mb-2 text-3xl font-bold text-gradient">{stat.value}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
                    {stat.label}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="section-shell-tight bg-[var(--color-surface)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Why This Page Works Better"
            subtitle="A cleaner, stronger presentation for real customer trust."
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 lg:grid-cols-3"
          >
            {highlights.map((item) => (
              <motion.div key={item.title} variants={fadeUpVariant}>
                <GlassCard hover={false} variant="solid" className="h-full p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
                    {item.icon}
                  </div>
                  <h2 className="heading-card mb-2 text-[var(--text-primary)]">{item.title}</h2>
                  <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                    {item.description}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="section-shell">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <GlassCard hover={false} className="p-8 text-center sm:p-10">
            <div className="relative z-10">
              <h2 className="heading-section mb-4 text-gradient">Ready to Add More Customer Stories?</h2>
              <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
                This page is now ready for real reviews, future customer photos, and social proof
                updates. When you are ready, replace any placeholder page with an actual family
                image or story.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link href="/contact" className="glass-btn px-8 py-3 text-sm font-medium">
                  Open Contact Page
                </Link>
                <a
                  href={getWhatsAppLink(
                    siteConfig.whatsappNumber,
                    'Hi, I would like to know more about your puppies.'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-btn px-8 py-3 text-sm font-medium"
                >
                  WhatsApp {siteConfig.phone}
                </a>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
