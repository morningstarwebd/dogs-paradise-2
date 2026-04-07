'use client';

import { useMemo, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { type EditorViewport } from '@/lib/responsive-content';
import { useEditorStore } from '@/store/editor-store';
import { ThemeEditorHomeInspector } from './components/ThemeEditorHomeInspector';
import { ThemeEditorPreviewPane } from './components/ThemeEditorPreviewPane';
import { ThemeEditorSidebar } from './components/ThemeEditorSidebar';
import { ThemeEditorTemplateInspector } from './components/ThemeEditorTemplateInspector';
import { TEMPLATE_EDITOR_TABS, THEME_EDITOR_PAGES, type TemplateEditorTabId, isTemplatePage } from './theme-editor-config';
import { getThemeEditorDerivedState } from './theme-editor-derived';
import { useThemeEditorPreview } from './use-theme-editor-preview';
import { useThemeEditorSectionContent } from './use-theme-editor-section-content';
import { useThemeEditorSectionListActions } from './use-theme-editor-section-list-actions';
import { useThemeEditorSectionsLoad } from './use-theme-editor-sections-load';
import { useThemeEditorTemplate } from './use-theme-editor-template';

export default function ThemeEditorPage() {
  const { sections, activeSectionId, saveStatus, setSections, setActiveSection, setActiveBlock, updateSectionContent, updateSectionVisibility, removeSection, setSaveStatus, addBlock, removeBlock, reorderBlocks, updateBlockSettings } = useEditorStore();
  const [loading, setLoading] = useState(true);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
  const [focusedBlockIndex, setFocusedBlockIndex] = useState<number | null>(null);
  const [viewport, setViewport] = useState<EditorViewport>('desktop');
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState('home');
  const [isPageSelectorOpen, setIsPageSelectorOpen] = useState(false);
  const [activeTemplateSection, setActiveTemplateSection] = useState<TemplateEditorTabId>('sections');
  const [selectedProductBlockId, setSelectedProductBlockId] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const supabase = useMemo(() => createClient(), []);

  const activePageData = THEME_EDITOR_PAGES.find((page) => page.id === activePage) || THEME_EDITOR_PAGES[0];
  const isHomeEditorPage = activePage === 'home';
  const isTemplateEditorPage = isTemplatePage(activePage);
  const activeTemplateTab = TEMPLATE_EDITOR_TABS.find((tab) => tab.id === activeTemplateSection) || TEMPLATE_EDITOR_TABS[0];

  useThemeEditorSectionsLoad({ activeSectionId, setActiveSection, setLoading, setSections, supabase });

  const { templateSaveStatus, templateSettings, updateTemplateField, handleProductBlocksChange } = useThemeEditorTemplate({
    activePage,
    iframeRef,
  });

  const { applyRequestedContentUpdate, handleBlockAdd, handleBlockRemove, handleBlockReorder, handleBlockUpdate, handleContentChange } = useThemeEditorSectionContent({
    addBlock,
    iframeRef,
    removeBlock,
    reorderBlocks,
    setSaveStatus,
    updateBlockSettings,
    updateSectionContent,
    viewport,
  });

  const { collisionDetection, handleAddSection, handleDeleteSection, handleDragEnd, handlePublishToggle, handleVisibilityToggle, sensors } = useThemeEditorSectionListActions({
    sections,
    setActiveSection,
    setIsAddMenuOpen,
    setSaveStatus,
    setSections,
    updateSectionVisibility,
    removeSection,
  });

  const derived = useMemo(
    () => getThemeEditorDerivedState(sections, activeSectionId, viewport),
    [sections, activeSectionId, viewport]
  );

  const { syncIframePreviewState } = useThemeEditorPreview({
    applyRequestedContentUpdate,
    iframeRef,
    isHomeEditorPage,
    loading,
    sections,
    setActiveBlock,
    setActiveSection,
    setFocusedBlockId,
    setFocusedBlockIndex,
    setFocusedField,
    viewport,
  });

  const handleSelectPage = (pageId: string) => {
    const nextPage = THEME_EDITOR_PAGES.find((page) => page.id === pageId);
    setActivePage(pageId);
    setActiveTemplateSection('sections');
    setIsPageSelectorOpen(false);
    if (iframeRef.current && nextPage) {
      iframeRef.current.src = nextPage.previewUrl;
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#302b63]">
        <Loader2 className="animate-spin text-[#ea728c]" size={40} />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#302b63] font-sans">
      <ThemeEditorSidebar
        activePage={activePage}
        activePageData={activePageData}
        activeSectionId={activeSectionId}
        activeTemplateSection={activeTemplateSection}
        collisionDetection={collisionDetection}
        editableSections={derived.editableSections}
        footerSection={derived.footerSection}
        handleAddSection={handleAddSection}
        handleDeleteSection={handleDeleteSection}
        handleDragEnd={handleDragEnd}
        handlePublishToggle={handlePublishToggle}
        handleVisibilityToggle={handleVisibilityToggle}
        headerSection={derived.headerSection}
        isAddMenuOpen={isAddMenuOpen}
        isHomeEditorPage={isHomeEditorPage}
        isTemplateEditorPage={isTemplateEditorPage}
        onSelectSection={(sectionId) => setActiveSection(sectionId)}
        sensors={sensors}
        setActiveTemplateSection={setActiveTemplateSection}
        setIsAddMenuOpen={setIsAddMenuOpen}
        tabs={TEMPLATE_EDITOR_TABS}
        templateSaveStatus={templateSaveStatus}
        // Product Template
        templateSettings={templateSettings}
        selectedProductBlockId={selectedProductBlockId}
        onSelectProductBlock={setSelectedProductBlockId}
        onProductBlocksChange={handleProductBlocksChange}
      />

      <ThemeEditorPreviewPane
        activePage={activePage}
        activePageData={activePageData}
        iframeRef={iframeRef}
        isPageSelectorOpen={isPageSelectorOpen}
        onLoad={syncIframePreviewState}
        onSelectPage={handleSelectPage}
        pages={THEME_EDITOR_PAGES}
        setIsPageSelectorOpen={setIsPageSelectorOpen}
        setViewport={setViewport}
        viewport={viewport}
      />

      <div className="flex w-[360px] shrink-0 flex-col border-l border-[#ea728c]/20 bg-[#24204b] shadow-[-10px_0_30px_rgba(0,0,0,0.2)]">
        {isHomeEditorPage ? (
          <ThemeEditorHomeInspector
            activeBlockSchemas={derived.activeBlockSchemas}
            activeBlockType={derived.activeBlockType}
            activeBlocks={derived.activeBlocks}
            activeSection={derived.activeSection}
            activeValues={derived.activeValues as Record<string, unknown>}
            editorSchema={derived.editorSchema}
            focusedBlockId={focusedBlockId}
            focusedBlockIndex={focusedBlockIndex}
            focusedField={focusedField}
            handleBlockAdd={handleBlockAdd}
            handleBlockRemove={handleBlockRemove}
            handleBlockReorder={handleBlockReorder}
            handleBlockUpdate={handleBlockUpdate}
            handleContentChange={handleContentChange}
            saveStatus={saveStatus}
            viewport={viewport}
          />
        ) : (
          <ThemeEditorTemplateInspector
            activePageData={activePageData}
            activeTemplateSection={activeTemplateSection}
            activeTemplateTab={activeTemplateTab}
            isTemplateEditorPage={isTemplateEditorPage}
            templateSaveStatus={templateSaveStatus}
            templateSettings={templateSettings}
            updateTemplateField={updateTemplateField}
            onProductBlocksChange={handleProductBlocksChange}
            selectedProductBlockId={selectedProductBlockId}
          />
        )}
      </div>
    </div>
  );
}
