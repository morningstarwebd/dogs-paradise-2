'use client';

import { useState, type CSSProperties, type ComponentType } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { Eye, Ear, Bone, Heart, Activity, Shield, BadgeCheck } from 'lucide-react';
import { getDecorativeBlobStyle } from '@/lib/decorative-color';
import { buildSectionStyle, resolveColorToken } from '@/lib/gradient-style';

type RawBlock = {
  id?: string;
  type?: string;
  settings?: Record<string, unknown>;
};

type IconComponent = ComponentType<{ size?: number; className?: string }>;

type HotspotItem = {
  id: string;
  icon: IconComponent;
  title: string;
  shortDesc: string;
  fullDesc: string;
  color: string;
  x: number;
  y: number;
};

type TrustItem = {
  id: string;
  label: string;
  icon: IconComponent;
};

const hotspotIconMap = {
  Eye,
  Ear,
  Bone,
  Heart,
  Activity,
  Shield,
};

const trustIconMap = {
  Shield,
  BadgeCheck,
  Heart,
};

function toText(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

function toNumber(value: unknown, fallback: number): number {
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return fallback;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function resolveHotspotIcon(value: unknown) {
  if (typeof value === 'string' && value in hotspotIconMap) {
    return hotspotIconMap[value as keyof typeof hotspotIconMap];
  }
  return Shield;
}

function resolveTrustIcon(value: unknown) {
  if (typeof value === 'string' && value in trustIconMap) {
    return trustIconMap[value as keyof typeof trustIconMap];
  }
  return Shield;
}

/* ━━━━━━━━━━ Hotspot Data & Coordinates ━━━━━━━━━━ */
// Coordinates (x,y points as percentages relative to the portrait format)
const fallbackHotspots: HotspotItem[] = [
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

const fallbackTrustItems: TrustItem[] = [
  { id: 'trust-1', label: 'Registered Vets', icon: Shield },
  { id: 'trust-2', label: 'Written Reports', icon: BadgeCheck },
  { id: 'trust-3', label: 'Lifelong Support', icon: Heart },
];

function buildHotspots(blocks: RawBlock[]): HotspotItem[] {
  return blocks
    .filter((block) => block?.type === 'health_hotspot' && block.settings)
    .map((block, index) => {
      const settings = block.settings as Record<string, unknown>;
      return {
        id: block.id || `health_hotspot_${index}`,
        icon: resolveHotspotIcon(settings.icon),
        title: toText(settings.title, `Hotspot ${index + 1}`),
        shortDesc: toText(settings.short_desc, 'Short description'),
        fullDesc: toText(settings.full_desc, 'Detailed description'),
        color: toText(settings.color, '#3b82f6'),
        x: toNumber(settings.x, 50),
        y: toNumber(settings.y, 50),
      };
    });
}

function buildTrustItems(blocks: RawBlock[]): TrustItem[] {
  return blocks
    .filter((block) => block?.type === 'health_trust_item' && block.settings)
    .map((block, index) => {
      const settings = block.settings as Record<string, unknown>;
      return {
        id: block.id || `health_trust_item_${index}`,
        label: toText(settings.label, `Trust Item ${index + 1}`),
        icon: resolveTrustIcon(settings.icon),
      };
    });
}

type SectionDesignProps = {
  badge_text?: string;
  badge_text_size_px?: number | string;
  heading?: string;
  heading_highlight?: string;
  heading_suffix?: string;
  heading_text_size_px?: number | string;
  subheading?: string;
  description_text_size_px?: number | string;
  base_image?: string;
  blocks?: RawBlock[];
  section_bg_color?: string;
  section_text_color?: string;
  decorative_blob_enabled?: boolean;
  decorative_blob_color?: string;
  decorative_blob_size_scale?: number | string;
  decorative_shape_top_offset_x?: number | string;
  decorative_shape_top_offset_y?: number | string;
  decorative_shape_bottom_offset_x?: number | string;
  decorative_shape_bottom_offset_y?: number | string;
  decorative_shape_offset_x?: number | string;
  decorative_shape_offset_y?: number | string;
  decorative_outline_enabled?: boolean;
  decorative_outline_color?: string;
  decorative_outline_size_scale?: number | string;
  section_padding_top?: string;
  section_padding_bottom?: string;
  section_margin_top?: string;
  section_margin_bottom?: string;
};

/* ━━━━━━━━━━ Main Hotspot Component ━━━━━━━━━━ */
export default function ImageHotspot({
  badge_text = 'Veterinary Health Guarantee',
  badge_text_size_px = 14,
  heading = 'Health',
  heading_highlight = 'Inspection',
  heading_suffix = 'Points',
  heading_text_size_px = 56,
  subheading = 'Tap any checkpoint on our furry friend to learn exactly what our vet team examines before a puppy gets their clean bill of health.',
  description_text_size_px = 16,
  base_image,
  blocks = [],
  section_bg_color,
  section_text_color,
  decorative_blob_enabled = true,
  decorative_blob_color = '#ea728c',
  decorative_blob_size_scale = 1,
  decorative_shape_top_offset_x = 0,
  decorative_shape_top_offset_y = 0,
  decorative_shape_bottom_offset_x = 0,
  decorative_shape_bottom_offset_y = 0,
  decorative_shape_offset_x = 0,
  decorative_shape_offset_y = 0,
  decorative_outline_enabled = true,
  decorative_outline_color = '#f5c842',
  decorative_outline_size_scale = 1,
  section_padding_top,
  section_padding_bottom,
  section_margin_top,
  section_margin_bottom,
}: SectionDesignProps) {
  const blockHotspots = buildHotspots(blocks);
  const hotspotItems = blockHotspots.length > 0 ? blockHotspots : fallbackHotspots;

  const blockTrustItems = buildTrustItems(blocks);
  const trustItems = blockTrustItems.length > 0 ? blockTrustItems : fallbackTrustItems;

  const [activeSpotId, setActiveSpotId] = useState<string>(hotspotItems[0].id);

  const sectionStyle: CSSProperties = buildSectionStyle({
    background: section_bg_color,
    backgroundFallback: '#302b63',
    text: section_text_color,
    paddingTop: section_padding_top,
    paddingBottom: section_padding_bottom,
    marginTop: section_margin_top,
    marginBottom: section_margin_bottom,
  });
  const sectionTextColor = resolveColorToken(section_text_color);

  const badgeSizeDesktop = clamp(toNumber(badge_text_size_px, 14), 10, 32);
  const badgeSizeMobile = clamp(Math.round(badgeSizeDesktop * 0.9), 10, badgeSizeDesktop);
  const headingSizeDesktop = clamp(toNumber(heading_text_size_px, 56), 24, 96);
  const headingSizeMobile = clamp(Math.round(headingSizeDesktop * 0.72), 20, headingSizeDesktop);
  const descriptionSizeDesktop = clamp(toNumber(description_text_size_px, 16), 12, 36);
  const descriptionSizeMobile = clamp(Math.round(descriptionSizeDesktop * 0.9), 12, descriptionSizeDesktop);

  const badgeTextStyle: CSSProperties = {
    fontSize: `clamp(${badgeSizeMobile}px, calc(${badgeSizeMobile - 1}px + 0.4vw), ${badgeSizeDesktop}px)`,
  };
  const headingTextStyle: CSSProperties = {
    fontSize: `clamp(${headingSizeMobile}px, calc(${headingSizeMobile - 4}px + 1.2vw), ${headingSizeDesktop}px)`,
  };
  const descriptionTextStyle: CSSProperties = {
    fontSize: `clamp(${descriptionSizeMobile}px, calc(${descriptionSizeMobile - 1}px + 0.3vw), ${descriptionSizeDesktop}px)`,
  };

  const parsedBlobScale =
    typeof decorative_blob_size_scale === 'number'
      ? decorative_blob_size_scale
      : Number(decorative_blob_size_scale);
  const blobScaleRaw = Number.isFinite(parsedBlobScale) && parsedBlobScale > 0 ? parsedBlobScale : 1;
  const blobScale = Math.min(2.5, Math.max(0.5, blobScaleRaw));

  const parsedTopShapeOffsetX =
    typeof decorative_shape_top_offset_x === 'number'
      ? decorative_shape_top_offset_x
      : Number(decorative_shape_top_offset_x);
  const parsedTopShapeOffsetY =
    typeof decorative_shape_top_offset_y === 'number'
      ? decorative_shape_top_offset_y
      : Number(decorative_shape_top_offset_y);
  const parsedBottomShapeOffsetX =
    typeof decorative_shape_bottom_offset_x === 'number'
      ? decorative_shape_bottom_offset_x
      : Number(decorative_shape_bottom_offset_x);
  const parsedBottomShapeOffsetY =
    typeof decorative_shape_bottom_offset_y === 'number'
      ? decorative_shape_bottom_offset_y
      : Number(decorative_shape_bottom_offset_y);
  const parsedLegacyShapeOffsetX =
    typeof decorative_shape_offset_x === 'number'
      ? decorative_shape_offset_x
      : Number(decorative_shape_offset_x);
  const parsedLegacyShapeOffsetY =
    typeof decorative_shape_offset_y === 'number'
      ? decorative_shape_offset_y
      : Number(decorative_shape_offset_y);
  const topShapeOffsetXRaw = Number.isFinite(parsedTopShapeOffsetX)
    ? parsedTopShapeOffsetX
    : Number.isFinite(parsedLegacyShapeOffsetX)
      ? parsedLegacyShapeOffsetX
      : 0;
  const topShapeOffsetYRaw = Number.isFinite(parsedTopShapeOffsetY)
    ? parsedTopShapeOffsetY
    : Number.isFinite(parsedLegacyShapeOffsetY)
      ? parsedLegacyShapeOffsetY
      : 0;
  const bottomShapeOffsetXRaw = Number.isFinite(parsedBottomShapeOffsetX)
    ? parsedBottomShapeOffsetX
    : Number.isFinite(parsedLegacyShapeOffsetX)
      ? parsedLegacyShapeOffsetX
      : 0;
  const bottomShapeOffsetYRaw = Number.isFinite(parsedBottomShapeOffsetY)
    ? parsedBottomShapeOffsetY
    : Number.isFinite(parsedLegacyShapeOffsetY)
      ? parsedLegacyShapeOffsetY
      : 0;
  const topShapeOffsetX = Math.min(200, Math.max(-200, topShapeOffsetXRaw));
  const topShapeOffsetY = Math.min(200, Math.max(-200, topShapeOffsetYRaw));
  const bottomShapeOffsetX = Math.min(200, Math.max(-200, bottomShapeOffsetXRaw));
  const bottomShapeOffsetY = Math.min(200, Math.max(-200, bottomShapeOffsetYRaw));

  const parsedOutlineScale =
    typeof decorative_outline_size_scale === 'number'
      ? decorative_outline_size_scale
      : Number(decorative_outline_size_scale);
  const outlineScaleRaw = Number.isFinite(parsedOutlineScale) && parsedOutlineScale > 0 ? parsedOutlineScale : 1;
  const outlineScale = Math.min(2.5, Math.max(0.5, outlineScaleRaw));

  const safeActiveSpotId = hotspotItems.some((h) => h.id === activeSpotId)
    ? activeSpotId
    : hotspotItems[0].id;
  const activeSpot = hotspotItems.find(h => h.id === safeActiveSpotId) || hotspotItems[0];
  const ActiveIcon = activeSpot.icon;

  return (
    <section
      className="relative overflow-hidden pt-8 pb-16 sm:pt-12 sm:pb-24"
      id="health-hotspot"
      style={sectionStyle}
    >
      {/* Background Decorative Blobs — same style as BreedExplorer */}
      {(decorative_blob_enabled || decorative_outline_enabled) && (
        <div className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none">
          {decorative_blob_enabled && (
            <>
              <div
                className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 md:w-[500px] md:h-[500px] rounded-full rounded-tr-[80px] sm:rounded-tr-[100px] md:rounded-tr-[200px]"
                style={{
                  ...getDecorativeBlobStyle(decorative_blob_color, '#ea728c'),
                  transform: `translate(${bottomShapeOffsetX}px, ${bottomShapeOffsetY}px) scale(${blobScale})`,
                  transformOrigin: 'bottom left',
                }}
              />

              <div
                className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 md:w-[500px] md:h-[500px] rounded-full rounded-bl-[80px] sm:rounded-bl-[100px] md:rounded-bl-[200px]"
                style={{
                  ...getDecorativeBlobStyle(decorative_blob_color, '#ea728c'),
                  transform: `translate(${topShapeOffsetX}px, ${topShapeOffsetY}px) scale(${blobScale})`,
                  transformOrigin: 'top right',
                }}
              />
            </>
          )}

          {decorative_outline_enabled && (
            <>
              <div
                className="absolute -bottom-8 -left-8 sm:-bottom-[16px] sm:-left-[16px] md:-bottom-[25px] md:-left-[25px] w-[208px] h-[208px] sm:w-[288px] sm:h-[288px] md:w-[550px] md:h-[550px] border-[3px] sm:border-[4px] rounded-full rounded-tr-[80px] sm:rounded-tr-[100px] md:rounded-tr-[200px] opacity-80"
                style={{
                  borderColor: decorative_outline_color,
                  transform: `translate(${bottomShapeOffsetX}px, ${bottomShapeOffsetY}px) scale(${outlineScale})`,
                  transformOrigin: 'bottom left',
                }}
              />

              <div
                className="absolute -top-8 -right-8 sm:-top-[16px] sm:-right-[16px] md:-top-[25px] md:-right-[25px] w-[208px] h-[208px] sm:w-[288px] sm:h-[288px] md:w-[550px] md:h-[550px] border-[3px] sm:border-[4px] rounded-full rounded-bl-[80px] sm:rounded-bl-[100px] md:rounded-bl-[200px] opacity-80"
                style={{
                  borderColor: decorative_outline_color,
                  transform: `translate(${topShapeOffsetX}px, ${topShapeOffsetY}px) scale(${outlineScale})`,
                  transformOrigin: 'top right',
                }}
              />
            </>
          )}
        </div>
      )}

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
             <span className="text-[#ea728c] font-bold uppercase tracking-[0.2em]" style={badgeTextStyle}>
               {badge_text}
             </span>
             <div className="w-8 h-[2px] bg-[#ea728c]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="font-display text-whitexl sm:text-4xl lg:text-whitexl font-bold text-[#FFF0D9] leading-tight"
            style={{
              ...headingTextStyle,
              ...(sectionTextColor ? { color: sectionTextColor } : undefined),
            }}
          >
            {heading} <span className="text-[#ea728c]">{heading_highlight}</span> {heading_suffix}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#FFF0D9] text-sm sm:text-whitease font-medium mx-auto max-w-2xl"
            style={{
              ...descriptionTextStyle,
              ...(sectionTextColor ? { color: sectionTextColor } : undefined),
            }}
          >
            {subheading}
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
                   src={base_image || '/images/health/base-puppy.png'}
                   alt="Puppy Health Inspection Base"
                   fill
                   className="object-cover object-center"
                   sizes="(max-width: 1024px) 100vw, 60vw"
                   quality={90}
                />
                
                {/* Overlay Vignette/Gradient to make hotspots pop slightly */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />

                {/* ── Hotspot Pins ── */}
                {hotspotItems.map((spot) => {
                  const isActive = spot.id === safeActiveSpotId;
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
           {trustItems.map((item) => (
             <div key={item.id} className="flex items-center gap-2 bg-white/70 backdrop-blur-md rounded-2xl px-5 py-2.5 shadow-sm border border-white/50">
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

