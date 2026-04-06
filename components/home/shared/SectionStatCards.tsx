import type { CSSProperties, ReactNode } from 'react'
import { motion } from 'motion/react'
import { Award, Users } from 'lucide-react'
import { normalizeDecorativeColorValue } from '@/lib/decorative-color'
import { resolveColorToken } from '@/lib/gradient-style'
import { InlineEditable } from '@/components/admin/InlineEditable'
import type { BlockInstance } from '@/types/schema.types'

export type SectionStatConfig = {
    cardBackgroundStyle: CSSProperties
    valueTextSizeDesktop: number
    valueTextSizeMobile: number
    labelTextSizeDesktop: number
    labelTextSizeMobile: number
    valueTextColor: string
    labelTextColor: string
}

type SharedStatProps = {
    stats: BlockInstance[]
    getIcon: (iconName: string | undefined, fallback: ReactNode) => ReactNode
}

type SectionStatGridProps = SharedStatProps & {
    inView: boolean
    show?: boolean
    statConfigs: SectionStatConfig[]
    isEditorMode?: boolean
    sectionId?: string
}

type FloatingSectionStatsProps = SharedStatProps & {
    show?: boolean
    sizeVariant: string
    statConfigs: {
        mobileTop: SectionStatConfig
        mobileRight: SectionStatConfig
        mobileBottom: SectionStatConfig
    }
}

function getAccentColor(stat: BlockInstance | undefined, fallback: string) {
    const rawColor = typeof stat?.settings?.color === 'string' ? stat.settings.color : undefined
    return resolveColorToken(normalizeDecorativeColorValue(rawColor, fallback), fallback) || fallback
}

function getFloatingClasses(sizeVariant: string) {
    if (sizeVariant === 'large') return {
        top: 'absolute left-2 top-5 sm:left-4 sm:top-7 bg-white/95 backdrop-blur-sm rounded-2xl px-3 py-1.5 shadow-lg flex items-center gap-1.5 border border-white z-20 animate-[float_6s_ease-in-out_infinite] max-w-[116px]',
        right: 'absolute right-2 top-[36%] sm:right-4 sm:top-[35%] bg-white/95 backdrop-blur-sm rounded-2xl h-12 min-w-[56px] max-w-[86px] px-2 shadow-lg flex flex-col items-center justify-center border border-white z-20 animate-[float_8s_ease-in-out_infinite_reverse] overflow-hidden',
        bottom: 'absolute left-2 bottom-6 sm:left-4 sm:bottom-8 bg-white/95 backdrop-blur-sm rounded-2xl px-3 py-1.5 shadow-lg flex items-center gap-1.5 border border-white z-20 animate-[float_7s_ease-in-out_infinite] max-w-[116px]',
    }
    if (sizeVariant === 'small') return {
        top: 'absolute left-1 top-5 sm:left-2 sm:top-6 bg-white/95 backdrop-blur-sm rounded-2xl px-3 py-1.5 shadow-lg flex items-center gap-1.5 border border-white z-20 animate-[float_6s_ease-in-out_infinite] max-w-[116px]',
        right: 'absolute right-1 top-[34%] sm:right-2 sm:top-[35%] bg-white/95 backdrop-blur-sm rounded-2xl h-12 min-w-[56px] max-w-[86px] px-2 shadow-lg flex flex-col items-center justify-center border border-white z-20 animate-[float_8s_ease-in-out_infinite_reverse] overflow-hidden',
        bottom: 'absolute left-1 bottom-5 sm:left-2 sm:bottom-6 bg-white/95 backdrop-blur-sm rounded-2xl px-3 py-1.5 shadow-lg flex items-center gap-1.5 border border-white z-20 animate-[float_7s_ease-in-out_infinite] max-w-[116px]',
    }
    return {
        top: 'absolute left-1 top-7 sm:left-3 sm:top-8 bg-white/95 backdrop-blur-sm rounded-2xl px-3 py-1.5 shadow-lg flex items-center gap-1.5 border border-white z-20 animate-[float_6s_ease-in-out_infinite] max-w-[116px]',
        right: 'absolute right-1 top-[35%] sm:right-3 sm:top-[35%] bg-white/95 backdrop-blur-sm rounded-2xl h-12 min-w-[56px] max-w-[86px] px-2 shadow-lg flex flex-col items-center justify-center border border-white z-20 animate-[float_8s_ease-in-out_infinite_reverse] overflow-hidden',
        bottom: 'absolute left-1 bottom-7 sm:left-3 sm:bottom-8 bg-white/95 backdrop-blur-sm rounded-2xl px-3 py-1.5 shadow-lg flex items-center gap-1.5 border border-white z-20 animate-[float_7s_ease-in-out_infinite] max-w-[116px]',
    }
}

export function SectionStatGrid({ inView, show = true, stats, statConfigs, getIcon, isEditorMode, sectionId }: SectionStatGridProps) {
    if (!show || stats.length === 0) return null
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.4 }} className="grid gap-4 auto-rows-fr items-stretch" style={{ gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, minmax(0, 1fr))` }}>
            {stats.map((stat, index) => {
                const settings = stat.settings || {}
                const color = getAccentColor(stat, '#16a34a')
                const value = (settings.value as string) || '—'
                const label = (settings.label as string) || 'Stat'
                const statConfig = statConfigs[index]
                return (
                    <InlineEditable key={stat.id} isEditorMode={isEditorMode} sectionId={sectionId} propKey={`block:${stat.id}:value`} blockId={stat.id} blockIndex={index} value={value} as="div" className="h-full w-full" containerMode>
                        <div className="flex h-[132px] w-full min-w-0 flex-col items-center justify-center overflow-hidden rounded-2xl border border-white bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md" style={statConfig.cardBackgroundStyle}>
                            <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-2" style={{ backgroundColor: `${color}15`, color }}>{getIcon(settings.icon as string | undefined, <Users size={18} />)}</div>
                            <span className="block w-full max-w-full truncate whitespace-nowrap text-center font-bold text-gray-800" style={{ color: statConfig.valueTextColor, fontSize: `${statConfig.valueTextSizeDesktop}px`, lineHeight: 1.1 }}>{value}</span>
                            <span className="block w-full max-w-full truncate whitespace-nowrap text-center font-bold uppercase tracking-wider text-gray-600" style={{ color: statConfig.labelTextColor, fontSize: `${statConfig.labelTextSizeDesktop}px`, lineHeight: 1.1 }}>{label}</span>
                        </div>
                    </InlineEditable>
                )
            })}
        </motion.div>
    )
}

export function FloatingSectionStats({ show = true, stats, sizeVariant, statConfigs, getIcon }: FloatingSectionStatsProps) {
    if (!show || stats.length === 0) return null
    const classes = getFloatingClasses(sizeVariant)
    const topStat = stats[0]
    const rightStat = stats[1]
    const bottomStat = stats[2]

    return (
        <>
            {topStat && <div className={classes.top} style={statConfigs.mobileTop.cardBackgroundStyle}><div className="scale-75" style={{ color: getAccentColor(topStat, '#16a34a') }}>{getIcon(topStat.settings?.icon as string | undefined, <Users size={18} />)}</div><span className="font-black text-gray-800 pr-1 max-w-[72px] truncate" style={{ color: statConfigs.mobileTop.valueTextColor, fontSize: `${statConfigs.mobileTop.valueTextSizeMobile}px`, lineHeight: 1.1 }}>{(topStat.settings?.value as string) || '2000+'}</span></div>}
            {rightStat && <div className={classes.right} style={statConfigs.mobileRight.cardBackgroundStyle}><span className="font-black leading-none max-w-full truncate text-center" style={{ color: statConfigs.mobileRight.valueTextColor, fontSize: `${statConfigs.mobileRight.valueTextSizeMobile}px` }}>{(rightStat.settings?.value as string) || '25+'}</span><span className="font-bold text-gray-500 uppercase leading-none mt-0.5 max-w-full truncate text-center" style={{ color: statConfigs.mobileRight.labelTextColor, fontSize: `${statConfigs.mobileRight.labelTextSizeMobile}px` }}>{(rightStat.settings?.label as string) || 'Breeds'}</span></div>}
            {bottomStat && <div className={classes.bottom} style={statConfigs.mobileBottom.cardBackgroundStyle}><div className="scale-75" style={{ color: getAccentColor(bottomStat, '#d97706') }}>{getIcon(bottomStat.settings?.icon as string | undefined, <Award size={18} />)}</div><span className="font-black text-gray-800 pr-1 max-w-[72px] truncate" style={{ color: statConfigs.mobileBottom.valueTextColor, fontSize: `${statConfigs.mobileBottom.valueTextSizeMobile}px`, lineHeight: 1.1 }}>{(bottomStat.settings?.value as string) || '12+'}</span></div>}
        </>
    )
}
