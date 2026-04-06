import type { PageTemplateSettings } from '@/types/page-template';
import { TemplateToggle } from './TemplateToggle';

type TemplateStylingControlsProps = {
  settings: PageTemplateSettings;
  updateTemplateField: (category: 'layout' | 'sections' | 'styling', key: string, subKey: string | null, value: unknown) => void;
};

export function TemplateStylingControls({ settings, updateTemplateField }: TemplateStylingControlsProps) {
  return (
    <div className="space-y-3 rounded-lg border border-[#ea728c]/20 bg-[#1b1836] p-3">
      <div>
        <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-gray-400">Card Style</label>
        <select value={settings.styling?.card_style ?? 'glass'} onChange={(event) => updateTemplateField('styling', 'card_style', null, event.target.value)} className="w-full rounded-lg border border-[#ea728c]/20 bg-[#24204b] px-3 py-2 text-xs text-white outline-none focus:border-[#ea728c]">
          <option value="glass">Glass (Transparent)</option>
          <option value="solid">Solid</option>
          <option value="minimal">Minimal</option>
        </select>
      </div>
      <div>
        <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-gray-400">Accent Color</label>
        <div className="flex gap-2">
          {['purple', 'blue', 'pink', 'gold'].map((color) => (
            <button
              key={color}
              onClick={() => updateTemplateField('styling', 'accent_color', null, color)}
              className={`h-8 w-8 rounded-lg border-2 transition-all ${settings.styling?.accent_color === color ? 'scale-110 border-white' : 'border-transparent hover:border-white/30'}`}
              style={{ background: color === 'purple' ? '#a855f7' : color === 'blue' ? '#3b82f6' : color === 'pink' ? '#ec4899' : '#eab308' }}
            />
          ))}
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-gray-400">Border Radius</label>
        <select value={settings.styling?.border_radius ?? '2xl'} onChange={(event) => updateTemplateField('styling', 'border_radius', null, event.target.value)} className="w-full rounded-lg border border-[#ea728c]/20 bg-[#24204b] px-3 py-2 text-xs text-white outline-none focus:border-[#ea728c]">
          <option value="none">None</option>
          <option value="md">Small</option>
          <option value="xl">Medium</option>
          <option value="2xl">Large</option>
          <option value="3xl">Extra Large</option>
        </select>
      </div>
      <TemplateToggle label="Show Gradients" checked={settings.styling?.show_gradients ?? true} onChange={(value) => updateTemplateField('styling', 'show_gradients', null, value)} />
    </div>
  );
}
