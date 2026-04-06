const svgMarkup = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
  <defs>
    <linearGradient id="bg" x1="0%" x2="100%" y1="0%" y2="100%">
      <stop offset="0%" stop-color="#f7ead9"/>
      <stop offset="100%" stop-color="#f3c8d2"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="900" fill="url(#bg)"/>
  <rect x="110" y="110" width="980" height="680" rx="48" fill="#ffffff" fill-opacity="0.76" stroke="#ea728c" stroke-opacity="0.24" stroke-width="6"/>
  <text x="600" y="400" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="52" font-weight="700" fill="#7f2943">Image Required</text>
  <text x="600" y="468" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="#6d5b61">Upload this image from the admin panel via Supabase Storage.</text>
  <text x="600" y="520" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="#8b7c82">Local /images assets are disabled.</text>
</svg>`

export const STORAGE_ONLY_IMAGE_PLACEHOLDER = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgMarkup.trim())}`

export function isLocalImageAsset(value: unknown): value is string {
    return typeof value === 'string' && value.trim().startsWith('/images/')
}

export function toStorageOnlyImage(value: unknown, fallback: string = STORAGE_ONLY_IMAGE_PLACEHOLDER): string {
    if (typeof value !== 'string') return fallback
    const trimmed = value.trim()
    if (!trimmed || isLocalImageAsset(trimmed)) return fallback
    return trimmed
}

export function toStorageOnlyImageOrNull(value: unknown): string | null {
    if (typeof value !== 'string') return null
    const trimmed = value.trim()
    if (!trimmed || isLocalImageAsset(trimmed)) return null
    return trimmed
}
