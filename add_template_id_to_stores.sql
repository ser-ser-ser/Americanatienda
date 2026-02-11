-- Add template_id column to stores table
ALTER TABLE public.stores 
ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES public.store_templates(id);

-- Optional: Add index for performance
CREATE INDEX IF NOT EXISTS idx_stores_template_id ON public.stores(template_id);
