'use client';

import { motion } from 'motion/react';
import GlassCard from '@/components/ui/GlassCard';
import MobileCarousel from '@/components/ui/MobileCarousel';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';
import { Award, BadgeCheck, FileCheck, Shield, Star, Stethoscope } from 'lucide-react';

const badges = [
  {
    icon: <Shield size={32} />,
    title: 'Transparent Paperwork',
    subtitle: 'Clear puppy-by-puppy guidance',
    color: '#8f452b',
  },
  {
    icon: <Stethoscope size={32} />,
    title: 'Vet Checked Puppies',
    subtitle: 'Health-first handover process',
    color: '#1d5c56',
  },
  {
    icon: <FileCheck size={32} />,
    title: 'Health Records Shared',
    subtitle: 'Vaccination and care updates',
    color: '#7a5d2f',
  },
  {
    icon: <Award size={32} />,
    title: 'Champion Lines Available',
    subtitle: 'Select premium litters',
    color: '#aa6122',
  },
  {
    icon: <BadgeCheck size={32} />,
    title: 'After-Pickup Support',
    subtitle: 'Guidance beyond booking day',
    color: '#2d6670',
  },
  {
    icon: <Star size={32} />,
    title: '4.9 Google Rated',
    subtitle: 'Trusted by local families',
    color: '#c29328',
  },
];

function BadgeCard({ badge }: { badge: (typeof badges)[number] }) {
  return (
    <GlassCard hover className="h-full p-5 text-center">
      <div className="relative z-10">
        <div
          className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ background: `${badge.color}14`, color: badge.color }}
        >
          {badge.icon}
        </div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)]">
          {badge.title}
        </p>
        <p className="text-[11px] text-[var(--text-tertiary)]">{badge.subtitle}</p>
      </div>
    </GlassCard>
  );
}

export default function TrustBadges() {
  return (
    <section className="section-shell-tight relative overflow-hidden" id="trust-badges">
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[var(--text-tertiary)]">
            Trusted and Transparent
          </p>
          <h2 className="heading-card text-gradient">Why Families Feel Confident With Us</h2>
        </motion.div>

        <MobileCarousel autoPlay autoPlayInterval={2500} itemWidth="small">
          {badges.map((badge) => (
            <BadgeCard key={badge.title} badge={badge} />
          ))}
        </MobileCarousel>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="hidden gap-4 lg:grid lg:grid-cols-6"
        >
          {badges.map((badge) => (
            <motion.div key={badge.title} variants={fadeUpVariant}>
              <BadgeCard badge={badge} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
