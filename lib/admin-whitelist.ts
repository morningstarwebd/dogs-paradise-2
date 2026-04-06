import { createClient as createServerSupabase } from '@/lib/supabase/server'
import { SupabaseClient } from '@supabase/supabase-js'
import { isProtectedSuperAdminEmail } from '@/lib/super-admins'

/**
 * Check if an email is authorized as an admin.
 * Supports protected super admins from SUPER_ADMIN_EMAILS.
 * Also allows any email present in the admin_users table.
 *
 * @param email - the user's email
 * @param supabaseClient - optional client to use (e.g. from middleware)
 */
export async function isAdminAllowed(
    email: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    supabaseClient?: SupabaseClient<any, any, any>
): Promise<boolean> {
    const normalized = email.trim().toLowerCase()

    // Protected super admins always have access.
    if (isProtectedSuperAdminEmail(normalized)) return true

    try {
        const supabase = supabaseClient || (await createServerSupabase())
        const { data } = await supabase
            .from('admin_users')
            .select('id')
            .eq('email', normalized)
            .maybeSingle()

        return !!data
    } catch {
        // If the database query fails, deny access by default.
        return false
    }
}
