-- ========================================
-- PAYMENT GATEWAY INFRASTRUCTURE
-- ========================================

-- 1. VENDOR PAYMENT ACCOUNTS (Stripe, Mercado Pago, Crypto, Manual)
CREATE TABLE IF NOT EXISTS public.vendor_payment_accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE NOT NULL,
    provider TEXT NOT NULL CHECK (provider IN ('stripe', 'mercadopago', 'crypto', 'manual')),
    account_id TEXT, -- Stripe Connect Account ID or Mercado Pago user_id
    access_token TEXT, -- Encrypted OAuth token (use Supabase Vault in production)
    refresh_token TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}', -- Store extra config like webhook endpoints
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(store_id, provider)
);

-- RLS Policies
ALTER TABLE public.vendor_payment_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors manage own payment accounts" ON public.vendor_payment_accounts
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.stores
        WHERE stores.id = vendor_payment_accounts.store_id
        AND stores.owner_id = auth.uid()
    )
);

CREATE POLICY "Admins view all payment accounts" ON public.vendor_payment_accounts
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- 2. COMMISSION CONFIGURATION (Per Category)
CREATE TABLE IF NOT EXISTS public.commission_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID REFERENCES public.store_categories(id) ON DELETE CASCADE,
    store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
    commission_rate DECIMAL(5,4) DEFAULT 0.10, -- 10% = 0.1000
    fixed_fee DECIMAL(10,2) DEFAULT 0.00, -- Optional fixed fee per transaction
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(category_id, store_id) -- Allow per-store custom rates
);

-- Default global commission (no category/store specified)
INSERT INTO public.commission_config (commission_rate, description, is_active)
VALUES (0.10, 'Default marketplace commission - 10%', TRUE)
ON CONFLICT DO NOTHING;

-- RLS
ALTER TABLE public.commission_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view commission rates" ON public.commission_config
FOR SELECT USING (TRUE);

CREATE POLICY "Admins manage commission config" ON public.commission_config
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- 3. TRANSACTIONS LOG (All payments through the platform)
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    store_id UUID REFERENCES public.stores(id) NOT NULL,
    buyer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
    provider TEXT NOT NULL CHECK (provider IN ('stripe', 'mercadopago', 'crypto', 'manual')),
    
    -- External Platform IDs
    payment_intent_id TEXT, -- Stripe Payment Intent or Mercado Pago preference_id
    charge_id TEXT, -- Stripe Charge ID or Mercado Pago payment_id
    
    -- Amounts
    amount DECIMAL(10,2) NOT NULL, -- Total order amount
    marketplace_fee DECIMAL(10,2) NOT NULL, -- Commission kept by Americana
    vendor_payout DECIMAL(10,2) NOT NULL, -- Amount vendor receives (amount - fee)
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
    
    -- Metadata
    metadata JSONB DEFAULT '{}', -- Store webhook data, customer info, etc.
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_transactions_order_id ON public.transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_transactions_store_id ON public.transactions(store_id);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer_id ON public.transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at DESC);

-- RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyers view own transactions" ON public.transactions
FOR SELECT USING (buyer_id = auth.uid());

CREATE POLICY "Vendors view store transactions" ON public.transactions
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.stores
        WHERE stores.id = transactions.store_id
        AND stores.owner_id = auth.uid()
    )
);

CREATE POLICY "Admins view all transactions" ON public.transactions
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- 4. VENDOR PAYOUTS (Settlement Mode)
CREATE TABLE IF NOT EXISTS public.vendor_payouts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE NOT NULL,
    transaction_ids UUID[] DEFAULT '{}', -- Array of transaction IDs included in this payout
    
    -- Amounts
    gross_amount DECIMAL(10,2) NOT NULL, -- Sum of all vendor_payout from transactions
    fees DECIMAL(10,2) DEFAULT 0.00, -- Platform processing fees (Stripe transfer fees, etc.)
    net_amount DECIMAL(10,2) NOT NULL, -- What vendor actually receives
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
    
    -- Payout Method
    payout_method TEXT CHECK (payout_method IN ('stripe_transfer', 'mercadopago', 'payoneer', 'manual_bank', 'crypto')),
    payout_reference TEXT, -- External platform transaction ID (Stripe transfer ID, etc.)
    
    -- Timing
    scheduled_at TIMESTAMPTZ,
    processing_started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,
    
    -- Error handling
    error_message TEXT,
    
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_vendor_payouts_store_id ON public.vendor_payouts(store_id);
CREATE INDEX IF NOT EXISTS idx_vendor_payouts_status ON public.vendor_payouts(status);
CREATE INDEX IF NOT EXISTS idx_vendor_payouts_scheduled_at ON public.vendor_payouts(scheduled_at);

-- RLS
ALTER TABLE public.vendor_payouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors view own payouts" ON public.vendor_payouts
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.stores
        WHERE stores.id = vendor_payouts.store_id
        AND stores.owner_id = auth.uid()
    )
);

CREATE POLICY "Admins manage all payouts" ON public.vendor_payouts
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- 5. WEBHOOK EVENTS (Audit log for payment provider webhooks)
CREATE TABLE IF NOT EXISTS public.webhook_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    provider TEXT NOT NULL CHECK (provider IN ('stripe', 'mercadopago', 'crypto')),
    event_type TEXT NOT NULL, -- e.g., 'payment_intent.succeeded', 'charge.refunded'
    event_id TEXT UNIQUE, -- Provider's event ID (for idempotency)
    payload JSONB NOT NULL, -- Full webhook payload
    processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMPTZ,
    error TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_webhook_events_provider ON public.webhook_events(provider);
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_type ON public.webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed ON public.webhook_events(processed);

-- No RLS (internal system table, accessed via API routes)
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only" ON public.webhook_events
FOR ALL USING (auth.role() = 'service_role');

-- ========================================
-- UTILITY FUNCTIONS
-- ========================================

-- Function to calculate marketplace fee based on category/store
CREATE OR REPLACE FUNCTION public.calculate_marketplace_fee(
    p_amount DECIMAL,
    p_category_id UUID DEFAULT NULL,
    p_store_id UUID DEFAULT NULL
)
RETURNS DECIMAL AS $$
DECLARE
    v_rate DECIMAL;
    v_fixed_fee DECIMAL;
    v_total_fee DECIMAL;
BEGIN
    -- Try to find specific config (category + store)
    SELECT commission_rate, fixed_fee INTO v_rate, v_fixed_fee
    FROM public.commission_config
    WHERE category_id = p_category_id
    AND store_id = p_store_id
    AND is_active = TRUE
    LIMIT 1;
    
    -- If not found, try category only
    IF v_rate IS NULL THEN
        SELECT commission_rate, fixed_fee INTO v_rate, v_fixed_fee
        FROM public.commission_config
        WHERE category_id = p_category_id
        AND store_id IS NULL
        AND is_active = TRUE
        LIMIT 1;
    END IF;
    
    -- If still not found, use default
    IF v_rate IS NULL THEN
        SELECT commission_rate, fixed_fee INTO v_rate, v_fixed_fee
        FROM public.commission_config
        WHERE category_id IS NULL
        AND store_id IS NULL
        AND is_active = TRUE
        LIMIT 1;
    END IF;
    
    -- Calculate total fee
    v_total_fee := (p_amount * v_rate) + COALESCE(v_fixed_fee, 0);
    
    RETURN ROUND(v_total_fee, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_vendor_payment_accounts_updated_at ON public.vendor_payment_accounts;
CREATE TRIGGER update_vendor_payment_accounts_updated_at
BEFORE UPDATE ON public.vendor_payment_accounts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_transactions_updated_at ON public.transactions;
CREATE TRIGGER update_transactions_updated_at
BEFORE UPDATE ON public.transactions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_vendor_payouts_updated_at ON public.vendor_payouts;
CREATE TRIGGER update_vendor_payouts_updated_at
BEFORE UPDATE ON public.vendor_payouts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
