import type { PageTemplateSettings } from '@/types/page-template';
import { TemplateToggle } from './TemplateToggle';

type TemplateLayoutControlsProps = {
  settings: PageTemplateSettings;
  updateTemplateField: (category: 'layout' | 'sections' | 'styling', key: string, subKey: string | null, value: unknown) => void;
};

export function TemplateLayoutControls({ settings, updateTemplateField }: TemplateLayoutControlsProps) {
  return (
    <div className="space-y-3 rounded-lg border border-[#ea728c]/20 bg-[#1b1836] p-3">
      <div>
        <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-gray-400">Layout Type</label>
        <select value={settings.layout?.type ?? 'two-column'} onChange={(event) => updateTemplateField('layout', 'type', null, event.target.value)} className="w-full rounded-lg border border-[#ea728c]/20 bg-[#24204b] px-3 py-2 text-xs text-white outline-none focus:border-[#ea728c]">
          <option value="two-column">Two Column</option>
          <option value="single-column">Single Column</option>
        </select>
      </div>
      <div>
        <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-gray-400">Gallery Position</label>
        <select value={settings.layout?.gallery_position ?? 'left'} onChange={(event) => updateTemplateField('layout', 'gallery_position', null, event.target.value)} className="w-full rounded-lg border border-[#ea728c]/20 bg-[#24204b] px-3 py-2 text-xs text-white outline-none focus:border-[#ea728c]">
          <option value="left">Left Side</option>
          <option value="right">Right Side</option>
        </select>
      </div>
      <TemplateToggle label="Sticky FAQ Sidebar" checked={settings.layout?.sticky_sidebar ?? true} onChange={(value) => updateTemplateField('layout', 'sticky_sidebar', null, value)} />
    </div>
  );
}
