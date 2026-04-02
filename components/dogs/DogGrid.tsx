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
      <div className="text-center py-20">
        <p className="text-6xl mb-4">🐾</p>
        <h3 className="heading-card text-white mb-2">No puppies found</h3>
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
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {dogs.map((dog, i) => (
        <DogCard key={dog.id} dog={dog} index={i} />
      ))}
    </motion.div>
  );
}
