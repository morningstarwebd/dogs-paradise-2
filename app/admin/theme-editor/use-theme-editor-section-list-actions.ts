'use client';

import { useCallback, useMemo } from 'react';
import { closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { arrayMove } from '@dnd-kit/sortable';
import {
  addSection as addSectionAction,
  deleteSection as deleteSectionAction,
  publishSection as publishSectionAction,
  reorderSections as reorderSectionsAction,
  toggleSectionVisibility,
  unpublishSection as unpublishSectionAction,
} from '@/actions/sections';
import { useEditorStore } from '@/store/editor-store';
import { getSectionBlockType, isFixedWebsiteSection, type SectionData } from '@/types/schema.types';

type UseThemeEditorSectionListActionsOptions = {
  sections: SectionData[];
  setActiveSection: (id: string | null) => void;
  setIsAddMenuOpen: (open: boolean) => void;
  setSaveStatus: (status: 'idle' | 'saving' | 'saved' | 'error') => void;
  setSections: (sections: SectionData[]) => void;
  updateSectionVisibility: (id: string, isVisible: boolean) => void;
  removeSection: (id: string) => void;
};

export function useThemeEditorSectionListActions({
  sections,
  setActiveSection,
  setIsAddMenuOpen,
  setSaveStatus,
  setSections,
  updateSectionVisibility,
  removeSection,
}: UseThemeEditorSectionListActionsOptions) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleVisibilityToggle = useCallback(async (sectionId: string, visible: boolean) => {
    updateSectionVisibility(sectionId, visible);
    await toggleSectionVisibility(sectionId, visible);
  }, [updateSectionVisibility]);

  const handleDeleteSection = useCallback(async (sectionId: string) => {
    if (!confirm('Delete this section completely from Dogs Paradise Home?')) return;
    setSaveStatus('saving');
    const result = await deleteSectionAction(sectionId);
    if (!result.success) {
      setSaveStatus('error');
      alert(`Failed to delete: ${result.error}`);
      return;
    }
    removeSection(sectionId);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  }, [removeSection, setSaveStatus]);

  const handlePublishToggle = useCallback(async (sectionId: string, currentStatus: string) => {
    setSaveStatus('saving');
    const action = currentStatus === 'published' ? unpublishSectionAction : publishSectionAction;
    const result = await action(sectionId);
    if (!result.success) {
      setSaveStatus('error');
      return;
    }
    const nextStatus: SectionData['status'] = currentStatus === 'published' ? 'draft' : 'published';
    setSections(sections.map((section) => (section.id === sectionId ? { ...section, status: nextStatus } : section)));
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  }, [sections, setSaveStatus, setSections]);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const fixedHeader = sections.find((section) => getSectionBlockType(section) === 'header');
    const fixedFooter = sections.find((section) => getSectionBlockType(section) === 'footer');
    const editableSections = sections.filter((section) => !isFixedWebsiteSection(section));
    const oldIndex = editableSections.findIndex((section) => section.id === active.id);
    const newIndex = editableSections.findIndex((section) => section.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const reorderedEditable = arrayMove(editableSections, oldIndex, newIndex);
    const reorderedAll = [...(fixedHeader ? [fixedHeader] : []), ...reorderedEditable, ...(fixedFooter ? [fixedFooter] : [])].map((section, index) => ({ ...section, sort_order: index }));
    setSections(reorderedAll);
    await reorderSectionsAction(reorderedAll.map((section) => ({ id: section.id, sortOrder: section.sort_order })));
  }, [sections, setSections]);

  const handleAddSection = useCallback(async (blockKey: string) => {
    setIsAddMenuOpen(false);
    if (isFixedWebsiteSection(blockKey)) return;
    setSaveStatus('saving');
    const label = blockKey.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
    const newOrder = sections.length > 0 ? Math.max(...sections.map((section) => section.sort_order)) + 1 : 0;
    const result = await addSectionAction(blockKey, label, newOrder);
    if (!result.success) {
      setSaveStatus('error');
      return;
    }
    if (result.data) {
      useEditorStore.getState().addSection(result.data as SectionData);
      setActiveSection(result.data.id);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  }, [sections, setActiveSection, setIsAddMenuOpen, setSaveStatus]);

  return useMemo(
    () => ({
      handleAddSection,
      handleDeleteSection,
      handleDragEnd,
      handlePublishToggle,
      handleVisibilityToggle,
      sensors,
      collisionDetection: closestCenter,
    }),
    [handleAddSection, handleDeleteSection, handleDragEnd, handlePublishToggle, handleVisibilityToggle, sensors]
  );
}
