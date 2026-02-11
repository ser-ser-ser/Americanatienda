-- Migration: Create site_pages table for Master Studio
-- Description: Platform-level pages decoupled from vendor_pages

CREATE TABLE IF NOT EXISTS public.site_pages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    puck_content JSONB DEFAULT '{"content": [], "root": {}}'::jsonB NOT NULL,
    is_published BOOLEAN DEFAULT false,
    author_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.site_pages ENABLE ROW LEVEL SECURITY;

-- policies
DROP POLICY IF EXISTS "Public can view published site pages" ON public.site_pages;
DROP POLICY IF EXISTS "Public can view published pages" ON public.site_pages;
DROP POLICY IF EXISTS "Admins can manage site pages" ON public.site_pages;
DROP POLICY IF EXISTS "Admins have full access to site_pages" ON public.site_pages;

-- 1. Public can view published pages
CREATE POLICY "Public can view published pages" ON public.site_pages
    FOR SELECT USING (is_published = true);

-- 2. Admins can do everything
CREATE POLICY "Admins have full access to site_pages" ON public.site_pages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Index for routing
CREATE INDEX IF NOT EXISTS idx_site_pages_slug ON public.site_pages(slug);

-- Initial seeding for home
INSERT INTO public.site_pages (slug, title, is_published)
VALUES ('home', 'Main Marketplace Entrance', true)
ON CONFLICT (slug) DO NOTHING;
