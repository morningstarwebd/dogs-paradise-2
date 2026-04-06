import { AnimatePresence, motion } from 'motion/react'
import { MessageCircle, X } from 'lucide-react'

interface ChatWidgetButtonProps {
    isOpen: boolean
    onToggle: () => void
}

export function ChatWidgetButton({ isOpen, onToggle }: ChatWidgetButtonProps) {
    return (
        <>
            <motion.button
                onClick={onToggle}
                className="fixed bottom-20 right-3 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-xl transition-all duration-300 sm:bottom-6 sm:right-6 sm:h-14 sm:w-14"
                style={{
                    background: isOpen ? 'rgba(255, 250, 242, 0.94)' : '#d4604a',
                    border: isOpen ? '1px solid var(--color-border)' : 'none',
                    boxShadow: isOpen ? '0 10px 26px rgba(69, 39, 23, 0.18)' : '0 8px 24px rgba(212, 96, 74, 0.4)',
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                aria-label={isOpen ? 'Close chat' : 'Open chat'}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                            <X size={20} className="text-[var(--text-primary)]" />
                        </motion.div>
                    ) : (
                        <motion.div key="open" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                            <MessageCircle size={20} className="text-white" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {!isOpen && (
                <div className="pointer-events-none fixed bottom-20 right-3 z-40 h-12 w-12 rounded-full sm:bottom-6 sm:right-6 sm:h-14 sm:w-14">
                    <span className="absolute inset-0 animate-ping rounded-full bg-[#d4604a]/20" />
                </div>
            )}
        </>
    )
}
