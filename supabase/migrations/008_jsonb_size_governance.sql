-- Morning Star Web — JSONB Column Size Governance
-- Version: 008
-- Description: Adds CHECK constraint to prevent oversized content columns

-- 1. Add CHECK constraint on website_sections content column (500KB limit)
ALTER TABLE public.website_sections
    ADD CONSTRAINT chk_content_size CHECK (octet_length(content::text) < 512000);
