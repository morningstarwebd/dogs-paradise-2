'use client'

import { useEffect, useRef, useState } from 'react'
import { ChatWidgetButton } from './chat-widget/ChatWidgetButton'
import { ChatWidgetPanel } from './chat-widget/ChatWidgetPanel'
import { createInitialMessage, generateResponse, getTime } from './chat-widget/chat-widget-content'
import type { Message } from './chat-widget/chat-widget-types'

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([createInitialMessage()])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [isTyping, messages])

    useEffect(() => {
        if (isOpen) inputRef.current?.focus()
    }, [isOpen])

    const handleSend = () => {
        const trimmed = input.trim()
        if (!trimmed) return

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            role: 'user',
            text: trimmed,
            time: getTime(),
        }

        setMessages((current) => [...current, userMessage])
        setInput('')
        setIsTyping(true)

        window.setTimeout(() => {
            const botMessage: Message = {
                id: `bot-${Date.now()}`,
                role: 'bot',
                text: generateResponse(trimmed),
                time: getTime(),
            }

            setMessages((current) => [...current, botMessage])
            setIsTyping(false)
        }, 550 + Math.random() * 500)
    }

    return (
        <>
            <ChatWidgetButton isOpen={isOpen} onToggle={() => setIsOpen((current) => !current)} />
            <ChatWidgetPanel
                input={input}
                inputRef={inputRef}
                isOpen={isOpen}
                isTyping={isTyping}
                messages={messages}
                messagesEndRef={messagesEndRef}
                onInputChange={setInput}
                onSubmit={handleSend}
            />
        </>
    )
}
