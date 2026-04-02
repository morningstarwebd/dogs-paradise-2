'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import SectionHeading from '@/components/ui/SectionHeading';
import MobileCarousel from '@/components/ui/MobileCarousel';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';
import { dogs } from '@/data/dogs';
import { formatPrice, cn } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';

const featuredDogsList = dogs.filter((d) => (d as any).featured);
const flipDogs = (featuredDogsList.length > 0 ? featuredDogsList : dogs).slice(0, 6);

export default function FlipCardGallery() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-purple-500/[0.04] to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          title="Flip & Discover"
          subtitle="Tap on any card to reveal detailed breed information — like turning a page."
        />

        {/* Mobile Carousel */}
        <MobileCarousel autoPlay autoPlayInterval={4000} itemWidth="large">
          {flipDogs.map((dog, i) => (
            <FlipCard key={dog.id} dog={dog} index={i} />
          ))}
        </MobileCarousel>

        {/* Desktop Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="hidden lg:grid lg:grid-cols-3 gap-8"
        >
          {flipDogs.map((dog, i) => (
            <motion.div key={dog.id} variants={fadeUpVariant}>
              <FlipCard dog={dog} index={i} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FlipCard({ dog, index }: { dog: typeof flipDogs[number]; index: number }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={cn(
        "relative w-full h-[400px] cursor-pointer group",
        flipped ? "z-50" : "z-0 hover:z-20"
      )}
      style={{ perspective: '1000px' }}
      onClick={() => setFlipped(!flipped)}
      onKeyDown={(e) => e.key === 'Enter' && setFlipped(!flipped)}
      tabIndex={0}
      role="button"
      aria-label={`Flip card for ${dog.breedName}`}
    >
      <div
        className="w-full h-full transition-transform duration-700 relative"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front Face */}
        <div
          className="!absolute inset-0 w-full h-full glass-card overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={dog.thumbnailImage}
              alt={dog.breedName}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
              <div className="mb-2"><Badge status={dog.status} /></div>
              <h3 className="text-xl font-display font-bold text-white mb-1">{dog.breedName}</h3>
              <p className="text-sm text-white/60">{dog.age} · {dog.gender === 'male' ? '♂' : '♀'}</p>
              <div className="mt-3">
                <span className="text-xs text-white/40 border border-white/10 rounded-full px-3 py-1">
                  Tap to flip →
                </span>
              </div>
            </div>

            <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden z-20">
              <div className="absolute -top-[1px] -right-[1px] w-[45px] h-[45px] bg-gradient-to-bl from-white/10 to-white/5 rotate-45 translate-x-[16px] -translate-y-[16px] shadow-lg border-b border-l border-white/10" />
            </div>
          </div>
        </div>

        {/* Back Face */}
        <div
          className="!absolute inset-0 w-full h-full glass-card-static overflow-hidden p-6 flex flex-col"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="relative z-10 flex flex-col flex-1 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-display font-bold text-gradient">{dog.breedName}</h3>
              <Badge status={dog.status} />
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4 line-clamp-3">
              {dog.description}
            </p>
            <div className="grid grid-cols-2 gap-3 mb-4 flex-1">
              <InfoItem label="Size" value={dog.characteristics.size} />
              <InfoItem label="Energy" value={dog.characteristics.energyLevel.replace('_', ' ')} />
              <InfoItem label="Good w/ Kids" value={dog.characteristics.goodWithKids ? '✓ Yes' : '✗ No'} />
              <InfoItem label="Apartment" value={dog.characteristics.apartmentFriendly ? '✓ Yes' : '✗ No'} />
              <InfoItem label="Grooming" value={dog.characteristics.grooming} />
              <InfoItem label="Lifespan" value={dog.characteristics.lifespan} />
            </div>
            <div className="mt-auto pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
              <span className="text-xl font-bold text-gradient">{formatPrice(dog.price)}</span>
              <Link
                href={`/breeds/${dog.slug}`}
                className="glass-btn px-4 py-2 text-xs font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                View Details →
              </Link>
            </div>
            <span className="text-[10px] text-[var(--text-tertiary)] mt-3 text-center">Tap to flip back</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider">{label}</p>
      <p className="text-xs font-medium capitalize">{value}</p>
    </div>
  );
}
