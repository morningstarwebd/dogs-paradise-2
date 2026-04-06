import { Activity, BadgeCheck, Bone, Ear, Eye, Heart, Shield } from 'lucide-react'
import type { HotspotItem, RawBlock, TrustItem } from './image-hotspot-types'

const hotspotIconMap = { Eye, Ear, Bone, Heart, Activity, Shield }
const trustIconMap = { Shield, BadgeCheck, Heart }

function toText(value: unknown, fallback: string) {
    return typeof value === 'string' && value.trim() ? value : fallback
}

function toNumber(value: unknown, fallback: number) {
    if (typeof value === 'number' && !Number.isNaN(value)) return value
    if (typeof value === 'string') {
        const parsed = Number(value)
        if (!Number.isNaN(parsed)) return parsed
    }
    return fallback
}

function resolveHotspotIcon(value: unknown) {
    if (typeof value === 'string' && value in hotspotIconMap) {
        return hotspotIconMap[value as keyof typeof hotspotIconMap]
    }
    return Shield
}

function resolveTrustIcon(value: unknown) {
    if (typeof value === 'string' && value in trustIconMap) {
        return trustIconMap[value as keyof typeof trustIconMap]
    }
    return Shield
}

const fallbackHotspots: HotspotItem[] = [
    { id: 'eyes', icon: Eye, title: 'Eye Check', shortDesc: 'Complete ophthalmologic examination for cataracts, PRA & cherry eye.', fullDesc: 'Complete ophthalmologic examination. Checked for cataracts, PRA (Progressive Retinal Atrophy), and cherry eye. Clear certification from board-certified veterinary ophthalmologist.', color: '#3b82f6', x: 80, y: 28 },
    { id: 'ears', icon: Ear, title: 'Ear Inspection', shortDesc: 'Full ear canal inspection for infections, mites & structural issues.', fullDesc: 'Full ear canal inspection for infections, mites, and structural issues. Cleaned and treated as needed. Breed-specific checks for drop-ear breeds.', color: '#8b5cf6', x: 65, y: 20 },
    { id: 'teeth', icon: Bone, title: 'Dental Health', shortDesc: 'Bite alignment, teeth count & gum health assessment.', fullDesc: 'Occlusion check (bite alignment), teeth count verification, and gum health assessment. Early detection ensures proper adult dentition. No underbites or missing teeth.', color: '#f59e0b', x: 84, y: 42 },
    { id: 'heart', icon: Heart, title: 'Heart & Lungs', shortDesc: 'Stethoscope auscultation for murmurs, arrhythmias & lung clarity.', fullDesc: 'Auscultation with stethoscope for heart murmurs, arrhythmias, and lung clarity. ECG screening for breeds prone to cardiac issues. All puppies pass with a clean bill of health.', color: '#ef4444', x: 55, y: 60 },
    { id: 'hips', icon: Activity, title: 'Hip & Joint Screen', shortDesc: 'Ortolani test for hip laxity & complete joint palpation.', fullDesc: 'Ortolani test for hip laxity and joint palpation. Parent hip and elbow history is reviewed where available. Especially important for large breeds like German Shepherds.', color: '#22c55e', x: 25, y: 55 },
    { id: 'vaccination', icon: Shield, title: 'Vaccination', shortDesc: 'Age-appropriate DHPPi, anti-rabies & deworming schedule.', fullDesc: 'Age-appropriate DHPPi vaccination, anti-rabies, and systematic deworming schedule completed. Full vaccination card provided with batch numbers and vet signatures.', color: '#06b6d4', x: 45, y: 35 },
]

const fallbackTrustItems: TrustItem[] = [
    { id: 'trust-1', label: 'Registered Vets', icon: Shield },
    { id: 'trust-2', label: 'Written Reports', icon: BadgeCheck },
    { id: 'trust-3', label: 'Lifelong Support', icon: Heart },
]

function buildHotspots(blocks: RawBlock[]) {
    return blocks
        .filter((block) => block?.type === 'health_hotspot' && block.settings)
        .map((block, index) => {
            const settings = block.settings as Record<string, unknown>
            return {
                id: block.id || `health_hotspot_${index}`,
                icon: resolveHotspotIcon(settings.icon),
                title: toText(settings.title, `Hotspot ${index + 1}`),
                shortDesc: toText(settings.short_desc, 'Short description'),
                fullDesc: toText(settings.full_desc, 'Detailed description'),
                color: toText(settings.color, '#3b82f6'),
                x: toNumber(settings.x, 50),
                y: toNumber(settings.y, 50),
            }
        })
}

function buildTrustItems(blocks: RawBlock[]) {
    return blocks
        .filter((block) => block?.type === 'health_trust_item' && block.settings)
        .map((block, index) => {
            const settings = block.settings as Record<string, unknown>
            return {
                id: block.id || `health_trust_item_${index}`,
                label: toText(settings.label, `Trust Item ${index + 1}`),
                icon: resolveTrustIcon(settings.icon),
            }
        })
}

export function getImageHotspotContent(blocks: RawBlock[]) {
    const hotspotItems = buildHotspots(blocks)
    const trustItems = buildTrustItems(blocks)

    return {
        hotspotItems: hotspotItems.length > 0 ? hotspotItems : fallbackHotspots,
        trustItems: trustItems.length > 0 ? trustItems : fallbackTrustItems,
    }
}
