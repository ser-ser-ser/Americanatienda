-- 1. EXECUTE THE RLS REFINEMENT (From previous step)
DROP POLICY IF EXISTS "Store admins manage warehouse addresses" ON public.addresses;
DROP POLICY IF EXISTS "Team manages store addresses" ON public.addresses;

CREATE POLICY "Team manages store addresses" ON public.addresses
    FOR ALL USING (
        store_id IN (
            SELECT id FROM public.stores WHERE owner_id = auth.uid()
            UNION
            SELECT store_id FROM public.store_members WHERE user_id = auth.uid()
        )
    );

-- 2. UPDATE ORDERS TABLE
-- We need to link the order to the specific address used for shipping
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_address_id UUID REFERENCES public.addresses(id);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_cost DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS carrier TEXT;

-- 3. ENSURE SHIPPING_CONFIGS HAS STORE_ID (Redundant check)
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
