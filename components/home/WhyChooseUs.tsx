'use client';

import { motion } from 'motion/react';
import {
  Award,
  Heart,
  Home,
  MessageCircle,
  Shield,
  Stethoscope,
} from 'lucide-react';
import MobileCarousel from '@/components/ui/MobileCarousel';
import GlassCard from '@/components/ui/GlassCard';
import SectionHeading from '@/components/ui/SectionHeading';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';

const features = [
  {
    icon: <Shield size={28} />,
    title: 'Clear Registration Status',
    description:
      'We clearly explain whether a puppy is companion-only or available with KCI registration before booking.',
  },
  {
    icon: <Stethoscope size={28} />,
    title: 'Vet Certified',
    description:
      'Each puppy is shared with age-appropriate health records, vaccination details, and vet-check updates.',
  },
  {
    icon: <Award size={28} />,
    title: 'Carefully Selected Litters',
    description:
      'We focus on temperament, health, and family suitability instead of rushing large numbers of listings online.',
  },
  {
    icon: <Home size={28} />,
    title: 'Home Raised',
    description:
      'Puppies grow up in a home environment with better socialization, calmer handling, and more human interaction.',
  },
  {
    icon: <Heart size={28} />,
    title: 'Health-First Promise',
    description:
      'We prioritize health notes, feeding guidance, and honest expectations so families know what they are taking home.',
  },
  {
    icon: <MessageCircle size={28} />,
    title: 'Lifetime Support',
    description:
      'Diet plans, grooming help, new-parent guidance, and quick WhatsApp support stay available after pickup too.',
  },
];

function FeatureCard({ feature }: { feature: (typeof features)[number] }) {
  return (
    <GlassCard variant="solid" className="h-full border-emerald-100/50 p-6">
      <div className="relative z-10">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-100/50 bg-emerald-500/10 text-emerald-700">
          {feature.icon}
        </div>
        <h3 className="heading-card mb-2 text-emerald-950">{feature.title}</h3>
        <p className="text-sm leading-relaxed text-emerald-900/70">
          {feature.description}
        </p>
      </div>
    </GlassCard>
  );
}

export default function WhyChooseUs() {
  return (
    <section className="section-shell section-solid-emerald" id="why-choose-us">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Why Dogs Paradise Bangalore?"
          subtitle="A more transparent, health-first experience for families who want the right puppy, not a rushed sale."
        />

        <MobileCarousel autoPlay autoPlayInterval={3500} itemWidth="large">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </MobileCarousel>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="hidden gap-6 lg:grid lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={fadeUpVariant}>
              <FeatureCard feature={feature} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
