CREATE TABLE IF NOT EXISTS public.website_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id TEXT NOT NULL,
    label TEXT NOT NULL,
    content JSONB DEFAULT '{}'::jsonb NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    status TEXT NOT NULL DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on RLS
ALTER TABLE public.website_sections ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published and visible sections
CREATE POLICY "Public can view published sections"
ON public.website_sections FOR SELECT
USING (is_visible = true AND status = 'published');

-- Allow all operations for now (can lock down by auth.uid() later)
CREATE POLICY "Enable all read access"
ON public.website_sections FOR SELECT
USING (true);

CREATE POLICY "Enable insert"
ON public.website_sections FOR INSERT
WITH CHECK (true);

CREATE POLICY "Enable update"
ON public.website_sections FOR UPDATE
USING (true);

CREATE POLICY "Enable delete"
ON public.website_sections FOR DELETE
USING (true);

-- Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS set_updated_at ON public.website_sections;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.website_sections
FOR EACH ROW
EXECUTE PROCEDURE public.handle_updated_at();

-- Seed the initial sections that Dogs Paradise uses on the homepage.
-- This will ensure we have something to render.
INSERT INTO public.website_sections (section_id, label, sort_order) VALUES
('hero', 'Hero Banner', 0),
('featured-dogs', 'Featured Dogs', 1),
('breed-explorer', 'Breed Explorer', 2),
('happy-stories', 'Happy Stories', 3),
('about-preview', 'About Preview', 4),
('image-hotspot', 'Image Hotspot', 5),
('stats-counter', 'Statistics Counter', 6),
('why-choose-us', 'Why Choose Us', 7),
('adoption-process', 'Adoption Process', 8),
('puppy-care-tips', 'Puppy Care Tips', 9),
('trust-badges', 'Trust Badges', 10),
('instagram-feed', 'Instagram Feed', 11),
('blog-preview', 'Blog Preview', 12),
('faq-section', 'FAQ Section', 13),
('newsletter-cta', 'Newsletter CTA', 14),
('call-to-action', 'Final CTA', 15)
ON CONFLICT DO NOTHING;
