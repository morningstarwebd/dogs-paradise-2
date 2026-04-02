'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import SectionHeading from '@/components/ui/SectionHeading';
import GlassCard from '@/components/ui/GlassCard';
import { fadeUpVariant } from '@/lib/animations';
import { dogs } from '@/data/dogs';
import { formatPrice, cn } from '@/lib/utils';
import { Check, X, ArrowLeftRight } from 'lucide-react';
import Link from 'next/link';

const compareDogs = dogs.filter((d) => d.featured).slice(0, 6);

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'traits', label: 'Traits' },
  { id: 'health', label: 'Health' },
  { id: 'lifestyle', label: 'Lifestyle' },
];

export default function BreedComparison() {
  const [leftIdx, setLeftIdx] = useState(0);
  const [rightIdx, setRightIdx] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');

  const left = compareDogs[leftIdx];
  const right = compareDogs[rightIdx];

  return (
    <section className="py-20 lg:py-28 bg-[var(--color-surface)]" id="breed-comparison">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Compare Breeds"
          subtitle="Choose two breeds and compare them side by side across different categories."
        />

        {/* Breed Selectors */}
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
        >
          <BreedSelector
            dogs={compareDogs}
            selected={leftIdx}
            onChange={setLeftIdx}
            exclude={rightIdx}
            label="First Breed"
          />
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 shrink-0">
            <ArrowLeftRight size={16} />
          </div>
          <BreedSelector
            dogs={compareDogs}
            selected={rightIdx}
            onChange={setRightIdx}
            exclude={leftIdx}
            label="Second Breed"
          />
        </motion.div>

        {/* Tabs */}
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex bg-white/5 rounded-full p-1 border border-[var(--color-border)]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200',
                  activeTab === tab.id
                    ? 'bg-white text-black'
                    : 'text-[var(--text-secondary)] hover:text-white'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Comparison Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${left.id}-${right.id}-${activeTab}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <ComparisonCard dog={left} tab={activeTab} side="left" />
            <ComparisonCard dog={right} tab={activeTab} side="right" />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function BreedSelector({
  dogs: breedList,
  selected,
  onChange,
  exclude,
  label,
}: {
  dogs: typeof compareDogs;
  selected: number;
  onChange: (idx: number) => void;
  exclude: number;
  label: string;
}) {
  return (
    <div className="flex-1 w-full sm:max-w-xs">
      <label className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider block mb-1.5 text-center">
        {label}
      </label>
      <select
        value={selected}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full bg-white/5 border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30"
      >
        {breedList.map((dog, i) => (
          <option key={dog.id} value={i} disabled={i === exclude} className="bg-[var(--color-surface)]">
            {dog.breedName}
          </option>
        ))}
      </select>
    </div>
  );
}

function ComparisonCard({ dog, tab, side }: { dog: typeof compareDogs[number]; tab: string; side: string }) {
  return (
    <GlassCard hover={false} className="p-0 overflow-hidden">
      <div className="relative z-10">
        {/* Header with image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={dog.thumbnailImage}
            alt={dog.breedName}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-lg font-display font-bold text-white">{dog.breedName}</h3>
            <p className="text-sm text-white/60">{formatPrice(dog.price)} · {dog.age}</p>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-5">
          {tab === 'overview' && (
            <div className="space-y-3">
              <CompRow label="Size" value={dog.characteristics.size} />
              <CompRow label="Weight" value={dog.characteristics.weight} />
              <CompRow label="Height" value={dog.characteristics.height} />
              <CompRow label="Lifespan" value={dog.characteristics.lifespan} />
              <CompRow label="Coat" value={dog.characteristics.coatLength} />
              <CompRow label="Energy" value={dog.characteristics.energyLevel.replace('_', ' ')} />
            </div>
          )}
          {tab === 'traits' && (
            <div className="space-y-3">
              <CompRow label="Training" value={dog.characteristics.trainingDifficulty} />
              <CompRow label="Grooming" value={dog.characteristics.grooming} />
              <CompBool label="Good with Kids" value={dog.characteristics.goodWithKids} />
              <CompBool label="Good with Pets" value={dog.characteristics.goodWithPets} />
              <CompBool label="Apartment Friendly" value={dog.characteristics.apartmentFriendly} />
            </div>
          )}
          {tab === 'health' && (
            <div className="space-y-3">
              <CompBool label="Vaccinated" value={dog.healthInfo.vaccinated} />
              <CompBool label="Dewormed" value={dog.healthInfo.dewormed} />
              <CompBool label="Vet Checked" value={dog.healthInfo.vetChecked} />
              <CompBool label="Microchipped" value={dog.healthInfo.microchipped} />
              <CompBool label="KCI Registered" value={dog.healthInfo.kciRegistered} />
              <CompBool label="Parents Certified" value={dog.healthInfo.parentsCertified} />
            </div>
          )}
          {tab === 'lifestyle' && (
            <div className="space-y-4">
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-4">
                {dog.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {dog.tags.map((tag) => (
                  <span key={tag} className="text-[10px] border border-[var(--color-border)] rounded-full px-2 py-0.5 text-[var(--text-tertiary)]">
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href={`/breeds/${dog.slug}`}
                className="glass-btn px-4 py-2 text-xs font-medium inline-flex items-center gap-1"
              >
                View Full Profile →
              </Link>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
}

function CompRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-[var(--color-border)] last:border-0">
      <span className="text-xs text-[var(--text-tertiary)]">{label}</span>
      <span className="text-sm font-medium capitalize">{value}</span>
    </div>
  );
}

function CompBool({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-[var(--color-border)] last:border-0">
      <span className="text-xs text-[var(--text-tertiary)]">{label}</span>
      <span className={cn('flex items-center gap-1 text-sm', value ? 'text-green-400' : 'text-red-400/60')}>
        {value ? <Check size={14} /> : <X size={14} />}
        {value ? 'Yes' : 'No'}
      </span>
    </div>
  );
}
