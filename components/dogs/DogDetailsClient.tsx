'use client';

import { useState } from 'react';
import { Dog, DogVariant } from '@/types';
import { formatPrice, getWhatsAppLink } from '@/lib/utils';
import { MessageCircle, ShieldCheck } from 'lucide-react';
import { siteConfig } from '@/data/site-config';

export default function DogDetailsClient({ dog }: { dog: Dog }) {
  // If variants exist, default to the Medium one or the first one.
  const defaultVariant = dog.variants?.find(v => v.sizeName === 'Medium') || dog.variants?.[0] || null;
  const [selectedVariant, setSelectedVariant] = useState<DogVariant | null>(defaultVariant);

  const displayAge = selectedVariant?.age ?? dog.age;
  const displaySizeLabel = selectedVariant?.sizeName ?? '';

  const message = `Hi ${siteConfig.brandName}! I'm interested in the ${displaySizeLabel ? `${displaySizeLabel} size ` : ''}${dog.breedName} puppy. Can you share more details and pricing?`;

  return (
    <div className="flex flex-col h-full">
      <div className="mb-2 flex flex-wrap gap-2">
        {dog.tags.map(tag => (
          <span key={tag} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--accent-color, #c084fc)]">
            {tag}
          </span>
        ))}
      </div>
      
      <h1 className="text-4xl sm:text-5xl font-display font-bold text-[var(--text-primary)] mb-4">
        {dog.breedName}
      </h1>
      
      <p className="text-xl text-[var(--text-secondary)] mb-6">
        {dog.description}
      </p>

      {/* Size Variation Switcher */}
      {dog.variants && dog.variants.length > 0 && (
        <div className="mb-6">
          <p className="text-sm text-[var(--text-tertiary)] uppercase tracking-wider mb-3">Available Sizes</p>
          <div className="flex flex-wrap gap-3">
            {dog.variants.map(variant => {
              const isSelected = selectedVariant?.id === variant.id;
              return (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200 ${
                    isSelected 
                      ? 'bg-[var(--text-primary)] border-[var(--text-primary)] text-[var(--color-bg)] shadow-md transform scale-105' 
                      : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--text-secondary)] hover:border-gray-400'
                  }`}
                >
                  {variant.sizeName}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-6 mb-8 py-6 border-y border-[var(--color-border)]">
        <div>
          <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Age</p>
          <div className="text-lg font-medium text-[var(--text-primary)]">{displayAge}</div>
        </div>
        <div className="w-px h-12 bg-[var(--color-border)] hidden sm:block" />
        <div>
          <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Gender</p>
          <div className="text-lg font-medium capitalize text-[var(--text-primary)]">{dog.gender}</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-auto">
        <a
          href={getWhatsAppLink(siteConfig.whatsappNumber, message)}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-btn flex-1 py-4 text-base font-medium inline-flex items-center justify-center gap-2 pulse-glow"
        >
          <MessageCircle size={20} />
          Enquire via WhatsApp
        </a>
      </div>

      {/* Health Guarantee snippet */}
      <div className="mt-8 relative overflow-hidden p-5 rounded-xl border border-green-200 bg-green-50/50 flex items-start gap-4">
        <div className="p-2 rounded-full bg-green-100 text-green-700">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-semibold text-green-900 mb-1">100% Health Guarantee</h4>
          <p className="text-sm text-green-800/80">All our puppies come fully vet-checked, dewormed, and with age-appropriate vaccinations.</p>
        </div>
      </div>
    </div>
  );
}
