import { NextResponse } from 'next/server'

function safeRedirectPath(next: string | null, fallback: string = '/admin') {
    if (!next) return fallback;
    if (next.startsWith('/') && !next.startsWith('//') && !next.startsWith('/\\')) {
        return next;
    }
    return fallback;
}

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const next = safeRedirectPath(searchParams.get('next'), '/admin')
    const forwardedHost = request.headers.get('x-forwarded-host')
    const isLocalhost = process.env.NODE_ENV === 'development'

    if (isLocalhost) {
        return NextResponse.redirect(`${origin}${next}`)
    }

    if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
    }

    return NextResponse.redirect(`${origin}${next}`)
}
