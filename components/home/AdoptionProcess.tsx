'use client';

import { motion } from 'motion/react';
import SectionHeading from '@/components/ui/SectionHeading';
import GlassCard from '@/components/ui/GlassCard';
import MobileCarousel from '@/components/ui/MobileCarousel';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';
import { MessageCircle, Search, Heart, Home, Phone, Truck } from 'lucide-react';

const steps = [
  {
    step: 1,
    icon: <Search size={24} />,
    title: 'Browse & Choose',
    description: 'Explore our available puppies online. Filter by breed, size, gender, and more to find your perfect match.',
    color: '#a855f7',
  },
  {
    step: 2,
    icon: <MessageCircle size={24} />,
    title: 'Connect via WhatsApp',
    description: 'Reach out to us on WhatsApp for real-time photos, videos, and answers to all your questions about the puppy.',
    color: '#22c55e',
  },
  {
    step: 3,
    icon: <Phone size={24} />,
    title: 'Video Call & Visit',
    description: 'Schedule a video call or visit our facility in person. Meet your puppy, check health papers, and see the parents.',
    color: '#3b82f6',
  },
  {
    step: 4,
    icon: <Heart size={24} />,
    title: 'Reserve Your Puppy',
    description: 'Reserve your chosen puppy with a partial payment. We hold them exclusively for you with full transparency.',
    color: '#ef4444',
  },
  {
    step: 5,
    icon: <Truck size={24} />,
    title: 'Delivery or Pickup',
    description: 'Collect your puppy in person, or we arrange safe, climate-controlled delivery across India with live tracking.',
    color: '#f59e0b',
  },
  {
    step: 6,
    icon: <Home size={24} />,
    title: 'Welcome Home!',
    description: 'Your new family member arrives with vaccination card, diet plan, training guide, and lifetime WhatsApp support.',
    color: '#06b6d4',
  },
];

function StepCard({ step }: { step: typeof steps[number] }) {
  return (
    <GlassCard variant="solid" className="p-6 h-full relative group border-purple-100/50">
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
            style={{ background: `${step.color}10`, color: step.color }}
          >
            {step.icon}
          </div>
          <span
            className="text-whitexl font-display font-bold opacity-30"
            style={{ color: step.color }}
          >
            {String(step.step).padStart(2, '0')}
          </span>
        </div>
        <h3 className="heading-card text-slate-900 mb-2">{step.title}</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          {step.description}
        </p>
      </div>
    </GlassCard>
  );
}

export default function AdoptionProcess() {
  return (
    <section className="section-shell section-solid-purple relative overflow-hidden" id="adoption-process">
      <div className="hidden md:block">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-purple-500/[0.03] rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-500/[0.03] rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          title="How It Works"
          subtitle="From browsing to bringing home — our simple 6-step adoption process."
        />

        {/* Mobile Carousel */}
        <MobileCarousel autoPlay autoPlayInterval={3000} itemWidth="large">
          {steps.map((step) => (
            <StepCard key={step.step} step={step} />
          ))}
        </MobileCarousel>

        {/* Desktop Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="relative hidden lg:block"
        >
          <div className="absolute top-[60px] left-[calc(8.33%+24px)] right-[calc(8.33%+24px)] h-[2px] bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20" />
          <div className="grid grid-cols-3 gap-6">
            {steps.map((step) => (
              <motion.div key={step.step} variants={fadeUpVariant}>
                <StepCard step={step} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
