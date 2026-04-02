'use client';

import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import SectionHeading from '@/components/ui/SectionHeading';
import BreedFilter from '@/components/dogs/BreedFilter';
import DogGrid from '@/components/dogs/DogGrid';
import { dogs } from '@/data/dogs';
import { fadeUpVariant } from '@/lib/animations';
import type { DogStatus, DogSize } from '@/types';

interface Filters {
  category: string;
  status: DogStatus | 'all';
  gender: 'male' | 'female' | 'all';
  size: DogSize | 'all';
  sort: 'newest' | 'price-asc' | 'price-desc' | 'name';
}

export default function BreedsPage() {
  const [filters, setFilters] = useState<Filters>({
    category: 'all',
    status: 'all',
    gender: 'all',
    size: 'all',
    sort: 'newest',
  });

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = [...dogs];

    if (filters.category !== 'all') {
      result = result.filter((d) => d.categorySlug === filters.category);
    }
    if (filters.status !== 'all') {
      result = result.filter((d) => d.status === filters.status);
    }
    if (filters.gender !== 'all') {
      result = result.filter((d) => d.gender === filters.gender);
    }
    if (filters.size !== 'all') {
      result = result.filter((d) => d.characteristics.size === filters.size);
    }

    switch (filters.sort) {
      case 'price-asc':
        result.sort((a, b) => (a.price ?? 999999) - (b.price ?? 999999));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case 'name':
        result.sort((a, b) => a.breedName.localeCompare(b.breedName));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [filters]);

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="All Breeds"
          subtitle={`Showing ${filtered.length} puppies. Find your perfect companion.`}
        />

        {/* Mobile filter toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="glass-btn px-6 py-3 text-sm font-medium w-full"
          >
            {mobileFilterOpen ? 'Hide Filters' : 'Show Filters'} ({filtered.length} results)
          </button>
          {mobileFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4"
            >
              <BreedFilter filters={filters} onFilterChange={setFilters} />
            </motion.div>
          )}
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar Filter */}
          <motion.aside
            variants={fadeUpVariant}
            initial="hidden"
            animate="visible"
            className="hidden lg:block w-72 shrink-0"
          >
            <div className="sticky top-28">
              <BreedFilter filters={filters} onFilterChange={setFilters} />
            </div>
          </motion.aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <DogGrid dogs={filtered} />
          </div>
        </div>
      </div>
    </div>
  );
}
