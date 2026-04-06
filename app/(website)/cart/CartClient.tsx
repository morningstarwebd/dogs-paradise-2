'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import GlassCard from '@/components/ui/GlassCard';
import { fadeUpVariant } from '@/lib/animations';
import { useCartStore } from '@/lib/store/cart';
import { getWhatsAppLink } from '@/lib/utils';
import { siteConfig } from '@/data/site-config';
import { ArrowRight, MessageCircle, ShoppingBag, Trash2 } from 'lucide-react';

export default function CartClient() {
  const { items, removeItem, clearCart } = useCartStore();

  const handleEnquiry = () => {
    const itemList = items
      .map((item) => `- ${item.breedName}${item.name ? ` (${item.name})` : ''}`)
      .join('\n');

    const message = [
      `Hi ${siteConfig.brandName}!`,
      '',
      "I'm interested in the following puppies:",
      '',
      itemList,
      '',
      'Please share more details and availability.',
    ].join('\n');

    window.open(getWhatsAppLink(siteConfig.whatsappNumber, message), '_blank');
  };

  if (items.length === 0) {
    return (
      <div className="pb-20 pt-24">
        <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <motion.div variants={fadeUpVariant} initial="hidden" animate="visible">
            <ShoppingBag size={64} className="mx-auto mb-6 text-[var(--text-tertiary)]/30" />
            <h1 className="heading-section mb-4 text-gradient">Your Cart is Empty</h1>
            <p className="mb-8 text-[var(--text-secondary)]">
              Browse our available puppies and add them to your enquiry cart to send a single
              WhatsApp message.
            </p>
            <Link
              href="/breeds"
              className="glass-btn inline-flex items-center gap-2 px-8 py-4 text-base font-medium"
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
    <div className="pb-20 pt-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div variants={fadeUpVariant} initial="hidden" animate="visible">
          <h1 className="heading-section mb-2 text-gradient">Enquiry Cart</h1>
          <p className="mb-8 text-[var(--text-secondary)]">
            {items.length} {items.length === 1 ? 'puppy' : 'puppies'} selected for enquiry
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.dogId}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                >
                  <GlassCard hover={false} variant="solid" className="p-4">
                    <div className="flex items-center gap-4">
                      <Link href={`/breeds/${item.slug}`} className="shrink-0">
                        <div className="relative h-20 w-20 overflow-hidden rounded-xl">
                          <Image
                            src={item.thumbnailImage}
                            alt={item.breedName}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>
                      </Link>
                      <div className="min-w-0 flex-1">
                        <Link href={`/breeds/${item.slug}`}>
                          <h3 className="heading-card text-gradient transition-opacity hover:opacity-80">
                            {item.breedName}
                          </h3>
                        </Link>
                        {item.name && (
                          <p className="text-xs text-[var(--text-tertiary)]">&ldquo;{item.name}&rdquo;</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.dogId)}
                        className="p-2 text-[var(--text-tertiary)] transition-colors hover:text-red-500"
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

          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <GlassCard hover={false} variant="solid" className="p-6">
                <h2 className="heading-card mb-4 text-[var(--text-primary)]">Enquiry Summary</h2>
                <div className="mb-6 space-y-3 border-b border-[var(--color-border)] pb-6">
                  {items.map((item) => (
                    <div key={item.dogId} className="flex justify-between py-1 text-sm">
                      <span className="truncate text-[var(--text-secondary)]">{item.breedName}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleEnquiry}
                  className="whatsapp-btn mb-3 flex w-full items-center justify-center gap-2 px-6 py-4 text-sm font-medium"
                >
                  <MessageCircle size={18} />
                  Send Enquiry via WhatsApp
                </button>

                <button
                  onClick={clearCart}
                  className="w-full py-2 text-xs text-[var(--text-tertiary)] transition-colors hover:text-red-500"
                >
                  Clear Cart
                </button>

                <p className="mt-3 text-center text-[10px] text-[var(--text-tertiary)]">
                  This is an enquiry cart, not a checkout. We send your selected puppies through
                  WhatsApp for follow-up.
                </p>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
