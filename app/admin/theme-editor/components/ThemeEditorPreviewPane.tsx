import { ChevronDown, Monitor, Smartphone } from 'lucide-react';
import type { RefObject } from 'react';
import type { EditorViewport } from '@/lib/responsive-content';
import type { ThemeEditorPageConfig } from '../theme-editor-config';
import { shouldShowTemplateBadge } from '../theme-editor-config';

type ThemeEditorPreviewPaneProps = {
  activePage: string;
  activePageData: ThemeEditorPageConfig;
  iframeRef: RefObject<HTMLIFrameElement | null>;
  isPageSelectorOpen: boolean;
  onLoad: () => void;
  onSelectPage: (pageId: string) => void;
  setIsPageSelectorOpen: (open: boolean) => void;
  setViewport: (viewport: EditorViewport) => void;
  pages: ThemeEditorPageConfig[];
  viewport: EditorViewport;
};

export function ThemeEditorPreviewPane({
  activePage,
  activePageData,
  iframeRef,
  isPageSelectorOpen,
  onLoad,
  onSelectPage,
  pages,
  setIsPageSelectorOpen,
  setViewport,
  viewport,
}: ThemeEditorPreviewPaneProps) {
  return (
    <div className="relative z-10 flex flex-1 flex-col overflow-hidden bg-[#1b1836]">
      <div className="flex h-14 items-center justify-between border-b border-[#ea728c]/20 bg-[#24204b] px-6">
        <div className="relative">
          <button onClick={() => setIsPageSelectorOpen(!isPageSelectorOpen)} className="flex items-center gap-3 rounded-lg border border-[#ea728c]/30 bg-[#1b1836] px-4 py-2 transition-colors hover:border-[#ea728c]">
            <activePageData.icon size={16} className="text-[#ea728c]" />
            <span className="text-sm font-semibold text-white">{activePageData.label}</span>
            {shouldShowTemplateBadge(activePageData.label, activePageData.isTemplate) ? <span className="rounded bg-[#ea728c]/20 px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#ea728c]">Template</span> : null}
            <ChevronDown size={14} className={`text-gray-400 transition-transform ${isPageSelectorOpen ? 'rotate-180' : ''}`} />
          </button>
          {isPageSelectorOpen ? (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsPageSelectorOpen(false)} />
              <div className="absolute left-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border border-[#ea728c]/30 bg-[#24204b] shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                <div className="border-b border-[#ea728c]/20 bg-[#1b1836] px-4 py-3"><p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Select Page to Edit</p></div>
                <div className="max-h-[300px] overflow-y-auto p-2">
                  {pages.map((page) => (
                    <button key={page.id} onClick={() => onSelectPage(page.id)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${activePage === page.id ? 'bg-[#ea728c] text-white' : 'text-gray-300 hover:bg-[#ea728c]/20'}`}>
                      <page.icon size={16} className={activePage === page.id ? 'text-white' : 'text-[#ea728c]'} />
                      <div className="flex-1">
                        <span className="text-sm font-medium">{page.label}</span>
                        {shouldShowTemplateBadge(page.label, page.isTemplate) ? <span className={`ml-2 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${activePage === page.id ? 'bg-white/20 text-white' : 'bg-[#ea728c]/20 text-[#ea728c]'}`}>Template</span> : null}
                      </div>
                      {!page.editable ? <span className="text-[9px] italic text-gray-500">View Only</span> : null}
                    </button>
                  ))}
                </div>
                <div className="border-t border-[#ea728c]/20 bg-[#1b1836] px-4 py-2"><p className="text-[10px] text-gray-400"><span className="font-bold text-[#ea728c]">Templates</span> apply to all pages of that type</p></div>
              </div>
            </>
          ) : null}
        </div>

        <div className="flex items-center gap-4">
          <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ea728c] opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-[#ea728c]" /></span>
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-300">Live Sync</span>
        </div>

        <div className="flex rounded-lg border border-[#ea728c]/20 bg-[#1b1836] p-1">
          <button onClick={() => setViewport('desktop')} className={`flex items-center gap-2 rounded px-4 py-1.5 text-xs font-bold transition-colors ${viewport === 'desktop' ? 'bg-[#ea728c] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}><Monitor size={14} /> Desktop</button>
          <button onClick={() => setViewport('mobile')} className={`flex items-center gap-2 rounded px-4 py-1.5 text-xs font-bold transition-colors ${viewport === 'mobile' ? 'bg-[#ea728c] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}><Smartphone size={14} /> Mobile</button>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center overflow-hidden p-6">
        <div className={`relative h-full overflow-hidden rounded-2xl border-4 border-[#24204b] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-all duration-500 ease-in-out ${viewport === 'mobile' ? 'w-[400px]' : 'w-full'}`}>
          <iframe ref={iframeRef} src={activePageData.previewUrl} onLoad={onLoad} className="h-full w-full border-none" title="Live Edit" />
        </div>
      </div>
    </div>
  );
}
