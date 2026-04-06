'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { toStorageOnlyImage } from '@/lib/storage-only-images'
import type { HotspotItem } from './image-hotspot-types'

type ImageHotspotMapProps = {
    activeSpotId: string
    baseImage?: string
    hotspotItems: HotspotItem[]
    onSelect: (id: string) => void
}

export function ImageHotspotMap({
    activeSpotId,
    baseImage,
    hotspotItems,
    onSelect,
}: ImageHotspotMapProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 relative"
        >
            <div className="relative aspect-[4/3] sm:aspect-square lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(42,23,18,0.15)] border-8 sm:border-[12px] border-white/80 bg-[#f8f4ed]">
                <Image
                    src={toStorageOnlyImage(baseImage)}
                    alt="Puppy Health Inspection Base"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    quality={90}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />

                {hotspotItems.map((spot) => {
                    const isActive = spot.id === activeSpotId
                    const SpotIcon = spot.icon

                    return (
                        <button
                            key={spot.id}
                            onClick={() => onSelect(spot.id)}
                            className={cn('absolute group z-20 transition-transform duration-300', isActive ? 'scale-110' : 'hover:scale-105')}
                            style={{
                                left: `${spot.x}%`,
                                top: `${spot.y}%`,
                                transform: isActive ? 'translate(-50%, -50%) scale(1.1)' : 'translate(-50%, -50%)',
                            }}
                            aria-label={`View details for ${spot.title}`}
                        >
                            {isActive && (
                                <span
                                    className="absolute inset-0 rounded-full animate-ping opacity-40"
                                    style={{ backgroundColor: spot.color }}
                                />
                            )}
                            <div
                                className={cn('relative flex items-center justify-center rounded-full shadow-lg transition-colors border-2', isActive ? 'w-12 h-12' : 'w-10 h-10 bg-white/90 backdrop-blur-sm')}
                                style={{
                                    borderColor: isActive ? 'white' : 'transparent',
                                    backgroundColor: isActive ? spot.color : 'rgba(255,255,255,0.9)',
                                    color: isActive ? 'white' : spot.color,
                                }}
                            >
                                <SpotIcon size={isActive ? 22 : 18} />
                            </div>
                            {!isActive && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-black/80 text-white text-[10px] font-bold uppercase tracking-wider whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block">
                                    {spot.title}
                                </div>
                            )}
                        </button>
                    )
                })}
            </div>
        </motion.div>
    )
}
