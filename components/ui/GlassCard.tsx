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
}

export default function GlassCard({
  children,
  className,
  hover = true,
  onClick,
  as = 'div',
}: GlassCardProps) {
  const Component = as;

  if (hover) {
    return (
      <motion.div
        className={cn('glass-card', className)}
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
    <Component className={cn('glass-card-static', className)}>
      {children}
    </Component>
  );
}
