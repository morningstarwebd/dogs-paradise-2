'use client';

import React from 'react';
import { 
  MessageCircle, ShoppingCart, Phone, Share2, Tag 
} from 'lucide-react';
import type { ProductTemplateBlock } from '@/types/page-template';
import type { Dog as DogType } from '@/types';

export function DetailsCardBlock({ block, dog }: { block: ProductTemplateBlock; dog: DogType }) {
  const [isShareHovered, setIsShareHovered] = React.useState(false);

  const showPrice = block.settings.show_price !== false;
  const showVariants = block.settings.show_variants !== false;
  const showTags = block.settings.show_tags !== false;
  const showShare = block.settings.show_share !== false;
  const showSecondaryCta = block.settings.show_secondary_cta !== false;
  const showTertiaryCta = block.settings.show_tertiary_cta !== false;

  const ctaText = (block.settings.cta_text as string) || 'Enquire on WhatsApp';
  const secondaryCtaText = (block.settings.secondary_cta_text as string) || 'Add to Cart';
  const tertiaryCtaText = (block.settings.tertiary_cta_text as string) || 'Call Now';

  const waNumber = (block.settings.whatsapp_number as string) || '';
  const phoneNumber = (block.settings.phone_number as string) || waNumber;

  const primaryBtnBg = (block.settings.primary_btn_bg as string) || '#25D366';
  const primaryBtnText = (block.settings.primary_btn_text as string) || '#ffffff';
  const secondaryBtnBg = (block.settings.secondary_btn_bg as string) || '#111827';
  const secondaryBtnText = (block.settings.secondary_btn_text as string) || '#ffffff';
  const tertiaryBtnBg = (block.settings.tertiary_btn_bg as string) || '#f97316';
  const tertiaryBtnText = (block.settings.tertiary_btn_text as string) || '#ffffff';

  // Share button settings
  const shareBtnBg = (block.settings.share_btn_bg as string) || 'transparent';
  const shareBtnText = (block.settings.share_btn_text as string) || '#9ca3af';
  const shareBtnBorder = (block.settings.share_btn_border as string) || '#f3f4f6';
  const shareBtnHoverBg = (block.settings.share_btn_hover_bg as string) || '#f9fafb';
  const shareBtnHoverText = (block.settings.share_btn_hover_text as string) || '#4b5563';

  const waLink = `https://wa.me/${waNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, I'm interested in the ${dog.breedName}. Could you provide more details?`)}`;
  const telLink = `tel:${phoneNumber.replace(/[^0-9]/g, '')}`;

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: dog.breedName,
        text: `Check out the ${dog.breedName} at Dogs Paradise!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert('Sharing is not supported on this browser.');
    }
  };

  return (
    <div className="space-y-6">
      {/* ... price, variants, tags ... */}
      {showPrice && dog.price && (
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-gray-900">৳{dog.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Starting Price</span>
        </div>
      )}

      {showVariants && dog.variants && dog.variants.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Available Options</p>
          <div className="flex flex-wrap gap-2">
            {dog.variants.map((v) => (
              <button
                key={v.id}
                className="rounded-xl border-2 border-gray-100 px-4 py-2 text-sm font-bold transition-all hover:border-gray-200 active:scale-95 border-gray-900 bg-gray-950 text-white"
              >
                {v.sizeName}
              </button>
            ))}
          </div>
        </div>
      )}

      {showTags && dog.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {dog.tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-3 py-1 text-[11px] font-bold text-gray-600 ring-1 ring-inset ring-gray-200 capitalize">
              <Tag size={10} />
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {/* Row 1: Primary CTA (WhatsApp) */}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-2xl px-8 py-4 text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98] shadow-lg shadow-green-500/10"
          style={{ backgroundColor: primaryBtnBg, color: primaryBtnText }}
        >
          <MessageCircle size={20} />
          {ctaText}
        </a>

        {/* Row 2: Secondary CTA (Add to Cart) */}
        {showSecondaryCta && (
          <button
            className="flex w-full items-center justify-center gap-2 rounded-2xl px-8 py-4 text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98] shadow-sm"
            style={{ backgroundColor: secondaryBtnBg, color: secondaryBtnText }}
          >
            <ShoppingCart size={20} />
            {secondaryCtaText}
          </button>
        )}

        {/* Row 3: Tertiary (Phone) & Share Group */}
        {(showTertiaryCta || showShare) && (
          <div className={`grid gap-3 ${showTertiaryCta && showShare ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {showTertiaryCta && (
              <a
                href={telLink}
                className="flex items-center justify-center gap-2 rounded-2xl px-4 py-4 text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98] shadow-sm"
                style={{ backgroundColor: tertiaryBtnBg, color: tertiaryBtnText }}
              >
                <Phone size={18} />
                {tertiaryCtaText}
              </a>
            )}
            {showShare && (
              <button 
                onClick={handleShare}
                onMouseEnter={() => setIsShareHovered(true)}
                onMouseLeave={() => setIsShareHovered(false)}
                className="flex items-center justify-center gap-2 rounded-2xl border px-4 py-4 text-xs font-bold transition-all active:scale-95"
                style={{ 
                  backgroundColor: isShareHovered ? shareBtnHoverBg : shareBtnBg, 
                  color: isShareHovered ? shareBtnHoverText : shareBtnText,
                  borderColor: shareBtnBorder
                }}
              >
                <Share2 size={18} />
                Share
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
