-- ============================================================
-- Migration 003: Drop legacy overly-permissive RLS policies
-- These old policies use USING(true) which bypasses the new
-- is_admin_user() based policies (since PERMISSIVE = OR logic).
-- ============================================================

-- blog_posts: remove "Auth users can manage posts" (USING true, ALL, authenticated)
DROP POLICY IF EXISTS "Auth users can manage posts" ON public.blog_posts;

-- contact_messages: remove "Auth users can manage messages" (USING true, ALL, authenticated)
DROP POLICY IF EXISTS "Auth users can manage messages" ON public.contact_messages;

-- media_files: remove "Auth can manage media" (USING true, ALL, authenticated)
DROP POLICY IF EXISTS "Auth can manage media" ON public.media_files;

-- projects: remove "Auth users can modify projects" (USING true, ALL, authenticated)
DROP POLICY IF EXISTS "Auth users can modify projects" ON public.projects;

-- seo_settings: remove "Auth users can modify seo" (USING true, ALL, authenticated)
DROP POLICY IF EXISTS "Auth users can modify seo" ON public.seo_settings;

-- website_sections: remove "Auth users can modify sections" (USING true, ALL, authenticated)
DROP POLICY IF EXISTS "Auth users can modify sections" ON public.website_sections;

-- admin_users: remove "Authenticated users can read admin_users" (USING true, SELECT, authenticated)
DROP POLICY IF EXISTS "Authenticated users can read admin_users" ON public.admin_users;

-- pages: remove old "Allow admins full access" (uses subquery instead of is_admin_user())
DROP POLICY IF EXISTS "Allow admins full access" ON public.pages;

-- ============================================================
-- Fix: Set search_path on current_user_email() to prevent
-- search_path injection attacks.
-- ============================================================
CREATE OR REPLACE FUNCTION public.current_user_email()
RETURNS text
LANGUAGE sql
STABLE
SET search_path = public
AS $$
    SELECT lower(coalesce(auth.jwt() ->> 'email', ''));
$$;

-- ============================================================
-- contact_rate_limits: Add service_role-only policy so that
-- the consume_contact_rate_limit() SECURITY DEFINER function
-- can operate, but no direct user access is allowed.
-- ============================================================
DROP POLICY IF EXISTS "Service role only" ON public.contact_rate_limits;
CREATE POLICY "Service role only" ON public.contact_rate_limits
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);
