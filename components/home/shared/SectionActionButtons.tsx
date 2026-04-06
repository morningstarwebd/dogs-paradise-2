import type { CSSProperties } from 'react'
import Link from 'next/link'
import { Phone } from 'lucide-react'
import { normalizeDecorativeColorValue } from '@/lib/decorative-color'
import { resolveBackgroundStyle, resolveColorToken } from '@/lib/gradient-style'
import { InlineEditable } from '@/components/admin/InlineEditable'
import type { BlockInstance } from '@/types/schema.types'

type SectionActionButtonsProps = {
    mode: 'desktop' | 'mobile'
    buttons: BlockInstance[]
    isEditorMode?: boolean
    sectionId?: string
    phoneAction?: {
        href: string
        backgroundStyle: CSSProperties
        color: string
        buttonSize: number
        iconSize: number
    }
}

function getButtonStyles(settings: Record<string, unknown>, mode: 'desktop' | 'mobile') {
    const rawColor = typeof settings.color === 'string' ? settings.color.trim() : ''
    const normalizedButtonColor = normalizeDecorativeColorValue(rawColor || '#ea728c', '#ea728c')
    const resolvedButtonColor = resolveColorToken(normalizedButtonColor, '#ea728c') || '#ea728c'
    const isOutline = settings.style === 'outline' || resolvedButtonColor.toLowerCase() === 'transparent'
    const buttonBackgroundStyle = isOutline ? { backgroundColor: 'transparent' as const } : resolveBackgroundStyle(normalizedButtonColor, resolvedButtonColor)
    const rawTextColor = typeof settings.text_color === 'string' ? settings.text_color.trim() : ''
    const normalizedTextColor = normalizeDecorativeColorValue(rawTextColor, '#ffffff')
    const resolvedTextColor = resolveColorToken(normalizedTextColor, '#ffffff') || '#ffffff'
    const parsedSize = typeof settings.button_size_scale === 'number' ? settings.button_size_scale : Number(settings.button_size_scale)
    const sizeScale = Math.min(1.6, Math.max(0.7, Number.isFinite(parsedSize) ? parsedSize : 1))
    const textSize = typeof settings.text_size === 'string' ? settings.text_size.toLowerCase().trim() : 'medium'

    return mode === 'desktop'
        ? {
            buttonBackgroundStyle,
            isOutline,
            borderColor: isOutline ? 'rgba(255,255,255,0.4)' : resolvedButtonColor,
            color: resolvedTextColor,
            paddingInline: `${Math.round(32 * sizeScale)}px`,
            paddingBlock: `${Math.round(16 * sizeScale)}px`,
            textSizeClass: textSize === 'large' ? 'text-lg' : textSize === 'small' ? 'text-sm' : 'text-base',
        }
        : {
            buttonBackgroundStyle,
            isOutline,
            borderColor: isOutline ? 'rgba(255,255,255,0.4)' : resolvedButtonColor,
            color: resolvedTextColor,
            paddingInline: `${Math.round(10 * sizeScale)}px`,
            paddingBlock: `${Math.round(12 * sizeScale)}px`,
            textSizeClass: textSize === 'large' ? 'text-[13px]' : textSize === 'small' ? 'text-[11px]' : 'text-[12px]',
        }
}

export function SectionActionButtons({ mode, buttons, isEditorMode, sectionId, phoneAction }: SectionActionButtonsProps) {
    const containerClass = mode === 'desktop' ? 'flex flex-wrap gap-4 mb-12' : 'flex flex-wrap gap-2 justify-center mb-4 px-2 max-w-[350px] mx-auto'

    return (
        <div className={containerClass}>
            {buttons.map((button, index) => {
                const settings = (button.settings || {}) as Record<string, unknown>
                const href = (settings.url as string) || '#'
                const text = (settings.text as string) || 'Click'
                const openInNewTab = Boolean(settings.open_new_tab)
                const styles = getButtonStyles(settings, mode)
                const className = mode === 'desktop'
                    ? `inline-flex items-center gap-2 ${styles.textSizeClass} font-bold rounded-2xl transition-transform duration-300 hover:-translate-y-1 ${styles.isOutline ? 'border-2 backdrop-blur hover:bg-white/10' : ''}`
                    : `flex-1 inline-flex items-center justify-center gap-1.5 ${styles.textSizeClass} whitespace-nowrap font-bold rounded-2xl active:scale-95 transition-all shadow-sm ${styles.isOutline ? 'border-2 backdrop-blur' : ''}`
                const content = mode === 'desktop'
                    ? (
                        <InlineEditable isEditorMode={isEditorMode} editType="button" sectionId={sectionId} propKey={`block:${button.id}:text`} blockId={button.id} blockIndex={index} value={text}>
                            {text}
                        </InlineEditable>
                    )
                    : text
                const style = {
                    ...styles.buttonBackgroundStyle,
                    borderColor: styles.borderColor,
                    color: styles.color,
                    paddingInline: styles.paddingInline,
                    paddingBlock: styles.paddingBlock,
                }

                if (openInNewTab || href.startsWith('http')) {
                    return <a key={button.id} href={href} target="_blank" rel="noopener noreferrer" style={style} className={className}>{content}</a>
                }

                return <Link key={button.id} href={href} style={style} className={className}>{content}</Link>
            })}

            {phoneAction && (
                <a
                    href={phoneAction.href}
                    className={mode === 'desktop'
                        ? 'inline-flex shrink-0 items-center justify-center rounded-2xl shadow-sm border border-gray-100 transition-transform duration-300 hover:-translate-y-1'
                        : 'inline-flex shrink-0 items-center justify-center rounded-2xl shadow-sm border border-gray-100 active:scale-95 transition-all'}
                    style={{ ...phoneAction.backgroundStyle, color: phoneAction.color, width: `${phoneAction.buttonSize}px`, height: `${phoneAction.buttonSize}px` }}
                    aria-label="Call"
                >
                    <Phone size={phoneAction.iconSize} />
                </a>
            )}
        </div>
    )
}
