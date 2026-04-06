'use client';

import { useRef, type CSSProperties, type ReactNode } from 'react';
import { motion, useInView } from 'motion/react';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';
import MobileCarousel from '@/components/ui/MobileCarousel';
import { Dog, Users, Award, Heart, Star, ShieldCheck } from 'lucide-react';
import { InlineEditable } from '@/components/admin/InlineEditable';
import { buildSectionStyle, resolveColorToken } from '@/lib/gradient-style';

const iconMap = {
  Award: <Award size={24} />,
  Users: <Users size={24} />,
  Dog: <Dog size={24} />,
  Heart: <Heart size={24} />,
  Star: <Star size={24} />,
  ShieldCheck: <ShieldCheck size={24} />,
};

type RawBlock = {
  id?: string;
  type?: string;
  settings?: Record<string, unknown>;
};

type StatItem = {
  id: string;
  value: string;
  label: string;
  icon: ReactNode;
  color: string;
  blockId?: string;
  valueKey: string;
  labelKey: string;
  iconKey: string;
};

function toText(value: unknown, fallback: string): string {
  if (typeof value === 'string' && value.trim()) return value;
  if (typeof value === 'number' && !Number.isNaN(value)) return String(value);
  return fallback;
}

function resolveIcon(iconName: unknown, fallback: ReactNode) {
  if (typeof iconName === 'string' && iconName in iconMap) {
    return iconMap[iconName as keyof typeof iconMap];
  }
  return fallback;
}

function buildBlockStats(blocks: RawBlock[]): StatItem[] {
  return blocks
    .filter((block) => block?.type === 'stat_item' && block.settings)
    .map((block, index) => {
      const settings = block.settings as Record<string, unknown>;
      const fallbackColor = ['#ea728c', '#4caf50', '#9333ea', '#f5c842'][index % 4];
      return {
        id: block.id || `stat_item_${index}`,
        value: toText(settings.value, `${index + 1}`),
        label: toText(settings.label, `Stat ${index + 1}`),
        icon: resolveIcon(settings.icon, <Award size={24} />),
        color: toText(settings.color, fallbackColor),
        blockId: block.id,
        valueKey: 'value',
        labelKey: 'label',
        iconKey: 'icon',
      };
    });
}

function StatCard({
  stat,
  sectionId,
  isEditorMode,
  textColor,
}: {
  stat: StatItem;
  sectionId?: string;
  isEditorMode?: boolean;
  textColor?: string;
}) {
  const textStyle = textColor ? { color: textColor } : undefined;

  return (
    <div className="bg-white border border-[#FFF0D9]/50 shadow-sm rounded-2xl p-5 text-center group hover:shadow-md transition-all duration-300 h-full w-[160px] mx-auto lg:w-full">
      <div className="relative z-10">
        <InlineEditable
          isEditorMode={isEditorMode}
          sectionId={sectionId}
          propKey={stat.iconKey}
          editType="text"
          blockId={stat.blockId}
          as="div"
          className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
        >
          <div
            className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center"
            style={{ background: `${stat.color}15`, color: stat.color }}
          >
            {stat.icon}
          </div>
        </InlineEditable>
        <InlineEditable
          isEditorMode={isEditorMode}
          sectionId={sectionId}
          propKey={stat.valueKey}
          editType="text"
          blockId={stat.blockId}
          as="p"
          className="text-3xl lg:text-4xl font-bold mb-1"
        >
          <span style={textStyle}>{stat.value}</span>
        </InlineEditable>
        <InlineEditable
          isEditorMode={isEditorMode}
          sectionId={sectionId}
          propKey={stat.labelKey}
          editType="text"
          blockId={stat.blockId}
          as="p"
          className="text-[10px] sm:text-xs uppercase font-black tracking-wider"
        >
          <span style={textStyle}>{stat.label}</span>
        </InlineEditable>
      </div>
    </div>
  );
}

export default function StatsCounter({
  blocks = [],
  sectionId,
  isEditorMode = false,
  section_bg_color,
  section_text_color,
  section_padding_top,
  section_padding_bottom,
  section_margin_top,
  section_margin_bottom,
  stat1_value = '12+', stat1_label = 'Years Experience',
  stat2_value = '2000+', stat2_label = 'Happy Families',
  stat3_value = '25+', stat3_label = 'Breeds Available',
  stat4_value = '99%', stat4_label = 'Satisfaction Rate',
}: {
  blocks?: RawBlock[];
  sectionId?: string;
  isEditorMode?: boolean;
  section_bg_color?: string;
  section_text_color?: string;
  section_padding_top?: string;
  section_padding_bottom?: string;
  section_margin_top?: string;
  section_margin_bottom?: string;
  stat1_value?: string;
  stat1_label?: string;
  stat2_value?: string;
  stat2_label?: string;
  stat3_value?: string;
  stat3_label?: string;
  stat4_value?: string;
  stat4_label?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const blockStats = buildBlockStats(blocks);
  const legacyStats: StatItem[] = [
    {
      id: 'legacy-stat-1',
      value: stat1_value,
      label: stat1_label,
      icon: <Award size={24} />,
      color: '#ea728c',
      valueKey: 'stat1_value',
      labelKey: 'stat1_label',
      iconKey: 'stat1_icon',
    },
    {
      id: 'legacy-stat-2',
      value: stat2_value,
      label: stat2_label,
      icon: <Users size={24} />,
      color: '#4caf50',
      valueKey: 'stat2_value',
      labelKey: 'stat2_label',
      iconKey: 'stat2_icon',
    },
    {
      id: 'legacy-stat-3',
      value: stat3_value,
      label: stat3_label,
      icon: <Dog size={24} />,
      color: '#9333ea',
      valueKey: 'stat3_value',
      labelKey: 'stat3_label',
      iconKey: 'stat3_icon',
    },
    {
      id: 'legacy-stat-4',
      value: stat4_value,
      label: stat4_label,
      icon: <Heart size={24} />,
      color: '#f5c842',
      valueKey: 'stat4_value',
      labelKey: 'stat4_label',
      iconKey: 'stat4_icon',
    },
  ];

  const dynamicStats = blockStats.length > 0 ? blockStats : legacyStats;
  const sectionStyle: CSSProperties = buildSectionStyle({
    background: section_bg_color,
    backgroundFallback: '#FFF0D9',
    text: section_text_color,
    paddingTop: section_padding_top,
    paddingBottom: section_padding_bottom,
    marginTop: section_margin_top,
    marginBottom: section_margin_bottom,
  });
  const sectionTextColor = resolveColorToken(section_text_color);

  return (
    <section className="py-8 section-solid-amber relative overflow-hidden" ref={ref} style={sectionStyle}>
      <div className="hidden md:block absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-[#ea728c]/[0.03] rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-[#302b63]/[0.03] rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Mobile Carousel */}
        <div className="lg:hidden">
          <MobileCarousel autoPlay autoPlayInterval={2500} itemWidth="small">
            {dynamicStats.map((stat) => (
              <StatCard
                key={stat.id}
                stat={stat}
                sectionId={sectionId}
                isEditorMode={isEditorMode}
                textColor={sectionTextColor}
              />
            ))}
          </MobileCarousel>
        </div>

        {/* Desktop Grid (4 cols now) */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="hidden lg:grid lg:grid-cols-4 gap-6 px-12"
        >
          {dynamicStats.map((stat) => (
            <motion.div key={stat.id} variants={fadeUpVariant}>
              <StatCard
                stat={stat}
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
