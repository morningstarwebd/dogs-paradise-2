import { NextRequest, NextResponse } from 'next/server';
import { groq, GROQ_MODEL } from '@/lib/groq';
import { createClient } from '@/lib/supabase/server';
import { isAdminAllowed } from '@/lib/admin-whitelist';

function sanitizeLeadContext(text: string | null | undefined): string {
  return String(text || '')
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[EMAIL]')
    .replace(/\+?\d[\d\s().-]{7,}\d/g, '[PHONE]')
    .replace(/https?:\/\/\S+/gi, '[URL]')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 100);
}

export async function POST(req: NextRequest) {
  if (!groq) {
    return NextResponse.json({ error: 'AI service is not configured' }, { status: 503 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email || !(await isAdminAllowed(user.email))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { command } = await req.json();
    if (!command || typeof command !== 'string' || command.trim().length < 5) {
      return NextResponse.json({ error: 'Command must be at least 5 characters' }, { status: 400 });
    }

    const { data: recentMessages } = await supabase
      .from('contact_messages')
      .select('id, email, service, budget, message, lead_score, lead_summary, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    const { data: recentPosts } = await supabase
      .from('blog_posts')
      .select('id, title, slug, category, published, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    const recentMessageSummary = (recentMessages || [])
      .map((m, i) => {
        const leadSnippet = sanitizeLeadContext(m.lead_summary || m.message);
        return `${i + 1}. [Score: ${m.lead_score || 'N/A'}] [Lead] (${(m.email || '').split('@')[1] || 'unknown domain'}) - ${m.service || 'N/A'} - Budget: ${m.budget || 'N/A'} - "${leadSnippet}"`;
      })
      .join('\n');

    const recentPostSummary = (recentPosts || [])
      .map((p, i) => `${i + 1}. "${p.title}" [${p.published ? 'Published' : 'Draft'}] - Category: ${p.category || 'N/A'}`)
      .join('\n');

    const contextSummary = `
RECENT CONTACT MESSAGES (latest 5):
${recentMessageSummary}

RECENT BLOG POSTS (latest 5):
${recentPostSummary}
`.trim();

    const planPrompt = `You are an AI admin assistant for a web agency CMS.

AVAILABLE ACTIONS:
1. create_blog_draft - Create a new blog post draft (params: title, content, category, tags, excerpt)
2. generate_seo - Auto-generate meta_title and meta_description for a post
3. schedule_post - Set a post to publish at a future date (params: post_title, publish_date)
4. search_messages - Find contact messages by criteria
5. search_posts - Find blog posts by criteria
6. summarize_lead - Get AI insights from a contact message

CURRENT DATABASE CONTEXT:
${contextSummary}

USER COMMAND: "${command.slice(0, 500)}"

Based on the command and database context, create a step-by-step action plan.
Return ONLY valid JSON in this format:
{
  "plan_summary": "Brief human-readable summary of what will be done",
  "steps": [
    {
      "action": "create_blog_draft",
      "description": "Create a blog post about [topic]",
      "params": { "title": "...", "category": "...", "tags": ["..."], "source_message_id": "..." }
    }
  ],
  "requires_data": false
}

Rules:
- Maximum 5 steps per plan
- Use realistic data from the database context when possible
- If the command mentions "latest hot lead" or "recent message", reference the actual data
- Set "requires_data" to true only if you still need more info from the user`;

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: 'You are an admin AI agent. Return ONLY valid JSON action plans.' },
        { role: 'user', content: planPrompt },
      ],
      max_tokens: 800,
      temperature: 0.3,
    });

    const raw = completion.choices[0]?.message?.content?.trim() || '';
    const jsonStr = raw.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    const plan = JSON.parse(jsonStr);

    return NextResponse.json({
      plan_summary: plan.plan_summary || 'Action plan generated',
      steps: Array.isArray(plan.steps) ? plan.steps.slice(0, 5) : [],
      requires_data: plan.requires_data || false,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to generate action plan';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
