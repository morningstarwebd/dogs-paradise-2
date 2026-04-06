-- Morning Star Web - Seed Data
-- Run this after the latest migrations to populate demo data.
-- Replace 'your-admin@gmail.com' with your actual admin email.

INSERT INTO public.admin_users (email, role) VALUES
    ('your-admin@gmail.com', 'super_admin')
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.seo_settings (page_slug, title, description) VALUES
    ('home',     'Morning Star Web',     'A premium, immersive portfolio website.'),
    ('projects', 'Projects',             'Explore our latest work.'),
    ('blog',     'Blog',                 'Thoughts, tutorials, and insights.'),
    ('contact',  'Contact',              'Get in touch with us.')
ON CONFLICT (page_slug) DO NOTHING;

DELETE FROM public.website_sections
WHERE section_id IN ('header', 'hero', 'about', 'services', 'contact', 'footer');

INSERT INTO public.website_sections (section_id, block_type, label, sort_order, content) VALUES
    ('header',    'header',    'Header',   0, '{}'::jsonb),
    ('hero',      'hero',      'Hero',     1, '{"heading": "We build digital experiences", "subheading": "that inspire."}'::jsonb),
    ('about',     'about',     'About',    2, '{"heading": "About", "description": "We craft premium web experiences."}'::jsonb),
    ('services',  'services',  'Services', 3, '{"heading": "What we do"}'::jsonb),
    ('contact',   'contact',   'Contact',  8, '{"heading": "Let''s build something", "heading_italic": "extraordinary.", "email": "hello@morningstarweb.com"}'::jsonb),
    ('footer',    'footer',    'Footer',   9, '{"copyright": "Copyright 2026 Morning Star Web"}'::jsonb);

INSERT INTO public.blog_posts (title, slug, excerpt, content, category, published, reading_time) VALUES
    ('Getting Started',
     'getting-started',
     'Welcome to Morning Star Web - your new portfolio platform.',
     '# Welcome\n\nThis is your first blog post. Edit or delete it from the admin panel.',
     'General',
     true,
     2)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.projects (title, slug, description, category, featured) VALUES
    ('Sample Project',
     'sample-project',
     'A demo project to showcase the portfolio layout.',
     'Web Development',
     true)
ON CONFLICT (slug) DO NOTHING;
