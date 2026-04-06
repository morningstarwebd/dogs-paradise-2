'use client';

import type { CSSProperties, ReactNode } from 'react';
import { motion } from 'motion/react';
import SectionHeading from '@/components/ui/SectionHeading';
import GlassCard from '@/components/ui/GlassCard';
import MobileCarousel from '@/components/ui/MobileCarousel';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';
import { MessageCircle, Search, Heart, Home, Phone, Truck } from 'lucide-react';
import { InlineEditable } from '@/components/admin/InlineEditable';
import { buildSectionStyle, resolveColorToken } from '@/lib/gradient-style';

type RawBlock = {
  id?: string;
  type?: string;
  settings?: Record<string, unknown>;
};

type StepItem = {
  id: string;
  step: number;
  icon: ReactNode;
  title: string;
  description: string;
  color: string;
  blockId?: string;
  stepKey: string;
  iconKey: string;
  titleKey: string;
  descriptionKey: string;
};

const iconMap = {
  Search: <Search size={24} />,
  MessageCircle: <MessageCircle size={24} />,
  Phone: <Phone size={24} />,
  Heart: <Heart size={24} />,
  Truck: <Truck size={24} />,
  Home: <Home size={24} />,
};

const fallbackSteps = [
  {
    step: 1,
    icon: iconMap.Search,
    title: 'Browse & Choose',
    description: 'Explore our available puppies online. Filter by breed, size, gender, and more to find your perfect match.',
    color: '#a855f7',
  },
  {
    step: 2,
    icon: iconMap.MessageCircle,
    title: 'Connect via WhatsApp',
    description: 'Reach out to us on WhatsApp for real-time photos, videos, and answers to all your questions about the puppy.',
    color: '#22c55e',
  },
  {
    step: 3,
    icon: iconMap.Phone,
    title: 'Video Call & Visit',
    description: 'Schedule a video call or visit our facility in person. Meet your puppy, check health papers, and see the parents.',
    color: '#3b82f6',
  },
  {
    step: 4,
    icon: iconMap.Heart,
    title: 'Reserve Your Puppy',
    description: 'Reserve your chosen puppy with a partial payment. We hold them exclusively for you with full transparency.',
    color: '#ef4444',
  },
  {
    step: 5,
    icon: iconMap.Truck,
    title: 'Delivery or Pickup',
    description: 'Collect your puppy in person, or we arrange safe, climate-controlled delivery across India with live tracking.',
    color: '#f59e0b',
  },
  {
    step: 6,
    icon: iconMap.Home,
    title: 'Welcome Home!',
    description: 'Your new family member arrives with vaccination card, diet plan, training guide, and lifetime WhatsApp support.',
    color: '#06b6d4',
  },
];

function toText(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

function toStepNumber(value: unknown, fallback: number): number {
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  if (typeof value === 'string') {
    const parsed = parseInt(value, 10);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return fallback;
}

function resolveIcon(value: unknown) {
  if (typeof value === 'string' && value in iconMap) {
    return iconMap[value as keyof typeof iconMap];
  }
  return iconMap.Search;
}

function buildStepItems(blocks: RawBlock[]): StepItem[] {
  return blocks
    .filter((block) => block?.type === 'process_step' && block.settings)
    .map((block, index) => {
      const settings = block.settings as Record<string, unknown>;
      const fallback = fallbackSteps[index % fallbackSteps.length];
      return {
        id: block.id || `process_step_${index}`,
        step: toStepNumber(settings.step_number, index + 1),
        icon: resolveIcon(settings.icon),
        title: toText(settings.title, fallback.title),
        description: toText(settings.description, fallback.description),
        color: toText(settings.color, fallback.color),
        blockId: block.id,
        stepKey: 'step_number',
        iconKey: 'icon',
        titleKey: 'title',
        descriptionKey: 'description',
      };
    });
}

function StepCard({
  step,
  sectionId,
  isEditorMode,
  textColor,
}: {
  step: StepItem;
  sectionId?: string;
  isEditorMode?: boolean;
  textColor?: string;
}) {
  const textStyle = textColor ? { color: textColor } : undefined;

  return (
    <GlassCard variant="solid" className="p-6 h-full relative group border-purple-100/50">
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <InlineEditable
            isEditorMode={isEditorMode}
            sectionId={sectionId}
            propKey={step.iconKey}
            editType="text"
            blockId={step.blockId}
            as="div"
            className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: `${step.color}10`, color: step.color }}
            >
              {step.icon}
            </div>
          </InlineEditable>
          <InlineEditable
            isEditorMode={isEditorMode}
            sectionId={sectionId}
            propKey={step.stepKey}
            editType="number"
            blockId={step.blockId}
            as="span"
            className="text-xl font-display font-bold opacity-30"
          >
            <span style={{ color: step.color }}>
              {String(step.step).padStart(2, '0')}
            </span>
          </InlineEditable>
        </div>
        <InlineEditable
          isEditorMode={isEditorMode}
          sectionId={sectionId}
          propKey={step.titleKey}
          editType="text"
          blockId={step.blockId}
          as="h3"
          className="heading-card mb-2"
        >
          <span style={textStyle}>{step.title}</span>
        </InlineEditable>
        <InlineEditable
          isEditorMode={isEditorMode}
          sectionId={sectionId}
          propKey={step.descriptionKey}
          editType="textarea"
          blockId={step.blockId}
          as="p"
          className="text-sm leading-relaxed"
        >
          <span style={textStyle}>{step.description}</span>
        </InlineEditable>
      </div>
    </GlassCard>
  );
}

export default function AdoptionProcess({
  heading = 'How It Works',
  subheading = 'From browsing to bringing home — our simple 6-step adoption process.',
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
  const blockSteps = buildStepItems(blocks);
  const steps: StepItem[] =
    blockSteps.length > 0
      ? blockSteps
      : fallbackSteps.map((step, index) => ({
          id: `legacy_process_step_${index}`,
          step: step.step,
          icon: step.icon,
          title: step.title,
          description: step.description,
          color: step.color,
          stepKey: `process_step_${index}_number`,
          iconKey: `process_step_${index}_icon`,
          titleKey: `process_step_${index}_title`,
          descriptionKey: `process_step_${index}_description`,
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
    <section className="section-shell section-solid-purple relative overflow-hidden" id="adoption-process" style={sectionStyle}>
      <div className="hidden md:block">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-purple-500/[0.03] rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-500/[0.03] rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading title={heading} subtitle={subheading} useGradientTitle={!sectionTextColor} />

        {/* Mobile Carousel */}
        <MobileCarousel autoPlay autoPlayInterval={3000} itemWidth="large">
          {steps.map((step) => (
            <StepCard
              key={step.id}
              step={step}
              sectionId={sectionId}
              isEditorMode={isEditorMode}
              textColor={sectionTextColor}
            />
          ))}
        </MobileCarousel>

        {/* Desktop Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="relative hidden lg:block"
        >
          <div className="absolute top-[60px] left-[calc(8.33%+24px)] right-[calc(8.33%+24px)] h-[2px] bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20" />
          <div className="grid grid-cols-3 gap-6">
            {steps.map((step) => (
              <motion.div key={step.id} variants={fadeUpVariant}>
                <StepCard
                  step={step}
                  sectionId={sectionId}
                  isEditorMode={isEditorMode}
                  textColor={sectionTextColor}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
