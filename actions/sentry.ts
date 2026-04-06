'use server'

import { createClient } from '@/lib/supabase/server'
import { resolveSentryIssue } from '@/lib/sentry-api'
import { revalidatePath } from 'next/cache'
import * as Sentry from '@sentry/nextjs'

export async function resolveIssueAction(
    issueId: string
) {
    if (!issueId || typeof issueId !== 'string' || issueId.trim().length === 0 || issueId.length > 100) {
        throw new Error('Invalid issue ID format')
    }
    await createClient()

    try {
        const success = await resolveSentryIssue(issueId)
        if (success) {
            revalidatePath('/admin/errors')
            revalidatePath('/admin')
        }
        return success;
    } catch (e) {
        Sentry.captureException(e)
        return false;
    }
}
