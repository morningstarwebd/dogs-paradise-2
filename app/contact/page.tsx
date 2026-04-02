import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Dogs Paradice. WhatsApp, call, or visit us in Bangalore for premium puppies. Quick responses guaranteed.',
};

export default function ContactPage() {
  return <ContactClient />;
}
