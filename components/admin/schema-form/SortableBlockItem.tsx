'use client';

import { ChevronDown, ChevronRight, GripVertical, Plus, Trash2 } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type React from 'react';
import type { BlockInstance, BlockTypeSchema } from '@/types/schema.types';
import type { EditorViewport } from '@/lib/responsive-content';
import { FieldRenderer } from './FieldRenderer';
import { blockIconMap } from './block-icons';

type SortableBlockItemProps = {
  block: BlockInstance;
  domId: string;
  id: string;
  imageUploadFolder?: string;
  isExpanded: boolean;
  onRememberColor: (colorValue: string) => void;
  onRemove: () => void;
  onToggle: () => void;
  onUpdate: (settings: Record<string, unknown>) => void;
  savedColors: string[];
  setUploadingState: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  title: string;
  typeSchema: BlockTypeSchema;
  uploadingState: Record<string, boolean>;
  useMediaLibraryForImage?: boolean;
  viewport: EditorViewport;
};

export function SortableBlockItem({
  block, domId, id, imageUploadFolder, isExpanded, onRememberColor, onRemove, onToggle, onUpdate, savedColors,
  setUploadingState, title, typeSchema, uploadingState, useMediaLibraryForImage, viewport,
}: SortableBlockItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const icon = blockIconMap[typeSchema.icon || ''] || <Plus size={14} />;
  const previewField = typeSchema.previewImageField;
  const previewImage = previewField ? block.settings[previewField] : undefined;

  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1, zIndex: isDragging ? 99 : 'auto' }} id={`block-item-${domId}`} className={`overflow-hidden rounded-xl border bg-[#1b1836] transition-all duration-300 ${isExpanded ? 'border-[#ea728c]/50' : 'border-[#ea728c]/20 hover:border-[#ea728c]/40'}`}>
      <div className="flex items-center gap-2 px-3 py-2.5">
        <button type="button" {...attributes} {...listeners} className="shrink-0 cursor-grab text-gray-500 hover:text-white active:cursor-grabbing"><GripVertical size={14} /></button>
        <button type="button" onClick={onToggle} className="flex min-w-0 flex-1 items-center gap-2 text-left">
          {isExpanded ? <ChevronDown size={14} className="shrink-0 text-[#ea728c]" /> : <ChevronRight size={14} className="shrink-0 text-gray-400" />}
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[#24204b] text-[#ea728c]">{icon}</div>
          {typeof previewImage === 'string' && previewImage ? (
            <div className="h-8 w-8 shrink-0 overflow-hidden rounded border border-[#ea728c]/30 bg-black/50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewImage} alt="" className="h-full w-full object-cover" />
            </div>
          ) : null}
          <span className="truncate text-sm font-medium text-gray-200">{title}</span>
        </button>
        <span className="hidden shrink-0 text-[9px] font-bold uppercase tracking-wider text-gray-500 sm:block">{typeSchema.label}</span>
        <button type="button" onClick={onRemove} className="shrink-0 p-1 text-gray-500 transition-colors hover:text-red-400"><Trash2 size={13} /></button>
      </div>

      {isExpanded ? (
        <div className="space-y-4 border-t border-[#ea728c]/15 px-4 pb-4 pt-2">
          {typeSchema.schema.filter((field) => !(viewport === 'desktop' && field.key.startsWith('mobile_')) && !(viewport === 'mobile' && field.key.startsWith('desktop_'))).map((field) => (
            <FieldRenderer
              key={`${block.id}-${field.key}`}
              field={{ ...field, key: `${block.id}__${field.key}` }}
              value={block.settings[field.key] ?? field.default ?? ''}
              onChange={(_, nextValue) => onUpdate({ [field.key]: nextValue })}
              onAutoFill={(updates) => onUpdate(updates)}
              uploadingState={uploadingState}
              setUploadingState={setUploadingState}
              useMediaLibraryForImage={useMediaLibraryForImage}
              imageUploadFolder={imageUploadFolder}
              savedColors={savedColors}
              onRememberColor={onRememberColor}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
