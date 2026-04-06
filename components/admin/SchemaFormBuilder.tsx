'use client';

import { useEffect, useState } from 'react';
import type { BlockInstance, BlockTypeSchema, SchemaField } from '@/types/schema.types';
import type { EditorViewport } from '@/lib/responsive-content';
import { BlocksEditor } from './schema-form/BlocksEditor';
import { isCustomSavedColor, normalizeColorEntry, rememberSavedColor } from './schema-form/color-library';
import { FieldRenderer } from './schema-form/FieldRenderer';
import { isFieldVisibleInViewport } from './schema-form/field-helpers';

interface SchemaFormBuilderProps {
  schema: SchemaField[];
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  viewport?: EditorViewport;
  focusedField?: string | null;
  sectionBlockType?: string | null;
  blockSchemas?: BlockTypeSchema[];
  blocks?: BlockInstance[];
  onBlockAdd?: (block: BlockInstance) => void;
  onBlockRemove?: (index: number) => void;
  onBlockReorder?: (oldIndex: number, newIndex: number) => void;
  onBlockUpdate?: (index: number, settings: Record<string, unknown>) => void;
  focusedBlockId?: string | null;
  focusedBlockIndex?: number | null;
  saveStatus?: 'idle' | 'saving' | 'saved' | 'error';
}

export function SchemaFormBuilder({
  schema,
  values,
  onChange,
  viewport = 'desktop',
  focusedField,
  sectionBlockType,
  blockSchemas,
  blocks,
  onBlockAdd,
  onBlockRemove,
  onBlockReorder,
  onBlockUpdate,
  focusedBlockId,
  focusedBlockIndex,
  saveStatus = 'idle',
}: SchemaFormBuilderProps) {
  const [activeTab, setActiveTab] = useState<'Content' | 'Design' | 'Blocks'>('Content');
  const [uploadingState, setUploadingState] = useState<Record<string, boolean>>({});
  const [savedColors, setSavedColors] = useState<string[]>([]);
  const [pendingSavedColor, setPendingSavedColor] = useState<string | null>(null);
  const mediaLibraryEnabled = true;
  const imageUploadFolder = sectionBlockType === 'hero' ? 'hero' : 'sections';
  const hasBlocks = Boolean(blockSchemas && blockSchemas.length > 0);

  useEffect(() => {
    if (!focusedField || !schema) return;
    const fieldOptions = schema.find((field) => field.key === focusedField);
    if (fieldOptions) {
      const group = fieldOptions.group === 'Design' ? 'Design' : 'Content';
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (activeTab !== group) setActiveTab(group);
    }
  }, [activeTab, focusedField, schema]);

  useEffect(() => {
    if (focusedBlockId != null && hasBlocks) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab('Blocks');
    }
  }, [focusedBlockId, hasBlocks]);

  useEffect(() => {
    if (!focusedField) return;
    setTimeout(() => {
      const element = document.getElementById(`field-${focusedField}`);
      if (!element) return;
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('ring-2', 'ring-[#ea728c]', 'bg-[#ea728c]/10', 'scale-[1.02]');
      setTimeout(() => element.classList.remove('ring-2', 'ring-[#ea728c]', 'bg-[#ea728c]/10', 'scale-[1.02]'), 1500);
    }, 50);
  }, [activeTab, focusedField]);

  useEffect(() => {
    if (saveStatus !== 'saved' || !pendingSavedColor) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSavedColors((previous) => rememberSavedColor(pendingSavedColor, previous));
    setPendingSavedColor(null);
  }, [pendingSavedColor, saveStatus]);

  if ((!schema || schema.length === 0) && !hasBlocks) {
    return <div className="rounded-xl border-2 border-dashed border-[#ea728c]/20 bg-[#24204b]/50 p-6 text-center"><p className="text-sm text-gray-400">No configurable fields for this section.</p></div>;
  }

  const visibleSchema = schema.filter((field) => isFieldVisibleInViewport(field, viewport));
  const contentFields = visibleSchema.filter((field) => field.group === 'Content' || !field.group);
  const designFields = visibleSchema.filter((field) => field.group === 'Design');
  const tabList: ('Content' | 'Design' | 'Blocks')[] = ['Content', ...(hasBlocks ? (['Blocks'] as const) : []), 'Design'];
  const queueRememberColor = (colorValue: string) => {
    const normalized = normalizeColorEntry(colorValue);
    if (isCustomSavedColor(normalized)) setPendingSavedColor(normalized);
  };

  return (
    <div className="space-y-6">
      <div className="flex rounded-lg border border-[#ea728c]/20 bg-[#1b1836] p-1">
        {tabList.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 rounded py-1.5 text-center text-xs font-bold shadow-sm transition-colors ${activeTab === tab ? 'bg-[#ea728c] text-white' : 'text-gray-400 hover:text-white'}`}>
            {tab === 'Blocks' ? `Blocks (${(blocks || []).length})` : tab === 'Design' ? 'Design & Spacing' : tab}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {activeTab === 'Content' ? renderFieldList(contentFields, viewport, 'content', values, onChange, uploadingState, setUploadingState, mediaLibraryEnabled, imageUploadFolder, savedColors, queueRememberColor) : null}
        {activeTab === 'Design' ? renderFieldList(designFields, viewport, 'design', values, onChange, uploadingState, setUploadingState, mediaLibraryEnabled, imageUploadFolder, savedColors, queueRememberColor) : null}
        {activeTab === 'Blocks' && hasBlocks && blockSchemas && blocks && onBlockAdd && onBlockRemove && onBlockReorder && onBlockUpdate ? (
          <BlocksEditor
            blockSchemas={blockSchemas}
            blocks={blocks}
            onBlockAdd={onBlockAdd}
            onBlockRemove={onBlockRemove}
            onBlockReorder={onBlockReorder}
            onBlockUpdate={onBlockUpdate}
            focusedBlockId={focusedBlockId}
            focusedBlockIndex={focusedBlockIndex}
            viewport={viewport}
            useMediaLibraryForImage={mediaLibraryEnabled}
            imageUploadFolder={imageUploadFolder}
            savedColors={savedColors}
            onRememberColor={queueRememberColor}
          />
        ) : null}
      </div>
    </div>
  );
}

function renderFieldList(
  fields: SchemaField[],
  viewport: EditorViewport,
  emptyMessageKind: 'content' | 'design',
  values: Record<string, unknown>,
  onChange: (key: string, value: unknown) => void,
  uploadingState: Record<string, boolean>,
  setUploadingState: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
  useMediaLibraryForImage: boolean,
  imageUploadFolder: string,
  savedColors: string[],
  onRememberColor: (colorValue: string) => void
) {
  if (fields.length === 0) {
    return <div className="py-4 text-center text-sm text-gray-500">No {emptyMessageKind} settings for {viewport} view.</div>;
  }

  return (
    <>
      {fields.map((field) => (
        <FieldRenderer
          key={field.key}
          field={field}
          value={values[field.key] ?? field.default ?? ''}
          onChange={onChange}
          uploadingState={uploadingState}
          setUploadingState={setUploadingState}
          useMediaLibraryForImage={useMediaLibraryForImage}
          imageUploadFolder={imageUploadFolder}
          savedColors={savedColors}
          onRememberColor={onRememberColor}
        />
      ))}
    </>
  );
}
