-- Fix RLS for stores to allow users to create/edit their own stores
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can create their own stores" ON stores;
DROP POLICY IF EXISTS "Users can update their own stores" ON stores;
DROP POLICY IF EXISTS "Users can delete their own stores" ON stores;
DROP POLICY IF EXISTS "Public can view stores" ON stores;

-- 1. INSERT: Allow users to create stores where they are the owner
CREATE POLICY "Users can create their own stores" 
ON stores FOR INSERT 
WITH CHECK (auth.uid() = owner_id);

-- 2. UPDATE: Allow owners to update their stores
CREATE POLICY "Users can update their own stores" 
ON stores FOR UPDATE 
USING (auth.uid() = owner_id);

-- 3. DELETE: Allow owners to delete their stores
CREATE POLICY "Users can delete their own stores" 
ON stores FOR DELETE 
USING (auth.uid() = owner_id);

-- 4. SELECT: Allow everyone to see stores (for the storefronts)
CREATE POLICY "Public can view stores" 
ON stores FOR SELECT 
USING (true);
