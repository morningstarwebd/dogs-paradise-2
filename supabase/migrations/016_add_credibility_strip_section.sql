-- Add new homepage section: credibility-strip
-- Keeps existing data untouched and inserts only when missing.

INSERT INTO public.website_sections (
  section_id,
  block_type,
  label,
  sort_order,
  content,
  is_visible,
  status
)
SELECT
  'credibility-strip',
  'credibility-strip',
  'Credibility Strip',
  COALESCE((SELECT MAX(sort_order) + 1 FROM public.website_sections), 0),
  '{}'::jsonb,
  true,
  'draft'
WHERE NOT EXISTS (
  SELECT 1 FROM public.website_sections WHERE section_id = 'credibility-strip'
);
