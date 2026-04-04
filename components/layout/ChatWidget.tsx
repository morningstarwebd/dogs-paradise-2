'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Bot, MessageCircle, Phone, Send, User, X } from 'lucide-react';
import { siteConfig } from '@/data/site-config';
import { dogs } from '@/data/dogs';
import { getWhatsAppLink } from '@/lib/utils';

interface Message {
  id: string;
  role: 'bot' | 'user';
  text: string;
  time: string;
}

const INITIAL_MESSAGE: Message = {
  id: 'welcome',
  role: 'bot',
  text: [
    `Welcome to ${siteConfig.brandName}.`,
    '',
    'I can help you with:',
    '- available breeds and puppy types',
    '- pricing and availability',
    '- health records and paperwork questions',
    '- delivery, visits, and support',
    '',
    'How can I help you today?',
  ].join('\n'),
  time: getTime(),
};

function getTime() {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function formatBusinessHours() {
  return siteConfig.businessHours.map((item) => `${item.days}: ${item.hours}`).join('\n');
}

function generateResponse(input: string): string {
  const q = input.toLowerCase().trim();

  if (/^(hi|hello|hey|namaste|namaskar|assalamu|salam)/i.test(q)) {
    return `Hello and welcome to ${siteConfig.brandName}. Ask me about breeds, pricing, health details, visits, or WhatsApp support.`;
  }

  if (/contact|phone|number|whatsapp|call|reach|talk/i.test(q)) {
    return [
      `You can reach us directly at **${siteConfig.phone}**.`,
      '',
      `[Chat on WhatsApp](https://wa.me/${siteConfig.whatsappNumber})`,
      '',
      `Email: ${siteConfig.email}`,
      `Address: ${siteConfig.address}, ${siteConfig.city}, ${siteConfig.state}`,
    ].join('\n');
  }

  if (/price|cost|rate|budget|charge|expensive|cheap|afford/i.test(q)) {
    return [
      'Pricing depends on breed, age, quality, and availability.',
      '',
      'Our team shares custom details after understanding what kind of puppy you want.',
      '',
      'Health records are discussed clearly, and registration paperwork is confirmed only where applicable.',
      '',
      `For a quick quote, WhatsApp us at ${siteConfig.phone}.`,
    ].join('\n');
  }

  if (/available|stock|which breed|what breed|have any/i.test(q)) {
    const available = dogs.filter((dog) => dog.status === 'available');
    const breedList = [...new Set(available.map((dog) => dog.breedName))];

    return [
      'Currently available breeds:',
      '',
      ...breedList.map((breed) => `- **${breed}**`),
      '',
      `There are ${available.length} available puppy listings right now.`,
      '',
      'You can also browse our [Breeds page](/breeds).',
    ].join('\n');
  }

  if (/golden retriever/i.test(q)) {
    const matches = dogs.filter((dog) => /golden/i.test(dog.breedName));
    return [
      '**Golden Retriever**',
      '- gentle family companion',
      '- high energy and regular grooming',
      '- very good with families and children',
      '',
      `We currently have ${matches.length} Golden Retriever listing(s).`,
      `WhatsApp us at ${siteConfig.phone} for live photos and current details.`,
    ].join('\n');
  }

  if (/labrador|lab /i.test(q)) {
    const matches = dogs.filter((dog) => /labrador/i.test(dog.breedName));
    return [
      '**Labrador Retriever**',
      '- playful and adaptable',
      '- easy to train',
      '- great for active homes',
      '',
      `We currently have ${matches.length} Labrador listing(s).`,
      `Message us on WhatsApp at ${siteConfig.phone} for current options.`,
    ].join('\n');
  }

  if (/husky|siberian/i.test(q)) {
    const matches = dogs.filter((dog) => /husky/i.test(dog.breedName));
    return [
      '**Siberian Husky**',
      '- striking appearance and very high energy',
      '- needs careful climate management in India',
      '- best for families ready for grooming and exercise',
      '',
      `We currently have ${matches.length} Husky listing(s).`,
      `Happy to discuss suitability on WhatsApp: ${siteConfig.phone}.`,
    ].join('\n');
  }

  if (/german shepherd|gsd|alsatian/i.test(q)) {
    const matches = dogs.filter((dog) => /german shepherd/i.test(dog.breedName));
    return [
      '**German Shepherd**',
      '- loyal and highly trainable',
      '- strong guardian instincts',
      '- needs structure and regular activity',
      '',
      `We currently have ${matches.length} German Shepherd listing(s).`,
      `Contact us at ${siteConfig.phone} for more details.`,
    ].join('\n');
  }

  if (/vaccin|deworm|health|vet|medical|checkup|guarantee/i.test(q)) {
    return [
      '**Health and vaccination details**',
      '',
      '- age-appropriate vaccination updates',
      '- deworming records',
      '- vet health checks',
      '- feeding and care guidance',
      '',
      'Paperwork varies by puppy. We always explain what is included before booking.',
    ].join('\n');
  }

  if (/kci|registration|pedigree|papers|document|certificate/i.test(q)) {
    return [
      '**Registration and paperwork**',
      '',
      siteConfig.registrationNote,
      '',
      'If a puppy is paperwork-eligible, we confirm the exact details during the enquiry.',
      `For fast confirmation, WhatsApp us at ${siteConfig.phone}.`,
    ].join('\n');
  }

  if (/deliver|shipping|transport|send|location|outside|pan india|city/i.test(q)) {
    return [
      '**Delivery support**',
      '',
      '- pickup from our Bengaluru location',
      '- Bangalore delivery support',
      '- outstation travel guidance depending on route and conditions',
      '',
      `Location: ${siteConfig.address}, ${siteConfig.city}`,
      `WhatsApp ${siteConfig.phone} to check delivery options for your city.`,
    ].join('\n');
  }

  if (/payment|pay|advance|booking|reserve|upi|gpay|bank/i.test(q)) {
    return [
      '**Booking process**',
      '',
      '- first confirm the puppy and details with our team',
      '- booking is handled after the discussion',
      '- balance is completed before pickup or delivery',
      '',
      `For the latest booking steps, message us at ${siteConfig.phone}.`,
    ].join('\n');
  }

  if (/visit|come|see|facility|farm|kennel|address|where/i.test(q)) {
    return [
      '**Visit information**',
      '',
      `Address: ${siteConfig.address}, ${siteConfig.city}, ${siteConfig.state}`,
      '',
      'Business hours:',
      formatBusinessHours(),
      '',
      `Please WhatsApp ${siteConfig.phone} before visiting.`,
      `[Open in Google Maps](${siteConfig.googleMapsUrl})`,
    ].join('\n');
  }

  if (/train|potty|command|behavior|obedien|bite|bark/i.test(q)) {
    return [
      '**After-pickup support**',
      '',
      '- settling-in guidance',
      '- feeding basics',
      '- routine and early training tips',
      '- help for first-time pet parents',
      '',
      'You can also message us anytime after pickup for support.',
    ].join('\n');
  }

  if (/food|diet|feed|eat|nutrition|kibble/i.test(q)) {
    return [
      '**Feeding guidance**',
      '',
      'We share a basic food plan, transition advice, and age-based feeding guidance when you enquire or book.',
      '',
      'If you already have a puppy in mind, message us and we will guide you based on the breed and age.',
    ].join('\n');
  }

  if (/thank|thanks|dhanyabaad|dhonnobad/i.test(q)) {
    return `You are welcome. If you need anything else, just message here or contact us on WhatsApp at ${siteConfig.phone}.`;
  }

  if (/bye|goodbye|see you|tata/i.test(q)) {
    return `Thank you for visiting ${siteConfig.brandName}. We are always available on WhatsApp at ${siteConfig.phone}.`;
  }

  return [
    'I can help with breed options, pricing, health details, paperwork questions, visits, and delivery support.',
    '',
    `For the fastest response, contact us on WhatsApp: **${siteConfig.phone}**`,
    `[Chat on WhatsApp](https://wa.me/${siteConfig.whatsappNumber})`,
  ].join('\n');
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();

    if (!trimmed) {
      return;
    }

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
      time: getTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        role: 'bot',
        text: generateResponse(trimmed),
        time: getTime(),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 550 + Math.random() * 500);
  }, [input]);

  return (
    <>
      <motion.button
        onClick={() => setIsOpen((open) => !open)}
        className="fixed bottom-20 right-3 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-xl transition-all duration-300 sm:bottom-6 sm:right-6 sm:h-14 sm:w-14"
        style={{
          background: isOpen
            ? 'rgba(255, 250, 242, 0.94)'
            : '#d4604a',
          border: isOpen ? '1px solid var(--color-border)' : 'none',
          boxShadow: isOpen ? '0 10px 26px rgba(69, 39, 23, 0.18)' : '0 8px 24px rgba(212, 96, 74, 0.4)',
        }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X size={20} className="text-[var(--text-primary)]" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
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
                <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                  {siteConfig.brandName}
                </p>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Online now. Best support on WhatsApp.
                </p>
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
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'bot' && (
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
                        <Bot size={14} />
                      </div>
                    )}

                    <div
                      className={`max-w-[82%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${
                        msg.role === 'user'
                          ? 'rounded-br-md text-white'
                          : 'rounded-bl-md border border-[var(--color-border)] bg-white text-[var(--text-secondary)]'
                      }`}
                      style={
                        msg.role === 'user'
                          ? {
                              background:
                                'linear-gradient(135deg, var(--accent-primary), var(--accent-tertiary))',
                            }
                          : undefined
                      }
                    >
                      <ChatMessageContent text={msg.text} />
                      <p
                        className={`mt-1.5 text-[9px] ${
                          msg.role === 'user' ? 'text-white/60' : 'text-[var(--text-tertiary)]'
                        }`}
                      >
                        {msg.time}
                      </p>
                    </div>

                    {msg.role === 'user' && (
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
                        <span
                          className="h-2 w-2 animate-bounce rounded-full bg-[var(--accent-primary)]/35"
                          style={{ animationDelay: '0ms' }}
                        />
                        <span
                          className="h-2 w-2 animate-bounce rounded-full bg-[var(--accent-primary)]/35"
                          style={{ animationDelay: '140ms' }}
                        />
                        <span
                          className="h-2 w-2 animate-bounce rounded-full bg-[var(--accent-primary)]/35"
                          style={{ animationDelay: '280ms' }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="border-t border-[var(--color-border)] bg-white/70 px-4 py-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your question..."
                  className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent-primary)] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-white transition-opacity disabled:opacity-35"
                  style={{
                    background:
                      'linear-gradient(135deg, var(--accent-primary), var(--accent-tertiary))',
                  }}
                >
                  <Send size={16} />
                </button>
              </form>
              <p className="mt-2 text-center text-[10px] text-[var(--text-tertiary)]">
                For urgent queries, WhatsApp us directly.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ChatMessageContent({ text }: { text: string }) {
  const lines = text.split('\n');

  return (
    <div className="space-y-1">
      {lines.map((line, index) => {
        if (!line.trim()) {
          return <div key={index} className="h-1.5" />;
        }

        const processed = line
          .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-[inherit]">$1</strong>')
          .replace(
            /\[(.*?)\]\((.*?)\)/g,
            '<a href="$2" target="_blank" rel="noopener noreferrer" class="underline underline-offset-2">$1</a>'
          );

        return <p key={index} dangerouslySetInnerHTML={{ __html: processed }} />;
      })}
    </div>
  );
}
