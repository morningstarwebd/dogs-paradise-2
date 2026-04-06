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

  // 2. Process Request (no auth — used by SSR/ISR build)
  try {
    const { currentSlug, currentTitle, currentExcerpt, candidates } = await req.json();

    if (!currentSlug || !Array.isArray(candidates) || candidates.length === 0) {
      return NextResponse.json(
        { error: 'currentSlug and candidates array are required' },
        { status: 400 }
      );
    }

    // Build a concise candidate list for the prompt
    const candidateList = candidates
      .slice(0, 15) // Limit to 15 candidates to stay within token limits
      .map((c: { slug: string; title: string; excerpt?: string; category?: string }, i: number) =>
        `${i + 1}. "${c.title}" [${c.category || 'General'}] — ${(c.excerpt || '').slice(0, 80)}`
      )
      .join('\n');

    const prompt = `You are a content recommendation engine for a blog.

CURRENT ARTICLE:
Title: "${currentTitle}"
Excerpt: "${currentExcerpt || ''}"

CANDIDATE ARTICLES:
${candidateList}

Pick the 2 most compelling "next reads" for someone who just finished the current article.
Consider: topic continuity, complementary knowledge, reader engagement flow.

Return ONLY valid JSON: { "picks": [1, 5] }
Where the numbers are the candidate positions (1-indexed) from the list above.`;

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: 'You are a content recommendation engine. Return ONLY valid JSON.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 50,
      temperature: 0.3,
    });

    const raw = completion.choices[0]?.message?.content?.trim() || '';
    const jsonStr = raw.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(jsonStr);

    // Map back picks to slugs
    const picks = Array.isArray(parsed.picks) ? parsed.picks : [];
    const limitedCandidates = candidates.slice(0, 15);
    const recommendedSlugs = picks
      .map((p: number) => limitedCandidates[p - 1]?.slug)
      .filter(Boolean)
      .slice(0, 2);

    return NextResponse.json({
      recommended_slugs: recommendedSlugs,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to get recommendations';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
