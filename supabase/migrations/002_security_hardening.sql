-- Morning Star Web - Security Hardening Migration
-- Version: 002
-- Description: Tightens admin RLS policies, adds media_files, and adds persistent contact form rate limiting.

-- Resolve the current auth email in lowercase.
CREATE OR REPLACE FUNCTION public.current_user_email()
RETURNS text
LANGUAGE sql
STABLE
AS $$
    SELECT lower(coalesce(auth.jwt() ->> 'email', ''));
$$;

-- Central admin check for RLS policies.
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT
        EXISTS (
            SELECT 1
            FROM public.admin_users au
            WHERE lower(au.email) = public.current_user_email()
              AND au.role IN ('admin', 'super_admin')
        );
$$;

REVOKE ALL ON FUNCTION public.is_admin_user() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin_user() TO authenticated;

-- Tighten all admin-write policies to true admins only.
DROP POLICY IF EXISTS "Admin full access" ON public.projects;
CREATE POLICY "Admin full access" ON public.projects
    FOR ALL TO authenticated
    USING (public.is_admin_user())
    WITH CHECK (public.is_admin_user());

DROP POLICY IF EXISTS "Admin full access" ON public.blog_posts;
CREATE POLICY "Admin full access" ON public.blog_posts
    FOR ALL TO authenticated
    USING (public.is_admin_user())
    WITH CHECK (public.is_admin_user());

DROP POLICY IF EXISTS "Admin full access" ON public.website_sections;
CREATE POLICY "Admin full access" ON public.website_sections
    FOR ALL TO authenticated
    USING (public.is_admin_user())
    WITH CHECK (public.is_admin_user());

DROP POLICY IF EXISTS "Admin full access" ON public.seo_settings;
CREATE POLICY "Admin full access" ON public.seo_settings
    FOR ALL TO authenticated
    USING (public.is_admin_user())
    WITH CHECK (public.is_admin_user());

DROP POLICY IF EXISTS "Admin full access" ON public.pages;
CREATE POLICY "Admin full access" ON public.pages
    FOR ALL TO authenticated
    USING (public.is_admin_user())
    WITH CHECK (public.is_admin_user());

DROP POLICY IF EXISTS "Admin read access" ON public.contact_messages;
DROP POLICY IF EXISTS "Admin full access" ON public.contact_messages;
CREATE POLICY "Admin full access" ON public.contact_messages
    FOR ALL TO authenticated
    USING (public.is_admin_user())
    WITH CHECK (public.is_admin_user());

DROP POLICY IF EXISTS "Admin read access" ON public.admin_users;
DROP POLICY IF EXISTS "Admin full access" ON public.admin_users;
CREATE POLICY "Admin full access" ON public.admin_users
    FOR ALL TO authenticated
    USING (public.is_admin_user())
    WITH CHECK (public.is_admin_user());

-- Media metadata table used by upload/image helpers.
CREATE TABLE IF NOT EXISTS public.media_files (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    url text NOT NULL UNIQUE,
    width integer,
    height integer,
    file_name text,
    file_size bigint,
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access" ON public.media_files;
CREATE POLICY "Public read access" ON public.media_files
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin full access" ON public.media_files;
CREATE POLICY "Admin full access" ON public.media_files
    FOR ALL TO authenticated
    USING (public.is_admin_user())
    WITH CHECK (public.is_admin_user());

-- Shared, persistent contact-form rate limit state.
CREATE TABLE IF NOT EXISTS public.contact_rate_limits (
    ip_hash text PRIMARY KEY,
    request_count integer NOT NULL DEFAULT 0 CHECK (request_count >= 0),
    window_start timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.consume_contact_rate_limit(
    p_ip_hash text,
    p_max_requests integer DEFAULT 3,
    p_window_seconds integer DEFAULT 3600
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_request_count integer;
    v_window_start timestamptz;
BEGIN
    IF p_ip_hash IS NULL OR length(trim(p_ip_hash)) = 0 THEN
        RETURN false;
    END IF;

    LOOP
        SELECT request_count, window_start
        INTO v_request_count, v_window_start
        FROM public.contact_rate_limits
        WHERE ip_hash = p_ip_hash
        FOR UPDATE;

        IF NOT FOUND THEN
            BEGIN
                INSERT INTO public.contact_rate_limits (
                    ip_hash,
                    request_count,
                    window_start,
                    updated_at
                )
                VALUES (
                    p_ip_hash,
                    1,
                    now(),
                    now()
                );
                RETURN true;
            EXCEPTION
                WHEN unique_violation THEN
                    -- concurrent insert, loop again and lock existing row
            END;
        ELSE
            IF now() - v_window_start >= make_interval(secs => p_window_seconds) THEN
                UPDATE public.contact_rate_limits
                SET
                    request_count = 1,
                    window_start = now(),
                    updated_at = now()
                WHERE ip_hash = p_ip_hash;
                RETURN true;
            END IF;

            IF v_request_count >= p_max_requests THEN
                RETURN false;
            END IF;

            UPDATE public.contact_rate_limits
            SET
                request_count = request_count + 1,
                updated_at = now()
            WHERE ip_hash = p_ip_hash;

            RETURN true;
        END IF;
    END LOOP;
END;
$$;

REVOKE ALL ON FUNCTION public.consume_contact_rate_limit(text, integer, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.consume_contact_rate_limit(text, integer, integer) TO service_role;
