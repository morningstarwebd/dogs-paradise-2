import Link from 'next/link'
import { CheckCircle2, Clock, Loader2, Play, XCircle, Zap } from 'lucide-react'
import {
    getResultSubtitle,
    getResultTitle,
    tableIcons,
    tableLabels,
    tableLinks,
} from './config'
import type { AgentPlan, ExecutionResult, SearchResponse } from './types'

interface AiSearchResultsPanelProps {
    agentPlan: AgentPlan | null
    error: string | null
    executing: boolean
    executionResults: ExecutionResult[] | null
    response: SearchResponse | null
    onClose: () => void
    onExecute: () => void
}

export function AiSearchResultsPanel({
    agentPlan,
    error,
    executing,
    executionResults,
    response,
    onClose,
    onExecute,
}: AiSearchResultsPanelProps) {
    if (!response && !error && !agentPlan && !executionResults) return null

    return (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {error && <div className="p-4 text-sm text-destructive">{error}</div>}

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
                                    onClick={onClose}
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
                            onClick={onClose}
                            className="text-xs font-semibold text-accent hover:underline"
                        >
                            View all in {tableLabels[response.table]} →
                        </Link>
                    </div>
                </>
            )}

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
                        {agentPlan.steps.map((step, index) => (
                            <div key={`${step.action}-${index}`} className="px-4 py-3 flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">{index + 1}</span>
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
                            onClick={onExecute}
                            disabled={executing}
                            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
                        >
                            {executing ? <><Loader2 size={14} className="animate-spin" /> Executing...</> : <><Play size={14} /> Approve & Execute</>}
                        </button>
                        <button
                            onClick={onClose}
                            disabled={executing}
                            className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                </>
            )}

            {executionResults && (
                <>
                    <div className="px-4 py-3 bg-emerald-500/10 border-b border-emerald-500/20">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={14} className="text-emerald-500" />
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Execution Complete</span>
                        </div>
                    </div>
                    <div className="divide-y divide-border max-h-[300px] overflow-y-auto">
                        {executionResults.map((result, index) => (
                            <div key={`${result.step}-${index}`} className="px-4 py-3 flex items-start gap-3">
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
                            onClick={onClose}
                            className="w-full py-2 bg-secondary hover:bg-secondary/80 text-sm font-semibold rounded-lg transition-colors"
                        >
                            Done
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}
