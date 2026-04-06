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
    const { content, currentTitle } = await req.json();

    if (!content || typeof content !== 'string' || content.trim().length < 50) {
      return NextResponse.json(
        { error: 'Content must be at least 50 characters to generate SEO metadata' },
        { status: 400 }
      );
    }

    const prompt = `Analyze this blog post content and generate SEO metadata.
${currentTitle ? `Current title: "${currentTitle}"` : ''}

Content (first 2000 chars):
${content.slice(0, 2000)}

Return ONLY valid JSON in this exact format, no markdown fencing:
{
  "meta_title": "SEO-optimized title, max 60 characters, compelling and keyword-rich",
  "meta_description": "Compelling meta description, exactly 140-155 characters, includes primary keyword, has a call-to-action feel"
}`;

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are an expert SEO specialist. Return ONLY valid JSON, no markdown, no explanation.'
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 200,
      temperature: 0.4,
    });

    const raw = completion.choices[0]?.message?.content?.trim() || '';
    
    // Parse JSON from response (handle potential markdown fencing)
    const jsonStr = raw.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(jsonStr);

    return NextResponse.json({
      meta_title: String(parsed.meta_title || '').slice(0, 60),
      meta_description: String(parsed.meta_description || '').slice(0, 160),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to generate SEO metadata';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
