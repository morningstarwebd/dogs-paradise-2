'use client';

import { useEffect } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getSectionBlockType, type SectionData } from '@/types/schema.types';

type UseThemeEditorSectionsLoadOptions = {
  activeSectionId: string | null;
  setActiveSection: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  setSections: (sections: SectionData[]) => void;
  supabase: SupabaseClient;
};

export function useThemeEditorSectionsLoad({
  activeSectionId,
  setActiveSection,
  setLoading,
  setSections,
  supabase,
}: UseThemeEditorSectionsLoadOptions) {
  useEffect(() => {
    let cancelled = false;

    async function fetchSections() {
      const { data, error } = await supabase.from('website_sections').select('*').order('sort_order', { ascending: true });

      if (cancelled) {
        return;
      }

      if (!error && data) {
        let nextSections = data as SectionData[];

        if (!nextSections.some((section) => getSectionBlockType(section) === 'header')) {
          const { data: insertedHeader } = await supabase
            .from('website_sections')
            .insert({ section_id: 'header', block_type: 'header', label: 'Header', content: {}, is_visible: true, status: 'published', sort_order: -1 })
            .select('*')
            .single();
          if (!cancelled && insertedHeader) {
            nextSections = [insertedHeader as SectionData, ...nextSections];
          }
        }

        if (!nextSections.some((section) => getSectionBlockType(section) === 'footer')) {
          const { data: insertedFooter } = await supabase
            .from('website_sections')
            .insert({ section_id: 'footer', block_type: 'footer', label: 'Footer', content: {}, is_visible: true, status: 'published', sort_order: 999 })
            .select('*')
            .single();
          if (!cancelled && insertedFooter) {
            nextSections = [...nextSections, insertedFooter as SectionData];
          }
        }

        const orderedSections = [...nextSections].sort((a, b) => a.sort_order - b.sort_order);
        setSections(orderedSections);
        if (orderedSections.length > 0 && !activeSectionId) {
          setActiveSection(orderedSections[0].id);
        }
      }

      setLoading(false);
    }

    void fetchSections();

    return () => {
      cancelled = true;
    };
  }, [activeSectionId, setActiveSection, setLoading, setSections, supabase]);
}
