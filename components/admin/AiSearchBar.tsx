'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Sparkles, Loader2, X, FileText, Briefcase, Mail, File, Zap, CheckCircle2, XCircle, Clock, Play } from 'lucide-react'
import Link from 'next/link'

interface SearchResult {
    id: string
    title?: string
    name?: string
    slug?: string
    email?: string
    category?: string
    service?: string
    published?: boolean
    created_at?: string
}

interface SearchResponse {
    table: string
    results: SearchResult[]
    query: string
    total: number
}

interface AgentStep {
    action: string
    description: string
    params: Record<string, unknown>
}

interface AgentPlan {
    plan_summary: string
    steps: AgentStep[]
    requires_data: boolean
}

interface ExecutionResult {
    step: string
    status: 'success' | 'error'
    result: string
}

const tableIcons: Record<string, React.ReactNode> = {
    blog_posts: <FileText size={14} />,
    projects: <Briefcase size={14} />,
    contact_messages: <Mail size={14} />,
    pages: <File size={14} />,
}

const tableLabels: Record<string, string> = {
    blog_posts: 'Blog Posts',
    projects: 'Projects',
    contact_messages: 'Messages',
    pages: 'Pages',
}

const tableLinks: Record<string, string> = {
    blog_posts: '/admin/blog',
    projects: '/admin/projects',
    contact_messages: '/admin/messages',
    pages: '/admin/pages',
}

// Detect if a query is an "action" vs a "search"
function isActionQuery(q: string): boolean {
    const actionKeywords = /\b(create|draft|write|generate|schedule|publish|make|build|update|set up|convert|turn|summarize)\b/i
    return actionKeywords.test(q)
}

export function AiSearchBar() {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState<SearchResponse | null>(null)
    const [error, setError] = useState<string | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // Agentic mode state
    const [agentPlan, setAgentPlan] = useState<AgentPlan | null>(null)
    const [executing, setExecuting] = useState(false)
    const [executionResults, setExecutionResults] = useState<ExecutionResult[] | null>(null)

    // Cmd+K / Ctrl+K shortcut
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                setOpen(prev => !prev)
            }
            if (e.key === 'Escape') {
                resetAll()
            }
        }
        document.addEventListener('keydown', handler)
        return () => document.removeEventListener('keydown', handler)
    }, [])

    // Focus input when opened
    useEffect(() => {
        if (open) inputRef.current?.focus()
    }, [open])

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                resetAll()
            }
        }
        if (open) document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [open])

    const resetAll = () => {
        setOpen(false)
        setQuery('')
        setResponse(null)
        setError(null)
        setAgentPlan(null)
        setExecuting(false)
        setExecutionResults(null)
    }

    const handleSearch = async () => {
        if (!query.trim() || query.trim().length < 3) return

        setLoading(true)
        setError(null)
        setResponse(null)
        setAgentPlan(null)
        setExecutionResults(null)

        try {
            if (isActionQuery(query)) {
                // ─── AGENTIC MODE ─────────────────────────────────
                const res = await fetch('/api/ai/agent', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ command: query.trim() })
                })
                if (!res.ok) {
                    const data = await res.json()
                    throw new Error(data.error || 'Agent failed')
                }
                const plan: AgentPlan = await res.json()
                setAgentPlan(plan)
            } else {
                // ─── SEARCH MODE ──────────────────────────────────
                const res = await fetch('/api/ai/admin-search', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query: query.trim() })
                })
                if (!res.ok) {
                    const data = await res.json()
                    throw new Error(data.error || 'Search failed')
                }
                const data: SearchResponse = await res.json()
                setResponse(data)
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Request failed')
        } finally {
            setLoading(false)
        }
    }

    const executePlan = async () => {
        if (!agentPlan) return
        setExecuting(true)
        setError(null)
        try {
            const res = await fetch('/api/ai/agent/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ steps: agentPlan.steps })
            })
            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Execution failed')
            }
            const data = await res.json()
            setExecutionResults(data.results || [])
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Execution failed')
        } finally {
            setExecuting(false)
        }
    }

    const getResultTitle = (item: SearchResult) => {
        return item.title || item.name || item.email || item.slug || 'Untitled'
    }

    const getResultSubtitle = (item: SearchResult) => {
        if (item.slug) return `/${item.slug}`
        if (item.email) return item.email
        if (item.service) return item.service
        return ''
    }

    const isAction = query.length >= 3 && isActionQuery(query)

    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-secondary/50 hover:bg-secondary border border-border rounded-xl text-sm text-muted-foreground transition-colors w-full max-w-md"
            >
                <Search size={14} />
                <span className="flex-1 text-left">AI Search & Actions...</span>
                <kbd className="hidden sm:inline text-[10px] font-mono bg-background border border-border px-1.5 py-0.5 rounded">⌘K</kbd>
            </button>
        )
    }

    return (
        <div ref={containerRef} className="relative w-full max-w-2xl">
            <div className={`flex items-center gap-2 bg-card border rounded-xl px-4 py-2.5 shadow-lg transition-all ${
                isAction
                    ? 'border-amber-500/40 shadow-amber-500/5'
                    : 'border-indigo-500/30 shadow-indigo-500/5'
            }`}>
                {loading ? (
                    <Loader2 size={16} className="animate-spin text-indigo-500 shrink-0" />
                ) : isAction ? (
                    <Zap size={16} className="text-amber-500 shrink-0" />
                ) : (
                    <Sparkles size={16} className="text-indigo-500 shrink-0" />
                )}
                <input
                    ref={inputRef}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    placeholder='Search: "blog posts about dental" or Action: "create a draft about web design"'
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                />
                {isAction && !loading && (
                    <span className="text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded-md shrink-0">
                        ⚡ AGENT
                    </span>
                )}
                <button onClick={resetAll} className="p-1 hover:bg-secondary rounded-lg transition-colors">
                    <X size={14} className="text-muted-foreground" />
                </button>
            </div>

            {/* ─── Results / Plan dropdown ─── */}
            {(response || error || agentPlan || executionResults) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {error && (
                        <div className="p-4 text-sm text-destructive">{error}</div>
                    )}

                    {/* ─── Search Results ─── */}
                    {response && (
                        <>
                            <div className="px-4 py-2.5 bg-secondary/30 border-b border-border flex items-center justify-between">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                    {tableIcons[response.table]}
                                    {tableLabels[response.table] || response.table}
                                </span>
                                <span className="text-xs text-muted-foreground">{response.total} result{response.total !== 1 ? 's' : ''}</span>
                            </div>
                            {response.results.length === 0 ? (
                                <div className="p-6 text-center text-sm text-muted-foreground">No results found</div>
                            ) : (
                                <div className="max-h-[300px] overflow-y-auto divide-y divide-border">
                                    {response.results.map((item) => (
                                        <Link
                                            key={item.id}
                                            href={tableLinks[response.table] || '/admin'}
                                            onClick={resetAll}
                                            className="block px-4 py-3 hover:bg-secondary/30 transition-colors"
                                        >
                                            <div className="font-medium text-sm">{getResultTitle(item)}</div>
                                            <div className="text-xs text-muted-foreground mt-0.5">{getResultSubtitle(item)}</div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                            <div className="px-4 py-2 border-t border-border bg-secondary/10">
                                <Link
                                    href={tableLinks[response.table] || '/admin'}
                                    onClick={resetAll}
                                    className="text-xs font-semibold text-accent hover:underline"
                                >
                                    View all in {tableLabels[response.table]} →
                                </Link>
                            </div>
                        </>
                    )}

                    {/* ─── Agent Plan Preview ─── */}
                    {agentPlan && !executionResults && (
                        <>
                            <div className="px-4 py-3 bg-amber-500/10 border-b border-amber-500/20">
                                <div className="flex items-center gap-2 mb-1">
                                    <Zap size={14} className="text-amber-500" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Action Plan</span>
                                </div>
                                <p className="text-sm font-medium">{agentPlan.plan_summary}</p>
                            </div>
                            <div className="divide-y divide-border">
                                {agentPlan.steps.map((step, i) => (
                                    <div key={i} className="px-4 py-3 flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">{i + 1}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium">{step.description}</p>
                                            <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">{step.action}</p>
                                        </div>
                                        <Clock size={12} className="text-muted-foreground shrink-0 mt-1" />
                                    </div>
                                ))}
                            </div>
                            <div className="px-4 py-3 border-t border-border bg-secondary/10 flex items-center gap-2">
                                <button
                                    onClick={executePlan}
                                    disabled={executing}
                                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
                                >
                                    {executing ? (
                                        <><Loader2 size={14} className="animate-spin" /> Executing...</>
                                    ) : (
                                        <><Play size={14} /> ✅ Approve & Execute</>
                                    )}
                                </button>
                                <button
                                    onClick={resetAll}
                                    disabled={executing}
                                    className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
                                >
                                    ❌ Cancel
                                </button>
                            </div>
                        </>
                    )}

                    {/* ─── Execution Results ─── */}
                    {executionResults && (
                        <>
                            <div className="px-4 py-3 bg-emerald-500/10 border-b border-emerald-500/20">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={14} className="text-emerald-500" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Execution Complete</span>
                                </div>
                            </div>
                            <div className="divide-y divide-border max-h-[300px] overflow-y-auto">
                                {executionResults.map((result, i) => (
                                    <div key={i} className="px-4 py-3 flex items-start gap-3">
                                        {result.status === 'success' ? (
                                            <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                                        ) : (
                                            <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium">{result.step}</p>
                                            <p className={`text-xs mt-0.5 ${result.status === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                                {result.result}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="px-4 py-3 border-t border-border bg-secondary/10">
                                <button
                                    onClick={resetAll}
                                    className="w-full py-2 bg-secondary hover:bg-secondary/80 text-sm font-semibold rounded-lg transition-colors"
                                >
                                    Done
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}
