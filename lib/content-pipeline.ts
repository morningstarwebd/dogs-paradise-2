import { sanitizeContent as regexSanitize } from '@/lib/sanitize';

/**
 * Sanitize admin-submitted content using the lightweight regex-based
 * sanitizer (strips script/iframe/event handlers/javascript: URLs).
 * This avoids the heavy JSDOM dependency that causes Vercel timeouts.
 */
export function sanitizeContent(content: string | undefined | null): string {
    if (!content) return '';
    return regexSanitize(content);
}

export function validateSlug(slug: string): boolean {
    return /^[a-z0-9-]+$/.test(slug);
}
