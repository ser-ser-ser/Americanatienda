-- CMS & EDITORIAL SCHEMA

-- 1. SITE CONTENT (Key-Value Store for Global Settings)
CREATE TABLE IF NOT EXISTS public.site_content (
    key TEXT PRIMARY KEY,
    value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can READ content (it's the website content)
CREATE POLICY "Public can view site content" ON public.site_content
    FOR SELECT USING (true);

-- Policy: Only Admins can UPDATE/INSERT
CREATE POLICY "Admins can manage site content" ON public.site_content
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );


-- 2. POSTS (Editorial / Blog Engine)
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT, -- Markdown or HTML
    cover_image TEXT,
    published BOOLEAN DEFAULT false,
    author_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Policy: Public can view PUBLISHED posts
CREATE POLICY "Public can view published posts" ON public.posts
    FOR SELECT USING (published = true);

-- Policy: Admins can manage ALL posts
CREATE POLICY "Admins can manage posts" ON public.posts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published ON public.posts(published);
