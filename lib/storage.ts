const DEFAULT_STORAGE_BUCKET = 'dogs-images'

function normalizeBucketName(value: string | undefined): string | null {
    const trimmed = value?.trim()
    return trimmed ? trimmed : null
}

const configuredBucket = normalizeBucketName(process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET)

export const STORAGE_BUCKET = configuredBucket ?? DEFAULT_STORAGE_BUCKET

export const STORAGE_BUCKET_CANDIDATES = Array.from(
    new Set([STORAGE_BUCKET, 'dogs-images', 'website-assets'])
)

export function extractStoragePathFromPublicUrl(
    publicUrl: string,
    bucketCandidates: string[] = STORAGE_BUCKET_CANDIDATES,
): string | null {
    try {
        const url = new URL(publicUrl)
        const pathname = decodeURIComponent(url.pathname)

        for (const bucket of bucketCandidates) {
            const marker = `/storage/v1/object/public/${bucket}/`
            const markerIndex = pathname.indexOf(marker)
            if (markerIndex === -1) continue

            const path = pathname.slice(markerIndex + marker.length)
            if (path) return path
        }

        return null
    } catch {
        return null
    }
}