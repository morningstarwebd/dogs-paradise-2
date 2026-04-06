import { Lock } from 'lucide-react';
import type { SectionData } from '@/types/schema.types';

type FixedLayoutRowProps = {
  isActive: boolean;
  onSelect: () => void;
  section: SectionData;
};

export function FixedLayoutRow({ isActive, onSelect, section }: FixedLayoutRowProps) {
  return (
    <button
      onClick={onSelect}
      className={`mb-1.5 flex w-full items-center gap-2 rounded-lg border p-2.5 transition-all ${
        isActive
          ? 'border-[#ea728c] bg-[#ea728c]/20 shadow-[inset_4px_0_0_#ea728c]'
          : 'border-[#ea728c]/20 bg-[#1b1836] hover:border-[#ea728c]/40'
      }`}
    >
      <Lock size={13} className="text-[#ea728c]" />
      <span className={`flex-1 text-left text-sm font-semibold ${isActive ? 'text-white' : 'text-gray-300'}`}>
        {section.label}
      </span>
      {section.status === 'draft' ? (
        <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-500">
          Draft
        </span>
      ) : null}
      <span className="rounded bg-[#ea728c]/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#ea728c]">
        Fixed
      </span>
    </button>
  );
}
