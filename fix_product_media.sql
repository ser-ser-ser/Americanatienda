-- FIX PRODUCT MEDIA STORAGE
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-media', 'product-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for Product Media
DROP POLICY IF EXISTS "Product Media Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Product Media Upload" ON storage.objects;
DROP POLICY IF EXISTS "Product Media Update" ON storage.objects;
DROP POLICY IF EXISTS "Product Media Delete" ON storage.objects;

-- 1. Everyone can view images
CREATE POLICY "Product Media Public Access" ON storage.objects 
FOR SELECT USING ( bucket_id = 'product-media' );

-- 2. Authenticated users (Vendors) can upload
CREATE POLICY "Product Media Upload" ON storage.objects 
FOR INSERT WITH CHECK ( 
    bucket_id = 'product-media' 
    AND auth.role() = 'authenticated' 
);

-- 3. Users can update their own uploads
CREATE POLICY "Product Media Update" ON storage.objects 
FOR UPDATE USING ( 
    bucket_id = 'product-media' 
    AND auth.uid() = owner 
);

-- 4. Users can delete their own uploads
CREATE POLICY "Product Media Delete" ON storage.objects 
FOR DELETE USING ( 
    bucket_id = 'product-media' 
    AND auth.uid() = owner 
);
