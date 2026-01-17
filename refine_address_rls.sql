-- Refined RLS Policy for Addresses (Team Access)

-- 1. Drop existing policy if it conflicts or is too narrow
DROP POLICY IF EXISTS "Store admins manage warehouse addresses" ON public.addresses;

-- 2. Create the new inclusive policy
CREATE POLICY "Team manages store addresses" ON public.addresses
    FOR ALL USING (
        store_id IN (
            -- 1. The original Legal Owner (Stripe Owner)
            SELECT id FROM public.stores WHERE owner_id = auth.uid()
            
            UNION
            
            -- 2. Staff/Managers (via store_members)
            SELECT store_id FROM public.store_members WHERE user_id = auth.uid()
        )
    );
