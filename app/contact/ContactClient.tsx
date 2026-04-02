'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { fadeUpVariant } from '@/lib/animations';
import GlassCard from '@/components/ui/GlassCard';
import { siteConfig } from '@/data/site-config';
import { getWhatsAppLink } from '@/lib/utils';
import { Phone, Mail, MapPin, MessageCircle, Send, Clock } from 'lucide-react';

export default function ContactClient() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    breed: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hi ${siteConfig.brandName}!\n\nName: ${form.name}\nPhone: ${form.phone}\nInterested in: ${form.breed}\n\nMessage: ${form.message}`;
    window.open(getWhatsAppLink(siteConfig.whatsappNumber, msg), '_blank');
  };

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          animate="visible"
          className="text-center mb-16"
        >
          <h1 className="heading-hero text-gradient mb-4">Get In Touch</h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Ready to bring home your new best friend? WhatsApp us for the fastest response, or fill out the form below.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Form */}
          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            animate="visible"
            className="lg:col-span-3"
          >
            <GlassCard hover={false} className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-white/5 border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full bg-white/5 border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="breed" className="block text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
                    Interested Breed
                  </label>
                  <select
                    id="breed"
                    value={form.breed}
                    onChange={(e) => setForm({ ...form, breed: e.target.value })}
                    className="w-full bg-white/5 border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
                  >
                    <option value="" className="bg-[var(--color-surface)]">Select a breed (optional)</option>
                    <option value="Golden Retriever" className="bg-[var(--color-surface)]">Golden Retriever</option>
                    <option value="Labrador Retriever" className="bg-[var(--color-surface)]">Labrador Retriever</option>
                    <option value="German Shepherd" className="bg-[var(--color-surface)]">German Shepherd</option>
                    <option value="Siberian Husky" className="bg-[var(--color-surface)]">Siberian Husky</option>
                    <option value="Rottweiler" className="bg-[var(--color-surface)]">Rottweiler</option>
                    <option value="Beagle" className="bg-[var(--color-surface)]">Beagle</option>
                    <option value="Shih Tzu" className="bg-[var(--color-surface)]">Shih Tzu</option>
                    <option value="Pomeranian" className="bg-[var(--color-surface)]">Pomeranian</option>
                    <option value="Doberman Pinscher" className="bg-[var(--color-surface)]">Doberman Pinscher</option>
                    <option value="French Bulldog" className="bg-[var(--color-surface)]">French Bulldog</option>
                    <option value="Other" className="bg-[var(--color-surface)]">Other / Not Sure</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-white/5 border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors resize-none"
                    placeholder="Tell us about your requirements, preferred gender, budget, etc."
                  />
                </div>

                <button
                  type="submit"
                  className="whatsapp-btn w-full px-6 py-4 text-base font-medium flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  Send via WhatsApp
                </button>

                <p className="text-xs text-[var(--text-tertiary)] text-center">
                  This form opens WhatsApp with your enquiry. We typically respond within 30 minutes.
                </p>
              </form>
            </GlassCard>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.15 }}
            className="lg:col-span-2 space-y-6"
          >
            <GlassCard hover={false} className="p-6">
              <div className="relative z-10">
                <h3 className="heading-card text-white mb-6">Contact Information</h3>
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
                    value="Chat with us"
                    href={getWhatsAppLink(siteConfig.whatsappNumber, 'Hi! I have a question about your puppies.')}
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
              </div>
            </GlassCard>

            <GlassCard hover={false} className="p-6">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={18} />
                  <h3 className="heading-card text-white">Business Hours</h3>
                </div>
                <div className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <div className="flex justify-between">
                    <span>Monday – Friday</span>
                    <span className="text-white">10 AM – 7 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="text-white">10 AM – 5 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="text-[var(--text-tertiary)]">By Appointment</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function ContactItem({
  icon,
  label,
  value,
  href,
  external,
}: {
  icon: React.ReactNode;
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
      className="flex items-start gap-3 group"
    >
      <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 shrink-0 group-hover:text-white transition-colors">
        {icon}
      </div>
      <div>
        <p className="text-xs text-[var(--text-tertiary)]">{label}</p>
        <p className="text-sm text-[var(--text-secondary)] group-hover:text-white transition-colors">
          {value}
        </p>
      </div>
    </a>
  );
}
