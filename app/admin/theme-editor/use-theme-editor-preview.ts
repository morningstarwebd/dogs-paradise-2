'use client';

import { useCallback, useEffect } from 'react';
import type { EditorViewport } from '@/lib/responsive-content';
import type { SectionData } from '@/types/schema.types';

type UseThemeEditorPreviewOptions = {
  applyRequestedContentUpdate: (sectionId: string, updates: Record<string, unknown>) => void;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  isHomeEditorPage: boolean;
  loading: boolean;
  sections: SectionData[];
  setActiveBlock: (id: string | null, index?: number | null) => void;
  setActiveSection: (id: string | null) => void;
  setFocusedBlockId: (value: string | null) => void;
  setFocusedBlockIndex: (value: number | null) => void;
  setFocusedField: (value: string | null) => void;
  viewport: EditorViewport;
};

export function useThemeEditorPreview({
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
}: UseThemeEditorPreviewOptions) {
  const syncIframePreviewState = useCallback(() => {
    if (!iframeRef.current?.contentWindow || loading) return;
    iframeRef.current.contentWindow.postMessage({ type: 'LIVE_PREVIEW_UPDATE', sections, viewport }, window.location.origin);
    iframeRef.current.contentWindow.postMessage({ type: 'SET_PREVIEW_VIEWPORT', viewport }, window.location.origin);
  }, [iframeRef, loading, sections, viewport]);

  useEffect(() => {
    syncIframePreviewState();
  }, [syncIframePreviewState]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== iframeRef.current?.contentWindow) return;
      const messageType = event.data?.type as string | undefined;
      if (!isHomeEditorPage && ['SELECT_SECTION', 'FOCUS_FIELD', 'FOCUS_BLOCK', 'REQUEST_CONTENT_UPDATE', 'REQUEST_CONTENT_UPDATE_MULTIPLE'].includes(messageType || '')) {
        return;
      }

      if (messageType === 'SELECT_SECTION') {
        setActiveSection(event.data.sectionId);
      } else if (messageType === 'FOCUS_FIELD') {
        setActiveSection(event.data.sectionId);
        setFocusedField(event.data.fieldKey);
        setFocusedBlockId(null);
        setFocusedBlockIndex(null);
        setTimeout(() => setFocusedField(null), 100);
      } else if (messageType === 'FOCUS_BLOCK') {
        setActiveSection(event.data.sectionId);
        setActiveBlock(event.data.blockId, event.data.blockIndex);
        setFocusedBlockId(event.data.blockId);
        setFocusedBlockIndex(event.data.blockIndex ?? 0);
        setTimeout(() => {
          setFocusedBlockId(null);
          setFocusedBlockIndex(null);
        }, 100);
      } else if (messageType === 'REQUEST_CONTENT_UPDATE') {
        applyRequestedContentUpdate(event.data.sectionId, { [event.data.key]: event.data.value });
      } else if (messageType === 'REQUEST_CONTENT_UPDATE_MULTIPLE') {
        applyRequestedContentUpdate(event.data.sectionId, event.data.updates as Record<string, unknown>);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [applyRequestedContentUpdate, iframeRef, isHomeEditorPage, setActiveBlock, setActiveSection, setFocusedBlockId, setFocusedBlockIndex, setFocusedField]);

  return {
    syncIframePreviewState,
  };
}
