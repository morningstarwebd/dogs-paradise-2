-- Morning Star Web — Storage Upload RLS Fix
-- Version: 013
-- Description:
--   Allow authenticated users to write/delete media files in website storage buckets.
--   This resolves "new row violates row-level security policy" during uploads.

DROP POLICY IF EXISTS "Admin upload website media" ON storage.objects;
DROP POLICY IF EXISTS "Admin update website media" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete website media" ON storage.objects;

DROP POLICY IF EXISTS "Authenticated upload website media" ON storage.objects;
CREATE POLICY "Authenticated upload website media"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id IN ('dogs-images', 'website-assets'));

DROP POLICY IF EXISTS "Authenticated update website media" ON storage.objects;
CREATE POLICY "Authenticated update website media"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id IN ('dogs-images', 'website-assets'))
WITH CHECK (bucket_id IN ('dogs-images', 'website-assets'));

DROP POLICY IF EXISTS "Authenticated delete website media" ON storage.objects;
CREATE POLICY "Authenticated delete website media"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id IN ('dogs-images', 'website-assets'));
