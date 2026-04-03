'use client';

import { motion } from 'motion/react';
import { fadeUpVariant } from '@/lib/animations';
import { siteConfig } from '@/data/site-config';
import { getWhatsAppLink } from '@/lib/utils';
import { MessageCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CallToAction() {
  const message = `Hi ${siteConfig.brandName}! I'm interested in your puppies. Can you share more details?`;

  return (
    <section className="py-20 lg:py-28 section-orange relative overflow-hidden" id="cta">
      {/* Subtle glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="heading-section text-gradient mb-4">
            Ready to Meet Your New Best Friend?
          </h2>
          <p className="text-lg text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto">
            Get in touch via WhatsApp for instant responses, or browse our available puppies. We&apos;d love to help you find the perfect companion.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={getWhatsAppLink(siteConfig.whatsappNumber, message)}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-btn px-8 py-4 text-base font-medium inline-flex items-center justify-center gap-2 pulse-glow"
            >
              <MessageCircle size={20} />
              WhatsApp Us Now
            </a>
            <Link
              href="/breeds"
              className="glass-btn px-8 py-4 text-base font-medium inline-flex items-center justify-center gap-2"
            >
              Browse All Breeds
              <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
