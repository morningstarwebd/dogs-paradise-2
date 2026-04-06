-- Morning Star Web — Draft/Publish Workflow + Audit Log
-- Version: 007
-- Description: Adds status column to website_sections and creates audit_log table

-- ─────────────────────────────────────────────────
-- 1. Draft/Publish status for website sections
-- ─────────────────────────────────────────────────
DO $$ BEGIN
    CREATE TYPE public.section_status AS ENUM ('draft', 'published');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

ALTER TABLE public.website_sections
    ADD COLUMN IF NOT EXISTS status public.section_status NOT NULL DEFAULT 'published';

-- All existing rows become published (preserves current behavior)
UPDATE public.website_sections SET status = 'published' WHERE status IS NULL;


-- ─────────────────────────────────────────────────
-- 2. Admin Audit Log
-- ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_email text NOT NULL,
    entity_type text NOT NULL,          -- 'section', 'post', 'page', 'project'
    entity_id   text NOT NULL,          -- section_id or uuid
    action      text NOT NULL,          -- 'create', 'update', 'delete', 'publish', 'unpublish', 'toggle', 'reorder'
    summary     text,                   -- Human-readable diff summary
    created_at  timestamptz DEFAULT now()
);

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin read access" ON public.admin_audit_log
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert access" ON public.admin_audit_log
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Index for recent activity queries
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON public.admin_audit_log (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON public.admin_audit_log (entity_type, entity_id);
