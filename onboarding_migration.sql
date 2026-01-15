-- Add new fields for Seller Onboarding
ALTER TABLE stores 
ADD COLUMN IF NOT EXISTS website text,
ADD COLUMN IF NOT EXISTS instagram_handle text,
ADD COLUMN IF NOT EXISTS niche text;
