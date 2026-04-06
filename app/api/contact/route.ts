import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import * as Sentry from "@sentry/nextjs";
import { createHash } from "node:crypto";
import { groq, GROQ_MODEL } from "@/lib/groq";

// Initialize Resend with fallback for local dev if key is missing
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const RATE_LIMIT_MAX_REQUESTS = 3;
const RATE_LIMIT_WINDOW_SECONDS = 60 * 60;
const contactEmailFrom = process.env.CONTACT_EMAIL_FROM || "Morning Star Web <onboarding@resend.dev>";

function getClientIp(req: Request): string {
    const forwardedFor = req.headers.get("x-forwarded-for");
    if (forwardedFor) {
        const firstIp = forwardedFor.split(",")[0]?.trim();
        if (firstIp) return firstIp;
    }

    const realIp = req.headers.get("x-real-ip");
    if (realIp) return realIp.trim();

    return "unknown";
}

function hashIp(ip: string): string {
    return createHash("sha256").update(ip).digest("hex");
}

function sanitizeMessageForAi(message: string): string {
    return message
        .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[EMAIL]')
        .replace(/\+?\d[\d\s().-]{7,}\d/g, '[PHONE]')
        .replace(/https?:\/\/\S+/gi, '[URL]')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 1500);
}

export async function POST(req: Request) {
    try {
        // Use service role for database writes and rate limiting RPC
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            return NextResponse.json(
                { error: "Server configuration error" },
                { status: 500 }
            );
        }
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Rate limit check (persistent and shared across instances)
        const { data: isAllowed, error: rateLimitError } = await supabase.rpc("consume_contact_rate_limit", {
            p_ip_hash: hashIp(getClientIp(req)),
            p_max_requests: RATE_LIMIT_MAX_REQUESTS,
            p_window_seconds: RATE_LIMIT_WINDOW_SECONDS,
        });

        if (rateLimitError) {
            console.error("Rate limit RPC error:", rateLimitError);
            Sentry.captureException(rateLimitError, {
                tags: { route: "contact-form", source: "rate-limit" },
            });
            return NextResponse.json(
                { error: "Service temporarily unavailable. Please try again." },
                { status: 503 }
            );
        }

        if (!isAllowed) {
            return NextResponse.json(
                { error: "Too many requests. Try again later." },
                { status: 429 }
            );
        }

        let body;
        try {
            body = await req.json();
        } catch {
            return NextResponse.json(
                { error: "Invalid JSON payload." },
                { status: 400 }
            );
        }

        const { name, email, service, budget, message, website } = body;

        // Honeypot check (bots fill hidden fields)
        if (website) {
            // Silently accept; do not reveal this is a trap field.
            return NextResponse.json({ success: true }, { status: 200 });
        }

        // Validate required fields
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Name, email, and message are required." },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Please provide a valid email address." },
                { status: 400 }
            );
        }

        // Validate message length
        if (message.length < 20) {
            return NextResponse.json(
                { error: "Message must be at least 20 characters long." },
                { status: 400 }
            );
        }

        // Save to Supabase contact_messages table
        const { data: insertedRow, error: dbError } = await supabase
            .from("contact_messages")
            .insert([
                {
                    name,
                    email,
                    service: service || "Not specified",
                    budget: budget || "Not specified",
                    message,
                    read: false,
                },
            ])
            .select('id')
            .single();

        if (dbError) {
            console.error("Supabase error:", dbError);
            Sentry.captureException(dbError, {
                tags: { route: "contact-form", source: "supabase" },
            });
            return NextResponse.json(
                { error: "Failed to save message to database." },
                { status: 500 }
            );
        }

        // Send email via Resend
        let emailSubject = `New Project Inquiry from ${name}`;

        // ─── AI Lead Scoring (non-blocking) ───────────────────────
        // This runs AFTER DB save and does NOT block the user response.
        // If it fails, the contact submission still succeeds.
        let leadScore = 0;
        if (groq && insertedRow?.id) {
            try {
                const scorePrompt = `Analyze this contact form submission and score the lead.

Name: [REDACTED]
Email Domain: ${email.split('@')[1] || 'unknown'}
Service requested: ${service || 'Not specified'}
Budget: ${budget || 'Not specified'}
Message: ${sanitizeMessageForAi(message)}

Score this lead from 1-10 based on:
- Urgency indicators (timeline mentions, ASAP, deadline)
- Budget clarity (specific numbers = higher)
- Project scope clarity (detailed requirements = higher)
- Business intent (commercial project vs personal/student)

Return ONLY valid JSON: { "score": N, "summary": "one-line summary of why" }`;

                const scoreResult = await groq.chat.completions.create({
                    model: GROQ_MODEL,
                    messages: [
                        { role: 'system', content: 'You are a lead scoring AI. Return ONLY valid JSON.' },
                        { role: 'user', content: scorePrompt }
                    ],
                    max_tokens: 100,
                    temperature: 0.2,
                });

                const raw = scoreResult.choices[0]?.message?.content?.trim() || '';
                const jsonStr = raw.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
                const parsed = JSON.parse(jsonStr);
                leadScore = Math.min(10, Math.max(1, parseInt(parsed.score) || 0));
                const leadSummary = String(parsed.summary || '').slice(0, 200);

                // Update the row with lead score
                await supabase
                    .from("contact_messages")
                    .update({ lead_score: leadScore, lead_summary: leadSummary })
                    .eq("id", insertedRow.id);

                // Upgrade email subject for hot leads
                if (leadScore >= 8) {
                    emailSubject = `🔥 HOT LEAD: ${name} — ${service || 'Project Inquiry'}`;
                }
            } catch (aiErr) {
                // AI scoring failure must never break the contact form
                console.warn("Lead scoring failed (non-critical):", aiErr);
            }
        }

        if (resend) {
            const { error: emailError } = await resend.emails.send({
                from: contactEmailFrom,
                to: process.env.CONTACT_EMAIL_TO || "hello@morningstarweb.com",
                subject: emailSubject,
                text: `Name: ${name}\nEmail: ${email}\nService: ${service}\nBudget: ${budget}\nMessage: ${message}`
            });

            if (emailError) {
                console.error("Resend error:", emailError);
                Sentry.captureException(emailError, {
                    tags: { route: "contact-form", source: "resend" },
                });
                // The message is saved in DB, so return 200 to user to prevent false-failure UI
            }
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Contact API error:", error);
        Sentry.captureException(error, {
            tags: { route: "contact-form" },
        });
        return NextResponse.json(
            { error: "An unexpected error occurred." },
            { status: 500 }
        );
    }
}
