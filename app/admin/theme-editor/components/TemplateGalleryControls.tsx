import type { PageTemplateSettings } from '@/types/page-template';
import { TemplateToggle } from './TemplateToggle';

type TemplateGalleryControlsProps = {
  settings: PageTemplateSettings;
  updateTemplateField: (category: 'layout' | 'sections' | 'styling', key: string, subKey: string | null, value: unknown) => void;
};

export function TemplateGalleryControls({ settings, updateTemplateField }: TemplateGalleryControlsProps) {
  return (
    <div className="space-y-3 rounded-lg border border-[#ea728c]/20 bg-[#1b1836] p-3">
      <div>
        <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-gray-400">Max Thumbnails</label>
        <select value={settings.sections?.image_gallery?.max_thumbnails ?? 4} onChange={(event) => updateTemplateField('sections', 'image_gallery', 'max_thumbnails', parseInt(event.target.value, 10))} className="w-full rounded-lg border border-[#ea728c]/20 bg-[#24204b] px-3 py-2 text-xs text-white outline-none focus:border-[#ea728c]">
          <option value="2">2 Thumbnails</option>
          <option value="3">3 Thumbnails</option>
          <option value="4">4 Thumbnails</option>
          <option value="5">5 Thumbnails</option>
          <option value="6">6 Thumbnails</option>
        </select>
      </div>
      <TemplateToggle label="Show Status Badge" checked={settings.sections?.image_gallery?.show_status_badge ?? true} onChange={(value) => updateTemplateField('sections', 'image_gallery', 'show_status_badge', value)} />
    </div>
  );
}
