'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { fadeUpVariant } from '@/lib/animations';
import { PawPrint } from 'lucide-react';

const marqueeTexts = [
  'KCI Registered',
  'Vaccinated & Dewormed',
  'Champion Bloodlines',
  'Health Guaranteed',
  'Home Raised',
  'Lifetime Support',
  'Vet Certified',
  '500+ Happy Families',
  'Pan India Delivery',
  'Video Call Available',
];

export default function MarqueeBanner() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']);

  return (
    <section
      ref={containerRef}
      className="py-6 border-y border-[var(--color-border)] overflow-hidden relative"
    >
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[var(--color-bg)] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[var(--color-bg)] to-transparent z-10 pointer-events-none" />

      <motion.div style={{ x }} className="flex items-center gap-8 whitespace-nowrap">
        {[...marqueeTexts, ...marqueeTexts].map((text, i) => (
          <span key={`${text}-${i}`} className="flex items-center gap-3 text-sm text-[var(--text-secondary)] shrink-0">
            <PawPrint size={14} className="text-white/20" />
            <span className="font-medium">{text}</span>
          </span>
        ))}
      </motion.div>
    </section>
  );
}
