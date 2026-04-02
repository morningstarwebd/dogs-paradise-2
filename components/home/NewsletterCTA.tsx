'use client';

import { motion } from 'motion/react';
import { fadeUpVariant } from '@/lib/animations';
import GlassCard from '@/components/ui/GlassCard';
import { siteConfig } from '@/data/site-config';
import { getWhatsAppLink } from '@/lib/utils';
import { Bell, Gift, Send } from 'lucide-react';

export default function NewsletterCTA() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const phone = formData.get('phone') as string;
    const message = `Hi ${siteConfig.brandName}! I'd like to join your WhatsApp updates list.\n\nMy phone: ${phone}\n\nPlease add me for new puppy arrival alerts!`;
    window.open(getWhatsAppLink(siteConfig.whatsappNumber, message), '_blank');
  };

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden" id="newsletter">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/[0.04] rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/[0.04] rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <GlassCard hover={false} className="p-8 sm:p-12">
            <div className="relative z-10 text-center">
              {/* Icon cluster */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                  <Bell size={24} />
                </div>
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 -mt-4">
                  <Gift size={28} />
                </div>
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                  <Send size={24} />
                </div>
              </div>

              <h2 className="heading-section text-gradient mb-3">
                Get Notified About New Arrivals
              </h2>
              <p className="text-[var(--text-secondary)] mb-8 max-w-lg mx-auto">
                Be the first to know when new puppies arrive. Get exclusive early access, special pricing alerts, and care tips directly on WhatsApp.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="Your WhatsApp number"
                  className="flex-1 bg-white/5 border border-[var(--color-border)] rounded-full px-5 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
                />
                <button
                  type="submit"
                  className="whatsapp-btn px-6 py-3 text-sm font-medium flex items-center justify-center gap-2 shrink-0"
                >
                  <Bell size={16} />
                  Subscribe
                </button>
              </form>

              <p className="text-[10px] text-[var(--text-tertiary)] mt-4">
                🔒 We never spam. Unsubscribe anytime by messaging &quot;STOP&quot;.
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
