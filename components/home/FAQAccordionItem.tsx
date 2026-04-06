'use client'

import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { InlineEditable } from '@/components/admin/InlineEditable'
import { cn } from '@/lib/utils'
import type { FAQItem } from './faq-section-types'

type FAQAccordionItemProps = {
    faq: FAQItem
    isEditorMode: boolean
    isOpen: boolean
    sectionId?: string
    sectionTextColor?: string
    onToggle: () => void
}

export function FAQAccordionItem({
    faq,
    isEditorMode,
    isOpen,
    sectionId,
    sectionTextColor,
    onToggle,
}: FAQAccordionItemProps) {
    return (
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
            <button
                onClick={onToggle}
                className="relative z-10 flex w-full items-start gap-4 p-5 text-left"
                aria-expanded={isOpen}
            >
                <div
                    className={cn(
                        'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors duration-200',
                        isOpen
                            ? 'bg-[var(--accent-primary)] text-white'
                            : 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]',
                    )}
                >
                    <HelpCircle size={16} />
                </div>
                <span
                    className={cn(
                        'flex-1 pt-1 text-sm font-semibold transition-colors duration-200',
                        !sectionTextColor && isOpen
                            ? 'text-[var(--text-primary)]'
                            : !sectionTextColor
                                ? 'text-[var(--text-secondary)]'
                                : '',
                    )}
                    style={sectionTextColor ? { color: sectionTextColor } : undefined}
                >
                    <InlineEditable
                        isEditorMode={isEditorMode}
                        sectionId={sectionId}
                        propKey={faq.questionKey}
                        editType="text"
                        blockId={faq.blockId}
                        as="span"
                    >
                        {faq.question}
                    </InlineEditable>
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-1 shrink-0 text-[var(--text-tertiary)]"
                >
                    <ChevronDown size={18} />
                </motion.div>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="border-t border-[var(--color-border)] px-5 pb-5 pl-[72px] pt-4">
                            <InlineEditable
                                isEditorMode={isEditorMode}
                                sectionId={sectionId}
                                propKey={faq.answerKey}
                                editType="textarea"
                                blockId={faq.blockId}
                                as="p"
                                className={cn('text-sm leading-relaxed', !sectionTextColor ? 'text-[var(--text-secondary)]' : '')}
                            >
                                <span style={sectionTextColor ? { color: sectionTextColor } : undefined}>{faq.answer}</span>
                            </InlineEditable>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
