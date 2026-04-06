import { NextRequest, NextResponse } from 'next/server';
import { groq, GROQ_MODEL } from '@/lib/groq';
import { createClient } from '@/lib/supabase/server';

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
    const { query } = await req.json();

    if (!query || typeof query !== 'string' || query.trim().length < 3) {
      return NextResponse.json(
        { error: 'Search query must be at least 3 characters' },
        { status: 400 }
      );
    }

    // ─── Column allowlists per table ─────────────────────────────
    const ALLOWED_SEARCH_COLUMNS: Record<string, string[]> = {
      blog_posts: ['title', 'slug', 'excerpt', 'content', 'category'],
      projects: ['title', 'slug', 'description', 'category'],
      pages: ['title', 'slug', 'content'],
      contact_messages: ['name', 'email', 'service', 'budget', 'message'],
    };
    const ALLOWED_FILTER_KEYS: Record<string, string[]> = {
      blog_posts: ['published', 'category'],
      projects: ['featured', 'category'],
      pages: ['published'],
      contact_messages: ['read', 'service'],
    };
    const ALLOWED_ORDER_COLUMNS: Record<string, string[]> = {
      blog_posts: ['created_at', 'title', 'reading_time'],
      projects: ['created_at', 'sort_order', 'title'],
      pages: ['created_at', 'title'],
      contact_messages: ['created_at', 'name'],
    };

    const prompt = `You are a database query translator for a CMS admin panel.
The database has these tables:
1. blog_posts (id, title, slug, excerpt, content, category, tags, published, created_at, reading_time, cover_image)
2. projects (id, title, slug, description, category, live_url, featured, sort_order, created_at)
3. pages (id, title, slug, content, published, created_at)
4. contact_messages (id, name, email, service, budget, message, read, created_at)

Based on this natural language search query, return a JSON object describing what to search:
Query: "${query.slice(0, 200)}"

Return ONLY valid JSON in this exact format:
{
  "table": "blog_posts",
  "search_column": "title",
  "search_term": "the keyword to search for",
  "filters": {},
  "order_by": "created_at",
  "ascending": false,
  "limit": 10
}

Rules:
- "table" must be one of: blog_posts, projects, pages, contact_messages
- "search_column" must be a valid text column for ilike search
- "search_term" is the primary keyword extracted from the query
- "filters" is optional key-value pairs for exact matches (e.g. {"published": true, "category": "dental"})
- Use context clues: "posts"/"blog"/"article" → blog_posts, "project"/"portfolio"/"work" → projects, "contact"/"message"/"lead"/"inquiry" → contact_messages, "page" → pages
- For "unread messages" use filter {"read": false}`;

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: 'You are a search query translator. Return ONLY valid JSON.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 200,
      temperature: 0.2,
    });

    const raw = completion.choices[0]?.message?.content?.trim() || '';
    const jsonStr = raw.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(jsonStr);

    // Validate table name
    const validTables = ['blog_posts', 'projects', 'pages', 'contact_messages'];
    const table = validTables.includes(parsed.table) ? parsed.table : 'blog_posts';

    // Execute the query against Supabase
    const supabase = await createClient();
    let dbQuery = supabase.from(table).select('*');

    // Apply search term (validated against allowlist)
    const allowedSearch = ALLOWED_SEARCH_COLUMNS[table] || [];
    if (parsed.search_term && parsed.search_column && allowedSearch.includes(parsed.search_column)) {
      dbQuery = dbQuery.ilike(parsed.search_column, `%${parsed.search_term}%`);
    }

    // Apply filters (validated against allowlist)
    const allowedFilters = ALLOWED_FILTER_KEYS[table] || [];
    if (parsed.filters && typeof parsed.filters === 'object') {
      for (const [key, value] of Object.entries(parsed.filters)) {
        if (value !== null && value !== undefined && allowedFilters.includes(key)) {
          dbQuery = dbQuery.eq(key, value);
        }
      }
    }

    // Order and limit (validated against allowlist)
    const allowedOrder = ALLOWED_ORDER_COLUMNS[table] || ['created_at'];
    const orderBy = allowedOrder.includes(parsed.order_by) ? parsed.order_by : 'created_at';
    const ascending = parsed.ascending === true;
    const limit = Math.min(parsed.limit || 10, 20);

    dbQuery = dbQuery.order(orderBy, { ascending }).limit(limit);

    const { data, error } = await dbQuery;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      table,
      results: data || [],
      query: parsed.search_term,
      total: data?.length || 0,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to process search';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
