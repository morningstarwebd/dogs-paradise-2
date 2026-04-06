import { NextRequest, NextResponse } from 'next/server';
import { groq, GROQ_MODEL } from '@/lib/groq';
import { createClient } from '@/lib/supabase/server';
import { isAdminAllowed } from '@/lib/admin-whitelist';

export async function POST(req: NextRequest) {
  // 1. Check if Groq is configured
  if (!groq) {
    return NextResponse.json(
      { error: 'AI service is not configured' },
      { status: 503 }
    );
  }

  // 2. Auth Check — Admin only
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email || !(await isAdminAllowed(user.email))) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }

  // 3. Process Request
  try {
    const { topic, keywords, tone } = await req.json();

    if (!topic || typeof topic !== 'string') {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    const prompt = `Write a complete blog post about: "${topic}"
${keywords ? `Target keywords: ${keywords}` : ''}
Tone: ${tone || 'Professional'}

Structure requirements:
1. SEO-optimized title (H1)
2. Meta description (150-160 chars) — label this clearly as "Meta Description:"
3. Introduction (2-3 paragraphs)
4. Main content with H2/H3 subheadings
5. Conclusion with an engaging Call to Action
6. Format entirely in Markdown

Context: Focus on web design, digital presence, and business growth topics relevant to small businesses, clinics, and local services in India.
Keep the language natural, engaging, and easy to read.`;

    const stream = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert SEO copywriter and web design agency blogger.' 
        },
        { 
          role: 'user', 
          content: prompt 
        },
      ],
      stream: true,
      max_tokens: 2500, // Blog posts need more tokens
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
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to generate blog draft';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
