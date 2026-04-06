'use client';

import type React from 'react';

const MAX_COLOR_LIBRARY_ITEMS = 10;
const COMMON_COLOR_TOKENS = new Set([
  '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ffa500', '#800080', '#ffc0cb', '#808080',
  'transparent', 'black', 'white', 'red', 'green', 'blue', 'yellow', 'orange', 'purple', 'pink', 'gray', 'grey',
]);

export function normalizeColorEntry(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

function toPickerHex(value: string): string {
  const trimmed = value.trim();
  const hexMatch = trimmed.match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
  if (!hexMatch) return '#000000';
  const raw = hexMatch[1];
  return raw.length === 3
    ? `#${raw.split('').map((char) => `${char}${char}`).join('').toLowerCase()}`
    : `#${raw.toLowerCase()}`;
}

function isGradientValue(value: string): boolean {
  return /(?:repeating-)?(?:linear|radial|conic)-gradient\s*\(/i.test(value);
}

function isColorFunctionValue(value: string): boolean {
  return /^(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch|color)\s*\(/i.test(value.trim());
}

function normalizeColorToken(value: string): string {
  const normalized = normalizeColorEntry(value).toLowerCase();
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(normalized) ? toPickerHex(normalized) : normalized;
}

export function isCustomSavedColor(value: string): boolean {
  const normalized = normalizeColorEntry(value);
  if (!normalized) return false;
  if (isGradientValue(normalized) || isColorFunctionValue(normalized)) return true;
  return !COMMON_COLOR_TOKENS.has(normalizeColorToken(normalized));
}

function getColorSwatchStyle(colorValue: string): React.CSSProperties {
  return isGradientValue(colorValue)
    ? { backgroundImage: colorValue, backgroundColor: 'transparent' }
    : { backgroundColor: colorValue };
}

export function rememberSavedColor(
  pendingSavedColor: string,
  previousColors: string[]
) {
  const normalizedToken = normalizeColorToken(pendingSavedColor);
  const withoutDupes = previousColors.filter((entry) => normalizeColorToken(entry) !== normalizedToken);
  return [pendingSavedColor, ...withoutDupes].slice(0, MAX_COLOR_LIBRARY_ITEMS);
}

type ColorInputWithLibraryProps = {
  onChange: (nextValue: string) => void;
  onRemember: (colorValue: string) => void;
  placeholder?: string;
  savedColors: string[];
  value: string;
};

export function ColorInputWithLibrary({
  onChange,
  onRemember,
  placeholder,
  savedColors,
  value,
}: ColorInputWithLibraryProps) {
  const normalizedValue = typeof value === 'string' ? value : String(value ?? '');
  const rememberCurrentValue = () => onRemember(normalizedValue);

  return (
    <div className="space-y-2 rounded-xl border border-[#ea728c]/25 bg-[#1b1836]/70 p-2.5">
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 flex-shrink-0 cursor-pointer overflow-hidden rounded border border-gray-600">
          <input type="color" value={toPickerHex(normalizedValue)} onChange={(event) => onChange(event.target.value)} onBlur={(event) => onRemember(event.currentTarget.value)} className="absolute left-[-10px] top-[-10px] h-20 w-20 cursor-pointer border-0 p-0" />
        </div>
        <input type="text" value={normalizedValue} onChange={(event) => onChange(event.target.value)} onBlur={rememberCurrentValue} onKeyDown={(event) => event.key === 'Enter' && rememberCurrentValue()} placeholder={placeholder || 'e.g. #000000 or linear-gradient(...)'} className="w-full rounded-lg border border-[#ea728c]/30 bg-[#1b1836] px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ea728c]" />
      </div>

      {savedColors.length > 0 ? (
        <div className="space-y-1.5 rounded-lg border border-[#ea728c]/20 bg-[#14112b]/80 p-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Saved Colors (Session)</p>
          <div className="flex flex-wrap gap-2">
            {savedColors.map((savedColor) => {
              const normalizedSaved = normalizeColorEntry(savedColor);
              const isActive = normalizeColorEntry(normalizedValue).toLowerCase() === normalizedSaved.toLowerCase();
              return (
                <button
                  key={normalizedSaved}
                  type="button"
                  onClick={() => onChange(normalizedSaved)}
                  title={normalizedSaved}
                  className={`h-8 w-8 rounded border transition-all ${isActive ? 'border-white ring-2 ring-[#ea728c]' : 'border-white/30 hover:border-white/70'}`}
                  style={getColorSwatchStyle(normalizedSaved)}
                />
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
