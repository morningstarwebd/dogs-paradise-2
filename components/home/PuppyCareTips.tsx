'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import SectionHeading from '@/components/ui/SectionHeading';
import GlassCard from '@/components/ui/GlassCard';
import MobileCarousel from '@/components/ui/MobileCarousel';
import { fadeUpVariant } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { Utensils, Dumbbell, Scissors, Syringe, Brain } from 'lucide-react';

const careTabs = [
  {
    id: 'feeding',
    icon: <Utensils size={18} />,
    label: 'Feeding',
    title: 'Nutrition & Feeding Guide',
    tips: [
      { heading: 'Puppy Diet (2-6 months)', text: 'Feed 3-4 times daily with premium puppy food. Soak kibble in warm water for tiny breeds. Include calcium-rich supplements for large breed puppies.' },
      { heading: 'Adult Diet (6+ months)', text: 'Transition to twice-daily feeding. Mix dry kibble with boiled chicken, rice, and vegetables. Always keep fresh water available.' },
      { heading: 'Foods to Avoid', text: 'Never give chocolate, grapes, onions, garlic, xylitol, or cooked bones. These are toxic to dogs and can cause serious health issues.' },
    ],
    color: '#f59e0b',
  },
  {
    id: 'exercise',
    icon: <Dumbbell size={18} />,
    label: 'Exercise',
    title: 'Exercise & Activity',
    tips: [
      { heading: 'Puppy Exercise', text: 'Follow the 5-minute rule: 5 minutes of exercise per month of age, twice a day. Over-exercising growing puppies can damage developing joints.' },
      { heading: 'Daily Walks', text: 'Adult dogs need 30-60 minutes of daily exercise. Large breeds like Labs and Huskies need more. Small breeds like Shih Tzus need shorter, frequent walks.' },
      { heading: 'Mental Stimulation', text: 'Puzzle toys, snuffle mats, and training sessions keep your dog mentally sharp. A tired mind is as important as a tired body.' },
    ],
    color: '#22c55e',
  },
  {
    id: 'grooming',
    icon: <Scissors size={18} />,
    label: 'Grooming',
    title: 'Grooming Essentials',
    tips: [
      { heading: 'Coat Care', text: 'Brush daily for long-coated breeds (Shih Tzu, Pomeranian) and weekly for short coats. Use breed-appropriate brushes and detangling sprays.' },
      { heading: 'Bathing Schedule', text: 'Bathe every 2-4 weeks with veterinary-approved shampoo. Over-bathing strips natural oils. Always dry ears thoroughly to prevent infections.' },
      { heading: 'Nail & Ear Care', text: 'Trim nails every 2-3 weeks. Clean ears weekly with vet-approved solution. Check for ticks and parasites during grooming sessions.' },
    ],
    color: '#a855f7',
  },
  {
    id: 'health',
    icon: <Syringe size={18} />,
    label: 'Health',
    title: 'Health & Vaccination',
    tips: [
      { heading: 'Vaccination Schedule', text: 'DHPPi at 6, 8, 12, 16 weeks. Anti-rabies at 12 weeks. Annual boosters for DHPPi and Rabies. Keep vaccination card updated.' },
      { heading: 'Deworming', text: 'Deworm every 2 weeks until 12 weeks old, then monthly until 6 months, then every 3 months. Use broad-spectrum dewormers recommended by your vet.' },
      { heading: 'Emergency Signs', text: 'Seek immediate vet care for: persistent vomiting, bloody stool, difficulty breathing, seizures, sudden lethargy, or refusal to eat for 24+ hours.' },
    ],
    color: '#ef4444',
  },
  {
    id: 'training',
    icon: <Brain size={18} />,
    label: 'Training',
    title: 'Training & Behavior',
    tips: [
      { heading: 'Potty Training', text: 'Start from day one. Take puppy out every 2 hours, after meals, and after naps. Reward with treats for outdoor elimination. Never punish accidents.' },
      { heading: 'Basic Commands', text: 'Teach sit, stay, come, down, and leave it during the first 4 months. Use positive reinforcement — treats and praise. Keep sessions to 5-10 minutes.' },
      { heading: 'Socialization', text: 'Expose puppy to different people, dogs, sounds, and environments before 16 weeks. This critical socialization window shapes adult temperament.' },
    ],
    color: '#3b82f6',
  },
];

function TipCard({ tip, index, color }: { tip: { heading: string; text: string }; index: number; color: string }) {
  return (
    <GlassCard hover className="p-6 h-full group">
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-transform duration-300 group-hover:scale-110"
            style={{ background: `${color}15`, color }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-[var(--color-border)] to-transparent" />
        </div>
        <h4 className="mb-2 text-sm font-display font-semibold text-[var(--text-primary)]">{tip.heading}</h4>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{tip.text}</p>
      </div>
    </GlassCard>
  );
}

export default function PuppyCareTips() {
  const [activeTab, setActiveTab] = useState(careTabs[0].id);
  const active = careTabs.find((t) => t.id === activeTab)!;

  return (
    <section className="section-shell" id="puppy-care">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Puppy Care Guide"
          subtitle="Expert tips from our team to help you raise a happy, healthy puppy."
        />

        <motion.div variants={fadeUpVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {/* Tab Bar — scrollable on mobile */}
          <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-8 pb-2">
            {careTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0 border',
                  activeTab === tab.id
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-white shadow-lg shadow-[var(--accent-primary)]/10'
                    : 'border-[var(--color-border)] bg-white/70 text-[var(--text-secondary)] hover:bg-white hover:text-[var(--text-primary)]'
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Mobile Carousel */}
              <MobileCarousel itemWidth="large" autoPlay autoPlayInterval={4500}>
                {active.tips.map((tip, i) => (
                  <TipCard key={tip.heading} tip={tip} index={i} color={active.color} />
                ))}
              </MobileCarousel>

              {/* Desktop Grid */}
              <div className="hidden lg:grid lg:grid-cols-3 gap-5">
                {active.tips.map((tip, i) => (
                  <motion.div
                    key={tip.heading}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <TipCard tip={tip} index={i} color={active.color} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
