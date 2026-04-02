'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Bot, User, Phone, ExternalLink } from 'lucide-react';
import { siteConfig } from '@/data/site-config';
import { dogs } from '@/data/dogs';
import { getWhatsAppLink, formatPrice } from '@/lib/utils';

interface Message {
  id: string;
  role: 'bot' | 'user';
  text: string;
  time: string;
}

const INITIAL_MESSAGE: Message = {
  id: 'welcome',
  role: 'bot',
  text: `🐾 Welcome to Dogs Paradice! I'm your virtual assistant.\n\nI can help you with:\n• Finding the right breed for you\n• Pricing & availability info\n• Health documents & KCI papers\n• Delivery & payment questions\n• Connecting you to our team on WhatsApp\n\nHow can I help you today?`,
  time: getTime(),
};

function getTime() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

// === Knowledge Base for responses ===
function generateResponse(input: string): string {
  const q = input.toLowerCase().trim();

  // Greetings
  if (/^(hi|hello|hey|hola|namaskar|namaste|assalamu|salam)/i.test(q)) {
    return `Hello! 👋 Welcome to ${siteConfig.brandName}! How can I help you today? You can ask me about our puppies, breeds, pricing, health guarantees, delivery, or anything else!`;
  }

  // Contact / WhatsApp
  if (/contact|phone|number|whatsapp|call|reach|talk/i.test(q)) {
    return `📞 You can reach us directly:\n\n**Phone/WhatsApp:** ${siteConfig.phone}\n\n👉 [Click here to WhatsApp us](https://wa.me/${siteConfig.whatsappNumber})\n\n**Email:** ${siteConfig.email}\n**Address:** ${siteConfig.address}, ${siteConfig.city}, ${siteConfig.state}\n\nWe typically respond within 5 minutes on WhatsApp!`;
  }

  // Price / cost
  if (/price|cost|rate|kitna|koto|charge|budget|expensive|cheap|afford/i.test(q)) {
    const available = dogs.filter(d => d.status === 'available');
    const prices = available.map(d => d.price).filter((p): p is number => p !== null);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return `💰 Our puppy prices range from **${formatPrice(min)}** to **${formatPrice(max)}** depending on breed, quality (pet vs show), and lineage.\n\nAll prices include:\n• KCI registration papers\n• Complete vaccination records\n• Health certificate\n• Deworming schedule\n• Puppy starter kit\n\nWould you like pricing for a specific breed? Or contact us on WhatsApp for current offers: ${siteConfig.phone}`;
  }

  // Available breeds / puppies
  if (/available|stock|which breed|what breed|kono breed|ki ki ache|have any/i.test(q)) {
    const available = dogs.filter(d => d.status === 'available');
    const breedList = [...new Set(available.map(d => d.breedName))];
    return `🐕 Currently available breeds:\n\n${breedList.map(b => `• **${b}**`).join('\n')}\n\n(${available.length} puppies in total)\n\nWant to know more about any specific breed? Or browse all puppies on our [Breeds page](/breeds).`;
  }

  // Specific breeds
  if (/golden retriever/i.test(q)) {
    const grs = dogs.filter(d => /golden/i.test(d.breedName));
    return `🌟 **Golden Retriever** — India's most popular family dog!\n\n• Size: Large (25-34 kg)\n• Lifespan: 10-12 years\n• Great with kids: ✅\n• Energy: High\n• Grooming: Regular brushing needed\n\nWe have **${grs.length}** Golden Retriever(s) available. Starting from ${formatPrice(grs[0]?.price)}.\n\nWant to see them? Visit our [Breeds page](/breeds) or WhatsApp us at ${siteConfig.phone} for live photos! 📸`;
  }
  if (/labrador|lab /i.test(q)) {
    const labs = dogs.filter(d => /labrador/i.test(d.breedName));
    return `🎾 **Labrador Retriever** — Loyal, playful, and perfect for families!\n\n• Size: Large (25-36 kg)\n• Lifespan: 10-14 years\n• Great with kids: ✅\n• Apartment friendly: Needs space\n• Training: Very easy to train\n\nWe have **${labs.length}** Labrador(s) available. Starting from ${formatPrice(labs[0]?.price)}.\n\nMessage us on WhatsApp for live photos and videos: ${siteConfig.phone}`;
  }
  if (/husky|siberian/i.test(q)) {
    const huskies = dogs.filter(d => /husky/i.test(d.breedName));
    return `❄️ **Siberian Husky** — Stunning, energetic, and majestic!\n\n• Size: Medium-Large\n• Lifespan: 12-14 years\n• Needs AC: Yes (heavy coat)\n• Energy: Very high\n• Vocal: Yes, they "talk" 🗣️\n\nWe have **${huskies.length}** Husky/Huskies available. Starting from ${formatPrice(huskies[0]?.price)}.\n\n⚠️ Huskies need a cool climate or AC rooms in India. Happy to discuss on WhatsApp: ${siteConfig.phone}`;
  }
  if (/german shepherd|gsd|alsatian/i.test(q)) {
    const gsds = dogs.filter(d => /german shepherd/i.test(d.breedName));
    return `🐺 **German Shepherd** — The king of guard dogs!\n\n• Size: Large (30-40 kg)\n• Lifespan: 9-13 years\n• Guard dog: Excellent ✅\n• Intelligence: Top 3 smartest breeds\n• Training: Highly trainable\n\nWe have **${gsds.length}** German Shepherd(s) available. Starting from ${formatPrice(gsds[0]?.price)}.\n\nContact us for pedigree details: ${siteConfig.phone}`;
  }

  // Health / vaccination
  if (/vaccin|deworm|health|vet|medical|injection|checkup|guarantee/i.test(q)) {
    return `🏥 **Health & Vaccination Info:**\n\n✅ All puppies receive:\n• DHPPi vaccination (Distemper, Hepatitis, Parvo)\n• Anti-rabies (when age-appropriate)\n• Complete deworming schedule\n• Full veterinary health checkup\n\n📋 Documents provided:\n• Vaccination card with batch numbers\n• Health certificate\n• KCI registration papers\n• 3-generation pedigree\n\n🛡️ **Health Guarantee:** Written health guarantee covering congenital issues.\n\nAny specific health question? Ask away!`;
  }

  // KCI / registration
  if (/kci|registration|pedigree|papers|document|certificate/i.test(q)) {
    return `📜 **KCI Registration:**\n\nYes, all our puppies are **Kennel Club of India (KCI) registered** with:\n\n• Original KCI registration certificate\n• 3-generation pedigree lineage\n• Both parents KCI certified\n• Transfer of ownership papers\n\nKCI papers guarantee your puppy's breed authenticity and purity. Essential for future breeding or dog shows.\n\nNeed more details? WhatsApp us: ${siteConfig.phone}`;
  }

  // Delivery
  if (/deliver|shipping|transport|send|location|bangalore|outside|pan india|city/i.test(q)) {
    return `🚚 **Delivery Information:**\n\n**Local (Bangalore):** Free pickup from our facility, or home delivery within the city.\n\n**Pan India:** Safe, climate-controlled pet transport via:\n• Road transport (nearby states)\n• Air cargo (distant cities)\n• Live tracking available\n• Puppy travels with food, water, and care instructions\n\n📍 Our Facility: ${siteConfig.address}, ${siteConfig.city}\n\nDelivery charges depend on distance. WhatsApp us for a quote: ${siteConfig.phone}`;
  }

  // Payment
  if (/payment|pay|advance|booking|reserve|upi|gpay|bank/i.test(q)) {
    return `💳 **Payment Process:**\n\n1. **Reserve:** Pay 30-50% advance to book your puppy\n2. **Balance:** Remaining amount on pickup/before delivery\n\n**Methods accepted:**\n• UPI (GPay, PhonePe, Paytm)\n• Bank transfer (NEFT/IMPS)\n• Cash on pickup\n\n**Note:** We do NOT accept full COD for safety. A reservation advance is required.\n\nReceipt and booking confirmation provided for every payment.\n\nWhatsApp us to start: ${siteConfig.phone}`;
  }

  // Visit
  if (/visit|come|see|facility|farm|kennel|location|address|where/i.test(q)) {
    return `📍 **Visit Our Facility:**\n\n**Address:** ${siteConfig.address}, ${siteConfig.city}, ${siteConfig.state}\n\n📅 **Visiting hours:** 10 AM - 7 PM (all days)\n💡 Prior appointment recommended on WhatsApp\n\nWhen you visit, you can:\n• Meet the puppy in person\n• See the parents\n• Check health papers\n• Inspect our facility\n\nSchedule a visit: ${siteConfig.phone}\n[Open in Google Maps](${siteConfig.googleMapsUrl})`;
  }

  // Training
  if (/train|potty|command|behavior|bite|bark|obedien/i.test(q)) {
    return `🎓 **Training Support:**\n\nWe provide a complete puppy training guide with every purchase covering:\n\n• Potty training basics\n• Crate training\n• Basic commands (sit, stay, come)\n• Bite inhibition\n• Leash training\n• Socialization tips\n\nPlus **lifetime WhatsApp support** for any behavioral questions!\n\nFor professional training nearby, we can recommend trusted trainers in ${siteConfig.city}.\n\nCheck our [Puppy Care Guide](#puppy-care) on the homepage!`;
  }

  // Food / diet
  if (/food|diet|feed|eat|nutrition|kibble/i.test(q)) {
    return `🍖 **Feeding Guide:**\n\nEvery puppy comes with a detailed diet chart, but generally:\n\n**Puppy (2-6 months):** 3-4 meals/day\n• Premium puppy kibble (Royal Canin, etc)\n• Soaked in warm water for tiny breeds\n• Calcium supplements for large breeds\n\n**Adult (6+ months):** 2 meals/day\n• Dry kibble + boiled chicken/eggs\n• Fresh water always available\n\n🚫 **Never give:** Chocolate, grapes, onions, cooked bones\n\nCheck our [Care Guide](#puppy-care) for more!`;
  }

  // Thank you
  if (/thank|thanks|dhanyabaad|dhonnobad/i.test(q)) {
    return `You're welcome! 😊 Happy to help!\n\nIf you need anything else, feel free to ask. Or reach us directly on WhatsApp: ${siteConfig.phone}\n\n🐾 We hope to help you find your perfect companion!`;
  }

  // Bye
  if (/bye|goodbye|see you|tata/i.test(q)) {
    return `Goodbye! 👋 It was great chatting with you.\n\nRemember, we're always available on WhatsApp: ${siteConfig.phone}\n\n🐾 Hope to see you soon at Dogs Paradice!`;
  }

  // Default fallback
  return `I'd love to help with that! For personalized assistance, our team is available on WhatsApp:\n\n📱 **${siteConfig.phone}**\n👉 [Chat on WhatsApp](https://wa.me/${siteConfig.whatsappNumber})\n\nOr you can ask me about:\n• Available breeds & pricing\n• Health guarantees & vaccinations\n• Delivery & payment options\n• Visiting our facility\n• Training & care tips`;
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
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
      time: getTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = generateResponse(trimmed);
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        role: 'bot',
        text: botResponse,
        time: getTime(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600 + Math.random() * 800);
  }, [input]);

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300"
        style={{
          background: isOpen
            ? 'rgba(255,255,255,0.1)'
            : 'linear-gradient(135deg, #a855f7, #6366f1)',
          backdropFilter: isOpen ? 'blur(20px)' : undefined,
          border: isOpen ? '1px solid rgba(255,255,255,0.15)' : 'none',
          boxShadow: isOpen ? 'none' : '0 4px 30px rgba(168,85,247,0.4)',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={22} className="text-white" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <MessageCircle size={22} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Pulse ring when closed */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full pointer-events-none">
          <span className="absolute inset-0 rounded-full bg-purple-500/30 animate-ping" />
        </div>
      )}

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] max-h-[70vh] rounded-2xl overflow-hidden flex flex-col"
            style={{
              background: 'rgba(16, 16, 20, 0.95)',
              backdropFilter: 'blur(40px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03) inset',
            }}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <Bot size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">Dogs Paradice</p>
                <p className="text-[10px] text-green-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                  Online · Typically replies instantly
                </p>
              </div>
              <a
                href={getWhatsAppLink(siteConfig.whatsappNumber, 'Hi, I need help with a puppy!')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 hover:bg-green-500/20 transition-colors"
                aria-label="Chat on WhatsApp"
              >
                <Phone size={14} />
              </a>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0" style={{ maxHeight: 'calc(70vh - 140px)' }}>
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'bot' && (
                    <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot size={14} className="text-purple-400" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-md'
                        : 'bg-white/5 border border-white/5 text-[var(--text-secondary)] rounded-bl-md'
                    }`}
                  >
                    <ChatMessageContent text={msg.text} />
                    <p className={`text-[9px] mt-1.5 ${msg.role === 'user' ? 'text-white/40' : 'text-white/20'}`}>
                      {msg.time}
                    </p>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                      <User size={14} className="text-white/50" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2 items-start">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                    <Bot size={14} className="text-purple-400" />
                  </div>
                  <div className="bg-white/5 border border-white/5 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-white/5 shrink-0">
              <form
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your question..."
                  className="flex-1 bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-purple-500/30 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white disabled:opacity-30 transition-opacity hover:shadow-lg hover:shadow-purple-500/20"
                >
                  <Send size={16} />
                </button>
              </form>
              <p className="text-[9px] text-white/15 text-center mt-2">
                Powered by Dogs Paradice AI · For complex queries, WhatsApp us
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Render markdown-like text with bold and links
function ChatMessageContent({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1.5" />;
        // Process bold **text** and links [text](url)
        const processed = line
          .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
          .replace(
            /\[(.*?)\]\((.*?)\)/g,
            '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-purple-400 underline underline-offset-2 hover:text-purple-300">$1</a>'
          );
        return <p key={i} dangerouslySetInnerHTML={{ __html: processed }} />;
      })}
    </div>
  );
}
