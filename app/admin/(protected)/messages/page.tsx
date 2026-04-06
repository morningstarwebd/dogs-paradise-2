'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Eye, Trash2, Loader2, X, CheckCircle2, Circle, Sparkles, Copy, Send } from 'lucide-react'
import { useAdminDataStore } from '@/store/admin-data-store'

interface ContactMessage {
    id: string
    name: string
    email: string
    service: string | null
    budget: string | null
    message: string
    read: boolean | null
    created_at: string | null
    lead_score: number | null
    lead_summary: string | null
}

export default function AdminMessagesPage() {
    const { contactMessages: cachedMessages, setContactMessages: setCachedMessages } = useAdminDataStore()
    const [messages, setMessages] = useState<ContactMessage[]>(cachedMessages || [])
    const [loading, setLoading] = useState(!cachedMessages)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [viewingMsg, setViewingMsg] = useState<ContactMessage | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [toast, setToast] = useState<string | null>(null)

    // AI Proposal State
    const [aiModalOpen, setAiModalOpen] = useState(false)
    const [aiProposal, setAiProposal] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)

    const supabase = createClient()

    const showToast = (msg: string) => {
        setToast(msg)
        setTimeout(() => setToast(null), 3000)
    }

    const fetchMessages = useCallback(async () => {
        const { data } = await supabase
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false })
        if (data) {
            setMessages(data)
            setCachedMessages(data)
        }
        setLoading(false)
    }, [supabase, setCachedMessages])

    useEffect(() => { fetchMessages() }, [fetchMessages])

    const openViewDrawer = async (msg: ContactMessage) => {
        setViewingMsg(msg)
        setDrawerOpen(true)

        // Mark as read immediately when viewed
        if (!msg.read) {
            const { error } = await supabase
                .from('contact_messages')
                .update({ read: true })
                .eq('id', msg.id)
            if (!error) {
                const refreshed = messages.map(m => m.id === msg.id ? { ...m, read: true } : m)
                setMessages(refreshed)
                setCachedMessages(refreshed)
            }
        }
    }

    const toggleReadStatus = async (msg: ContactMessage, e: React.MouseEvent) => {
        e.stopPropagation()
        const newStatus = !msg.read
        const { error } = await supabase
            .from('contact_messages')
            .update({ read: newStatus })
            .eq('id', msg.id)
        if (!error) {
            const refreshed = messages.map(m => m.id === msg.id ? { ...m, read: newStatus } : m)
            setMessages(refreshed)
            setCachedMessages(refreshed)
            showToast(newStatus ? 'Marked as read' : 'Marked as unread')
        } else {
            showToast('Failed to change status')
        }
    }

    const handleDelete = async () => {
        if (!deleteId) return
        const { error } = await supabase.from('contact_messages').delete().eq('id', deleteId)
        if (!error) {
            showToast('Message deleted successfully')
            const updated = messages.filter((m) => m.id !== deleteId)
            setMessages(updated)
            setCachedMessages(updated)
        } else {
            showToast('Failed to delete message')
        }
        setDeleteId(null)
        setDrawerOpen(false)
    }

    const generateAiProposal = async (msg: ContactMessage) => {
        setIsGenerating(true)
        setAiProposal('')
        setAiModalOpen(true)
        
        try {
            const res = await fetch('/api/ai/proposal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientMessage: msg.message,
                    clientName: msg.name,
                    businessType: msg.service
                })
            })

            if (!res.ok) throw new Error('Failed to generate proposal')
            
            const reader = res.body?.getReader()
            const decoder = new TextDecoder()
            
            if (!reader) throw new Error('No streaming response')

            let fullText = ''
            while (true) {
                const { done, value } = await reader.read()
                if (done) break
                
                fullText += decoder.decode(value, { stream: true })
                setAiProposal(fullText)
            }
        } catch (err: unknown) {
            showToast(err instanceof Error ? err.message : 'Error generating proposal')
        } finally {
            setIsGenerating(false)
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(aiProposal)
        showToast('Proposal copied to clipboard')
    }

    const openWhatsApp = () => {
        if (!viewingMsg) return
        const text = encodeURIComponent(aiProposal)
        window.open(`https://wa.me/?text=${text}`, '_blank')
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="animate-spin text-muted-foreground" size={32} />
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto pb-20">
            {toast && (
                <div className="fixed bottom-6 right-6 bg-accent text-accent-foreground px-4 py-3 rounded-lg shadow-xl z-50 flex items-center gap-2 animate-in slide-in-from-bottom border border-accent/20">
                    <CheckCircle2 size={18} />
                    <span className="font-medium text-sm">{toast}</span>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold tracking-tight mb-2">Inquiries</h1>
                    <p className="text-muted-foreground text-sm">View and manage form submissions from visitors.</p>
                </div>
            </div>

            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                {messages.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground flex items-center justify-center flex-col gap-3">
                        <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-muted-foreground/50">
                            <Eye size={24} />
                        </div>
                        <p>No messages yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left whitespace-nowrap">
                            <thead className="bg-secondary/50 text-muted-foreground">
                                <tr>
                                    <th className="px-6 py-4 font-medium w-12">Status</th>
                                    <th className="px-6 py-4 font-medium">Name</th>
                                    <th className="px-6 py-4 font-medium">Email</th>
                                    <th className="px-6 py-4 font-medium hidden md:table-cell">Service</th>
                                    <th className="px-6 py-4 font-medium hidden lg:table-cell">Lead</th>
                                    <th className="px-6 py-4 font-medium text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {messages.map((item) => (
                                    <tr
                                        key={item.id}
                                        className={`hover:bg-secondary/30 transition-colors cursor-pointer group ${!item.read ? 'bg-accent/5' : ''}`}
                                        onClick={() => openViewDrawer(item)}
                                    >
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={(e) => toggleReadStatus(item, e)}
                                                className="hover:scale-110 transition-transform text-muted-foreground"
                                                title={item.read ? "Mark as unread" : "Mark as read"}
                                            >
                                                {item.read ? <Circle size={16} /> : <div className="w-4 h-4 rounded-full bg-accent" />}
                                            </button>
                                        </td>
                                        <td className={`px-6 py-4 ${!item.read ? 'font-bold' : 'font-medium'}`}>{item.name}</td>
                                        <td className="px-6 py-4 text-muted-foreground">{item.email}</td>
                                        <td className="px-6 py-4 text-muted-foreground hidden md:table-cell truncate max-w-[200px]" title={item.service || ''}>
                                            {item.service}
                                        </td>
                                        <td className="px-6 py-4 hidden lg:table-cell">
                                            {item.lead_score != null && item.lead_score > 0 && (
                                                <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                                                    item.lead_score >= 8 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                    item.lead_score >= 5 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                                    'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                                }`}>
                                                    {item.lead_score >= 8 ? '🔥' : item.lead_score >= 5 ? '⭐' : '—'} {item.lead_score}/10
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right text-muted-foreground text-xs">
                                            {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Read/Delete Drawer overlay */}
            {drawerOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity"
                        onClick={() => { setDrawerOpen(false); setViewingMsg(null); }}
                    />
                    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-card shadow-2xl border-l border-border transform transition-transform duration-300 ease-in-out flex flex-col">
                        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-secondary/30">
                            <div>
                                <h2 className="text-xl font-display font-medium">Message Details</h2>
                                <p className="text-sm text-muted-foreground">Received {viewingMsg?.created_at ? new Date(viewingMsg.created_at).toLocaleString() : ''}</p>
                            </div>
                            <button
                                onClick={() => { setDrawerOpen(false); setViewingMsg(null); }}
                                className="p-2 hover:bg-secondary rounded-lg text-muted-foreground transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {viewingMsg && (
                                <>
                                    <div className="grid grid-cols-2 gap-6 bg-secondary/20 p-4 rounded-xl border border-border/50">
                                        <div>
                                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1 block">Name</label>
                                            <p className="font-medium text-sm">{viewingMsg.name}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1 block">Email</label>
                                            <a href={`mailto:${viewingMsg.email}`} className="font-medium text-sm text-accent hover:underline">{viewingMsg.email}</a>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1 block">Service</label>
                                            <p className="font-medium text-sm">{viewingMsg.service || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1 block">Budget</label>
                                            <p className="font-medium text-sm">{viewingMsg.budget || 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2 block">Message</label>
                                        <div className="bg-secondary/40 p-5 rounded-xl border border-border/50 text-sm leading-relaxed whitespace-pre-wrap">
                                            {viewingMsg.message}
                                        </div>
                                    </div>

                                    {viewingMsg.lead_score != null && viewingMsg.lead_score > 0 && (
                                        <div className={`p-4 rounded-xl border ${
                                            viewingMsg.lead_score >= 8 ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' :
                                            viewingMsg.lead_score >= 5 ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800' :
                                            'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700'
                                        }`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">AI Lead Score</span>
                                                <span className={`text-sm font-bold ${
                                                    viewingMsg.lead_score >= 8 ? 'text-red-600 dark:text-red-400' :
                                                    viewingMsg.lead_score >= 5 ? 'text-amber-600 dark:text-amber-400' :
                                                    'text-gray-600 dark:text-gray-400'
                                                }`}>
                                                    {viewingMsg.lead_score >= 8 ? '🔥' : viewingMsg.lead_score >= 5 ? '⭐' : '—'} {viewingMsg.lead_score}/10
                                                </span>
                                            </div>
                                            {viewingMsg.lead_summary && (
                                                <p className="text-xs text-muted-foreground">{viewingMsg.lead_summary}</p>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="p-6 border-t border-border flex justify-between items-center bg-secondary/10">
                            <div>
                                <button
                                    onClick={() => viewingMsg && generateAiProposal(viewingMsg)}
                                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm shadow-indigo-600/20"
                                >
                                    <Sparkles size={16} /> Generate Proposal
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setDeleteId(viewingMsg?.id || null)}
                                    className="p-2.5 text-destructive hover:bg-destructive/10 rounded-lg transition-colors flex items-center justify-center"
                                    title="Delete Message"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <button
                                    onClick={() => { setDrawerOpen(false); setViewingMsg(null); }}
                                    className="px-6 py-2.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg text-sm font-medium transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-card border border-border rounded-xl shadow-2xl p-6 max-w-sm w-full animate-in zoom-in-95">
                        <h3 className="text-xl font-display font-medium mb-2">Delete Message?</h3>
                        <p className="text-sm text-muted-foreground mb-6">
                            This action cannot be undone. This will permanently delete the message from the database.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="px-4 py-2 hover:bg-secondary rounded-lg text-sm font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg text-sm font-medium transition-colors"
                            >
                                Yes, delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* AI Proposal Modal */}
            {aiModalOpen && viewingMsg && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[70] flex items-center justify-center p-4 md:p-6" onClick={() => !isGenerating && setAiModalOpen(false)}>
                    <div 
                        className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-indigo-500/10 to-violet-500/10 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                    <Sparkles size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-display font-semibold">AI Proposal Generator</h2>
                                    <p className="text-xs text-muted-foreground">Draft for {viewingMsg.name}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setAiModalOpen(false)}
                                disabled={isGenerating}
                                className="p-2 hover:bg-secondary rounded-lg text-muted-foreground transition-colors disabled:opacity-50"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 bg-secondary/5">
                            <div className="w-full min-h-[300px] bg-background border border-border/50 shadow-inner rounded-xl p-5 text-sm leading-relaxed whitespace-pre-wrap outline-none font-sans">
                                {aiProposal || (isGenerating && "Analyzing client requirements and drafting proposal...")}
                                {isGenerating && <span className="inline-block w-1.5 h-4 ml-1 bg-indigo-500 animate-pulse align-middle" />}
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="px-6 py-4 border-t border-border bg-secondary/20 flex items-center justify-between shrink-0">
                            <p className="text-xs text-muted-foreground">
                                {isGenerating ? (
                                    <span className="flex items-center gap-1.5"><Loader2 size={12} className="animate-spin" /> Generating...</span>
                                ) : "Review and edit the draft before sending."}
                            </p>
                            
                            <div className="flex gap-2">
                                <button
                                    onClick={copyToClipboard}
                                    disabled={isGenerating || !aiProposal}
                                    className="px-4 py-2 border border-border bg-card hover:bg-accent hover:text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    <Copy size={16} /> Copy
                                </button>
                                <button
                                    onClick={openWhatsApp}
                                    disabled={isGenerating || !aiProposal}
                                    className="px-5 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm shadow-[#25D366]/20"
                                >
                                    <Send size={16} /> WhatsApp
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
