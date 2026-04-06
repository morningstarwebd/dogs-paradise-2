'use client';

import { motion } from 'motion/react';
import { fadeUpVariant } from '@/lib/animations';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  useGradientTitle?: boolean;
}

export default function SectionHeading({
  title,
  subtitle,
  centered = true,
  className,
  useGradientTitle = true,
}: SectionHeadingProps) {
  return (
    <motion.div
      className={cn('mb-12', centered && 'text-center', className)}
      variants={fadeUpVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      <h2 className={cn('heading-section', useGradientTitle ? 'text-gradient' : 'text-[var(--text-primary)]')}>
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base max-w-2xl text-[var(--text-secondary)] mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
