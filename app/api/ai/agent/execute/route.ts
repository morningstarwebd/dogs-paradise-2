import { NextRequest, NextResponse } from 'next/server';
import { groq, GROQ_MODEL } from '@/lib/groq';
import { createClient } from '@/lib/supabase/server';

/* ─────────────────────────────────────────────────────────────────────
 *  AI Agent Execute — Runs an approved action plan step by step
 * ──────────────────────────────────────────────────────────────────── */

interface AgentStep {
  action: string;
  description: string;
  params: Record<string, unknown>;
}

export async function POST(req: NextRequest) {
  if (!groq) {
    return NextResponse.json({ error: 'AI service is not configured' }, { status: 503 });
  }

  const supabase = await createClient();

  try {
    const { steps } = await req.json();
    if (!Array.isArray(steps) || steps.length === 0) {
      return NextResponse.json({ error: 'Steps array is required' }, { status: 400 });
    }

    const results: Array<{ step: string; status: 'success' | 'error'; result: string }> = [];

    for (const step of steps.slice(0, 5) as AgentStep[]) {
      try {
        switch (step.action) {
          case 'create_blog_draft': {
            const title = String(step.params.title || 'Untitled Draft');
            const category = String(step.params.category || 'General');
            const tags = Array.isArray(step.params.tags) ? step.params.tags : [];

            // Generate content using AI
            const draftPrompt = `Write a professional blog post for a web design agency.
Title: "${title}"
Category: ${category}
Tags: ${tags.join(', ')}
${step.params.source_message_id ? `This is based on a client inquiry. Make it a case study style.` : ''}

Write 400-600 words in markdown format. Be specific and actionable.`;

            const draftCompletion = await groq.chat.completions.create({
              model: GROQ_MODEL,
              messages: [
                { role: 'system', content: 'You are a professional blog writer for a web design agency. Write engaging, SEO-friendly content.' },
                { role: 'user', content: draftPrompt },
              ],
              max_tokens: 1500,
              temperature: 0.6,
            });

            const content = draftCompletion.choices[0]?.message?.content || '';
            const slug = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '');
            const wordCount = content.split(/\s+/).length;
            const readingTime = Math.max(1, Math.ceil(wordCount / 200));

            const { error: insertError } = await supabase
              .from('blog_posts')
              .insert({
                title,
                slug,
                content,
                category,
                tags,
                excerpt: '',
                cover_image: '',
                published: false,
                reading_time: readingTime,
              });

            if (insertError) throw new Error(insertError.message);
            results.push({ step: step.description, status: 'success', result: `Draft "${title}" created (${wordCount} words)` });
            break;
          }

          case 'generate_seo': {
            const postTitle = String(step.params.post_title || step.params.title || '');
            if (!postTitle) throw new Error('Post title required');

            // Fetch the post
            const { data: post } = await supabase
              .from('blog_posts')
              .select('id, content, excerpt')
              .eq('title', postTitle)
              .maybeSingle();

            if (!post) throw new Error(`Post "${postTitle}" not found`);

            const seoCompletion = await groq.chat.completions.create({
              model: GROQ_MODEL,
              messages: [
                { role: 'system', content: 'Generate SEO metadata. Return ONLY JSON: { "meta_description": "..." }' },
                { role: 'user', content: `Generate SEO meta description for: "${postTitle}"\nContent: ${(post.content || '').slice(0, 500)}` },
              ],
              max_tokens: 100,
              temperature: 0.3,
            });

            const seoRaw = seoCompletion.choices[0]?.message?.content?.trim() || '';
            const seoJson = JSON.parse(seoRaw.replace(/```json?\n?/g, '').replace(/```/g, '').trim());
            const metaDesc = String(seoJson.meta_description || '').slice(0, 160);

            await supabase
              .from('blog_posts')
              .update({ excerpt: metaDesc })
              .eq('id', post.id);

            results.push({ step: step.description, status: 'success', result: `SEO updated: "${metaDesc.slice(0, 60)}..."` });
            break;
          }

          case 'schedule_post': {
            const scheduleTitle = String(step.params.post_title || step.params.title || '');
            const publishDate = String(step.params.publish_date || new Date(Date.now() + 86400000).toISOString());

            const { data: schedPost } = await supabase
              .from('blog_posts')
              .select('id')
              .eq('title', scheduleTitle)
              .maybeSingle();

            if (!schedPost) throw new Error(`Post "${scheduleTitle}" not found`);

            await supabase
              .from('blog_posts')
              .update({ scheduled_at: publishDate })
              .eq('id', schedPost.id);

            results.push({ step: step.description, status: 'success', result: `Scheduled for ${new Date(publishDate).toLocaleDateString()}` });
            break;
          }

          case 'summarize_lead': {
            const msgId = String(step.params.message_id || step.params.source_message_id || '');
            const { data: msg } = await supabase
              .from('contact_messages')
              .select('*')
              .eq('id', msgId)
              .maybeSingle();

            if (msg) {
              results.push({ step: step.description, status: 'success', result: `Lead: ${msg.name} — ${msg.lead_summary || msg.message?.slice(0, 100) || 'No details'}` });
            } else {
              results.push({ step: step.description, status: 'success', result: 'Message reference noted' });
            }
            break;
          }

          default:
            results.push({ step: step.description, status: 'success', result: `Action "${step.action}" acknowledged` });
        }
      } catch (stepErr: unknown) {
        const errMsg = stepErr instanceof Error ? stepErr.message : 'Step failed';
        results.push({ step: step.description, status: 'error', result: errMsg });
      }
    }

    return NextResponse.json({ results, completed: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to execute plan';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
