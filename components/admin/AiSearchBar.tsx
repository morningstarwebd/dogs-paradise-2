'use client'

import { Loader2, Search, Sparkles, X, Zap } from 'lucide-react'
import { isActionQuery } from './ai-search/config'
import { AiSearchResultsPanel } from './ai-search/AiSearchResultsPanel'
import { useAiSearch } from './ai-search/use-ai-search'

export function AiSearchBar() {
    const {
        agentPlan,
        containerRef,
        error,
        executePlan,
        executing,
        executionResults,
        handleSearch,
        inputRef,
        loading,
        open,
        query,
        resetAll,
        response,
        setOpen,
        setQuery,
    } = useAiSearch()

    const actionMode = query.length >= 3 && isActionQuery(query)

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
                actionMode ? 'border-amber-500/40 shadow-amber-500/5' : 'border-indigo-500/30 shadow-indigo-500/5'
            }`}>
                {loading ? (
                    <Loader2 size={16} className="animate-spin text-indigo-500 shrink-0" />
                ) : actionMode ? (
                    <Zap size={16} className="text-amber-500 shrink-0" />
                ) : (
                    <Sparkles size={16} className="text-indigo-500 shrink-0" />
                )}
                <input
                    ref={inputRef}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onKeyDown={(event) => event.key === 'Enter' && handleSearch()}
                    placeholder='Search: "blog posts about dental" or Action: "create a draft about web design"'
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                />
                {actionMode && !loading && (
                    <span className="text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded-md shrink-0">
                        AGENT
                    </span>
                )}
                <button onClick={resetAll} className="p-1 hover:bg-secondary rounded-lg transition-colors">
                    <X size={14} className="text-muted-foreground" />
                </button>
            </div>

            <AiSearchResultsPanel
                agentPlan={agentPlan}
                error={error}
                executing={executing}
                executionResults={executionResults}
                response={response}
                onClose={resetAll}
                onExecute={executePlan}
            />
        </div>
    )
}
