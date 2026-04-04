'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { testimonials } from '@/data/testimonials';
import { Star, ChevronLeft, ChevronRight, Heart, MapPin, Quote, ArrowRight, CheckCircle2, BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

// Smoother, rounder organic blob shapes — gentler curves that don't crop faces
const blobShapes = [
  ["48% 52% 45% 55% / 52% 48% 55% 45%", "52% 48% 55% 45% / 48% 52% 45% 55%", "48% 52% 45% 55% / 52% 48% 55% 45%"],
  ["45% 55% 50% 50% / 50% 45% 55% 50%", "55% 45% 45% 55% / 45% 55% 50% 50%", "45% 55% 50% 50% / 50% 45% 55% 50%"],
  ["50% 50% 45% 55% / 48% 52% 50% 50%", "47% 53% 52% 48% / 52% 48% 48% 52%", "50% 50% 45% 55% / 48% 52% 50% 50%"],
  ["52% 48% 48% 52% / 45% 55% 52% 48%", "48% 52% 52% 48% / 55% 45% 48% 52%", "52% 48% 48% 52% / 45% 55% 52% 48%"],
  ["46% 54% 52% 48% / 54% 46% 48% 52%", "54% 46% 48% 52% / 46% 54% 52% 48%", "46% 54% 52% 48% / 54% 46% 48% 52%"],
  ["50% 50% 47% 53% / 53% 47% 50% 50%", "53% 47% 50% 50% / 47% 53% 53% 47%", "50% 50% 47% 53% / 53% 47% 50% 50%"],
];

export default function HappyStories() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
      const card = scrollRef.current.querySelector('[data-card]');
      const cardWidth = card ? card.clientWidth + 24 : 300;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setActiveIndex(Math.min(newIndex, testimonials.length - 1));
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      scrollRef.current.scrollBy({
        left: dir === 'left' ? -clientWidth * 0.85 : clientWidth * 0.85,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      className="relative overflow-hidden pt-6 pb-16 sm:pt-10 sm:pb-24"
      id="happy-stories"
      style={{ backgroundColor: '#302b63' }}
    >
      {/* Background Decorative Blobs — same style as BreedExplorer */}
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
        {/* ━━━ Section Header — Same pattern as BreedExplorer ━━━ */}
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
                  Real Customer Reviews
                </span>
              </div>

              {/* View All - MOBILE ONLY */}
              <Link
                href="#flip-discover"
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
              className="font-display text-whitexl sm:text-4xl lg:text-whitexl font-bold text-[#FFF0D9] leading-tight"
            >
              Happy <span className="text-[#ea728c]">Stories</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-[#FFF0D9] text-sm sm:text-whitease max-w-lg font-medium"
            >
              Real families, real puppies, real love. Hear from our happy puppy parents across India.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-4"
          >
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={cn(
                  "p-2.5 rounded-2xl border-2 transition-all duration-200",
                  canScrollLeft
                    ? "border-[#ea728c]/30 text-[#ea728c] hover:bg-[#ea728c] hover:text-white hover:border-[#ea728c]"
                    : "border-[#c4a882]/30 text-[#c4a882] cursor-default"
                )}
                aria-label="Scroll left"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={cn(
                  "p-2.5 rounded-2xl border-2 transition-all duration-200",
                  canScrollRight
                    ? "border-[#ea728c]/30 text-[#ea728c] hover:bg-[#ea728c] hover:text-white hover:border-[#ea728c]"
                    : "border-[#c4a882]/30 text-[#c4a882] cursor-default"
                )}
                aria-label="Scroll right"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* View All - DESKTOP ONLY */}
            <Link
              href="#flip-discover"
              className="hidden lg:flex text-sm font-bold text-[#ea728c] hover:text-[#ea728c] transition-all items-center gap-2 group/link-desktop"
            >
              <span className="border-b-2 border-transparent group-hover/link-desktop:border-[#ea728c] pb-0.5 transition-all">
                View All
              </span>
              <ArrowRight size={16} className="transition-transform group-hover/link-desktop:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* ━━━ Cards Carousel ━━━ */}
        <div className="relative group/carousel">
          {/* Mobile Navigation Arrows */}
          <div className="lg:hidden pointer-events-none absolute inset-y-0 inset-x-[-14px] z-30 flex items-center justify-between px-2">
            <AnimatePresence>
              {canScrollLeft && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => scroll('left')}
                  className="pointer-events-auto p-2 rounded-2xl bg-white/60 border border-white/80 backdrop-blur-md text-[#ea728c] shadow-lg ml-1"
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
                  className="pointer-events-auto p-2 rounded-2xl bg-white/60 border border-white/80 backdrop-blur-md text-[#ea728c] shadow-lg mr-1"
                >
                  <ChevronRight size={22} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Scrollable Row */}
          <div
            ref={scrollRef}
            className="flex gap-6 sm:gap-10 overflow-x-auto hide-scrollbar pb-10 snap-x snap-mandatory -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                data-card
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ delay: Math.min(index * 0.08, 0.4), duration: 0.6 }}
                className="shrink-0 w-[340px] sm:w-[480px] lg:w-[calc(33.33%-20px)] snap-start px-4"
              >
                <StoryCard testimonial={testimonial} index={index} />
              </motion.div>
            ))}
          </div>

          {/* Progress Indicators (Mobile) */}
          <div className="flex justify-center gap-2 mt-4 lg:hidden">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (scrollRef.current) {
                    const card = scrollRef.current.querySelector('[data-card]');
                    const cardWidth = card ? card.clientWidth + 32 : 360;
                    scrollRef.current.scrollTo({
                      left: i * cardWidth,
                      behavior: 'smooth',
                    });
                  }
                }}
                className={cn(
                  "h-1.5 rounded-2xl transition-all duration-300",
                  activeIndex === i ? "w-8 bg-[#ea728c]" : "w-1.5 bg-[#ea728c]/20"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ━━━━━━━━━━ Story Card — Modern Editorial Bento ━━━━━━━━━━ */
function StoryCard({ testimonial, index }: { testimonial: typeof testimonials[number]; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Auras based on breed "personality" or just variety
  const auras = ['bg-[#ea728c]/15', 'bg-[#4caf50]/15', 'bg-[#ffa600]/15', 'bg-[#9333ea]/15'];
  const auraColor = auras[index % auras.length];

  const isLongText = testimonial.text.length > 120;

  return (
    <motion.div 
      className="flex flex-col items-center group relative mt-8"
      initial={false}
      whileHover={{ y: -8 }}
    >
      {/* ── Background Aura Glow ── */}
      <div className={cn(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-2xl blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0",
        auraColor
      )} />

      {/* ── Portrait Frame (4:5 Ratio) ── */}
      <div className="relative w-full aspect-[4/5] max-w-[420px] mx-auto z-10 isolate">
        
        {/* Main Image Container — High-end rounded corners */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl border-[10px] border-white shadow-[0_20px_50px_rgba(0,0,0,0.12)] bg-[#FFF0D9] transition-all duration-700 group-hover:shadow-[0_40px_80px_rgba(212,96,74,0.15)]">
          
          {/* Steady Portrait Image */}
          <div className="h-full w-full relative">
            <Image
              src={testimonial.avatarPath || ''}
              alt={testimonial.authorName}
              fill
              className="object-cover object-top"
              sizes="(max-width: 640px) 400px, 500px"
              quality={95}
            />
          </div>

          {/* ────── Internal Overlays (Glassmorphism) ────── */}

          {/* 1. Verification Badge — Top Left */}
          <div className="absolute top-6 left-6 z-20">
            <div className="bg-white/90 backdrop-blur-md shadow-[0_8px_20px_rgba(0,0,0,0.12)] rounded-2xl p-2.5 border border-white/50 animate-pulse-slow">
              <BadgeCheck size={22} className="text-[#0095f6] fill-white" />
            </div>
          </div>

          {/* 2. Rating — Top Right */}
          <div className="absolute top-6 right-6 z-20">
            <div className="bg-white/95 shadow-[0_8px_20px_rgba(0,0,0,0.12)] rounded-2xl px-3.5 py-2 flex items-center gap-1.5 border border-white">
              <Star size={14} className="fill-[#ffa600] text-[#ffa600]" />
              <span className="text-[15px] font-black text-[#FFF0D9]">{testimonial.rating}.0</span>
            </div>
          </div>

          {/* 3. Gradient Footer Overlays (Bottom corners) */}
          <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10 pointer-events-none" />
          
          {/* 3a. Name & Location — Bottom Left (Matches User Request) */}
          <div className="absolute bottom-6 left-6 z-20">
            <div className="flex flex-col items-start text-left translate-y-2">
              <span className="text-white text-xl font-black leading-tight tracking-tight drop-shadow-md">
                {testimonial.authorName}
              </span>
              <div className="flex items-center gap-1.5 mt-1.5 opacity-90 transition-opacity group-hover:opacity-100">
                 <MapPin size={10} className="text-[#ea728c]" />
                 <span className="text-white text-[10px] font-bold uppercase tracking-[0.25em]">{testimonial.location}</span>
              </div>
            </div>
          </div>

          {/* 3b. Breed — Bottom Right */}
          <div className="absolute bottom-6 right-6 z-20">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl px-3 py-1.5 border border-white/30 transition-transform group-hover:scale-105">
              <span className="text-[10px] font-black text-white uppercase tracking-wider drop-shadow-sm">
                {testimonial.breedPurchased}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── DESIGNED Review Text Section — BELOW Image ── */}
      <div className="mt-8 w-full px-8 text-center relative z-20">
        <motion.div 
          layout
          className="max-w-[340px] mx-auto text-center"
        >
          {/* Decorative Minimal Quote */}
          <div className="relative inline-block mb-3 opacity-100">
             <Quote size={24} className="text-[#ea728c]" fill="currentColor" />
          </div>

          {/* The Story Paragraph with Line-Clamp */}
          <motion.p 
            layout
            className={cn(
               "text-[15px] sm:text-[16px] leading-[1.75] text-[#FFF0D9] font-medium selection:bg-[#ea728c]/20 transition-all duration-300",
               !isExpanded && isLongText && "line-clamp-3 italic opacity-80"
            )}
          >
            "{testimonial.text}"
          </motion.p>

          {/* Interactive Toggle Button */}
          {isLongText && (
             <motion.button
               onClick={() => setIsExpanded(!isExpanded)}
               className="mt-4 text-[11px] font-black uppercase tracking-widest text-[#ea728c] hover:text-[#ea728c] transition-colors flex items-center gap-1.5 mx-auto py-1 px-4 rounded-2xl bg-[#ea728c]/5 hover:bg-[#ea728c]/10"
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
             >
               {isExpanded ? 'Close Story' : 'Read Full Story'}
               <motion.span 
                 animate={{ rotate: isExpanded ? 180 : 0 }}
                 className="inline-block"
               >
                 ↓
               </motion.span>
             </motion.button>
          )}

          <div className="w-8 h-[2px] bg-[#ea728c]/20 mx-auto mt-6 rounded-full" />
        </motion.div>
      </div>
    </motion.div>
  );
}

