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
    <section className="py-20 lg:py-28 relative overflow-hidden bg-[#f8fafc]" id="newsletter">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
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
          <GlassCard hover={false} variant="solid" className="p-8 sm:p-14 border-slate-200/60 shadow-xl shadow-blue-900/5">
            <div className="relative z-10 text-center">
              {/* Icon cluster */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-sm border border-purple-100">
                  <Bell size={24} />
                </div>
                <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200 -mt-6 border-4 border-white">
                  <Gift size={32} />
                </div>
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600 shadow-sm border border-cyan-100">
                  <Send size={24} />
                </div>
              </div>

              <h2 className="heading-section text-slate-900 mb-4">
                Join the VIP Updates List
              </h2>
              <p className="text-slate-600 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
                Be the first to know when new puppies arrive. Get exclusive early access alerts and expert care tips directly on your WhatsApp.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="WhatsApp Number"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-6 py-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                />
                <button
                  type="submit"
                  className="whatsapp-btn px-8 py-4 text-sm font-bold flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-green-200"
                >
                  <Bell size={18} />
                  Get Alerts
                </button>
              </form>

              <p className="text-[11px] font-medium text-slate-400 mt-6 flex items-center justify-center gap-2">
                <span className="w-1 h-1 bg-slate-200 rounded-full" />
                No spam policy. Unsubscribe anytime by messaging &quot;STOP&quot;.
                <span className="w-1 h-1 bg-slate-200 rounded-full" />
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
