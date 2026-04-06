import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath, revalidateTag } from "next/cache";

function isAuthorized(request: Request): boolean {
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret) return false;

    const authHeader = request.headers.get("authorization");
    return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request: Request) {
    if (!isAuthorized(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        return NextResponse.json(
            { error: "Server configuration error" },
            { status: 500 }
        );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const nowIso = new Date().toISOString();

    const { data, error } = await supabase
        .from("blog_posts")
        .update({
            published: true,
            updated_at: nowIso,
            scheduled_at: null,
        })
        .eq("published", false)
        .not("scheduled_at", "is", null)
        .lte("scheduled_at", nowIso)
        .select("slug");

    if (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }

    const publishedCount = data?.length ?? 0;

    if (publishedCount > 0) {
        // @ts-expect-error Next.js 16.1 canary types issue
        revalidateTag("posts");
        revalidatePath("/blog");
        revalidatePath("/sitemap.xml", "page");

        for (const post of data) {
            if (post.slug) {
                revalidatePath(`/blog/${post.slug}`);
            }
        }
    }

    return NextResponse.json({
        ok: true,
        published: publishedCount,
        at: nowIso,
    });
}
