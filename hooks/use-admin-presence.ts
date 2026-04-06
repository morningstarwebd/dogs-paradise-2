'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

export type PresenceUser = {
    email: string
    editing_at: string
    entity_label?: string
}

/**
 * Tracks admin presence on a specific entity (section, page, etc.)
 * Shows which other admins are currently editing the same content.
 *
 * - Subscribes to a Realtime Presence channel scoped to entity type + ID
 * - Tracks the current admin's email + optional entity label
 * - Returns a list of OTHER admins currently present
 * - Auto-untracks on tab blur (debounced — skips if hidden < 30s)
 * - Cleans up properly even if the async getUser() hasn't resolved yet
 */
export function useAdminPresence(
    entityType: string,
    entityId: string | null,
    entityLabel?: string
) {
    const [others, setOthers] = useState<PresenceUser[]>([])
    const channelRef = useRef<RealtimeChannel | null>(null)
    const emailRef = useRef<string | null>(null)
    const hiddenAtRef = useRef<number | null>(null)

    // Stable reference to the latest label so visibility handler doesn't go stale
    const labelRef = useRef(entityLabel)
    const visibilityHandlerRef = useRef<(() => void) | null>(null)
    useEffect(() => { labelRef.current = entityLabel }, [entityLabel])

    const trackSelf = useCallback((channel: RealtimeChannel, email: string) => {
        channel.track({
            email,
            editing_at: new Date().toISOString(),
            entity_label: labelRef.current || undefined,
        })
    }, [])

    useEffect(() => {
        if (!entityId) return

        // Guard against cleanup running before async init completes
        let mounted = true
        const supabase = createClient()
        const channelName = `presence:${entityType}:${entityId}`

        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user?.email || !mounted) return
            emailRef.current = user.email

            const channel = supabase.channel(channelName, {
                config: { presence: { key: user.email } },
            })

            channel
                .on('presence', { event: 'sync' }, () => {
                    const state = channel.presenceState<PresenceUser>()
                    const otherUsers: PresenceUser[] = []

                    for (const [key, presences] of Object.entries(state)) {
                        if (key !== emailRef.current && presences.length > 0) {
                            const p = presences[0] as PresenceUser
                            otherUsers.push({
                                email: key,
                                editing_at: p.editing_at,
                                entity_label: p.entity_label,
                            })
                        }
                    }
                    if (mounted) setOthers(otherUsers)
                })
                .subscribe(async (status) => {
                    if (status !== 'SUBSCRIBED' || !mounted) return
                    trackSelf(channel, user.email!)
                })

            channelRef.current = channel

            // Pause tracking when tab is hidden, resume on focus.
            // Debounce: skip untrack if hidden < 30s (server keeps presence ~30s)
            const handleVisibility = () => {
                if (document.hidden) {
                    hiddenAtRef.current = Date.now()
                    // Don't untrack immediately — wait for prolonged hide
                    setTimeout(() => {
                        if (document.hidden && hiddenAtRef.current) {
                            channel.untrack()
                        }
                    }, 30_000)
                } else {
                    hiddenAtRef.current = null
                    trackSelf(channel, user.email!)
                }
            }
            document.addEventListener('visibilitychange', handleVisibility)

            channelRef.current = channel
                // Store the handler reference for cleanup
                ; visibilityHandlerRef.current = handleVisibility
        })

        return () => {
            mounted = false
            if (channelRef.current) {
                if (visibilityHandlerRef.current) {
                    document.removeEventListener('visibilitychange', visibilityHandlerRef.current)
                    visibilityHandlerRef.current = null
                }
                channelRef.current.untrack()
                supabase.removeChannel(channelRef.current)
                channelRef.current = null
            }
        }
    }, [entityType, entityId, trackSelf])

    return others
}
