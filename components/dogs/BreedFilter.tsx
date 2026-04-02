'use client';

import { cn } from '@/lib/utils';
import { categories } from '@/data/categories';
import GlassCard from '@/components/ui/GlassCard';
import type { DogStatus, DogSize } from '@/types';

interface Filters {
  category: string;
  status: DogStatus | 'all';
  gender: 'male' | 'female' | 'all';
  size: DogSize | 'all';
  sort: 'newest' | 'price-asc' | 'price-desc' | 'name';
}

interface BreedFilterProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

const statusOptions: { value: DogStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Status' },
  { value: 'available', label: 'Available' },
  { value: 'reserved', label: 'Reserved' },
  { value: 'coming_soon', label: 'Coming Soon' },
  { value: 'sold', label: 'Sold' },
];

const genderOptions = [
  { value: 'all' as const, label: 'All Genders' },
  { value: 'male' as const, label: 'Male' },
  { value: 'female' as const, label: 'Female' },
];

const sizeOptions: { value: DogSize | 'all'; label: string }[] = [
  { value: 'all', label: 'All Sizes' },
  { value: 'toy', label: 'Toy' },
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
  { value: 'giant', label: 'Giant' },
];

const sortOptions = [
  { value: 'newest' as const, label: 'Newest First' },
  { value: 'price-asc' as const, label: 'Price: Low → High' },
  { value: 'price-desc' as const, label: 'Price: High → Low' },
  { value: 'name' as const, label: 'Name A‑Z' },
];

export default function BreedFilter({ filters, onFilterChange }: BreedFilterProps) {
  const update = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <GlassCard hover={false} className="p-5">
      <div className="relative z-10 flex flex-col gap-6">
        <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-white">
          Filters
        </h3>

        {/* Category */}
        <FilterGroup label="Category">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => update('category', cat.slug)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                  filters.category === cat.slug
                    ? 'bg-white text-black'
                    : 'bg-white/5 text-[var(--text-secondary)] hover:bg-white/10'
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </FilterGroup>

        {/* Status */}
        <FilterGroup label="Status">
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => update('status', opt.value)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                  filters.status === opt.value
                    ? 'bg-white text-black'
                    : 'bg-white/5 text-[var(--text-secondary)] hover:bg-white/10'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </FilterGroup>

        {/* Gender */}
        <FilterGroup label="Gender">
          <div className="flex flex-wrap gap-2">
            {genderOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => update('gender', opt.value)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                  filters.gender === opt.value
                    ? 'bg-white text-black'
                    : 'bg-white/5 text-[var(--text-secondary)] hover:bg-white/10'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </FilterGroup>

        {/* Size */}
        <FilterGroup label="Size">
          <div className="flex flex-wrap gap-2">
            {sizeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => update('size', opt.value)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                  filters.size === opt.value
                    ? 'bg-white text-black'
                    : 'bg-white/5 text-[var(--text-secondary)] hover:bg-white/10'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </FilterGroup>

        {/* Sort */}
        <FilterGroup label="Sort By">
          <select
            value={filters.sort}
            onChange={(e) => update('sort', e.target.value as Filters['sort'])}
            className="w-full bg-white/5 border border-[var(--color-border)] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[var(--color-surface)]">
                {opt.label}
              </option>
            ))}
          </select>
        </FilterGroup>

        {/* Reset */}
        <button
          onClick={() =>
            onFilterChange({ category: 'all', status: 'all', gender: 'all', size: 'all', sort: 'newest' })
          }
          className="text-xs text-[var(--text-tertiary)] hover:text-white transition-colors"
        >
          Reset All Filters
        </button>
      </div>
    </GlassCard>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-2 block">
        {label}
      </label>
      {children}
    </div>
  );
}
