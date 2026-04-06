import { Dog, Plus } from 'lucide-react';
import type { Project } from '@/store/admin-data-store';
import { DeleteDogDialog } from './DeleteDogDialog';
import { DogsGrid } from './DogsGrid';

type DogsListViewProps = {
  deleteId: string | null;
  onConfirmDelete: () => void;
  onDismissDelete: () => void;
  onEdit: (project: Project) => void;
  onNewDog: () => void;
  onSelectDelete: (id: string) => void;
  projects: Project[];
  toast: string | null;
};

export function DogsListView({
  deleteId,
  onConfirmDelete,
  onDismissDelete,
  onEdit,
  onNewDog,
  onSelectDelete,
  projects,
  toast,
}: DogsListViewProps) {
  return (
    <div className="space-y-8">
      {toast ? (
        <div className="fixed right-6 top-6 z-[100] rounded-xl bg-foreground px-6 py-3 text-sm font-semibold text-background shadow-2xl animate-in slide-in-from-top-2">
          {toast}
        </div>
      ) : null}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Dogs & Breeds</h1>
          <p className="mt-1 text-muted-foreground">{projects.length} dogs total</p>
        </div>
        <button
          onClick={onNewDog}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-blue-700"
        >
          <Plus size={16} />
          Add Dog
        </button>
      </div>

      <DogsGrid onDelete={onSelectDelete} onEdit={onEdit} projects={projects} />

      {projects.length === 0 ? (
        <div className="mt-8 rounded-2xl border-2 border-dashed border-gray-200 py-20 text-center dark:border-gray-700">
          <Dog className="mx-auto mb-4 h-20 w-20 text-muted-foreground/30" />
          <h3 className="text-xl font-semibold">No dogs yet</h3>
          <p className="mb-6 mt-2 text-muted-foreground">Add your first dog listing to get started</p>
          <button
            onClick={onNewDog}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-colors hover:bg-blue-700"
          >
            <Plus size={20} />
            Add Your First Dog
          </button>
        </div>
      ) : null}

      <DeleteDogDialog open={Boolean(deleteId)} onCancel={onDismissDelete} onConfirm={onConfirmDelete} />
    </div>
  );
}
