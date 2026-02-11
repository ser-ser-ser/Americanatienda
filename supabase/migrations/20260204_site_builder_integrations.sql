-- AMERICANA SITE BUILDER & DOMAIN INTEGRATION
-- Phase 2: GrapesJS Storage and Store Integrations

-- 1. Store Integrations Table
CREATE TABLE IF NOT EXISTS public.integrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
    stripe_account_id TEXT,
    custom_domain TEXT UNIQUE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'error')),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(store_id)
);

-- 2. Vendor Pages Table
CREATE TABLE IF NOT EXISTS public.vendor_pages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
    slug TEXT NOT NULL,
    grapes_json_data JSONB DEFAULT '{}'::jsonb,
    compiled_html TEXT,
    compiled_css TEXT,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(store_id, slug)
);

-- 3. Row Level Security (RLS)
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_pages ENABLE ROW LEVEL SECURITY;

-- Idempotent Policy Creation
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Store owners manage their integrations" ON public.integrations;
    CREATE POLICY "Store owners manage their integrations" ON public.integrations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.stores
            WHERE stores.id = integrations.store_id
            AND stores.owner_id = auth.uid()
        )
    );

    DROP POLICY IF EXISTS "Store owners manage their pages" ON public.vendor_pages;
    CREATE POLICY "Store owners manage their pages" ON public.vendor_pages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.stores
            WHERE stores.id = vendor_pages.store_id
            AND stores.owner_id = auth.uid()
        )
    );

    DROP POLICY IF EXISTS "Public can view published pages" ON public.vendor_pages;
    CREATE POLICY "Public can view published pages" ON public.vendor_pages
    FOR SELECT USING (is_published = true);
END $$;

-- 4. Automatic updated_at Trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ 
BEGIN
    DROP TRIGGER IF EXISTS trg_integrations_updated_at ON public.integrations;
    CREATE TRIGGER trg_integrations_updated_at
    BEFORE UPDATE ON public.integrations
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

    DROP TRIGGER IF EXISTS trg_vendor_pages_updated_at ON public.vendor_pages;
    CREATE TRIGGER trg_vendor_pages_updated_at
    BEFORE UPDATE ON public.vendor_pages
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
END $$;

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_integrations_store ON public.integrations(store_id);
CREATE INDEX IF NOT EXISTS idx_vendor_pages_store_slug ON public.vendor_pages(store_id, slug);
