'use client';

import type { CSSProperties } from 'react';
import {
  Award,
  BadgeCheck,
  CheckCircle2,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';
import { buildSectionStyle, resolveBackgroundStyle, resolveColorToken } from '@/lib/gradient-style';
import { cn } from '@/lib/utils';

type RawBlock = {
  id?: string;
  type?: string;
  settings?: Record<string, unknown>;
};

type CredibilityItem = {
  id: string;
  metric: string;
  title: string;
  subtitle: string;
  iconName: string;
  iconImage: string;
  iconAlt: string;
  badgeText: string;
  showBadge: boolean;
  metricColor?: string;
  titleColor?: string;
  subtitleColor?: string;
  badgeBgColor?: string;
  badgeTextColor?: string;
  iconBgColor?: string;
  iconColor?: string;
};

const iconMap = {
  Users,
  Star,
  ShieldCheck,
  BadgeCheck,
  Award,
  CheckCircle2,
  HeartHandshake,
  Sparkles,
};

const fallbackItems: CredibilityItem[] = [
  {
    id: 'credibility-fallback-1',
    metric: '10k+',
    title: 'Happy Owners',
    subtitle: 'Divine Community',
    iconName: 'Users',
    iconImage: '',
    iconAlt: 'Owners',
    badgeText: '10K+',
    showBadge: true,
  },
  {
    id: 'credibility-fallback-2',
    metric: '4.8+',
    title: 'Google Reviews',
    subtitle: 'Trusted Rating',
    iconName: 'Star',
    iconImage: '',
    iconAlt: 'Reviews',
    badgeText: '★★★★★',
    showBadge: true,
  },
  {
    id: 'credibility-fallback-3',
    metric: 'Fully Certified',
    title: 'Heritage Registration',
    subtitle: 'KCI / UKC',
    iconName: 'ShieldCheck',
    iconImage: '',
    iconAlt: 'Certified',
    badgeText: 'UKC',
    showBadge: true,
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isCredibilityItemType(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const normalized = value.trim().toLowerCase();
  return normalized === 'credibility_item' || normalized === 'credibility-item';
}

function resolveIconName(value: unknown): string {
  if (typeof value === 'string' && value in iconMap) {
    return value;
  }
  return 'ShieldCheck';
}

function buildItems(blocks: RawBlock[]): CredibilityItem[] {
  const parsed = blocks
    .filter((block) => isCredibilityItemType(block?.type))
    .map((block, index) => {
      const settings = isRecord(block.settings) ? block.settings : {};
      const fallback = fallbackItems[index % fallbackItems.length];
      return {
        id: block.id || `credibility-item-${index}`,
        metric: toText(settings.metric, fallback.metric),
        title: toText(settings.title, fallback.title),
        subtitle: toText(settings.subtitle, fallback.subtitle),
        iconName: resolveIconName(settings.icon),
        iconImage: toText(settings.icon_image, ''),
        iconAlt: toText(settings.icon_alt, fallback.iconAlt),
        badgeText: toText(settings.badge_text, fallback.badgeText),
        showBadge: toBoolean(settings.show_badge, true),
        metricColor: toText(settings.metric_color, ''),
        titleColor: toText(settings.title_color, ''),
        subtitleColor: toText(settings.subtitle_color, ''),
        badgeBgColor: toText(settings.badge_bg_color, ''),
        badgeTextColor: toText(settings.badge_text_color, ''),
        iconBgColor: toText(settings.icon_bg_color, ''),
        iconColor: toText(settings.icon_color, ''),
      };
    });

  return parsed.length > 0 ? parsed : fallbackItems;
}

function renderIcon(iconName: string, size: number) {
  const Icon = iconMap[iconName as keyof typeof iconMap] || ShieldCheck;
  return <Icon size={size} />;
}

export default function CredibilityStrip({
  strip_background = 'linear-gradient(90deg, #020817 0%, #0b1f4d 50%, #020817 100%)',
  strip_border_color = '#22335f',
  strip_radius_px = 20,
  strip_padding_y_px = 20,
  strip_padding_x_px = 24,
  strip_gap_px = 16,
  show_item_dividers = true,
  divider_color = '#2b3f73',
  icon_chip_bg_color = 'rgba(255,255,255,0.06)',
  icon_chip_border_color = 'rgba(255,255,255,0.16)',
  icon_chip_size_px = 56,
  icon_size_px = 22,
  icon_color = '#f8fafc',
  metric_text_size_px = 38,
  metric_text_color = '#f8fafc',
  title_text_size_px = 15,
  title_text_color = '#f8fafc',
  subtitle_text_size_px = 12,
  subtitle_text_color = '#9fb0d9',
  badge_bg_color = '#10b981',
  badge_text_color = '#ffffff',
  badge_text_size_px = 14,
  mobile_layout = 'scroll',
  mobile_items_per_view = '1 Item',
  mobile_item_min_width_px = 260,
  blocks = [],
  section_bg_color,
  section_text_color,
  section_padding_top,
  section_padding_bottom,
  section_margin_top,
  section_margin_bottom,
}: {
  strip_background?: string;
  strip_border_color?: string;
  strip_radius_px?: number | string;
  strip_padding_y_px?: number | string;
  strip_padding_x_px?: number | string;
  strip_gap_px?: number | string;
  show_item_dividers?: boolean | string;
  divider_color?: string;
  icon_chip_bg_color?: string;
  icon_chip_border_color?: string;
  icon_chip_size_px?: number | string;
  icon_size_px?: number | string;
  icon_color?: string;
  metric_text_size_px?: number | string;
  metric_text_color?: string;
  title_text_size_px?: number | string;
  title_text_color?: string;
  subtitle_text_size_px?: number | string;
  subtitle_text_color?: string;
  badge_bg_color?: string;
  badge_text_color?: string;
  badge_text_size_px?: number | string;
  mobile_layout?: string;
  mobile_items_per_view?: string;
  mobile_item_min_width_px?: number | string;
  blocks?: RawBlock[];
  section_bg_color?: string;
  section_text_color?: string;
  section_padding_top?: string;
  section_padding_bottom?: string;
  section_margin_top?: string;
  section_margin_bottom?: string;
}) {
  const normalizedBlocks = Array.isArray(blocks) ? blocks : [];
  const items = buildItems(normalizedBlocks);
  const stripRadius = clamp(toNumber(strip_radius_px, 20), 0, 48);
  const stripPaddingY = clamp(toNumber(strip_padding_y_px, 20), 8, 40);
  const stripPaddingX = clamp(toNumber(strip_padding_x_px, 24), 10, 56);
  const stripGap = clamp(toNumber(strip_gap_px, 16), 8, 36);
  const iconChipSize = clamp(toNumber(icon_chip_size_px, 56), 32, 90);
  const iconSize = clamp(toNumber(icon_size_px, 22), 14, 44);
  const metricSize = clamp(toNumber(metric_text_size_px, 38), 20, 72);
  const titleSize = clamp(toNumber(title_text_size_px, 15), 10, 32);
  const subtitleSize = clamp(toNumber(subtitle_text_size_px, 12), 9, 26);
  const badgeSize = clamp(toNumber(badge_text_size_px, 14), 10, 28);
  const parsedItemsPerView = toText(mobile_items_per_view, 'Auto (Uses Min Width)');
  let computedMobileItemWidth = `${clamp(toNumber(mobile_item_min_width_px, 260), 180, 420)}px`;
  if (parsedItemsPerView === '1 Item') computedMobileItemWidth = '100%';
  else if (parsedItemsPerView === '1.2 Items') computedMobileItemWidth = '85%';
  else if (parsedItemsPerView === '1.5 Items') computedMobileItemWidth = '66%';
  else if (parsedItemsPerView === '2 Items') computedMobileItemWidth = '48%';
  const showDividers = toBoolean(show_item_dividers, true);
  const mobileLayoutMode = toText(mobile_layout, 'scroll').toLowerCase() === 'stack' ? 'stack' : 'scroll';


  const sectionStyle: CSSProperties = buildSectionStyle({
    background: section_bg_color,
    backgroundFallback: '',
    text: section_text_color,
    paddingTop: section_padding_top,
    paddingBottom: section_padding_bottom,
    marginTop: section_margin_top,
    marginBottom: section_margin_bottom,
  });

  const stripBorder = resolveColorToken(strip_border_color, '#22335f') || '#22335f';
  const divider = resolveColorToken(divider_color, '#2b3f73') || '#2b3f73';
  const iconChipBg = resolveColorToken(icon_chip_bg_color, 'rgba(255,255,255,0.06)') || 'rgba(255,255,255,0.06)';
  const iconChipBorder =
    resolveColorToken(icon_chip_border_color, 'rgba(255,255,255,0.16)') || 'rgba(255,255,255,0.16)';
  const globalIconColor = resolveColorToken(icon_color, '#f8fafc') || '#f8fafc';
  const metricColor = resolveColorToken(metric_text_color, '#f8fafc') || '#f8fafc';
  const titleColor = resolveColorToken(title_text_color, '#f8fafc') || '#f8fafc';
  const subtitleColor = resolveColorToken(subtitle_text_color, '#9fb0d9') || '#9fb0d9';
  const badgeBg = resolveColorToken(badge_bg_color, '#10b981') || '#10b981';
  const badgeTextColor = resolveColorToken(badge_text_color, '#ffffff') || '#ffffff';

  return (
    <section id="credibility-strip" className="relative py-2 md:py-3" style={sectionStyle}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="border shadow-[0_18px_40px_rgba(2,8,23,0.35)] overflow-hidden"
          style={{
            ...resolveBackgroundStyle(strip_background, '#06163b'),
            borderColor: stripBorder,
            borderRadius: `${stripRadius}px`,
            paddingTop: `${stripPaddingY}px`,
            paddingBottom: `${stripPaddingY}px`,
          }}
        >
          <div
            className={cn(
              mobileLayoutMode === 'stack' ? 'grid grid-cols-1 md:grid-cols-3 gap-y-6 md:gap-y-0 text-center md:text-left' : 'flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overscroll-x-contain',
              'gap-4 md:gap-0'
            )}
            style={{
              gap: mobileLayoutMode === 'stack' ? `${stripGap}px` : undefined,
              paddingLeft: `${stripPaddingX}px`,
              paddingRight: `${stripPaddingX}px`,
            }}
          >
            {items.map((item, index) => {
              const itemMetricColor = resolveColorToken(item.metricColor, metricColor) || metricColor;
              const itemTitleColor = resolveColorToken(item.titleColor, titleColor) || titleColor;
              const itemSubtitleColor = resolveColorToken(item.subtitleColor, subtitleColor) || subtitleColor;
              const itemBadgeBg = resolveColorToken(item.badgeBgColor, badgeBg) || badgeBg;
              const itemBadgeText = resolveColorToken(item.badgeTextColor, badgeTextColor) || badgeTextColor;
              const itemIconBg = resolveColorToken(item.iconBgColor, iconChipBg) || iconChipBg;
              const itemIconColor = resolveColorToken(item.iconColor, globalIconColor) || globalIconColor;
              const isLast = index === items.length - 1;
              const hasDivider = showDividers && !isLast;

              return (
                <article
                  key={item.id}
                  className={cn(
                    'flex gap-4 md:px-5',
                      mobileLayoutMode === 'scroll' ? 'items-center min-w-[var(--mobile-item-width)] snap-center shrink-0' : 'flex-col items-center justify-center md:flex-row md:items-center md:justify-start',
                    hasDivider ? (mobileLayoutMode === 'stack' ? 'border-b md:border-b-0 md:border-r pb-6 md:pb-0' : 'border-r pr-4 md:pr-0') : ''
                  )}
                  style={{
                      ['--mobile-item-width' as string]: computedMobileItemWidth,
                    borderColor: hasDivider ? divider : undefined,
                    paddingRight: (hasDivider && (mobileLayoutMode === 'scroll' || false)) ? `${stripGap}px` : undefined,
                  }}
                >
                  <div
                    className="flex shrink-0 items-center justify-center overflow-hidden border"
                    style={{
                      width: `${iconChipSize}px`,
                      height: `${iconChipSize}px`,
                      borderRadius: `${Math.round(iconChipSize / 2)}px`,
                      background: itemIconBg,
                      borderColor: iconChipBorder,
                      color: itemIconColor,
                    }}
                  >
                    {item.iconImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.iconImage}
                        alt={item.iconAlt}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      renderIcon(item.iconName, iconSize)
                    )}
                  </div>

                  <div className={cn("min-w-0 flex-1", mobileLayoutMode === 'stack' ? "flex flex-col items-center md:items-start text-center md:text-left" : "")}>
                    <div className={cn("flex items-center gap-2", mobileLayoutMode === 'stack' ? "justify-center md:justify-start" : "")}>
                      <p
                        className="truncate font-extrabold leading-tight"
                        style={{
                          color: itemMetricColor,
                          fontSize: `clamp(${Math.max(18, Math.round(metricSize * 0.55))}px, calc(${Math.max(18, Math.round(metricSize * 0.52))}px + 0.5vw), ${metricSize}px)`,
                        }}
                      >
                        {item.metric}
                      </p>
                      {item.showBadge && item.badgeText ? (
                        <span
                          className="inline-flex shrink-0 items-center rounded-full px-2.5 py-1 font-bold uppercase tracking-[0.08em]"
                          style={{
                            background: itemBadgeBg,
                            color: itemBadgeText,
                            fontSize: `${badgeSize}px`,
                            lineHeight: 1,
                          }}
                        >
                          {item.badgeText}
                        </span>
                      ) : null}
                    </div>
                    <p
                      className="mt-0.5 truncate font-bold uppercase tracking-[0.06em]"
                      style={{ color: itemTitleColor, fontSize: `${titleSize}px` }}
                    >
                      {item.title}
                    </p>
                    <p
                      className="mt-0.5 truncate font-semibold uppercase tracking-[0.11em]"
                      style={{ color: itemSubtitleColor, fontSize: `${subtitleSize}px` }}
                    >
                      {item.subtitle}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
