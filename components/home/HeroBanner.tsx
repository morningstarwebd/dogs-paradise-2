'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { heroSlides } from '@/data/hero-slides';
import { cn } from '@/lib/utils';

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % heroSlides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = heroSlides[current];

  return (
    <section className="relative h-[100vh] min-h-[600px] max-h-[1000px] overflow-hidden" aria-label="Hero Banner">
      {/* Background Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <Image
            src={slide.imagePath}
            alt={slide.heading}
            fill
            className="object-cover"
            priority={current === 0}
            sizes="100vw"
          />
          {/* Premium photographic vignette instead of smoky light overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-end pb-24 sm:pb-32 lg:items-center lg:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id + '-text'}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl"
            >
              <span className="label-badge inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white mb-6 backdrop-blur-sm">
                {slide.eyebrow}
              </span>
              <h1 className="heading-hero text-white mb-6 drop-shadow-lg">
                {slide.heading}
              </h1>
              <p className="text-lg sm:text-xl text-white/90 leading-relaxed mb-8 max-w-xl drop-shadow-md">
                {slide.subheading}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href={slide.ctaHref}
                  className="glass-btn px-8 py-4 text-base font-medium"
                >
                  {slide.ctaLabel}
                </Link>
                <Link
                  href="/contact"
                  className="whatsapp-btn px-8 py-4 text-base font-medium flex items-center gap-2"
                >
                  💬 WhatsApp Us
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Dot Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              'transition-all duration-300 rounded-full',
              i === current
                ? 'w-8 h-2 bg-white'
                : 'w-2 h-2 bg-white/30 hover:bg-white/50'
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
