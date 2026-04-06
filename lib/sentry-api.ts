const SENTRY_BASE = 'https://sentry.io/api/0'
const ORG = process.env.SENTRY_ORG
const PROJECT = process.env.SENTRY_PROJECT
const TOKEN = process.env.SENTRY_AUTH_TOKEN || process.env.SENTRY_API_TOKEN

export type SentryIssue = {
    id: string
    title: string
    culprit: string
    permalink: string
    status: 'resolved' | 'unresolved' | 'ignored'
    level: 'error' | 'warning' | 'info' | 'fatal'
    count: string        // total occurrences
    userCount: number    // affected users
    firstSeen: string
    lastSeen: string
    isUnhandled: boolean
}

export async function getSentryIssues(
    limit = 25
): Promise<SentryIssue[]> {
    if (!TOKEN || !ORG || !PROJECT) return []

    const res = await fetch(
        `${SENTRY_BASE}/projects/${ORG}/${PROJECT}/issues/?limit=${limit}&query=is:unresolved`,
        {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
            next: { revalidate: 60 }, // cache 60s
        }
    )

    if (!res.ok) return []
    return res.json()
}

export async function resolveSentryIssue(
    issueId: string
): Promise<boolean> {
    if (!TOKEN) return false

    const res = await fetch(
        `${SENTRY_BASE}/issues/${issueId}/`,
        {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: 'resolved' }),
        }
    )
    return res.ok
}

export async function getSentryStats():
    Promise<{ errors24h: number, errors7d: number }> {
    if (!TOKEN || !ORG || !PROJECT) return { errors24h: 0, errors7d: 0 }

    const res = await fetch(
        `${SENTRY_BASE}/projects/${ORG}/${PROJECT}/stats/?stat=received&resolution=1d&since=${Math.floor(Date.now() / 1000) - 7 * 86400}`,
        {
            headers: { Authorization: `Bearer ${TOKEN}` },
            next: { revalidate: 300 },
        }
    )

    if (!res.ok) return { errors24h: 0, errors7d: 0 }

    const data = await res.json()
    const last24h = data.slice(-1)[0]?.[1] ?? 0
    const last7d = data.reduce(
        (sum: number, d: number[]) => sum + d[1], 0
    )

    return { errors24h: last24h, errors7d: last7d }
}
