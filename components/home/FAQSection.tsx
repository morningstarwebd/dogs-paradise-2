'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import type { CSSProperties } from 'react';
import SectionHeading from '@/components/ui/SectionHeading';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';
import { siteConfig } from '@/data/site-config';
import { cn } from '@/lib/utils';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { InlineEditable } from '@/components/admin/InlineEditable';
import { buildSectionStyle, resolveColorToken } from '@/lib/gradient-style';

type RawBlock = {
  id?: string;
  type?: string;
  settings?: Record<string, unknown>;
};

type FAQItem = {
  id: string;
  question: string;
  answer: string;
  blockId?: string;
  questionKey: string;
  answerKey: string;
};

const fallbackFaqs = [
  {
    q: 'Are all of your puppies KCI registered?',
    a: 'No. KCI registration is available only for select puppies and litters. We clearly confirm the paperwork status for the exact puppy before you book.',
  },
  {
    q: 'What vaccinations do your puppies receive?',
    a: 'Puppies leave with age-appropriate vaccination updates, deworming records, and vet health notes. We also guide you on the next due dates after pickup.',
  },
  {
    q: 'Do you deliver puppies outside Bangalore?',
    a: 'Yes. We help coordinate safe travel across India depending on the puppy, destination, and weather conditions. We explain the process in detail before confirming delivery.',
  },
  {
    q: 'Can I visit before choosing a puppy?',
    a: 'Yes. We encourage visits and video calls so you can understand the puppy, ask questions, and review health details before making a decision.',
  },
  {
    q: 'What documents do you share at handover?',
    a: 'We share the health records, vaccination details, feeding guidance, and any paperwork applicable to that puppy. Registration papers are included only where available.',
  },
  {
    q: 'How do I reserve a puppy?',
    a: 'Message us on WhatsApp to confirm availability. Once we discuss the puppy and answer your questions, we will guide you through the booking process.',
  },
  {
    q: 'Do you support first-time pet parents?',
    a: 'Yes. We help with food guidance, settling-in tips, grooming basics, vaccination reminders, and general after-pickup support.',
  },
  {
    q: 'What is the difference between a companion puppy and a paperwork-eligible puppy?',
    a: 'Companion puppies are matched for healthy family homes, while some puppies may also be available with specific registration or lineage paperwork. We explain the difference case by case so expectations stay clear.',
  },
];

function toText(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

function buildFaqItems(blocks: RawBlock[]): FAQItem[] {
  return blocks
    .filter((block) => block?.type === 'faq_item' && block.settings)
    .map((block, index) => {
      const settings = block.settings as Record<string, unknown>;
      return {
        id: block.id || `faq_item_${index}`,
        question: toText(settings.question, `Question ${index + 1}`),
        answer: toText(settings.answer, 'Add your answer here.'),
        blockId: block.id,
        questionKey: 'question',
        answerKey: 'answer',
      };
    });
}

export default function FAQSection({
  heading = 'Frequently Asked Questions',
  subheading = `Everything you should know before choosing a puppy from ${siteConfig.brandName}.`,
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
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const blockItems = buildFaqItems(blocks);

  const faqItems: FAQItem[] =
    blockItems.length > 0
      ? blockItems
      : fallbackFaqs.map((faq, index) => ({
          id: `legacy_faq_${index}`,
          question: faq.q,
          answer: faq.a,
          questionKey: `faq_${index}_question`,
          answerKey: `faq_${index}_answer`,
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
    <section className="section-shell bg-[var(--color-surface)]" id="faq" style={sectionStyle}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title={heading} subtitle={subheading} useGradientTitle={!sectionTextColor} />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="space-y-3"
        >
          {faqItems.map((faq, i) => (
            <motion.div key={faq.id} variants={fadeUpVariant}>
              <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
                <button
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  className="relative z-10 flex w-full items-start gap-4 p-5 text-left"
                  aria-expanded={openIdx === i}
                >
                  <div
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors duration-200',
                      openIdx === i
                        ? 'bg-[var(--accent-primary)] text-white'
                        : 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]'
                    )}
                  >
                    <HelpCircle size={16} />
                  </div>
                  <span
                    className={cn(
                      'flex-1 pt-1 text-sm font-semibold transition-colors duration-200',
                      !sectionTextColor && openIdx === i
                        ? 'text-[var(--text-primary)]'
                        : !sectionTextColor
                          ? 'text-[var(--text-secondary)]'
                          : ''
                    )}
                    style={sectionTextColor ? { color: sectionTextColor } : undefined}
                  >
                    <InlineEditable
                      isEditorMode={isEditorMode}
                      sectionId={sectionId}
                      propKey={faq.questionKey}
                      editType="text"
                      blockId={faq.blockId}
                      as="span"
                    >
                      {faq.question}
                    </InlineEditable>
                  </span>
                  <motion.div
                    animate={{ rotate: openIdx === i ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-1 shrink-0 text-[var(--text-tertiary)]"
                  >
                    <ChevronDown size={18} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {openIdx === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-[var(--color-border)] px-5 pb-5 pl-[72px] pt-4">
                        <InlineEditable
                          isEditorMode={isEditorMode}
                          sectionId={sectionId}
                          propKey={faq.answerKey}
                          editType="textarea"
                          blockId={faq.blockId}
                          as="p"
                          className={cn('text-sm leading-relaxed', !sectionTextColor ? 'text-[var(--text-secondary)]' : '')}
                        >
                          <span style={sectionTextColor ? { color: sectionTextColor } : undefined}>{faq.answer}</span>
                        </InlineEditable>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
