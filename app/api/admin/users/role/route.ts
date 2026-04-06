import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { isProtectedSuperAdminEmail } from '@/lib/super-admins'

export async function POST(req: Request) {
    try {
        // Auth check — only existing admins can change roles
        const { email, action } = await req.json()
        if (!email || !action) {
            return NextResponse.json({ error: 'Missing email or action' }, { status: 400 })
        }

        const normalizedEmail = email.trim().toLowerCase()

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (!supabaseUrl || !supabaseServiceKey) {
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
        }
        const adminSupabase = createClient(supabaseUrl, supabaseServiceKey)

        const { data: existingAdmin } = await adminSupabase
            .from('admin_users')
            .select('role')
            .eq('email', normalizedEmail)
            .maybeSingle()

        if (action === 'grant') {
            const role = isProtectedSuperAdminEmail(normalizedEmail) ? 'super_admin' : 'admin'
            const { error } = await adminSupabase
                .from('admin_users')
                .upsert({ email: normalizedEmail, role }, { onConflict: 'email' })
            if (error) {
                return NextResponse.json({ error: error.message }, { status: 500 })
            }
            return NextResponse.json({
                success: true,
                message: role === 'super_admin' ? 'Super admin access granted' : 'Admin access granted',
            })
        }

        if (action === 'revoke') {
            if (isProtectedSuperAdminEmail(normalizedEmail)) {
                return NextResponse.json({ error: 'Cannot revoke protected super admin' }, { status: 403 })
            }

            if (existingAdmin?.role === 'super_admin') {
                return NextResponse.json({ error: 'Cannot revoke super admin from this endpoint' }, { status: 403 })
            }

            const { error } = await adminSupabase
                .from('admin_users')
                .delete()
                .eq('email', normalizedEmail)
            if (error) {
                return NextResponse.json({ error: error.message }, { status: 500 })
            }
            return NextResponse.json({ success: true, message: 'Admin access revoked' })
        }

        return NextResponse.json({ error: 'Invalid action. Use "grant" or "revoke".' }, { status: 400 })
    } catch (error) {
        console.error('Admin role API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
