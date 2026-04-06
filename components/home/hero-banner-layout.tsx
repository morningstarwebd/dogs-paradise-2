import { motion } from 'motion/react'
import { MapPin, Star } from 'lucide-react'
import { InlineEditable } from '@/components/admin/InlineEditable'
import { SectionActionButtons } from './shared/SectionActionButtons'
import { SectionStatGrid, FloatingSectionStats } from './shared/SectionStatCards'
import { SlideshowFrame } from './shared/SlideshowFrame'
import { heroIconMap, type HeroBannerProps, type HeroBannerState } from './hero-banner-model'

type HeroBannerLayoutProps = {
    banner: HeroBannerProps
    hero: Omit<HeroBannerState, 'ref' | 'sectionStyle' | 'topShapeOffsetX' | 'topShapeOffsetY' | 'blobScale' | 'decorativeOutlineColor' | 'outlineScale'>
}

function getDesktopImageClass(heroImageSize: string) {
    if (heroImageSize === 'large') return 'relative rounded-3xl w-full max-w-[620px] h-[620px] xl:h-[700px] overflow-hidden shadow-2xl border-8'
    if (heroImageSize === 'small') return 'relative rounded-3xl w-[380px] h-[470px] xl:w-[420px] xl:h-[520px] overflow-hidden shadow-2xl border-8'
    return 'relative rounded-3xl w-[450px] h-[550px] xl:w-[500px] xl:h-[600px] overflow-hidden shadow-2xl border-8'
}

function getMobileWrapClass(heroImageSize: string) {
    if (heroImageSize === 'large') return 'relative mx-auto w-full max-w-[360px] mb-8 mt-6'
    if (heroImageSize === 'small') return 'relative mx-auto w-[62vw] max-w-[220px] mb-8 mt-6'
    return 'relative mx-auto w-[74vw] max-w-[270px] mb-8 mt-6'
}

function getMobileVisitClass(heroImageSize: string) {
    return heroImageSize === 'large'
        ? 'absolute bottom-2 right-2 sm:bottom-3 sm:right-4 bg-white rounded-2xl px-4 py-2 flex items-center gap-1.5 shadow-xl border border-gray-100 z-20 active:scale-95 transition-transform'
        : 'absolute bottom-1 right-1 sm:bottom-2 sm:right-3 bg-white rounded-2xl px-4 py-2 flex items-center gap-1.5 shadow-xl border border-gray-100 z-20 active:scale-95 transition-transform'
}

export function HeroBannerLayout({ banner, hero }: HeroBannerLayoutProps) {
    return (
        <>
            <div className="hidden lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center py-16 xl:py-20">
                <motion.div initial={{ opacity: 0, x: -40 }} animate={hero.inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, ease: 'easeOut' }}>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={hero.inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 }} className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 mb-6 shadow-sm border border-white" style={hero.badgeBackgroundStyle}>
                        {hero.shouldShowBadgeStars && <div className="flex">{hero.badgeStars.map((_, index) => <Star key={index} size={16} fill={hero.badgeStarColor} color={hero.badgeStarColor} />)}</div>}
                        <InlineEditable isEditorMode={banner.isEditorMode} sectionId={banner.sectionId} propKey="badge_text" value={banner.badge_text} className="font-bold" style={{ color: hero.badgeTextColor, fontSize: `${hero.badgeTextSizeDesktop}px`, lineHeight: 1.2, opacity: 0.9 }}>{banner.badge_text}</InlineEditable>
                    </motion.div>
                    <h1 className="font-display font-bold leading-tight mb-6" style={{ fontSize: `${hero.headingTextSizeDesktop}px`, lineHeight: 1.1 }}>
                        <InlineEditable isEditorMode={banner.isEditorMode} sectionId={banner.sectionId} propKey="heading_line1" value={banner.heading_line1} style={{ color: hero.headingLine1Color }}>{banner.heading_line1}</InlineEditable>{' '}
                        <InlineEditable isEditorMode={banner.isEditorMode} sectionId={banner.sectionId} propKey="heading_highlight" value={banner.heading_highlight} style={{ color: hero.accentColor }}>{banner.heading_highlight}</InlineEditable>{' '}
                        <InlineEditable isEditorMode={banner.isEditorMode} sectionId={banner.sectionId} propKey="heading_line2" value={banner.heading_line2} style={{ color: hero.headingLine2Color }}>{banner.heading_line2}</InlineEditable>
                    </h1>
                    <InlineEditable isEditorMode={banner.isEditorMode} sectionId={banner.sectionId} propKey="description" value={banner.description} editType="textarea" as="p" className="leading-relaxed mb-8 max-w-lg font-medium" style={{ color: hero.descriptionTextColor, opacity: 0.9, fontSize: `${hero.descriptionTextSizeDesktop}px` }}>{banner.description}</InlineEditable>
                    <SectionActionButtons mode="desktop" buttons={hero.buttons} isEditorMode={banner.isEditorMode} sectionId={banner.sectionId} phoneAction={hero.shouldShowPhoneIcon ? { href: `tel:${hero.sanitizedPhoneNumber}`, backgroundStyle: hero.phoneIconBackgroundStyle, color: hero.phoneIconColor, buttonSize: hero.phoneIconButtonSize, iconSize: hero.phoneIconSize } : undefined} />
                    <SectionStatGrid inView={hero.inView} show={banner.show_trust_stats !== false} stats={hero.stats} statConfigs={hero.statConfigs.desktop} isEditorMode={banner.isEditorMode} sectionId={banner.sectionId} getIcon={(iconName, fallback) => heroIconMap[iconName || ''] || fallback} />
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={hero.inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }} className="relative flex justify-center items-center">
                    <SlideshowFrame slides={hero.slides} currentSlide={hero.currentSlide} activeImage={hero.activeImage} activeAlt={hero.activeAlt} frameClassName={getDesktopImageClass(hero.heroImageSize)} frameStyle={hero.heroImageFrameStyle} imageSizes="(max-width: 1024px) 100vw, 50vw" imageQuality={90} editable={{ isEditorMode: banner.isEditorMode, sectionId: banner.sectionId }} indicators={{ accentColor: hero.accentColor, setCurrentSlide: hero.setCurrentSlide }} />
                    {banner.show_floating_card !== false && <motion.div initial={{ opacity: 0, y: 20 }} animate={hero.inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.6 }} className="absolute -bottom-6 left-12 bg-white rounded-2xl p-4 shadow-xl border border-white z-20 hover:-translate-y-1 transition-transform cursor-pointer" style={hero.locationCardBackgroundStyle}><a href={hero.resolvedLocationMapLink} target="_blank" rel="noopener noreferrer" className="flex flex-col gap-1">{hero.locationTitleText && <h3 className="font-bold" style={{ color: hero.locationTextColor, fontSize: `${hero.locationTextSize}px`, lineHeight: 1.1 }}>{hero.locationTitleText}</h3>}<div className="flex items-center gap-1.5"><MapPin size={14} style={{ color: hero.locationMapIconColor }} />{hero.locationSubtext && <span className="font-semibold" style={{ color: hero.locationTextColor, fontSize: `${hero.locationTextSize}px`, lineHeight: 1.1, opacity: 0.9 }}>{hero.locationSubtext}</span>}</div></a></motion.div>}
                </motion.div>
            </div>

            <div className="lg:hidden pt-4 pb-10 px-4">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={hero.inView ? { opacity: 1, y: 0 } : {}} className="flex justify-center mb-4"><div className="inline-flex items-center gap-1.5 rounded-2xl px-3 py-1.5 shadow-sm border border-white/50" style={hero.badgeBackgroundStyle}>{hero.shouldShowBadgeStars && <div className="flex">{hero.badgeStars.map((_, index) => <Star key={index} size={11} fill={hero.badgeStarColor} color={hero.badgeStarColor} />)}</div>}<span className="font-bold" style={{ color: hero.badgeTextColor, fontSize: `${hero.badgeTextSizeMobile}px`, lineHeight: 1.2 }}>{banner.badge_text}</span></div></motion.div>
                <motion.h1 initial={{ opacity: 0, y: 15 }} animate={hero.inView ? { opacity: 1, y: 0 } : {}} className="font-display font-bold leading-[1.15] text-center mb-2" style={{ fontSize: `${hero.headingTextSizeMobile}px` }}><span style={{ color: hero.headingLine1Color }}>{banner.heading_line1}</span>{' '}<span style={{ color: hero.accentColor }}>{banner.heading_highlight}</span>{banner.heading_line2 ? <><span>{' '}</span><span style={{ color: hero.headingLine2Color }}>{banner.heading_line2}</span></> : null}</motion.h1>
                <motion.p initial={{ opacity: 0, y: 10 }} animate={hero.inView ? { opacity: 1, y: 0 } : {}} className="leading-relaxed font-medium text-center mb-5 max-w-[260px] mx-auto" style={{ color: hero.descriptionTextColor, opacity: 0.8, fontSize: `${hero.descriptionTextSizeMobile}px` }}>{banner.description}</motion.p>
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={hero.inView ? { opacity: 1, scale: 1 } : {}} className={getMobileWrapClass(hero.heroImageSize)}>
                    <SlideshowFrame slides={hero.slides} currentSlide={hero.currentSlide} activeImage={hero.activeImage} activeAlt={hero.activeAlt} frameClassName="relative rounded-3xl w-full aspect-[4/5] mx-auto overflow-hidden shadow-2xl border-[5px]" frameStyle={hero.heroImageFrameStyle} imageSizes="(max-width: 768px) 80vw, 50vw" imageQuality={85} />
                    <FloatingSectionStats show={banner.show_trust_stats !== false} stats={hero.stats} sizeVariant={hero.heroImageSize} statConfigs={hero.statConfigs} getIcon={(iconName, fallback) => heroIconMap[iconName || ''] || fallback} />
                    {banner.show_floating_card !== false && <a href={hero.resolvedLocationMapLink} target="_blank" rel="noopener noreferrer" className={getMobileVisitClass(hero.heroImageSize)} style={hero.locationCardBackgroundStyle}><MapPin size={13} style={{ color: hero.locationMapIconColor }} />{hero.locationMobileCtaText && <span className="font-bold" style={{ color: hero.locationTextColor, fontSize: `${hero.locationTextSize}px`, lineHeight: 1.1 }}>{hero.locationMobileCtaText}</span>}</a>}
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={hero.inView ? { opacity: 1, y: 0 } : {}}><SectionActionButtons mode="mobile" buttons={hero.buttons} phoneAction={hero.shouldShowPhoneIcon ? { href: `tel:${hero.sanitizedPhoneNumber}`, backgroundStyle: hero.phoneIconBackgroundStyle, color: hero.phoneIconColor, buttonSize: hero.phoneIconButtonSize, iconSize: hero.phoneIconSize } : undefined} /></motion.div>
            </div>
        </>
    )
}
