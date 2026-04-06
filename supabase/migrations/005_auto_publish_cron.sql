-- Enable pg_cron extension if it is not already enabled
create extension if not exists pg_cron;

-- Create a scheduled job that runs every minute
-- It looks for blog posts where the publish date has arrived but they are still marked as false
select cron.schedule(
  'auto-publish-scheduled-posts',
  '* * * * *',
  $$
    update public.blog_posts
    set published = true
    where published = false 
      and scheduled_at is not null 
      and scheduled_at <= now();
  $$
);
