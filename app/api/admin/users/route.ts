import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { isAdminAllowed } from '@/lib/admin-whitelist'

export async function GET() {
    try {
        // Auth check — only admins can list users
        const serverSupabase = await createServerClient()
        const { data: { user } } = await serverSupabase.auth.getUser()
        if (!user || !user.email || !(await isAdminAllowed(user.email))) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (!supabaseUrl) {
            return NextResponse.json({ error: 'Server configuration error (missing SUPABASE_URL)' }, { status: 500 })
        }

        // If we have the service role key, list all auth users
        if (supabaseServiceKey) {
            const adminSupabase = createClient(supabaseUrl, supabaseServiceKey)

            const { data: authData, error: authError } = await adminSupabase.auth.admin.listUsers()
            if (authError) {
                return NextResponse.json({ error: authError.message }, { status: 500 })
            }

            // Fetch all admin_users rows
            const { data: adminRows } = await adminSupabase
                .from('admin_users')
                .select('email, role')

            const adminMap = new Map<string, string>()
            if (adminRows) {
                for (const row of adminRows) {
                    adminMap.set(row.email.toLowerCase(), row.role)
                }
            }

            // Merge auth users with admin roles
            const users = authData.users.map((u) => ({
                id: u.id,
                email: u.email || '',
                name: u.user_metadata?.full_name || u.user_metadata?.name || '',
                avatar: u.user_metadata?.avatar_url || '',
                role: adminMap.get((u.email || '').toLowerCase()) || null,
                last_sign_in: u.last_sign_in_at,
                created_at: u.created_at,
            }))

            return NextResponse.json({ users })
        }

        // Fallback: no service role key — just show admin_users table entries
        const { data: adminRows } = await serverSupabase
            .from('admin_users')
            .select('*')
            .order('created_at', { ascending: true })

        const users = (adminRows || []).map((row) => ({
            id: row.id,
            email: row.email,
            name: '',
            avatar: '',
            role: row.role,
            last_sign_in: null,
            created_at: row.created_at,
        }))

        return NextResponse.json({ users })
    } catch (error) {
        console.error('Admin users API error:', error instanceof Error ? error.message : error, error instanceof Error ? error.stack : '')
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
