import { Loader2, Sparkles } from 'lucide-react'

interface BlogAiPanelProps {
    aiDraft: string
    aiDraftRef: React.RefObject<HTMLDivElement | null>
    aiKeywords: string
    aiTone: string
    aiTopic: string
    isGenerating: boolean
    onAiKeywordsChange: (value: string) => void
    onAiToneChange: (value: string) => void
    onAiTopicChange: (value: string) => void
    onCopyToEditor: () => void
    onGenerateDraft: () => void
}

export function BlogAiPanel({
    aiDraft,
    aiDraftRef,
    aiKeywords,
    aiTone,
    aiTopic,
    isGenerating,
    onAiKeywordsChange,
    onAiToneChange,
    onAiTopicChange,
    onCopyToEditor,
    onGenerateDraft,
}: BlogAiPanelProps) {
    return (
        <div className="bg-gradient-to-br from-indigo-50/50 to-violet-50/50 dark:from-indigo-950/20 dark:to-violet-950/20 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl p-6 animate-in slide-in-from-top-4 fade-in duration-300">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">What should the post be about?</label>
                        <input
                            value={aiTopic}
                            onChange={(event) => onAiTopicChange(event.target.value)}
                            placeholder="e.g. 5 Reasons Your Medical Practice Needs a Website"
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Keywords (Optional)</label>
                            <input
                                value={aiKeywords}
                                onChange={(event) => onAiKeywordsChange(event.target.value)}
                                placeholder="medical website, patient acquisition"
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Tone</label>
                            <select
                                value={aiTone}
                                onChange={(event) => onAiToneChange(event.target.value)}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            >
                                <option>Professional</option>
                                <option>Casual & Engaging</option>
                                <option>Technical</option>
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={onGenerateDraft}
                        disabled={isGenerating || !aiTopic.trim()}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm shadow-indigo-600/20"
                    >
                        {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                        {isGenerating ? 'Generating...' : 'Generate Draft'}
                    </button>
                </div>

                {(aiDraft || isGenerating) && (
                    <div className="flex-1 flex flex-col mt-6 md:mt-0">
                        <div
                            ref={aiDraftRef}
                            className="flex-1 min-h-[250px] max-h-[300px] overflow-y-auto bg-gray-950 text-indigo-300 border border-indigo-900/50 rounded-xl p-4 text-xs font-mono leading-relaxed whitespace-pre-wrap"
                        >
                            {aiDraft}
                            {isGenerating && <span className="inline-block w-1.5 h-3 ml-1 bg-current animate-pulse align-middle" />}
                        </div>
                        {aiDraft && !isGenerating && (
                            <button
                                onClick={onCopyToEditor}
                                className="mt-3 w-full bg-foreground hover:bg-foreground/90 text-background font-semibold py-2.5 rounded-xl text-sm transition-colors"
                            >
                                Copy to New Post Editor
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
