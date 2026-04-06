'use client';

import { useEffect, useState } from 'react';
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import type React from 'react';
import type { BlockInstance, BlockTypeSchema } from '@/types/schema.types';
import type { EditorViewport } from '@/lib/responsive-content';
import { blockIconMap } from './block-icons';
import { SortableBlockItem } from './SortableBlockItem';

type BlocksEditorProps = {
  blockSchemas: BlockTypeSchema[];
  blocks: BlockInstance[];
  focusedBlockId?: string | null;
  focusedBlockIndex?: number | null;
  imageUploadFolder?: string;
  onBlockAdd: (block: BlockInstance) => void;
  onBlockRemove: (index: number) => void;
  onBlockReorder: (oldIndex: number, newIndex: number) => void;
  onBlockUpdate: (index: number, settings: Record<string, unknown>) => void;
  onRememberColor: (colorValue: string) => void;
  savedColors: string[];
  useMediaLibraryForImage?: boolean;
  viewport: EditorViewport;
};

export function BlocksEditor({
  blockSchemas, blocks, focusedBlockId, focusedBlockIndex, imageUploadFolder, onBlockAdd, onBlockRemove, onBlockReorder,
  onBlockUpdate, onRememberColor, savedColors, useMediaLibraryForImage, viewport,
}: BlocksEditorProps) {
  const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(new Set());
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [uploadingState, setUploadingState] = useState<Record<string, boolean>>({});
  const buildBlockItemId = (block: BlockInstance, index: number) => (typeof block.id === 'string' && block.id.trim() ? `block-${block.id.trim()}` : `block-index-${index}`);
  const blockItemIds = blocks.map((block, index) => buildBlockItemId(block, index));

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  useEffect(() => {
    let targetIndex = focusedBlockId ? blocks.findIndex((block) => block.id === focusedBlockId) : -1;
    if (targetIndex === -1 && focusedBlockIndex != null && focusedBlockIndex >= 0 && focusedBlockIndex < blocks.length) targetIndex = focusedBlockIndex;
    if (targetIndex === -1) return;
    const targetItemId = buildBlockItemId(blocks[targetIndex], targetIndex);
    queueMicrotask(() => {
      setExpandedBlocks((previous) => new Set(previous).add(targetItemId));
    });
    setTimeout(() => {
      const element = document.getElementById(`block-item-${targetItemId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('ring-2', 'ring-[#ea728c]', 'bg-[#ea728c]/10');
        setTimeout(() => element.classList.remove('ring-2', 'ring-[#ea728c]', 'bg-[#ea728c]/10'), 1500);
      }
    }, 100);
  }, [blocks, focusedBlockId, focusedBlockIndex]);

  const generateBlockId = (type: string) => {
    const existingIds = new Set(blocks.map((block) => block.id));
    let nextIndex = blocks.filter((block) => block.type === type).length;
    let candidate = `${type}-${nextIndex}`;
    while (existingIds.has(candidate)) candidate = `${type}-${++nextIndex}`;
    return candidate;
  };

  return (
    <div className="space-y-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={({ active, over }: DragEndEvent) => over && active.id !== over.id && onBlockReorder(blockItemIds.indexOf(String(active.id)), blockItemIds.indexOf(String(over.id)))}>
        <SortableContext items={blockItemIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {blocks.map((block, index) => {
              const typeSchema = blockSchemas.find((schema) => schema.type === block.type);
              if (!typeSchema) return null;
              const itemId = buildBlockItemId(block, index);
              const configuredLabel = typeSchema.titleField ? block.settings[typeSchema.titleField] : undefined;
              const title = (typeof configuredLabel === 'string' || typeof configuredLabel === 'number' ? String(configuredLabel) : '') || (block.settings.text as string) || (block.settings.label as string) || (block.settings.alt_text as string) || (block.settings.value as string) || `${typeSchema.label || block.type} ${index + 1}`;
              return (
                <SortableBlockItem
                  key={itemId}
                  id={itemId}
                  domId={itemId}
                  block={block}
                  typeSchema={typeSchema}
                  viewport={viewport}
                  isExpanded={expandedBlocks.has(itemId)}
                  onToggle={() =>
                    setExpandedBlocks((previous) => {
                      const next = new Set(previous);
                      if (next.has(itemId)) next.delete(itemId);
                      else next.add(itemId);
                      return next;
                    })
                  }
                  onRemove={() => confirm(`Delete this ${typeSchema.label}?`) && onBlockRemove(index)}
                  onUpdate={(settings) => onBlockUpdate(index, settings)}
                  title={title}
                  uploadingState={uploadingState}
                  setUploadingState={setUploadingState}
                  useMediaLibraryForImage={useMediaLibraryForImage}
                  imageUploadFolder={imageUploadFolder}
                  savedColors={savedColors}
                  onRememberColor={onRememberColor}
                />
              );
            })}
          </div>
        </SortableContext>
      </DndContext>

      {blocks.length === 0 ? <div className="rounded-xl border-2 border-dashed border-[#ea728c]/20 bg-[#24204b]/30 py-6 text-center"><p className="mb-2 text-sm text-gray-400">No blocks added yet</p><p className="text-xs text-gray-500">Click &quot;Add Block&quot; below to start building this section</p></div> : null}
      <div className="relative">
        <button onClick={() => setIsAddMenuOpen(!isAddMenuOpen)} className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#ea728c]/40 bg-[#ea728c]/10 px-3 py-2.5 text-sm font-semibold text-[#ea728c] transition-all hover:border-solid hover:bg-[#ea728c] hover:text-white"><Plus size={16} />Add Block</button>
        {isAddMenuOpen ? (
          <div className="absolute bottom-full left-0 right-0 z-50 mb-2 overflow-hidden rounded-xl border border-[#ea728c]/30 bg-[#24204b] shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            <div className="border-b border-[#ea728c]/20 bg-[#1b1836] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-300">Available Block Types</div>
            <div className="p-2">
              {blockSchemas.map((typeSchema) => {
                const count = blocks.filter((block) => block.type === typeSchema.type).length;
                const atLimit = typeSchema.limit ? count >= typeSchema.limit : false;
                const icon = blockIconMap[typeSchema.icon || ''] || <Plus size={14} />;
                return (
                  <button
                    key={typeSchema.type}
                    onClick={() => {
                      if (atLimit) {
                        alert(`Maximum ${typeSchema.limit} ${typeSchema.label} blocks allowed`);
                        return;
                      }
                      const newBlock: BlockInstance = { id: generateBlockId(typeSchema.type), type: typeSchema.type, settings: {} };
                      typeSchema.schema.forEach((field) => {
                        if (field.default !== undefined) {
                          newBlock.settings[field.key] = field.default;
                        }
                      });
                      onBlockAdd(newBlock);
                      setIsAddMenuOpen(false);
                      setExpandedBlocks((previous) => new Set(previous).add(buildBlockItemId(newBlock, blocks.length)));
                    }}
                    disabled={atLimit}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${atLimit ? 'cursor-not-allowed opacity-40' : 'text-gray-300 hover:bg-[#ea728c] hover:text-white'}`}
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#1b1836] text-[#ea728c]">{icon}</div>
                    <div className="flex-1">
                      <span className="font-medium">{typeSchema.label}</span>
                      {typeSchema.limit ? <span className="ml-2 text-[10px] opacity-60">{count}/{typeSchema.limit}</span> : null}
                    </div>
                    {atLimit ? <span className="rounded bg-gray-700 px-1.5 py-0.5 text-[9px] font-bold uppercase text-gray-400">Max</span> : null}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
