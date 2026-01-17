-- Create store_members table for delegation
CREATE TABLE IF NOT EXISTS store_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'admin', -- 'admin', 'manager', 'viewer'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(store_id, user_id)
);

-- Enable RLS on store_members
ALTER TABLE store_members ENABLE ROW LEVEL SECURITY;

-- Policies for store_members
-- 1. Owners can manage their members
CREATE POLICY "Owners can manage members" ON store_members
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM stores 
            WHERE stores.id = store_members.store_id 
            AND stores.owner_id = auth.uid()
        )
    );

-- 2. Members can view themselves
CREATE POLICY "Members can view own membership" ON store_members
    FOR SELECT
    USING (auth.uid() = user_id);


-- Update Stores Policy to allow delegated admins to Update/View
-- (Note: We keep 'owner_id' as the ultimate owner, but allow 'store_members' with role='admin' to update)

DROP POLICY IF EXISTS "Users can update their own stores" ON stores;
CREATE POLICY "Owners and Admins can update stores" ON stores
    FOR UPDATE
    USING (
        auth.uid() = owner_id 
        OR 
        EXISTS (
            SELECT 1 FROM store_members 
            WHERE store_members.store_id = stores.id 
            AND store_members.user_id = auth.uid()
            AND store_members.role = 'admin'
        )
    );

-- Allow delegated admins to SELECT stores (already covered by "Public can view stores", but for dashboard filtering we might need specific logic later)
-- The "Public can view stores" policy using (true) handles the SELECT part for now.

-- IMPORTANT: We need to ensure Products/Orders are accessible to these new admins.
-- Typically, RLS on products checks `store_id`.
-- OLD Policy: `using ( auth.uid() = (select owner_id from stores where id = products.store_id) )`
-- NEW Policy needs to check membership too.

DO $$
BEGIN
    DROP POLICY IF EXISTS "Enable insert for owners" ON products;
    DROP POLICY IF EXISTS "Enable update for owners" ON products;
    DROP POLICY IF EXISTS "Enable delete for owners" ON products;
    
    -- Products INSERT
    CREATE POLICY "Store Admins can insert products" ON products
        FOR INSERT
        WITH CHECK (
            EXISTS (
                SELECT 1 FROM stores
                LEFT JOIN store_members ON stores.id = store_members.store_id
                WHERE stores.id = products.store_id
                AND (stores.owner_id = auth.uid() OR (store_members.user_id = auth.uid() AND store_members.role = 'admin'))
            )
        );

    -- Products UPDATE
    CREATE POLICY "Store Admins can update products" ON products
        FOR UPDATE
        USING (
            EXISTS (
                SELECT 1 FROM stores
                LEFT JOIN store_members ON stores.id = store_members.store_id
                WHERE stores.id = products.store_id
                AND (stores.owner_id = auth.uid() OR (store_members.user_id = auth.uid() AND store_members.role = 'admin'))
            )
        );

    -- Products DELETE
    CREATE POLICY "Store Admins can delete products" ON products
        FOR DELETE
        USING (
            EXISTS (
                SELECT 1 FROM stores
                LEFT JOIN store_members ON stores.id = store_members.store_id
                WHERE stores.id = products.store_id
                AND (stores.owner_id = auth.uid() OR (store_members.user_id = auth.uid() AND store_members.role = 'admin'))
            )
        );
END $$;
