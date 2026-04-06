import { Dog } from 'lucide-react';
import { CollapsibleSection } from './CollapsibleSection';
import { CATEGORIES, type DogFormSetter, type DogFormState } from './dogs-constants';

type DogBasicInfoSectionProps = {
  form: DogFormState;
  onTitleChange: (title: string) => void;
  setForm: DogFormSetter;
  setTagsInput: (value: string) => void;
  tagsInput: string;
};

export function DogBasicInfoSection({
  form,
  onTitleChange,
  setForm,
  setTagsInput,
  tagsInput,
}: DogBasicInfoSectionProps) {
  return (
    <CollapsibleSection title="Basic Information" icon={Dog}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Breed Name *</label>
            <input
              value={form.title}
              onChange={(event) => onTitleChange(event.target.value)}
              className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Golden Retriever"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Slug *</label>
            <input
              value={form.slug}
              onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
              className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="golden-retriever"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Short Description</label>
          <textarea
            value={form.description || ''}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            className="min-h-[80px] w-full resize-y rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Brief description for cards and previews"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Description</label>
          <textarea
            value={form.long_description || ''}
            onChange={(event) => setForm((current) => ({ ...current, long_description: event.target.value }))}
            className="min-h-[150px] w-full resize-y rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Detailed description for the dog's page"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</label>
            <select
              value={form.category || ''}
              onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
              className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Gender</label>
            <select
              value={form.gender || ''}
              onChange={(event) =>
                setForm((current) => ({ ...current, gender: (event.target.value as 'male' | 'female') || null }))
              }
              className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Age</label>
            <input
              value={form.age || ''}
              onChange={(event) => setForm((current) => ({ ...current, age: event.target.value }))}
              className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="8 weeks"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tags (comma separated)</label>
          <input
            value={tagsInput}
            onChange={(event) => setTagsInput(event.target.value)}
            className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Family Friendly, Gentle, Smart"
          />
        </div>
      </div>
    </CollapsibleSection>
  );
}
