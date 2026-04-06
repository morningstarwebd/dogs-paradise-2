import type { PageTemplateSettings } from '@/types/page-template';

type TemplateCharacteristicsControlsProps = {
  settings: PageTemplateSettings;
  updateTemplateField: (category: 'layout' | 'sections' | 'styling', key: string, subKey: string | null, value: unknown) => void;
};

export function TemplateCharacteristicsControls({
  settings,
  updateTemplateField,
}: TemplateCharacteristicsControlsProps) {
  return (
    <div className="space-y-3 rounded-lg border border-[#ea728c]/20 bg-[#1b1836] p-3">
      <div>
        <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-gray-400">Grid Columns</label>
        <select value={settings.sections?.characteristics?.columns ?? 3} onChange={(event) => updateTemplateField('sections', 'characteristics', 'columns', parseInt(event.target.value, 10))} className="w-full rounded-lg border border-[#ea728c]/20 bg-[#24204b] px-3 py-2 text-xs text-white outline-none focus:border-[#ea728c]">
          <option value="2">2 Columns</option>
          <option value="3">3 Columns</option>
          <option value="4">4 Columns</option>
        </select>
      </div>
      <div>
        <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-gray-400">Section Title</label>
        <input
          type="text"
          value={settings.sections?.characteristics?.title ?? 'Temperament & Characteristics'}
          onChange={(event) => updateTemplateField('sections', 'characteristics', 'title', event.target.value)}
          className="w-full rounded-lg border border-[#ea728c]/20 bg-[#24204b] px-3 py-2 text-xs text-white outline-none focus:border-[#ea728c]"
        />
      </div>
    </div>
  );
}
