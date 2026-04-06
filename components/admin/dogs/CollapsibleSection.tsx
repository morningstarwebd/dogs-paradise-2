import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState, type ReactNode, type ElementType } from 'react';

type CollapsibleSectionProps = {
  children: ReactNode;
  defaultOpen?: boolean;
  icon: ElementType;
  title: string;
};

export function CollapsibleSection({
  children,
  defaultOpen = true,
  icon: Icon,
  title,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center justify-between px-5 py-4 transition-colors hover:bg-muted/30"
      >
        <div className="flex items-center gap-3">
          <Icon size={18} className="text-muted-foreground" />
          <span className="font-semibold">{title}</span>
        </div>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {isOpen ? <div className="border-t border-border px-5 pb-5 pt-2">{children}</div> : null}
    </div>
  );
}
