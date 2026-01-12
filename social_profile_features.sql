-- Add cover image for social profile style
ALTER TABLE stores 
ADD COLUMN IF NOT EXISTS cover_image_url text;
