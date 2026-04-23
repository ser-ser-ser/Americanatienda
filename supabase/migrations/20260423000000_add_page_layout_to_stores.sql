-- ============================================================
-- Migration: Add page_layout column to stores
-- Allows vendors to save their Site Studio page as JSON
-- ============================================================

-- Add page_layout column to stores table
ALTER TABLE stores
ADD COLUMN IF NOT EXISTS page_layout JSONB DEFAULT NULL;

-- Add index for faster reads
CREATE INDEX IF NOT EXISTS idx_stores_page_layout_not_null
ON stores(id) WHERE page_layout IS NOT NULL;

-- Comment
COMMENT ON COLUMN stores.page_layout IS 'JSON layout built with Site Studio page builder';
