'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import { motion } from 'motion/react';
import GlassCard from '@/components/ui/GlassCard';
import { fadeUpVariant } from '@/lib/animations';
import { siteConfig } from '@/data/site-config';
import { getWhatsAppLink } from '@/lib/utils';
import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
} from 'lucide-react';

export default function ContactClient() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    breed: '',
    message: '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const message = [
      `Hi ${siteConfig.brandName}!`,
      '',
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Interested in: ${form.breed || 'Not sure yet'}`,
      '',
      `Message: ${form.message}`,
    ].join('\n');

    window.open(getWhatsAppLink(siteConfig.whatsappNumber, message), '_blank');
  };

  return (
    <div className="pb-20 pt-24 lg:pt-28">
      <section className="section-shell-tight">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            animate="visible"
            className="mx-auto mb-12 max-w-3xl text-center"
          >
            <span className="label-badge mb-5 inline-block rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-[var(--text-secondary)]">
              Contact Us
            </span>
            <h1 className="heading-hero mb-5 text-gradient">Let&apos;s Find the Right Puppy for Your Home</h1>
            <p className="text-lg leading-relaxed text-[var(--text-secondary)]">
              WhatsApp is the fastest way to reach us. Tell us the breed you like, the size you
              prefer, and whether you are looking for a companion puppy or a puppy with specific
              paperwork options.
            </p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-5 lg:gap-10">
            <motion.div
              variants={fadeUpVariant}
              initial="hidden"
              animate="visible"
              className="lg:col-span-3"
            >
              <GlassCard hover={false} variant="solid" className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FieldLabel htmlFor="name" label="Your Name *" />
                    <FieldLabel htmlFor="phone" label="Phone Number *" />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <input
                      id="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                      className={inputClassName}
                      placeholder="Your full name"
                    />
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                      className={inputClassName}
                      placeholder={siteConfig.phone}
                    />
                  </div>

                  <div>
                    <FieldLabel htmlFor="breed" label="Interested Breed" />
                    <select
                      id="breed"
                      value={form.breed}
                      onChange={(e) => setForm((prev) => ({ ...prev, breed: e.target.value }))}
                      className={inputClassName}
                    >
                      <option value="">Select a breed (optional)</option>
                      <option value="Golden Retriever">Golden Retriever</option>
                      <option value="Labrador Retriever">Labrador Retriever</option>
                      <option value="German Shepherd">German Shepherd</option>
                      <option value="Siberian Husky">Siberian Husky</option>
                      <option value="Rottweiler">Rottweiler</option>
                      <option value="Beagle">Beagle</option>
                      <option value="Shih Tzu">Shih Tzu</option>
                      <option value="Pomeranian">Pomeranian</option>
                      <option value="Doberman Pinscher">Doberman Pinscher</option>
                      <option value="French Bulldog">French Bulldog</option>
                      <option value="Other">Other / Not Sure</option>
                    </select>
                  </div>

                  <div>
                    <FieldLabel htmlFor="message" label="Your Message *" />
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                      className={`${inputClassName} resize-none`}
                      placeholder="Tell us about your home, preferred gender, age, budget, or any specific questions."
                    />
                  </div>

                  <button
                    type="submit"
                    className="whatsapp-btn flex w-full items-center justify-center gap-2 px-6 py-4 text-base font-medium"
                  >
                    <Send size={18} />
                    Send on WhatsApp
                  </button>

                  <div className="rounded-2xl border border-[var(--accent-primary)]/10 bg-[var(--accent-primary)]/5 p-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                    <div className="mb-2 flex items-center gap-2 text-[var(--text-primary)]">
                      <ShieldCheck size={16} className="text-[var(--accent-primary)]" />
                      <span className="font-medium">Documentation note</span>
                    </div>
                    {siteConfig.registrationNote}
                  </div>
                </form>
              </GlassCard>
            </motion.div>

            <motion.div
              variants={fadeUpVariant}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.15 }}
              className="space-y-6 lg:col-span-2"
            >
              <GlassCard hover={false} variant="solid" className="p-6">
                <h2 className="heading-card mb-5 text-[var(--text-primary)]">Contact Information</h2>
                <div className="space-y-5">
                  <ContactItem
                    icon={<Phone size={18} />}
                    label="Phone"
                    value={siteConfig.phone}
                    href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}
                  />
                  <ContactItem
                    icon={<MessageCircle size={18} />}
                    label="WhatsApp"
                    value="Chat with us directly"
                    href={getWhatsAppLink(
                      siteConfig.whatsappNumber,
                      'Hi, I would like to know more about your puppies.'
                    )}
                    external
                  />
                  <ContactItem
                    icon={<Mail size={18} />}
                    label="Email"
                    value={siteConfig.email}
                    href={`mailto:${siteConfig.email}`}
                  />
                  <ContactItem
                    icon={<MapPin size={18} />}
                    label="Address"
                    value={`${siteConfig.address}, ${siteConfig.city}, ${siteConfig.state}`}
                    href={siteConfig.googleMapsUrl}
                    external
                  />
                </div>
              </GlassCard>

              <GlassCard hover={false} variant="solid" className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Clock size={18} className="text-[var(--accent-primary)]" />
                  <h2 className="heading-card text-[var(--text-primary)]">Business Hours</h2>
                </div>
                <div className="space-y-3 text-sm text-[var(--text-secondary)]">
                  {siteConfig.businessHours.map((item) => (
                    <div
                      key={item.days}
                      className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] pb-3 last:border-b-0 last:pb-0"
                    >
                      <span>{item.days}</span>
                      <span className="text-right font-medium text-[var(--text-primary)]">
                        {item.hours}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-5 text-xs leading-relaxed text-[var(--text-tertiary)]">
                  We recommend sending a WhatsApp message before visiting so we can prepare the
                  right puppy options for you.
                </p>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

const inputClassName =
  'w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/10 transition-colors';

function FieldLabel({ htmlFor, label }: { htmlFor: string; label: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-xs uppercase tracking-[0.18em] text-[var(--text-tertiary)]"
    >
      {label}
    </label>
  );
}

function ContactItem({
  icon,
  label,
  value,
  href,
  external,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  href: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="group flex items-start gap-3"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] transition-transform group-hover:scale-105">
        {icon}
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-tertiary)]">{label}</p>
        <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)] transition-colors group-hover:text-[var(--text-primary)]">
          {value}
        </p>
      </div>
    </a>
  );
}
