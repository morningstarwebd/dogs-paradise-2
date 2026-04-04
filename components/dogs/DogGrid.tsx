'use client';

import { motion } from 'motion/react';
import DogCard from '@/components/dogs/DogCard';
import { staggerContainer } from '@/lib/animations';
import type { Dog } from '@/types';

interface DogGridProps {
  dogs: Dog[];
}

export default function DogGrid({ dogs }: DogGridProps) {
  if (dogs.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="mb-4 text-5xl text-[var(--text-tertiary)]">P</p>
        <h3 className="heading-card mb-2 text-[var(--text-primary)]">No puppies found</h3>
        <p className="text-sm text-[var(--text-secondary)]">
          Try adjusting your filters or check back later for new arrivals.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {dogs.map((dog, index) => (
        <DogCard key={dog.id} dog={dog} index={index} />
      ))}
    </motion.div>
  );
}
