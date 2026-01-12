-- VERIFY AND FIX PRODUCT SCHEMA
-- 1. Ensure SKU column exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'sku') THEN
        ALTER TABLE products ADD COLUMN sku text;
    END IF;
END $$;

-- 2. Ensure Storage Bucket exists (Idempotent)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-media', 'product-media', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Ensure Policies exist (Drop and Recreate to be safe)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'product-media' );

DROP POLICY IF EXISTS "Vendor Upload" ON storage.objects;
CREATE POLICY "Vendor Upload" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'product-media' AND auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Vendor Manage" ON storage.objects;
CREATE POLICY "Vendor Manage" ON storage.objects FOR UPDATE USING ( bucket_id = 'product-media' AND auth.uid() = owner );

DROP POLICY IF EXISTS "Vendor Delete" ON storage.objects;
CREATE POLICY "Vendor Delete" ON storage.objects FOR DELETE USING ( bucket_id = 'product-media' AND auth.uid() = owner );
