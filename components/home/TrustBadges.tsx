'use client';

import type { CSSProperties } from 'react';
import { motion } from 'motion/react';
import MobileCarousel from '@/components/ui/MobileCarousel';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';
import {
  Award,
  BadgeCheck,
  Briefcase,
  FileCheck,
  GraduationCap,
  ShieldCheck,
  Star,
  Stethoscope,
  ThumbsUp,
} from 'lucide-react';
import { InlineEditable } from '@/components/admin/InlineEditable';
import { buildSectionStyle, resolveColorToken } from '@/lib/gradient-style';
import { cn } from '@/lib/utils';

type RawBlock = {
  id?: string;
  type?: string;
  settings?: Record<string, unknown>;
};

type BadgeItem = {
  id: string;
  iconName: string;
  title: string;
  subtitle: string;
  blockId?: string;
  titleKey: string;
  subtitleKey: string;
  iconKey: string;
};

const iconComponents = {
  ShieldCheck,
  Stethoscope,
  FileCheck,
  Award,
  BadgeCheck,
  Star,
  GraduationCap,
  Briefcase,
  ThumbsUp,
};

const fallbackBadges = [
  {
    iconName: 'ShieldCheck',
    title: 'Health First',
    subtitle: 'Every pup undergoes a 15-point clinical screening by our elite veterinary panel.',
    color: '#0f766e',
  },
  {
    iconName: 'GraduationCap',
    title: 'KCI Lineage',
    subtitle: 'Authentic registration papers and heritage tracking for every certified breed.',
    color: '#6d28d9',
  },
  {
    iconName: 'Briefcase',
    title: 'Secure Transit',
    subtitle: 'White-glove, climate-controlled delivery service to your doorstep.',
    color: '#2563eb',
  },
  {
    iconName: 'ThumbsUp',
    title: 'Ethical Source',
    subtitle: 'Rigorous audits ensure every partner breeder exceeds international welfare codes.',
    color: '#b45309',
  },
];

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

function toBoolean(value: unknown, fallback: boolean): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') return true;
    if (normalized === 'false') return false;
  }
  return fallback;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function toRgba(hexOrColor: string, alpha: number): string {
  const hex = hexOrColor.trim().replace('#', '');
  if (/^[0-9a-fA-F]{3}$/.test(hex)) {
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  if (/^[0-9a-fA-F]{6}$/.test(hex)) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return `rgba(15, 23, 42, ${alpha})`;
}

function resolveIconName(value: unknown): string {
  if (typeof value === 'string' && value in iconComponents) {
    return value;
  }
  return 'ShieldCheck';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isTrustBadgeType(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const normalized = value.trim().toLowerCase();
  return normalized === 'trust_badge' || normalized === 'trust-badge';
}

function renderIcon(iconName: string, size: number) {
  const Icon = iconComponents[iconName as keyof typeof iconComponents] || ShieldCheck;
  return <Icon size={size} />;
}

function buildBadgeItems(blocks: RawBlock[]): BadgeItem[] {
  return blocks
    .filter((block) => isTrustBadgeType(block?.type))
    .map((block, index) => {
      const settings = isRecord(block.settings) ? block.settings : {};
      const fallback = fallbackBadges[index % fallbackBadges.length];
      return {
        id: block.id || `trust_badge_${index}`,
        iconName: resolveIconName(settings.icon),
        title: toText(settings.title, fallback.title),
        subtitle: toText(settings.subtitle, fallback.subtitle),
        blockId: block.id,
        titleKey: 'title',
        subtitleKey: 'subtitle',
        iconKey: 'icon',
      };
    });
}

function BadgeCard({
  badge,
  sectionId,
  isEditorMode,
  globalIconColor,
  cardBgColor,
  cardBorderColor,
  cardRadius,
  titleTextStyle,
  subtitleTextStyle,
  titleTextColor,
  subtitleTextColor,
  iconChipBgColor,
  iconChipSize,
  iconChipRadius,
  iconSize,
}: {
  badge: BadgeItem;
  sectionId?: string;
  isEditorMode?: boolean;
  globalIconColor?: string;
  cardBgColor: string;
  cardBorderColor: string;
  cardRadius: number;
  titleTextStyle: CSSProperties;
  subtitleTextStyle: CSSProperties;
  titleTextColor: string;
  subtitleTextColor: string;
  iconChipBgColor: string;
  iconChipSize: number;
  iconChipRadius: number;
  iconSize: number;
}) {
  const resolvedIconColor = resolveColorToken(globalIconColor, '#0f172a') || '#0f172a';
  const resolvedIconChipBg = iconChipBgColor || toRgba(resolvedIconColor, 0.12);

  return (
    <article
      className="h-full border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_40px_rgba(15,23,42,0.08)]"
      style={{
        backgroundColor: cardBgColor,
        borderColor: cardBorderColor,
        borderRadius: `${cardRadius}px`,
      }}
    >
      <div className="relative z-10 text-left">
        <InlineEditable
          isEditorMode={isEditorMode}
          sectionId={sectionId}
          propKey={badge.iconKey}
          editType="text"
          blockId={badge.blockId}
          as="div"
          className="mb-6 inline-flex"
        >
          <div
            className="inline-flex items-center justify-center"
            style={{
              width: `${iconChipSize}px`,
              height: `${iconChipSize}px`,
              borderRadius: `${iconChipRadius}px`,
              background: resolvedIconChipBg,
              color: resolvedIconColor,
            }}
          >
            {renderIcon(badge.iconName, iconSize)}
          </div>
        </InlineEditable>
        <InlineEditable
          isEditorMode={isEditorMode}
          sectionId={sectionId}
          propKey={badge.titleKey}
          editType="text"
          blockId={badge.blockId}
          as="p"
          className="mb-4 font-bold leading-tight"
          containerMode
        >
          <span style={{ ...titleTextStyle, color: titleTextColor }}>{badge.title}</span>
        </InlineEditable>
        <InlineEditable
          isEditorMode={isEditorMode}
          sectionId={sectionId}
          propKey={badge.subtitleKey}
          editType="textarea"
          blockId={badge.blockId}
          as="p"
          className="leading-relaxed"
          containerMode
        >
          <span style={{ ...subtitleTextStyle, color: subtitleTextColor }}>{badge.subtitle}</span>
        </InlineEditable>
      </div>
    </article>
  );
}

export default function TrustBadges({
  eyebrow_text = 'Trusted and Transparent',
  eyebrow_text_size_px = 12,
  eyebrow_text_color = '#6b7280',
  heading = 'Built on Trust & Transparency',
  heading_text_size_px = 46,
  heading_text_color = '#0f172a',
  subheading = 'Proof points that matter for responsible adoption.',
  subheading_text_size_px = 16,
  subheading_text_color = '#475569',
  icon_color_global = '#ea728c',
  card_bg_color = '#f8f5ef',
  card_border_color = '#e6e0d8',
  card_radius_px = 24,
  card_title_text_size_px = 16,
  card_title_text_color = '#0f172a',
  card_subtitle_text_size_px = 14,
  card_subtitle_text_color = '#475569',
  icon_chip_bg_color,
  icon_chip_size_px = 82,
  icon_size_px = 34,
  icon_chip_radius_px = 22,
  mobile_layout_mode = 'carousel',
  mobile_vertical_gap_px = 14,
  carousel_autoplay_enabled = true,
  carousel_autoplay_interval_ms = 2800,
  blocks = [],
  sectionId,
  isEditorMode = false,
  section_bg_color,
  section_text_color,
  section_padding_top,
  section_padding_bottom,
  section_margin_top,
  section_margin_bottom,
}: {
  eyebrow_text?: string;
  eyebrow_text_size_px?: number | string;
  eyebrow_text_color?: string;
  heading?: string;
  heading_text_size_px?: number | string;
  heading_text_color?: string;
  subheading?: string;
  subheading_text_size_px?: number | string;
  subheading_text_color?: string;
  icon_color_global?: string;
  card_bg_color?: string;
  card_border_color?: string;
  card_radius_px?: number | string;
  card_title_text_size_px?: number | string;
  card_title_text_color?: string;
  card_subtitle_text_size_px?: number | string;
  card_subtitle_text_color?: string;
  icon_chip_bg_color?: string;
  icon_chip_size_px?: number | string;
  icon_size_px?: number | string;
  icon_chip_radius_px?: number | string;
  mobile_layout_mode?: string;
  mobile_vertical_gap_px?: number | string;
  carousel_autoplay_enabled?: boolean | string;
  carousel_autoplay_interval_ms?: number | string;
  blocks?: RawBlock[];
  sectionId?: string;
  isEditorMode?: boolean;
  section_bg_color?: string;
  section_text_color?: string;
  section_padding_top?: string;
  section_padding_bottom?: string;
  section_margin_top?: string;
  section_margin_bottom?: string;
}) {
  const blockBadges = buildBadgeItems(blocks);
  const badges: BadgeItem[] =
    blockBadges.length > 0
      ? blockBadges
      : fallbackBadges.map((badge, index) => ({
          id: `legacy_trust_badge_${index}`,
          iconName: badge.iconName,
          title: badge.title,
          subtitle: badge.subtitle,
          titleKey: `trust_badge_${index}_title`,
          subtitleKey: `trust_badge_${index}_subtitle`,
          iconKey: `trust_badge_${index}_icon`,
        }));

  const sectionStyle: CSSProperties = buildSectionStyle({
    background: section_bg_color,
    backgroundFallback: '#f4f4f5',
    text: section_text_color,
    paddingTop: section_padding_top,
    paddingBottom: section_padding_bottom,
    marginTop: section_margin_top,
    marginBottom: section_margin_bottom,
  });
  const sectionTextColor = resolveColorToken(section_text_color, '#0f172a') || '#0f172a';
  const eyebrowTextColor = resolveColorToken(eyebrow_text_color, '#6b7280') || '#6b7280';
  const headingTextColor = resolveColorToken(heading_text_color, sectionTextColor) || sectionTextColor;
  const subheadingTextColor = resolveColorToken(subheading_text_color, '#475569') || '#475569';
  const globalIconColor = resolveColorToken(icon_color_global, '#ea728c') || '#ea728c';
  const cardBgColor = resolveColorToken(card_bg_color, '#f8f5ef') || '#f8f5ef';
  const cardBorderColor = resolveColorToken(card_border_color, '#e6e0d8') || '#e6e0d8';
  const cardTitleTextColor = resolveColorToken(card_title_text_color, headingTextColor) || headingTextColor;
  const cardSubtitleTextColor = resolveColorToken(card_subtitle_text_color, subheadingTextColor) || subheadingTextColor;
  const iconChipBgColor = resolveColorToken(icon_chip_bg_color);

  const eyebrowSizeDesktop = clamp(toNumber(eyebrow_text_size_px, 12), 9, 24);
  const eyebrowSizeMobile = clamp(Math.round(eyebrowSizeDesktop * 0.95), 9, eyebrowSizeDesktop);
  const headingSizeDesktop = clamp(toNumber(heading_text_size_px, 46), 20, 84);
  const headingSizeMobile = clamp(Math.round(headingSizeDesktop * 0.68), 18, headingSizeDesktop);
  const subheadingSizeDesktop = clamp(toNumber(subheading_text_size_px, 16), 11, 32);
  const subheadingSizeMobile = clamp(Math.round(subheadingSizeDesktop * 0.95), 11, subheadingSizeDesktop);
  const cardTitleSizeDesktop = clamp(toNumber(card_title_text_size_px, 16), 11, 34);
  const cardTitleSizeMobile = clamp(Math.round(cardTitleSizeDesktop * 0.95), 11, cardTitleSizeDesktop);
  const cardSubtitleSizeDesktop = clamp(toNumber(card_subtitle_text_size_px, 14), 10, 28);
  const cardSubtitleSizeMobile = clamp(Math.round(cardSubtitleSizeDesktop * 0.95), 10, cardSubtitleSizeDesktop);
  const cardRadius = clamp(toNumber(card_radius_px, 24), 8, 48);
  const iconChipSize = clamp(toNumber(icon_chip_size_px, 82), 40, 140);
  const iconSize = clamp(toNumber(icon_size_px, 34), 14, 70);
  const iconChipRadius = clamp(toNumber(icon_chip_radius_px, 22), 8, 48);
  const mobileLayoutMode = toText(mobile_layout_mode, 'carousel').toLowerCase() === 'vertical' ? 'vertical' : 'carousel';
  const mobileVerticalGap = clamp(toNumber(mobile_vertical_gap_px, 14), 8, 32);
  const carouselAutoPlayEnabled = toBoolean(carousel_autoplay_enabled, true);
  const carouselAutoPlayInterval = clamp(toNumber(carousel_autoplay_interval_ms, 2800), 1200, 10000);

  const eyebrowTextStyle: CSSProperties = {
    fontSize: `clamp(${eyebrowSizeMobile}px, calc(${eyebrowSizeMobile - 1}px + 0.2vw), ${eyebrowSizeDesktop}px)`,
  };
  const headingTextStyle: CSSProperties = {
    fontSize: `clamp(${headingSizeMobile}px, calc(${headingSizeMobile - 4}px + 1vw), ${headingSizeDesktop}px)`,
  };
  const subheadingTextStyle: CSSProperties = {
    fontSize: `clamp(${subheadingSizeMobile}px, calc(${subheadingSizeMobile - 1}px + 0.25vw), ${subheadingSizeDesktop}px)`,
  };
  const cardTitleTextStyle: CSSProperties = {
    fontSize: `clamp(${cardTitleSizeMobile}px, calc(${cardTitleSizeMobile - 1}px + 0.2vw), ${cardTitleSizeDesktop}px)`,
  };
  const cardSubtitleTextStyle: CSSProperties = {
    fontSize: `clamp(${cardSubtitleSizeMobile}px, calc(${cardSubtitleSizeMobile - 1}px + 0.2vw), ${cardSubtitleSizeDesktop}px)`,
  };

  const renderBadgeCard = (badge: BadgeItem) => {
    return (
      <BadgeCard
        key={badge.id}
        badge={badge}
        sectionId={sectionId}
        isEditorMode={isEditorMode}
        globalIconColor={globalIconColor}
        cardBgColor={cardBgColor}
        cardBorderColor={cardBorderColor}
        cardRadius={cardRadius}
        titleTextStyle={cardTitleTextStyle}
        subtitleTextStyle={cardSubtitleTextStyle}
        titleTextColor={cardTitleTextColor}
        subtitleTextColor={cardSubtitleTextColor}
        iconChipBgColor={iconChipBgColor || ''}
        iconChipSize={iconChipSize}
        iconChipRadius={iconChipRadius}
        iconSize={iconSize}
      />
    );
  };

  return (
    <section className="section-shell-tight relative overflow-hidden" id="trust-badges" style={sectionStyle}>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-40 max-w-4xl rounded-full blur-3xl"
        style={{ background: toRgba(cardTitleTextColor, 0.1) }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <p
            className="mb-3 font-semibold uppercase tracking-[0.26em]"
            style={{ ...eyebrowTextStyle, color: eyebrowTextColor }}
          >
            {eyebrow_text}
          </p>
          <InlineEditable
            isEditorMode={isEditorMode}
            sectionId={sectionId}
            propKey="heading"
            editType="text"
            as="h2"
            className="font-display font-bold leading-tight"
            style={{ ...headingTextStyle, color: headingTextColor }}
            containerMode
          >
            {heading}
          </InlineEditable>
          <InlineEditable
            isEditorMode={isEditorMode}
            sectionId={sectionId}
            propKey="subheading"
            editType="textarea"
            as="p"
            className="mx-auto mt-3 max-w-2xl leading-relaxed"
            style={{ ...subheadingTextStyle, color: subheadingTextColor }}
            containerMode
          >
            {subheading}
          </InlineEditable>
        </motion.div>

        {mobileLayoutMode === 'vertical' ? (
          <div className="lg:hidden grid" style={{ rowGap: `${mobileVerticalGap}px` }}>
            {badges.map((badge) => renderBadgeCard(badge))}
          </div>
        ) : (
          <MobileCarousel
            autoPlay={carouselAutoPlayEnabled}
            autoPlayInterval={carouselAutoPlayInterval}
            itemWidth="full"
            itemClassName="px-0.5"
          >
            {badges.map((badge) => renderBadgeCard(badge))}
          </MobileCarousel>
        )}

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className={cn(
            'hidden gap-6 lg:grid',
            badges.length >= 4
              ? 'lg:grid-cols-4'
              : badges.length === 3
                ? 'lg:grid-cols-3'
                : badges.length === 2
                  ? 'lg:grid-cols-2 lg:max-w-5xl lg:mx-auto'
                  : 'lg:grid-cols-1 lg:max-w-sm lg:mx-auto'
          )}
        >
          {badges.map((badge) => (
            <motion.div key={badge.id} variants={fadeUpVariant}>
              {renderBadgeCard(badge)}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
