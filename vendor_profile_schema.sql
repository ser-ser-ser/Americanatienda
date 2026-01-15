-- Add Founder/Visionary profile fields to stores table
ALTER TABLE stores 
ADD COLUMN IF NOT EXISTS founder_name text,
ADD COLUMN IF NOT EXISTS founder_role text DEFAULT 'Founder',
ADD COLUMN IF NOT EXISTS founder_bio text,
ADD COLUMN IF NOT EXISTS founder_quote text,
ADD COLUMN IF NOT EXISTS founder_image_url text,
ADD COLUMN IF NOT EXISTS establishment_date text;

-- Add comment
COMMENT ON COLUMN stores.founder_name IS 'Name of the brand visionary/founder';
