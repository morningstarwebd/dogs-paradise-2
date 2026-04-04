'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'motion/react';
import { dogs } from '@/data/dogs';

const galleryImages = dogs
  .flatMap((d) => d.images)
  .slice(0, 16);

export default function InstagramFeed() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const x1 = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']);
  const x2 = useTransform(scrollYProgress, [0, 1], ['-15%', '0%']);

  return (
    <section className="section-shell overflow-hidden bg-[#302b63]" id="photo-gallery" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="heading-section text-slate-900 mb-4"
          >
            Adorable Moments
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-600 max-w-2xl mx-auto text-lg"
          >
            A glimpse into the daily lives of our happy puppy families. Follow our journey on Instagram for a daily dose of cuteness.
          </motion.p>
        </div>
      </div>

      {/* Scrolling rows */}
      <div className="space-y-6">
        <motion.div style={{ x: x1 }} className="flex gap-6 pl-6">
          {galleryImages.slice(0, 8).map((img, i) => (
            <GalleryItem key={`r1-${i}`} src={img} index={i} />
          ))}
          {galleryImages.slice(0, 4).map((img, i) => (
            <GalleryItem key={`r1d-${i}`} src={img} index={i} />
          ))}
        </motion.div>

        <motion.div style={{ x: x2 }} className="flex gap-6 pl-6">
          {galleryImages.slice(8, 16).map((img, i) => (
            <GalleryItem key={`r2-${i}`} src={img} index={i} />
          ))}
          {galleryImages.slice(8, 12).map((img, i) => (
            <GalleryItem key={`r2d-${i}`} src={img} index={i} />
          ))}
        </motion.div>
      </div>

      {/* Instagram CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mt-12"
      >
        <a
          href="https://instagram.com/dogsparadice"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-full text-sm font-bold inline-flex items-center gap-3 transition-all transform hover:-translate-y-1 shadow-lg shadow-slate-200"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
          </svg>
          @dogsparadice
        </a>
      </motion.div>
    </section>
  );
}

function GalleryItem({ src, index }: { src: string; index: number }) {
  return (
    <div className="relative h-[190px] w-[190px] shrink-0 overflow-hidden rounded-2xl group sm:h-[240px] sm:w-[240px] lg:h-[280px] lg:w-[280px]">
      <Image
        src={src}
        alt={`Puppy gallery photo ${index + 1}`}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
        sizes="280px"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
        <span className="text-white/0 group-hover:text-white/80 transition-all duration-300 transform scale-50 group-hover:scale-100">
          ❤️
        </span>
      </div>
    </div>
  );
}
