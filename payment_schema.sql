
-- Table to store vendor payment preferences and credentials
CREATE TABLE IF NOT EXISTS public.payment_configs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    store_id uuid REFERENCES public.stores(id) ON DELETE CASCADE NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,

    -- STRIPE
    stripe_enabled boolean DEFAULT false,
    stripe_account_id text, -- Connected Account ID

    -- MERCADO PAGO
    mercadopago_enabled boolean DEFAULT false,
    mercadopago_access_token text, -- Encrypted or stored securely (User provides this)
    mercadopago_public_key text,

    -- CRYPTO
    crypto_enabled boolean DEFAULT false,
    crypto_wallet_address text, -- For direct transfer
    bitso_api_key text, -- Optional

    -- MANUAL / OFFLINE (SWIFT, PAYONEER)
    manual_payment_enabled boolean DEFAULT false,
    manual_payment_instructions text, -- "Deposit to SWIFT: ... / Payoneer Email: ..."
    manual_method_name text DEFAULT 'Bank Transfer', -- "Speed Pay", "Wire Transfer", etc.

    UNIQUE(store_id)
);

-- RLS Policies
ALTER TABLE public.payment_configs ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone (public) so Checkout can see available methods
DROP POLICY IF EXISTS "Enable read for everyone" ON public.payment_configs;
CREATE POLICY "Enable read for everyone" ON public.payment_configs
    FOR SELECT
    USING (true);

-- Allow write access only to store owner
DROP POLICY IF EXISTS "Enable write for store owners" ON public.payment_configs;
CREATE POLICY "Enable write for store owners" ON public.payment_configs
    FOR ALL
    USING (
        store_id IN (
            SELECT id FROM stores WHERE owner_id = auth.uid()
        )
    );
