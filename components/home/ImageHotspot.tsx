'use client'

import { motion } from 'motion/react'
import { useState } from 'react'
import { getImageHotspotContent } from './image-hotspot-content'
import { getImageHotspotStyles } from './image-hotspot-styles'
import { ImageHotspotDetails } from './ImageHotspotDetails'
import { ImageHotspotMap } from './ImageHotspotMap'
import type { ImageHotspotProps } from './image-hotspot-types'

export default function ImageHotspot({
    badge_text = 'Veterinary Health Guarantee',
    badge_text_size_px = 14,
    heading = 'Health',
    heading_highlight = 'Inspection',
    heading_suffix = 'Points',
    heading_text_size_px = 56,
    subheading = 'Tap any checkpoint on our furry friend to learn exactly what our vet team examines before a puppy gets their clean bill of health.',
    description_text_size_px = 16,
    base_image,
    blocks = [],
    section_bg_color,
    section_text_color,
    decorative_blob_enabled = true,
    decorative_blob_color = '#ea728c',
    decorative_blob_size_scale = 1,
    decorative_shape_top_offset_x = 0,
    decorative_shape_top_offset_y = 0,
    decorative_shape_bottom_offset_x = 0,
    decorative_shape_bottom_offset_y = 0,
    decorative_shape_offset_x = 0,
    decorative_shape_offset_y = 0,
    decorative_outline_enabled = true,
    decorative_outline_color = '#f5c842',
    decorative_outline_size_scale = 1,
    section_padding_top,
    section_padding_bottom,
    section_margin_top,
    section_margin_bottom,
}: ImageHotspotProps) {
    const { hotspotItems, trustItems } = getImageHotspotContent(blocks)
    const [activeSpotId, setActiveSpotId] = useState<string>(hotspotItems[0].id)

    const safeActiveSpotId = hotspotItems.some((item) => item.id === activeSpotId)
        ? activeSpotId
        : hotspotItems[0].id
    const activeSpot = hotspotItems.find((item) => item.id === safeActiveSpotId) || hotspotItems[0]

    const {
        badgeTextStyle,
        decorativeStyles,
        descriptionTextStyle,
        headingTextStyle,
        sectionStyle,
        sectionTextColor,
    } = getImageHotspotStyles({
        badge_text,
        badge_text_size_px,
        heading,
        heading_highlight,
        heading_suffix,
        heading_text_size_px,
        subheading,
        description_text_size_px,
        base_image,
        blocks,
        section_bg_color,
        section_text_color,
        decorative_blob_enabled,
        decorative_blob_color,
        decorative_blob_size_scale,
        decorative_shape_top_offset_x,
        decorative_shape_top_offset_y,
        decorative_shape_bottom_offset_x,
        decorative_shape_bottom_offset_y,
        decorative_shape_offset_x,
        decorative_shape_offset_y,
        decorative_outline_enabled,
        decorative_outline_color,
        decorative_outline_size_scale,
        section_padding_top,
        section_padding_bottom,
        section_margin_top,
        section_margin_bottom,
    })

    return (
        <section className="relative overflow-hidden pt-8 pb-16 sm:pt-12 sm:pb-24" id="health-hotspot" style={sectionStyle}>
            {(decorative_blob_enabled || decorative_outline_enabled) && (
                <div className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none">
                    {decorative_blob_enabled && (
                        <>
                            <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 md:w-[500px] md:h-[500px] rounded-full rounded-tr-[80px] sm:rounded-tr-[100px] md:rounded-tr-[200px]" style={decorativeStyles.bottomBlobStyle} />
                            <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 md:w-[500px] md:h-[500px] rounded-full rounded-bl-[80px] sm:rounded-bl-[100px] md:rounded-bl-[200px]" style={decorativeStyles.topBlobStyle} />
                        </>
                    )}
                    {decorative_outline_enabled && (
                        <>
                            <div className="absolute -bottom-8 -left-8 sm:-bottom-[16px] sm:-left-[16px] md:-bottom-[25px] md:-left-[25px] w-[208px] h-[208px] sm:w-[288px] sm:h-[288px] md:w-[550px] md:h-[550px] border-[3px] sm:border-[4px] rounded-full rounded-tr-[80px] sm:rounded-tr-[100px] md:rounded-tr-[200px] opacity-80" style={decorativeStyles.bottomOutlineStyle} />
                            <div className="absolute -top-8 -right-8 sm:-top-[16px] sm:-right-[16px] md:-top-[25px] md:-right-[25px] w-[208px] h-[208px] sm:w-[288px] sm:h-[288px] md:w-[550px] md:h-[550px] border-[3px] sm:border-[4px] rounded-full rounded-bl-[80px] sm:rounded-bl-[100px] md:rounded-bl-[200px] opacity-80" style={decorativeStyles.topOutlineStyle} />
                        </>
                    )}
                </div>
            )}

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-4 text-center mb-10 sm:mb-16 max-w-3xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center justify-center gap-3 mb-2">
                        <div className="w-8 h-[2px] bg-[#ea728c]" />
                        <span className="text-[#ea728c] font-bold uppercase tracking-[0.2em]" style={badgeTextStyle}>{badge_text}</span>
                        <div className="w-8 h-[2px] bg-[#ea728c]" />
                    </motion.div>

                    <motion.h2 initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }} className="font-display text-whitexl sm:text-4xl lg:text-whitexl font-bold text-[#FFF0D9] leading-tight" style={{ ...headingTextStyle, ...(sectionTextColor ? { color: sectionTextColor } : undefined) }}>
                        {heading} <span className="text-[#ea728c]">{heading_highlight}</span> {heading_suffix}
                    </motion.h2>

                    <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-[#FFF0D9] text-sm sm:text-whitease font-medium mx-auto max-w-2xl" style={{ ...descriptionTextStyle, ...(sectionTextColor ? { color: sectionTextColor } : undefined) }}>
                        {subheading}
                    </motion.p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
                    <ImageHotspotMap
                        activeSpotId={safeActiveSpotId}
                        baseImage={base_image}
                        hotspotItems={hotspotItems}
                        onSelect={setActiveSpotId}
                    />
                    <ImageHotspotDetails activeSpot={activeSpot} />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="mt-12 sm:mt-20 flex flex-wrap items-center justify-center gap-4 sm:gap-6"
                >
                    {trustItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-2 bg-white/70 backdrop-blur-md rounded-2xl px-5 py-2.5 shadow-sm border border-white/50">
                            <item.icon size={16} className="text-[#ea728c]" />
                            <span className="text-[12px] sm:text-[14px] font-black text-[#FFF0D9] uppercase tracking-wide">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
