import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, HeartPulse, Sparkles } from 'lucide-react';
import { dogs as fallbackDogs } from '@/data/dogs';
import Badge from '@/components/ui/Badge';
import Accordion from '@/components/ui/Accordion';
import DogDetailsClient from '@/components/dogs/DogDetailsClient';
import { getDogBySlug, getDogs } from '@/lib/supabase/dogs-mapper';
import { createClient } from '@/lib/supabase/server';
import { mergeProductTemplateSettings } from '@/types/page-template';
import TemplatePreviewReloader from '@/components/admin/TemplatePreviewReloader';
import type { PageTemplateSettings } from '@/types/page-template';

export async function generateStaticParams() {
  return fallbackDogs.map((dog) => ({
    slug: dog.slug,
  }));
}

export default async function BreedPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const isPreviewMode = resolvedSearchParams?.preview === 'true';
  let dog = await getDogBySlug(slug);

  if (!dog && isPreviewMode) {
    const availableDogs = await getDogs();
    const fallbackDog = availableDogs.find((entry) => typeof entry.slug === 'string' && entry.slug.trim().length > 0) || null;
    if (fallbackDog) {
      redirect(`/breeds/${fallbackDog.slug}?preview=true`);
    }
  }

  if (!dog) {
    notFound();
  }

  const supabase = await createClient();
  const { data: productTemplate } = await supabase
    .from('page_templates')
    .select('settings')
    .eq('page_type', 'product')
    .single();
  const templateSettings = mergeProductTemplateSettings(productTemplate?.settings as PageTemplateSettings | undefined);
  const sections = templateSettings.sections || {};
  const styling = templateSettings.styling || {};
  const layout = templateSettings.layout || {};
  const accentClass =
    styling.accent_color === 'blue'
      ? 'text-blue-400'
      : styling.accent_color === 'pink'
      ? 'text-pink-400'
      : styling.accent_color === 'gold'
      ? 'text-yellow-400'
      : 'text-purple-400';
  const hoverBorderClass =
    styling.accent_color === 'blue'
      ? 'hover:border-blue-500/30'
      : styling.accent_color === 'pink'
      ? 'hover:border-pink-500/30'
      : styling.accent_color === 'gold'
      ? 'hover:border-yellow-500/30'
      : 'hover:border-purple-500/30';
  const cardClass = styling.card_style === 'solid' ? 'bg-[var(--color-surface)]' : styling.card_style === 'minimal' ? 'bg-transparent border border-[var(--color-border)]' : 'glass-card';
  const characteristicsCols =
    sections.characteristics?.columns === 2
      ? 'md:grid-cols-2'
      : sections.characteristics?.columns === 4
      ? 'md:grid-cols-4'
      : 'md:grid-cols-3';
  const radiusClass =
    styling.border_radius === 'none'
      ? 'rounded-none'
      : styling.border_radius === 'md'
      ? 'rounded-md'
      : styling.border_radius === 'xl'
      ? 'rounded-xl'
      : styling.border_radius === '3xl'
      ? 'rounded-3xl'
      : 'rounded-2xl';

  return (
    <div className="pt-24 pb-20 lg:pt-32 lg:pb-28">
      <TemplatePreviewReloader pageType="product" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation */}
        {sections.back_button?.visible && (
          <Link 
            href="/" 
            className="inline-flex items-center text-sm font-medium text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors mb-8 group"
          >
            <div className={`p-1.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] mr-2 transition-colors ${hoverBorderClass}`}>
              <ArrowLeft className="w-4 h-4" />
            </div>
            {sections.back_button?.text || 'Back to all dogs'}
          </Link>
        )}

        {/* Top Hero Section */}
        <div className={`grid grid-cols-1 ${layout.type === 'single-column' ? '' : 'lg:grid-cols-2'} gap-12 mb-16`}>
          {/* Image Gallery */}
          {sections.image_gallery?.visible && (
          <div className={`space-y-4 ${layout.gallery_position === 'right' ? 'lg:order-2' : ''}`}>
            <div className={`${cardClass} aspect-[4/3] relative ${radiusClass} overflow-hidden group`}>
              <Image
                src={dog.images[0] || dog.thumbnailImage}
                alt={`${dog.breedName} puppy for sale`}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {styling.show_gradients && <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />}
              {sections.image_gallery?.show_status_badge && (
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <Badge status={dog.status} />
                </div>
              )}
            </div>
            {/* Thumbnails if multiple images exist */}
            {dog.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {dog.images.slice(1, (sections.image_gallery?.max_thumbnails || 4) + 1).map((img, idx) => (
                  <div key={idx} className={`relative aspect-square rounded-xl overflow-hidden ${cardClass} cursor-pointer transition-colors ${hoverBorderClass}`}>
                    <Image
                      src={img}
                      alt={`${dog.breedName} - Image ${idx + 2}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 25vw, 15vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          )}

          {/* Details & CTA handled by interactive client component */}
          {sections.details_card?.visible && <DogDetailsClient dog={dog} />}
        </div>

        {/* Detailed Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          <div className="lg:col-span-2 space-y-12">
            {sections.about_section?.visible && (
            <section>
              <h2 className="text-2xl font-display font-bold mb-4 flex items-center gap-2">
                <Sparkles className={`${accentClass} w-6 h-6`} /> 
                {(sections.about_section?.title || 'About the {breed}').replace('{breed}', dog.breedName)}
              </h2>
              <div className="prose prose-invert max-w-none text-[var(--text-secondary)]">
                {dog.longDescription.split('\n\n').map((para, i) => (
                  <p key={i} className="mb-4 leading-relaxed">{para}</p>
                ))}
              </div>
            </section>
            )}

            {sections.characteristics?.visible && (
            <section>
              <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
                <CheckCircle2 className={`${accentClass} w-6 h-6`} /> 
                {sections.characteristics?.title || 'Temperament & Characteristics'}
              </h2>
              <div className={`grid grid-cols-2 ${characteristicsCols} gap-4`}>
                <InfoCard label="Size" value={dog.characteristics.size} />
                <InfoCard label="Coat Length" value={dog.characteristics.coatLength} />
                <InfoCard label="Energy Level" value={dog.characteristics.energyLevel.replace('_', ' ')} />
                <InfoCard label="Training" value={dog.characteristics.trainingDifficulty} />
                <InfoCard label="Grooming" value={dog.characteristics.grooming} />
                <InfoCard label="Lifespan" value={dog.characteristics.lifespan} />
                <InfoCard label="Weight" value={dog.characteristics.weight} />
                <InfoCard label="Height" value={dog.characteristics.height} />
                <InfoCard label="Kids Friendly" value={dog.characteristics.goodWithKids ? 'Yes' : 'Varies'} />
                <InfoCard label="Pets Friendly" value={dog.characteristics.goodWithPets ? 'Yes' : 'Varies'} />
                <InfoCard label="Apartment" value={dog.characteristics.apartmentFriendly ? 'Yes' : 'No'} />
              </div>
            </section>
            )}

            {sections.health_info?.visible && (
            <section>
              <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
                <HeartPulse className={`${accentClass} w-6 h-6`} /> 
                {sections.health_info?.title || 'Health & Vaccinations'}
              </h2>
              <div className={`${cardClass} p-6 ${radiusClass} grid grid-cols-1 sm:grid-cols-2 gap-4`}>
                <HealthItem label="Vaccinated" value={dog.healthInfo.vaccinated} />
                <HealthItem label="Dewormed" value={dog.healthInfo.dewormed} />
                <HealthItem label="Vet Checked" value={dog.healthInfo.vetChecked} />
                <HealthItem label="Microchipped" value={dog.healthInfo.microchipped} />
                <HealthItem label="KCI Registered" value={dog.healthInfo.kciRegistered} />
                <HealthItem label="Parents Certified" value={dog.healthInfo.parentsCertified} />
              </div>
            </section>
            )}
          </div>

          {sections.faq_section?.visible && (
            <div className="lg:col-span-1">
              <div className={layout.sticky_sidebar ? 'sticky top-24' : ''}>
                <h2 className="text-2xl font-display font-bold mb-6">{sections.faq_section?.title || 'Frequently Asked Questions'}</h2>
                {dog.faqs && dog.faqs.length > 0 ? (
                  <Accordion items={dog.faqs.map((f, i) => ({ id: `faq-${i}`, ...f }))} />
                ) : (
                  <p className={`text-[var(--text-secondary)] ${cardClass} p-6 text-center`}>No FAQs available for this breed yet.</p>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="glass-card p-4 rounded-xl border border-[var(--color-border)] hover:border-purple-500/30 transition-colors">
      <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm font-semibold capitalize">{value}</p>
    </div>
  );
}

function HealthItem({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`p-1 rounded-full ${value ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-[var(--text-primary)]/20'}`}>
        <CheckCircle2 className="w-4 h-4" />
      </div>
      <span className={`text-sm ${value ? 'text-[var(--text-primary)] font-medium' : 'text-[var(--text-tertiary)]'}`}>{label}</span>
    </div>
  );
}
