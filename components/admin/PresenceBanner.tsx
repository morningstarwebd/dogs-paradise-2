'use client'

import { useAdminPresence } from '@/hooks/use-admin-presence'
import { Users } from 'lucide-react'

/**
 * Non-blocking banner showing other admins currently editing the same content.
 * Renders nothing if no other admins are present.
 */
export function PresenceBanner({
    entityType,
    entityId,
    entityLabel,
}: {
    entityType: string
    entityId: string | null
    entityLabel?: string
}) {
    const others = useAdminPresence(entityType, entityId, entityLabel)

    if (others.length === 0) return null

    const names = others
        .map((u) => {
            const name = u.email.split('@')[0]
            const label = u.entity_label ? ` (${u.entity_label})` : ''
            return `${name}${label}`
        })
        .join(', ')

    return (
        <div className="flex items-center gap-2 px-4 py-2 mb-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-sm font-medium animate-in fade-in slide-in-from-top-1 duration-300">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
            </span>
            <Users size={16} className="shrink-0" />
            <span>
                <strong>{names}</strong> {others.length === 1 ? 'is' : 'are'} also editing this right now
            </span>
        </div>
    )
}
