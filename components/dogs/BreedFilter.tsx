'use client';

import { cn } from '@/lib/utils';
import { categories } from '@/data/categories';
import GlassCard from '@/components/ui/GlassCard';
import type { DogSize, DogStatus } from '@/types';

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
  { value: 'price-asc' as const, label: 'Price: Low to High' },
  { value: 'price-desc' as const, label: 'Price: High to Low' },
  { value: 'name' as const, label: 'Name A-Z' },
];

export default function BreedFilter({
  filters,
  onFilterChange,
}: BreedFilterProps) {
  const update = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const chipClass =
    'rounded-full border px-3 py-1.5 text-xs font-semibold transition-all';
  const selectedChipClass =
    'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-[var(--color-bg)] shadow-md';
  const idleChipClass =
    'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]';

  return (
    <GlassCard
      hover={false}
      variant="solid"
      className="border-[var(--color-border)] p-5 shadow-sm sm:p-6"
    >
      <div className="relative z-10 flex flex-col gap-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
            Customize Search
          </h3>
          <button
            onClick={() =>
              onFilterChange({
                category: 'all',
                status: 'all',
                gender: 'all',
                size: 'all',
                sort: 'newest',
              })
            }
            className="w-fit rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs font-semibold text-[var(--accent-primary)] transition-colors hover:border-[var(--accent-primary)] hover:text-[var(--text-primary)]"
          >
            Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 xl:grid-cols-5">
          <FilterGroup label="Category">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => update('category', cat.slug)}
                  className={cn(
                    chipClass,
                    filters.category === cat.slug
                      ? selectedChipClass
                      : idleChipClass
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup label="Availability">
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => update('status', opt.value)}
                  className={cn(
                    chipClass,
                    filters.status === opt.value
                      ? selectedChipClass
                      : idleChipClass
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup label="Gender">
            <div className="flex flex-wrap gap-2">
              {genderOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => update('gender', opt.value)}
                  className={cn(
                    chipClass,
                    filters.gender === opt.value
                      ? selectedChipClass
                      : idleChipClass
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup label="Size">
            <div className="flex flex-wrap gap-2">
              {sizeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => update('size', opt.value)}
                  className={cn(
                    chipClass,
                    filters.size === opt.value
                      ? selectedChipClass
                      : idleChipClass
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup label="Sort Results">
            <select
              value={filters.sort}
              onChange={(e) => update('sort', e.target.value as Filters['sort'])}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm font-medium text-[var(--text-primary)] transition-all focus:border-[var(--accent-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/15"
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

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2.5 block text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">
        {label}
      </label>
      {children}
    </div>
  );
}
