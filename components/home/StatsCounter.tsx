'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';
import MobileCarousel from '@/components/ui/MobileCarousel';
import { Dog, Users, Award, Heart, Star, ShieldCheck } from 'lucide-react';

const stats = [
  { value: 500, suffix: '+', label: 'Happy Families', icon: <Users size={24} />, color: '#22c55e' },
  { value: 25, suffix: '+', label: 'Breeds Available', icon: <Dog size={24} />, color: '#a855f7' },
  { value: 100, suffix: '%', label: 'Health Guarantee', icon: <ShieldCheck size={24} />, color: '#3b82f6' },
  { value: 6, suffix: '+', label: 'Years Experience', icon: <Award size={24} />, color: '#f59e0b' },
  { value: 4.9, suffix: '★', label: 'Google Rating', icon: <Star size={24} />, color: '#eab308' },
  { value: 1000, suffix: '+', label: 'Puppies Delivered', icon: <Heart size={24} />, color: '#ef4444' },
];

function AnimatedNumber({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) {
  const [current, setCurrent] = useState(0);
  const isFloat = !Number.isInteger(value);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setCurrent(step >= steps ? value : increment * step);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span className="tabular-nums">
      {isFloat ? current.toFixed(1) : Math.floor(current)}
      {suffix}
    </span>
  );
}

function StatCard({ stat, inView }: { stat: typeof stats[number]; inView: boolean }) {
  return (
    <div className="glass-card-static p-5 text-center group hover:border-[var(--glass-border-hover)] transition-all duration-300 h-full">
      <div className="relative z-10">
        <div
          className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
          style={{ background: `${stat.color}15`, color: stat.color }}
        >
          {stat.icon}
        </div>
        <p className="text-2xl lg:text-3xl font-bold text-gradient mb-1">
          <AnimatedNumber value={stat.value} suffix={stat.suffix} inView={inView} />
        </p>
        <p className="text-[10px] sm:text-xs text-[var(--text-tertiary)] uppercase tracking-wider">
          {stat.label}
        </p>
      </div>
    </div>
  );
}

export default function StatsCounter() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-8 section-amber relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/[0.03] rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/[0.03] rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Mobile Carousel */}
        <MobileCarousel autoPlay autoPlayInterval={2500} itemWidth="small">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} inView={inView} />
          ))}
        </MobileCarousel>

        {/* Desktop Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="hidden lg:grid lg:grid-cols-6 gap-4"
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={fadeUpVariant}>
              <StatCard stat={stat} inView={inView} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
