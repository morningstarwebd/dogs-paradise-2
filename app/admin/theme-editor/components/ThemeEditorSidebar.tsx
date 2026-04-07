import { DndContext, type CollisionDetection, type SensorDescriptor, type SensorOptions } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ArrowLeft, Check, AlertCircle, ChevronRight, Eye, Loader2, Plus } from 'lucide-react';
import Link from 'next/link';
import { BlockRegistry } from '@/components/blocks/registry';
import { isFixedWebsiteSection, type SectionData } from '@/types/schema.types';
import type { DragEndEvent } from '@dnd-kit/core';
import type { TemplateEditorTab, TemplateEditorTabId, ThemeEditorPageConfig } from '../theme-editor-config';
import type { ProductTemplateBlock, PageTemplateSettings } from '@/types/page-template';
import { FixedLayoutRow } from './FixedLayoutRow';
import { SortableSectionRow } from './SortableSectionRow';
import { ProductSidebarBlockList } from './ProductSidebarBlockList';

type ThemeEditorSidebarProps = {
  activePage: string;
  activePageData: ThemeEditorPageConfig;
  activeSectionId: string | null;
  activeTemplateSection: TemplateEditorTabId;
  collisionDetection: CollisionDetection;
  editableSections: SectionData[];
  footerSection?: SectionData;
  handleAddSection: (blockKey: string) => void;
  handleDeleteSection: (sectionId: string) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  handlePublishToggle: (sectionId: string, currentStatus: string) => void;
  handleVisibilityToggle: (sectionId: string, visible: boolean) => void;
  headerSection?: SectionData;
  isAddMenuOpen: boolean;
  isHomeEditorPage: boolean;
  isTemplateEditorPage: boolean;
  onSelectSection: (sectionId: string) => void;
  sensors: SensorDescriptor<SensorOptions>[];
  setActiveTemplateSection: (tabId: TemplateEditorTabId) => void;
  setIsAddMenuOpen: (open: boolean) => void;
  tabs: TemplateEditorTab[];
  templateSaveStatus: 'idle' | 'saving' | 'saved' | 'error';
  // Product Template props
  templateSettings?: PageTemplateSettings | null;
  selectedProductBlockId?: string | null;
  onSelectProductBlock?: (blockId: string | null) => void;
  onProductBlocksChange?: (blocks: ProductTemplateBlock[]) => void;
};

export function ThemeEditorSidebar({
  activePage,
  activePageData,
  activeSectionId,
  activeTemplateSection,
  collisionDetection,
  editableSections,
  footerSection,
  handleAddSection,
  handleDeleteSection,
  handleDragEnd,
  handlePublishToggle,
  handleVisibilityToggle,
  headerSection,
  isAddMenuOpen,
  isHomeEditorPage,
  isTemplateEditorPage,
  onSelectSection,
  sensors,
  setActiveTemplateSection,
  setIsAddMenuOpen,
  tabs,
  templateSaveStatus,
  // Product Template
  templateSettings,
  selectedProductBlockId,
  onSelectProductBlock,
  onProductBlocksChange,
}: ThemeEditorSidebarProps) {
  const isProductPage = activePage === 'product';

  return (
    <div className="z-20 flex h-full w-[280px] shrink-0 flex-col border-r border-[#ea728c]/20 bg-[#24204b] shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#ea728c]/20 bg-[#1b1836] p-4">
        <div className="flex items-center gap-3 text-white">
          <Link href="/admin" className="rounded-lg bg-[#24204b] p-1.5 transition-colors hover:bg-[#ea728c]/20"><ArrowLeft size={16} className="text-[#ea728c]" /></Link>
          <div><h2 className="text-sm font-bold tracking-wider">theme editor</h2><p className="text-[10px] font-medium text-gray-400">{activePageData.label}</p></div>
        </div>
      </div>

      {/* ─── HOME PAGE: Section list + Add Block ─────────── */}
      {isHomeEditorPage ? (
        <>
          <div className="custom-scrollbar flex-1 overflow-y-auto px-3 py-4">
            <h3 className="mb-3 pl-1 text-[10px] font-bold uppercase tracking-widest text-[#ea728c]">Homepage Sections</h3>
            <p className="mb-3 pl-1 text-[10px] text-gray-400">Header and Footer are fixed layout areas. Their positions cannot be changed.</p>
            {headerSection ? <FixedLayoutRow section={headerSection} isActive={headerSection.id === activeSectionId} onSelect={() => onSelectSection(headerSection.id)} /> : null}
            <DndContext sensors={sensors} collisionDetection={collisionDetection} onDragEnd={handleDragEnd}>
              <SortableContext items={editableSections.map((section) => section.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-1.5">
                  {editableSections.map((section) => (
                    <SortableSectionRow
                      key={section.id}
                      section={section}
                      isActive={section.id === activeSectionId}
                      onSelect={() => onSelectSection(section.id)}
                      onToggleVisibility={(visible) => handleVisibilityToggle(section.id, visible)}
                      onDelete={() => handleDeleteSection(section.id)}
                      onPublishToggle={() => handlePublishToggle(section.id, section.status)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
            <div className="mt-1.5">{footerSection ? <FixedLayoutRow section={footerSection} isActive={footerSection.id === activeSectionId} onSelect={() => onSelectSection(footerSection.id)} /> : null}</div>
          </div>
          <div className="relative border-t border-[#ea728c]/20 bg-[#1b1836] p-4">
            <button onClick={() => setIsAddMenuOpen(!isAddMenuOpen)} className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#ea728c]/30 bg-[#ea728c]/10 px-3 py-2.5 text-sm font-semibold text-[#ea728c] transition-all hover:bg-[#ea728c] hover:text-white"><Plus size={16} /> Add Block</button>
            {isAddMenuOpen ? (
              <div className="absolute bottom-full left-4 right-4 z-50 mb-2 flex max-h-[350px] flex-col overflow-hidden rounded-xl border border-[#ea728c]/30 bg-[#24204b] shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                <div className="border-b border-[#ea728c]/20 bg-[#1b1836] px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-300">Component Library</div>
                <div className="overflow-y-auto p-2">
                  {Object.keys(BlockRegistry).map((key) => key.startsWith('_') || isFixedWebsiteSection(key) ? null : (
                    <button key={key} onClick={() => handleAddSection(key)} className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm text-gray-300 transition-colors hover:bg-[#ea728c] hover:text-white">
                      <span className="font-medium">{key.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </>
      ) : isProductPage && onProductBlocksChange && onSelectProductBlock ? (
        /* ─── PRODUCT PAGE: Block list + Add Block (same layout!) ─ */
        <ProductSidebarBlockList
          templateSettings={templateSettings}
          selectedBlockId={selectedProductBlockId ?? null}
          onSelectBlock={onSelectProductBlock}
          onBlocksChange={onProductBlocksChange}
          templateSaveStatus={templateSaveStatus}
        />
      ) : (
        /* ─── OTHER TEMPLATE PAGES ───────────────────────── */
        <div className="custom-scrollbar flex-1 overflow-y-auto px-3 py-4">
          <h3 className="mb-3 pl-1 text-[10px] font-bold uppercase tracking-widest text-[#ea728c]">{activePageData.label} Components</h3>
          <div className="space-y-2">
            {activePageData.editable && isTemplateEditorPage ? (
              <>
                <p className="mb-3 pl-1 text-[10px] text-gray-400">Select what to edit in <span className="font-bold text-[#ea728c]">{activePageData.label}</span>.</p>
                {templateSaveStatus !== 'idle' ? (
                  <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${templateSaveStatus === 'saving' ? 'bg-blue-500/10 text-blue-300' : templateSaveStatus === 'saved' ? 'bg-green-500/10 text-green-300' : 'bg-red-500/10 text-red-300'}`}>
                    {templateSaveStatus === 'saving' ? <Loader2 size={12} className="animate-spin" /> : null}
                    {templateSaveStatus === 'saved' ? <Check size={12} /> : null}
                    {templateSaveStatus === 'error' ? <AlertCircle size={12} /> : null}
                    <span>{templateSaveStatus === 'saving' ? 'Saving...' : templateSaveStatus === 'saved' ? 'Saved!' : 'Error saving'}</span>
                  </div>
                ) : null}
                <div className="space-y-1.5">
                  {tabs.map((tab) => {
                    const isActive = activeTemplateSection === tab.id;
                    return (
                      <button key={tab.id} onClick={() => setActiveTemplateSection(tab.id)} className={`w-full rounded-lg border p-2.5 text-left transition-all ${isActive ? 'border-[#ea728c] bg-[#ea728c]/20 shadow-[inset_4px_0_0_#ea728c]' : 'border-transparent bg-[#1b1836] hover:border-[#ea728c]/30'}`}>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2"><tab.icon size={13} className={isActive ? 'text-white' : 'text-[#ea728c]'} /><span className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-gray-300'}`}>{tab.title}</span></div>
                          <ChevronRight size={13} className={isActive ? 'text-white' : 'text-gray-500'} />
                        </div>
                        <p className={`mt-1 text-[10px] ${isActive ? 'text-white/80' : 'text-gray-500'}`}>{tab.description}</p>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 border-t border-[#ea728c]/10 pt-3"><p className="text-center text-[10px] italic text-gray-500">Header and Footer stay synced from Home page.</p></div>
              </>
            ) : activePageData.editable ? (
              <div className="flex items-center justify-center py-8"><Loader2 size={20} className="animate-spin text-[#ea728c]" /></div>
            ) : (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#1b1836]"><Eye size={24} className="text-gray-500" /></div>
                <h4 className="mb-2 text-sm font-bold text-white">Preview Only</h4>
                <p className="mx-auto max-w-[200px] text-[11px] text-gray-400">This page uses static content. Visit the preview to see how it looks.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
