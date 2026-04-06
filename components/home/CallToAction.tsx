'use client';

import type { CSSProperties } from 'react';
import { motion } from 'motion/react';
import { fadeUpVariant } from '@/lib/animations';
import { siteConfig } from '@/data/site-config';
import { getWhatsAppLink } from '@/lib/utils';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { getDecorativeBlobStyle } from '@/lib/decorative-color';
import { buildSectionStyle, resolveColorToken } from '@/lib/gradient-style';

type RawBlock = {
  id?: string;
  type?: string;
  settings?: Record<string, unknown>;
};

type CtaButtonItem = {
  id: string;
  text: string;
  url: string;
  color: string;
  style: 'filled' | 'outline';
  icon?: string;
  openNewTab: boolean;
};

type CallToActionProps = {
  badge_text?: string;
  badge_text_size_px?: number | string;
  heading_line1?: string;
  heading_highlight?: string;
  heading_text_size_px?: number | string;
  description?: string;
  description_text_size_px?: number | string;
  btn_text?: string;
  secondary_btn_text?: string;
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

function buildCtaButtons(blocks: RawBlock[]): CtaButtonItem[] {
  return blocks
    .filter((block) => block?.type === 'cta_button' && block.settings)
    .map((block, index) => {
      const settings = block.settings as Record<string, unknown>;
      const style = toText(settings.style, 'filled').toLowerCase();
      return {
        id: block.id || `cta_button_${index}`,
        text: toText(settings.text, `Button ${index + 1}`),
        url: toText(settings.url, '#'),
        color: toText(settings.color, '#25d366'),
        style: style === 'outline' ? 'outline' : 'filled',
        icon: toText(settings.icon, ''),
        openNewTab: Boolean(settings.open_new_tab),
      };
    });
}

export default function CallToAction({
  badge_text = 'Ready for a new friend?',
  badge_text_size_px = 14,
  heading_line1 = 'Find your perfect',
  heading_highlight = 'companion today',
  heading_text_size_px = 56,
  description = 'Contact us on WhatsApp to speak with our experts directly.',
  description_text_size_px = 20,
  btn_text = 'Chat on WhatsApp',
  secondary_btn_text = 'Browse All Breeds',
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
}: CallToActionProps) {
  const message = `Hi ${siteConfig.brandName}! I'm interested in your puppies. Can you share more details?`;

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
  const descriptionSizeDesktop = clamp(toNumber(description_text_size_px, 20), 12, 36);
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

  const blockButtons = buildCtaButtons(blocks);
  const buttons: CtaButtonItem[] =
    blockButtons.length > 0
      ? blockButtons
      : [
          {
            id: 'legacy_primary_cta',
            text: btn_text,
            url: getWhatsAppLink(siteConfig.whatsappNumber, message),
            color: '#25d366',
            style: 'filled',
            icon: '💬',
            openNewTab: true,
          },
          {
            id: 'legacy_secondary_cta',
            text: secondary_btn_text,
            url: '/breeds',
            color: '#FFF0D9',
            style: 'filled',
            icon: '',
            openNewTab: false,
          },
        ];

  return (
    <section className="relative overflow-hidden py-16 sm:py-24" id="cta" style={sectionStyle}>
      {/* Background Decorative Blobs */}
      {decorative_blob_enabled && (
        <div className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none">
          {/* Bottom pink blob */}
          <div
            className="absolute -bottom-24 -left-24 md:-bottom-32 md:-left-32 w-64 h-64 md:w-96 md:h-96 rounded-full opacity-80"
            style={{
              ...getDecorativeBlobStyle(decorative_blob_color, '#ea728c'),
              transform: `scale(${blobScale})`,
              transformOrigin: 'bottom left',
            }}
          />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
              <span className="w-2 h-2 rounded-full bg-[#ea728c] animate-pulse-slow" />
              <span
                className="text-[#FFF0D9] font-bold uppercase tracking-widest"
                style={{
                  ...badgeTextStyle,
                  ...(sectionTextColor ? { color: sectionTextColor } : undefined),
                }}
              >
                {badge_text}
              </span>
            </div>
          </div>

          <h2
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#FFF0D9] leading-tight mb-6"
            style={{
              ...headingTextStyle,
              ...(sectionTextColor ? { color: sectionTextColor } : undefined),
            }}
          >
            {heading_line1} <span className="text-[#ea728c]">{heading_highlight}</span>
          </h2>
          <p
            className="text-lg text-[#FFF0D9]/80 mb-10 max-w-2xl mx-auto font-medium"
            style={{
              ...descriptionTextStyle,
              ...(sectionTextColor ? { color: sectionTextColor } : undefined),
            }}
          >
            {description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {buttons.map((button) => {
              const isOutline = button.style === 'outline';
              const className = `px-8 py-4 text-base font-bold rounded-2xl transition-transform duration-300 hover:-translate-y-1 inline-flex items-center justify-center gap-2 ${isOutline ? 'border-2 bg-transparent' : 'text-white shadow-lg'}`;
              const style = {
                backgroundColor: isOutline ? 'transparent' : button.color,
                borderColor: button.color,
                color: isOutline ? button.color : undefined,
              } as CSSProperties;
              const icon = button.icon?.trim() ? <span aria-hidden>{button.icon}</span> : null;
              const isExternal = button.openNewTab || button.url.startsWith('http');

              if (isExternal) {
                return (
                  <a key={button.id} href={button.url} target="_blank" rel="noopener noreferrer" className={className} style={style}>
                    {icon || <MessageCircle size={20} />}
                    {button.text}
                  </a>
                );
              }

              return (
                <Link key={button.id} href={button.url} className={className} style={style}>
                  {icon}
                  {button.text}
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
