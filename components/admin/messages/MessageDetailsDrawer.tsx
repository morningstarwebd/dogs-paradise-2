import { Sparkles, Trash2, X } from 'lucide-react';
import type { ContactMessage } from '@/store/admin-data-store';

type MessageDetailsDrawerProps = {
  message: ContactMessage | null;
  onClose: () => void;
  onDelete: (id: string | null) => void;
  onGenerateProposal: (message: ContactMessage) => void;
  open: boolean;
};

export function MessageDetailsDrawer({
  message,
  onClose,
  onDelete,
  onGenerateProposal,
  open,
}: MessageDetailsDrawerProps) {
  if (!open || !message) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-6 py-4">
          <div>
            <h2 className="font-display text-xl font-medium">Message Details</h2>
            <p className="text-sm text-muted-foreground">Received {message.created_at ? new Date(message.created_at).toLocaleString() : ''}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary"><X size={20} /></button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-6 rounded-xl border border-border/50 bg-secondary/20 p-4">
            <InfoCard label="Name" value={message.name} />
            <InfoCard label="Email" value={<a href={`mailto:${message.email}`} className="text-accent hover:underline">{message.email}</a>} />
            <InfoCard label="Service" value={message.service || 'N/A'} />
            <InfoCard label="Budget" value={message.budget || 'N/A'} />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Message</label>
            <div className="whitespace-pre-wrap rounded-xl border border-border/50 bg-secondary/40 p-5 text-sm leading-relaxed">{message.message}</div>
          </div>

          {message.lead_score != null && message.lead_score > 0 ? (
            <div className={`rounded-xl border p-4 ${message.lead_score >= 8 ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20' : message.lead_score >= 5 ? 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20' : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/20'}`}>
              <div className="mb-1 flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">AI Lead Score</span>
                <span className={`text-sm font-bold ${message.lead_score >= 8 ? 'text-red-600 dark:text-red-400' : message.lead_score >= 5 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-600 dark:text-gray-400'}`}>{message.lead_score >= 8 ? '🔥' : message.lead_score >= 5 ? '⭐' : '—'} {message.lead_score}/10</span>
              </div>
              {message.lead_summary ? <p className="text-xs text-muted-foreground">{message.lead_summary}</p> : null}
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-between border-t border-border bg-secondary/10 p-6">
          <button onClick={() => onGenerateProposal(message)} className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition-colors hover:bg-indigo-700"><Sparkles size={16} /> Generate Proposal</button>
          <div className="flex gap-2">
            <button onClick={() => onDelete(message.id)} className="flex items-center justify-center rounded-lg p-2.5 text-destructive transition-colors hover:bg-destructive/10" title="Delete Message"><Trash2 size={18} /></button>
            <button onClick={onClose} className="rounded-lg bg-secondary px-6 py-2.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80">Close</button>
          </div>
        </div>
      </div>
    </>
  );
}

function InfoCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</label>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
