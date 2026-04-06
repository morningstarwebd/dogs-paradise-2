import { Heart } from 'lucide-react';
import { CollapsibleSection } from './CollapsibleSection';
import type { DogFormSetter, DogFormState } from './dogs-constants';

type DogPricingSectionProps = {
  form: DogFormState;
  setForm: DogFormSetter;
};

export function DogPricingSection({ form, setForm }: DogPricingSectionProps) {
  return (
    <CollapsibleSection title="Pricing & Organization" icon={Heart} defaultOpen={false}>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Price (₹)</label>
          <input
            type="number"
            value={form.price || ''}
            onChange={(event) =>
              setForm((current) => ({ ...current, price: event.target.value ? parseFloat(event.target.value) : null }))
            }
            className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Leave empty for inquiry"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sort Order</label>
          <input
            type="number"
            value={form.sort_order || 0}
            onChange={(event) =>
              setForm((current) => ({ ...current, sort_order: parseInt(event.target.value, 10) || 0 }))
            }
            className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Featured</label>
          <button
            type="button"
            onClick={() => setForm((current) => ({ ...current, featured: !current.featured }))}
            className={`w-full rounded-xl border py-3 text-sm font-semibold transition-colors ${
              form.featured
                ? 'border-amber-400 bg-amber-100 text-amber-700 dark:border-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                : 'border-border bg-muted/30 text-muted-foreground hover:bg-muted/50'
            }`}
          >
            {form.featured ? '★ Featured' : 'Not Featured'}
          </button>
        </div>
      </div>
    </CollapsibleSection>
  );
}
