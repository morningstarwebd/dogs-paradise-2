'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import SectionHeading from '@/components/ui/SectionHeading';
import GlassCard from '@/components/ui/GlassCard';
import { fadeUpVariant } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { Crosshair, Heart, Bone, Eye, Shield, Ear, Activity } from 'lucide-react';

const hotspots = [
  {
    id: 'eyes',
    x: 35,
    y: 18,
    icon: <Eye size={16} />,
    title: 'Eye Check',
    description: 'Complete ophthalmologic examination. Checked for cataracts, PRA (Progressive Retinal Atrophy), and cherry eye. Clear certification from board-certified veterinary ophthalmologist.',
    color: '#3b82f6',
  },
  {
    id: 'ears',
    x: 25,
    y: 25,
    icon: <Ear size={16} />,
    title: 'Ear Inspection',
    description: 'Full ear canal inspection for infections, mites, and structural issues. Cleaned and treated as needed. Breed-specific checks for drop-ear breeds like Beagles and Cocker Spaniels.',
    color: '#8b5cf6',
  },
  {
    id: 'teeth',
    x: 42,
    y: 35,
    icon: <Bone size={16} />,
    title: 'Dental Health',
    description: 'Occlusion check (bite alignment), teeth count verification, and gum health assessment. Early detection ensures proper adult dentition. No underbites or missing teeth.',
    color: '#f59e0b',
  },
  {
    id: 'heart',
    x: 55,
    y: 48,
    icon: <Heart size={16} />,
    title: 'Heart & Lungs',
    description: 'Auscultation with stethoscope for heart murmurs, arrhythmias, and lung clarity. ECG screening for breeds prone to cardiac issues. All puppies pass with a clean bill of health.',
    color: '#ef4444',
  },
  {
    id: 'hips',
    x: 70,
    y: 60,
    icon: <Activity size={16} />,
    title: 'Hip & Joint Screen',
    description: 'Ortolani test for hip laxity and joint palpation. Parent hip/elbow scores verified by KCI. Especially critical for large breeds like German Shepherds and Golden Retrievers.',
    color: '#22c55e',
  },
  {
    id: 'vaccination',
    x: 45,
    y: 70,
    icon: <Shield size={16} />,
    title: 'Vaccination & Deworming',
    description: 'Age-appropriate DHPPi vaccination, anti-rabies, and systematic deworming schedule completed. Full vaccination card provided with batch numbers and vet signatures.',
    color: '#06b6d4',
  },
];

export default function ImageHotspot() {
  const [activeSpot, setActiveSpot] = useState<string | null>(null);

  return (
    <section className="py-20 lg:py-28" id="health-hotspot">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Health Inspection Points"
          subtitle="Every puppy undergoes 6-point veterinary health inspection before going to their new home. Tap any point to learn more."
        />

        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid lg:grid-cols-5 gap-8 items-start"
        >
          {/* Hotspot Visual */}
          <div className="lg:col-span-3">
            <GlassCard hover={false} className="p-6 sm:p-8">
              <div className="relative z-10">
                {/* Dog silhouette representation */}
                <div className="relative aspect-[4/3] bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl overflow-hidden border border-[var(--color-border)]">
                  {/* SVG Dog silhouette */}
                  <svg viewBox="0 0 100 80" className="absolute inset-0 w-full h-full p-8 opacity-10">
                    <path
                      d="M20,25 C20,15 25,10 30,12 C33,8 38,8 40,12 L42,15 C44,12 48,12 50,15 L55,18 C58,15 62,14 65,18 L68,22 C72,20 78,22 80,28 L82,35 C85,38 85,45 82,50 L80,55 C80,58 78,62 75,65 L70,68 L65,70 L60,68 L55,70 L45,70 L40,68 L35,70 L30,68 L25,65 C22,62 20,58 20,55 L18,50 C15,45 15,38 18,35 Z"
                      fill="currentColor"
                    />
                  </svg>

                  {/* Hotspot dots */}
                  {hotspots.map((spot) => (
                    <button
                      key={spot.id}
                      className="absolute group z-10"
                      style={{ left: `${spot.x}%`, top: `${spot.y}%`, transform: 'translate(-50%, -50%)' }}
                      onClick={() => setActiveSpot(activeSpot === spot.id ? null : spot.id)}
                      aria-label={spot.title}
                    >
                      {/* Pulse ring */}
                      <span
                        className="absolute inset-0 rounded-full animate-ping opacity-30"
                        style={{ background: spot.color, animationDuration: '2s' }}
                      />
                      {/* Dot */}
                      <span
                        className={cn(
                          'relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2',
                          activeSpot === spot.id
                            ? 'scale-125'
                            : 'hover:scale-110'
                        )}
                        style={{
                          background: `${spot.color}30`,
                          borderColor: spot.color,
                          color: spot.color,
                        }}
                      >
                        {spot.icon}
                      </span>
                      {/* Label */}
                      <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-[9px] font-medium text-white/50 whitespace-nowrap hidden sm:block">
                        {spot.title}
                      </span>
                    </button>
                  ))}

                  {/* Center label */}
                  {!activeSpot && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-center">
                        <Crosshair size={32} className="mx-auto mb-2 text-white/10" />
                        <p className="text-xs text-[var(--text-tertiary)]">Tap a health checkpoint</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Info Panel */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {activeSpot ? (
                <motion.div
                  key={activeSpot}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  {(() => {
                    const spot = hotspots.find((s) => s.id === activeSpot)!;
                    return (
                      <GlassCard hover={false} className="p-6">
                        <div className="relative z-10">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                            style={{ background: `${spot.color}20`, color: spot.color }}
                          >
                            {spot.icon}
                          </div>
                          <h3 className="text-lg font-display font-bold text-white mb-3">
                            {spot.title}
                          </h3>
                          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                            {spot.description}
                          </p>
                          <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                            <span
                              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
                              style={{ background: `${spot.color}15`, color: spot.color }}
                            >
                              <Shield size={12} />
                              Certified Check
                            </span>
                          </div>
                        </div>
                      </GlassCard>
                    );
                  })()}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <GlassCard hover={false} className="p-6">
                    <div className="relative z-10 space-y-4">
                      <h3 className="text-lg font-display font-bold text-white">
                        6-Point Health Guarantee
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        Select any health checkpoint on the diagram to see exactly what our veterinary team inspects before clearing a puppy for their new home.
                      </p>
                      <ul className="space-y-2">
                        {hotspots.map((spot) => (
                          <li key={spot.id}>
                            <button
                              onClick={() => setActiveSpot(spot.id)}
                              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                            >
                              <span
                                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                style={{ background: `${spot.color}15`, color: spot.color }}
                              >
                                {spot.icon}
                              </span>
                              <span className="text-sm text-[var(--text-secondary)]">{spot.title}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
