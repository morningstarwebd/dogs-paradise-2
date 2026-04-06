-- Add scheduled_at column for scheduled publishing
ALTER TABLE public.blog_posts
    ADD COLUMN IF NOT EXISTS scheduled_at timestamptz;

-- Index for efficient "find posts due to publish" queries
CREATE INDEX IF NOT EXISTS idx_blog_posts_scheduled
    ON public.blog_posts (scheduled_at)
    WHERE scheduled_at IS NOT NULL AND published = false;
