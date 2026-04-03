'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import SectionHeading from '@/components/ui/SectionHeading';
import GlassCard from '@/components/ui/GlassCard';
import MobileCarousel from '@/components/ui/MobileCarousel';
import { testimonials } from '@/data/testimonials';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const getVisible = () => {
    const items = [];
    for (let i = 0; i < 3; i++) {
      items.push(testimonials[(current + i) % testimonials.length]);
    }
    return items;
  };

  return (
    <section className="py-20 lg:py-28 section-solid-rose" id="testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Happy Puppy Parents"
          subtitle="Don't just take our word for it — hear from families who found their perfect companion with us."
        />

        {/* Mobile — Snap carousel with dots + auto-scroll */}
        <MobileCarousel autoPlay autoPlayInterval={4000} itemWidth="large">
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </MobileCarousel>

        {/* Desktop — 3-card view */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6">
          {getVisible().map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex items-center justify-center gap-4 mt-8">
          <button onClick={prev} className="p-2.5 rounded-full border border-rose-200 bg-white shadow-sm hover:shadow-md transition-all text-rose-600" aria-label="Previous">
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-1.5">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  'rounded-full transition-all duration-300',
                  i === current ? 'bg-rose-500 w-6 h-2' : 'bg-rose-200 w-2 h-2'
                )}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
          <button onClick={next} className="p-2.5 rounded-full border border-rose-200 bg-white shadow-sm hover:shadow-md transition-all text-rose-600" aria-label="Next">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[number] }) {
  return (
    <GlassCard variant="solid" className="p-6 h-full flex flex-col border-rose-100/50">
      <div className="relative z-10 flex flex-col flex-1">
        {/* Stars */}
        <div className="flex gap-0.5 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={14}
              className={cn(
                i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'
              )}
            />
          ))}
        </div>

        {/* Text */}
        <p className="text-sm text-slate-600 leading-relaxed flex-1 mb-4">
          &ldquo;{testimonial.text}&rdquo;
        </p>

        {/* Author */}
        <div className="flex items-center gap-3 pt-4 border-t border-rose-50/50">
          <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-sm font-bold text-rose-600">
            {testimonial.authorName.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">{testimonial.authorName}</p>
            <p className="text-xs text-slate-500">
              {testimonial.location} · {testimonial.breedPurchased}
            </p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
