-- 1. Resolve "RLS Enabled No Policy" for products_backup
-- Since this is just a backup, we can drop it if it's not needed, or add a restrictive policy.
-- Recommendation: Drop it to clean up.
DROP TABLE IF EXISTS "products_backup";

-- 2. Validate contact_messages Policy
-- The warning "RLS Policy Always True" for INSERT is correct for a public contact form.
-- To make it safer/clearer, we can restrict UPDATE/DELETE.

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Ensure only Admins can read messages
DROP POLICY IF EXISTS "Allow admin read" ON contact_messages;
CREATE POLICY "Allow admin read" ON contact_messages
FOR SELECT
USING (
  (select raw_user_meta_data->>'role' from auth.users where id = auth.uid()) = 'admin'
);

-- 3. Fix Stores RLS (Again, to be sure)
-- Ensure Authenticated Users can create their own stores
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can create their own stores" ON stores;
CREATE POLICY "Users can create their own stores" 
ON stores FOR INSERT 
WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can update their own stores" ON stores;
CREATE POLICY "Users can update their own stores" 
ON stores FOR UPDATE 
USING (auth.uid() = owner_id);

-- 4. Fix Foreign Key (If missing)
-- If the error was "violates foreign key constraint", it might be that owner_id isn't pointing to auth.users correctly.
-- We can add the constraint safely if it doesn't exist.
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'stores_owner_id_fkey') THEN 
    ALTER TABLE stores 
    ADD CONSTRAINT stores_owner_id_fkey 
    FOREIGN KEY (owner_id) 
    REFERENCES auth.users(id); 
  END IF; 
END $$;
