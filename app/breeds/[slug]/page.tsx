import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, HeartPulse, Sparkles } from 'lucide-react';
import { dogs } from '@/data/dogs';
import Badge from '@/components/ui/Badge';
import Accordion from '@/components/ui/Accordion';
import DogDetailsClient from '@/components/dogs/DogDetailsClient';

export async function generateStaticParams() {
  return dogs.map((dog) => ({
    slug: dog.slug,
  }));
}

export default async function BreedPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dog = dogs.find((d) => d.slug === slug);

  if (!dog) {
    notFound();
  }

  return (
    <div className="pt-24 pb-20 lg:pt-32 lg:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation */}
        <Link 
          href="/" 
          className="inline-flex items-center text-sm font-medium text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors mb-8 group"
        >
          <div className="p-1.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] mr-2 group-hover:bg-purple-500/20 group-hover:border-purple-500/30 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back to all dogs
        </Link>

        {/* Top Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="glass-card aspect-[4/3] relative rounded-2xl overflow-hidden group">
              <Image
                src={dog.images[0] || dog.thumbnailImage}
                alt={`${dog.breedName} puppy for sale`}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 flex gap-2">
                <Badge status={dog.status} />
              </div>
            </div>
            {/* Thumbnails if multiple images exist */}
            {dog.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {dog.images.slice(1, 5).map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden glass-card cursor-pointer hover:border-purple-500/50 transition-colors">
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

          {/* Details & CTA handled by interactive client component */}
          <DogDetailsClient dog={dog} />
        </div>

        {/* Detailed Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-display font-bold mb-4 flex items-center gap-2">
                <Sparkles className="text-purple-400 w-6 h-6" /> 
                About the {dog.breedName}
              </h2>
              <div className="prose prose-invert max-w-none text-[var(--text-secondary)]">
                {dog.longDescription.split('\n\n').map((para, i) => (
                  <p key={i} className="mb-4 leading-relaxed">{para}</p>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
                <CheckCircle2 className="text-blue-400 w-6 h-6" /> 
                Temperament & Characteristics
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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

            <section>
              <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
                <HeartPulse className="text-red-400 w-6 h-6" /> 
                Health & Vaccinations
              </h2>
              <div className="glass-card p-6 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4">
                <HealthItem label="Vaccinated" value={dog.healthInfo.vaccinated} />
                <HealthItem label="Dewormed" value={dog.healthInfo.dewormed} />
                <HealthItem label="Vet Checked" value={dog.healthInfo.vetChecked} />
                <HealthItem label="Microchipped" value={dog.healthInfo.microchipped} />
                <HealthItem label="KCI Registered" value={dog.healthInfo.kciRegistered} />
                <HealthItem label="Parents Certified" value={dog.healthInfo.parentsCertified} />
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h2 className="text-2xl font-display font-bold mb-6">Frequently Asked Questions</h2>
              {dog.faqs && dog.faqs.length > 0 ? (
                <Accordion items={dog.faqs.map((f, i) => ({ id: `faq-${i}`, ...f }))} />
              ) : (
                <p className="text-[var(--text-secondary)] glass-card p-6 text-center">No FAQs available for this breed yet.</p>
              )}
            </div>
          </div>
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
