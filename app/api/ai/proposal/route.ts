import { NextRequest, NextResponse } from 'next/server';
import { groq, GROQ_MODEL } from '@/lib/groq';

export async function POST(req: NextRequest) {
  // 1. Check if Groq is configured
  if (!groq) {
    return NextResponse.json(
      { error: 'AI service is not configured' },
      { status: 503 }
    );
  }

  // 2. Process Request
  try {
    const { clientMessage, clientName, businessType } = await req.json();

    if (!clientMessage) {
      return NextResponse.json(
        { error: 'Client message is required' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are Morning Star Web's expert project proposal writer. 
Read the client's message and write a highly professional, warm, and persuasive project proposal/quote email draft.

Guidelines:
1. Start with a warm greeting (use the client's name if provided).
2. Show understanding of their requirements (echo their needs in your own words).
3. Propose a brief solution tailored to their business type.
4. Mention an estimated timeline: 7-14 days.
5. Provide a clear Next Step: Usually a WhatsApp call or Google Meet meeting to discuss details.
6. Professional sign-off.

Tone: Warm but professional. 
Language: Detect if the client wrote in Bengali or English, and respond in the same language. If Bengali, use a natural, professional Bengali script.

Output should be just the email content itself. Do not include subject lines or placeholders beyond what is strictly necessary.`;

    const userPrompt = `Client Name: ${clientName || 'Not provided'}
Business/Service Type: ${businessType || 'Not provided'}
Client Message:
"""
${clientMessage}
"""`;

    const stream = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      stream: true,
      max_tokens: 1000,
      temperature: 0.6, // Slightly lower for more professional/predictable tone
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
    const message = err instanceof Error ? err.message : 'Failed to generate proposal';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
