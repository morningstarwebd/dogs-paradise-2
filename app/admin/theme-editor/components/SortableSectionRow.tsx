import { Eye, EyeOff, Globe, GripVertical, Trash2 } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BlockRegistry } from '@/components/blocks/registry';
import { getSectionBlockType, type SectionData } from '@/types/schema.types';

type SortableSectionRowProps = {
  isActive: boolean;
  onDelete: () => void;
  onPublishToggle: () => void;
  onSelect: () => void;
  onToggleVisibility: (visible: boolean) => void;
  section: SectionData;
};

export function SortableSectionRow({
  isActive,
  onDelete,
  onPublishToggle,
  onSelect,
  onToggleVisibility,
  section,
}: SortableSectionRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const blockType = getSectionBlockType(section);
  const hasBlocks = BlockRegistry[blockType]?.blocks && BlockRegistry[blockType].blocks!.length > 0;
  const sectionContent = (section.content || {}) as Record<string, unknown>;
  const sectionBlocks = Array.isArray(sectionContent.blocks) ? sectionContent.blocks : [];
  const blockCount = hasBlocks ? sectionBlocks.length : 0;

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1, zIndex: isDragging ? 99 : 'auto' }}
      onClick={onSelect}
      className={`group flex cursor-pointer items-center gap-2 rounded-lg border p-2.5 transition-all ${
        isActive
          ? 'border-[#ea728c] bg-[#ea728c]/20 shadow-[inset_4px_0_0_#ea728c]'
          : 'border-transparent bg-[#1b1836] hover:border-[#ea728c]/30'
      }`}
    >
      <button {...attributes} {...listeners} className="cursor-grab text-gray-500 hover:text-white active:cursor-grabbing">
        <GripVertical size={14} />
      </button>
      <div className="flex flex-1 items-center gap-2 truncate">
        <span className={`truncate text-sm font-semibold ${isActive ? 'text-white' : 'text-gray-300'}`}>{section.label}</span>
        {section.status === 'draft' ? <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-500">Draft</span> : null}
        {hasBlocks && blockCount > 0 ? <span className="rounded bg-[#ea728c]/20 px-1.5 py-0.5 text-[9px] font-bold text-[#ea728c]">{blockCount}</span> : null}
      </div>
      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={(event) => {
            event.stopPropagation();
            onToggleVisibility(!section.is_visible);
          }}
          className={`rounded p-1.5 hover:bg-black/20 ${section.is_visible ? 'text-gray-400 hover:text-white' : 'text-red-400'}`}
        >
          {section.is_visible ? <Eye size={12} /> : <EyeOff size={12} />}
        </button>
        <button
          onClick={(event) => {
            event.stopPropagation();
            onPublishToggle();
          }}
          className={`rounded p-1.5 hover:bg-black/20 ${section.status === 'published' ? 'text-green-400' : 'text-gray-400 hover:text-white'}`}
        >
          <Globe size={12} />
        </button>
        <button
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
          className="rounded p-1.5 text-gray-400 hover:bg-red-500/10 hover:text-red-500"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}
