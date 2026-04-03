'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import SectionHeading from '@/components/ui/SectionHeading';
import GlassCard from '@/components/ui/GlassCard';
import MobileCarousel from '@/components/ui/MobileCarousel';
import { fadeUpVariant } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { dogs } from '@/data/dogs';
import { formatPrice } from '@/lib/utils';
import { Dog, PawPrint, Shield, Home, Sparkles } from 'lucide-react';
import Link from 'next/link';

const exploreCategories = [
  { id: 'large', label: 'Large Breeds', icon: <Dog size={16} />, filter: 'large' },
  { id: 'small', label: 'Small & Toy', icon: <PawPrint size={16} />, filter: 'small' },
  { id: 'guard', label: 'Guard Dogs', icon: <Shield size={16} />, filter: 'guard-dogs' },
  { id: 'family', label: 'Family Dogs', icon: <Home size={16} />, filter: 'family-dogs' },
  { id: 'rare', label: 'Premium', icon: <Sparkles size={16} />, filter: 'premium' },
];

function filterDogs(filterId: string) {
  switch (filterId) {
    case 'large':
      return dogs.filter((d) => d.characteristics.size === 'large' || d.characteristics.size === 'giant');
    case 'small':
      return dogs.filter((d) => d.characteristics.size === 'small' || d.characteristics.size === 'toy');
    case 'guard-dogs':
      return dogs.filter((d) => d.categorySlug === 'guard-dogs');
    case 'family-dogs':
      return dogs.filter((d) => d.categorySlug === 'family-dogs');
    case 'premium':
      return dogs.filter((d) => (d.price ?? 0) >= 40000);
    default:
      return dogs;
  }
}

export default function BreedExplorer() {
  const [activeTab, setActiveTab] = useState(exploreCategories[0].id);
  const active = exploreCategories.find((c) => c.id === activeTab)!;
  const filteredDogs = filterDogs(active.filter).slice(0, 4);

  return (
    <section className="py-20 lg:py-28 section-amber" id="breed-explorer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Explore By Category"
          subtitle="Discover the perfect breed for your lifestyle. Switch between categories to find your ideal match."
        />

        {/* Tabs */}
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex justify-center mb-10"
        >
          <div className="inline-flex flex-wrap justify-center gap-2 sm:gap-0 sm:flex-nowrap sm:bg-white/5 sm:rounded-2xl sm:p-1.5 sm:border sm:border-[var(--color-border)]">
            {exploreCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200',
                  activeTab === cat.id
                    ? 'bg-white text-black shadow-lg'
                    : 'text-[var(--text-secondary)] hover:text-white hover:bg-white/5'
                )}
              >
                {cat.icon}
                <span className="hidden sm:inline">{cat.label}</span>
                <span className="sm:hidden">{cat.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {filteredDogs.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-6xl mb-3">🐕</p>
                <p className="text-[var(--text-secondary)]">No dogs in this category right now. Check back soon!</p>
              </div>
            ) : (
              <>
                {/* Mobile Carousel */}
                <MobileCarousel autoPlay autoPlayInterval={3500} itemWidth="large">
                  {filteredDogs.map((dog) => (
                    <ExplorerCard key={dog.id} dog={dog} />
                  ))}
                </MobileCarousel>

                {/* Desktop Grid */}
                <div className="hidden lg:grid lg:grid-cols-4 gap-5">
                  {filteredDogs.map((dog, i) => (
                    <motion.div
                      key={dog.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <ExplorerCard dog={dog} />
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function ExplorerCard({ dog }: { dog: typeof dogs[number] }) {
  return (
    <Link href={`/breeds/${dog.slug}`} className="block group">
      <GlassCard hover className="p-0 overflow-hidden">
        <div className="relative z-10">
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src={dog.thumbnailImage}
              alt={dog.breedName}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 85vw, (max-width: 1024px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="font-display font-bold text-white text-base mb-0.5">{dog.breedName}</h3>
              <p className="text-xs text-white/60 mb-2">
                {dog.age} · {dog.gender === 'male' ? '♂' : '♀'} · {dog.characteristics.size}
              </p>
              <div className="flex items-center justify-end mt-1">
                <span className="text-[10px] uppercase font-bold text-white/50 group-hover:text-white transition-colors tracking-wide bg-black/40 px-3 py-1.5 rounded-full border border-white/10">View Details →</span>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}

