'use client';

import type { CSSProperties, ReactNode } from 'react';
import { motion } from 'motion/react';
import GlassCard from '@/components/ui/GlassCard';
import MobileCarousel from '@/components/ui/MobileCarousel';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';
import { Award, BadgeCheck, FileCheck, ShieldCheck, Star, Stethoscope } from 'lucide-react';
import { InlineEditable } from '@/components/admin/InlineEditable';
import { buildSectionStyle, resolveColorToken } from '@/lib/gradient-style';

type RawBlock = {
  id?: string;
  type?: string;
  settings?: Record<string, unknown>;
};

type BadgeItem = {
  id: string;
  icon: ReactNode;
  title: string;
  subtitle: string;
  color: string;
  blockId?: string;
  titleKey: string;
  subtitleKey: string;
  iconKey: string;
};

const iconMap = {
  ShieldCheck: <ShieldCheck size={32} />,
  Stethoscope: <Stethoscope size={32} />,
  FileCheck: <FileCheck size={32} />,
  Award: <Award size={32} />,
  BadgeCheck: <BadgeCheck size={32} />,
  Star: <Star size={32} />,
};

const fallbackBadges = [
  {
    icon: iconMap.ShieldCheck,
    title: 'Transparent Paperwork',
    subtitle: 'Clear puppy-by-puppy guidance',
    color: '#8f452b',
  },
  {
    icon: iconMap.Stethoscope,
    title: 'Vet Checked Puppies',
    subtitle: 'Health-first handover process',
    color: '#1d5c56',
  },
  {
    icon: iconMap.FileCheck,
    title: 'Health Records Shared',
    subtitle: 'Vaccination and care updates',
    color: '#7a5d2f',
  },
  {
    icon: iconMap.Award,
    title: 'Champion Lines Available',
    subtitle: 'Select premium litters',
    color: '#aa6122',
  },
  {
    icon: iconMap.BadgeCheck,
    title: 'After-Pickup Support',
    subtitle: 'Guidance beyond booking day',
    color: '#2d6670',
  },
  {
    icon: iconMap.Star,
    title: '4.9 Google Rated',
    subtitle: 'Trusted by local families',
    color: '#c29328',
  },
];

function toText(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

function resolveIcon(value: unknown) {
  if (typeof value === 'string' && value in iconMap) {
    return iconMap[value as keyof typeof iconMap];
  }
  return iconMap.ShieldCheck;
}

function buildBadgeItems(blocks: RawBlock[]): BadgeItem[] {
  return blocks
    .filter((block) => block?.type === 'trust_badge' && block.settings)
    .map((block, index) => {
      const settings = block.settings as Record<string, unknown>;
      const fallback = fallbackBadges[index % fallbackBadges.length];
      return {
        id: block.id || `trust_badge_${index}`,
        icon: resolveIcon(settings.icon),
        title: toText(settings.title, fallback.title),
        subtitle: toText(settings.subtitle, fallback.subtitle),
        color: toText(settings.color, fallback.color),
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
  textColor,
}: {
  badge: BadgeItem;
  sectionId?: string;
  isEditorMode?: boolean;
  textColor?: string;
}) {
  const textStyle = textColor ? { color: textColor } : undefined;

  return (
    <GlassCard hover className="h-full p-5 text-center">
      <div className="relative z-10">
        <InlineEditable
          isEditorMode={isEditorMode}
          sectionId={sectionId}
          propKey={badge.iconKey}
          editType="text"
          blockId={badge.blockId}
          as="div"
          className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl"
        >
          <div
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ background: `${badge.color}14`, color: badge.color }}
          >
            {badge.icon}
          </div>
        </InlineEditable>
        <InlineEditable
          isEditorMode={isEditorMode}
          sectionId={sectionId}
          propKey={badge.titleKey}
          editType="text"
          blockId={badge.blockId}
          as="p"
          className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)]"
        >
          <span style={textStyle}>{badge.title}</span>
        </InlineEditable>
        <InlineEditable
          isEditorMode={isEditorMode}
          sectionId={sectionId}
          propKey={badge.subtitleKey}
          editType="text"
          blockId={badge.blockId}
          as="p"
          className="text-[11px] text-[var(--text-tertiary)]"
        >
          <span style={textStyle}>{badge.subtitle}</span>
        </InlineEditable>
      </div>
    </GlassCard>
  );
}

export default function TrustBadges({
  heading = 'Built on Trust & Transparency',
  subheading = 'Proof points that matter for responsible adoption.',
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
  heading?: string;
  subheading?: string;
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
          icon: badge.icon,
          title: badge.title,
          subtitle: badge.subtitle,
          color: badge.color,
          titleKey: `trust_badge_${index}_title`,
          subtitleKey: `trust_badge_${index}_subtitle`,
          iconKey: `trust_badge_${index}_icon`,
        }));

  const sectionStyle: CSSProperties = buildSectionStyle({
    background: section_bg_color,
    text: section_text_color,
    paddingTop: section_padding_top,
    paddingBottom: section_padding_bottom,
    marginTop: section_margin_top,
    marginBottom: section_margin_bottom,
  });
  const sectionTextColor = resolveColorToken(section_text_color);

  return (
    <section className="section-shell-tight relative overflow-hidden" id="trust-badges" style={sectionStyle}>
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[var(--text-tertiary)]">
            Trusted and Transparent
          </p>
          <InlineEditable
            isEditorMode={isEditorMode}
            sectionId={sectionId}
            propKey="heading"
            editType="text"
            as="h2"
            className="heading-card text-gradient"
          >
            {heading}
          </InlineEditable>
          <InlineEditable
            isEditorMode={isEditorMode}
            sectionId={sectionId}
            propKey="subheading"
            editType="textarea"
            as="p"
            className="mt-2 text-sm text-[var(--text-tertiary)]"
          >
            {subheading}
          </InlineEditable>
        </motion.div>

        <MobileCarousel autoPlay autoPlayInterval={2500} itemWidth="small">
          {badges.map((badge) => (
            <BadgeCard
              key={badge.id}
              badge={badge}
              sectionId={sectionId}
              isEditorMode={isEditorMode}
              textColor={sectionTextColor}
            />
          ))}
        </MobileCarousel>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="hidden gap-4 lg:grid lg:grid-cols-6"
        >
          {badges.map((badge) => (
            <motion.div key={badge.id} variants={fadeUpVariant}>
              <BadgeCard
                badge={badge}
                sectionId={sectionId}
                isEditorMode={isEditorMode}
                textColor={sectionTextColor}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
