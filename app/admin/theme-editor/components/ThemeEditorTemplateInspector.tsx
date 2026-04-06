import { AlertCircle, Check, Eye, Loader2 } from 'lucide-react';
import type { PageTemplateSettings } from '@/types/page-template';
import type { TemplateEditorTab, TemplateEditorTabId, ThemeEditorPageConfig } from '../theme-editor-config';
import { TemplateCharacteristicsControls } from './TemplateCharacteristicsControls';
import { TemplateGalleryControls } from './TemplateGalleryControls';
import { TemplateLayoutControls } from './TemplateLayoutControls';
import { TemplateSectionsControls } from './TemplateSectionsControls';
import { TemplateStylingControls } from './TemplateStylingControls';

type ThemeEditorTemplateInspectorProps = {
  activePageData: ThemeEditorPageConfig;
  activeTemplateSection: TemplateEditorTabId;
  activeTemplateTab: TemplateEditorTab;
  isTemplateEditorPage: boolean;
  templateSaveStatus: 'idle' | 'saving' | 'saved' | 'error';
  templateSettings: PageTemplateSettings | null;
  updateTemplateField: (category: 'layout' | 'sections' | 'styling', key: string, subKey: string | null, value: unknown) => void;
};

export function ThemeEditorTemplateInspector({
  activePageData,
  activeTemplateSection,
  activeTemplateTab,
  isTemplateEditorPage,
  templateSaveStatus,
  templateSettings,
  updateTemplateField,
}: ThemeEditorTemplateInspectorProps) {
  if (!activePageData.editable || !isTemplateEditorPage) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-gray-400">
        <Eye size={36} className="mb-3 text-[#ea728c]/60" />
        <h3 className="mb-2 text-sm font-bold text-white">Preview Only</h3>
        <p className="text-xs max-w-[250px]">This page is currently view-only in theme editor.</p>
      </div>
    );
  }

  return (
    <>
      <div className="border-b border-[#ea728c]/20 bg-[#1b1836] p-5">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-base font-bold text-white">{activeTemplateTab.title}</h2>
          <div className="flex items-center gap-2">
            {templateSaveStatus === 'saving' ? <Loader2 size={16} className="animate-spin text-[#ea728c]" /> : null}
            {templateSaveStatus === 'saved' ? <Check size={16} className="text-green-400" /> : null}
            {templateSaveStatus === 'error' ? <AlertCircle size={16} className="text-red-400" /> : null}
          </div>
        </div>
        <p className="text-[11px] text-gray-400">{activeTemplateTab.description}</p>
      </div>
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
        {templateSettings ? (
          <div className="space-y-4">
            {activeTemplateSection === 'sections' ? <TemplateSectionsControls settings={templateSettings} updateTemplateField={updateTemplateField} /> : null}
            {activeTemplateSection === 'layout' ? <TemplateLayoutControls settings={templateSettings} updateTemplateField={updateTemplateField} /> : null}
            {activeTemplateSection === 'styling' ? <TemplateStylingControls settings={templateSettings} updateTemplateField={updateTemplateField} /> : null}
            {activeTemplateSection === 'gallery' ? <TemplateGalleryControls settings={templateSettings} updateTemplateField={updateTemplateField} /> : null}
            {activeTemplateSection === 'characteristics' ? <TemplateCharacteristicsControls settings={templateSettings} updateTemplateField={updateTemplateField} /> : null}
            <div className="border-t border-[#ea728c]/10 pt-3"><p className="text-center text-[10px] italic text-gray-500">Changes apply to all template pages instantly.</p></div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-8"><Loader2 size={20} className="animate-spin text-[#ea728c]" /></div>
        )}
      </div>
    </>
  );
}
