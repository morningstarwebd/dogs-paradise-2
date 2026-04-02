'use client';

import { motion } from 'motion/react';
import SectionHeading from '@/components/ui/SectionHeading';
import GlassCard from '@/components/ui/GlassCard';
import MobileCarousel from '@/components/ui/MobileCarousel';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';
import { Shield, Award, FileCheck, Stethoscope, BadgeCheck, Star } from 'lucide-react';

const badges = [
  { icon: <Shield size={32} />, title: 'KCI Registered Breeder', subtitle: 'Kennel Club of India', color: '#3b82f6' },
  { icon: <Stethoscope size={32} />, title: 'Vet Certified Facility', subtitle: 'ICAR Standards Compliant', color: '#22c55e' },
  { icon: <FileCheck size={32} />, title: 'Pedigree Documentation', subtitle: '3-Gen Lineage Papers', color: '#a855f7' },
  { icon: <Award size={32} />, title: 'Show Quality Available', subtitle: 'Champion Bloodlines', color: '#f59e0b' },
  { icon: <BadgeCheck size={32} />, title: 'Health Guarantee', subtitle: 'Written Assurance', color: '#06b6d4' },
  { icon: <Star size={32} />, title: '4.9★ Google Rated', subtitle: '200+ Reviews', color: '#eab308' },
];

function BadgeCard({ badge }: { badge: typeof badges[number] }) {
  return (
    <GlassCard hover className="p-5 text-center h-full">
      <div className="relative z-10">
        <div
          className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center"
          style={{ background: `${badge.color}12`, color: badge.color }}
        >
          {badge.icon}
        </div>
        <p className="text-xs font-medium text-white mb-0.5 leading-tight">{badge.title}</p>
        <p className="text-[10px] text-[var(--text-tertiary)]">{badge.subtitle}</p>
      </div>
    </GlassCard>
  );
}

export default function TrustBadges() {
  return (
    <section className="py-16 relative overflow-hidden" id="trust-badges">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-tertiary)] mb-2">
            Trusted & Certified
          </p>
          <h2 className="heading-card text-gradient">Our Credentials</h2>
        </motion.div>

        {/* Mobile Carousel */}
        <MobileCarousel autoPlay autoPlayInterval={2500} itemWidth="small">
          {badges.map((badge) => (
            <BadgeCard key={badge.title} badge={badge} />
          ))}
        </MobileCarousel>

        {/* Desktop Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="hidden lg:grid lg:grid-cols-6 gap-4"
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
