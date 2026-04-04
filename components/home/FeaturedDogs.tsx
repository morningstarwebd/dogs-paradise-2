'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { dogs } from '@/data/dogs';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Pre-defined organic shapes for the spinning effect
const organicShapes = [
  // Shape 1
  [
    "60% 40% 30% 70% / 60% 30% 70% 40%",
    "30% 70% 70% 30% / 30% 30% 70% 70%",
    "60% 40% 30% 70% / 60% 30% 70% 40%"
  ],
  // Shape 2
  [
    "40% 60% 70% 30% / 40% 50% 60% 50%",
    "70% 30% 50% 50% / 30% 30% 70% 70%",
    "40% 60% 70% 30% / 40% 50% 60% 50%"
  ],
  // Shape 3
  [
    "70% 30% 50% 50% / 30% 30% 70% 70%",
    "30% 70% 70% 30% / 50% 40% 60% 50%",
    "70% 30% 50% 50% / 30% 30% 70% 70%"
  ],
  // Shape 4 
  [
    "50% 50% 20% 80% / 25% 80% 20% 75%",
    "60% 40% 30% 70% / 60% 30% 70% 40%",
    "50% 50% 20% 80% / 25% 80% 20% 75%"
  ],
  // Shape 5 (Perfect Circle Base with wobble)
  [
    "50% 50% 50% 50% / 50% 50% 50% 50%",
    "45% 55% 45% 55% / 55% 45% 55% 45%",
    "50% 50% 50% 50% / 50% 50% 50% 50%"
  ]
];

const bgColors = ['bg-[#ea728c]', 'bg-[#ea728c]', 'bg-[#302b63]', 'bg-[#ea728c]', 'bg-[#ea728c]', 'bg-[#302b63]'];

export default function FeaturedDogs() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  // Auto scroll effect
  useEffect(() => {
    if (!isAutoScrolling) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 160, behavior: 'smooth' });
        }
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [isAutoScrolling]);

  const stopAutoScroll = () => {
    setIsAutoScrolling(false);
  };

  const scroll = (direction: 'left' | 'right') => {
    stopAutoScroll();
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth'
      });
    }
  };

  // Sort breeds to put priority breeds first (matching the chat sequence)
  const priorityOrder = [
    'Toy Poodle', 'Maltipoo', 'Golden Retriever', 'Bichon Frise', 'Shih Tzu', 'Siberian Husky'
  ];

  const sortedDogs = [...dogs].sort((a, b) => {
    const aIndex = priorityOrder.indexOf(a.breedName);
    const bIndex = priorityOrder.indexOf(b.breedName);
    if (aIndex > -1 && bIndex > -1) return aIndex - bIndex;
    if (aIndex > -1) return -1;
    if (bIndex > -1) return 1;
    return 0;
  });

  return (
    <section className="pt-12 pb-8" style={{ backgroundColor: '#302b63' }} id="featured-dogs">
      {/* Header Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 flex items-center justify-between">
        <h2 className="font-display text-whitexl lg:text-whitexl font-bold text-[#FFF0D9]">
          Explore Breeds
        </h2>

        <div className="flex items-center gap-4 sm:gap-6">
          {/* Desktop Left/Right Arrows */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full bg-white/60 hover:bg-white text-[#ea728c] transition-all shadow-sm focus:outline-none hover:scale-105"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-white/60 hover:bg-white text-[#ea728c] transition-all shadow-sm focus:outline-none hover:scale-105"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <Link
            href="/breeds"
            className="text-sm font-semibold text-[#ea728c] hover:text-[#ea728c] transition-colors border-b-2 border-transparent hover:border-[#ea728c] pb-0.5"
          >
            View All &rarr;
          </Link>
        </div>
      </div>

      {/* Category Filter / Breed List */}
      <div
        ref={scrollRef}
        onTouchStart={stopAutoScroll}
        onMouseDown={stopAutoScroll}
        className="max-w-7xl mx-auto flex gap-4 sm:gap-6 overflow-x-auto hide-scrollbar px-4 sm:px-6 lg:px-8 w-full snap-x snap-mandatory pt-2 pb-6"
      >

        {/* 'ALL' Button */}
        <Link
          href="/breeds"
          className="flex flex-col items-center gap-3 shrink-0 snap-start group relative outline-none"
          onClick={stopAutoScroll}
        >
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 transition-all duration-300 p-0.5 group-hover:scale-105">
            {/* Background Base */}
            <motion.div
              className="absolute inset-0 bg-[#dcfce7] shadow-sm rounded-2xl"
            />
            {/* Image Box */}
            <motion.div
              className="relative w-full h-full overflow-hidden shadow-sm bg-white p-2 rounded-2xl"
            >
              <div className="w-full h-full rounded-2xl bg-orange-100 flex items-center justify-center border-2 border-orange-200">
                <span className="font-black text-orange-600 text-sm">ALL</span>
              </div>
            </motion.div>
          </div>
          <span className="text-[14px] sm:text-[15px] font-bold text-[#FFF0D9] group-hover:text-[#ea728c] transition-colors">
            All
          </span>
        </Link>

        {/* 25 Breeds */}
        {sortedDogs.map((dog, index) => {
          const shapeAnim = organicShapes[index % organicShapes.length];
          const bgColor = bgColors[index % bgColors.length];

          return (
            <Link
              key={dog.id}
              href={`/breeds/${dog.slug}`}
              className="flex flex-col items-center gap-3 shrink-0 snap-start group relative outline-none"
              onClick={stopAutoScroll}
            >
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 transition-all duration-300 p-0.5 group-hover:scale-105">
                {/* Background Base */}
                <motion.div
                  className={cn('absolute inset-0 shadow-sm opacity-100 transition-opacity rounded-2xl', bgColor)}
                />

                {/* Image Box */}
                <motion.div
                  className="relative w-full h-full overflow-hidden shadow-sm bg-white rounded-2xl"
                >
                  <Image
                    src={dog.thumbnailImage}
                    alt={dog.breedName}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </motion.div>
              </div>

              {/* Category Name */}
              <span className="text-[13px] sm:text-sm font-semibold text-[#FFF0D9]/80 group-hover:text-white transition-colors">
                {dog.breedName.replace(' Retriever', '').replace(' Spaniel', '')}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
