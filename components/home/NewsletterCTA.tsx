'use client';

import type { CSSProperties, ComponentType } from 'react';
import { motion } from 'motion/react';
import { fadeUpVariant } from '@/lib/animations';
import GlassCard from '@/components/ui/GlassCard';
import { siteConfig } from '@/data/site-config';
import { getWhatsAppLink } from '@/lib/utils';
import { buildSectionStyle, resolveColorToken } from '@/lib/gradient-style';
import { Bell, Gift, Send } from 'lucide-react';

type RawBlock = {
  id?: string;
  type?: string;
  settings?: Record<string, unknown>;
};

type IconClusterItem = {
  id: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  bgColor: string;
  iconColor: string;
  isFeatured: boolean;
};

type SectionDesignProps = {
  heading?: string;
  subheading?: string;
  button_text?: string;
  input_placeholder?: string;
  footer_note?: string;
  blocks?: RawBlock[];
  section_bg_color?: string;
  section_text_color?: string;
  section_padding_top?: string;
  section_padding_bottom?: string;
  section_margin_top?: string;
  section_margin_bottom?: string;
};

const newsletterIconMap = {
  Bell,
  Gift,
  Send,
};

function toText(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

function resolveIcon(value: unknown) {
  if (typeof value === 'string' && value in newsletterIconMap) {
    return newsletterIconMap[value as keyof typeof newsletterIconMap];
  }
  return Bell;
}

function buildIconCluster(blocks: RawBlock[]): IconClusterItem[] {
  return blocks
    .filter((block) => block?.type === 'newsletter_icon' && block.settings)
    .map((block, index) => {
      const settings = block.settings as Record<string, unknown>;
      return {
        id: block.id || `newsletter_icon_${index}`,
        icon: resolveIcon(settings.icon),
        bgColor: toText(settings.bg_color, '#f3e8ff'),
        iconColor: toText(settings.icon_color, '#7c3aed'),
        isFeatured: Boolean(settings.is_featured),
      };
    });
}

export default function NewsletterCTA({
  heading = 'Join the VIP Updates List',
  subheading = 'Be the first to know when new puppies arrive. Get exclusive early access alerts and expert care tips directly on your WhatsApp.',
  button_text = 'Get Alerts',
  input_placeholder = 'WhatsApp Number',
  footer_note = 'No spam policy. Unsubscribe anytime by messaging "STOP".',
  blocks = [],
  section_bg_color,
  section_text_color,
  section_padding_top,
  section_padding_bottom,
  section_margin_top,
  section_margin_bottom,
}: SectionDesignProps) {
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

  const blockIcons = buildIconCluster(blocks);
  const iconCluster: IconClusterItem[] =
    blockIcons.length > 0
      ? blockIcons
      : [
          { id: 'default-newsletter-icon-1', icon: Bell, bgColor: '#f3e8ff', iconColor: '#7c3aed', isFeatured: false },
          { id: 'default-newsletter-icon-2', icon: Gift, bgColor: '#2563eb', iconColor: '#ffffff', isFeatured: true },
          { id: 'default-newsletter-icon-3', icon: Send, bgColor: '#ecfeff', iconColor: '#0891b2', isFeatured: false },
        ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const phone = formData.get('phone') as string;
    const message = `Hi ${siteConfig.brandName}! I'd like to join your WhatsApp updates list.\n\nMy phone: ${phone}\n\nPlease add me for new puppy arrival alerts!`;
    window.open(getWhatsAppLink(siteConfig.whatsappNumber, message), '_blank');
  };

  return (
    <section className="section-shell relative overflow-hidden bg-[#302b63]" id="newsletter" style={sectionStyle}>
      {/* Background effects */}
      <div className="hidden md:block absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/[0.03] rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/[0.03] rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <GlassCard hover={false} variant="solid" className="border-slate-200/60 p-6 shadow-xl shadow-blue-900/5 sm:p-10 lg:p-14">
            <div className="relative z-10 text-center">
              {/* Icon cluster */}
              <div className="flex items-center justify-center gap-4 mb-8">
                {iconCluster.map((item) => {
                  const Icon = item.icon;
                  const sizeClass = item.isFeatured ? 'w-16 h-16 -mt-6 border-4' : 'w-12 h-12 border';
                  return (
                    <div
                      key={item.id}
                      className={`${sizeClass} rounded-2xl flex items-center justify-center shadow-sm border-white`}
                      style={{ backgroundColor: item.bgColor, color: item.iconColor }}
                    >
                      <Icon size={item.isFeatured ? 32 : 24} />
                    </div>
                  );
                })}
              </div>

              <h2 className="heading-section text-slate-900 mb-4" style={sectionTextColor ? { color: sectionTextColor } : undefined}>
                {heading}
              </h2>
              <p className="text-slate-600 mb-10 max-w-lg mx-auto text-lg leading-relaxed" style={sectionTextColor ? { color: sectionTextColor } : undefined}>
                {subheading}
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder={input_placeholder}
                  className="flex-1 bg-[#302b63] border border-slate-200 rounded-full px-6 py-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                />
                <button
                  type="submit"
                  className="whatsapp-btn px-8 py-4 text-sm font-bold flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-green-200"
                >
                  <Bell size={18} />
                  {button_text}
                </button>
              </form>

              <p className="text-[11px] font-medium text-slate-400 mt-6 flex items-center justify-center gap-2">
                <span className="w-1 h-1 bg-slate-200 rounded-full" />
                {footer_note}
                <span className="w-1 h-1 bg-slate-200 rounded-full" />
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
