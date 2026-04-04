'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { Eye, Ear, Bone, Heart, Activity, Shield, BadgeCheck, X } from 'lucide-react';

/* ━━━━━━━━━━ Hotspot Data & Coordinates ━━━━━━━━━━ */
// Coordinates (x,y points as percentages relative to the portrait format)
const hotspots = [
  {
    id: 'eyes',
    icon: Eye,
    title: 'Eye Check',
    shortDesc: 'Complete ophthalmologic examination for cataracts, PRA & cherry eye.',
    fullDesc: 'Complete ophthalmologic examination. Checked for cataracts, PRA (Progressive Retinal Atrophy), and cherry eye. Clear certification from board-certified veterinary ophthalmologist.',
    color: '#3b82f6',
    x: 80,
    y: 28,
  },
  {
    id: 'ears',
    icon: Ear,
    title: 'Ear Inspection',
    shortDesc: 'Full ear canal inspection for infections, mites & structural issues.',
    fullDesc: 'Full ear canal inspection for infections, mites, and structural issues. Cleaned and treated as needed. Breed-specific checks for drop-ear breeds.',
    color: '#8b5cf6',
    x: 65,
    y: 20,
  },
  {
    id: 'teeth',
    icon: Bone,
    title: 'Dental Health',
    shortDesc: 'Bite alignment, teeth count & gum health assessment.',
    fullDesc: 'Occlusion check (bite alignment), teeth count verification, and gum health assessment. Early detection ensures proper adult dentition. No underbites or missing teeth.',
    color: '#f59e0b',
    x: 84,
    y: 42,
  },
  {
    id: 'heart',
    icon: Heart,
    title: 'Heart & Lungs',
    shortDesc: 'Stethoscope auscultation for murmurs, arrhythmias & lung clarity.',
    fullDesc: 'Auscultation with stethoscope for heart murmurs, arrhythmias, and lung clarity. ECG screening for breeds prone to cardiac issues. All puppies pass with a clean bill of health.',
    color: '#ef4444',
    x: 55,
    y: 60,
  },
  {
    id: 'hips',
    icon: Activity,
    title: 'Hip & Joint Screen',
    shortDesc: 'Ortolani test for hip laxity & complete joint palpation.',
    fullDesc: 'Ortolani test for hip laxity and joint palpation. Parent hip and elbow history is reviewed where available. Especially important for large breeds like German Shepherds.',
    color: '#22c55e',
    x: 25,
    y: 55,
  },
  {
    id: 'vaccination',
    icon: Shield,
    title: 'Vaccination',
    shortDesc: 'Age-appropriate DHPPi, anti-rabies & deworming schedule.',
    fullDesc: 'Age-appropriate DHPPi vaccination, anti-rabies, and systematic deworming schedule completed. Full vaccination card provided with batch numbers and vet signatures.',
    color: '#06b6d4',
    x: 45,
    y: 35,
  },
];

/* ━━━━━━━━━━ Main Hotspot Component ━━━━━━━━━━ */
export default function ImageHotspot() {
  const [activeSpotId, setActiveSpotId] = useState<string>(hotspots[0].id);

  const activeSpot = hotspots.find(h => h.id === activeSpotId) || hotspots[0];
  const ActiveIcon = activeSpot.icon;

  return (
    <section
      className="relative overflow-hidden pt-8 pb-16 sm:pt-12 sm:pb-24"
      id="health-hotspot"
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
        
        {/* ━━━ Section Header ━━━ */}
        <div className="flex flex-col gap-4 text-center mb-10 sm:mb-16 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-2"
          >
             <div className="w-8 h-[2px] bg-[#ea728c]" />
             <span className="text-[#ea728c] font-bold text-xs sm:text-sm uppercase tracking-[0.2em]">
               Veterinary Health Guarantee
             </span>
             <div className="w-8 h-[2px] bg-[#ea728c]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="font-display text-whitexl sm:text-4xl lg:text-whitexl font-bold text-[#FFF0D9] leading-tight"
          >
            Health <span className="text-[#ea728c]">Inspection</span> Points
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#FFF0D9] text-sm sm:text-whitease font-medium mx-auto max-w-2xl"
          >
            Tap any checkpoint on our furry friend to learn exactly what our vet team examines before a puppy gets their clean bill of health.
          </motion.p>
        </div>

        {/* ━━━ Visual Map & Active Info Card (LG: Side by Side | Mobile: Stacked) ━━━ */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
          
          {/* LEFT: Central Image & Hotspots (Map) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 relative"
          >
             {/* The Image Container */}
             <div className="relative aspect-[4/3] sm:aspect-square lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(42,23,18,0.15)] border-8 sm:border-[12px] border-white/80 bg-[#f8f4ed]">
                <Image
                   src="/images/health/base-puppy.png"
                   alt="Puppy Health Inspection Base"
                   fill
                   className="object-cover object-center"
                   sizes="(max-width: 1024px) 100vw, 60vw"
                   quality={90}
                />
                
                {/* Overlay Vignette/Gradient to make hotspots pop slightly */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />

                {/* ── Hotspot Pins ── */}
                {hotspots.map((spot) => {
                  const isActive = spot.id === activeSpotId;
                  const SpotIcon = spot.icon;
                  
                  return (
                    <button
                      key={spot.id}
                      onClick={() => setActiveSpotId(spot.id)}
                      className={cn(
                        "absolute group z-20 transition-transform duration-300",
                        isActive ? "scale-110" : "hover:scale-105"
                      )}
                      style={{ 
                        left: `${spot.x}%`, 
                        top: `${spot.y}%`, 
                        transform: isActive ? 'translate(-50%, -50%) scale(1.1)' : 'translate(-50%, -50%)'
                      }}
                      aria-label={`View details for ${spot.title}`}
                    >
                       {/* Pulse wave (only if active) */}
                       {isActive && (
                         <span 
                           className="absolute inset-0 rounded-full animate-ping opacity-40"
                           style={{ backgroundColor: spot.color }}
                         />
                       )}
                       
                       {/* The Pin Blob itself */}
                       <div 
                         className={cn(
                           "relative flex items-center justify-center rounded-full shadow-lg transition-colors border-2",
                           isActive ? "w-12 h-12" : "w-10 h-10 bg-white/90 backdrop-blur-sm"
                         )}
                         style={{ 
                           borderColor: isActive ? 'white' : 'transparent',
                           backgroundColor: isActive ? spot.color : 'rgba(255,255,255,0.9)',
                           color: isActive ? 'white' : spot.color
                         }}
                       >
                          <SpotIcon size={isActive ? 22 : 18} />
                       </div>

                       {/* Tooltip Label (Visible on hover if not active on larger screens) */}
                       {!isActive && (
                          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-black/80 text-white text-[10px] font-bold uppercase tracking-wider whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block">
                            {spot.title}
                          </div>
                       )}
                    </button>
                  );
                })}
             </div>
          </motion.div>

          {/* RIGHT: Active Info Card */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0 lg:sticky lg:top-32">
             <AnimatePresence mode="wait">
                <motion.div
                   key={activeSpot.id}
                   initial={{ opacity: 0, x: 20, y: 10 }}
                   animate={{ opacity: 1, x: 0, y: 0 }}
                   exit={{ opacity: 0, x: -20, y: -10 }}
                   transition={{ duration: 0.3, ease: 'easeOut' }}
                   className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(42,23,18,0.08)] border border-white relative overflow-hidden"
                >
                   {/* Decorative background glow matched to active spot color */}
                   <div 
                     className="absolute -top-20 -right-20 w-64 h-64 rounded-2xl blur-[60px] opacity-100 pointer-events-none"
                     style={{ backgroundColor: activeSpot.color }}
                   />
                   
                   <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-6">
                         <div 
                           className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner"
                           style={{ backgroundColor: `${activeSpot.color}15`, color: activeSpot.color }}
                         >
                            <ActiveIcon size={26} />
                         </div>
                         <div>
                            <h3 className="text-xl sm:text-whitexl font-black text-[#FFF0D9]">
                               {activeSpot.title}
                            </h3>
                            <span 
                               className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-2xl"
                               style={{ backgroundColor: `${activeSpot.color}10`, color: activeSpot.color }}
                            >
                               <BadgeCheck size={14} />
                               Vet Certified Point
                            </span>
                         </div>
                      </div>

                      <p className="text-[#FFF0D9] font-medium text-whitease leading-relaxed mb-4">
                         {activeSpot.shortDesc}
                      </p>
                      
                      <div className="bg-[#FFF0D9] border border-[#f0e6dc] rounded-2xl p-5 mb-2">
                         <p className="text-sm leading-[1.7] text-[#FFF0D9]">
                            {activeSpot.fullDesc}
                         </p>
                      </div>
                   </div>
                </motion.div>
             </AnimatePresence>

             {/* Small Instruction below card */}
             <p className="text-center sm:text-left text-[#ea728c]/70 text-xs font-bold uppercase tracking-widest mt-6 animate-pulse">
                ← Tap other markers
             </p>
          </div>

        </div>

        {/* ━━━ Bottom Trust Strip ━━━ */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.3 }}
           className="mt-12 sm:mt-20 flex flex-wrap items-center justify-center gap-4 sm:gap-6"
        >
           {[
             { label: 'Registered Vets', icon: Shield },
             { label: 'Written Reports', icon: BadgeCheck },
             { label: 'Lifelong Support', icon: Heart },
           ].map((item, i) => (
             <div key={i} className="flex items-center gap-2 bg-white/70 backdrop-blur-md rounded-2xl px-5 py-2.5 shadow-sm border border-white/50">
                <item.icon size={16} className="text-[#ea728c]" />
                <span className="text-[12px] sm:text-[14px] font-black text-[#FFF0D9] uppercase tracking-wide">
                  {item.label}
                </span>
             </div>
           ))}
        </motion.div>

      </div>
    </section>
  );
}

