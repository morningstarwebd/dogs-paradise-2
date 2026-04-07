'use client';

import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Quote } from 'lucide-react';
import { fadeUpVariant } from '@/lib/animations';
import { isGradientColorValue, normalizeDecorativeColorValue } from '@/lib/decorative-color';
import { buildSectionStyle, resolveBackgroundStyle, resolveColorToken } from '@/lib/gradient-style';
import { toStorageOnlyImage } from '@/lib/storage-only-images';

type RawBlock = {
  id?: string;
  type?: string;
  settings?: Record<string, unknown>;
};

type AboutActionButton = {
  id: string;
  text: string;
  url: string;
  style: 'filled' | 'outline';
  color: string;
  textColor: string;
  openNewTab: boolean;
};

type AboutPreviewProps = {
  badge_text?: string;
  badge_text_size_px?: number | string;
  badge_text_color?: string;
  heading_line1?: string;
  heading_highlight?: string;
  heading_text_color?: string;
  heading_highlight_color?: string;
  heading_text_size_px?: number | string;
  author_name?: string;
  description?: string;
  description_text_size_px?: number | string;
  description_text_color?: string;
  primary_btn_text?: string;
  quote_text?: string;
  quote_accent_color?: string;
  owner_image?: string;
  owner_image_border_color?: string;
  owner_image_frame_bg_color?: string;
  owner_card_backdrop_color?: string;
  founding_year?: string;
  blocks?: RawBlock[];
  section_bg_color?: string;
  section_text_color?: string;
  decorative_blob_enabled?: boolean;
  decorative_blob_color?: string;
  decorative_blob_size_scale?: number | string;
  section_padding_top?: string;
  section_padding_bottom?: string;
  section_margin_top?: string;
  section_margin_bottom?: string;
};

function toText(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

function toRgba(color: string, alpha: number): string {
  const hex = color.trim().replace('#', '');
  if (/^[0-9a-fA-F]{3}$/.test(hex)) {
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return color;
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getDecorativeBlobBackground(color: string): string {
  const normalized = normalizeDecorativeColorValue(color, '#ea728c');
  if (isGradientColorValue(normalized)) return normalized;
  return `linear-gradient(to bottom right, ${toRgba(normalized, 0.4)}, ${toRgba(normalized, 0.6)})`;
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

function buildActionButtons(blocks: RawBlock[]): AboutActionButton[] {
  return blocks
    .filter((block) => block?.type === 'about_action' && block.settings)
    .map((block, index) => {
      const settings = block.settings as Record<string, unknown>;
      const style = toText(settings.style, 'filled').toLowerCase();
      const baseButtonColor = toText(settings.color, '#ea728c');
      const defaultTextColor = style === 'outline' ? baseButtonColor : '#ffffff';
      return {
        id: block.id || `about_action_${index}`,
        text: toText(settings.text, toText(settings.button_text, 'Read More')),
        url: toText(settings.url, '/about'),
        style: style === 'outline' ? 'outline' : 'filled',
        color: baseButtonColor,
        textColor: toText(settings.text_color, defaultTextColor),
        openNewTab: Boolean(settings.open_new_tab),
      };
    });
}

export default function AboutPreview({
  badge_text = 'Meet The Founder',
  badge_text_size_px = 14,
  badge_text_color = '#ea728c',
  heading_line1 = 'Meet Richard – Founder of',
  heading_highlight = 'Dogs Paradise Bangalore',
  heading_text_color,
  heading_highlight_color = '#ea728c',
  heading_text_size_px = 56,
  author_name = 'Richard',
  description = 'What started as a simple journey of being a pet parent slowly grew into a deep passion. Over the years, I found myself becoming more involved in the beautiful process of responsible breeding, caring for newborn puppies, and helping them find safe, loving homes.',
  description_text_size_px = 16,
  description_text_color,
  primary_btn_text = 'Read My Full Story',
  quote_text = 'For me, every puppy deserves a good home, and every family deserves a healthy, well-raised companion. That belief became my purpose.',
  quote_accent_color = '#ea728c',
  owner_image,
  owner_image_border_color = '#ffffff',
  owner_image_frame_bg_color = '#ffffff',
  owner_card_backdrop_color,
  founding_year = '2017',
  blocks = [],
  section_bg_color,
  section_text_color,
  decorative_blob_enabled = true,
  decorative_blob_color = '#ea728c',
  decorative_blob_size_scale = 1,
  section_padding_top,
  section_padding_bottom,
  section_margin_top,
  section_margin_bottom,
}: AboutPreviewProps) {
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
  const badgeTextColor = resolveColorToken(badge_text_color, '#ea728c');
  const headingTextColor = resolveColorToken(heading_text_color, sectionTextColor || '#FFF0D9');
  const headingHighlightColor = resolveColorToken(heading_highlight_color, '#ea728c');
  const descriptionTextColor = resolveColorToken(description_text_color, sectionTextColor || '#FFF0D9');
  const quoteAccentColor = resolveColorToken(quote_accent_color, '#ea728c');
  const ownerImageBorderColor = resolveColorToken(owner_image_border_color, '#ffffff');
  const ownerImageFrameBgColor = resolveColorToken(owner_image_frame_bg_color, '#ffffff');
  const ownerCardBackdropColor = toText(owner_card_backdrop_color, decorative_blob_color);

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
  const blobScale = Number.isFinite(parsedBlobScale) && parsedBlobScale > 0 ? parsedBlobScale : 1;

  const blockButtons = buildActionButtons(blocks);
  const actionButtons: AboutActionButton[] =
    blockButtons.length > 0
      ? blockButtons
      : [
          {
            id: 'legacy_about_primary',
            text: primary_btn_text,
            url: '/about',
            style: 'filled',
            color: '#ea728c',
            textColor: '#ffffff',
            openNewTab: false,
          },
        ];

  return (
    <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28" id="about-preview" style={sectionStyle}>
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
              <div className="w-8 h-[2px]" style={badgeTextColor ? { backgroundColor: badgeTextColor } : undefined} />
              <span
                className="text-[#ea728c] font-bold uppercase tracking-[0.2em]"
                style={{
                  ...badgeTextStyle,
                  color: badgeTextColor || sectionTextColor || undefined,
                }}
              >
                {badge_text}
              </span>
            </div>

            <h2
              className="font-display text-4xl sm:text-4xl lg:text-5xl font-bold text-[#FFF0D9] leading-tight mb-8"
              style={{
                ...headingTextStyle,
                color: headingTextColor || sectionTextColor || undefined,
              }}
            >
              {heading_line1} <span style={headingHighlightColor ? { color: headingHighlightColor } : undefined}>{heading_highlight}</span>
            </h2>

            <div className="space-y-5 text-[#FFF0D9] text-[15px] sm:text-base leading-relaxed mb-10" style={sectionTextColor ? { color: sectionTextColor } : undefined}>
              <p className="font-medium text-[#FFF0D9] text-lg" style={sectionTextColor ? { color: sectionTextColor } : undefined}>
                Hi, I’m {author_name}, the founder of Dogs Paradise.
              </p>

              <p>
                <span
                  style={{
                    ...descriptionTextStyle,
                    color: descriptionTextColor || sectionTextColor || undefined,
                  }}
                >
                  {description}
                </span>
              </p>

              <div className="relative py-4 my-6">
                <Quote
                  className="absolute -top-1 -left-2 w-10 h-10 -z-10 transform -rotate-12"
                  style={{ color: toRgba(quoteAccentColor, 0.12) }}
                />
                <p
                  className="text-[#FFF0D9] text-lg font-medium italic border-l-4 pl-4"
                  style={{
                    borderLeftColor: toRgba(quoteAccentColor, 0.3),
                    ...(sectionTextColor ? { color: sectionTextColor } : undefined),
                  }}
                >
                  &quot;{quote_text}&quot;
                </p>
              </div>

              <div className="pt-4 flex flex-wrap gap-3">
                {actionButtons.map((button) => {
                  const commonClass = 'inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all duration-300 hover:-translate-y-1 group';
                  const buttonColorToken = resolveColorToken(button.color, '#ea728c');
                  const buttonTextColor = resolveColorToken(
                    button.textColor,
                    button.style === 'outline' ? buttonColorToken : '#ffffff',
                  );
                  const style = button.style === 'outline'
                    ? {
                        borderColor: buttonColorToken || '#ea728c',
                        color: buttonTextColor || buttonColorToken || '#ea728c',
                      }
                    : {
                        ...resolveBackgroundStyle(button.color, '#ea728c'),
                        color: buttonTextColor || '#ffffff',
                        borderColor: buttonColorToken || undefined,
                      };
                  const className = `${commonClass} ${button.style === 'outline' ? 'border-2 bg-transparent hover:bg-white/10' : 'shadow-lg'}`;
                  const content = (
                    <>
                      {button.text}
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </>
                  );

                  if (button.openNewTab || button.url.startsWith('http')) {
                    return (
                      <a key={button.id} href={button.url} target="_blank" rel="noopener noreferrer" className={className} style={style}>
                        {content}
                      </a>
                    );
                  }

                  return (
                    <Link key={button.id} href={button.url} className={className} style={style}>
                      {content}
                    </Link>
                  );
                })}
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
              <div
                className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(42,23,18,0.15)] border-8 bg-white z-10 transform rotate-1 hover:rotate-0 transition-transform duration-500"
                style={{
                  borderColor: ownerImageBorderColor || '#ffffff',
                  backgroundColor: ownerImageFrameBgColor || '#ffffff',
                }}
              >
                <Image
                  src={toStorageOnlyImage(owner_image)}
                  alt="Richard - Founder of Dogs Paradise Bangalore"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  quality={90}
                />
              </div>

              {/* Background solid decoration */}
              {decorative_blob_enabled && (
                <div
                  className="absolute -inset-4 rounded-2xl -z-10 transform -rotate-3"
                  style={{
                    background: getDecorativeBlobBackground(ownerCardBackdropColor),
                    transform: `scale(${blobScale}) rotate(-3deg)`,
                    transformOrigin: 'top left',
                  }}
                />
              )}

              {/* Badge/Sticker */}
              <div className="absolute -bottom-6 -left-6 z-20 bg-white p-4 rounded-2xl shadow-xl border border-white/50 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                <div className="bg-[#FFF0D9] px-4 py-2 rounded-2xl text-center">
                  <span className="block text-[#ea728c] font-black text-xl leading-none mb-1">{founding_year}</span>
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
