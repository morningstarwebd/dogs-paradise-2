export interface SearchResult {
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

export interface SearchResponse {
    table: string
    results: SearchResult[]
    query: string
    total: number
}

export interface AgentStep {
    action: string
    description: string
    params: Record<string, unknown>
}

export interface AgentPlan {
    plan_summary: string
    steps: AgentStep[]
    requires_data: boolean
}

export interface ExecutionResult {
    step: string
    status: 'success' | 'error'
    result: string
}
