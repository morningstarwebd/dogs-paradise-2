import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { groq, GROQ_MODEL } from '@/lib/groq';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type BreedResult = {
  title: string;
  image: string;
  url: string;
  source: 'database' | 'ai';
};

async function searchBreeds(query: string): Promise<BreedResult[]> {
  const { data, error } = await supabaseAdmin
    .from('projects')
    .select('title, slug, cover_image')
    .ilike('title', `%${query}%`)
    .order('title')
    .limit(10);

  if (error || !data) return [];

  return data.map((row) => ({
    title: row.title,
    image: row.cover_image || '',
    url: `/breeds/${row.slug}`,
    source: 'database' as const,
  }));
}

async function suggestBreedName(query: string): Promise<string | null> {
  if (!groq) return null;

  try {
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: 'system',
          content:
            'You are a dog breed name corrector. Given a potentially misspelled or incomplete dog breed name, respond with ONLY the correct, properly capitalized breed name. If you cannot determine the breed, respond with "UNKNOWN". Do not include any explanation, punctuation, or extra text.',
        },
        {
          role: 'user',
          content: `Correct this dog breed name: "${query}"`,
        },
      ],
      temperature: 0.1,
      max_tokens: 50,
    });

    const suggested = completion.choices[0]?.message?.content?.trim();
    if (!suggested || suggested === 'UNKNOWN') return null;
    return suggested;
  } catch (err) {
    console.error('[breed-lookup] Groq API error:', err);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const query = typeof body.query === 'string' ? body.query.trim() : '';

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    // Step 1: Direct DB search
    const dbResults = await searchBreeds(query);

    if (dbResults.length > 0) {
      return NextResponse.json({ results: dbResults });
    }

    // Step 2: AI-assisted correction → re-search
    const corrected = await suggestBreedName(query);

    if (corrected && corrected.toLowerCase() !== query.toLowerCase()) {
      const aiResults = await searchBreeds(corrected);

      if (aiResults.length > 0) {
        return NextResponse.json({
          results: aiResults.map((r) => ({ ...r, source: 'ai' as const })),
          correctedQuery: corrected,
        });
      }

      // Breed corrected but not in our DB — return as suggestion only
      return NextResponse.json({
        results: [
          {
            title: corrected,
            image: '',
            url: `/breeds/${corrected.toLowerCase().replace(/\s+/g, '-')}`,
            source: 'ai' as const,
          },
        ],
        correctedQuery: corrected,
        note: 'Breed not in database — suggested by AI',
      });
    }

    return NextResponse.json({ results: [] });
  } catch (err) {
    console.error('[breed-lookup] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
