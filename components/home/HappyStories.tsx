'use client';

import { useRef, useState, useEffect, useCallback, type CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { testimonials } from '@/data/testimonials';
import { Star, ChevronLeft, ChevronRight, MapPin, Quote, ArrowRight, BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getDecorativeBlobStyle } from '@/lib/decorative-color';
import { buildSectionStyle, resolveColorToken } from '@/lib/gradient-style';
import { toStorageOnlyImage } from '@/lib/storage-only-images';

type RawBlock = {
  id?: string;
  type?: string;
  settings?: Record<string, unknown>;
};

type StoryItem = {
  id: string;
  authorName: string;
  location: string;
  breedPurchased: string;
  rating: number;
  text: string;
  avatarPath: string;
};

type HappyStoriesProps = {
  badge_text?: string;
  heading?: string;
  heading_highlight?: string;
  accent_color?: string;
  card_border_color?: string;
  card_background_color?: string;
  author_name_text_size_px?: number | string;
  author_name_text_color?: string;
  location_text_size_px?: number | string;
  location_text_color?: string;
  breed_text_size_px?: number | string;
  breed_text_color?: string;
  rating_text_size_px?: number | string;
  rating_text_color?: string;
  rating_star_color?: string;
  subheading?: string;
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
  mobile_dot_active_color?: string;
  mobile_dot_inactive_color?: string;
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

function buildStoryItems(blocks: RawBlock[]): StoryItem[] {
  return blocks
    .filter((block) => block?.type === 'story_item' && block.settings)
    .map((block, index) => {
      const settings = block.settings as Record<string, unknown>;
      return {
        id: block.id || `story_item_${index}`,
        authorName: toText(settings.author_name, `Family ${index + 1}`),
        location: toText(settings.location, 'Bangalore'),
        breedPurchased: toText(settings.breed, 'Puppy'),
        rating: toNumber(settings.rating, 5),
        text: toText(settings.text, 'Wonderful experience with Dogs Paradise.'),
        avatarPath: toStorageOnlyImage(settings.image),
      };
    });
}

export default function HappyStories({
  badge_text = 'Real Customer Reviews',
  heading = 'Happy',
  heading_highlight = 'Stories',
  accent_color = '#ea728c',
  card_border_color = '#ffffff',
  card_background_color,
  author_name_text_size_px = 20,
  author_name_text_color,
  location_text_size_px = 10,
  location_text_color,
  breed_text_size_px = 10,
  breed_text_color,
  rating_text_size_px = 15,
  rating_text_color,
  rating_star_color,
  subheading = 'Real families, real puppies, real love. Hear from our happy puppy parents across India.',
  badge_text_size_px = 14,
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
  mobile_dot_active_color,
  mobile_dot_inactive_color,
}: HappyStoriesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const blockStories = buildStoryItems(blocks);
  const stories: StoryItem[] =
    blockStories.length > 0
      ? blockStories
      : testimonials.map((item, index) => ({
          id: item.id || `testimonial_${index}`,
          authorName: item.authorName,
          location: item.location,
          breedPurchased: item.breedPurchased,
          rating: typeof item.rating === 'number' ? item.rating : 5,
          text: item.text,
          avatarPath: toStorageOnlyImage(item.avatarPath),
        }));

  const sectionStyle = buildSectionStyle({
    background: section_bg_color,
    backgroundFallback: '#302b63',
    text: section_text_color,
    paddingTop: section_padding_top,
    paddingBottom: section_padding_bottom,
    marginTop: section_margin_top,
    marginBottom: section_margin_bottom,
  }) as CSSProperties & Record<string, string | number | undefined>;
  const sectionTextColor = resolveColorToken(section_text_color);
  const sectionAccentColor = resolveColorToken(accent_color, '#ea728c') || '#ea728c';
  const authorNameTextColor = resolveColorToken(author_name_text_color, '#ffffff') || '#ffffff';
  const locationTextColor = resolveColorToken(location_text_color, '#ffffff') || '#ffffff';
  const breedTextColor = resolveColorToken(breed_text_color, '#ffffff') || '#ffffff';
  const ratingTextColor = resolveColorToken(rating_text_color, '#FFF0D9') || '#FFF0D9';
  const ratingStarColor = resolveColorToken(rating_star_color, '#ffa600') || '#ffa600';
  const mobileDotActiveColor =
    resolveColorToken(mobile_dot_active_color, sectionAccentColor) || sectionAccentColor;
  const resolvedInactiveDotColor = resolveColorToken(mobile_dot_inactive_color);
  const mobileDotInactiveColor = resolvedInactiveDotColor || mobileDotActiveColor;
  const mobileDotInactiveOpacity = resolvedInactiveDotColor ? 1 : 0.24;
  const storyCardBorderColor =
    resolveColorToken(card_border_color || card_background_color, '#ffffff') || '#ffffff';
  sectionStyle['--section-accent'] = sectionAccentColor;

  const badgeSizeDesktop = clamp(toNumber(badge_text_size_px, 14), 10, 32);
  const badgeSizeMobile = clamp(Math.round(badgeSizeDesktop * 0.9), 10, badgeSizeDesktop);
  const headingSizeDesktop = clamp(toNumber(heading_text_size_px, 56), 24, 96);
  const headingSizeMobile = clamp(Math.round(headingSizeDesktop * 0.72), 20, headingSizeDesktop);
  const descriptionSizeDesktop = clamp(toNumber(description_text_size_px, 16), 12, 36);
  const descriptionSizeMobile = clamp(Math.round(descriptionSizeDesktop * 0.9), 12, descriptionSizeDesktop);
  const authorNameSizeDesktop = clamp(toNumber(author_name_text_size_px, 20), 12, 42);
  const authorNameSizeMobile = clamp(Math.round(authorNameSizeDesktop * 0.9), 10, authorNameSizeDesktop);
  const locationSizeDesktop = clamp(toNumber(location_text_size_px, 10), 8, 24);
  const locationSizeMobile = clamp(Math.round(locationSizeDesktop * 0.95), 8, locationSizeDesktop);
  const breedSizeDesktop = clamp(toNumber(breed_text_size_px, 10), 8, 24);
  const breedSizeMobile = clamp(Math.round(breedSizeDesktop * 0.95), 8, breedSizeDesktop);
  const ratingSizeDesktop = clamp(toNumber(rating_text_size_px, 15), 10, 28);
  const ratingSizeMobile = clamp(Math.round(ratingSizeDesktop * 0.95), 10, ratingSizeDesktop);

  const badgeTextStyle: CSSProperties = {
    fontSize: `clamp(${badgeSizeMobile}px, calc(${badgeSizeMobile - 1}px + 0.4vw), ${badgeSizeDesktop}px)`,
  };
  const headingTextStyle: CSSProperties = {
    fontSize: `clamp(${headingSizeMobile}px, calc(${headingSizeMobile - 4}px + 1.2vw), ${headingSizeDesktop}px)`,
  };
  const descriptionTextStyle: CSSProperties = {
    fontSize: `clamp(${descriptionSizeMobile}px, calc(${descriptionSizeMobile - 1}px + 0.3vw), ${descriptionSizeDesktop}px)`,
  };
  const authorNameTextStyle: CSSProperties = {
    fontSize: `clamp(${authorNameSizeMobile}px, calc(${authorNameSizeMobile - 1}px + 0.35vw), ${authorNameSizeDesktop}px)`,
  };
  const locationTextStyle: CSSProperties = {
    fontSize: `clamp(${locationSizeMobile}px, calc(${locationSizeMobile - 1}px + 0.2vw), ${locationSizeDesktop}px)`,
  };
  const breedTextStyle: CSSProperties = {
    fontSize: `clamp(${breedSizeMobile}px, calc(${breedSizeMobile - 1}px + 0.2vw), ${breedSizeDesktop}px)`,
  };
  const ratingTextStyle: CSSProperties = {
    fontSize: `clamp(${ratingSizeMobile}px, calc(${ratingSizeMobile - 1}px + 0.2vw), ${ratingSizeDesktop}px)`,
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

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
      const card = scrollRef.current.querySelector('[data-card]');
      const cardWidth = card ? card.clientWidth + 24 : 300;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setActiveIndex(Math.min(newIndex, stories.length - 1));
    }
  }, [stories.length]);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [checkScroll]);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      scrollRef.current.scrollBy({
        left: dir === 'left' ? -clientWidth * 0.85 : clientWidth * 0.85,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      className="relative overflow-hidden pt-6 pb-16 sm:pt-10 sm:pb-24"
      id="happy-stories"
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
        {/* ━━━ Section Header — Same pattern as BreedExplorer ━━━ */}
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

              {/* View All - MOBILE ONLY */}
              <Link
                href="#flip-discover"
                className="lg:hidden text-sm font-bold text-[var(--section-accent)] hover:text-[var(--section-accent)] transition-all flex items-center gap-1 group/link"
              >
                <span className="border-b-2 border-transparent group-hover/link:border-[var(--section-accent)] pb-0.5 transition-all">
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
              className="font-display text-4xl sm:text-4xl lg:text-5xl font-bold text-[#FFF0D9] leading-tight"
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
              className="mt-4 text-[#FFF0D9] text-sm sm:text-base max-w-lg font-medium"
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
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={cn(
                  "p-2.5 rounded-2xl border-2 transition-all duration-200",
                  canScrollLeft
                    ? "border-[color:var(--section-accent)] text-[var(--section-accent)] hover:bg-[var(--section-accent)] hover:text-white hover:border-[var(--section-accent)]"
                    : "border-[#c4a882]/30 text-[#c4a882] cursor-default"
                )}
                aria-label="Scroll left"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={cn(
                  "p-2.5 rounded-2xl border-2 transition-all duration-200",
                  canScrollRight
                    ? "border-[color:var(--section-accent)] text-[var(--section-accent)] hover:bg-[var(--section-accent)] hover:text-white hover:border-[var(--section-accent)]"
                    : "border-[#c4a882]/30 text-[#c4a882] cursor-default"
                )}
                aria-label="Scroll right"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* View All - DESKTOP ONLY */}
            <Link
              href="#flip-discover"
              className="hidden lg:flex text-sm font-bold text-[var(--section-accent)] hover:text-[var(--section-accent)] transition-all items-center gap-2 group/link-desktop"
            >
              <span className="border-b-2 border-transparent group-hover/link-desktop:border-[var(--section-accent)] pb-0.5 transition-all">
                View All
              </span>
              <ArrowRight size={16} className="transition-transform group-hover/link-desktop:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* ━━━ Cards Carousel ━━━ */}
        <div className="relative group/carousel">
          {/* Mobile Navigation Arrows */}
          <div className="lg:hidden pointer-events-none absolute inset-x-[-14px] top-0 z-30 flex h-[50%] items-center justify-between px-2">
            <AnimatePresence>
              {canScrollLeft && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => scroll('left')}
                  className="pointer-events-auto p-2 rounded-2xl bg-white/60 border border-white/80 backdrop-blur-md text-[var(--section-accent)] shadow-lg ml-1"
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
                  className="pointer-events-auto p-2 rounded-2xl bg-white/60 border border-white/80 backdrop-blur-md text-[var(--section-accent)] shadow-lg mr-1"
                >
                  <ChevronRight size={22} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Scrollable Row */}
          <div
            ref={scrollRef}
            className="flex gap-6 sm:gap-10 overflow-x-auto hide-scrollbar pb-10 snap-x snap-mandatory -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0"
          >
            {stories.map((story, index) => (
              <motion.div
                key={story.id}
                data-card
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ delay: Math.min(index * 0.08, 0.4), duration: 0.6 }}
                className="shrink-0 w-[340px] sm:w-[480px] lg:w-[calc(33.33%-20px)] snap-start px-4"
              >
                <StoryCard
                  story={story}
                  index={index}
                  cardBorderColor={storyCardBorderColor}
                  accentColor={sectionAccentColor}
                  authorNameTextColor={authorNameTextColor}
                  authorNameTextStyle={authorNameTextStyle}
                  locationTextColor={locationTextColor}
                  locationTextStyle={locationTextStyle}
                  breedTextColor={breedTextColor}
                  breedTextStyle={breedTextStyle}
                  ratingTextColor={ratingTextColor}
                  ratingTextStyle={ratingTextStyle}
                  ratingStarColor={ratingStarColor}
                />
              </motion.div>
            ))}
          </div>

          {/* Progress Indicators (Mobile) */}
          <div className="flex justify-center gap-2 mt-4 lg:hidden">
            {stories.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (scrollRef.current) {
                    const card = scrollRef.current.querySelector('[data-card]');
                    const cardWidth = card ? card.clientWidth + 32 : 360;
                    scrollRef.current.scrollTo({
                      left: i * cardWidth,
                      behavior: 'smooth',
                    });
                  }
                }}
                className={cn(
                  'h-1.5 rounded-2xl transition-all duration-300',
                  activeIndex === i ? 'w-8' : 'w-1.5'
                )}
                style={{
                  backgroundColor: activeIndex === i ? mobileDotActiveColor : mobileDotInactiveColor,
                  opacity: activeIndex === i ? 1 : mobileDotInactiveOpacity,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ━━━━━━━━━━ Story Card — Modern Editorial Bento ━━━━━━━━━━ */
function StoryCard({
  story,
  index,
  cardBorderColor,
  accentColor,
  authorNameTextColor,
  authorNameTextStyle,
  locationTextColor,
  locationTextStyle,
  breedTextColor,
  breedTextStyle,
  ratingTextColor,
  ratingTextStyle,
  ratingStarColor,
}: {
  story: StoryItem;
  index: number;
  cardBorderColor: string;
  accentColor: string;
  authorNameTextColor: string;
  authorNameTextStyle: CSSProperties;
  locationTextColor: string;
  locationTextStyle: CSSProperties;
  breedTextColor: string;
  breedTextStyle: CSSProperties;
  ratingTextColor: string;
  ratingTextStyle: CSSProperties;
  ratingStarColor: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Auras based on breed "personality" or just variety
  const auras = ['bg-[#ea728c]/15', 'bg-[#4caf50]/15', 'bg-[#ffa600]/15', 'bg-[#9333ea]/15'];
  const auraColor = auras[index % auras.length];

  const isLongText = story.text.length > 120;

  return (
    <motion.div 
      className="flex flex-col items-center group relative mt-8"
      initial={false}
      whileHover={{ y: -8 }}
    >
      {/* ── Background Aura Glow ── */}
      <div className={cn(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-2xl blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0",
        auraColor
      )} />

      {/* ── Portrait Frame (4:5 Ratio) ── */}
      <div className="relative w-full aspect-[4/5] max-w-[420px] mx-auto z-10 isolate">
        
        {/* Main Image Container — High-end rounded corners */}
        <div
          className="absolute inset-0 overflow-hidden rounded-2xl border-[10px] bg-[#FFF0D9] shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-all duration-700 group-hover:shadow-[0_40px_80px_rgba(212,96,74,0.15)]"
          style={{ borderColor: cardBorderColor }}
        >
          
          {/* Steady Portrait Image */}
          <div className="h-full w-full relative">
            <Image
              src={toStorageOnlyImage(story.avatarPath)}
              alt={story.authorName}
              fill
              className="object-cover object-top"
              sizes="(max-width: 640px) 400px, 500px"
              quality={95}
            />
          </div>

          {/* ────── Internal Overlays (Glassmorphism) ────── */}

          {/* 1. Verification Badge — Top Left */}
          <div className="absolute top-6 left-6 z-20">
            <div className="bg-white/90 backdrop-blur-md shadow-[0_8px_20px_rgba(0,0,0,0.12)] rounded-2xl p-2.5 border border-white/50 animate-pulse-slow">
              <BadgeCheck size={22} className="text-[#0095f6] fill-white" />
            </div>
          </div>

          {/* 2. Rating — Top Right */}
          <div className="absolute top-6 right-6 z-20">
            <div className="bg-white/95 shadow-[0_8px_20px_rgba(0,0,0,0.12)] rounded-2xl px-3.5 py-2 flex items-center gap-1.5 border border-white">
              <Star size={14} style={{ color: ratingStarColor, fill: ratingStarColor }} />
              <span className="font-black" style={{ ...ratingTextStyle, color: ratingTextColor }}>
                {story.rating}.0
              </span>
            </div>
          </div>

          {/* 3. Gradient Footer Overlays (Bottom corners) */}
          <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10 pointer-events-none" />
          
          {/* 3a. Name & Location — Bottom Left (Matches User Request) */}
          <div className="absolute bottom-6 left-6 z-20">
            <div className="flex flex-col items-start text-left translate-y-2">
              <span
                className="font-black leading-tight tracking-tight drop-shadow-md"
                style={{ ...authorNameTextStyle, color: authorNameTextColor }}
              >
                {story.authorName}
              </span>
              <div className="flex items-center gap-1.5 mt-1.5 opacity-90 transition-opacity group-hover:opacity-100">
                  <MapPin size={10} style={{ color: locationTextColor || accentColor }} />
                 <span className="font-bold uppercase tracking-[0.25em]" style={{ ...locationTextStyle, color: locationTextColor }}>
                   {story.location}
                 </span>
              </div>
            </div>
          </div>

          {/* 3b. Breed — Bottom Right */}
          <div className="absolute bottom-6 right-6 z-20">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl px-3 py-1.5 border border-white/30 transition-transform group-hover:scale-105">
              <span className="font-black uppercase tracking-wider drop-shadow-sm" style={{ ...breedTextStyle, color: breedTextColor }}>
                {story.breedPurchased}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── DESIGNED Review Text Section — BELOW Image ── */}
      <div className="mt-8 w-full px-8 text-center relative z-20">
        <motion.div 
          layout
          className="max-w-[340px] mx-auto text-center"
        >
          {/* Decorative Minimal Quote */}
          <div className="relative inline-block mb-3 opacity-100">
             <Quote size={24} fill="currentColor" style={{ color: accentColor }} />
          </div>

          {/* The Story Paragraph with Line-Clamp */}
          <motion.p 
            layout
            className={cn(
               "text-[15px] sm:text-[16px] leading-[1.75] text-[#FFF0D9] font-medium selection:bg-[#ea728c]/20 transition-all duration-300",
               !isExpanded && isLongText && "line-clamp-3 italic opacity-80"
            )}
          >
            &quot;{story.text}&quot;
          </motion.p>

          {/* Interactive Toggle Button */}
          {isLongText && (
             <motion.button
               onClick={() => setIsExpanded(!isExpanded)}
               className="mt-4 text-[11px] font-black uppercase tracking-widest transition-colors flex items-center gap-1.5 mx-auto py-1 px-4 rounded-2xl bg-white/5 hover:bg-white/10"
               style={{ color: accentColor }}
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
             >
               {isExpanded ? 'Close Story' : 'Read Full Story'}
               <motion.span 
                 animate={{ rotate: isExpanded ? 180 : 0 }}
                 className="inline-block"
               >
                 ↓
               </motion.span>
             </motion.button>
          )}

          <div className="w-8 h-[2px] mx-auto mt-6 rounded-full" style={{ backgroundColor: accentColor, opacity: 0.24 }} />
        </motion.div>
      </div>
    </motion.div>
  );
}
