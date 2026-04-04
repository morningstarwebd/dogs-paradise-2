'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { dogs } from '@/data/dogs';
import { ArrowRight, ChevronLeft, ChevronRight, Star, Heart } from 'lucide-react';

// Priority breeds first, then the rest
const priorityBreedNames = [
  'Toy Poodle', 'Maltipoo', 'Golden Retriever', 'Bichon Frise', 'Shih Tzu', 'Siberian Husky'
];

const allSortedDogs = [...dogs].sort((a, b) => {
  const aIdx = priorityBreedNames.indexOf(a.breedName);
  const bIdx = priorityBreedNames.indexOf(b.breedName);
  if (aIdx > -1 && bIdx > -1) return aIdx - bIdx;
  if (aIdx > -1) return -1;
  if (bIdx > -1) return 1;
  return 0;
});

// Different organic blob shapes (same style as HeroBanner)
const blobShapes = [
  [
    "60% 40% 30% 70% / 60% 30% 70% 40%",
    "30% 70% 70% 30% / 30% 30% 70% 70%",
    "60% 40% 30% 70% / 60% 30% 70% 40%"
  ],
  [
    "40% 60% 70% 30% / 40% 50% 60% 50%",
    "70% 30% 50% 50% / 30% 30% 70% 70%",
    "40% 60% 70% 30% / 40% 50% 60% 50%"
  ],
  [
    "70% 30% 50% 50% / 30% 30% 70% 70%",
    "30% 70% 70% 30% / 50% 40% 60% 50%",
    "70% 30% 50% 50% / 30% 30% 70% 70%"
  ],
  [
    "50% 50% 20% 80% / 25% 80% 20% 75%",
    "60% 40% 30% 70% / 60% 30% 70% 40%",
    "50% 50% 20% 80% / 25% 80% 20% 75%"
  ],
  [
    "55% 45% 40% 60% / 35% 65% 45% 55%",
    "45% 55% 60% 40% / 55% 35% 65% 35%",
    "55% 45% 40% 60% / 35% 65% 45% 55%"
  ],
  [
    "35% 65% 55% 45% / 65% 40% 55% 60%",
    "65% 35% 40% 60% / 40% 60% 40% 60%",
    "35% 65% 55% 45% / 65% 40% 55% 60%"
  ],
];

export default function BreedExplorer() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      return () => el.removeEventListener('scroll', checkScroll);
    }
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      scrollRef.current.scrollBy({
        left: dir === 'left' ? -clientWidth * 0.8 : clientWidth * 0.8,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="relative overflow-hidden pt-6 pb-16 sm:pt-10 sm:pb-24" id="breed-explorer" style={{ backgroundColor: '#302b63' }}>
      {/* Background Decorative Blobs */}
      <div className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none">
        {/* Bottom-left pink blob — original correct shape */}
        <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 md:w-[500px] md:h-[500px] bg-[#ea728c] rounded-full rounded-tr-[80px] sm:rounded-tr-[100px] md:rounded-tr-[200px]" />

        {/* Top-right pink blob — exact mirror of bottom-left */}
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 md:w-[500px] md:h-[500px] bg-[#ea728c] rounded-full rounded-bl-[80px] sm:rounded-bl-[100px] md:rounded-bl-[200px]" />

        {/* Yellow decorative outline — bottom-left */}
        <div className="absolute -bottom-8 -left-8 sm:-bottom-[16px] sm:-left-[16px] md:-bottom-[25px] md:-left-[25px] w-[208px] h-[208px] sm:w-[288px] sm:h-[288px] md:w-[550px] md:h-[550px] border-[3px] sm:border-[4px] border-[#f5c842] rounded-full rounded-tr-[80px] sm:rounded-tr-[100px] md:rounded-tr-[200px] opacity-80" />

        {/* Yellow decorative outline — top-right (mirror) */}
        <div className="absolute -top-8 -right-8 sm:-top-[16px] sm:-right-[16px] md:-top-[25px] md:-right-[25px] w-[208px] h-[208px] sm:w-[288px] sm:h-[288px] md:w-[550px] md:h-[550px] border-[3px] sm:border-[4px] border-[#f5c842] rounded-full rounded-bl-[80px] sm:rounded-bl-[100px] md:rounded-bl-[200px] opacity-80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between mb-12 sm:mb-16">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-between gap-3 mb-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-[2px] bg-[#ea728c]" />
                <span className="text-[#ea728c] font-bold text-xs sm:text-sm uppercase tracking-[0.2em]">
                  Most Requested
                </span>
              </div>

              {/* View All - MOBILE ONLY (shown next to label) */}
              <Link
                href="/breeds"
                className="lg:hidden text-sm font-bold text-[#ea728c] hover:text-[#ea728c] transition-all flex items-center gap-1 group/link"
              >
                <span className="border-b-2 border-transparent group-hover/link:border-[#ea728c] pb-0.5 transition-all">
                  View All
                </span>
                <ArrowRight size={14} className="transition-transform group-hover/link:translate-x-1" />
              </Link>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FFF0D9] leading-tight"
            >
              Top Selling <span className="text-[#ea728c]">Dogs</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-[#FFF0D9]/80 text-sm sm:text-base max-w-lg font-medium"
            >
              Our most loved breeds, handpicked by families across Bangalore and beyond.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-4"
          >
            {/* Desktop-only Navigation (redundant due to mobile arrows but good for desktop) */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={cn(
                  "p-2.5 rounded-full border-2 transition-all duration-200",
                  canScrollLeft
                    ? "border-[#ea728c]/30 text-[#ea728c] hover:bg-[#ea728c] hover:text-white hover:border-[#ea728c]"
                    : "border-[#FFF0D9]/30 text-[#FFF0D9]/50 cursor-default"
                )}
                aria-label="Scroll left"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={cn(
                  "p-2.5 rounded-full border-2 transition-all duration-200",
                  canScrollRight
                    ? "border-[#ea728c]/30 text-[#ea728c] hover:bg-[#ea728c] hover:text-white hover:border-[#ea728c]"
                    : "border-[#FFF0D9]/30 text-[#FFF0D9]/50 cursor-default"
                )}
                aria-label="Scroll right"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* View All - DESKTOP ONLY (Original right position) */}
            <Link
              href="/breeds"
              className="hidden lg:flex text-sm font-bold text-[#ea728c] hover:text-[#ea728c] transition-all items-center gap-2 group/link-desktop"
            >
              <span className="border-b-2 border-transparent group-hover/link-desktop:border-[#ea728c] pb-0.5 transition-all">
                View All
              </span>
              <ArrowRight size={16} className="transition-transform group-hover/link-desktop:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* The Carousel Container */}
        <div className="relative group/carousel">

          {/* UNIQUE MOBILE NAVIGATION ARROWS - Pinned to the edges of the visible card area */}
          <div className="lg:hidden pointer-events-none absolute inset-y-0 inset-x-[-14px] z-30 flex items-center justify-between px-2">
            <AnimatePresence>
              {canScrollLeft && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => scroll('left')}
                  className="pointer-events-auto p-2 rounded-full bg-white/60 border border-white/80 backdrop-blur-md text-[#ea728c] shadow-lg ml-1"
                >
                  <ChevronLeft size={22} />
                </motion.button>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {canScrollRight && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => scroll('right')}
                  className="pointer-events-auto p-2 rounded-full bg-white/60 border border-white/80 backdrop-blur-md text-[#ea728c] shadow-lg mr-1"
                >
                  <ChevronRight size={22} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Cards Row */}
          <div
            ref={scrollRef}
            className="flex gap-6 sm:gap-8 overflow-x-auto hide-scrollbar pb-10 snap-x snap-mandatory -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0"
          >
            {allSortedDogs.map((dog, index) => (
              <motion.div
                key={dog.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ delay: Math.min(index * 0.1, 0.4), duration: 0.6 }}
                className="shrink-0 w-[280px] sm:w-[320px] lg:w-[calc(33.333%-22px)] snap-start"
              >
                <BreedCard dog={dog} index={index} />
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

function BreedCard({ dog, index }: { dog: typeof dogs[number]; index: number }) {
  const shape = blobShapes[index % blobShapes.length];
  const isPriority = priorityBreedNames.includes(dog.breedName);

  return (
    <Link href={`/breeds/${dog.slug}`} className="block group">
      <div className="flex flex-col items-center">
        {/* Fixed Round-Square Image */}
        <div className="relative w-full aspect-[3/4]">
          {/* Soft-square container */}
          <motion.div
            className="absolute inset-0 rounded-3xl overflow-hidden border-[6px] border-white bg-[#FFF0D9] shadow-xl group-hover:shadow-2xl transition-all duration-500"
          >
            {/* Image */}
            <Image
              src={dog.thumbnailImage}
              alt={dog.breedName}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 280px, 320px"
            />

            {/* Subtle bottom gradient gradient for general depth */}
            <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-10" />

            {/* Best Seller Badge - Re-styled & repositioned inside top */}
            {isPriority && (
              <div className="absolute top-[12%] left-[10%] z-20">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#ea728c] px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-white shadow-lg border border-white/20">
                  <Star size={9} className="fill-white" />
                  Best Seller
                </span>
              </div>
            )}

            {/* MODERN FLOATING INFO CARD */}
            <div className="absolute bottom-[10%] left-[10%] right-[10%] z-30">
              <motion.div
                className="w-full bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-4 shadow-2xl flex flex-col items-center text-center transition-colors duration-300"
              >
                <h3 className="font-display text-lg sm:text-xl font-black text-[#302b63] italic leading-none mb-1">
                  {dog.breedName}
                </h3>

                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-[#302b63]/70">
                  <span>{dog.gender === 'male' ? 'Male' : 'Female'}</span>
                  <div className="w-1 h-1 rounded-full bg-[#ea728c]" />
                  <span className="flex items-center gap-1">
                    <Heart size={10} className="fill-[#ea728c] text-[#ea728c]" />
                    Certified
                  </span>
                </div>
              </motion.div>
            </div>

          </motion.div>
        </div>
      </div>
    </Link>
  );
}
