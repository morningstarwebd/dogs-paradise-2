interface DeletePostDialogProps {
    onCancel: () => void
    onConfirm: () => void
}

export function DeletePostDialog({ onCancel, onConfirm }: DeletePostDialogProps) {
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onCancel}>
            <div className="bg-card rounded-2xl p-8 max-w-md w-full border border-border shadow-2xl" onClick={(event) => event.stopPropagation()}>
                <h3 className="text-xl font-bold mb-3">Delete this post?</h3>
                <p className="text-muted-foreground mb-6 text-sm">This action cannot be undone. The post will be permanently removed.</p>
                <div className="flex gap-3 justify-end">
                    <button onClick={onCancel} className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-secondary hover:bg-secondary/80 transition-colors">Cancel</button>
                    <button onClick={onConfirm} className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-destructive text-white hover:bg-destructive/90 transition-colors">Delete</button>
                </div>
            </div>
        </div>
    )
}
