'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Quote, CheckCircle2 } from 'lucide-react';
import { fadeUpVariant } from '@/lib/animations';

export default function AboutPreview() {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28" id="about-preview" style={{ backgroundColor: '#302b63' }}>
      {/* Background Decorative Blobs */}
      <div className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-16 -left-16 md:-top-32 md:-left-32 w-48 h-48 md:w-96 md:h-96 bg-[#302b63] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">

          {/* Left: Text Content */}
          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="order-2 lg:order-1 lg:col-span-7"
          >
            {/* Header pattern matching recent sections */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[2px] bg-[#ea728c]" />
              <span className="text-[#ea728c] font-bold text-xs sm:text-sm uppercase tracking-[0.2em]">
                Meet The Founder
              </span>
            </div>

            <h2 className="font-display text-whitexl sm:text-4xl lg:text-whitexl font-bold text-[#FFF0D9] leading-tight mb-8">
              Meet Richard – Founder of <span className="text-[#ea728c]">Dogs Paradise Bangalore</span>
            </h2>

            <div className="space-y-5 text-[#FFF0D9] text-[15px] sm:text-whitease leading-relaxed mb-10">
              <p className="font-medium text-[#FFF0D9] text-lg">
                Hi, I’m Richard, the founder of Dogs Paradise.
              </p>

              <p>
                What started as a simple journey of being a pet parent slowly grew into a deep passion. Over the years, I found myself becoming more involved in the beautiful process of responsible breeding, caring for newborn puppies, and helping them find safe, loving homes.
              </p>

              <div className="relative py-4 my-6">
                <Quote className="absolute -top-1 -left-2 w-10 h-10 text-[#ea728c]/10 -z-10 transform -rotate-12" />
                <p className="text-[#FFF0D9] text-lg font-medium italic border-l-4 border-[#ea728c]/30 pl-4">
                  "For me, every puppy deserves a good home, and every family deserves a healthy, well-raised companion. That belief became my purpose."
                </p>
              </div>

              <div className="pt-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-3 bg-[#ea728c] text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-[#ea728c]/20 hover:bg-[#ea728c] hover:-translate-y-1 transition-all duration-300 group"
                >
                  Read My Full Story
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Right: Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="order-1 lg:order-2 lg:col-span-5 relative lg:sticky lg:top-32"
          >
            <div className="relative mx-auto max-w-sm lg:max-w-none">
              {/* Image Frame */}
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(42,23,18,0.15)] border-8 border-white/80 bg-white z-10 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <Image
                  src="/images/owner/richard.jpg"
                  alt="Richard - Founder of Dogs Paradise Bangalore"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  quality={90}
                />
              </div>

              {/* Background solid decoration */}
              <div className="absolute -inset-4 bg-gradient-to-br from-[#ea728c]/40 to-[#ea728c]/60 rounded-2xl -z-10 transform -rotate-3" />

              {/* Badge/Sticker */}
              <div className="absolute -bottom-6 -left-6 z-20 bg-white p-4 rounded-2xl shadow-xl border border-white/50 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                <div className="bg-[#FFF0D9] px-4 py-2 rounded-2xl text-center">
                  <span className="block text-[#ea728c] font-black text-xl leading-none mb-1">2017</span>
                  <span className="block text-[10px] font-bold text-[#FFF0D9] uppercase tracking-wider">Est. Since</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

