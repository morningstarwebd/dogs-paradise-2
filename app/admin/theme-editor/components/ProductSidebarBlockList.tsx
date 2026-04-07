import { useState, useCallback } from 'react';
import {
  DndContext, closestCenter,
  KeyboardSensor, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy,
  useSortable, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Eye, EyeOff, GripVertical, Pencil, Plus, Trash2, X } from 'lucide-react';
import { BlockRegistry } from '@/components/blocks/registry';
import type { ProductTemplateBlock } from '@/types/page-template';
import { PRODUCT_BLOCK_REGISTRY, getProductBlockDefinition, DEFAULT_PRODUCT_BLOCKS, HOMEPAGE_SECTION_KEYS } from '@/types/page-template';

/* ── Helpers ───────────────────────────────────────────── */

function generateBlockId(type: string): string {
  return `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function getBlockDisplayLabel(block: ProductTemplateBlock): string {
  if (block.label) return block.label;
  if (block.type === 'homepage_section' && block.blockRegistryKey) {
    const regDef = BlockRegistry[block.blockRegistryKey];
    return regDef?.label || block.blockRegistryKey.replace(/-/g, ' ');
  }
  const def = getProductBlockDefinition(block.type);
  return def?.label || block.type.replace(/_/g, ' ');
}

function isHomepageSectionBlock(block: ProductTemplateBlock): boolean {
  return block.type === 'homepage_section' && Boolean(block.blockRegistryKey);
}

/* ── Sortable Block Row (same style as SortableSectionRow) ─ */

function SortableProductBlockRow({
  block,
  isActive,
  isEditingLabel,
  onSelect,
  onToggleVisible,
  onRemove,
  onStartEditLabel,
  onSaveLabel,
}: {
  block: ProductTemplateBlock;
  isActive: boolean;
  isEditingLabel: boolean;
  onSelect: () => void;
  onToggleVisible: () => void;
  onRemove: () => void;
  onStartEditLabel: () => void;
  onSaveLabel: (label: string) => void;
}) {
  const displayLabel = getBlockDisplayLabel(block);
  const isHomepage = isHomepageSectionBlock(block);
  const {
    attributes, listeners, setNodeRef, transform, transition, isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 99 : 'auto' as const,
  };

  const blockCount = Array.isArray(block.settings.blocks) ? block.settings.blocks.length : 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`group flex cursor-pointer items-center gap-2 rounded-lg border p-2.5 transition-all ${
        isActive
          ? 'border-[#ea728c] bg-[#ea728c]/20 shadow-[inset_4px_0_0_#ea728c]'
          : 'border-transparent bg-[#1b1836] hover:border-[#ea728c]/30'
      }`}
    >
      <button {...attributes} {...listeners} className="cursor-grab text-gray-500 hover:text-white active:cursor-grabbing" onClick={(e) => e.stopPropagation()}>
        <GripVertical size={14} />
      </button>
      <div className="flex flex-1 items-center gap-2 truncate min-w-0">
        {isHomepage && (
          <span className="shrink-0 rounded bg-[#ea728c]/20 px-1 py-0.5 text-[7px] font-bold uppercase tracking-wider text-[#ea728c]">
            Section
          </span>
        )}
        {isEditingLabel ? (
          <input
            autoFocus
            defaultValue={block.label || displayLabel}
            onClick={(e) => e.stopPropagation()}
            onBlur={(e) => onSaveLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { onSaveLabel((e.target as HTMLInputElement).value); }
              if (e.key === 'Escape') { onSaveLabel(block.label || ''); }
            }}
            className="flex-1 rounded border border-[#ea728c] bg-[#24204b] px-2 py-0.5 text-xs text-white outline-none min-w-0"
          />
        ) : (
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className={`truncate text-sm font-semibold ${isActive ? 'text-white' : block.visible ? 'text-gray-300' : 'text-gray-500 line-through'}`}>
              {displayLabel}
            </span>
            {isHomepage && blockCount > 0 && (
              <span className="rounded bg-[#ea728c]/20 px-1.5 py-0.5 text-[9px] font-bold text-[#ea728c]">
                {blockCount}
              </span>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={(e) => { e.stopPropagation(); onStartEditLabel(); }}
          className="rounded p-1 text-gray-400 hover:bg-black/20 hover:text-white"
          title="Rename"
        >
          <Pencil size={10} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleVisible(); }}
          className={`rounded p-1 hover:bg-black/20 ${block.visible ? 'text-gray-400 hover:text-white' : 'text-red-400'}`}
          title={block.visible ? 'Hide' : 'Show'}
        >
          {block.visible ? <Eye size={12} /> : <EyeOff size={12} />}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="rounded p-1 text-gray-400 hover:bg-red-500/10 hover:text-red-500"
          title="Remove"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}

/* ── Add Block Menu ────────────────────────────────────── */

function AddBlockMenu({
  existingBlocks,
  onAddProductBlock,
  onAddHomepageSection,
  onClose,
}: {
  existingBlocks: ProductTemplateBlock[];
  onAddProductBlock: (type: string) => void;
  onAddHomepageSection: (registryKey: string) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<'product' | 'sections'>('product');

  return (
    <div className="absolute bottom-full left-0 right-0 z-50 mb-2 flex max-h-[400px] flex-col overflow-hidden rounded-xl border border-[#ea728c]/30 bg-[#24204b] shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between border-b border-[#ea728c]/20 bg-[#1b1836] px-3 py-2">
        <div className="flex rounded-lg border border-[#ea728c]/20 bg-[#24204b] p-0.5">
          <button onClick={() => setTab('product')} className={`rounded px-3 py-1 text-[9px] font-bold uppercase tracking-wider transition-colors ${tab === 'product' ? 'bg-[#ea728c] text-white' : 'text-gray-400 hover:text-white'}`}>
            Product Blocks
          </button>
          <button onClick={() => setTab('sections')} className={`rounded px-3 py-1 text-[9px] font-bold uppercase tracking-wider transition-colors ${tab === 'sections' ? 'bg-[#ea728c] text-white' : 'text-gray-400 hover:text-white'}`}>
            Homepage Sections
          </button>
        </div>
        <button onClick={onClose} className="rounded p-1 text-gray-400 hover:text-white"><X size={14} /></button>
      </div>
      <div className="overflow-y-auto p-2 custom-scrollbar">
        {tab === 'product' && PRODUCT_BLOCK_REGISTRY.map((def) => {
          const existingCount = existingBlocks.filter((b) => b.type === def.type).length;
          const isLimitReached = def.maxInstances != null && existingCount >= def.maxInstances;
          return (
            <button
              key={def.type}
              disabled={isLimitReached}
              onClick={() => onAddProductBlock(def.type)}
              className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm text-gray-300 transition-colors ${isLimitReached ? 'cursor-not-allowed opacity-40' : 'hover:bg-[#ea728c] hover:text-white'}`}
            >
              <span className="font-medium">{def.label}</span>
              {isLimitReached && <span className="text-[8px] font-bold uppercase text-gray-500">Max</span>}
            </button>
          );
        })}
        {tab === 'sections' && HOMEPAGE_SECTION_KEYS.map((key) => {
          const regDef = BlockRegistry[key];
          if (!regDef) return null;
          return (
            <button
              key={key}
              onClick={() => onAddHomepageSection(key)}
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm text-gray-300 transition-colors hover:bg-[#ea728c] hover:text-white"
            >
              <span className="font-medium">{regDef.label}</span>
              <span className="rounded bg-[#ea728c]/20 px-1.5 py-0.5 text-[8px] font-bold uppercase text-[#ea728c]">Section</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  MAIN: Product Block Sidebar                              */
/*  This mirrors the homepage section list in the LEFT panel */
/* ══════════════════════════════════════════════════════════ */

export type ProductSidebarBlockListProps = {
  templateSettings: { sections?: ProductTemplateBlock[] } | null | undefined;
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string | null) => void;
  onBlocksChange: (blocks: ProductTemplateBlock[]) => void;
  templateSaveStatus: 'idle' | 'saving' | 'saved' | 'error';
};

export function ProductSidebarBlockList({
  templateSettings,
  selectedBlockId,
  onSelectBlock,
  onBlocksChange,
  templateSaveStatus,
}: ProductSidebarBlockListProps) {
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [editingLabelId, setEditingLabelId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const blocks: ProductTemplateBlock[] = Array.isArray(templateSettings?.sections)
    ? templateSettings.sections
    : DEFAULT_PRODUCT_BLOCKS;

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = blocks.findIndex((b) => b.id === active.id);
    const newIndex = blocks.findIndex((b) => b.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    onBlocksChange(arrayMove(blocks, oldIndex, newIndex));
  }, [blocks, onBlocksChange]);

  const handleAddProductBlock = useCallback((type: string) => {
    const newBlock: ProductTemplateBlock = {
      id: generateBlockId(type),
      type: type as ProductTemplateBlock['type'],
      visible: true,
      settings: {},
    };
    onBlocksChange([...blocks, newBlock]);
    setIsAddMenuOpen(false);
    onSelectBlock(newBlock.id);
  }, [blocks, onBlocksChange, onSelectBlock]);

  const handleAddHomepageSection = useCallback((registryKey: string) => {
    const regDef = BlockRegistry[registryKey];
    const newBlock: ProductTemplateBlock = {
      id: generateBlockId(`section-${registryKey}`),
      type: 'homepage_section',
      blockRegistryKey: registryKey,
      visible: true,
      label: regDef?.label || registryKey,
      settings: {},
    };
    onBlocksChange([...blocks, newBlock]);
    setIsAddMenuOpen(false);
    onSelectBlock(newBlock.id);
  }, [blocks, onBlocksChange, onSelectBlock]);

  const handleRemoveBlock = useCallback((blockId: string) => {
    onBlocksChange(blocks.filter((b) => b.id !== blockId));
    if (selectedBlockId === blockId) onSelectBlock(null);
  }, [blocks, selectedBlockId, onBlocksChange, onSelectBlock]);

  const handleToggleVisible = useCallback((blockId: string) => {
    onBlocksChange(blocks.map((b) =>
      b.id === blockId ? { ...b, visible: !b.visible } : b
    ));
  }, [blocks, onBlocksChange]);

  const handleSaveLabel = useCallback((blockId: string, label: string) => {
    const trimmed = label.trim();
    onBlocksChange(blocks.map((b) =>
      b.id === blockId ? { ...b, label: trimmed || undefined } : b
    ));
    setEditingLabelId(null);
  }, [blocks, onBlocksChange]);

  return (
    <>
      {/* Block list (scrollable area) */}
      <div className="custom-scrollbar flex-1 overflow-y-auto px-3 py-4">
        <h3 className="mb-3 pl-1 text-[10px] font-bold uppercase tracking-widest text-[#ea728c]">Product Template Blocks</h3>
        <p className="mb-3 pl-1 text-[10px] text-gray-400">Drag to reorder. Click to edit settings on the right panel.</p>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-1.5">
              {blocks.map((block) => (
                <SortableProductBlockRow
                  key={block.id}
                  block={block}
                  isActive={selectedBlockId === block.id}
                  isEditingLabel={editingLabelId === block.id}
                  onSelect={() => onSelectBlock(block.id)}
                  onToggleVisible={() => handleToggleVisible(block.id)}
                  onRemove={() => handleRemoveBlock(block.id)}
                  onStartEditLabel={() => setEditingLabelId(block.id)}
                  onSaveLabel={(label) => handleSaveLabel(block.id, label)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <div className="mt-4 border-t border-[#ea728c]/10 pt-3">
          <p className="text-center text-[10px] italic text-gray-500">All breeds share this template. Changes apply globally.</p>
        </div>
      </div>

      {/* Add Block button (sticky bottom, same as homepage) */}
      <div className="relative border-t border-[#ea728c]/20 bg-[#1b1836] p-4">
        <button
          onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#ea728c]/30 bg-[#ea728c]/10 px-3 py-2.5 text-sm font-semibold text-[#ea728c] transition-all hover:bg-[#ea728c] hover:text-white"
        >
          <Plus size={16} /> Add Block
        </button>
        {isAddMenuOpen && (
          <AddBlockMenu
            existingBlocks={blocks}
            onAddProductBlock={handleAddProductBlock}
            onAddHomepageSection={handleAddHomepageSection}
            onClose={() => setIsAddMenuOpen(false)}
          />
        )}
      </div>
    </>
  );
}

export { getBlockDisplayLabel, isHomepageSectionBlock, getProductBlockDefinition };
