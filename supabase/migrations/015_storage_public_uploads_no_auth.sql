-- Dogs Paradise 2 — Storage buckets + no-auth upload policy
-- Version: 015
-- Description:
--   Create the image buckets expected by the app and allow storage writes
--   while admin authentication is intentionally disabled.

insert into storage.buckets (
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
)
values
    (
        'dogs-images',
        'dogs-images',
        true,
        5242880,
        array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    ),
    (
        'website-assets',
        'website-assets',
        true,
        5242880,
        array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    )
on conflict (id) do update
set
    name = excluded.name,
    public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types,
    updated_at = now();

drop policy if exists "Admin upload website media" on storage.objects;
drop policy if exists "Admin update website media" on storage.objects;
drop policy if exists "Admin delete website media" on storage.objects;
drop policy if exists "Authenticated upload website media" on storage.objects;
drop policy if exists "Authenticated update website media" on storage.objects;
drop policy if exists "Authenticated delete website media" on storage.objects;
drop policy if exists "Public read website media" on storage.objects;
drop policy if exists "Public upload website media" on storage.objects;
drop policy if exists "Public update website media" on storage.objects;
drop policy if exists "Public delete website media" on storage.objects;

create policy "Public read website media"
on storage.objects
for select
to public
using (bucket_id in ('dogs-images', 'website-assets'));

create policy "Public upload website media"
on storage.objects
for insert
to public
with check (bucket_id in ('dogs-images', 'website-assets'));

create policy "Public update website media"
on storage.objects
for update
to public
using (bucket_id in ('dogs-images', 'website-assets'))
with check (bucket_id in ('dogs-images', 'website-assets'));

create policy "Public delete website media"
on storage.objects
for delete
to public
using (bucket_id in ('dogs-images', 'website-assets'));
