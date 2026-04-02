'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { categories } from '@/data/categories';
import { fadeUpVariant, staggerContainer } from '@/lib/animations';
import { Dog, Shield, Home, Sparkles, PawPrint, Layers } from 'lucide-react';

const icons: Record<string, React.ReactNode> = {
  'all': <Layers size={22} />,
  'large-breeds': <Dog size={22} />,
  'small-breeds': <PawPrint size={22} />,
  'guard-dogs': <Shield size={22} />,
  'family-dogs': <Home size={22} />,
  'toy-breeds': <Sparkles size={22} />,
};

interface CategoryStripProps {
  activeCategory: string;
  onCategoryChange: (slug: string) => void;
}

export default function CategoryStrip({ activeCategory, onCategoryChange }: CategoryStripProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className="flex gap-3 overflow-x-auto hide-scrollbar py-2 px-1"
    >
      {categories.map((cat) => (
        <motion.button
          key={cat.id}
          variants={fadeUpVariant}
          onClick={() => onCategoryChange(cat.slug)}
          className={cn(
            'flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0',
            activeCategory === cat.slug
              ? 'bg-white text-black'
              : 'glass-btn text-[var(--text-secondary)] hover:text-white'
          )}
          aria-pressed={activeCategory === cat.slug}
        >
          {icons[cat.slug] || <PawPrint size={18} />}
          {cat.name}
        </motion.button>
      ))}
    </motion.div>
  );
}
