import { AlertCircle, Check, Loader2, PanelLeftOpen } from 'lucide-react';
import { SchemaFormBuilder } from '@/components/admin/SchemaFormBuilder';
import type { BlockInstance, BlockTypeSchema, SchemaField, SectionData } from '@/types/schema.types';
import type { EditorViewport } from '@/lib/responsive-content';

type ThemeEditorHomeInspectorProps = {
  activeBlockSchemas: BlockTypeSchema[] | null;
  activeBlockType: string | null;
  activeBlocks: BlockInstance[];
  activeSection?: SectionData;
  activeValues: Record<string, unknown>;
  editorSchema: SchemaField[];
  focusedBlockId: string | null;
  focusedBlockIndex: number | null;
  focusedField: string | null;
  handleBlockAdd: (sectionId: string, block: BlockInstance) => void;
  handleBlockRemove: (sectionId: string, blockIndex: number) => void;
  handleBlockReorder: (sectionId: string, oldIndex: number, newIndex: number) => void;
  handleBlockUpdate: (sectionId: string, blockIndex: number, settings: Record<string, unknown>) => void;
  handleContentChange: (sectionId: string, key: string, value: unknown) => void;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  viewport: EditorViewport;
};

export function ThemeEditorHomeInspector({
  activeBlockSchemas,
  activeBlockType,
  activeBlocks,
  activeSection,
  activeValues,
  editorSchema,
  focusedBlockId,
  focusedBlockIndex,
  focusedField,
  handleBlockAdd,
  handleBlockRemove,
  handleBlockReorder,
  handleBlockUpdate,
  handleContentChange,
  saveStatus,
  viewport,
}: ThemeEditorHomeInspectorProps) {
  if (!activeSection) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-gray-400">
        <PanelLeftOpen size={48} className="mb-4 text-[#ea728c]/50" />
        <h3 className="mb-2 text-sm font-bold text-white">Editor Ready</h3>
        <p className="text-xs">Select a section from the left sidebar to start editing its content and appearance.</p>
      </div>
    );
  }

  return (
    <>
      <div className="border-b border-[#ea728c]/20 bg-[#1b1836] p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-white">{activeSection.label}</h2>
          <div className="flex items-center gap-2">
            {saveStatus === 'saving' ? <Loader2 size={16} className="animate-spin text-[#ea728c]" /> : null}
            {saveStatus === 'saved' ? <Check size={16} className="text-green-400" /> : null}
            {saveStatus === 'error' ? <AlertCircle size={16} className="text-red-400" /> : null}
          </div>
        </div>
        {activeBlockSchemas && activeBlockSchemas.length > 0 ? (
          <div className="flex items-center gap-2 text-[10px] text-gray-400">
            <span className="rounded-full bg-[#ea728c]/20 px-2 py-0.5 font-bold uppercase text-[#ea728c]">{activeBlocks.length} blocks</span>
            <span>•</span>
            <span>{activeBlockSchemas.map((schema) => schema.label).join(', ')}</span>
          </div>
        ) : null}
      </div>
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
        <SchemaFormBuilder
          schema={editorSchema}
          values={activeValues || {}}
          onChange={(key, value) => handleContentChange(activeSection.id, key, value)}
          saveStatus={saveStatus}
          viewport={viewport}
          focusedField={focusedField}
          sectionBlockType={activeBlockType}
          blockSchemas={activeBlockSchemas || undefined}
          blocks={activeBlocks}
          onBlockAdd={(block) => handleBlockAdd(activeSection.id, block)}
          onBlockRemove={(index) => handleBlockRemove(activeSection.id, index)}
          onBlockReorder={(oldIndex, newIndex) => handleBlockReorder(activeSection.id, oldIndex, newIndex)}
          onBlockUpdate={(index, settings) => handleBlockUpdate(activeSection.id, index, settings)}
          focusedBlockId={focusedBlockId}
          focusedBlockIndex={focusedBlockIndex}
        />
      </div>
    </>
  );
}
