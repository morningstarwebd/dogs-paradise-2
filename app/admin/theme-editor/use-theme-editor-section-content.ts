'use client';

import { useCallback, useRef } from 'react';
import { saveSectionContent } from '@/actions/sections';
import { updateViewportFieldsWithSync, type EditorViewport } from '@/lib/responsive-content';
import { useEditorStore } from '@/store/editor-store';
import type { BlockInstance } from '@/types/schema.types';

type UseThemeEditorSectionContentOptions = {
  addBlock: (sectionId: string, block: BlockInstance, viewport: EditorViewport) => void;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  removeBlock: (sectionId: string, blockIndex: number, viewport: EditorViewport) => void;
  reorderBlocks: (sectionId: string, oldIndex: number, newIndex: number, viewport: EditorViewport) => void;
  setSaveStatus: (status: 'idle' | 'saving' | 'saved' | 'error') => void;
  updateBlockSettings: (sectionId: string, blockIndex: number, settings: Record<string, unknown>, viewport: EditorViewport) => void;
  updateSectionContent: (id: string, content: Record<string, unknown>) => void;
  viewport: EditorViewport;
};

export function useThemeEditorSectionContent({
  addBlock,
  iframeRef,
  removeBlock,
  reorderBlocks,
  setSaveStatus,
  updateBlockSettings,
  updateSectionContent,
  viewport,
}: UseThemeEditorSectionContentOptions) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveSection = useCallback(
    async (sectionId: string, content: Record<string, unknown>) => {
      setSaveStatus('saving');
      const result = await saveSectionContent(sectionId, content);
      if (!result.success) {
        setSaveStatus('error');
      } else {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    },
    [setSaveStatus]
  );

  const schedulePersistedSave = useCallback(
    (sectionId: string, delayMs: number) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const section = useEditorStore.getState().sections.find((item) => item.id === sectionId);
        if (section) {
          void saveSection(sectionId, section.content as Record<string, unknown>);
        }
      }, delayMs);
    },
    [saveSection]
  );

  const applyRequestedContentUpdate = useCallback(
    (sectionId: string, updates: Record<string, unknown>) => {
      const store = useEditorStore.getState();
      const section = store.sections.find((item) => item.id === sectionId);
      if (!section) return;
      const merged = updateViewportFieldsWithSync((section.content || {}) as Record<string, unknown>, viewport, updates);
      store.updateSectionContent(sectionId, merged);
      void saveSection(sectionId, merged);
    },
    [saveSection, viewport]
  );

  const handleContentChange = useCallback(
    (sectionId: string, key: string, value: unknown) => {
      const section = useEditorStore.getState().sections.find((item) => item.id === sectionId);
      if (!section) return;
      const nextContent = updateViewportFieldsWithSync((section.content || {}) as Record<string, unknown>, viewport, { [key]: value });
      updateSectionContent(sectionId, nextContent);
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_SECTION_CONTENT_PARTIAL', sectionId, partialContent: { [key]: value }, viewport }, window.location.origin);
      }
      schedulePersistedSave(sectionId, 800);
    },
    [iframeRef, schedulePersistedSave, updateSectionContent, viewport]
  );

  const broadcastBlocksPreview = useCallback(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'LIVE_PREVIEW_UPDATE', sections: useEditorStore.getState().sections, viewport },
        window.location.origin
      );
    }
  }, [iframeRef, viewport]);

  const handleBlockAdd = useCallback((sectionId: string, block: BlockInstance) => {
    addBlock(sectionId, block, viewport);
    broadcastBlocksPreview();
    schedulePersistedSave(sectionId, 300);
  }, [addBlock, broadcastBlocksPreview, schedulePersistedSave, viewport]);

  const handleBlockRemove = useCallback((sectionId: string, blockIndex: number) => {
    removeBlock(sectionId, blockIndex, viewport);
    broadcastBlocksPreview();
    schedulePersistedSave(sectionId, 300);
  }, [broadcastBlocksPreview, removeBlock, schedulePersistedSave, viewport]);

  const handleBlockReorder = useCallback((sectionId: string, oldIndex: number, newIndex: number) => {
    reorderBlocks(sectionId, oldIndex, newIndex, viewport);
    broadcastBlocksPreview();
    schedulePersistedSave(sectionId, 300);
  }, [broadcastBlocksPreview, reorderBlocks, schedulePersistedSave, viewport]);

  const handleBlockUpdate = useCallback((sectionId: string, blockIndex: number, settings: Record<string, unknown>) => {
    updateBlockSettings(sectionId, blockIndex, settings, viewport);
    broadcastBlocksPreview();
    schedulePersistedSave(sectionId, 800);
  }, [broadcastBlocksPreview, schedulePersistedSave, updateBlockSettings, viewport]);

  return {
    applyRequestedContentUpdate,
    handleBlockAdd,
    handleBlockRemove,
    handleBlockReorder,
    handleBlockUpdate,
    handleContentChange,
  };
}
