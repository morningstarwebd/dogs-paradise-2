'use client';

import { useState } from 'react';
import SectionHeading from '@/components/ui/SectionHeading';
import { dogs } from '@/data/dogs';
import DogGrid from '@/components/dogs/DogGrid';
import BreedFilter from '@/components/dogs/BreedFilter';
import { motion } from 'motion/react';
import { fadeUpVariant } from '@/lib/animations';

export default function BreedsClient() {
  const [filters, setFilters] = useState<{
    category: string;
    status: any;
    gender: any;
    size: any;
    sort: any;
  }>({
    category: 'all',
    status: 'all',
    gender: 'all',
    size: 'all',
    sort: 'newest',
  });

  const filtered = dogs.filter(d => {
    if (filters.category !== 'all' && d.categorySlug !== filters.category) return false;
    if (filters.status !== 'all' && d.status !== filters.status) return false;
    if (filters.gender !== 'all' && d.gender !== filters.gender) return false;
    if (filters.size !== 'all' && d.characteristics.size.toLowerCase() !== filters.size) return false;
    return true;
  });

  return (
    <div className="pt-24 pb-20 lg:pt-32 lg:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
           variants={fadeUpVariant}
           initial="hidden"
           animate="visible"
        >
          <SectionHeading 
            title="Explore All Breeds" 
            subtitle="Find the perfect addition to your family from our wide range of healthy, KCI-registered puppies."
          />
        </motion.div>

        <div className="mb-12">
          <BreedFilter 
            filters={filters} 
            onFilterChange={setFilters} 
          />
        </div>

        <DogGrid dogs={filtered} />
        
        {filtered.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-slate-500 font-medium">No breeds found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
