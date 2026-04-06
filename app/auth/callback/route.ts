import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/lib/supabase/server'
import * as Sentry from '@sentry/nextjs'

function safeRedirectPath(next: string | null, fallback: string = '/admin') {
    if (!next) return fallback;
    if (next.startsWith('/') && !next.startsWith('//') && !next.startsWith('/\\')) {
        return next;
    }
    return fallback;
}

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // secure the redirect url to prevent open redirect
    const next = safeRedirectPath(searchParams.get('next'), '/admin')

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
            const isLocalhost = process.env.NODE_ENV === 'development'
            if (isLocalhost) {
                // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
                return NextResponse.redirect(`${origin}${next}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`)
            } else {
                return NextResponse.redirect(`${origin}${next}`)
            }
        } else {
            // Log auth failure to Sentry
            Sentry.captureException(new Error('Auth code exchange failed: ' + error.message))
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/admin/login?error=auth_callback_failed`)
}
