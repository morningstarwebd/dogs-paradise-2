type DeleteDogDialogProps = {
  onCancel: () => void;
  onConfirm: () => void;
  open: boolean;
};

export function DeleteDogDialog({ onCancel, onConfirm, open }: DeleteDogDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onCancel}>
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <h3 className="mb-3 text-xl font-bold">Delete this dog?</h3>
        <p className="mb-6 text-sm text-muted-foreground">
          This action cannot be undone. The dog listing will be permanently removed.
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="rounded-xl bg-secondary px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary/80">
            Cancel
          </button>
          <button onClick={onConfirm} className="rounded-xl bg-destructive px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-destructive/90">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
