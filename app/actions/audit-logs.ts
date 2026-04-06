'use server'

import { createClient } from '@/lib/supabase/server'

type AuditLogEntry = {
    id: string
    admin_email: string
    entity_type: string
    entity_id: string
    action: string
    summary: string | null
    created_at: string
}

type AuditLogResult = {
    entries: AuditLogEntry[]
    total: number
}

export async function getAuditLogs(
    page: number = 0,
    entityType?: string,
): Promise<AuditLogResult> {
    const supabase = await createClient()
    const pageSize = 25

    let query = supabase
        .from('admin_audit_log')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(page * pageSize, (page + 1) * pageSize - 1)

    if (entityType && entityType !== 'all') {
        query = query.eq('entity_type', entityType)
    }

    const { data, error, count } = await query

    if (error) {
        console.error('Failed to fetch audit logs:', error)
        return { entries: [], total: 0 }
    }

    return { entries: data || [], total: count || 0 }
}
