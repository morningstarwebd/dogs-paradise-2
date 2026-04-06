import { Copy, Loader2, Send, Sparkles, X } from 'lucide-react';
import type { ContactMessage } from '@/store/admin-data-store';

type AiProposalModalProps = {
  isGenerating: boolean;
  message: ContactMessage | null;
  onClose: () => void;
  onCopy: () => void;
  onWhatsApp: () => void;
  open: boolean;
  proposal: string;
};

export function AiProposalModal({
  isGenerating,
  message,
  onClose,
  onCopy,
  onWhatsApp,
  open,
  proposal,
}: AiProposalModalProps) {
  if (!open || !message) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm md:p-6" onClick={() => !isGenerating && onClose()}>
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl animate-in zoom-in-95 duration-200" onClick={(event) => event.stopPropagation()}>
        <div className="flex shrink-0 items-center justify-between border-b border-border bg-gradient-to-r from-indigo-500/10 to-violet-500/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-400"><Sparkles size={20} /></div>
            <div><h2 className="text-lg font-display font-semibold">AI Proposal Generator</h2><p className="text-xs text-muted-foreground">Draft for {message.name}</p></div>
          </div>
          <button onClick={onClose} disabled={isGenerating} className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-50"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto bg-secondary/5 p-6">
          <div className="min-h-[300px] w-full whitespace-pre-wrap rounded-xl border border-border/50 bg-background p-5 font-sans text-sm leading-relaxed shadow-inner">
            {proposal || (isGenerating && 'Analyzing client requirements and drafting proposal...')}
            {isGenerating ? <span className="ml-1 inline-block h-4 w-1.5 animate-pulse align-middle bg-indigo-500" /> : null}
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-between border-t border-border bg-secondary/20 px-6 py-4">
          <p className="text-xs text-muted-foreground">{isGenerating ? <span className="flex items-center gap-1.5"><Loader2 size={12} className="animate-spin" /> Generating...</span> : 'Review and edit the draft before sending.'}</p>
          <div className="flex gap-2">
            <button onClick={onCopy} disabled={isGenerating || !proposal} className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-white disabled:opacity-50"><Copy size={16} /> Copy</button>
            <button onClick={onWhatsApp} disabled={isGenerating || !proposal} className="flex items-center gap-2 rounded-lg bg-[#25D366] px-5 py-2 text-sm font-medium text-white shadow-sm shadow-[#25D366]/20 transition-colors hover:bg-[#20bd5a] disabled:opacity-50"><Send size={16} /> WhatsApp</button>
          </div>
        </div>
      </div>
    </div>
  );
}
