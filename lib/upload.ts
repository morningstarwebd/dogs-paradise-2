import { createClient } from '@/lib/supabase/client'
import { STORAGE_BUCKET, STORAGE_BUCKET_CANDIDATES } from '@/lib/storage'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const WEBP_QUALITY = 0.95
const MAX_DIMENSION = 7680 // px — downscale only extremely large images
const NON_REENCODE_TYPES = new Set(['image/png', 'image/gif', 'image/webp'])
const EXPECTED_BUCKETS_LABEL = STORAGE_BUCKET_CANDIDATES.join(', ')

function isBucketNotFoundMessage(message: string): boolean {
    const lower = message.toLowerCase()
    return lower.includes('bucket') && lower.includes('not found')
}

function isMissingMediaTableMessage(message: string): boolean {
    const lower = message.toLowerCase()
    return lower.includes('media_files') && lower.includes('does not exist')
}

/**
 * Load a File into an HTMLImageElement.
 */
function loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new window.Image()
        img.onload = () => {
            resolve(img)
        }
        img.onerror = () => {
            URL.revokeObjectURL(img.src)
            reject(new Error('Failed to read image'))
        }
        img.src = URL.createObjectURL(file)
    })
}

/**
 * Convert an image File to WebP via Canvas, with optional down-scaling.
 * Returns the converted Blob and final dimensions.
 */
async function convertToWebP(
    file: File,
): Promise<{ blob: Blob; width: number; height: number }> {
    const img = await loadImage(file)
    let { naturalWidth: w, naturalHeight: h } = img

    // Down-scale if exceeding max dimension (keep aspect ratio)
    if (w > MAX_DIMENSION || h > MAX_DIMENSION) {
        const ratio = Math.min(MAX_DIMENSION / w, MAX_DIMENSION / h)
        w = Math.round(w * ratio)
        h = Math.round(h * ratio)
    }

    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0, w, h)
    URL.revokeObjectURL(img.src)

    const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
            (b) => (b ? resolve(b) : reject(new Error('WebP conversion failed'))),
            'image/webp',
            WEBP_QUALITY,
        )
    })

    return { blob, width: w, height: h }
}

export async function uploadToSupabase(file: File, folder: string = 'general'): Promise<string> {
    // Validate file size (before conversion)
    if (file.size > MAX_FILE_SIZE) {
        throw new Error('File size must be less than 5MB')
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error('Only JPG, PNG, WebP, and GIF files are allowed')
    }

    // Convert to WebP for photo-like inputs only.
    // Keep PNG/GIF/WEBP as-is so logos and line-art stay crisp.
    let uploadBlob: Blob | File = file
    let dimensions: { width: number; height: number } | null = null
    const shouldConvertToWebP = !NON_REENCODE_TYPES.has(file.type)

    if (shouldConvertToWebP) {
        try {
            const result = await convertToWebP(file)
            uploadBlob = result.blob
            dimensions = { width: result.width, height: result.height }
        } catch {
            // Fallback: upload original file if conversion fails
            try {
                const img = await loadImage(file)
                dimensions = { width: img.naturalWidth, height: img.naturalHeight }
                URL.revokeObjectURL(img.src)
            } catch {
                // Non-fatal: proceed without dimensions
            }
        }
    } else {
        try {
            const img = await loadImage(file)
            dimensions = { width: img.naturalWidth, height: img.naturalHeight }
            URL.revokeObjectURL(img.src)
        } catch {
            // Non-fatal: proceed without dimensions
        }
    }

    const supabase = createClient()
    
    // Always use .webp extension when converted, otherwise keep original
    // Use the original filename without prepending a code/timestamp
    const baseName = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9.-]/g, '_')
    const convertedToWebP = uploadBlob instanceof Blob && !(uploadBlob instanceof File)
    const ext = convertedToWebP ? 'webp' : (file.name.split('.').pop() || 'jpg')
    const filePath = `${folder}/${baseName}.${ext}`

    let uploadedBucket = STORAGE_BUCKET
    let uploadFailedMessage: string | null = null
    let uploaded = false

    for (const candidateBucket of STORAGE_BUCKET_CANDIDATES) {
        const { error } = await supabase.storage
            .from(candidateBucket)
            .upload(filePath, uploadBlob, {
                cacheControl: '3600', // 1 hour — avoids stale image after admin replacements
                contentType: convertedToWebP ? 'image/webp' : file.type,
                upsert: true, // Allow overwriting files with the exact same name
            })

        if (!error) {
            uploaded = true
            uploadedBucket = candidateBucket
            break
        }

        if (!isBucketNotFoundMessage(error.message)) {
            throw new Error(`Upload failed: ${error.message}`)
        }

        uploadFailedMessage = error.message
    }

    if (!uploaded) {
        if (uploadFailedMessage && isBucketNotFoundMessage(uploadFailedMessage)) {
            throw new Error(`Upload failed: Storage bucket not configured in Supabase. Expected one of: ${EXPECTED_BUCKETS_LABEL}`)
        }

        throw new Error(`Upload failed: ${uploadFailedMessage ?? 'Unknown storage error'}`)
    }

    const { data: urlData } = supabase.storage
        .from(uploadedBucket)
        .getPublicUrl(filePath)

    const publicUrl = urlData.publicUrl

    // Save to media_files table with dimensions
    const { error: mediaError } = await supabase.from('media_files').upsert({
        url: publicUrl,
        width: dimensions?.width ?? null,
        height: dimensions?.height ?? null,
        file_name: file.name,
        file_size: uploadBlob.size,
    }, { onConflict: 'url' })

    if (mediaError && !isMissingMediaTableMessage(mediaError.message)) {
        // Metadata sync should not block a completed file upload.
        console.warn('Failed to save media metadata:', mediaError.message)
    }

    return publicUrl
}
