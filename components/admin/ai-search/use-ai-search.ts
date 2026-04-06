'use client'

import { useEffect, useRef, useState } from 'react'
import { isActionQuery } from './config'
import type { AgentPlan, ExecutionResult, SearchResponse } from './types'

export function useAiSearch() {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState<SearchResponse | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [agentPlan, setAgentPlan] = useState<AgentPlan | null>(null)
    const [executing, setExecuting] = useState(false)
    const [executionResults, setExecutionResults] = useState<ExecutionResult[] | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const resetAll = () => {
        setOpen(false)
        setQuery('')
        setResponse(null)
        setError(null)
        setAgentPlan(null)
        setExecuting(false)
        setExecutionResults(null)
    }

    useEffect(() => {
        const handler = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
                event.preventDefault()
                setOpen((current) => !current)
            }

            if (event.key === 'Escape') {
                resetAll()
            }
        }

        document.addEventListener('keydown', handler)
        return () => document.removeEventListener('keydown', handler)
    }, [])

    useEffect(() => {
        if (open) inputRef.current?.focus()
    }, [open])

    useEffect(() => {
        const handler = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                resetAll()
            }
        }

        if (open) document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [open])

    const handleSearch = async () => {
        if (!query.trim() || query.trim().length < 3) return

        setLoading(true)
        setError(null)
        setResponse(null)
        setAgentPlan(null)
        setExecutionResults(null)

        try {
            if (isActionQuery(query)) {
                const res = await fetch('/api/ai/agent', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ command: query.trim() }),
                })

                if (!res.ok) {
                    const data = await res.json()
                    throw new Error(data.error || 'Agent failed')
                }

                setAgentPlan(await res.json())
            } else {
                const res = await fetch('/api/ai/admin-search', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query: query.trim() }),
                })

                if (!res.ok) {
                    const data = await res.json()
                    throw new Error(data.error || 'Search failed')
                }

                setResponse(await res.json())
            }
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : 'Request failed')
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
                body: JSON.stringify({ steps: agentPlan.steps }),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Execution failed')
            }

            const data = await res.json()
            setExecutionResults(data.results || [])
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : 'Execution failed')
        } finally {
            setExecuting(false)
        }
    }

    return {
        agentPlan,
        containerRef,
        error,
        executing,
        executionResults,
        inputRef,
        loading,
        open,
        query,
        response,
        executePlan,
        handleSearch,
        resetAll,
        setOpen,
        setQuery,
    }
}
