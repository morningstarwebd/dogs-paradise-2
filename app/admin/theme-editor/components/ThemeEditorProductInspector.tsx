'use client';

import { useCallback, useState, useRef, useEffect } from 'react';
import { AlertCircle, Check, Loader2 } from 'lucide-react';
import { BlockRegistry, getSchemaWithLiquidBg } from '@/components/blocks/registry';
import { SchemaFormBuilder } from '@/components/admin/SchemaFormBuilder';
import type { PageTemplateSettings, ProductTemplateBlock, ProductBlockField } from '@/types/page-template';
import { getProductBlockDefinition, DEFAULT_PRODUCT_BLOCKS } from '@/types/page-template';

/* ── Types ─────────────────────────────────────────────── */

type ProductInspectorProps = {
  templateSettings: PageTemplateSettings | null;
  templateSaveStatus: 'idle' | 'saving' | 'saved' | 'error';
  updateTemplateField: (category: 'layout' | 'sections' | 'styling', key: string, subKey: string | null, value: unknown) => void;
  onBlocksChange: (blocks: ProductTemplateBlock[]) => void;
  selectedBlockId: string | null;
};

/* ── Helpers ───────────────────────────────────────────── */

function isHomepageSectionBlock(block: ProductTemplateBlock): boolean {
  return block.type === 'homepage_section' && Boolean(block.blockRegistryKey);
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

function getBlockSettingValue(block: ProductTemplateBlock, field: ProductBlockField): unknown {
  const def = getProductBlockDefinition(block.type);
  const defaultVal = def?.defaultSettings[field.key] ?? field.default;
  return block.settings[field.key] ?? defaultVal ?? '';
}

/* ── Product Block Settings Form ──────────────────────── */

function ProductBlockSettingsForm({ block, onUpdate }: { block: ProductTemplateBlock; onUpdate: (settings: Record<string, unknown>) => void }) {
  const def = getProductBlockDefinition(block.type);
  if (!def || def.settingsSchema.length === 0) {
    return <div className="px-4 py-6 text-center text-[11px] text-gray-500">No configurable settings for this block.</div>;
  }

  return (
    <div className="space-y-3 p-4">
      {def.settingsSchema.map((field) => {
        const value = getBlockSettingValue(block, field);

        if (field.type === 'toggle') {
          return (
            <div key={field.key} className="flex items-center justify-between">
              <span className="text-[11px] text-gray-400">{field.label}</span>
              <button onClick={() => onUpdate({ ...block.settings, [field.key]: !value })} className={`relative h-5 w-9 rounded-full transition-colors ${value ? 'bg-[#ea728c]' : 'bg-gray-600'}`}>
                <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${value ? 'left-[18px]' : 'left-0.5'}`} />
              </button>
            </div>
          );
        }

        if (field.type === 'select') {
          return (
            <div key={field.key}>
              <label className="mb-1 block text-[10px] uppercase tracking-wider text-gray-400">{field.label}</label>
              <select value={String(value)} onChange={(e) => onUpdate({ ...block.settings, [field.key]: e.target.value })} className="w-full rounded-lg border border-[#ea728c]/20 bg-[#24204b] px-3 py-2 text-xs text-white outline-none focus:border-[#ea728c]">
                {field.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          );
        }

        if (field.type === 'range') {
          return (
            <div key={field.key}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] uppercase tracking-wider text-gray-400">{field.label}</label>
                <span className="text-[10px] font-bold text-[#ea728c]">{String(value)}</span>
              </div>
              <input type="range" min={field.min} max={field.max} step={field.step} value={Number(value)} onChange={(e) => onUpdate({ ...block.settings, [field.key]: Number(e.target.value) })} className="w-full accent-[#ea728c]" />
            </div>
          );
        }

        if (field.type === 'color') {
          return (
            <div key={field.key}>
              <label className="mb-1 block text-[10px] uppercase tracking-wider text-gray-400">{field.label}</label>
              <div className="flex items-center gap-2">
                <input type="color" value={String(value) || '#ffffff'} onChange={(e) => onUpdate({ ...block.settings, [field.key]: e.target.value })} className="h-8 w-8 rounded border border-[#ea728c]/20 bg-transparent cursor-pointer" />
                <input type="text" value={String(value)} onChange={(e) => onUpdate({ ...block.settings, [field.key]: e.target.value })} className="flex-1 rounded-lg border border-[#ea728c]/20 bg-[#24204b] px-3 py-1.5 text-xs text-white outline-none focus:border-[#ea728c]" />
              </div>
            </div>
          );
        }

        if (field.type === 'text') {
          return (
            <div key={field.key}>
              <label className="mb-1 block text-[10px] uppercase tracking-wider text-gray-400">{field.label}</label>
              <input 
                type="text" 
                value={String(value)} 
                placeholder={field.placeholder}
                onChange={(e) => onUpdate({ ...block.settings, [field.key]: e.target.value })} 
                className="w-full rounded-lg border border-[#ea728c]/20 bg-[#24204b] px-3 py-2 text-xs text-white outline-none focus:border-[#ea728c]" 
              />
            </div>
          );
        }

        if (field.type === 'textarea') {
          return (
            <div key={field.key}>
              <label className="mb-1 block text-[10px] uppercase tracking-wider text-gray-400">{field.label}</label>
              <textarea value={String(value)} placeholder={field.placeholder} onChange={(e) => onUpdate({ ...block.settings, [field.key]: e.target.value })} rows={3} className="w-full rounded-lg border border-[#ea728c]/20 bg-[#24204b] px-3 py-2 text-xs text-white outline-none focus:border-[#ea728c] resize-none" />
            </div>
          );
        }

        if (field.type === 'list') {
          const items = Array.isArray(value) ? value : [];
          return (
            <div key={field.key} className="space-y-2">
              <label className="mb-1 block text-[10px] uppercase tracking-wider text-gray-400">{field.label}</label>
              <div className="space-y-2">
                {items.map((item, idx) => (
                  <div key={idx} className="group relative rounded-lg border border-[#ea728c]/10 bg-[#24204b]/50 p-2 pr-8">
                    {typeof item === 'object' ? (
                      <div className="space-y-2">
                        {Object.entries(item as Record<string, string>).map(([k, v]) => (
                          <div key={k}>
                            <p className="mb-1 text-[9px] uppercase text-gray-500">{k}</p>
                            <input 
                              type="text" 
                              value={v} 
                              onChange={(e) => {
                                const newItems = [...items];
                                newItems[idx] = { ...(newItems[idx] as object), [k]: e.target.value };
                                onUpdate({ ...block.settings, [field.key]: newItems });
                              }}
                              className="w-full bg-transparent text-xs text-white outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <input 
                        type="text" 
                        value={String(item)} 
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[idx] = e.target.value;
                          onUpdate({ ...block.settings, [field.key]: newItems });
                        }}
                        className="w-full bg-transparent text-xs text-white outline-none"
                      />
                    )}
                    <button 
                      onClick={() => {
                        onUpdate({ ...block.settings, [field.key]: items.filter((_, i) => i !== idx) });
                      }}
                      className="absolute right-2 top-2 hidden text-red-400 hover:text-red-300 group-hover:block"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => {
                  const firstItem = items[0];
                  let newItem: any = '';
                  if (typeof firstItem === 'object' && firstItem !== null) {
                    newItem = {};
                    Object.keys(firstItem).forEach(k => newItem[k] = '');
                  } else if (field.key === 'faqs') {
                    newItem = { question: '', answer: '' };
                  }
                  onUpdate({ ...block.settings, [field.key]: [...items, newItem] });
                }}
                className="w-full rounded-lg border border-dashed border-[#ea728c]/30 py-2 text-[10px] font-bold uppercase tracking-wider text-[#ea728c] hover:bg-[#ea728c]/10"
              >
                + Add Item
              </button>
            </div>
          );
        }

        return (
          <div key={field.key}>
            <label className="mb-1 block text-[10px] uppercase tracking-wider text-gray-400">{field.label}</label>
            <input type={field.type === 'number' ? 'number' : 'text'} value={String(value)} placeholder={field.placeholder} onChange={(e) => onUpdate({ ...block.settings, [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value })} className="w-full rounded-lg border border-[#ea728c]/20 bg-[#24204b] px-3 py-2 text-xs text-white outline-none focus:border-[#ea728c]" />
          </div>
        );
      })}
    </div>
  );
}

/* ── Homepage Section Settings (SchemaFormBuilder) ─────── */

function HomepageSectionSettingsForm({ block, onUpdate }: { block: ProductTemplateBlock; onUpdate: (settings: Record<string, unknown>) => void }) {
  const regKey = block.blockRegistryKey;
  if (!regKey || !BlockRegistry[regKey]) {
    return <div className="px-4 py-6 text-center text-[11px] text-gray-500">Unknown section type.</div>;
  }

  const registryDef = BlockRegistry[regKey];
  const schema = getSchemaWithLiquidBg(regKey);

  return (
    <div className="p-4">
      <SchemaFormBuilder
        schema={schema}
        values={block.settings}
        onChange={(key, value) => onUpdate({ ...block.settings, [key]: value })}
        viewport="desktop"
        sectionBlockType={regKey}
        blockSchemas={registryDef.blocks || undefined}
        blocks={(block.settings.blocks as any[]) || []}
        onBlockAdd={(subBlock) => {
          const blocks = ((block.settings.blocks as any[]) || []);
          onUpdate({ ...block.settings, blocks: [...blocks, subBlock] });
        }}
        onBlockRemove={(idx) => {
          const blocks = ((block.settings.blocks as any[]) || []);
          onUpdate({ ...block.settings, blocks: blocks.filter((_: unknown, i: number) => i !== idx) });
        }}
        onBlockReorder={(oldIdx, newIdx) => {
          const blocks = [...((block.settings.blocks as any[]) || [])];
          const [moved] = blocks.splice(oldIdx, 1);
          blocks.splice(newIdx, 0, moved);
          onUpdate({ ...block.settings, blocks });
        }}
        onBlockUpdate={(idx, settings) => {
          const blocks = [...((block.settings.blocks as any[]) || [])];
          blocks[idx] = { ...blocks[idx], settings };
          onUpdate({ ...block.settings, blocks });
        }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  MAIN: Right Panel — shows settings for selected block   */
/*  Mirrors ThemeEditorHomeInspector layout                  */
/* ══════════════════════════════════════════════════════════ */

export function ThemeEditorProductInspector({
  templateSettings,
  templateSaveStatus,
  updateTemplateField,
  onBlocksChange,
  selectedBlockId,
}: ProductInspectorProps) {
  const [activeTab, setActiveTab] = useState<'block' | 'global'>('global');

  // Force 'block' tab when a NEW block is selected, but allow switching.
  const prevSelectedId = useRef<string | null>(selectedBlockId);
  useEffect(() => {
    if (selectedBlockId && selectedBlockId !== prevSelectedId.current) {
      setActiveTab('block');
      prevSelectedId.current = selectedBlockId;
    }
  }, [selectedBlockId]);

  if (!selectedBlockId && activeTab === 'block') {
    setActiveTab('global');
  }

  const blocks: ProductTemplateBlock[] = Array.isArray(templateSettings?.sections)
    ? templateSettings.sections
    : DEFAULT_PRODUCT_BLOCKS;

  const selectedBlock = selectedBlockId ? blocks.find((b) => b.id === selectedBlockId) : null;

  const handleUpdateBlock = useCallback((blockId: string, settings: Record<string, unknown>) => {
    onBlocksChange(blocks.map((b) =>
      b.id === blockId ? { ...b, settings } : b
    ));
  }, [blocks, onBlocksChange]);

  if (!templateSettings) {
    return <div className="flex flex-1 items-center justify-center py-8"><Loader2 size={20} className="animate-spin text-[#ea728c]" /></div>;
  }

  return (
    <>
      {/* Header & Tabs */}
      <div className="border-b border-[#ea728c]/20 bg-[#1b1836] p-5 pb-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white">
            {activeTab === 'block' && selectedBlock ? getBlockDisplayLabel(selectedBlock) : 'Template settings'}
          </h2>
          <div className="flex items-center gap-2">
            {templateSaveStatus === 'saving' ? <Loader2 size={14} className="animate-spin text-[#ea728c]" /> : null}
            {templateSaveStatus === 'saved' ? <Check size={14} className="text-green-400" /> : null}
            {templateSaveStatus === 'error' ? <AlertCircle size={14} className="text-red-400" /> : null}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-transparent">
          <button
            onClick={() => setActiveTab('block')}
            disabled={!selectedBlock}
            className={`flex-1 pb-3 text-[10px] font-bold uppercase tracking-widest transition-all ${
              activeTab === 'block'
                ? 'border-b-2 border-[#ea728c] text-white'
                : 'text-gray-500 hover:text-gray-300 disabled:opacity-30 disabled:hover:text-gray-500'
            }`}
          >
            Block Settings
          </button>
          <button
            onClick={() => setActiveTab('global')}
            className={`flex-1 pb-3 text-[10px] font-bold uppercase tracking-widest transition-all ${
              activeTab === 'global'
                ? 'border-b-2 border-[#ea728c] text-white'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Global Setup
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'block' && selectedBlock ? (
          /* ── BLOCK SETTINGS TAB ── */
          <div>
            <div className="px-5 py-4 border-b border-[#ea728c]/10">
              <div className="flex items-center gap-2">
                {isHomepageSectionBlock(selectedBlock) && (
                  <span className="rounded bg-[#ea728c]/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#ea728c]">
                    Homepage Section
                  </span>
                )}
                <p className="text-[11px] text-gray-400">
                  {isHomepageSectionBlock(selectedBlock) 
                    ? `Uses ${BlockRegistry[selectedBlock.blockRegistryKey!]?.label || 'Section'} component` 
                    : 'Configure product block content'}
                </p>
              </div>
            </div>
            {isHomepageSectionBlock(selectedBlock)
              ? <HomepageSectionSettingsForm block={selectedBlock} onUpdate={(settings) => handleUpdateBlock(selectedBlock.id, settings)} />
              : <ProductBlockSettingsForm block={selectedBlock} onUpdate={(settings) => handleUpdateBlock(selectedBlock.id, settings)} />
            }
          </div>
        ) : activeTab === 'global' ? (
          /* ── GLOBAL SETTINGS TAB ── */
          <div className="p-4 space-y-6">
            {/* Layout Settings */}
            <div>
              <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#ea728c]">Template Layout</h3>
              <div className="space-y-3 rounded-lg border border-[#ea728c]/20 bg-[#1b1836] p-3 shadow-lg">
                <div>
                  <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-gray-400">Layout Type</label>
                  <select value={templateSettings.layout?.type ?? 'two-column'} onChange={(e) => updateTemplateField('layout', 'type', null, e.target.value)} className="w-full rounded-lg border border-[#ea728c]/20 bg-[#24204b] px-3 py-2 text-xs text-white outline-none focus:border-[#ea728c]">
                    <option value="two-column">Two Column (Sidebar)</option>
                    <option value="single-column">Single Column (Full Width)</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-gray-400">Gallery Position</label>
                  <select value={templateSettings.layout?.gallery_position ?? 'left'} onChange={(e) => updateTemplateField('layout', 'gallery_position', null, e.target.value)} className="w-full rounded-lg border border-[#ea728c]/20 bg-[#24204b] px-3 py-2 text-xs text-white outline-none focus:border-[#ea728c]">
                    <option value="left">Gallery on Left</option>
                    <option value="right">Gallery on Right</option>
                  </select>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-[11px] text-gray-400">Sticky Details Sidebar</span>
                  <button onClick={() => updateTemplateField('layout', 'sticky_sidebar', null, !(templateSettings.layout?.sticky_sidebar ?? true))} className={`relative h-5 w-9 rounded-full transition-colors ${templateSettings.layout?.sticky_sidebar !== false ? 'bg-[#ea728c]' : 'bg-gray-600'}`}>
                    <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${templateSettings.layout?.sticky_sidebar !== false ? 'left-[18px]' : 'left-0.5'}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Styling Settings */}
            <div>
              <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#ea728c]">Visual Styling</h3>
              <div className="space-y-3 rounded-lg border border-[#ea728c]/20 bg-[#1b1836] p-3 shadow-lg">
                <div>
                  <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-gray-400">Card Design</label>
                  <select value={templateSettings.styling?.card_style ?? 'solid'} onChange={(e) => updateTemplateField('styling', 'card_style', null, e.target.value)} className="w-full rounded-lg border border-[#ea728c]/20 bg-[#24204b] px-3 py-2 text-xs text-white outline-none focus:border-[#ea728c]">
                    <option value="glass">Glassmorphism</option>
                    <option value="solid">Raised Solid</option>
                    <option value="minimal">Flat Minimal</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-gray-400">Brand Accent Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={templateSettings.styling?.accent_color || '#f97316'} onChange={(e) => updateTemplateField('styling', 'accent_color', null, e.target.value)} className="h-8 w-8 rounded border border-[#ea728c]/20 bg-transparent cursor-pointer" />
                    <input type="text" value={templateSettings.styling?.accent_color || '#f97316'} onChange={(e) => updateTemplateField('styling', 'accent_color', null, e.target.value)} className="flex-1 rounded-lg border border-[#ea728c]/20 bg-[#24204b] px-3 py-1.5 text-xs text-white outline-none focus:border-[#ea728c]" />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-gray-400">Page Background Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={templateSettings.styling?.page_bg_color || '#ffffff'} onChange={(e) => updateTemplateField('styling', 'page_bg_color', null, e.target.value)} className="h-8 w-8 rounded border border-[#ea728c]/20 bg-transparent cursor-pointer" />
                    <input type="text" value={templateSettings.styling?.page_bg_color || '#ffffff'} onChange={(e) => updateTemplateField('styling', 'page_bg_color', null, e.target.value)} className="flex-1 rounded-lg border border-[#ea728c]/20 bg-[#24204b] px-3 py-1.5 text-xs text-white outline-none focus:border-[#ea728c]" />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-gray-400">Corner Radius</label>
                  <select value={templateSettings.styling?.border_radius ?? '2xl'} onChange={(e) => updateTemplateField('styling', 'border_radius', null, e.target.value)} className="w-full rounded-lg border border-[#ea728c]/20 bg-[#24204b] px-3 py-2 text-xs text-white outline-none focus:border-[#ea728c]">
                    <option value="none">Sharp Corners</option>
                    <option value="md">Rounded (Small)</option>
                    <option value="xl">Rounded (Medium)</option>
                    <option value="2xl">Rounded (Large)</option>
                    <option value="3xl">Rounded (Full)</option>
                  </select>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-[11px] text-gray-400">Enable Gradients</span>
                  <button onClick={() => updateTemplateField('styling', 'show_gradients', null, !(templateSettings.styling?.show_gradients ?? true))} className={`relative h-5 w-9 rounded-full transition-colors ${templateSettings.styling?.show_gradients !== false ? 'bg-[#ea728c]' : 'bg-gray-600'}`}>
                    <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${templateSettings.styling?.show_gradients !== false ? 'left-[18px]' : 'left-0.5'}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-gray-400 h-full">
            <p className="text-xs">No block selected. Switch to Global tab to edit page layout.</p>
          </div>
        )}
      </div>
    </>
  );
}

