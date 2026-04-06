-- Morning Star Web — RLS Hardening & Website Sections Schema Update
-- Version: 011
-- Description:
--   1. Tighten admin_audit_log and experience_settings RLS policies.
--   2. Add block_type column to website_sections and drop UNIQUE on section_id
--      so duplicate block types can be used in the website builder.

-- ─────────────────────────────────────────────────
-- 1. Harden admin_audit_log policies
-- ─────────────────────────────────────────────────
DROP POLICY IF EXISTS "Admin read access" ON public.admin_audit_log;
CREATE POLICY "Admin read access" ON public.admin_audit_log
    FOR SELECT TO authenticated
    USING (public.is_admin_user());

DROP POLICY IF EXISTS "Admin insert access" ON public.admin_audit_log;
CREATE POLICY "Admin insert access" ON public.admin_audit_log
    FOR INSERT TO authenticated
    WITH CHECK (public.is_admin_user());


-- ─────────────────────────────────────────────────
-- 2. Harden experience_settings — update policy
-- ─────────────────────────────────────────────────
DROP POLICY IF EXISTS "Allow authenticated update access on experience_settings" ON public.experience_settings;
CREATE POLICY "Admin update access on experience_settings" ON public.experience_settings
    FOR UPDATE TO authenticated
    USING (public.is_admin_user());


-- ─────────────────────────────────────────────────
-- 3. Website Sections — support duplicate block types
-- ─────────────────────────────────────────────────

-- Add block_type column derivied from section_id
ALTER TABLE public.website_sections
    ADD COLUMN IF NOT EXISTS block_type text;

-- Backfill existing rows
UPDATE public.website_sections
SET block_type = section_id
WHERE block_type IS NULL;

-- Make block_type NOT NULL going forward
ALTER TABLE public.website_sections
    ALTER COLUMN block_type SET NOT NULL;

-- Drop the UNIQUE constraint on section_id
-- (the constraint name is auto-generated; find and drop it)
DO $$
DECLARE
    _constraint text;
BEGIN
    SELECT con.conname INTO _constraint
    FROM pg_catalog.pg_constraint con
    JOIN pg_catalog.pg_class     rel ON rel.oid = con.conrelid
    JOIN pg_catalog.pg_namespace nsp ON nsp.oid = rel.relnamespace
    WHERE nsp.nspname = 'public'
      AND rel.relname = 'website_sections'
      AND con.contype  = 'u'
      AND EXISTS (
          SELECT 1
          FROM unnest(con.conkey) AS k(col)
          JOIN pg_catalog.pg_attribute att ON att.attrelid = rel.oid AND att.attnum = k.col
          WHERE att.attname = 'section_id'
      );

    IF _constraint IS NOT NULL THEN
        EXECUTE format('ALTER TABLE public.website_sections DROP CONSTRAINT %I', _constraint);
    END IF;
END $$;
