-- Morning Star Web - Website Section Singleton Guards
-- Version: 012
-- Description: Preserve singleton behavior for header/footer/global settings
--              while allowing repeatable content blocks elsewhere.

CREATE UNIQUE INDEX IF NOT EXISTS idx_website_sections_singletons
    ON public.website_sections (section_id)
    WHERE section_id IN ('header', 'footer', 'global_settings');
