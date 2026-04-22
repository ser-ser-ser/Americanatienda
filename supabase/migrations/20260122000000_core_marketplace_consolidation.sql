-- AMERICANA CORE CONSOLIDATION MIGRATION
-- Senior Architect: Solidifying for LatAm, EU, and MX scaling

-- 1. CHAT V2 UNIFICATION (De-duplicate Legacy)
-- We prioritize the 'secure_' prefixed tables for E2EE integrity.
-- If legacy 'conversations' exist, we ensure 'secure_conversations' has the necessary contextual fields.

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'secure_conversations' AND column_name = 'context_type') THEN
        ALTER TABLE public.secure_conversations ADD COLUMN context_type TEXT CHECK (context_type IN ('support', 'order', 'product'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'secure_conversations' AND column_name = 'context_id') THEN
        ALTER TABLE public.secure_conversations ADD COLUMN context_id UUID;
    END IF;
END $$;

-- 2. POLYMORPHIC PRODUCT ATTRIBUTES
-- Allows for "Luxury Variants" (Size, Color, Material) in a single JSONB column for maximum flexibility.
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS attributes JSONB DEFAULT '{}'::jsonb;

-- 3. LOGISTICS (SHIPPING CONFIGS BOOTSTRAP)
-- Every store MUST have a shipping config or checkout fails.
INSERT INTO public.shipping_configs (store_id, national_shipping_enabled, national_flat_rate)
SELECT id, true, 150.00 FROM public.stores
ON CONFLICT (store_id) DO UPDATE 
SET national_shipping_enabled = true,
    national_flat_rate = COALESCE(public.shipping_configs.national_flat_rate, 150.00);

-- 4. REAL-TIME ALERT SYSTEM (NOTIFICATIONS)
-- Ensure order notifications fire correctly.
CREATE OR REPLACE FUNCTION public.notify_on_new_order()
RETURNS TRIGGER AS $$
DECLARE
    v_store_owner UUID;
BEGIN
    -- Get store owner to notify them
    SELECT owner_id INTO v_store_owner FROM public.stores WHERE id = NEW.store_id;
    
    IF v_store_owner IS NOT NULL THEN
        INSERT INTO public.notifications (user_id, type, title, message, link)
        VALUES (v_store_owner, 'order', 'New Acquisition', 'A customer has purchased an item from your boutique.', '/dashboard/vendor/orders');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_new_order_notification ON public.orders;
CREATE TRIGGER trg_new_order_notification
AFTER INSERT ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.notify_on_new_order();

-- 5. INDEXING FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_products_attributes ON public.products USING GIN (attributes);
CREATE INDEX IF NOT EXISTS idx_secure_conversations_context ON public.secure_conversations (context_type, context_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_shipping_address ON public.orders(shipping_address_id);

-- 6. ORDER SCHEMA REFINEMENT (Logistics Layer)
-- Ensure orders have proper shipping and logistics links.
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_address_id UUID REFERENCES public.addresses(id);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_cost DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS carrier TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_status TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_intent_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method TEXT;
