/**
 * Client-side utility to notify the service worker that cached content
 * is stale and should be purged. Called after admin server-action mutations
 * so that the SW stops serving old HTML/data to public visitors.
 *
 * The SW listens for a `CACHE_BUST` message and wipes its cache store.
 * This is a no-op if no SW is registered (e.g. in dev or admin routes).
 */
export function broadcastCacheBust() {
    if (typeof navigator === 'undefined') return
    if (!('serviceWorker' in navigator)) return

    navigator.serviceWorker.ready.then((registration) => {
        registration.active?.postMessage({ type: 'CACHE_BUST' })
    }).catch(() => {
        // SW not available — ignore silently
    })
}
