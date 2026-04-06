function requireEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(
            `Missing required environment variable: ${key}`
        );
    }
    return value;
}

export const env = {
    supabaseUrl: requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    supabaseAnonKey: requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
    cronSecret: process.env.CRON_SECRET ?? '',
    superAdminEmails: process.env.SUPER_ADMIN_EMAILS ?? '',
    resendApiKey: process.env.RESEND_API_KEY ?? '',
    contactEmailFrom: process.env.CONTACT_EMAIL_FROM ?? 'Morning Star Web <onboarding@resend.dev>',
    contactEmailTo: process.env.CONTACT_EMAIL_TO ?? 'hello@morningstarweb.com',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://morning-star-web-snowy.vercel.app',
};
