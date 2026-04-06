/**
 * Sanitize MDX/HTML content by stripping dangerous tags and attributes.
 * This runs on save (admin-side) to prevent XSS in rendered content.
 */

const JAVASCRIPT_URLS = /\b(href|src|action)\s*=\s*["']?\s*javascript\s*:/gi
const DATA_URLS = /\b(href|src)\s*=\s*["']?\s*data\s*:\s*text\/html/gi

export function sanitizeContent(raw: string): string {
    if (!raw) return raw

    let sanitized = raw
    // Strip dangerous tags (script, iframe, object, embed, etc.)
    const tagRemovalRegex = /<(script|iframe|object|embed|applet|meta|link)[^>]*>[\s\S]*?<\/\1>|<(script|iframe|object|embed|applet|meta|link)[^>]*\/?>(?![\s\S]*?<\/\1>)/gi
    sanitized = sanitized.replace(tagRemovalRegex, '')

    // Strip inline event handlers (onclick, onload, etc.)
    const eventHandlerRegex = /\s(on\w+)=['"][^'"]*['"]/gi
    sanitized = sanitized.replace(eventHandlerRegex, '')
        // Remove javascript: URLs
        .replace(JAVASCRIPT_URLS, '')
        // Remove data:text/html URLs
        .replace(DATA_URLS, '')

    // Trim consecutive blank lines (max 2)
    sanitized = sanitized.replace(/\n{4,}/g, '\n\n\n')

    return sanitized.trim()
}
