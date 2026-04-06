-- Morning Star Web — Initial Schema Migration
-- Version: 001
-- Description: Creates all tables for the CMS (projects, blog_posts, contact_messages, website_sections, seo_settings, admin_users, pages)


-- ─────────────────────────────────────────────────
-- 1. Projects
-- ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.projects (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title       text NOT NULL,
    slug        text NOT NULL UNIQUE,
    description text,
    long_description text,
    cover_image text,
    tags        text[],
    category    text,
    live_url    text,
    github_url  text,
    featured    boolean DEFAULT false,
    sort_order  integer DEFAULT 0,
    created_at  timestamptz DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON public.projects
    FOR SELECT USING (true);

CREATE POLICY "Admin full access" ON public.projects
    FOR ALL USING (auth.role() = 'authenticated');


-- ─────────────────────────────────────────────────
-- 2. Blog Posts
-- ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title       text NOT NULL,
    slug        text NOT NULL UNIQUE,
    excerpt     text,
    content     text,
    cover_image text,
    category    text,
    tags        text[],
    published   boolean DEFAULT false,
    reading_time integer,
    created_at  timestamptz DEFAULT now(),
    updated_at  timestamptz DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published" ON public.blog_posts
    FOR SELECT USING (published = true);

CREATE POLICY "Admin full access" ON public.blog_posts
    FOR ALL USING (auth.role() = 'authenticated');


-- ─────────────────────────────────────────────────
-- 3. Contact Messages
-- ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name       text NOT NULL,
    email      text NOT NULL,
    service    text,
    budget     text,
    message    text NOT NULL,
    read       boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin read access" ON public.contact_messages
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Anyone can insert" ON public.contact_messages
    FOR INSERT WITH CHECK (true);


-- ─────────────────────────────────────────────────
-- 4. Website Sections (CMS blocks)
-- ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.website_sections (
    id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id text NOT NULL UNIQUE,
    label      text NOT NULL,
    content    jsonb DEFAULT '{}'::jsonb,
    is_visible boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    updated_at timestamptz DEFAULT now(),
    favicon    text
);

ALTER TABLE public.website_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON public.website_sections
    FOR SELECT USING (true);

CREATE POLICY "Admin full access" ON public.website_sections
    FOR ALL USING (auth.role() = 'authenticated');


-- ─────────────────────────────────────────────────
-- 5. SEO Settings
-- ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.seo_settings (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    page_slug   text NOT NULL UNIQUE,
    title       text,
    description text,
    og_image    text,
    updated_at  timestamptz DEFAULT now(),
    favicon     text
);

ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON public.seo_settings
    FOR SELECT USING (true);

CREATE POLICY "Admin full access" ON public.seo_settings
    FOR ALL USING (auth.role() = 'authenticated');


-- ─────────────────────────────────────────────────
-- 6. Admin Users (whitelist)
-- ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.admin_users (
    id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email      text NOT NULL UNIQUE,
    role       text NOT NULL DEFAULT 'admin'
                   CHECK (role IN ('admin', 'super_admin')),
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin read access" ON public.admin_users
    FOR SELECT USING (auth.role() = 'authenticated');


-- ─────────────────────────────────────────────────
-- 7. Pages (custom pages)
-- ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.pages (
    id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title      text NOT NULL,
    slug       text NOT NULL UNIQUE,
    content    text NOT NULL,
    published  boolean DEFAULT false,
    created_at timestamptz DEFAULT timezone('utc', now()),
    updated_at timestamptz DEFAULT timezone('utc', now()),
    sections   jsonb DEFAULT '[]'::jsonb
);

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published" ON public.pages
    FOR SELECT USING (published = true);

CREATE POLICY "Admin full access" ON public.pages
    FOR ALL USING (auth.role() = 'authenticated');
