'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ShoppingBag, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/data/site-config';
import { useCartStore } from '@/lib/store/cart';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/breeds', label: 'Breeds' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.items.length);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'glass-nav py-3' : 'py-5 bg-transparent'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group" aria-label="Dogs Paradice Home">
          <span className="text-2xl">🐾</span>
          <span className="font-display text-xl font-bold tracking-tight text-gradient">
            {siteConfig.brandName}
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-[var(--text-secondary)] hover:text-white hover:bg-white/5'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}
            className="glass-btn px-4 py-2 text-sm flex items-center gap-2"
            aria-label="Call us"
          >
            <Phone size={14} />
            <span className="hidden lg:inline">Call Now</span>
          </a>
          <Link
            href="/cart"
            className="relative glass-btn p-2.5"
            aria-label={`Cart with ${itemCount} items`}
          >
            <ShoppingBag size={18} />
            {itemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-white text-black rounded-full text-[11px] font-bold flex items-center justify-center"
              >
                {itemCount}
              </motion.span>
            )}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-3">
          <Link href="/cart" className="relative p-2" aria-label="Cart">
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-white text-black rounded-full text-[10px] font-bold flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden glass-nav border-t border-[var(--color-border)] overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'px-4 py-3 rounded-xl text-base font-medium transition-all',
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-[var(--text-secondary)] hover:bg-white/5'
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}
                className="mt-2 whatsapp-btn px-4 py-3 rounded-xl text-base font-medium text-center flex items-center justify-center gap-2"
              >
                <Phone size={16} />
                Call Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
