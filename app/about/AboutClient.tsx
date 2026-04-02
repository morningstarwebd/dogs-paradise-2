'use client';

import { motion } from 'motion/react';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';
import GlassCard from '@/components/ui/GlassCard';
import SectionHeading from '@/components/ui/SectionHeading';
import CallToAction from '@/components/home/CallToAction';
import { Heart, Shield, Award, Users, MapPin, Calendar } from 'lucide-react';

const stats = [
  { value: '500+', label: 'Happy Families', icon: <Users size={20} /> },
  { value: '20+', label: 'Breeds Available', icon: <Award size={20} /> },
  { value: '6+', label: 'Years Experience', icon: <Calendar size={20} /> },
  { value: '100%', label: 'Health Guarantee', icon: <Shield size={20} /> },
];

const values = [
  {
    icon: <Heart size={28} />,
    title: 'Love First',
    description: 'Every puppy is raised in our home as a family member. We believe that puppies raised with love produce the happiest, most well-adjusted dogs.',
  },
  {
    icon: <Shield size={28} />,
    title: 'Health Always',
    description: 'We invest in comprehensive health testing for all breeding dogs. Every puppy receives age-appropriate vaccinations and vet checks before going home.',
  },
  {
    icon: <Award size={28} />,
    title: 'Quality Over Quantity',
    description: 'We are not a puppy mill. We raise small numbers of puppies at a time, ensuring each one gets the individual attention they deserve.',
  },
];

export default function AboutClient() {
  return (
    <div className="pt-24 pb-0">
      {/* Hero */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            animate="visible"
            className="max-w-3xl mx-auto text-center"
          >
            <span className="label-badge inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[var(--text-secondary)] mb-6">
              Our Story
            </span>
            <h1 className="heading-hero text-gradient mb-6">
              Raising Happiness, One Puppy At A Time
            </h1>
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
              Dogs Paradice was born from a simple belief: every family deserves a healthy, well-socialized puppy, and every puppy deserves a loving home. Based in Kolkata, West Bengal, we have been connecting premium puppies with wonderful families since 2018.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-[var(--color-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={fadeUpVariant}>
                <GlassCard hover={false} className="p-6 text-center">
                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3 text-white/60">
                      {stat.icon}
                    </div>
                    <p className="text-3xl font-bold text-gradient mb-1">{stat.value}</p>
                    <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">{stat.label}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={fadeUpVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="heading-section text-gradient mb-6">How It All Started</h2>
              <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
                <p>
                  It started with our first dog — a Golden Retriever named Max. The joy, love, and companionship he brought into our lives was transformative. We wanted to share that experience with others, but we noticed something troubling in the Indian pet industry.
                </p>
                <p>
                  Too many puppies were being sold from puppy mills — sick, poorly socialized, and with falsified documentation. Families were heartbroken when their new puppies fell ill within days of purchase.
                </p>
                <p>
                  We decided to do things differently. Dogs Paradice was founded on the principle that breeding should be a labor of love, not a factory operation. Every puppy we raise grows up in our home, plays in our garden, and is cared for as if it were our own.
                </p>
                <p>
                  Today, we are proud to have placed over 500 healthy, happy puppies with families across Kolkata and Eastern India. But for us, it&apos;s never been about the numbers — it&apos;s about the tail wags.
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={fadeUpVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-card-static p-8 rounded-2xl"
            >
              <div className="relative z-10">
                <h3 className="heading-card text-white mb-6">Visit Our Facility</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                    <MapPin size={18} className="shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-white">Location</p>
                      <p>123 Park Street, Near South City Mall, Kolkata, West Bengal</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                    <Calendar size={18} className="shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-white">Visiting Hours</p>
                      <p>Monday – Saturday: 10 AM – 7 PM<br />Sunday: By Appointment Only</p>
                    </div>
                  </div>
                </div>
                <p className="mt-6 text-xs text-[var(--text-tertiary)]">
                  We encourage all prospective puppy parents to visit our facility in person. Seeing where your puppy was raised gives you confidence in your decision.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-28 bg-[var(--color-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Our Values"
            subtitle="What guides everything we do at Dogs Paradice."
          />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {values.map((value) => (
              <motion.div key={value.title} variants={fadeUpVariant}>
                <GlassCard hover={false} className="p-6 h-full">
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 mb-4">
                      {value.icon}
                    </div>
                    <h3 className="heading-card text-white mb-2">{value.title}</h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <CallToAction />
    </div>
  );
}
