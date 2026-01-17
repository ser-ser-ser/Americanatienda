-- 1. ADDRESSES TABLE (The "Where")
-- Polymorphic table for Users (Shipping/Billing) and Stores (Warehouse/Pickup)

-- Create Enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE address_type AS ENUM ('home', 'office', 'warehouse', 'store_pickup');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Ownership (Polymorphic-ish)
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
    
    -- Classification
    type address_type DEFAULT 'home',
    is_default BOOLEAN DEFAULT false,
    
    -- Precise Location Fields
    contact_name TEXT NOT NULL,         -- Who receives/sends?
    contact_phone TEXT NOT NULL,        -- Primary contact
    contact_phone_alt TEXT,             -- Backup phone ("telefono extra")
    
    street_line_1 TEXT NOT NULL,        -- Calle y Número
    street_line_2 TEXT,                 -- Interior, Piso, Suite
    colonia TEXT NOT NULL,              -- Neighborhood (Crucial in LATAM)
    cross_streets TEXT,                 -- Re: "entre que calles y que calles"
    references_notes TEXT,              -- "Fachada blanca, portón negro"
    
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT DEFAULT 'MX',
    
    -- Coordinates for Logistics Radius Calc
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

    -- Constraint: Must belong to someone
    CONSTRAINT address_owner_check CHECK (profile_id IS NOT NULL OR store_id IS NOT NULL)
);

-- RLS Security Policies
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can manage their own addresses
CREATE POLICY "Users manage own addresses" ON public.addresses
    FOR ALL USING (profile_id = auth.uid());

-- Policy 2: Store Admins can manage store addresses
CREATE POLICY "Store admins manage warehouse addresses" ON public.addresses
    FOR ALL USING (
        store_id IN (
            SELECT id FROM stores WHERE owner_id = auth.uid()
            UNION
            SELECT store_id FROM store_members WHERE user_id = auth.uid() AND role IN ('admin', 'owner')
        )
    );


-- 2. PROFILE ENHANCEMENTS (The "Who")
-- Adding Safety & Fiscal Data (RFC, Business Name, Verification)

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_business BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS business_name TEXT; -- Razón Social
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tax_id TEXT;       -- RFC (Tax ID)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS identity_verified BOOLEAN DEFAULT false; -- For Shield/Fraud
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS identity_docs JSONB; -- Metadata for KYC docs (not the docs themselves)

-- 3. LOGISTICS EXTENSION (Shipping Configs update)
-- Add columns to shipping_configs if they don't exist, for more granular control if needed later.
-- (Currently the table from previous step is sufficient, but we will index store_id for speed)
CREATE INDEX IF NOT EXISTS idx_shipping_configs_store_id ON public.shipping_configs(store_id);
CREATE INDEX IF NOT EXISTS idx_addresses_coords ON public.addresses(latitude, longitude);
