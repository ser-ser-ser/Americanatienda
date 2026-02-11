-- Migration: Pivot from GrapesJS to Puck in vendor_pages
-- Description: Renames the storage column and removes legacy compiled assets.

DO $$ 
BEGIN
    -- 1. Rename column grapes_json_data to puck_content if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'vendor_pages' AND column_name = 'grapes_json_data') THEN
        ALTER TABLE public.vendor_pages RENAME COLUMN grapes_json_data TO puck_content;
    END IF;

    -- 2. Ensure puck_content is jsonb (it should be, but let's be safe)
    ALTER TABLE public.vendor_pages ALTER COLUMN puck_content TYPE jsonb USING puck_content::jsonb;

    -- 3. Drop compiled_html and compiled_css as Puck renders on-the-fly
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'vendor_pages' AND column_name = 'compiled_html') THEN
        ALTER TABLE public.vendor_pages DROP COLUMN compiled_html;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'vendor_pages' AND column_name = 'compiled_css') THEN
        ALTER TABLE public.vendor_pages DROP COLUMN compiled_css;
    END IF;
END $$;
