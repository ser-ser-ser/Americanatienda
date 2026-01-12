-- Enable RLS
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can create their own stores" ON stores;
DROP POLICY IF EXISTS "Users can update their own stores" ON stores;
DROP POLICY IF EXISTS "Users can delete their own stores" ON stores;
DROP POLICY IF EXISTS "Public can view stores" ON stores;
DROP POLICY IF EXISTS "Enable read access for all users" ON stores;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON stores;

-- Create new policies

-- 1. INSERT: Allow users to create stores where they are the owner
CREATE POLICY "Users can create their own stores" 
ON stores FOR INSERT 
WITH CHECK (auth.uid() = owner_id);

-- 2. UPDATE: Allow owners to update their stores
CREATE POLICY "Users can update their own stores" 
ON stores FOR UPDATE 
USING (auth.uid() = owner_id);

-- 3. SELECT: Allow everyone to see stores (for the storefronts)
CREATE POLICY "Public can view stores" 
ON stores FOR SELECT 
USING (true);

-- 4. DELETE: Allow owners to delete their stores
CREATE POLICY "Users can delete their own stores" 
ON stores FOR DELETE 
USING (auth.uid() = owner_id);
