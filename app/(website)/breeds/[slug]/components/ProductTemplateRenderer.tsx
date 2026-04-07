'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  CheckCircle2, HeartPulse, Sparkles,
  Weight, Clock, Users, Calendar,
  Zap, Scissors, Home as HomeIcon, Heart,
  Share2, Phone, MessageCircle, Tag, ShoppingCart, ArrowRight
} from 'lucide-react';
import { BlockRegistry } from '@/components/blocks/registry';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import type { PageTemplateSettings, ProductTemplateBlock } from '@/types/page-template';
import type { Dog as DogType } from '@/types';
import Badge from '@/components/ui/Badge';
import Accordion from '@/components/ui/Accordion';
import { DetailsCardBlock } from './DetailsCardClient';

interface ProductTemplateRendererProps {
  initialSettings: PageTemplateSettings;
  pageType: string;
  dog: DogType;
  relatedDogs: DogType[];
  isPreview: boolean;
}

export function ProductTemplateRenderer({
  initialSettings,
  pageType,
  dog,
  relatedDogs,
  isPreview,
}: ProductTemplateRendererProps) {
  const [settings, setSettings] = useState<PageTemplateSettings>(initialSettings);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data;
      if (data?.type === 'TEMPLATE_SETTINGS_UPDATE' && data?.pageType === pageType) {
        if (data.settings) {
          setSettings(data.settings);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [pageType]);

  const blocks = settings.sections || [];
  const styling = settings.styling || {};
  const layout = settings.layout || {};
  const accentColor = styling.accent_color || '#f97316';

  return (
    <div className="min-h-screen" style={{ backgroundColor: styling.page_bg_color || '#ffffff' }}>
      {/* Main Content */}
      <div className="pt-20 pb-16 lg:pt-28 lg:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Two Column Layout */}
          <div className={`grid grid-cols-1 ${layout.type === 'single-column' ? '' : 'lg:grid-cols-2'} gap-8 lg:gap-12`}>

            {/* Left Column - Image Gallery */}
            <div className={`${layout.gallery_position === 'right' ? 'lg:order-2' : ''}`}>
              {blocks.filter((b) => b.type === 'image_gallery' && b.visible).map((block) => (
                <ProductImageGallery key={block.id} dog={dog} block={block} styling={styling} />
              ))}
            </div>

            {/* Right Column - Info */}
            <div className={`space-y-6 ${layout.sticky_sidebar ? 'lg:sticky lg:top-28 lg:self-start' : ''}`}>
              {blocks.filter((b) => b.type !== 'image_gallery' && !['about_section', 'characteristics', 'health_info', 'faq_section', 'related_breeds', 'inquiry_cta', 'custom_banner', 'homepage_section'].includes(b.type) && b.visible).map((block) => (
                <RenderBlock key={block.id} block={block} dog={dog} accentColor={accentColor} styling={styling} />
              ))}
            </div>
          </div>

          {/* Full Width Content Blocks Below */}
          <div className="mt-12 space-y-12">
            {blocks.filter((b) => ['about_section', 'characteristics', 'health_info', 'faq_section', 'inquiry_cta', 'custom_banner', 'related_breeds'].includes(b.type) && b.visible).map((block) => (
              <RenderFullWidthBlock key={block.id} block={block} dog={dog} accentColor={accentColor} styling={styling} relatedDogs={relatedDogs} />
            ))}
          </div>
        </div>
      </div>

      {/* Homepage Section Blocks (Full Width, Outside Container) */}
      {blocks.filter((b) => b.type === 'homepage_section' && b.visible && b.blockRegistryKey).map((block) => (
        <HomepageSectionRenderer key={block.id} block={block} isPreview={isPreview} />
      ))}
    </div>
  );
}

/* ─── Renderers ─────────────────────────────────────────── */

function RenderBlock({ block, dog, accentColor, styling }: { block: ProductTemplateBlock; dog: DogType; accentColor: string; styling: PageTemplateSettings['styling'] }) {
  switch (block.type) {
    case 'social_proof':
      return <SocialProofBlock block={block} accentColor={accentColor} />;
    case 'breed_header':
      return <BreedHeaderBlock block={block} dog={dog} accentColor={accentColor} />;
    case 'stats_grid':
      return <StatsGridBlock block={block} dog={dog} accentColor={accentColor} />;
    case 'personality_badge':
      return <PersonalityBadgeBlock block={block} dog={dog} />;
    case 'description':
      return <DescriptionBlock block={block} dog={dog} />;
    case 'details_card':
      return <DetailsCardBlock block={block} dog={dog} />;
    default:
      return null;
  }
}

function RenderFullWidthBlock({ block, dog, accentColor, styling, relatedDogs }: { block: ProductTemplateBlock; dog: DogType; accentColor: string; styling: PageTemplateSettings['styling']; relatedDogs: DogType[] }) {
  switch (block.type) {
    case 'about_section':
      return <AboutSectionBlock block={block} dog={dog} accentColor={accentColor} />;
    case 'characteristics':
      return <CharacteristicsBlock block={block} dog={dog} accentColor={accentColor} styling={styling} />;
    case 'health_info':
      return <HealthInfoBlock block={block} dog={dog} accentColor={accentColor} styling={styling} />;
    case 'faq_section':
      return <FaqSectionBlock block={block} dog={dog} />;
    case 'inquiry_cta':
      return <InquiryCtaBlock block={block} dog={dog} accentColor={accentColor} />;
    case 'custom_banner':
      return <CustomBannerBlock block={block} />;
    case 'related_breeds':
      return <RelatedBreedsBlock block={block} relatedDogs={relatedDogs} />;
    default:
      return null;
  }
}

function HomepageSectionRenderer({ block, isPreview }: { block: ProductTemplateBlock; isPreview?: boolean }) {
  const registryKey = block.blockRegistryKey;
  if (!registryKey) return null;
  const registryDef = BlockRegistry[registryKey];
  if (!registryDef?.Component) return null;
  const Component = registryDef.Component;
  const settings = block.settings || {};
  const blocks = Array.isArray(settings.blocks) ? settings.blocks : [];
  return <Component {...settings} blocks={blocks} sectionId={block.id} isEditorMode={isPreview} />;
}

/* ─── Individual Block Components ─────── */

function SocialProofBlock({ block, accentColor }: { block: ProductTemplateBlock; accentColor: string }) {
  const [isMounted, setIsMounted] = useState(false);
  const [count, setCount] = useState(12); // Default value

  useEffect(() => {
    setIsMounted(true);
    setCount(Math.floor(Math.random() * 15) + 5);
  }, []);

  if (!isMounted) return <div className="h-7" />; // Avoid mismatch

  const showAvatars = block.settings.show_avatars !== false;
  const text = ((block.settings.viewing_text as string) || '{count} people inquiring today').replace('{count}', String(count));
  return (
    <div className="flex items-center gap-3">
      {showAvatars && (
        <div className="flex -space-x-2">
          {Array.from({ length: Math.min(Number(block.settings.avatar_count) || 3, 5) }).map((_, i) => (
            <div key={i} className="h-7 w-7 rounded-full border-2 border-white" style={{ background: `hsl(${i * 60 + 20}, 70%, 75%)` }} />
          ))}
        </div>
      )}
      <span className="text-xs font-medium text-gray-500">{text}</span>
    </div>
  );
}

function BreedHeaderBlock({ block, dog, accentColor }: { block: ProductTemplateBlock; dog: DogType; accentColor: string }) {
  const showCert = block.settings.show_certification !== false;
  const certText = (block.settings.certification_text as string) || 'Certified Health';
  const showWishlist = block.settings.show_wishlist !== false;
  const titleSize = block.settings.title_size === 'small' ? 'text-2xl' : block.settings.title_size === 'medium' ? 'text-3xl' : 'text-4xl lg:text-5xl';
  const titleColor = (block.settings.title_color as string) || '#111827';
  const brandColor = (block.settings.brand_color as string) || accentColor;
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-2">
        <h1 className={`${titleSize} font-bold tracking-tight leading-tight`} style={{ color: titleColor }}>{dog.breedName}</h1>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-bold uppercase tracking-wider" style={{ color: brandColor }}>{dog.breedName}</span>
          {showCert && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-[11px] font-bold text-green-700 ring-1 ring-inset ring-green-600/20">
              <CheckCircle2 size={12} />{certText}
            </span>
          )}
        </div>
      </div>
      {showWishlist && (
        <div className="flex shrink-0">
          <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 text-gray-400 transition-all hover:border-red-100 hover:text-red-500 hover:bg-red-50 active:scale-95">
            <Heart size={20} />
          </button>
        </div>
      )}
    </div>
  );
}

function StatsGridBlock({ block, dog, accentColor }: { block: ProductTemplateBlock; dog: DogType; accentColor: string }) {
  const cardStyle = (block.settings.card_style as string) || 'outlined';
  const cols = String(block.settings.columns) === '4' ? 'grid-cols-4' : 'grid-cols-2';
  const cardBg = (block.settings.card_bg as string) || '#f9fafb';
  const stats = [
    block.settings.show_age !== false && { icon: Calendar, label: 'Age', value: dog.age },
    block.settings.show_gender !== false && { icon: Users, label: 'Gender', value: dog.gender === 'male' ? 'Male' : 'Female' },
    block.settings.show_weight !== false && { icon: Weight, label: 'Weight', value: dog.characteristics.weight },
    block.settings.show_lifespan !== false && { icon: Clock, label: 'Life Span', value: dog.characteristics.lifespan },
  ].filter(Boolean) as { icon: React.ElementType; label: string; value: string }[];
  const cardClass = cardStyle === 'filled' ? '' : cardStyle === 'minimal' ? 'bg-transparent' : 'border border-gray-200';
  return (
    <div className={`grid ${cols} gap-3`}>
      {stats.map((stat) => (
        <div key={stat.label} className={`flex items-center gap-3 rounded-xl p-3.5 ${cardClass}`} style={{ backgroundColor: cardStyle === 'filled' ? cardBg : undefined }}>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/50 shadow-sm"><stat.icon size={18} className="text-gray-600" /></div>
          <div><p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">{stat.label}</p><p className="text-sm font-bold text-gray-900">{stat.value}</p></div>
        </div>
      ))}
    </div>
  );
}

function PersonalityBadgeBlock({ block, dog }: { block: ProductTemplateBlock; dog: DogType }) {
  // Settings
  const badgeText = (block.settings.badge_text as string) || 'Personality';
  const badgeIcon = (block.settings.badge_icon as string) || '🌟';
  const showIcon = block.settings.show_icon !== false;
  const showTraits = block.settings.show_traits !== false;
  const showDbTags = block.settings.show_db_tags !== false;
  const showSmartTraits = block.settings.show_smart_traits !== false;
  const bgColor = (block.settings.bg_color as string) || '#f9fafb';
  const textColor = (block.settings.text_color as string) || '#1f2937';
  const borderColor = (block.settings.border_color as string) || '#f3f4f6';

  // Smart traits from characteristics (only if enabled)
  const smartTraits: string[] = [];
  if (showSmartTraits) {
    if (dog.characteristics.goodWithKids) smartTraits.push('Kid Friendly');
    if (dog.characteristics.goodWithPets) smartTraits.push('Pet Friendly');
    if (dog.characteristics.apartmentFriendly) smartTraits.push('Apartment Friendly');
  }

  // Combine: DB tags (if enabled) + smart traits
  const dbTags = showDbTags ? (dog.tags || []) : [];
  const combinedTraits = [...dbTags, ...smartTraits];
  
  // Use settings as ultimate fallback IF they are not the unwanted defaults
  const settingsTraits = (block.settings.traits as string[]) || [];
  const filteredSettingsTraits = settingsTraits.filter(t => 
    !['Friendly', 'Intelligent', 'Playful'].includes(t)
  );

  const traits = combinedTraits.length > 0 
    ? Array.from(new Set(combinedTraits)).filter(t => t && t.trim() !== '').slice(0, 4) 
    : filteredSettingsTraits.filter(t => t && t.trim() !== '');

  return (
    <div className="space-y-3">
      {/* Main Badge Title */}
      <div 
        className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border shadow-sm transition-all animate-in fade-in slide-in-from-left-2"
        style={{ backgroundColor: bgColor, color: textColor, borderColor: borderColor }}
      >
        {showIcon && <span className="text-lg">{badgeIcon}</span>}
        <span className="text-sm font-extrabold uppercase tracking-widest">{badgeText}</span>
      </div>

      {/* Dynamic Traits Tags — only shown if toggle is ON */}
      {showTraits && traits.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {traits.map((trait) => (
            <span key={trait} className="inline-flex items-center gap-1.5 rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-700 ring-1 ring-inset ring-orange-600/10 capitalize">
              <Sparkles size={13} />{trait}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function DescriptionBlock({ block, dog }: { block: ProductTemplateBlock; dog: DogType }) {
  const rawTitle = (block.settings.title as string) || 'About the {breed}';
  const showTitle = block.settings.show_title !== false;
  const titleColor = (block.settings.title_color as string) || '#FFD700';
  const textColor = (block.settings.text_color as string) || '#4b5563';
  const title = rawTitle.replace('{breed}', dog.breedName);
  const descriptionText = dog.description || `${dog.longDescription.slice(0, 200)}...`;

  return (
    <section className="space-y-3">
      {showTitle && (
        <h2 className="text-xl font-bold leading-tight" style={{ color: titleColor }}>
          {title}
        </h2>
      )}
      <div className="prose prose-sm max-w-none leading-relaxed">
        <p style={{ color: textColor }}>{descriptionText}</p>
      </div>
    </section>
  );
}

function AboutSectionBlock({ block, dog, accentColor }: { block: ProductTemplateBlock; dog: DogType; accentColor: string }) {
  const title = (block.settings.title as string) || 'About this Breed';
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
        <div className="h-6 w-1 rounded-full" style={{ backgroundColor: accentColor }}></div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
      <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed"><p>{dog.longDescription}</p></div>
    </section>
  );
}

function CharacteristicsBlock({ block, dog, accentColor, styling }: { block: ProductTemplateBlock; dog: DogType; accentColor: string; styling: PageTemplateSettings['styling'] }) {
  const title = (block.settings.title as string) || 'Breed Characteristics';
  const charList = [
    { label: 'Energy Level', value: dog.characteristics.energyLevel === 'high' || dog.characteristics.energyLevel === 'very_high' ? '80%' : dog.characteristics.energyLevel === 'moderate' ? '50%' : '30%', icon: Zap },
    { label: 'Trainability', value: dog.characteristics.trainingDifficulty === 'easy' ? '90%' : dog.characteristics.trainingDifficulty === 'moderate' ? '60%' : '40%', icon: Sparkles },
    { label: 'Grooming', value: dog.characteristics.grooming === 'high' ? '80%' : dog.characteristics.grooming === 'moderate' ? '50%' : '30%', icon: Scissors },
    { label: 'Health', value: '90%', icon: HeartPulse },
  ];
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
        <div className="h-6 w-1 rounded-full" style={{ backgroundColor: accentColor }}></div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {charList.map((item) => (
          <div key={item.label} className="flex flex-col gap-2 p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
            <div className="flex items-center gap-2 text-gray-500"><item.icon size={16} /><span className="text-xs font-bold uppercase tracking-wider">{item.label}</span></div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-1000" style={{ width: item.value, backgroundColor: accentColor }}></div></div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HealthInfoBlock({ block, dog, accentColor, styling }: { block: ProductTemplateBlock; dog: DogType; accentColor: string; styling: PageTemplateSettings['styling'] }) {
  const title = (block.settings.title as string) || 'Health & Guarantee';
  const healthItems = [
    dog.healthInfo.vaccinated && 'Fully Vaccinated',
    dog.healthInfo.dewormed && 'Properly Dewormed',
    dog.healthInfo.vetChecked && 'Vet Checked',
    dog.healthInfo.microchipped && 'Microchipped',
    dog.healthInfo.kciRegistered && 'KCI Registered',
    dog.healthInfo.parentsCertified && 'Parents Certified',
  ].filter(Boolean) as string[];

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
        <div className="h-6 w-1 rounded-full" style={{ backgroundColor: accentColor }}></div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {healthItems?.map((info, idx) => (
          <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-green-50/30 border border-green-100/50">
            <CheckCircle2 className="mt-0.5 text-green-600 shrink-0" size={18} /><p className="text-sm text-gray-700 leading-relaxed">{info}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FaqSectionBlock({ block, dog }: { block: ProductTemplateBlock; dog: DogType }) {
  const title = (block.settings.title as string) || 'Frequently Asked Questions';
  const showGlobal = block.settings.show_global_faqs !== false;
  const style = (block.settings.accordion_style as 'bordered' | 'separated' | 'minimal') || 'separated';
  const expandFirst = block.settings.expand_first === true;
  
  const dogFaqs = dog.faqs || [];
  const settingsFaqs = (block.settings.faqs as { question: string; answer: string }[]) || [];
  
  const allFaqs = [...dogFaqs, ...(showGlobal ? settingsFaqs : [])].map((f, i) => ({ 
    id: `faq-${i}`, 
    question: f.question, 
    answer: f.answer 
  }));

  if (allFaqs.length === 0) return null;

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <Accordion items={allFaqs} variant={style} expandFirst={expandFirst} />
    </section>
  );
}

function InquiryCtaBlock({ block, dog, accentColor }: { block: ProductTemplateBlock; dog: DogType; accentColor: string }) {
  const title = (block.settings.title as string) || `Interested in a ${dog.breedName}?`;
  const text = (block.settings.text as string) || "Speak with our experts today to learn about availability and our ethical breeding practices.";
  return (
    <div className="rounded-3xl p-8 md:p-12 text-center space-y-8 relative overflow-hidden" style={{ backgroundColor: '#111827' }}>
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-400 via-transparent to-transparent"></div>
      <div className="relative z-10 max-w-2xl mx-auto space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">{title}</h2>
        <p className="text-gray-400 text-lg">{text}</p>
      </div>
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link href={`https://wa.me/919900000000?text=Hi, I am interested in ${dog.breedName}`} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ea728c] px-8 py-4 text-sm font-bold text-white transition-all hover:bg-[#d85d77] hover:scale-105 active:scale-95 shadow-lg shadow-[#ea728c]/20">
          <MessageCircle size={20} />Chat on WhatsApp
        </Link>
        <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-8 py-4 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-95 border border-white/10">
          <Phone size={20} />Request a Call
        </button>
      </div>
    </div>
  );
}

function CustomBannerBlock({ block }: { block: ProductTemplateBlock }) {
  const text = (block.settings.text as string) || 'Special Offer: Free Starter Kit with Every Adoption!';
  const link = (block.settings.link as string) || '#';
  return (
    <Link href={link} className="block group">
      <div className="rounded-2xl p-4 text-center transition-all group-hover:scale-[1.01]" style={{ background: 'linear-gradient(135deg, #ea728c 0%, #ff8e72 100%)' }}>
        <p className="text-sm font-bold text-white flex items-center justify-center gap-2"><Sparkles size={16} />{text}<ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></p>
      </div>
    </Link>
  );
}

function RelatedBreedsBlock({ block, relatedDogs }: { block: ProductTemplateBlock; relatedDogs: DogType[] }) {
  const title = (block.settings.title as string) || 'Other Puppies You Might Love';
  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedDogs.map((dog) => (
          <Link key={dog.id} href={`/breeds/${dog.slug}`} className="group block bg-white rounded-3xl border border-gray-100 overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="aspect-[4/5] relative overflow-hidden"><Image src={dog.images[0] || '/dog-placeholder.jpg'} alt={dog.breedName} fill className="object-cover transition-transform duration-500 group-hover:scale-110" /></div>
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between"><h3 className="text-lg font-bold text-gray-900">{dog.breedName}</h3><Badge status={dog.status} /></div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Users size={12} />{dog.gender === 'male' ? 'Male' : 'Female'}</span>
                <span className="flex items-center gap-1"><Calendar size={12} />{dog.age}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
