'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { fadeUpVariant } from '@/lib/animations';
import GlassCard from '@/components/ui/GlassCard';
import { useCartStore } from '@/lib/store/cart';
import { formatPrice, getWhatsAppLink } from '@/lib/utils';
import { siteConfig } from '@/data/site-config';
import { Trash2, MessageCircle, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartClient() {
  const { items, removeItem, clearCart } = useCartStore();

  const handleEnquiry = () => {
    const itemList = items
      .map((item) => `• ${item.breedName}${item.name ? ` (${item.name})` : ''}`)
      .join('\n');

    const message = `Hi ${siteConfig.brandName}!\n\nI'm interested in the following puppies:\n\n${itemList}\n\nPlease share more details and availability. Thank you!`;
    window.open(getWhatsAppLink(siteConfig.whatsappNumber, message), '_blank');
  };

  if (items.length === 0) {
    return (
      <div className="pt-24 pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <motion.div variants={fadeUpVariant} initial="hidden" animate="visible">
            <ShoppingBag size={64} className="mx-auto mb-6 text-white/10" />
            <h1 className="heading-section text-gradient mb-4">Your Cart is Empty</h1>
            <p className="text-[var(--text-secondary)] mb-8">
              Browse our available puppies and add them to your enquiry cart to send a single WhatsApp message.
            </p>
            <Link
              href="/breeds"
              className="glass-btn px-8 py-4 text-base font-medium inline-flex items-center gap-2"
            >
              Browse Breeds
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={fadeUpVariant} initial="hidden" animate="visible">
          <h1 className="heading-section text-gradient mb-2">Enquiry Cart</h1>
          <p className="text-[var(--text-secondary)] mb-8">
            {items.length} {items.length === 1 ? 'puppy' : 'puppies'} selected for enquiry
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.dogId}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                >
                  <GlassCard hover={false} className="p-4">
                    <div className="relative z-10 flex items-center gap-4">
                      <Link href={`/breeds/${item.slug}`} className="shrink-0">
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden">
                          <Image
                            src={item.thumbnailImage}
                            alt={item.breedName}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link href={`/breeds/${item.slug}`}>
                          <h3 className="heading-card text-gradient hover:opacity-80 transition-opacity">
                            {item.breedName}
                          </h3>
                        </Link>
                        {item.name && (
                          <p className="text-xs text-[var(--text-tertiary)]">&ldquo;{item.name}&rdquo;</p>
                        )}

                      </div>
                      <button
                        onClick={() => removeItem(item.dogId)}
                        className="p-2 text-[var(--text-tertiary)] hover:text-red-400 transition-colors"
                        aria-label={`Remove ${item.breedName} from cart`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <GlassCard hover={false} className="p-6">
                <div className="relative z-10">
                  <h3 className="heading-card text-white mb-4">Enquiry Summary</h3>
                  <div className="space-y-3 mb-6 pb-6 border-b border-[var(--color-border)]">
                    {items.map((item) => (
                      <div key={item.dogId} className="flex justify-between text-sm py-1">
                        <span className="text-[var(--text-secondary)] truncate">{item.breedName}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleEnquiry}
                    className="whatsapp-btn w-full px-6 py-4 text-sm font-medium flex items-center justify-center gap-2 mb-3 pulse-glow"
                  >
                    <MessageCircle size={18} />
                    Send Enquiry via WhatsApp
                  </button>

                  <button
                    onClick={clearCart}
                    className="w-full text-xs text-[var(--text-tertiary)] hover:text-red-400 transition-colors py-2"
                  >
                    Clear Cart
                  </button>

                  <p className="text-[10px] text-[var(--text-tertiary)] text-center mt-3">
                    This is an enquiry cart, not a purchase. A WhatsApp message will be sent with your selected puppies.
                  </p>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
