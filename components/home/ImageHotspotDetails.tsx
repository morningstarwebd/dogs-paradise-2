'use client'

import { AnimatePresence, motion } from 'motion/react'
import { BadgeCheck } from 'lucide-react'
import type { HotspotItem } from './image-hotspot-types'

type ImageHotspotDetailsProps = {
    activeSpot: HotspotItem
}

export function ImageHotspotDetails({ activeSpot }: ImageHotspotDetailsProps) {
    const ActiveIcon = activeSpot.icon

    return (
        <div className="lg:col-span-5 relative mt-4 lg:mt-0 lg:sticky lg:top-32">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeSpot.id}
                    initial={{ opacity: 0, x: 20, y: 10 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, x: -20, y: -10 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(42,23,18,0.08)] border border-white relative overflow-hidden"
                >
                    <div
                        className="absolute -top-20 -right-20 w-64 h-64 rounded-2xl blur-[60px] opacity-100 pointer-events-none"
                        style={{ backgroundColor: activeSpot.color }}
                    />

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                            <div
                                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner"
                                style={{ backgroundColor: `${activeSpot.color}15`, color: activeSpot.color }}
                            >
                                <ActiveIcon size={26} />
                            </div>
                            <div>
                                <h3 className="text-xl sm:text-whitexl font-black text-[#FFF0D9]">
                                    {activeSpot.title}
                                </h3>
                                <span
                                    className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-2xl"
                                    style={{ backgroundColor: `${activeSpot.color}10`, color: activeSpot.color }}
                                >
                                    <BadgeCheck size={14} />
                                    Vet Certified Point
                                </span>
                            </div>
                        </div>

                        <p className="text-[#FFF0D9] font-medium text-whitease leading-relaxed mb-4">
                            {activeSpot.shortDesc}
                        </p>

                        <div className="bg-[#FFF0D9] border border-[#f0e6dc] rounded-2xl p-5 mb-2">
                            <p className="text-sm leading-[1.7] text-[#FFF0D9]">
                                {activeSpot.fullDesc}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            <p className="text-center sm:text-left text-[#ea728c]/70 text-xs font-bold uppercase tracking-widest mt-6 animate-pulse">
                ← Tap other markers
            </p>
        </div>
    )
}
