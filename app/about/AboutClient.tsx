'use client';

import { motion } from 'motion/react';
import {
  Award,
  Calendar,
  Heart,
  MapPin,
  Shield,
  Users,
} from 'lucide-react';
import CallToAction from '@/components/home/CallToAction';
import GlassCard from '@/components/ui/GlassCard';
import SectionHeading from '@/components/ui/SectionHeading';
import { siteConfig } from '@/data/site-config';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';

const stats = [
  { value: '500+', label: 'Happy Families', icon: <Users size={20} /> },
  { value: '20+', label: 'Breeds Available', icon: <Award size={20} /> },
  { value: '6+', label: 'Years Experience', icon: <Calendar size={20} /> },
  { value: '100%', label: 'Health-First Care', icon: <Shield size={20} /> },
];

const values = [
  {
    icon: <Heart size={28} />,
    title: 'Love First',
    description:
      'Every puppy is raised in a home environment with patient handling, socialization, and daily care routines.',
  },
  {
    icon: <Shield size={28} />,
    title: 'Health Always',
    description:
      'We focus on clean health records, vaccinations, vet checks, and clear communication about documentation before booking.',
  },
  {
    icon: <Award size={28} />,
    title: 'Quality Over Quantity',
    description:
      'We keep each litter manageable so every puppy receives proper attention, feeding support, and temperament care.',
  },
];

export default function AboutClient() {
  return (
    <div className="pb-0 pt-24">
      <section className="section-shell">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-3xl text-center"
          >
            <span className="label-badge mb-6 inline-block rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-[var(--text-secondary)]">
              Our Story
            </span>
            <h1 className="heading-hero mb-6 text-gradient">
              Raising Happy Puppies With Honest Guidance
            </h1>
            <p className="text-lg leading-relaxed text-[var(--text-secondary)]">
              {siteConfig.brandName} was built around one idea: families deserve
              healthy, well-cared-for puppies, and they deserve transparent
              information before making a decision. We have been helping puppy
              parents across Bengaluru with a calm, home-raised approach since
              2018.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-shell-tight bg-[var(--color-surface)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6"
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={fadeUpVariant}>
                <GlassCard hover={false} className="p-5 text-center sm:p-6">
                  <div className="relative z-10">
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
                      {stat.icon}
                    </div>
                    <p className="mb-1 text-2xl font-bold text-gradient sm:text-3xl">
                      {stat.value}
                    </p>
                    <p className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
                      {stat.label}
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="section-shell">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
            <motion.div
              variants={fadeUpVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="heading-section mb-6 text-gradient">
                How It All Started
              </h2>
              <div className="space-y-4 leading-relaxed text-[var(--text-secondary)]">
                <p>
                  We started with a simple love for family dogs and quickly
                  realized how many buyers were getting rushed into poor
                  decisions without proper health information.
                </p>
                <p>
                  That is why our process is built around honest conversations,
                  careful litter planning, and sharing the real details of each
                  puppy instead of one-size-fits-all promises.
                </p>
                <p>
                  Some puppies are available with KCI registration, while others
                  are offered as healthy companion puppies. We make that clear
                  before any booking so families can choose with confidence.
                </p>
                <p>
                  Today our goal is still the same: healthy puppies, happy
                  families, and support that continues after pickup day.
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={fadeUpVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              <GlassCard hover={false} variant="solid" className="p-6 sm:p-8">
                <div className="relative z-10">
                  <h3 className="heading-card mb-6 text-[var(--text-primary)]">
                    Visit Our Facility
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                      <MapPin
                        size={18}
                        className="mt-0.5 shrink-0 text-[var(--accent-primary)]"
                      />
                      <div>
                        <p className="font-medium text-[var(--text-primary)]">
                          Location
                        </p>
                        <p>
                          {siteConfig.address}, {siteConfig.city},{' '}
                          {siteConfig.state}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                      <Calendar
                        size={18}
                        className="mt-0.5 shrink-0 text-[var(--accent-primary)]"
                      />
                      <div>
                        <p className="font-medium text-[var(--text-primary)]">
                          Visiting Hours
                        </p>
                        {siteConfig.businessHours.map((item) => (
                          <p key={item.days}>
                            {item.days}: {item.hours}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="mt-6 text-xs text-[var(--text-tertiary)]">
                    We recommend visiting in person so you can understand the
                    puppy&apos;s temperament, health notes, and documentation
                    before you decide.
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-shell bg-[var(--color-surface)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Our Values"
            subtitle="What guides everything we do at Dogs Paradise Bangalore."
          />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-3"
          >
            {values.map((value) => (
              <motion.div key={value.title} variants={fadeUpVariant}>
                <GlassCard hover={false} variant="solid" className="h-full p-6">
                  <div className="relative z-10">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
                      {value.icon}
                    </div>
                    <h3 className="heading-card mb-2 text-[var(--text-primary)]">
                      {value.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                      {value.description}
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <CallToAction />
    </div>
  );
}
