-- Create shipping_configs table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.shipping_configs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    local_delivery_enabled BOOLEAN DEFAULT false,
    local_radius_km INTEGER DEFAULT 5,
    local_base_price DECIMAL(10,2) DEFAULT 0.00,
    national_shipping_enabled BOOLEAN DEFAULT false,
    national_flat_rate DECIMAL(10,2) DEFAULT 0.00,
    free_shipping_threshold DECIMAL(10,2) DEFAULT 0.00,
    active_providers JSONB DEFAULT '[]'::jsonb, -- e.g. ["uber", "dhl"]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_store_shipping_config UNIQUE (store_id)
);

-- Enable RLS
ALTER TABLE public.shipping_configs ENABLE ROW LEVEL SECURITY;

-- Policies

-- Allow read access to store members/owners
CREATE POLICY "Enable read access for store members" ON public.shipping_configs
    FOR SELECT
    USING (
        store_id IN (
            SELECT id FROM stores WHERE owner_id = auth.uid()
            UNION
            SELECT store_id FROM mid_store_members WHERE user_id = auth.uid() -- Using the view or direct table if RLS allows
        )
    );

-- Allow insert/update for store admins
CREATE POLICY "Enable insert/update for store admins" ON public.shipping_configs
    FOR ALL
    USING (
        store_id IN (
            SELECT id FROM stores WHERE owner_id = auth.uid()
            UNION
            SELECT store_id FROM mid_store_members WHERE user_id = auth.uid() AND role IN ('admin', 'owner')
        )
    );
