import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import * as Sentry from '@sentry/nextjs';

export async function GET() {
    const headersList = await headers();
    const authHeader = headersList.get('authorization');

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const supabase = await createClient();

        // Send a lightweight query to prevent Supabase project pause
        const { error } = await supabase.from('projects').select('id').limit(1);

        if (error) {
            throw new Error(`Keepalive query failed: ${error.message}`);
        }

        return Response.json({ ok: true, timestamp: new Date().toISOString() });
    } catch (e) {
        Sentry.captureException(e);
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
