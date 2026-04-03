'use client';

import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { cardHoverVariant } from '@/lib/animations';
import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  as?: 'div' | 'article' | 'section';
  variant?: 'glass' | 'solid';
}

export default function GlassCard({
  children,
  className,
  hover = true,
  onClick,
  as = 'div',
  variant = 'glass',
}: GlassCardProps) {
  const Component = as;
  const isSolid = variant === 'solid';
  const baseClass = isSolid ? 'bg-white border-gray-100 shadow-sm' : 'glass-card';
  const staticClass = isSolid ? 'bg-white border-gray-100 shadow-sm' : 'glass-card-static';

  if (hover) {
    return (
      <motion.div
        className={cn(baseClass, className)}
        variants={cardHoverVariant}
        initial="rest"
        whileHover="hover"
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <Component className={cn(staticClass, className)}>
      {children}
    </Component>
  );
}
