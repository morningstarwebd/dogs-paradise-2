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
  // Safety check for filters to prevent runtime errors during hydration or Fast Refresh
  if (!filters) {
    return null;
  }

  const update = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <GlassCard hover={false} variant="solid" className="p-6 border-slate-200/60 shadow-sm">
      <div className="relative z-10 flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-sm uppercase tracking-wider text-slate-900">
            Customize Search
          </h3>
          <button
            onClick={() =>
              onFilterChange({ 
                category: 'all', 
                status: 'all', 
                gender: 'all', 
                size: 'all', 
                sort: 'newest' 
              })
            }
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 px-3 py-1 rounded-full"
          >
            Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
          {/* Category */}
          <FilterGroup label="Category">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => update('category', cat.slug)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-semibold transition-all border',
                    filters.category === cat.slug
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
                      : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100'
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </FilterGroup>

          {/* Status */}
          <FilterGroup label="Availability">
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => update('status', opt.value)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-semibold transition-all border',
                    filters.status === opt.value
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
                      : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100'
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
                    'px-3 py-1.5 rounded-full text-xs font-semibold transition-all border',
                    filters.size === opt.value
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
                      : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </FilterGroup>

          {/* Sort */}
          <FilterGroup label="Sort Results">
            <select
              value={filters.sort}
              onChange={(e) => update('sort', e.target.value as Filters['sort'])}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </FilterGroup>
        </div>
      </div>
    </GlassCard>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2.5 block">
        {label}
      </label>
      {children}
    </div>
  );
}
