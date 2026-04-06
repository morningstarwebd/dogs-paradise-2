import { getSentryIssues, getSentryStats, SentryIssue } from '@/lib/sentry-api'
import { ResolveButton } from './resolve-button'
import { ExternalLink, AlertTriangle, AlertCircle, Info, Bug, ShieldAlert, CheckCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

function getLevelIcon(level: string) {
    switch (level) {
        case 'fatal': return <ShieldAlert size={16} />
        case 'error': return <AlertCircle size={16} />
        case 'warning': return <AlertTriangle size={16} />
        case 'info': return <Info size={16} />
        default: return <Bug size={16} />
    }
}

function getLevelColor(level: string) {
    switch (level) {
        case 'fatal': return 'bg-red-500 text-white'
        case 'error': return 'bg-orange-500 text-white'
        case 'warning': return 'bg-yellow-500 text-black'
        case 'info': return 'bg-blue-500 text-white'
        default: return 'bg-muted text-muted-foreground'
    }
}

function formatRelativeTime(dateString: string) {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
    const daysDifference = Math.round((new Date(dateString).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

    if (daysDifference === 0) {
        const hoursDifference = Math.round((new Date(dateString).getTime() - new Date().getTime()) / (1000 * 60 * 60))
        if (hoursDifference === 0) {
            const minutesDifference = Math.round((new Date(dateString).getTime() - new Date().getTime()) / (1000 * 60))
            return rtf.format(minutesDifference, 'minute')
        }
        return rtf.format(hoursDifference, 'hour')
    }
    return rtf.format(daysDifference, 'day')
}

export default async function ErrorLogsPage() {
    const hasToken = !!process.env.SENTRY_API_TOKEN

    let issues: SentryIssue[] = []
    let stats = { errors24h: 0, errors7d: 0 }

    if (hasToken) {
        try {
            [issues, stats] = await Promise.all([
                getSentryIssues(25),
                getSentryStats(),
            ])
        } catch (error) {
            console.error('Failed to fetch Sentry data', error)
        }
    }

    return (
        <div className="max-w-6xl space-y-10">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-4xl font-display font-bold mb-2">Error Logs</h1>
                    <p className="text-muted-foreground">Monitor and resolve application errors tracked by Sentry.</p>
                </div>
                {hasToken && (
                    <a
                        href={`https://sentry.io/organizations/${process.env.SENTRY_ORG}/issues/?project=${process.env.SENTRY_PROJECT}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors"
                    >
                        Open Sentry Dashboard <ExternalLink size={14} />
                    </a>
                )}
            </div>

            {!hasToken ? (
                <div className="bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 p-6 rounded-2xl flex gap-4 items-start">
                    <AlertTriangle className="shrink-0 mt-1" />
                    <div>
                        <h3 className="font-bold text-lg mb-1">Sentry API token not configured</h3>
                        <p>Add <code>SENTRY_API_TOKEN</code>, <code>SENTRY_ORG</code>, and <code>SENTRY_PROJECT</code> to your environment variables to enable error log fetching.</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Errors (24h)</p>
                            <p className="text-4xl font-display font-bold">{stats.errors24h.toLocaleString()}</p>
                        </div>
                        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Errors (7d)</p>
                            <p className="text-4xl font-display font-bold">{stats.errors7d.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Issues */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-display font-bold">Unresolved Issues</h2>

                        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                            {issues.length > 0 ? (
                                <div className="divide-y divide-border">
                                    {issues.map((issue) => (
                                        <div key={issue.id} className="p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center hover:bg-secondary/10 transition-colors">
                                            <div className="flex gap-4 items-start flex-1 min-w-0">
                                                <div className={`mt-1 p-2 rounded-lg shrink-0 ${getLevelColor(issue.level)}`}>
                                                    {getLevelIcon(issue.level)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-foreground truncate" title={issue.title}>
                                                        {issue.title}
                                                    </h4>
                                                    <p className="text-sm text-accent truncate mt-1 font-mono" title={issue.culprit}>
                                                        {issue.culprit}
                                                    </p>
                                                    <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-xs font-medium text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <span className="bg-secondary px-2 py-1 rounded">
                                                                Events: {Number(issue.count).toLocaleString()}
                                                            </span>
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <span className="bg-secondary px-2 py-1 rounded">
                                                                Users: {issue.userCount.toLocaleString()}
                                                            </span>
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            Last seen {formatRelativeTime(issue.lastSeen)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto mt-2 md:mt-0 gap-4 shrink-0">
                                                <div className="flex items-center gap-3">
                                                    <a
                                                        href={issue.permalink}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground flex items-center gap-1"
                                                    >
                                                        View <ExternalLink size={12} />
                                                    </a>
                                                    <ResolveButton issueId={issue.id} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center text-muted-foreground flex flex-col items-center gap-3">
                                    <div className="h-12 w-12 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                                        <CheckCircle size={24} />
                                    </div>
                                    <p className="font-medium text-foreground">No unresolved errors — all clear!</p>
                                    <p className="text-sm">Your application is running smoothly.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
