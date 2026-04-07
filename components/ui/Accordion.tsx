'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
  variant?: 'bordered' | 'separated' | 'minimal';
  expandFirst?: boolean;
}

export default function Accordion({ items, className, variant = 'bordered', expandFirst = false }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(expandFirst && items.length > 0 ? items[0].id : null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className={cn(
      variant === 'separated' ? 'space-y-4' : 'divide-y divide-[var(--color-border)] rounded-2xl border border-[var(--color-border)] overflow-hidden',
      className
    )}>
      {items.map((item) => {
        const isOpen = openId === item.id;

        return (
          <div
            key={item.id}
            className={cn(
              'transition-all duration-300',
              variant === 'separated' ? 'glass-card border border-[var(--color-border)] rounded-2xl overflow-hidden' : 'bg-transparent',
              isOpen && variant === 'separated' && 'ring-2 ring-purple-500/10'
            )}
          >
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
              aria-expanded={isOpen}
            >
              <span className="font-semibold text-lg text-gradient">{item.question}</span>
              <div
                className={cn(
                  'flex-shrink-0 ml-4 p-1.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] transition-transform duration-300',
                  isOpen && 'rotate-180 bg-purple-500/10 border-purple-500/20 text-purple-400'
                )}
              >
                <ChevronDown className="w-5 h-5" />
              </div>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div className="p-5 pt-0 text-[var(--text-secondary)] leading-relaxed">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
