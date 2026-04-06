'use server'

import { createClient } from '@/lib/supabase/server'
import * as Sentry from '@sentry/nextjs'

/**
 * Logs an admin action to the audit trail.
 * Designed to be non-blocking — errors are captured but never fail the parent action.
 */
export async function logAuditEntry(params: {
    entityType: 'section' | 'post' | 'page' | 'project'
    entityId: string
    action: 'create' | 'update' | 'delete' | 'publish' | 'unpublish' | 'toggle' | 'reorder'
    summary?: string
}): Promise<void> {
    try {
        const supabase = await createClient()

        await supabase.from('admin_audit_log').insert({
            admin_email: 'admin-panel',
            entity_type: params.entityType,
            entity_id: params.entityId,
            action: params.action,
            summary: params.summary || null,
        })
    } catch (err) {
        // Audit logging should never fail the parent operation
        Sentry.captureException(err)
    }
}
