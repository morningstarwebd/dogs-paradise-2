type DeleteMessageDialogProps = {
  onCancel: () => void;
  onConfirm: () => void;
  open: boolean;
};

export function DeleteMessageDialog({ onCancel, onConfirm, open }: DeleteMessageDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95">
        <h3 className="mb-2 text-xl font-display font-medium">Delete Message?</h3>
        <p className="mb-6 text-sm text-muted-foreground">This action cannot be undone. This will permanently delete the message from the database.</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary">Cancel</button>
          <button onClick={onConfirm} className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90">Yes, delete</button>
        </div>
      </div>
    </div>
  );
}
