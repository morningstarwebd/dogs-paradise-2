'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { Star, Heart, Shield, Award, Users, Dog, MapPin, Phone } from 'lucide-react';
import { siteConfig } from '@/data/site-config';

const trustStats = [
  { icon: <Users size={18} />, value: '2000+', label: 'Happy Families', color: '#16a34a' },
  { icon: <Dog size={18} />, value: '25+', label: 'Breeds', color: '#9333ea' },
  { icon: <Award size={18} />, value: '12+', label: 'Years', color: '#d97706' },
  { icon: <Heart size={18} />, value: '1500+', label: 'Puppies', color: '#dc2626' },
];

const heroImages = [
  '/images/breeds/golden-retriever.jpg',
  '/images/breeds/toy-poodle.jpg',
  '/images/breeds/shih-tzu.jpg',
  '/images/breeds/husky.jpg',
  '/images/breeds/maltipoo.jpg',
];

export default function HeroBanner() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 4000); // Crossfade image every 4 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden" aria-label="Hero Section" style={{ backgroundColor: '#302b63' }}>
      {/* Background Decorative Blobs */}
      <div className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top-right pink blob */}
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 md:w-[500px] md:h-[500px] bg-[#ea728c] rounded-full rounded-bl-[80px] sm:rounded-bl-[100px] md:rounded-bl-[200px]" />

        {/* Yellow decorative outline — top-right */}
        <div className="absolute -top-8 -right-8 sm:-top-[16px] sm:-right-[16px] md:-top-[25px] md:-right-[25px] w-[208px] h-[208px] sm:w-[288px] sm:h-[288px] md:w-[550px] md:h-[550px] border-[3px] sm:border-[4px] border-[#f5c842] rounded-full rounded-bl-[80px] sm:rounded-bl-[100px] md:rounded-bl-[200px] opacity-80" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ━━━ Desktop Layout ━━━ */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center py-16 xl:py-20">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 mb-6 bg-white shadow-sm border border-white"
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#ea728c" color="#ea728c" />
                ))}
              </div>
              <span className="text-sm font-bold text-[#FFF0D9]/90">Trusted by 2000+ Families</span>
            </motion.div>

            <h1 className="font-display text-4xl xl:text-whitexl 2xl:text-6xl font-bold text-[#FFF0D9] leading-tight mb-6">
              Find Your{' '}
              <span className="text-[#ea728c]">
                Perfect Puppy
              </span>
              {' '}Companion
            </h1>

            <p className="text-lg xl:text-xl text-[#FFF0D9]/90 leading-relaxed mb-8 max-w-lg font-medium">
              Healthy, home-raised puppies in Bangalore with 12+ years of trusted experience.
              Transparent health details, genuine breeder guidance.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-12">
              <Link
                href="/breeds"
                className="inline-flex items-center gap-2 px-8 py-4 text-whitease font-bold rounded-2xl text-white transition-transform duration-300 hover:-translate-y-1 bg-[#ea728c] hover:bg-[#ea728c]"
              >
                🐾 Browse Breeds
              </Link>
              <a
                href={`https://wa.me/${siteConfig.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 text-whitease font-bold rounded-2xl text-white transition-transform duration-300 hover:-translate-y-1 bg-[#25d366] hover:bg-[#20ba5c]"
              >
                💬 WhatsApp Us
              </a>
            </div>

            {/* Inline Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-4 gap-4"
            >
              {trustStats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center justify-center bg-white rounded-2xl p-4 shadow-sm border border-white hover:shadow-md transition-shadow duration-300"
                >
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-2" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                    {stat.icon}
                  </div>
                  <span className="text-xl font-bold text-white">{stat.value}</span>
                  <span className="text-xs text-gray-600 uppercase tracking-wider font-bold">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Unique Organic Shape Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="relative flex justify-center items-center"
          >
            {/* Soft Square Wrapper */}
            <motion.div
              className="relative rounded-3xl w-[450px] h-[550px] xl:w-[500px] xl:h-[600px] overflow-hidden shadow-2xl border-8 border-white bg-white"
            >
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={currentImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, ease: 'easeInOut' }}
                  className="absolute inset-0"
                >
                  <Image
                    src={heroImages[currentImage]}
                    alt="Beautiful Puppy at Dogs Paradise Bangalore"
                    fill
                    className="object-cover"
                    priority={currentImage === 0}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    quality={90}
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Floating info card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="absolute -bottom-6 left-12 bg-white rounded-2xl p-4 shadow-xl border border-white z-20 hover:-translate-y-1 transition-transform cursor-pointer"
            >
              <a href={siteConfig.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col gap-1">
                <h3 className="font-bold text-white text-sm">Dogs Paradise Bangalore</h3>
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#ea728c]" />
                  <span className="text-xs font-semibold text-[#FFF0D9]/80">Benson Town</span>
                </div>
              </a>
            </motion.div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl z-20 border border-white"
            >
              <Shield size={28} className="text-[#2a9d8f]" />
            </motion.div>
          </motion.div>
        </div>

        {/* ━━━ Mobile Layout ━━━ */}
        <div className="lg:hidden pt-4 pb-10 px-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="flex justify-center mb-4"
          >
            <div className="inline-flex items-center gap-1.5 rounded-2xl px-3 py-1.5 bg-white/90 shadow-sm border border-white">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={11} fill="#ea728c" color="#ea728c" />
                ))}
              </div>
              <span className="text-[11px] font-bold text-[#FFF0D9]/90">2000+ Happy Families</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="font-display text-[32px] font-bold text-[#FFF0D9] leading-[1.15] text-center mb-2"
          >
            Find Your <span className="text-[#ea728c]">Perfect Puppy</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="text-[14px] leading-relaxed text-[#FFF0D9]/80 font-medium text-center mb-5 max-w-[260px] mx-auto"
          >
            Healthy, home-raised puppies with 12+ years of experience.
          </motion.p>

          {/* Soft Square Mobile Image with Floating Stats — FIRST */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            className="relative mx-auto w-[70vw] max-w-[250px] mb-8 mt-6"
          >
            <motion.div
              className="relative rounded-3xl w-full aspect-[4/5] mx-auto overflow-hidden shadow-2xl border-[5px] border-white bg-white"
            >
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={currentImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, ease: 'easeInOut' }}
                  className="absolute inset-0"
                >
                  <Image
                    src={heroImages[currentImage]}
                    alt="Puppies at Dogs Paradise"
                    fill
                    className="object-cover"
                    priority={currentImage === 0}
                    sizes="(max-width: 768px) 80vw, 50vw"
                    quality={85}
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Floating Stat - Top Left (Years Exp) */}
            <div className="absolute -left-6 top-8 bg-white/95 backdrop-blur-sm rounded-2xl px-3 py-1.5 shadow-lg flex items-center gap-1.5 border border-white z-20 animate-[float_6s_ease-in-out_infinite]">
              <div className="text-orange-500 scale-75">{trustStats[2].icon}</div>
              <span className="text-[10px] font-black text-white pr-1">{trustStats[2].value}</span>
            </div>

            {/* Floating Stat - Right Middle (Breeds) */}
            <div className="absolute -right-5 top-[35%] bg-white/95 backdrop-blur-sm rounded-2xl w-12 h-12 shadow-lg flex flex-col items-center justify-center border border-white z-20 animate-[float_8s_ease-in-out_infinite_reverse]">
              <span className="text-[14px] font-black text-[#9333ea] leading-none">{trustStats[1].value}</span>
              <span className="text-[7px] font-bold text-gray-500 uppercase leading-none mt-0.5">{trustStats[1].label}</span>
            </div>

            {/* Floating Stat - Bottom Left (Puppies Delivered) */}
            <div className="absolute -left-5 bottom-8 bg-white/95 backdrop-blur-sm rounded-2xl px-3 py-1.5 shadow-lg flex items-center gap-1.5 border border-white z-20 animate-[float_7s_ease-in-out_infinite]">
              <div className="text-red-500 scale-75">{trustStats[3].icon}</div>
              <span className="text-[10px] font-black text-white pr-1">{trustStats[3].value}</span>
            </div>

            <a
              href={siteConfig.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute -bottom-4 right-0 bg-white rounded-2xl px-4 py-2 flex items-center gap-1.5 shadow-xl border border-gray-100 z-20 active:scale-95 transition-transform"
            >
              <MapPin size={13} className="text-[#ea728c]" />
              <span className="text-[12px] font-bold text-[#FFF0D9]/90">Visit Us</span>
            </a>
          </motion.div>

          {/* CTA Buttons — BELOW the image, tailored to fit optimally on small screens */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="flex flex-wrap gap-2 justify-center mb-4 px-2 max-w-[320px] mx-auto"
          >
            <Link
              href="/breeds"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-1 py-3 text-[12px] whitespace-nowrap font-bold rounded-2xl text-white bg-[#ea728c] active:scale-95 transition-all shadow-sm"
            >
              🐾 Breeds
            </Link>
            <a
              href={`https://wa.me/${siteConfig.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1 px-1 py-3 text-[12px] whitespace-nowrap font-bold rounded-2xl text-white bg-[#25d366] active:scale-95 transition-all shadow-sm"
            >
              💬 WhatsApp
            </a>
            <a
              href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}
              className="inline-flex shrink-0 items-center justify-center w-11 h-11 rounded-2xl bg-white text-[#ea728c] shadow-sm border border-gray-100 active:scale-95 transition-all"
              aria-label="Call"
            >
              <Phone size={16} />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
