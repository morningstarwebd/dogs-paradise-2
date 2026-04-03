'use client';

import { motion } from 'motion/react';
import SectionHeading from '@/components/ui/SectionHeading';
import GlassCard from '@/components/ui/GlassCard';
import MobileCarousel from '@/components/ui/MobileCarousel';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';
import { Shield, Heart, Award, Stethoscope, Home, MessageCircle } from 'lucide-react';

const features = [
  {
    icon: <Shield size={28} />,
    title: 'KCI Registered',
    description: 'Every puppy comes with verified Kennel Club of India registration papers and documented lineage.',
  },
  {
    icon: <Stethoscope size={28} />,
    title: 'Vet Certified',
    description: 'Complete health checkup, age-appropriate vaccinations, and deworming before every puppy goes home.',
  },
  {
    icon: <Award size={28} />,
    title: 'Champion Bloodlines',
    description: 'Our breeding stock includes KCI show champions with proven temperament and health clearances.',
  },
  {
    icon: <Home size={28} />,
    title: 'Home Raised',
    description: 'Puppies are raised in our family home — not a kennel. Better socialization, calmer temperament.',
  },
  {
    icon: <Heart size={28} />,
    title: 'Health Guarantee',
    description: 'Comprehensive health guarantee with every puppy. We stand behind the health of our puppies 100%.',
  },
  {
    icon: <MessageCircle size={28} />,
    title: 'Lifetime Support',
    description: 'Diet plans, training tips, vet referrals — we are here for you through every stage of your dog\'s life.',
  },
];

function FeatureCard({ feature }: { feature: typeof features[number] }) {
  return (
    <GlassCard variant="solid" className="p-6 h-full border-emerald-100/50">
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-100/50 flex items-center justify-center text-emerald-600 mb-4">
          {feature.icon}
        </div>
        <h3 className="heading-card text-emerald-950 mb-2">{feature.title}</h3>
        <p className="text-sm text-emerald-800/70 leading-relaxed">
          {feature.description}
        </p>
      </div>
    </GlassCard>
  );
}

export default function WhyChooseUs() {
  return (
    <section className="py-20 lg:py-28 section-solid-emerald" id="why-choose-us">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Why Dogs Paradice?"
          subtitle="We are not just sellers — we are passionate breeders who treat every puppy as family."
        />

        {/* Mobile Carousel */}
        <MobileCarousel autoPlay autoPlayInterval={3500} itemWidth="large">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </MobileCarousel>

        {/* Desktop Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="hidden lg:grid lg:grid-cols-3 gap-6"
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
