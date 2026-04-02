'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import SectionHeading from '@/components/ui/SectionHeading';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: 'Are your puppies KCI registered?',
    a: 'Yes, every puppy comes with verified Kennel Club of India (KCI) registration papers. We provide the original registration certificate with documented pedigree lineage going back at least three generations. KCI papers guarantee the breed authenticity and purity of your puppy.',
  },
  {
    q: 'What vaccinations do your puppies receive?',
    a: 'All puppies receive age-appropriate DHPPi (Distemper, Hepatitis, Parvovirus, Parainfluenza) vaccinations, anti-rabies shots (when age-appropriate), and a complete deworming schedule. A full vaccination card with batch numbers and veterinarian signatures is provided with every puppy.',
  },
  {
    q: 'Do you deliver puppies outside Bangalore?',
    a: 'Yes! We arrange safe, climate-controlled delivery across India via trusted pet transport services. Delivery includes a comfortable travel crate, food, water, and live tracking. We also coordinate airport pickups for air-shipped puppies. Delivery charges vary by distance.',
  },
  {
    q: 'Can I visit and see the puppy before purchasing?',
    a: 'Absolutely! We encourage all prospective puppy parents to visit our facility. You can meet the puppy, see the parents, inspect our facilities, and verify all health and registration documents in person. Video calls are also available for outstation buyers.',
  },
  {
    q: 'What is your health guarantee policy?',
    a: 'We provide a comprehensive health guarantee with every puppy. If any congenital health issue is detected within the guarantee period, we cover the veterinary costs or provide a replacement puppy. All puppies are vet-certified healthy before going to their new homes.',
  },
  {
    q: 'How do I reserve a puppy?',
    a: 'To reserve a puppy, contact us via WhatsApp to confirm availability. A partial advance payment secures the puppy exclusively for you. The remaining balance is paid upon pickup or before delivery. We provide a receipt and reservation confirmation for every booking.',
  },
  {
    q: 'Do you provide post-purchase support?',
    a: 'Yes — lifetime! You get a detailed diet chart, vaccination schedule, training tips, and grooming guide. Our WhatsApp support is available for any questions about feeding, behavior, health concerns, or veterinarian recommendations. We are with you through every stage.',
  },
  {
    q: 'What is the difference between a pet quality and show quality puppy?',
    a: 'Pet quality puppies are healthy, purebred dogs perfect for families who want a loving companion. Show quality puppies meet stricter KCI breed standards in terms of structure, coat, color, and conformation — ideal for dog shows and future breeding programs. Both receive the same health care and vaccinations.',
  },
];

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="py-20 lg:py-28 bg-[var(--color-surface)]" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about buying a puppy from Dogs Paradice."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="space-y-3"
        >
          {faqs.map((faq, i) => (
            <motion.div key={i} variants={fadeUpVariant}>
              <div className="glass-card-static overflow-hidden">
                <button
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  className="w-full flex items-start gap-3 p-5 text-left group relative z-10"
                  aria-expanded={openIdx === i}
                >
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200',
                    openIdx === i ? 'bg-white/10 text-white' : 'bg-white/5 text-white/40'
                  )}>
                    <HelpCircle size={16} />
                  </div>
                  <span className={cn(
                    'flex-1 text-sm font-medium transition-colors duration-200 pt-1',
                    openIdx === i ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-white'
                  )}>
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: openIdx === i ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0 mt-1 text-[var(--text-tertiary)]"
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
                      <div className="px-5 pb-5 pl-16 relative z-10">
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
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
