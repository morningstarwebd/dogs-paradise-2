'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { formatPrice } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import { fadeUpVariant, cardHoverVariant } from '@/lib/animations';
import type { Dog } from '@/types';

interface DogCardProps {
  dog: Dog;
  index?: number;
}

export default function DogCard({ dog, index = 0 }: DogCardProps) {
  return (
    <motion.div
      variants={fadeUpVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.05 }}
    >
      <motion.div
        variants={cardHoverVariant}
        initial="rest"
        whileHover="hover"
      >
        <Link
          href={`/breeds/${dog.slug}`}
          className="glass-card block group overflow-hidden"
          id={`dog-card-${dog.id}`}
        >
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={dog.thumbnailImage}
              alt={`${dog.breedName} puppy for sale in Bangalore`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {/* Badge */}
            <div className="absolute top-3 left-3 z-10">
              <Badge status={dog.status} />
            </div>

          </div>

          {/* Info */}
          <div className="p-4 relative z-10">
            <div className="flex items-center justify-between mb-1">
              <h3 className="heading-card text-gradient">
                {dog.breedName}
              </h3>
              {dog.name && (
                <span className="text-xs text-[var(--text-tertiary)]">&quot;{dog.name}&quot;</span>
              )}
            </div>
            <p className="text-xs text-[var(--text-secondary)] mb-3">
              {dog.age} · {dog.gender === 'male' ? '♂ Male' : '♀ Female'} · {dog.characteristics.size}
            </p>
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {dog.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] text-[var(--text-tertiary)] border border-[var(--color-border)] rounded-full px-2 py-0.5"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
