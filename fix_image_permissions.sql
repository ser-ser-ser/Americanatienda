-- Enable public read access to cms_media for ANYONE (public storefront)
-- This is critical for Store Covers and Logos to be visible to non-logged-in users.

-- 1. CMS Media Bucket (Stores, Categories, etc)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('cms_media', 'cms_media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Policy: Allow Public Read
CREATE POLICY "Public Access CMS Media"
ON storage.objects FOR SELECT
USING ( bucket_id = 'cms_media' );

-- Policy: Allow Auth (Admins) to Insert/Update/Delete
CREATE POLICY "Auth Users Manage CMS Media"
ON storage.objects FOR ALL
TO authenticated
USING ( bucket_id = 'cms_media' )
WITH CHECK ( bucket_id = 'cms_media' );

-- 2. Product Media Bucket (Just to be safe)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-media', 'product-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Public Access Product Media"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-media' );

CREATE POLICY "Auth Users Upload Product Media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'product-media' );

CREATE POLICY "Auth Users Update Product Media"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'product-media' );

CREATE POLICY "Auth Users Delete Product Media"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'product-media' );
