import type { CSSProperties } from 'react';
import { normalizeDecorativeColorValue } from '@/lib/decorative-color';

const GRADIENT_PATTERN = /(?:repeating-)?(?:linear|radial|conic)-gradient\s*\(/i;
const GRADIENT_SHORTHAND_START_PATTERN = /^\s*(?:to\s+[a-z\s-]+|-?\d+(?:\.\d+)?deg)\s*,/i;
const EXPLICIT_COLOR_TOKEN_PATTERN = /#(?:[\da-fA-F]{8}|[\da-fA-F]{6}|[\da-fA-F]{4}|[\da-fA-F]{3})(?![\da-fA-F])|(?:rgb|rgba|hsl|hsla)\([^\)]+\)|var\([^\)]+\)/i;
const NUMERIC_GRADIENT_TOKEN_PATTERN = /^-?\d+(?:\.\d+)?(?:deg|rad|turn|grad|%|px|rem|em|vh|vw)$/i;
const HEX_COLOR_PATTERN = /^#(?:[\da-fA-F]{8}|[\da-fA-F]{6}|[\da-fA-F]{4}|[\da-fA-F]{3})$/;
const VAR_COLOR_PATTERN = /^var\([^\)]+\)$/i;
const COLOR_FUNCTION_PATTERN = /^(?:rgb|rgba|hsl|hsla|lab|lch|oklab|oklch|color|color-mix)\([^\)]+\)$/i;
const NAMED_COLOR_PATTERN = /^[a-z]+$/i;
const NON_COLOR_STOP_TOKENS = new Set([
  'to',
  'at',
  'from',
  'in',
  'circle',
  'ellipse',
  'closest-side',
  'closest-corner',
  'farthest-side',
  'farthest-corner',
]);
const STYLE_DECLARATION_PREFIX_PATTERN = /^(?:(?:background(?:-image|-color)?|color)\s*:\s*)+/i;

function normalizeString(value: unknown): string {
  if (typeof value !== 'string') return '';

  let normalized = value.trim();
  if (!normalized) return '';

  // Users sometimes paste full declarations like "background: linear-gradient(...)".
  // Inline React style values must contain only the value token.
  normalized = normalized.replace(STYLE_DECLARATION_PREFIX_PATTERN, '').trim();

  // Trailing semicolons make React warn and can invalidate parsing paths.
  normalized = normalized.replace(/;+\s*$/g, '').trim();

  return normalized;
}

function normalizeGradientCandidate(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';

  const normalizedDecorative = normalizeDecorativeColorValue(trimmed, trimmed).trim();
  if (normalizedDecorative && normalizedDecorative !== trimmed) {
    return normalizedDecorative;
  }

  if (GRADIENT_PATTERN.test(trimmed)) {
    return trimmed;
  }

  const explicitColorTokenCount = (trimmed.match(new RegExp(EXPLICIT_COLOR_TOKEN_PATTERN.source, 'gi')) ?? []).length;
  if (GRADIENT_SHORTHAND_START_PATTERN.test(trimmed) || explicitColorTokenCount >= 2) {
    return `linear-gradient(${trimmed})`;
  }

  return trimmed;
}

function isSolidColorValue(value: string): boolean {
  return (
    HEX_COLOR_PATTERN.test(value) ||
    VAR_COLOR_PATTERN.test(value) ||
    COLOR_FUNCTION_PATTERN.test(value) ||
    NAMED_COLOR_PATTERN.test(value)
  );
}

function extractKeywordColorFromGradient(value: string): string {
  const gradientMatch = value.match(/(?:repeating-)?(?:linear|radial|conic)-gradient\s*\(([\s\S]+)\)/i);
  if (!gradientMatch) return '';

  const gradientBody = gradientMatch[1];
  const segments = gradientBody.split(',');
  for (const segment of segments) {
    const trimmedSegment = segment.trim();
    if (!trimmedSegment) continue;

    const explicitTokenMatch = trimmedSegment.match(EXPLICIT_COLOR_TOKEN_PATTERN);
    if (explicitTokenMatch) return explicitTokenMatch[0];

    const firstToken = trimmedSegment.split(/\s+/)[0]?.toLowerCase();
    if (!firstToken) continue;
    if (NON_COLOR_STOP_TOKENS.has(firstToken)) continue;
    if (NUMERIC_GRADIENT_TOKEN_PATTERN.test(firstToken)) continue;
    if (/^[a-z][a-z-]*$/i.test(firstToken)) {
      return firstToken;
    }
  }

  return '';
}

export function isGradientValue(value: unknown): value is string {
  const normalized = normalizeString(value);
  return normalized.length > 0 && GRADIENT_PATTERN.test(normalized);
}

function extractFirstSolidColor(value: string): string {
  const hexMatch = value.match(/#(?:[\da-fA-F]{8}|[\da-fA-F]{6}|[\da-fA-F]{4}|[\da-fA-F]{3})(?![\da-fA-F])/);
  if (hexMatch) return hexMatch[0];

  const fnColorMatch = value.match(/(?:rgb|rgba|hsl|hsla)\([^\)]+\)/i);
  if (fnColorMatch) return fnColorMatch[0];

  const variableColorMatch = value.match(/var\([^\)]+\)/i);
  if (variableColorMatch) return variableColorMatch[0];

  const keywordColorMatch = extractKeywordColorFromGradient(value);
  if (keywordColorMatch) return keywordColorMatch;

  return '';
}

export function resolveColorToken(value: unknown, fallback = ''): string {
  const normalizedInput = normalizeString(value);
  const normalized = normalizeGradientCandidate(normalizedInput) || fallback;
  if (!normalized) return '';

  if (isGradientValue(normalized)) {
    return extractFirstSolidColor(normalized) || fallback;
  }

  if (!isSolidColorValue(normalized)) {
    return fallback;
  }

  return normalized;
}

export function resolveBackgroundStyle(value: unknown, fallback = ''): CSSProperties {
  const normalizedInput = normalizeString(value);
  const normalized = normalizeGradientCandidate(normalizedInput) || fallback;
  if (!normalized) return {};

  if (isGradientValue(normalized)) {
    return { background: normalized };
  }

  return { backgroundColor: normalized };
}

export function buildSectionStyle(options: {
  background?: unknown;
  backgroundFallback?: string;
  text?: unknown;
  paddingTop?: unknown;
  paddingBottom?: unknown;
  marginTop?: unknown;
  marginBottom?: unknown;
}): CSSProperties {
  const textColor = resolveColorToken(options.text);

  const style: CSSProperties = {
    ...resolveBackgroundStyle(options.background, options.backgroundFallback || ''),
    color: textColor || undefined,
    paddingTop: normalizeString(options.paddingTop) || undefined,
    paddingBottom: normalizeString(options.paddingBottom) || undefined,
    marginTop: normalizeString(options.marginTop) || undefined,
    marginBottom: normalizeString(options.marginBottom) || undefined,
  };

  if (textColor) {
    (style as Record<string, string>)['--text-primary'] = textColor;
    (style as Record<string, string>)['--text-secondary'] = textColor;
    (style as Record<string, string>)['--text-tertiary'] = textColor;
  }

  return style;
}
