'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getPageTemplate, updatePageTemplate } from '@/actions/templates';
import type { PageTemplateSettings, ProductTemplateBlock } from '@/types/page-template';
import { isTemplatePage } from './theme-editor-config';

type UseThemeEditorTemplateOptions = {
  activePage: string;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
};

export function useThemeEditorTemplate({
  activePage,
  iframeRef,
}: UseThemeEditorTemplateOptions) {
  const [templateSettings, setTemplateSettings] = useState<PageTemplateSettings | null>(null);
  const [templateSaveStatus, setTemplateSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const templateDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function hydrateTemplateSettings() {
      if (!isTemplatePage(activePage)) {
        queueMicrotask(() => {
          if (!cancelled) {
            setTemplateSettings(null);
          }
        });
        return;
      }

      const template = await getPageTemplate(activePage);
      if (!cancelled && template) {
        setTemplateSettings(template.settings);
      }
    }

    void hydrateTemplateSettings();

    return () => {
      cancelled = true;
    };
  }, [activePage]);

  const saveTemplateSettings = useCallback(
    async (newSettings: PageTemplateSettings) => {
      setTemplateSaveStatus('saving');
      if (templateDebounceRef.current) {
        clearTimeout(templateDebounceRef.current);
      }

      templateDebounceRef.current = setTimeout(async () => {
        const result = await updatePageTemplate(activePage, newSettings);
        if (result.success) {
          setTemplateSaveStatus('saved');
          if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
              { type: 'TEMPLATE_SETTINGS_UPDATE', pageType: activePage, settings: newSettings },
              window.location.origin
            );
          }
          setTimeout(() => setTemplateSaveStatus('idle'), 2000);
        } else {
          setTemplateSaveStatus('error');
        }
      }, 500);
    },
    [activePage, iframeRef]
  );

  const updateTemplateField = useCallback(
    (category: 'layout' | 'sections' | 'styling', key: string, subKey: string | null, value: unknown) => {
      setTemplateSettings((previous) => {
        if (!previous) return previous;
        // Don't modify sections (block array) through this path — use handleProductBlocksChange
        if (category === 'sections') return previous;

        const nextSettings = { ...previous };

        if (!nextSettings[category]) {
          (nextSettings as Record<string, unknown>)[category] = {};
        }

        if (subKey) {
          const categoryRecord = nextSettings[category] as Record<string, Record<string, unknown>>;
          if (!categoryRecord[key]) {
            categoryRecord[key] = {};
          }
          categoryRecord[key][subKey] = value;
        } else {
          (nextSettings[category] as Record<string, unknown>)[key] = value;
        }

        void saveTemplateSettings(nextSettings);
        return nextSettings;
      });
    },
    [saveTemplateSettings]
  );

  // ─── Product Template: Block-level operations ─────────────────────

  const handleProductBlocksChange = useCallback(
    (blocks: ProductTemplateBlock[]) => {
      setTemplateSettings((previous) => {
        if (!previous) return previous;
        const nextSettings: PageTemplateSettings = {
          ...previous,
          sections: blocks,
        };
        void saveTemplateSettings(nextSettings);
        return nextSettings;
      });
    },
    [saveTemplateSettings]
  );

  return {
    templateSaveStatus,
    templateSettings,
    updateTemplateField,
    handleProductBlocksChange,
  };
}
