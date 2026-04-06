-- Morning Star Web — Optimistic Concurrency Control
-- Version: 006
-- Description: Adds version columns to website_sections, blog_posts, and pages for conflict detection

-- 1. Add version columns
ALTER TABLE public.website_sections
    ADD COLUMN IF NOT EXISTS version integer NOT NULL DEFAULT 1;

ALTER TABLE public.blog_posts
    ADD COLUMN IF NOT EXISTS version integer NOT NULL DEFAULT 1;

ALTER TABLE public.pages
    ADD COLUMN IF NOT EXISTS version integer NOT NULL DEFAULT 1;

-- 2. Auto-increment version on update
CREATE OR REPLACE FUNCTION public.increment_version()
RETURNS TRIGGER AS $$
BEGIN
    NEW.version := OLD.version + 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_website_sections_version
    BEFORE UPDATE ON public.website_sections
    FOR EACH ROW EXECUTE FUNCTION public.increment_version();

CREATE TRIGGER trg_blog_posts_version
    BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW EXECUTE FUNCTION public.increment_version();

CREATE TRIGGER trg_pages_version
    BEFORE UPDATE ON public.pages
    FOR EACH ROW EXECUTE FUNCTION public.increment_version();
