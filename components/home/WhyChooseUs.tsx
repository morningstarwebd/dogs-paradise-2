'use client';

import type { CSSProperties, ReactNode } from 'react';
import { motion } from 'motion/react';
import {
  Award,
  Heart,
  Home,
  MessageCircle,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';
import MobileCarousel from '@/components/ui/MobileCarousel';
import GlassCard from '@/components/ui/GlassCard';
import SectionHeading from '@/components/ui/SectionHeading';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';
import { InlineEditable } from '@/components/admin/InlineEditable';
import { buildSectionStyle, resolveColorToken } from '@/lib/gradient-style';

type RawBlock = {
  id?: string;
  type?: string;
  settings?: Record<string, unknown>;
};

type FeatureItem = {
  id: string;
  icon: ReactNode;
  title: string;
  description: string;
  color: string;
  blockId?: string;
  titleKey: string;
  descriptionKey: string;
  iconKey: string;
};

const iconMap = {
  ShieldCheck: <ShieldCheck size={28} />,
  Stethoscope: <Stethoscope size={28} />,
  Award: <Award size={28} />,
  Home: <Home size={28} />,
  Heart: <Heart size={28} />,
  MessageCircle: <MessageCircle size={28} />,
};

const fallbackFeatures = [
  {
    icon: iconMap.ShieldCheck,
    title: 'Clear Registration Status',
    description:
      'We clearly explain whether a puppy is companion-only or available with KCI registration before booking.',
    color: '#2f855a',
  },
  {
    icon: iconMap.Stethoscope,
    title: 'Vet Certified',
    description:
      'Each puppy is shared with age-appropriate health records, vaccination details, and vet-check updates.',
    color: '#1d5c56',
  },
  {
    icon: iconMap.Award,
    title: 'Carefully Selected Litters',
    description:
      'We focus on temperament, health, and family suitability instead of rushing large numbers of listings online.',
    color: '#aa6122',
  },
  {
    icon: iconMap.Home,
    title: 'Home Raised',
    description:
      'Puppies grow up in a home environment with better socialization, calmer handling, and more human interaction.',
    color: '#2b6cb0',
  },
  {
    icon: iconMap.Heart,
    title: 'Health-First Promise',
    description:
      'We prioritize health notes, feeding guidance, and honest expectations so families know what they are taking home.',
    color: '#c53030',
  },
  {
    icon: iconMap.MessageCircle,
    title: 'Lifetime Support',
    description:
      'Diet plans, grooming help, new-parent guidance, and quick WhatsApp support stay available after pickup too.',
    color: '#6b46c1',
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

function buildFeatureItems(blocks: RawBlock[]): FeatureItem[] {
  return blocks
    .filter((block) => block?.type === 'benefit_item' && block.settings)
    .map((block, index) => {
      const settings = block.settings as Record<string, unknown>;
      const fallback = fallbackFeatures[index % fallbackFeatures.length];
      return {
        id: block.id || `benefit_item_${index}`,
        icon: resolveIcon(settings.icon),
        title: toText(settings.title, fallback.title),
        description: toText(settings.description, fallback.description),
        color: toText(settings.color, fallback.color),
        blockId: block.id,
        titleKey: 'title',
        descriptionKey: 'description',
        iconKey: 'icon',
      };
    });
}

function FeatureCard({
  feature,
  sectionId,
  isEditorMode,
  textColor,
}: {
  feature: FeatureItem;
  sectionId?: string;
  isEditorMode?: boolean;
  textColor?: string;
}) {
  const textStyle = textColor ? { color: textColor } : undefined;

  return (
    <GlassCard variant="solid" className="h-full border-emerald-100/50 p-6">
      <div className="relative z-10">
        <InlineEditable
          isEditorMode={isEditorMode}
          sectionId={sectionId}
          propKey={feature.iconKey}
          editType="text"
          blockId={feature.blockId}
          as="div"
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-100/50 bg-emerald-500/10 text-emerald-700"
        >
          <div style={{ color: feature.color }}>{feature.icon}</div>
        </InlineEditable>
        <InlineEditable
          isEditorMode={isEditorMode}
          sectionId={sectionId}
          propKey={feature.titleKey}
          editType="text"
          blockId={feature.blockId}
          as="h3"
          className="heading-card mb-2"
        >
          <span style={textStyle}>{feature.title}</span>
        </InlineEditable>
        <InlineEditable
          isEditorMode={isEditorMode}
          sectionId={sectionId}
          propKey={feature.descriptionKey}
          editType="textarea"
          blockId={feature.blockId}
          as="p"
          className="text-sm leading-relaxed"
        >
          <span style={textStyle}>{feature.description}</span>
        </InlineEditable>
      </div>
    </GlassCard>
  );
}

export default function WhyChooseUs({
  heading = 'Why Dogs Paradise Bangalore?',
  subheading = 'A more transparent, health-first experience for families who want the right puppy, not a rushed sale.',
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
  const blockFeatures = buildFeatureItems(blocks);

  const features: FeatureItem[] =
    blockFeatures.length > 0
      ? blockFeatures
      : fallbackFeatures.map((feature, index) => ({
          id: `legacy_benefit_${index}`,
          icon: feature.icon,
          title: feature.title,
          description: feature.description,
          color: feature.color,
          titleKey: `benefit_${index}_title`,
          descriptionKey: `benefit_${index}_description`,
          iconKey: `benefit_${index}_icon`,
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
    <section className="section-shell section-solid-emerald" id="why-choose-us" style={sectionStyle}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title={heading} subtitle={subheading} useGradientTitle={!sectionTextColor} />

        <MobileCarousel autoPlay autoPlayInterval={3500} itemWidth="large">
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
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
          viewport={{ once: true, margin: '-80px' }}
          className="hidden gap-6 lg:grid lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div key={feature.id} variants={fadeUpVariant}>
              <FeatureCard
                feature={feature}
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
