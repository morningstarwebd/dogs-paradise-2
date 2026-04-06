import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Dogs Paradise Bangalore. WhatsApp, call, or visit us in Bengaluru for premium puppies. Quick responses guaranteed.',
};

export default function ContactPage() {
  return <ContactClient />;
}
