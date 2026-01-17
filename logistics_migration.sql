-- Add Logistics fields to Products (for API Quotes)
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS weight_kg NUMERIC DEFAULT 0.5,
ADD COLUMN IF NOT EXISTS length_cm NUMERIC DEFAULT 10,
ADD COLUMN IF NOT EXISTS width_cm NUMERIC DEFAULT 10,
ADD COLUMN IF NOT EXISTS height_cm NUMERIC DEFAULT 5;

-- Add Location fields to Stores (for Pickup/Distance Calc)
ALTER TABLE public.stores
ADD COLUMN IF NOT EXISTS address_street TEXT,
ADD COLUMN IF NOT EXISTS address_city TEXT,
ADD COLUMN IF NOT EXISTS address_state TEXT,
ADD COLUMN IF NOT EXISTS address_zip TEXT,
ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS pickup_enabled BOOLEAN DEFAULT FALSE;

-- Add Advanced Logistics to Shipments
ALTER TABLE public.shipments
ADD COLUMN IF NOT EXISTS delivery_type TEXT CHECK (delivery_type IN ('standard', 'on_demand', 'pickup')),
ADD COLUMN IF NOT EXISTS courier_service_id TEXT, -- ID returned by API (e.g. 'uber_flash')
ADD COLUMN IF NOT EXISTS label_url TEXT,
ADD COLUMN IF NOT EXISTS shipping_cost NUMERIC;

-- Create an index for geospatial queries (optional but good for future)
-- CREATE INDEX ON public.stores (latitude, longitude);
