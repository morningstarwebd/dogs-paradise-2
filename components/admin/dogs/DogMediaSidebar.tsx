import { Star } from 'lucide-react';
import { MultiImageUpload } from '@/components/admin/MultiImageUpload';
import type { DogFormSetter, DogFormState } from './dogs-constants';
import { STATUSES } from './dogs-constants';

type DogMediaSidebarProps = {
  form: DogFormState;
  primaryImageIndex: number;
  setForm: DogFormSetter;
  setPrimaryImageIndex: (index: number) => void;
};

export function DogMediaSidebar({
  form,
  primaryImageIndex,
  setForm,
  setPrimaryImageIndex,
}: DogMediaSidebarProps) {
  return (
    <div className="space-y-6 lg:col-span-2">
      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-4 flex items-center gap-2 font-semibold">
          <Star size={16} className="text-amber-500" />
          Media Gallery
        </h2>
        <MultiImageUpload
          value={form.images || []}
          onChange={(urls) => setForm((current) => ({ ...current, images: urls }))}
          primaryIndex={primaryImageIndex}
          onPrimaryChange={setPrimaryImageIndex}
          folder="projects"
          maxImages={10}
        />
        <p className="mt-3 text-xs text-muted-foreground">
          First image or starred image will be used as cover photo
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="mb-4 font-semibold">Status</h3>
        <div className="grid grid-cols-2 gap-2">
          {STATUSES.map((status) => (
            <button
              key={status.value}
              type="button"
              onClick={() => setForm((current) => ({ ...current, status: status.value }))}
              className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                form.status === status.value
                  ? status.color === 'green'
                    ? 'border-green-400 bg-green-100 text-green-700 dark:border-green-600 dark:bg-green-900/30 dark:text-green-400'
                    : status.color === 'amber'
                      ? 'border-amber-400 bg-amber-100 text-amber-700 dark:border-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                      : status.color === 'blue'
                        ? 'border-blue-400 bg-blue-100 text-blue-700 dark:border-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'border-red-400 bg-red-100 text-red-700 dark:border-red-600 dark:bg-red-900/30 dark:text-red-400'
                  : 'border-border bg-muted/30 hover:bg-muted/50'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
