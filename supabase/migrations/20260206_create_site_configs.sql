-- Create site_configs table for global settings
CREATE TABLE IF NOT EXISTS public.site_configs (
    key text PRIMARY KEY,
    value jsonb DEFAULT '{}'::jsonb NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.site_configs ENABLE ROW LEVEL SECURITY;

-- Allow Admins to manage site_configs
CREATE POLICY "Allow public read access to site_configs"
ON public.site_configs FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow admins to insert/update site_configs"
ON public.site_configs FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Insert initial empty design if not exists
INSERT INTO public.site_configs (key, value)
VALUES ('global_landing_design', '{"content": [], "root": {}}'::jsonb)
ON CONFLICT (key) DO NOTHING;
