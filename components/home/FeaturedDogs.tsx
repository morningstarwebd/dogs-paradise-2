'use client';

import { useRef, useState, useEffect, type CSSProperties } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Dog } from '@/types';
import { buildSectionStyle, resolveColorToken } from '@/lib/gradient-style';
import { toStorageOnlyImage } from '@/lib/storage-only-images';

type RawBlock = {
  id?: string;
  type?: string;
  settings?: Record<string, unknown>;
};

type FeaturedBreedItem = {
  id: string;
  title: string;
  url: string;
  image: string;
  accentColor: string;
  showBadge: boolean;
  badgeText: string;
};

type FeaturedDogsProps = {
  dogs?: Dog[];
  badge_text?: string;
  show_badge_text?: boolean;
  show_badge_line?: boolean;
  badge_text_color?: string;
  heading?: string;
  heading_highlight?: string;
  accent_color?: string;
  accent_background_color?: string;
  accent_hover_color?: string;
  heading_text_color?: string;
  heading_highlight_color?: string;
  subheading?: string;
  subheading_text_color?: string;
  show_all_btn_text?: string;
  show_all_btn_url?: string;
  show_all_btn_color?: string;
  default_breed_card_accent_color?: string;
  all_tile_outer_bg_color?: string;
  all_tile_inner_bg_color?: string;
  all_tile_inner_border_color?: string;
  all_tile_inner_text_color?: string;
  badge_text_size_px?: number | string;
  heading_text_size_px?: number | string;
  description_text_size_px?: number | string;
  priority_badge_bg_color?: string;
  priority_badge_text_color?: string;
  priority_badge_text_size_px?: number | string;
  breed_title_text_size_px?: number | string;
  breed_title_text_color?: string;
  breed_image_size_px?: number | string;
  breed_card_bg_color?: string;
  blocks?: RawBlock[];
  section_bg_color?: string;
  section_text_color?: string;
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

function buildFeaturedBreedItems(blocks: RawBlock[], fallbackAccentColor: string): FeaturedBreedItem[] {
  return blocks
    .filter((block) => block?.type === 'featured_breed' && block.settings)
    .map((block, index) => {
      const settings = block.settings as Record<string, unknown>;
      const configuredAccentColor = resolveColorToken(settings.accent_color);
      const usesLegacyDefaultAccent =
        typeof configuredAccentColor === 'string' &&
        configuredAccentColor.trim().toLowerCase() === '#ea728c';
      return {
        id: block.id || `featured_breed_${index}`,
        title: toText(settings.title, `Featured Breed ${index + 1}`),
        url: toText(settings.url, '/breeds'),
        image: toStorageOnlyImage(settings.image),
        accentColor: usesLegacyDefaultAccent
          ? fallbackAccentColor
          : configuredAccentColor || fallbackAccentColor,
        showBadge: Boolean(settings.show_badge),
        badgeText: toText(settings.badge_text, 'Best Seller'),
      };
    });
}

export default function FeaturedDogs({ 
  dogs = [],
  badge_text = 'Find Your Best Friend',
  show_badge_text = true,
  show_badge_line = true,
  badge_text_color,
  heading = 'Explore',
  heading_highlight = 'Breeds',
  accent_color,
  accent_background_color,
  accent_hover_color,
  heading_text_color,
  heading_highlight_color,
  subheading = 'Healthy, home-raised puppies from champion bloodlines.',
  subheading_text_color,
  show_all_btn_text = 'View All',
  show_all_btn_url = '/breeds',
  show_all_btn_color,
  default_breed_card_accent_color = '#ea728c',
  all_tile_outer_bg_color = '#dcfce7',
  all_tile_inner_bg_color = '#ffedd5',
  all_tile_inner_border_color = '#fed7aa',
  all_tile_inner_text_color = '#ea580c',
  badge_text_size_px = 14,
  heading_text_size_px = 56,
  description_text_size_px = 16,
  priority_badge_bg_color = '#ea728c',
  priority_badge_text_color = '#ffffff',
  priority_badge_text_size_px = 9,
  breed_title_text_size_px = 14,
  breed_title_text_color,
  breed_image_size_px = 96,
  breed_card_bg_color = '#ffffff',
  blocks = [],
  section_bg_color,
  section_text_color,
  section_padding_top,
  section_padding_bottom,
  section_margin_top,
  section_margin_bottom,
}: FeaturedDogsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  const sectionStyle = {
    ...buildSectionStyle({
    background: section_bg_color,
    backgroundFallback: '#302b63',
    text: section_text_color,
    paddingTop: section_padding_top,
    paddingBottom: section_padding_bottom,
    marginTop: section_margin_top,
    marginBottom: section_margin_bottom,
    }),
  } as CSSProperties & Record<string, string | number | undefined>;
  const sectionTextColor = resolveColorToken(section_text_color);
  const sectionAccentColor =
    resolveColorToken(accent_color || priority_badge_bg_color, '#ea728c') || '#ea728c';
  const sectionAccentBackgroundColor =
    resolveColorToken(accent_background_color, sectionAccentColor) || sectionAccentColor;
  const explicitAccentHoverColor = resolveColorToken(accent_hover_color);
  const hasCustomAccentHoverColor = Boolean(explicitAccentHoverColor);
  const sectionAccentHoverColor =
    explicitAccentHoverColor || sectionAccentColor;
  const headingTextColor =
    resolveColorToken(heading_text_color, sectionTextColor || '#FFF0D9') || sectionTextColor || '#FFF0D9';
  const headingHighlightColor =
    resolveColorToken(heading_highlight_color, sectionAccentColor) || sectionAccentColor;
  const subheadingTextColor =
    resolveColorToken(subheading_text_color, sectionTextColor || '#FFF0D9') || sectionTextColor || '#FFF0D9';
  const badgeTextColor = resolveColorToken(badge_text_color, sectionAccentColor) || sectionAccentColor;
  const viewAllButtonColor = resolveColorToken(show_all_btn_color, sectionAccentColor) || sectionAccentColor;
  const defaultBreedCardAccentColor =
    resolveColorToken(default_breed_card_accent_color, sectionAccentBackgroundColor) || sectionAccentBackgroundColor;
  const breedTitleTextColor =
    resolveColorToken(breed_title_text_color, sectionTextColor || '#FFF0D9') ||
    sectionTextColor ||
    '#FFF0D9';
  const breedCardBackgroundColor = resolveColorToken(breed_card_bg_color, '#ffffff') || '#ffffff';
  const allTileOuterBgColor = resolveColorToken(all_tile_outer_bg_color, '#dcfce7') || '#dcfce7';
  const allTileInnerBgColor = resolveColorToken(all_tile_inner_bg_color, '#ffedd5') || '#ffedd5';
  const allTileInnerBorderColor =
    resolveColorToken(all_tile_inner_border_color, '#fed7aa') || '#fed7aa';
  const allTileInnerTextColor = resolveColorToken(all_tile_inner_text_color, '#ea580c') || '#ea580c';
  const resolvedViewAllUrl = toText(show_all_btn_url, '/breeds');
  const shouldShowBadgeText =
    show_badge_text && typeof badge_text === 'string' && badge_text.trim().length > 0;
  const shouldShowBadgeLine = show_badge_line;

  sectionStyle['--section-accent'] = sectionAccentColor;
  sectionStyle['--section-accent-bg'] = sectionAccentBackgroundColor;
  sectionStyle['--section-accent-hover'] = sectionAccentHoverColor;
  sectionStyle['--featured-badge-color'] = badgeTextColor;
  sectionStyle['--featured-view-all-color'] = viewAllButtonColor;
  sectionStyle['--featured-breed-title-color'] = breedTitleTextColor;

  const parsedBadgeSizePx = toNumber(badge_text_size_px);
  const parsedHeadingSizePx = toNumber(heading_text_size_px);
  const parsedDescriptionSizePx = toNumber(description_text_size_px);
  const parsedPriorityBadgeSizePx = toNumber(priority_badge_text_size_px);
  const parsedBreedTitleSizePx = toNumber(breed_title_text_size_px);
  const parsedBreedImageSizePx = toNumber(breed_image_size_px);

  const badgeSizeDesktop = clamp(parsedBadgeSizePx ?? 14, 10, 32);
  const badgeSizeMobile = clamp(Math.round(badgeSizeDesktop * 0.9), 10, badgeSizeDesktop);
  const headingSizeDesktop = clamp(parsedHeadingSizePx ?? 56, 24, 96);
  const headingSizeMobile = clamp(Math.round(headingSizeDesktop * 0.72), 20, headingSizeDesktop);
  const descriptionSizeDesktop = clamp(parsedDescriptionSizePx ?? 16, 12, 36);
  const descriptionSizeMobile = clamp(Math.round(descriptionSizeDesktop * 0.9), 12, descriptionSizeDesktop);
  const priorityBadgeSizeDesktop = clamp(parsedPriorityBadgeSizePx ?? 9, 8, 24);
  const priorityBadgeSizeMobile = clamp(Math.round(priorityBadgeSizeDesktop * 0.95), 8, priorityBadgeSizeDesktop);
  const breedTitleSizeDesktop = clamp(parsedBreedTitleSizePx ?? 14, 10, 28);
  const breedTitleSizeMobile = clamp(Math.round(breedTitleSizeDesktop * 0.93), 10, breedTitleSizeDesktop);
  const breedImageSizeDesktop = clamp(parsedBreedImageSizePx ?? 96, 64, 180);
  const breedImageSizeMobile = clamp(Math.round(breedImageSizeDesktop * 0.83), 56, breedImageSizeDesktop);

  const badgeTextStyle: CSSProperties = {
    fontSize: `clamp(${badgeSizeMobile}px, calc(${badgeSizeMobile - 1}px + 0.4vw), ${badgeSizeDesktop}px)`,
  };
  const headingTextStyle: CSSProperties = {
    fontSize: `clamp(${headingSizeMobile}px, calc(${headingSizeMobile - 4}px + 1.2vw), ${headingSizeDesktop}px)`,
  };
  const descriptionTextStyle: CSSProperties = {
    fontSize: `clamp(${descriptionSizeMobile}px, calc(${descriptionSizeMobile - 1}px + 0.3vw), ${descriptionSizeDesktop}px)`,
  };
  const priorityBadgeTextStyle: CSSProperties = {
    fontSize: `clamp(${priorityBadgeSizeMobile}px, calc(${priorityBadgeSizeMobile - 1}px + 0.2vw), ${priorityBadgeSizeDesktop}px)`,
  };
  const breedTitleTextStyle: CSSProperties = {
    fontSize: `clamp(${breedTitleSizeMobile}px, calc(${breedTitleSizeMobile - 1}px + 0.25vw), ${breedTitleSizeDesktop}px)`,
  };
  const breedImageStyle: CSSProperties = {
    width: `clamp(${breedImageSizeMobile}px, calc(${breedImageSizeMobile - 6}px + 1vw), ${breedImageSizeDesktop}px)`,
    height: `clamp(${breedImageSizeMobile}px, calc(${breedImageSizeMobile - 6}px + 1vw), ${breedImageSizeDesktop}px)`,
  };

  // Auto scroll effect
  useEffect(() => {
    if (!isAutoScrolling) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 160, behavior: 'smooth' });
        }
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [isAutoScrolling]);

  const stopAutoScroll = () => {
    setIsAutoScrolling(false);
  };

  const scroll = (direction: 'left' | 'right') => {
    stopAutoScroll();
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth'
      });
    }
  };

  // Sort breeds to put priority breeds first (matching the chat sequence)
  const priorityOrder = [
    'Toy Poodle', 'Maltipoo', 'Golden Retriever', 'Bichon Frise', 'Shih Tzu', 'Siberian Husky'
  ];

  const sortedDogs = [...dogs].sort((a, b) => {
    const aIndex = priorityOrder.indexOf(a.breedName);
    const bIndex = priorityOrder.indexOf(b.breedName);
    if (aIndex > -1 && bIndex > -1) return aIndex - bIndex;
    if (aIndex > -1) return -1;
    if (bIndex > -1) return 1;
    return 0;
  });

  const blockItems = buildFeaturedBreedItems(blocks, defaultBreedCardAccentColor);
  const displayItems: FeaturedBreedItem[] =
    blockItems.length > 0
      ? blockItems
      : sortedDogs.map((dog) => ({
          id: dog.id,
          title: dog.breedName.replace(' Retriever', '').replace(' Spaniel', ''),
          url: `/breeds/${dog.slug}`,
          image: dog.thumbnailImage,
          accentColor: defaultBreedCardAccentColor,
          showBadge: false,
          badgeText: 'Best Seller',
        }));

  return (
    <section className="pt-12 pb-8" style={sectionStyle} id="featured-dogs">
      {/* Header Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {(shouldShowBadgeLine || shouldShowBadgeText) && (
            <div className="flex items-center gap-3 mb-3">
              {shouldShowBadgeLine && <div className="w-8 h-[2px] bg-[var(--featured-badge-color)]" />}
              {shouldShowBadgeText && (
                <span className="text-[var(--featured-badge-color)] font-bold uppercase tracking-[0.2em]" style={badgeTextStyle}>
                  {badge_text}
                </span>
              )}
            </div>
          )}

          <h2
            className="font-display text-4xl lg:text-5xl font-bold text-[#FFF0D9]"
            style={{
              ...headingTextStyle,
              color: headingTextColor,
            }}
          >
            {heading} <span style={{ color: headingHighlightColor }}>{heading_highlight}</span>
          </h2>

          <p
            className="mt-3 max-w-xl font-medium text-[#FFF0D9]/80"
            style={{
              ...descriptionTextStyle,
              color: subheadingTextColor,
            }}
          >
            {subheading}
          </p>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 self-start sm:self-auto">
          {/* Desktop Left/Right Arrows */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className={`p-2 rounded-full bg-white/60 text-[var(--section-accent)] transition-all shadow-sm focus:outline-none hover:scale-105 ${
                hasCustomAccentHoverColor
                  ? 'hover:bg-[var(--section-accent-hover)] hover:text-white'
                  : 'hover:bg-white'
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              className={`p-2 rounded-full bg-white/60 text-[var(--section-accent)] transition-all shadow-sm focus:outline-none hover:scale-105 ${
                hasCustomAccentHoverColor
                  ? 'hover:bg-[var(--section-accent-hover)] hover:text-white'
                  : 'hover:bg-white'
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <Link
            href={resolvedViewAllUrl}
            className={`text-sm font-semibold text-[var(--featured-view-all-color)] transition-colors border-b-2 border-transparent pb-0.5 whitespace-nowrap ${
              hasCustomAccentHoverColor
                ? 'hover:text-[var(--section-accent-hover)] hover:border-[var(--section-accent-hover)]'
                : 'hover:text-[var(--featured-view-all-color)] hover:border-[var(--featured-view-all-color)]'
            }`}
          >
            {show_all_btn_text} &rarr;
          </Link>
        </div>
      </div>

      {/* Category Filter / Breed List */}
      <div
        ref={scrollRef}
        onTouchStart={stopAutoScroll}
        onMouseDown={stopAutoScroll}
        className="max-w-7xl mx-auto flex gap-4 sm:gap-6 overflow-x-auto hide-scrollbar px-4 sm:px-6 lg:px-8 w-full snap-x snap-mandatory pt-2 pb-6"
      >

        {/* 'ALL' Button */}
        <Link
          href={resolvedViewAllUrl}
          className="flex flex-col items-center gap-3 shrink-0 snap-start group relative outline-none"
          onClick={stopAutoScroll}
        >
          <div className="relative transition-all duration-300 p-0.5 group-hover:scale-105" style={breedImageStyle}>
            {/* Background Base */}
            <motion.div
              className="absolute inset-0 shadow-sm rounded-2xl"
              style={{ backgroundColor: allTileOuterBgColor }}
            />
            {/* Image Box */}
            <motion.div
              className="relative w-full h-full overflow-hidden shadow-sm p-2 rounded-2xl"
              style={{ backgroundColor: breedCardBackgroundColor }}
            >
              <div
                className="w-full h-full rounded-2xl flex items-center justify-center border-2"
                style={{
                  backgroundColor: allTileInnerBgColor,
                  borderColor: allTileInnerBorderColor,
                }}
              >
                <span className="font-black text-sm" style={{ color: allTileInnerTextColor }}>ALL</span>
              </div>
            </motion.div>
          </div>
          <span
                className="font-bold text-[var(--featured-breed-title-color)] transition-colors"
                style={breedTitleTextStyle}
              >
            All
          </span>
        </Link>

        {/* 25 Breeds */}
        {displayItems.map((item) => {
          return (
            <Link
              key={item.id}
              href={item.url}
              className="flex flex-col items-center gap-3 shrink-0 snap-start group relative outline-none"
              onClick={stopAutoScroll}
            >
              <div className="relative transition-all duration-300 p-0.5 group-hover:scale-105" style={breedImageStyle}>
                {/* Background Base */}
                <motion.div
                  className="absolute inset-0 shadow-sm opacity-100 transition-opacity rounded-2xl"
                  style={{ backgroundColor: item.accentColor }}
                />

                {/* Image Box */}
                <motion.div
                  className="relative w-full h-full overflow-hidden shadow-sm rounded-2xl"
                  style={{ backgroundColor: breedCardBackgroundColor }}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </motion.div>
                {item.showBadge && (
                  <span
                    className="absolute -top-2 -right-2 rounded-full px-2 py-1 font-black uppercase tracking-wider shadow-sm whitespace-nowrap leading-none"
                    style={{
                      ...priorityBadgeTextStyle,
                      backgroundColor: priority_badge_bg_color,
                      color: priority_badge_text_color,
                    }}
                  >
                    {item.badgeText}
                  </span>
                )}
              </div>

              {/* Category Name */}
              <span
                className="font-semibold text-[var(--featured-breed-title-color)] transition-colors"
                style={breedTitleTextStyle}
              >
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
