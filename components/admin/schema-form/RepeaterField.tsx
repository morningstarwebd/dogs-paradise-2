'use client';

import { Plus, Trash2 } from 'lucide-react';
import type { SchemaField } from '@/types/schema.types';
import { ColorInputWithLibrary } from './color-library';
import { getRepeaterItemDefaults, getRepeaterItems } from './field-helpers';

type RepeaterFieldProps = {
  field: SchemaField;
  onChange: (key: string, value: unknown) => void;
  onRememberColor: (colorValue: string) => void;
  savedColors: string[];
  value: unknown;
};

export function RepeaterField({ field, onChange, onRememberColor, savedColors, value }: RepeaterFieldProps) {
  const repeaterFields = field.fields || [];
  const repeaterItems = getRepeaterItems(value);
  const setRepeaterItems = (nextItems: Record<string, unknown>[]) => onChange(field.key, nextItems);

  return (
    <div className="space-y-3">
      {repeaterItems.length === 0 ? <div className="rounded-lg border border-dashed border-[#ea728c]/30 px-3 py-3 text-xs text-gray-500">No items added yet.</div> : null}
      {repeaterItems.map((item, itemIndex) => (
        <div key={`${field.key}-item-${itemIndex}`} className="space-y-3 rounded-lg border border-[#ea728c]/20 bg-[#1b1836]/60 p-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Item {itemIndex + 1}</p>
            <button type="button" onClick={() => setRepeaterItems(repeaterItems.filter((_, currentIndex) => currentIndex !== itemIndex))} className="inline-flex items-center gap-1 rounded-md border border-red-400/40 px-2 py-1 text-[11px] font-semibold text-red-300 hover:bg-red-500/10"><Trash2 size={12} />Remove</button>
          </div>
          <div className="space-y-2.5">
            {repeaterFields.map((subField) => {
              const subValue = item[subField.key] ?? subField.default ?? '';
              const toggleValue = typeof subValue === 'boolean' ? subValue : String(subValue).toLowerCase() === 'true';
              const handleSubChange = (nextValue: unknown) => setRepeaterItems(repeaterItems.map((entry, currentIndex) => currentIndex === itemIndex ? { ...entry, [subField.key]: nextValue } : entry));
              return (
                <div key={`${field.key}-${itemIndex}-${subField.key}`} className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-300">{subField.label}</label>
                  {(subField.type === 'text' || subField.type === 'link') ? <input type="text" value={String(subValue)} onChange={(event) => handleSubChange(event.target.value)} placeholder={subField.placeholder} className="w-full rounded-lg border border-[#ea728c]/30 bg-[#1b1836] px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ea728c]" /> : null}
                  {subField.type === 'textarea' ? <textarea value={String(subValue)} onChange={(event) => handleSubChange(event.target.value)} placeholder={subField.placeholder} rows={3} className="w-full resize-y rounded-lg border border-[#ea728c]/30 bg-[#1b1836] px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ea728c]" /> : null}
                  {subField.type === 'number' ? <input type="number" value={Number.isFinite(Number(subValue)) ? Number(subValue) : 0} onChange={(event) => handleSubChange(Number(event.target.value))} placeholder={subField.placeholder} className="w-full rounded-lg border border-[#ea728c]/30 bg-[#1b1836] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#ea728c]" /> : null}
                  {subField.type === 'select' && subField.options ? <select value={String(subValue)} onChange={(event) => handleSubChange(event.target.value)} className="w-full cursor-pointer rounded-lg border border-[#ea728c]/30 bg-[#1b1836] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#ea728c]"><option value="">Select...</option>{subField.options.map((option) => <option key={option} value={option}>{option}</option>)}</select> : null}
                  {subField.type === 'toggle' ? <button type="button" onClick={() => handleSubChange(!toggleValue)} className={`relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none focus:ring-2 focus:ring-[#ea728c] focus:ring-offset-2 focus:ring-offset-[#24204b] ${toggleValue ? 'bg-[#ea728c]' : 'border border-[#ea728c]/30 bg-[#1b1836]'}`}><span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${toggleValue ? 'translate-x-6' : 'translate-x-1'}`} /></button> : null}
                  {subField.type === 'color' ? <ColorInputWithLibrary value={String(subValue)} onChange={(nextValue) => handleSubChange(nextValue)} onRemember={onRememberColor} savedColors={savedColors} placeholder={subField.placeholder || '#000000'} /> : null}
                  {!['text', 'link', 'textarea', 'number', 'select', 'toggle', 'color'].includes(subField.type) ? <input type="text" value={String(subValue)} onChange={(event) => handleSubChange(event.target.value)} placeholder={subField.placeholder} className="w-full rounded-lg border border-[#ea728c]/30 bg-[#1b1836] px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ea728c]" /> : null}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <button type="button" onClick={() => setRepeaterItems([...repeaterItems, getRepeaterItemDefaults(repeaterFields)])} className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#ea728c]/40 bg-[#ea728c]/10 px-3 py-2 text-xs font-semibold text-[#ea728c] transition-colors hover:bg-[#ea728c] hover:text-white"><Plus size={14} />Add Item</button>
    </div>
  );
}
