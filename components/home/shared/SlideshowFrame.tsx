import type { CSSProperties, Dispatch, SetStateAction } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import { InlineEditable } from '@/components/admin/InlineEditable'
import type { BlockInstance } from '@/types/schema.types'

type SlideshowFrameProps = {
    slides: BlockInstance[]
    currentSlide: number
    activeImage: string
    activeAlt: string
    frameClassName: string
    frameStyle: CSSProperties
    imageSizes: string
    imageQuality: number
    editable?: {
        isEditorMode?: boolean
        sectionId?: string
    }
    indicators?: {
        accentColor: string
        setCurrentSlide: Dispatch<SetStateAction<number>>
    }
}

export function SlideshowFrame({
    slides,
    currentSlide,
    activeImage,
    activeAlt,
    frameClassName,
    frameStyle,
    imageSizes,
    imageQuality,
    editable,
    indicators,
}: SlideshowFrameProps) {
    const image = (
        <Image src={activeImage} alt={activeAlt} fill className="object-cover" priority sizes={imageSizes} quality={imageQuality} />
    )

    return (
        <motion.div className={frameClassName} style={frameStyle}>
            <AnimatePresence mode="popLayout">
                <motion.div key={currentSlide} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1, ease: 'easeInOut' }} className="absolute inset-0">
                    {editable ? (
                        <InlineEditable isEditorMode={editable.isEditorMode} editType="image" sectionId={editable.sectionId} propKey={`block:${slides[currentSlide]?.id}:image`} blockId={slides[currentSlide]?.id} blockIndex={currentSlide} value={activeImage} className="w-full h-full">
                            {image}
                        </InlineEditable>
                    ) : image}
                </motion.div>
            </AnimatePresence>

            {indicators && slides.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => indicators.setCurrentSlide(index)}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentSlide ? 'scale-125' : 'bg-black/60 hover:bg-black/80'}`}
                            style={index === currentSlide ? { backgroundColor: indicators.accentColor } : undefined}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </motion.div>
    )
}
