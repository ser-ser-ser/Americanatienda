-- ENHANCED PRODUCT SCHEMA
-- 1. Add SKU column
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS sku text;

-- 2. Create Storage Bucket for Product Media (Images & Videos)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-media', 'product-media', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Storage Policies (Security)
-- Public Access
CREATE POLICY "Public Access" ON storage.objects FOR SELECT
USING ( bucket_id = 'product-media' );

-- Vendor Upload Access (Authenticated users can upload)
CREATE POLICY "Vendor Upload" ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'product-media' AND auth.role() = 'authenticated' );

-- Vendor Update/Delete (Own objects only - simplified for now to auth users)
CREATE POLICY "Vendor Manage" ON storage.objects FOR UPDATE
USING ( bucket_id = 'product-media' AND auth.uid() = owner );

CREATE POLICY "Vendor Delete" ON storage.objects FOR DELETE
USING ( bucket_id = 'product-media' AND auth.uid() = owner );
