import { NextRequest, NextResponse } from 'next/server';
import { groq, GROQ_MODEL } from '@/lib/groq';
import { createClient } from '@supabase/supabase-js';
import { createHash } from 'node:crypto';

// ─── Supabase client for server-side fetch (anon key, no cookies) ──
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Cached AI Settings ──────────────────────────────────────────
type AiSettings = {
  business_info: string;
  ai_personality: string;
  services_list: string;
  pricing_info: string;
  faq: string;
};

let cachedSettings: AiSettings | null = null;
let cacheExpiresAt = 0;

async function getAiSettings(): Promise<AiSettings | null> {
  const now = Date.now();
  if (cachedSettings && now < cacheExpiresAt) return cachedSettings;

  const { data, error } = await supabase
    .from('ai_settings')
    .select('business_info, ai_personality, services_list, pricing_info, faq')
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('[AI Settings] Fetch error:', error.message);
    return cachedSettings; // keep stale cache on error
  }
  if (!data) return null; // no row exists yet
  cachedSettings = data as AiSettings;
  cacheExpiresAt = now + 60_000; // 60s TTL
  return cachedSettings;
}

// ─── Fallback prompt (used when no admin settings exist) ──────────
const FALLBACK_PROMPT = `You are Morning Star Web's AI assistant. Your job is to help visitors learn about Morning Star Web's services.

About Morning Star Web:
- Web design & development agency — Kolkata, India based
- Services: Business websites, dental clinic sites, vet clinic sites, pet shop sites, restaurant sites, portfolio sites
- Specialty: Mobile-first, premium design, fast delivery
- Tech stack: Next.js, React, Tailwind CSS
- Typical delivery: 7-14 days
- Contact: WhatsApp or contact form

Your behavior:
- Reply in a friendly, professional tone in both Bengali and English
- Always encourage contacting at the end
- Never mention competitor names
- Avoid technical jargon — explain in simple language
- Keep responses concise and helpful`;

// ─── Build dynamic prompt from admin settings ─────────────────────
function buildSystemPrompt(s: AiSettings): string {
  const sections: string[] = [
    `You are an AI assistant for a business. Your role is to help website visitors by answering their questions using the knowledge provided below.`,
  ];

  if (s.business_info?.trim()) {
    sections.push(`## Business Information\n${s.business_info.trim()}`);
  }
  if (s.services_list?.trim()) {
    sections.push(`## Services\n${s.services_list.trim()}`);
  }
  if (s.pricing_info?.trim()) {
    sections.push(`## Pricing\n${s.pricing_info.trim()}`);
  }
  if (s.faq?.trim()) {
    sections.push(`## FAQ\n${s.faq.trim()}`);
  }

  // Generative UI instructions (always present)
  sections.push(`## GENERATIVE UI — IMPORTANT
When your response primarily addresses one of these topics, you MUST prepend the corresponding tag as the VERY FIRST line of your reply, on its own line:
- Pricing / cost / rates / budget → [[WIDGET:pricing]]
- Services list / what do you offer / what can you build → [[WIDGET:services]]
- Timeline / how long / delivery time / process → [[WIDGET:timeline]]
- Contact / get in touch / reach out / WhatsApp / phone → [[WIDGET:contact]]
- Portfolio / examples / past work / projects / show me → [[WIDGET:portfolio]]
After the tag, write your normal helpful reply. Only use ONE tag per message.
If the user's question doesn't match any of these topics, just reply normally without any tag.`);

  if (s.ai_personality?.trim()) {
    sections.push(`## Your Behavior\n${s.ai_personality.trim()}`);
  } else {
    sections.push(`## Your Behavior
- Reply in a friendly, professional tone
- Always encourage contacting at the end
- Never mention competitor names
- Avoid technical jargon — explain in simple language
- Keep responses concise and helpful`);
  }

  return sections.join('\n\n');
}

async function getSystemPrompt(): Promise<string> {
  const settings = await getAiSettings();
  if (!settings) return FALLBACK_PROMPT;

  // Check if admin has entered any real content
  const hasContent = [settings.business_info, settings.services_list, settings.pricing_info, settings.faq, settings.ai_personality]
    .some((v) => v?.trim());

  if (!hasContent) return FALLBACK_PROMPT;
  return buildSystemPrompt(settings);
}

// ─── Durable Rate Limiter via Supabase RPC ──────────────────────
function hashIp(ip: string): string {
  return createHash('sha256').update(ip).digest('hex');
}

function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0]?.trim();
    if (firstIp) return firstIp;
  }

  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  return 'unknown';
}

async function checkDurableRateLimit(ip: string): Promise<boolean> {
  const { data: isAllowed, error } = await supabase.rpc('consume_chat_rate_limit', {
    p_ip_hash: hashIp(ip),
    p_max_requests: 10,
    p_window_seconds: 60,
  });

  if (error) {
    throw new Error(error.message);
  }
  return isAllowed === true;
}

export async function POST(req: NextRequest) {
  // Check if Groq is configured
  if (!groq) {
    return NextResponse.json(
      { error: 'AI service is not configured' },
      { status: 503 }
    );
  }

  try {
    const ip = getClientIp(req);
    let isAllowed: boolean;
    try {
      isAllowed = await checkDurableRateLimit(ip);
    } catch (error) {
      if (error instanceof Error) {
        console.error('[Chat Rate Limit] RPC error:', error.message);
      }
      return NextResponse.json(
        { error: 'Service temporarily unavailable. Please try again.' },
        { status: 503 }
      );
    }

    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment.' },
        { status: 429 }
      );
    }

    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Sanitize messages — only keep role and content
    const sanitizedMessages = messages
      .slice(-20) // Keep last 20 messages to avoid token overflow
      .map((m: { role: string; content: string }) => ({
        role: m.role === 'user' ? 'user' as const : 'assistant' as const,
        content: String(m.content).slice(0, 1000), // Limit message length
      }));

    // Fetch the dynamic system prompt (cached, 60s TTL)
    const systemPrompt = await getSystemPrompt();

    const stream = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        ...sanitizedMessages,
      ],
      stream: true,
      max_tokens: 500,
      temperature: 0.7,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || '';
            if (text) controller.enqueue(encoder.encode(text));
          }
        } catch {
          // Stream error — close gracefully
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message) {
      console.error('[Chat API] Request failed:', error.message);
    }
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
