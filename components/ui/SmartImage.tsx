import Image from 'next/image'
import { isValidImageUrl } from '@/lib/utils'

type SmartImageProps = {
    src: string
    alt: string
    className?: string
    dimensions?: { width: number; height: number } | null
    priority?: boolean
    sizes?: string
    fill?: boolean
}

/**
 * Smart image component that uses stored dimensions when available
 * to prevent Cumulative Layout Shift (CLS). Falls back to fill
 * layout when dimensions are unknown.
 */
export function SmartImage({
    src,
    alt,
    className,
    dimensions,
    priority = false,
    sizes,
    fill: forceFill,
}: SmartImageProps) {
    // Validate URL
    if (!isValidImageUrl(src)) {
        return (
            <div
                className={`bg-muted flex items-center justify-center ${className ?? ''}`}
                aria-label={alt}
            >
                <span className="text-xs text-muted-foreground">Invalid Image</span>
            </div>
        )
    }

    // If dimensions known and fill not forced → use explicit width/height (no CLS)
    if (dimensions?.width && dimensions?.height && !forceFill) {
        return (
            <Image
                src={src}
                alt={alt}
                width={dimensions.width}
                height={dimensions.height}
                className={className}
                priority={priority}
                sizes={sizes}
            />
        )
    }

    // Fallback → fill layout (parent must be position: relative)
    return (
        <Image
            src={src}
            alt={alt}
            fill
            className={`object-cover ${className ?? ''}`}
            priority={priority}
            sizes={sizes}
        />
    )
}
