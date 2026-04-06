'use client';

import { useRef, useState, useEffect, type CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { dogs } from '@/data/dogs';
import { ArrowRight, ChevronLeft, ChevronRight, Star, Heart } from 'lucide-react';
import { getDecorativeBlobStyle } from '@/lib/decorative-color';
import { buildSectionStyle, resolveColorToken } from '@/lib/gradient-style';

type RawBlock = {
  id?: string;
  type?: string;
  settings?: Record<string, unknown>;
};

type BreedCardItem = {
  id: string;
  title: string;
  url: string;
  image: string;
  gender: 'male' | 'female';
  isBestSeller: boolean;
  badgeText: string;
};

type BreedExplorerProps = {
  heading?: string;
  heading_highlight?: string;
  accent_color?: string;
  accent_background_color?: string;
  accent_hover_color?: string;
  card_border_color?: string;
  subheading?: string;
  badge_text?: string;
  badge_text_size?: string;
  badge_text_size_px?: number | string;
  heading_text_size_px?: number | string;
  description_text_size_px?: number | string;
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

function toText(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

function toNumber(value: unknown): number | null {
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return null;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function buildBreedCards(blocks: RawBlock[]): BreedCardItem[] {
  return blocks
    .filter((block) => block?.type === 'breed_card' && block.settings)
    .map((block, index) => {
      const settings = block.settings as Record<string, unknown>;
      const rawGender = toText(settings.gender, 'male').toLowerCase();
      return {
        id: block.id || `breed_card_${index}`,
        title: toText(settings.title, `Breed ${index + 1}`),
        url: toText(settings.url, '/breeds'),
        image: toText(settings.image, '/images/breeds/golden-retriever.jpg'),
        gender: rawGender === 'female' ? 'female' : 'male',
        isBestSeller: Boolean(settings.is_best_seller),
        badgeText: toText(settings.badge_text, 'Best Seller'),
      };
    });
}

// Priority breeds first, then the rest
const priorityBreedNames = [
  'Toy Poodle', 'Maltipoo', 'Golden Retriever', 'Bichon Frise', 'Shih Tzu', 'Siberian Husky'
];

const allSortedDogs = [...dogs].sort((a, b) => {
  const aIdx = priorityBreedNames.indexOf(a.breedName);
  const bIdx = priorityBreedNames.indexOf(b.breedName);
  if (aIdx > -1 && bIdx > -1) return aIdx - bIdx;
  if (aIdx > -1) return -1;
  if (bIdx > -1) return 1;
  return 0;
});

export default function BreedExplorer({
  heading = 'Top Selling',
  heading_highlight = 'Dogs',
  accent_color = '#ea728c',
  accent_background_color,
  accent_hover_color,
  card_border_color = '#ffffff',
  subheading = 'Our most loved breeds, handpicked by families across Bangalore and beyond.',
  badge_text = 'Most Requested',
  badge_text_size = 'medium',
  badge_text_size_px,
  heading_text_size_px = 56,
  description_text_size_px = 16,
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
}: BreedExplorerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
  const sectionAccentColor = resolveColorToken(accent_color, '#ea728c') || '#ea728c';
  const sectionAccentBackgroundColor =
    resolveColorToken(accent_background_color, sectionAccentColor) || sectionAccentColor;
  const explicitAccentHoverColor = resolveColorToken(accent_hover_color);
  const hasCustomAccentHoverColor = Boolean(explicitAccentHoverColor);
  const sectionAccentHoverColor =
    explicitAccentHoverColor || sectionAccentColor;
  const cardBorderColor = resolveColorToken(card_border_color, '#ffffff') || '#ffffff';
  sectionStyle['--section-accent' as const] = sectionAccentColor;
  sectionStyle['--section-accent-bg' as const] = sectionAccentBackgroundColor;
  sectionStyle['--section-accent-hover' as const] = sectionAccentHoverColor;

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

  const normalizedLegacyBadgeSize =
    typeof badge_text_size === 'string' ? badge_text_size.toLowerCase().trim() : 'medium';
  const legacyBadgePx =
    normalizedLegacyBadgeSize === 'large' ? 16 : normalizedLegacyBadgeSize === 'small' ? 12 : 14;
  const parsedBadgeSizePx = toNumber(badge_text_size_px);
  const parsedHeadingSizePx = toNumber(heading_text_size_px);
  const parsedDescriptionSizePx = toNumber(description_text_size_px);

  const badgeSizeDesktop = clamp(parsedBadgeSizePx ?? legacyBadgePx, 10, 32);
  const badgeSizeMobile = clamp(Math.round(badgeSizeDesktop * 0.9), 10, badgeSizeDesktop);
  const headingSizeDesktop = clamp(parsedHeadingSizePx ?? 56, 24, 96);
  const headingSizeMobile = clamp(Math.round(headingSizeDesktop * 0.72), 20, headingSizeDesktop);
  const descriptionSizeDesktop = clamp(parsedDescriptionSizePx ?? 16, 12, 36);
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

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      return () => el.removeEventListener('scroll', checkScroll);
    }
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      scrollRef.current.scrollBy({
        left: dir === 'left' ? -clientWidth * 0.8 : clientWidth * 0.8,
        behavior: 'smooth',
      });
    }
  };

  const blockCards = buildBreedCards(blocks);
  const cards: BreedCardItem[] =
    blockCards.length > 0
      ? blockCards
      : allSortedDogs.map((dog) => ({
          id: dog.id,
          title: dog.breedName,
          url: `/breeds/${dog.slug}`,
          image: dog.thumbnailImage,
          gender: dog.gender === 'female' ? 'female' : 'male',
          isBestSeller: priorityBreedNames.includes(dog.breedName),
          badgeText: 'Best Seller',
        }));

  return (
    <section className="relative overflow-hidden pt-6 pb-16 sm:pt-10 sm:pb-24" id="breed-explorer" style={sectionStyle}>
      {/* Background Decorative Blobs */}
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
        {/* Section Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between mb-12 sm:mb-16">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-between gap-3 mb-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-[2px] bg-[var(--section-accent)]" />
                <span className="text-[var(--section-accent)] font-bold uppercase tracking-[0.2em]" style={badgeTextStyle}>
                  {badge_text}
                </span>
              </div>

              {/* View All - MOBILE ONLY (shown next to label) */}
              <Link
                href="/breeds"
                className={`lg:hidden text-sm font-bold text-[var(--section-accent)] transition-all flex items-center gap-1 group/link ${
                  hasCustomAccentHoverColor
                    ? 'hover:text-[var(--section-accent-hover)]'
                    : 'hover:text-[var(--section-accent)]'
                }`}
              >
                <span
                  className={`border-b-2 border-transparent pb-0.5 transition-all ${
                    hasCustomAccentHoverColor
                      ? 'group-hover/link:border-[var(--section-accent-hover)]'
                      : 'group-hover/link:border-[var(--section-accent)]'
                  }`}
                >
                  View All
                </span>
                <ArrowRight size={14} className="transition-transform group-hover/link:translate-x-1" />
              </Link>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FFF0D9] leading-tight"
              style={{
                ...headingTextStyle,
                ...(sectionTextColor ? { color: sectionTextColor } : undefined),
              }}
            >
              {heading} <span className="text-[var(--section-accent)]">{heading_highlight}</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-[#FFF0D9]/80 text-sm sm:text-base max-w-lg font-medium"
              style={{
                ...descriptionTextStyle,
                ...(sectionTextColor ? { color: sectionTextColor } : undefined),
              }}
            >
              {subheading}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-4"
          >
            {/* Desktop-only Navigation (redundant due to mobile arrows but good for desktop) */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={cn(
                  "p-2.5 rounded-full border-2 transition-all duration-200",
                  canScrollLeft
                    ? `border-[color:var(--section-accent)] text-[var(--section-accent)] ${
                        hasCustomAccentHoverColor
                          ? 'hover:bg-[var(--section-accent-hover)] hover:text-white'
                          : 'hover:bg-[var(--section-accent)] hover:text-white'
                      }`
                    : "border-[#FFF0D9]/30 text-[#FFF0D9]/50 cursor-default"
                )}
                aria-label="Scroll left"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={cn(
                  "p-2.5 rounded-full border-2 transition-all duration-200",
                  canScrollRight
                    ? `border-[color:var(--section-accent)] text-[var(--section-accent)] ${
                        hasCustomAccentHoverColor
                          ? 'hover:bg-[var(--section-accent-hover)] hover:text-white'
                          : 'hover:bg-[var(--section-accent)] hover:text-white'
                      }`
                    : "border-[#FFF0D9]/30 text-[#FFF0D9]/50 cursor-default"
                )}
                aria-label="Scroll right"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* View All - DESKTOP ONLY (Original right position) */}
            <Link
              href="/breeds"
              className={`hidden lg:flex text-sm font-bold text-[var(--section-accent)] transition-all items-center gap-2 group/link-desktop ${
                hasCustomAccentHoverColor
                  ? 'hover:text-[var(--section-accent-hover)]'
                  : 'hover:text-[var(--section-accent)]'
              }`}
            >
              <span
                className={`border-b-2 border-transparent pb-0.5 transition-all ${
                  hasCustomAccentHoverColor
                    ? 'group-hover/link-desktop:border-[var(--section-accent-hover)]'
                    : 'group-hover/link-desktop:border-[var(--section-accent)]'
                }`}
              >
                View All
              </span>
              <ArrowRight size={16} className="transition-transform group-hover/link-desktop:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* The Carousel Container */}
        <div className="relative group/carousel">

          {/* UNIQUE MOBILE NAVIGATION ARROWS - Pinned to the edges of the visible card area */}
          <div className="lg:hidden pointer-events-none absolute inset-y-0 inset-x-[-14px] z-30 flex items-center justify-between px-2">
            <AnimatePresence>
              {canScrollLeft && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => scroll('left')}
                  className="pointer-events-auto p-2 rounded-full bg-white/60 border border-white/80 backdrop-blur-md text-[var(--section-accent)] shadow-lg ml-1"
                >
                  <ChevronLeft size={22} />
                </motion.button>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {canScrollRight && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => scroll('right')}
                  className="pointer-events-auto p-2 rounded-full bg-white/60 border border-white/80 backdrop-blur-md text-[var(--section-accent)] shadow-lg mr-1"
                >
                  <ChevronRight size={22} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Cards Row */}
          <div
            ref={scrollRef}
            className="flex gap-6 sm:gap-8 overflow-x-auto hide-scrollbar pb-10 snap-x snap-mandatory -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0"
          >
            {cards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ delay: Math.min(index * 0.1, 0.4), duration: 0.6 }}
                className="shrink-0 w-[280px] sm:w-[320px] lg:w-[calc(33.333%-22px)] snap-start"
              >
                <BreedCard
                  card={card}
                  accentColor={sectionAccentColor}
                  accentBackgroundColor={sectionAccentBackgroundColor}
                  cardBorderColor={cardBorderColor}
                />
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

function BreedCard({
  card,
  accentColor,
  accentBackgroundColor,
  cardBorderColor,
}: {
  card: BreedCardItem;
  accentColor: string;
  accentBackgroundColor: string;
  cardBorderColor: string;
}) {
  const isPriority = card.isBestSeller;

  return (
    <Link href={card.url} className="block group">
      <div className="flex flex-col items-center">
        {/* Fixed Round-Square Image */}
        <div className="relative w-full aspect-[3/4]">
          {/* Soft-square container */}
          <motion.div
            className="absolute inset-0 rounded-3xl overflow-hidden border-[6px] bg-[#FFF0D9] shadow-xl group-hover:shadow-2xl transition-all duration-500"
            style={{ borderColor: cardBorderColor }}
          >
            {/* Image */}
            <Image
              src={card.image}
              alt={card.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 280px, 320px"
            />

            {/* Subtle bottom gradient gradient for general depth */}
            <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-10" />

            {/* Best Seller Badge - Re-styled & repositioned inside top */}
            {isPriority && (
              <div className="absolute top-[12%] left-[10%] z-20">
                <span
                  className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-white shadow-lg border border-white/20"
                  style={{ backgroundColor: accentBackgroundColor }}
                >
                  <Star size={9} className="fill-white" />
                  {card.badgeText}
                </span>
              </div>
            )}

            {/* MODERN FLOATING INFO CARD */}
            <div className="absolute bottom-[10%] left-[10%] right-[10%] z-30">
              <motion.div
                className="w-full bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-4 shadow-2xl flex flex-col items-center text-center transition-colors duration-300"
              >
                <h3 className="font-display text-lg sm:text-xl font-black text-[#302b63] italic leading-none mb-1">
                  {card.title}
                </h3>

                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-[#302b63]/70">
                  <span>{card.gender === 'male' ? 'Male' : 'Female'}</span>
                  <div className="w-1 h-1 rounded-full" style={{ backgroundColor: accentColor }} />
                  <span className="flex items-center gap-1">
                    <Heart size={10} style={{ color: accentColor, fill: accentColor }} />
                    Certified
                  </span>
                </div>
              </motion.div>
            </div>

          </motion.div>
        </div>
      </div>
    </Link>
  );
}

