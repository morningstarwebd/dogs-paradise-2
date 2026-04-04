'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import SectionHeading from '@/components/ui/SectionHeading';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';
import { siteConfig } from '@/data/site-config';
import { cn } from '@/lib/utils';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
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

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="section-shell bg-[var(--color-surface)]" id="faq">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Frequently Asked Questions"
          subtitle={`Everything you should know before choosing a puppy from ${siteConfig.brandName}.`}
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="space-y-3"
        >
          {faqs.map((faq, i) => (
            <motion.div key={faq.q} variants={fadeUpVariant}>
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
                      openIdx === i
                        ? 'text-[var(--text-primary)]'
                        : 'text-[var(--text-secondary)]'
                    )}
                  >
                    {faq.q}
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
                        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                          {faq.a}
                        </p>
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
