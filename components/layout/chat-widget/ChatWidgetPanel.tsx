import { AnimatePresence, motion } from 'motion/react'
import { Bot, Phone, Send, User } from 'lucide-react'
import { siteConfig } from '@/data/site-config'
import { getWhatsAppLink } from '@/lib/utils'
import { ChatMessageContent } from './ChatMessageContent'
import type { Message } from './chat-widget-types'

interface ChatWidgetPanelProps {
    input: string
    inputRef: React.RefObject<HTMLInputElement | null>
    isOpen: boolean
    isTyping: boolean
    messages: Message[]
    messagesEndRef: React.RefObject<HTMLDivElement | null>
    onInputChange: (value: string) => void
    onSubmit: () => void
}

export function ChatWidgetPanel({
    input,
    inputRef,
    isOpen,
    isTyping,
    messages,
    messagesEndRef,
    onInputChange,
    onSubmit,
}: ChatWidgetPanelProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 18, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 18, scale: 0.97 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className="fixed bottom-36 right-3 z-50 flex max-h-[68vh] w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-[20px] sm:bottom-24 sm:right-6 sm:w-[390px] sm:max-h-[560px]"
                    style={{
                        background: 'rgba(255, 250, 242, 0.98)',
                        border: '1px solid rgba(54, 34, 24, 0.1)',
                        boxShadow: '0 22px 60px rgba(69, 39, 23, 0.18)',
                        backdropFilter: 'blur(18px)',
                    }}
                >
                    <div className="flex items-center gap-3 border-b border-[var(--color-border)] bg-[var(--accent-primary)]/8 px-5 py-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-primary)] text-white">
                            <Bot size={19} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-[var(--text-primary)]">{siteConfig.brandName}</p>
                            <p className="text-[11px] text-[var(--text-secondary)]">Online now. Best support on WhatsApp.</p>
                        </div>
                        <a
                            href={getWhatsAppLink(siteConfig.whatsappNumber, 'Hi, I need help with a puppy.')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--whatsapp)]/12 text-[var(--whatsapp)] transition-colors hover:bg-[var(--whatsapp)]/20"
                            aria-label="Chat on WhatsApp"
                        >
                            <Phone size={16} />
                        </a>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
                        <div className="space-y-4">
                            {messages.map((message) => (
                                <div key={message.id} className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {message.role === 'bot' && (
                                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
                                            <Bot size={14} />
                                        </div>
                                    )}

                                    <div
                                        className={`max-w-[82%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${
                                            message.role === 'user'
                                                ? 'rounded-br-md text-white'
                                                : 'rounded-bl-md border border-[var(--color-border)] bg-white text-[var(--text-secondary)]'
                                        }`}
                                        style={message.role === 'user' ? { background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-tertiary))' } : undefined}
                                    >
                                        <ChatMessageContent text={message.text} />
                                        <p className={`mt-1.5 text-[9px] ${message.role === 'user' ? 'text-white/60' : 'text-[var(--text-tertiary)]'}`}>
                                            {message.time}
                                        </p>
                                    </div>

                                    {message.role === 'user' && (
                                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-secondary)]/10 text-[var(--accent-secondary)]">
                                            <User size={14} />
                                        </div>
                                    )}
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex items-start gap-2">
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
                                        <Bot size={14} />
                                    </div>
                                    <div className="rounded-2xl rounded-bl-md border border-[var(--color-border)] bg-white px-4 py-3">
                                        <div className="flex gap-1">
                                            {[0, 140, 280].map((delay) => (
                                                <span
                                                    key={delay}
                                                    className="h-2 w-2 animate-bounce rounded-full bg-[var(--accent-primary)]/35"
                                                    style={{ animationDelay: `${delay}ms` }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    <div className="border-t border-[var(--color-border)] bg-white/70 px-4 py-3">
                        <form
                            onSubmit={(event) => {
                                event.preventDefault()
                                onSubmit()
                            }}
                            className="flex items-center gap-2"
                        >
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(event) => onInputChange(event.target.value)}
                                placeholder="Type your question..."
                                className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent-primary)] focus:outline-none"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className="flex h-10 w-10 items-center justify-center rounded-xl text-white transition-opacity disabled:opacity-35"
                                style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-tertiary))' }}
                            >
                                <Send size={16} />
                            </button>
                        </form>
                        <p className="mt-2 text-center text-[10px] text-[var(--text-tertiary)]">For urgent queries, WhatsApp us directly.</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
