-- Migration to support Puck Site Studio
-- Adds content_json column to vendor_pages and store_layouts

-- Add content_json to vendor_pages
ALTER TABLE public.vendor_pages
ADD COLUMN IF NOT EXISTS content_json jsonb DEFAULT '{}'::jsonb;

-- Add content_json to store_layouts
ALTER TABLE public.store_layouts
ADD COLUMN IF NOT EXISTS content_json jsonb DEFAULT '{}'::jsonb;

-- Create a view or common interface for site content if needed later
-- For now, we just ensure the columns exist for the Puck state.
