'use client'

import { motion } from 'motion/react'
import { useState, type CSSProperties } from 'react'
import SectionHeading from '@/components/ui/SectionHeading'
import { fadeUpVariant, staggerContainer } from '@/lib/animations'
import { siteConfig } from '@/data/site-config'
import { buildSectionStyle, resolveColorToken } from '@/lib/gradient-style'
import { FAQAccordionItem } from './FAQAccordionItem'
import { getFaqItems } from './faq-section-content'
import type { FAQSectionProps } from './faq-section-types'

export default function FAQSection({
    heading = 'Frequently Asked Questions',
    subheading = `Everything you should know before choosing a puppy from ${siteConfig.brandName}.`,
    blocks = [],
    sectionId,
    isEditorMode = false,
    section_bg_color,
    section_text_color,
    section_padding_top,
    section_padding_bottom,
    section_margin_top,
    section_margin_bottom,
}: FAQSectionProps) {
    const [openIdx, setOpenIdx] = useState<number | null>(0)
    const faqItems = getFaqItems(blocks)

    const sectionStyle: CSSProperties = buildSectionStyle({
        background: section_bg_color,
        text: section_text_color,
        paddingTop: section_padding_top,
        paddingBottom: section_padding_bottom,
        marginTop: section_margin_top,
        marginBottom: section_margin_bottom,
    })
    const sectionTextColor = resolveColorToken(section_text_color)

    return (
        <section className="section-shell bg-[var(--color-surface)]" id="faq" style={sectionStyle}>
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <SectionHeading title={heading} subtitle={subheading} useGradientTitle={!sectionTextColor} />

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                    className="space-y-3"
                >
                    {faqItems.map((faq, index) => (
                        <motion.div key={faq.id} variants={fadeUpVariant}>
                            <FAQAccordionItem
                                faq={faq}
                                isEditorMode={isEditorMode}
                                isOpen={openIdx === index}
                                sectionId={sectionId}
                                sectionTextColor={sectionTextColor || undefined}
                                onToggle={() => setOpenIdx(openIdx === index ? null : index)}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
