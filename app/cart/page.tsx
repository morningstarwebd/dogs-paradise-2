import type { Metadata } from 'next';
import CartClient from './CartClient';

export const metadata: Metadata = {
  title: 'Enquiry Cart',
  description: 'Review your selected puppies and send an enquiry via WhatsApp.',
};

export default function CartPage() {
  return <CartClient />;
}
