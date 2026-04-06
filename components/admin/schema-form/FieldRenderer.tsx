'use client';

import type React from 'react';
import { ImageUpload } from '@/components/admin/ImageUpload';
import type { SchemaField } from '@/types/schema.types';
import { ColorInputWithLibrary } from './color-library';
import { ImageField } from './ImageField';
import { RepeaterField } from './RepeaterField';

type FieldRendererProps = {
  field: SchemaField;
  imageUploadFolder?: string;
  onChange: (key: string, value: unknown) => void;
  onRememberColor: (colorValue: string) => void;
  savedColors: string[];
  setUploadingState: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  uploadingState: Record<string, boolean>;
  useMediaLibraryForImage?: boolean;
  value: unknown;
};

export function FieldRenderer({
  field,
  imageUploadFolder,
  onChange,
  onRememberColor,
  savedColors,
  setUploadingState,
  uploadingState,
  useMediaLibraryForImage,
  value,
}: FieldRendererProps) {
  return (
    <div id={`field-${field.key}`} className="mx-[-8px] flex flex-col rounded-lg p-2 transition-all duration-500 space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">{field.label}</label>
      {field.type === 'repeater' ? <RepeaterField field={field} onChange={onChange} onRememberColor={onRememberColor} savedColors={savedColors} value={value} /> : null}
      {field.type === 'text' ? <input type="text" value={String(value)} onChange={(event) => onChange(field.key, event.target.value)} placeholder={field.placeholder} className="w-full rounded-lg border border-[#ea728c]/30 bg-[#1b1836] px-4 py-2.5 text-sm text-white placeholder:text-gray-600 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#ea728c]" /> : null}
      {field.type === 'image' ? (useMediaLibraryForImage ? <ImageUpload value={typeof value === 'string' ? value : ''} onChange={(url) => onChange(field.key, url)} folder={imageUploadFolder || 'sections'} /> : <ImageField fieldKey={field.key} value={value} onChange={(nextValue) => onChange(field.key, nextValue)} uploading={uploadingState[field.key]} setUploading={(nextValue) => setUploadingState((previous) => ({ ...previous, [field.key]: nextValue }))} />) : null}
      {field.type === 'color' ? <ColorInputWithLibrary value={String(value)} onChange={(nextValue) => onChange(field.key, nextValue)} onRemember={onRememberColor} savedColors={savedColors} placeholder={field.placeholder || 'e.g. gold-glitter, white-glitter, #D4AF37, gold, or linear-gradient(...)'} /> : null}
      {field.type === 'textarea' ? <textarea value={String(value)} onChange={(event) => onChange(field.key, event.target.value)} placeholder={field.placeholder} rows={4} className="w-full resize-y rounded-lg border border-[#ea728c]/30 bg-[#1b1836] px-4 py-2.5 text-sm text-white placeholder:text-gray-600 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#ea728c]" /> : null}
      {field.type === 'number' ? <input type="number" value={Number(value)} onChange={(event) => onChange(field.key, Number(event.target.value))} placeholder={field.placeholder} className="w-full rounded-lg border border-[#ea728c]/30 bg-[#1b1836] px-4 py-2.5 text-sm text-white transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#ea728c]" /> : null}
      {field.type === 'range' ? <RangeField field={field} onChange={onChange} value={value} /> : null}
      {field.type === 'toggle' ? <button type="button" onClick={() => onChange(field.key, !value)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#ea728c] focus:ring-offset-2 focus:ring-offset-[#24204b] ${value ? 'bg-[#ea728c]' : 'border border-[#ea728c]/30 bg-[#1b1836]'}`}><span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} /></button> : null}
      {field.type === 'select' && field.options ? <select value={String(value)} onChange={(event) => onChange(field.key, event.target.value)} className="w-full cursor-pointer rounded-lg border border-[#ea728c]/30 bg-[#1b1836] px-4 py-2.5 text-sm text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#ea728c]"><option value="">Select...</option>{field.options.map((option) => <option key={option} value={option}>{option}</option>)}</select> : null}
    </div>
  );
}

function RangeField({
  field,
  onChange,
  value,
}: {
  field: SchemaField;
  onChange: (key: string, value: unknown) => void;
  value: unknown;
}) {
  const min = typeof field.min === 'number' ? field.min : 0;
  const max = typeof field.max === 'number' ? field.max : 100;
  const step = typeof field.step === 'number' ? field.step : 1;
  const parsed = typeof value === 'number' ? value : Number(value);
  const fallback = typeof field.default === 'number' ? field.default : min;
  const sliderValue = Number.isFinite(parsed) ? parsed : fallback;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <input type="range" min={min} max={max} step={step} value={sliderValue} onChange={(event) => onChange(field.key, Number(event.target.value))} className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#1b1836] accent-[#ea728c]" />
        <span className="min-w-[52px] text-right text-xs font-semibold text-[#ea728c]">{Number(sliderValue).toFixed(2).replace(/\.00$/, '')}</span>
      </div>
      <div className="flex justify-between text-[10px] text-gray-500"><span>{min}</span><span>{max}</span></div>
    </div>
  );
}
