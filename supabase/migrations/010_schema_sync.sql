-- Morning Star Web — Schema Sync Migration
-- Version: 010
-- Description: Creates ai_settings table, adds lead_score/lead_summary to
--              contact_messages, and adds a durable chat rate-limit RPC.

-- ─────────────────────────────────────────────────
-- 1. AI Settings (used by admin AI knowledge base + public chat)
-- ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.ai_settings (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    business_info   text DEFAULT '',
    ai_personality  text DEFAULT '',
    services_list   text DEFAULT '',
    pricing_info    text DEFAULT '',
    faq             text DEFAULT '',
    updated_at      timestamptz DEFAULT now()
);

ALTER TABLE public.ai_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read (needed by the public chat endpoint)
CREATE POLICY "Public read access" ON public.ai_settings
    FOR SELECT USING (true);

-- Only admins can write
CREATE POLICY "Admin full access" ON public.ai_settings
    FOR ALL TO authenticated
    USING (public.is_admin_user())
    WITH CHECK (public.is_admin_user());


-- ─────────────────────────────────────────────────
-- 2. Add lead_score & lead_summary to contact_messages
-- ─────────────────────────────────────────────────
ALTER TABLE public.contact_messages
    ADD COLUMN IF NOT EXISTS lead_score   integer,
    ADD COLUMN IF NOT EXISTS lead_summary text;


-- ─────────────────────────────────────────────────
-- 3. Durable chat rate limiting
--    Re-uses the existing contact_rate_limits table
--    with a separate RPC that allows the anon key to call it.
-- ─────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.consume_chat_rate_limit(
    p_ip_hash       text,
    p_max_requests  integer DEFAULT 10,
    p_window_seconds integer DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_key          text;
    v_request_count integer;
    v_window_start timestamptz;
BEGIN
    -- Prefix the key so it doesn't collide with contact rate limits
    v_key := 'chat:' || p_ip_hash;

    IF p_ip_hash IS NULL OR length(trim(p_ip_hash)) = 0 THEN
        RETURN false;
    END IF;

    LOOP
        SELECT request_count, window_start
        INTO v_request_count, v_window_start
        FROM public.contact_rate_limits
        WHERE ip_hash = v_key
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
                    v_key,
                    1,
                    now(),
                    now()
                );
                RETURN true;
            EXCEPTION
                WHEN unique_violation THEN
                    -- concurrent insert, loop again
            END;
        ELSE
            IF now() - v_window_start >= make_interval(secs => p_window_seconds) THEN
                UPDATE public.contact_rate_limits
                SET
                    request_count = 1,
                    window_start  = now(),
                    updated_at    = now()
                WHERE ip_hash = v_key;
                RETURN true;
            END IF;

            IF v_request_count >= p_max_requests THEN
                RETURN false;
            END IF;

            UPDATE public.contact_rate_limits
            SET
                request_count = request_count + 1,
                updated_at    = now()
            WHERE ip_hash = v_key;

            RETURN true;
        END IF;
    END LOOP;
END;
$$;

-- Allow the anon key (public chat) to call this
REVOKE ALL ON FUNCTION public.consume_chat_rate_limit(text, integer, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.consume_chat_rate_limit(text, integer, integer) TO anon;
GRANT EXECUTE ON FUNCTION public.consume_chat_rate_limit(text, integer, integer) TO service_role;
