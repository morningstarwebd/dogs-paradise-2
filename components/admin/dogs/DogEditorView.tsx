import { ArrowLeft, Loader2, Save } from 'lucide-react';
import type { Project } from '@/store/admin-data-store';
import { DogBasicInfoSection } from './DogBasicInfoSection';
import { DogCharacteristicsSection } from './DogCharacteristicsSection';
import { DogHealthSection } from './DogHealthSection';
import { DogMediaSidebar } from './DogMediaSidebar';
import { DogPricingSection } from './DogPricingSection';
import { DogFaqSection } from './DogFaqSection';
import type { DogFormSetter, DogFormState } from './dogs-constants';

type DogEditorViewProps = {
  editingProject: Project | null;
  form: DogFormState;
  onClose: () => void;
  onSave: () => void;
  onTitleChange: (title: string) => void;
  primaryImageIndex: number;
  saving: boolean;
  setForm: DogFormSetter;
  setPrimaryImageIndex: (index: number) => void;
  setTagsInput: (value: string) => void;
  tagsInput: string;
  toast: string | null;
};

export function DogEditorView({
  editingProject,
  form,
  onClose,
  onSave,
  onTitleChange,
  primaryImageIndex,
  saving,
  setForm,
  setPrimaryImageIndex,
  setTagsInput,
  tagsInput,
  toast,
}: DogEditorViewProps) {
  return (
    <div className="min-h-screen">
      {toast ? (
        <div className="fixed right-6 top-6 z-[100] rounded-xl bg-foreground px-6 py-3 text-sm font-semibold text-background shadow-2xl animate-in slide-in-from-top-2">
          {toast}
        </div>
      ) : null}

      <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="rounded-lg p-2 transition-colors hover:bg-muted">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="font-display text-xl font-bold">{editingProject ? 'Edit Dog' : 'Add New Dog'}</h1>
              <p className="text-sm text-muted-foreground">
                {editingProject ? `Editing: ${editingProject.title}` : 'Create a new dog listing'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-medium transition-colors hover:bg-muted">
              Discard
            </button>
            <button
              onClick={onSave}
              disabled={saving || !form.title.trim() || !form.slug.trim()}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'Saving...' : 'Save Dog'}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <DogMediaSidebar
            form={form}
            primaryImageIndex={primaryImageIndex}
            setForm={setForm}
            setPrimaryImageIndex={setPrimaryImageIndex}
          />
          <div className="space-y-6 lg:col-span-3">
            <DogBasicInfoSection
              form={form}
              onTitleChange={onTitleChange}
              setForm={setForm}
              setTagsInput={setTagsInput}
              tagsInput={tagsInput}
            />
            <DogCharacteristicsSection form={form} setForm={setForm} />
            <DogHealthSection form={form} setForm={setForm} />
            <DogPricingSection form={form} setForm={setForm} />
            <DogFaqSection form={form} setForm={setForm} />
          </div>
        </div>
      </div>
    </div>
  );
}
