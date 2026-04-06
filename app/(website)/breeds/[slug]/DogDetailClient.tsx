'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Heart,
  Share2,
  ShoppingBag,
  MessageCircle,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Badge from '@/components/ui/Badge';
import GlassCard from '@/components/ui/GlassCard';
import DogCard from '@/components/dogs/DogCard';
import SectionHeading from '@/components/ui/SectionHeading';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';
import { getWhatsAppLink, cn } from '@/lib/utils';
import { siteConfig } from '@/data/site-config';
import { useCartStore } from '@/lib/store/cart';
import type { Dog } from '@/types';

interface Props {
  dog: Dog;
  relatedDogs: Dog[];
}

export default function DogDetailClient({ dog, relatedDogs }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);
  const { items, addItem, removeItem } = useCartStore();
  const isInCart = items.some((i) => i.dogId === dog.id);

  const handleCart = () => {
    if (isInCart) {
      removeItem(dog.id);
    } else {
      addItem({
        dogId: dog.id,
        breedName: dog.breedName,
        name: dog.name,
        price: dog.price,
        thumbnailImage: dog.thumbnailImage,
        slug: dog.slug,
      });
    }
  };

  const waMessage = `Hi! I'm interested in the ${dog.breedName}${dog.name ? ` (${dog.name})` : ''}. Could you share more details and pricing?`;

  const characteristics = [
    { label: 'Size', value: dog.characteristics.size },
    { label: 'Weight', value: dog.characteristics.weight },
    { label: 'Height', value: dog.characteristics.height },
    { label: 'Lifespan', value: dog.characteristics.lifespan },
    { label: 'Coat', value: dog.characteristics.coatLength },
    { label: 'Energy', value: dog.characteristics.energyLevel.replace('_', ' ') },
    { label: 'Training', value: dog.characteristics.trainingDifficulty },
    { label: 'Grooming', value: dog.characteristics.grooming },
  ];

  const booleanTraits = [
    { label: 'Good with Kids', value: dog.characteristics.goodWithKids },
    { label: 'Good with Pets', value: dog.characteristics.goodWithPets },
    { label: 'Apartment Friendly', value: dog.characteristics.apartmentFriendly },
  ];

  const healthChecks = [
    { label: 'Vaccinated', value: dog.healthInfo.vaccinated },
    { label: 'Dewormed', value: dog.healthInfo.dewormed },
    { label: 'Vet Checked', value: dog.healthInfo.vetChecked },
    { label: 'Microchipped', value: dog.healthInfo.microchipped },
    { label: 'KCI Registered', value: dog.healthInfo.kciRegistered },
    { label: 'Parents Certified', value: dog.healthInfo.parentsCertified },
  ];

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div variants={fadeUpVariant} initial="hidden" animate="visible" className="mb-6">
          <Link
            href="/breeds"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Back to All Breeds
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image Gallery */}
          <motion.div variants={fadeUpVariant} initial="hidden" animate="visible">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4">
              <Image
                src={dog.images[selectedImage]}
                alt={`${dog.breedName} photo ${selectedImage + 1}`}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute top-4 left-4">
                <Badge status={dog.status} />
              </div>
              {/* Gallery controls */}
              {dog.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev - 1 + dog.images.length) % dog.images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 glass-btn p-2 rounded-full"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev + 1) % dog.images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 glass-btn p-2 rounded-full"
                    aria-label="Next image"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>
            {/* Thumbnail strip */}
            <div className="flex gap-2">
              {dog.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    'relative w-20 h-16 rounded-lg overflow-hidden border-2 transition-all',
                    i === selectedImage ? 'border-white' : 'border-transparent opacity-50 hover:opacity-80'
                  )}
                >
                  <Image src={img} alt={`Thumbnail ${i + 1}`} fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div variants={fadeUpVariant} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h1 className="heading-section text-gradient">{dog.breedName}</h1>
                {dog.name && (
                  <p className="text-lg text-[var(--text-secondary)] mt-1">&ldquo;{dog.name}&rdquo;</p>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button className="glass-btn p-2.5 rounded-full" aria-label="Share">
                  <Share2 size={16} />
                </button>
                <button className="glass-btn p-2.5 rounded-full" aria-label="Favorite">
                  <Heart size={16} />
                </button>
              </div>
            </div>

            <p className="text-sm text-[var(--text-secondary)] mb-4">
              {dog.age} · {dog.gender === 'male' ? '♂ Male' : '♀ Female'}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {dog.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs border border-[var(--color-border)] rounded-full px-3 py-1 text-[var(--text-secondary)]"
                >
                  {tag}
                </span>
              ))}
            </div>



            {/* Description */}
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
              {dog.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <a
                href={getWhatsAppLink(siteConfig.whatsappNumber, waMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-btn px-6 py-3.5 text-sm font-medium flex items-center justify-center gap-2 flex-1 pulse-glow"
              >
                <MessageCircle size={18} />
                Enquire on WhatsApp
              </a>
              <button
                onClick={handleCart}
                className={cn(
                  'px-6 py-3.5 text-sm font-medium flex items-center justify-center gap-2 rounded-full transition-all',
                  isInCart
                    ? 'bg-white/10 border border-white/20 text-white'
                    : 'glass-btn'
                )}
              >
                <ShoppingBag size={18} />
                {isInCart ? 'Remove from Cart' : 'Add to Cart'}
              </button>
            </div>

            {/* Characteristics Grid */}
            <GlassCard hover={false} className="p-5 mb-6">
              <div className="relative z-10">
                <h3 className="font-display font-semibold text-sm uppercase tracking-wider mb-4">Characteristics</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {characteristics.map((c) => (
                    <div key={c.label}>
                      <p className="text-xs text-[var(--text-tertiary)]">{c.label}</p>
                      <p className="text-sm font-medium capitalize">{c.value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-[var(--color-border)]">
                  {booleanTraits.map((t) => (
                    <span
                      key={t.label}
                      className={cn(
                        'flex items-center gap-1.5 text-xs',
                        t.value ? 'text-green-400' : 'text-red-400/60'
                      )}
                    >
                      {t.value ? <Check size={14} /> : <X size={14} />}
                      {t.label}
                    </span>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* Health Info */}
            <GlassCard hover={false} className="p-5">
              <div className="relative z-10">
                <h3 className="font-display font-semibold text-sm uppercase tracking-wider mb-4">Health & Certification</h3>
                <div className="grid grid-cols-2 gap-3">
                  {healthChecks.map((h) => (
                    <span
                      key={h.label}
                      className={cn(
                        'flex items-center gap-2 text-sm',
                        h.value ? 'text-green-400' : 'text-[var(--text-tertiary)]'
                      )}
                    >
                      {h.value ? <Check size={14} /> : <X size={14} />}
                      {h.label}
                    </span>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Long Description */}
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16"
        >
          <GlassCard hover={false} className="p-6 sm:p-8">
            <div className="relative z-10 prose-dark max-w-none">
              <h2 className="heading-card text-gradient mb-4">About This {dog.breedName}</h2>
              {dog.longDescription.split('\n\n').map((paragraph, i) => {
                if (paragraph.startsWith('**') && paragraph.includes(':**')) {
                  const [title, ...rest] = paragraph.split(':** ');
                  return (
                    <div key={i} className="mb-4">
                      <strong>{title.replace(/\*\*/g, '')}:</strong>{' '}
                      {rest.join(':** ')}
                    </div>
                  );
                }
                return <p key={i}>{paragraph}</p>;
              })}
            </div>
          </GlassCard>
        </motion.div>

        {/* Related Dogs */}
        {relatedDogs.length > 0 && (
          <div className="mt-20">
            <SectionHeading title="Similar Breeds" subtitle="You might also like these puppies" />
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {relatedDogs.map((d, i) => (
                <DogCard key={d.id} dog={d} index={i} />
              ))}
            </motion.div>
          </div>
        )}
      </div>

      {/* Mobile Sticky CTA */}
      <div className="sticky-cta lg:hidden flex gap-3">
        <a
          href={getWhatsAppLink(siteConfig.whatsappNumber, waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-btn px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 flex-1 rounded-full"
        >
          <MessageCircle size={16} />
          WhatsApp
        </a>
        <button
          onClick={handleCart}
          className="glass-btn px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 flex-1"
        >
          <ShoppingBag size={16} />
          {isInCart ? 'In Cart' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
