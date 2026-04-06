'use client';

import { useEffect, useMemo, useState } from 'react';
import { type EditorViewport, getViewportContent } from '@/lib/responsive-content';

export type LiveSectionPayload = {
  section_id?: string;
  block_type?: string | null;
  content?: Record<string, unknown>;
};

type UseSectionPreviewContentOptions = {
  initialContent?: Record<string, unknown>;
  initialViewport?: EditorViewport;
  matchesSection: (section: LiveSectionPayload) => boolean;
};

export function isEditorViewport(value: unknown): value is EditorViewport {
  return value === 'desktop' || value === 'mobile';
}

export function useSectionPreviewContent({
  initialContent = {},
  initialViewport = 'desktop',
  matchesSection,
}: UseSectionPreviewContentOptions) {
  const [previewViewport, setPreviewViewport] = useState<EditorViewport>(initialViewport);
  const [liveRawContent, setLiveRawContent] = useState<Record<string, unknown> | null>(null);

  const rawContent = liveRawContent ?? initialContent;
  const content = useMemo(
    () => getViewportContent(rawContent, previewViewport),
    [previewViewport, rawContent]
  );

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data?.type === 'SET_PREVIEW_VIEWPORT' && isEditorViewport(event.data?.viewport)) {
        setPreviewViewport(event.data.viewport);
        return;
      }

      if (event.data?.type !== 'LIVE_PREVIEW_UPDATE') {
        return;
      }

      const nextViewport = isEditorViewport(event.data?.viewport)
        ? event.data.viewport
        : previewViewport;

      if (isEditorViewport(event.data?.viewport)) {
        setPreviewViewport(nextViewport);
      }

      const sections = event.data.sections as LiveSectionPayload[] | undefined;
      if (!Array.isArray(sections)) {
        return;
      }

      const matchingSection = sections.find(matchesSection);
      if (matchingSection?.content && typeof matchingSection.content === 'object') {
        setLiveRawContent(matchingSection.content);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [matchesSection, previewViewport]);

  return {
    previewViewport,
    rawContent,
    content,
  };
}
