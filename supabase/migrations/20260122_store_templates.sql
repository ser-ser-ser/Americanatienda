-- AMERICANA TEMPLATE SYSTEM
-- Allows vendors to choose from pre-designed store layouts

-- 1. Store Templates Table
CREATE TABLE IF NOT EXISTS public.store_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE, -- "Luxury Minimal", "Urban Bold", "Organic Natural"
    description TEXT,
    preview_image_url TEXT, -- Screenshot/mockup URL
    config JSONB NOT NULL, -- { theme, layout, colors, fonts, components }
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add Template Tracking to Stores
ALTER TABLE public.stores 
ADD COLUMN IF NOT EXISTS active_template_id UUID REFERENCES public.store_templates(id),
ADD COLUMN IF NOT EXISTS template_customization JSONB DEFAULT '{}'::jsonb; -- Vendor's color/font overrides

-- 3. Seed the 3 Initial Templates
INSERT INTO public.store_templates (name, description, config) VALUES
(
    'Luxury Minimal',
    'Elegancia minimalista con tipografía serif y paleta sofisticada. Ideal para marcas de alta gama.',
    '{
        "theme": "dark",
        "hero": {
            "type": "fullscreen-image",
            "overlay": "gradient"
        },
        "productGrid": {
            "columns": 3,
            "spacing": "wide",
            "cardStyle": "minimal",
            "hoverEffect": "subtle-scale"
        },
        "colors": {
            "primary": "#000000",
            "secondary": "#FFFFFF",
            "accent": "#D4AF37",
            "background": "#0A0A0A"
        },
        "fonts": {
            "heading": "Playfair Display",
            "body": "Inter"
        }
    }'
),
(
    'Urban Bold',
    'Diseño asimétrico con tipografía grande y colores neón. Para marcas urbanas y streetwear.',
    '{
        "theme": "light",
        "hero": {
            "type": "split-screen",
            "textPosition": "left"
        },
        "productGrid": {
            "columns": 2,
            "spacing": "tight",
            "cardStyle": "shadow-heavy",
            "hoverEffect": "neon-glow"
        },
        "colors": {
            "primary": "#00D4FF",
            "secondary": "#FF007F",
            "accent": "#000000",
            "background": "#F5F5F5"
        },
        "fonts": {
            "heading": "Bebas Neue",
            "body": "Roboto"
        }
    }'
),
(
    'Organic Natural',
    'Espaciado amplio con imágenes en círculos y tonos tierra. Para marcas eco-friendly y wellness.',
    '{
        "theme": "light",
        "hero": {
            "type": "centered-text",
            "imageShape": "circle"
        },
        "productGrid": {
            "columns": 3,
            "spacing": "wide",
            "cardStyle": "rounded",
            "hoverEffect": "soft-lift"
        },
        "colors": {
            "primary": "#6B8E23",
            "secondary": "#F5F5DC",
            "accent": "#CD853F",
            "background": "#FFFEF7"
        },
        "fonts": {
            "heading": "Quicksand",
            "body": "Nunito"
        }
    }'
)
ON CONFLICT (name) DO NOTHING;

-- 4. RLS Policies for Templates
ALTER TABLE public.store_templates ENABLE ROW LEVEL SECURITY;

-- Everyone can view available templates
CREATE POLICY "Public can view templates" ON public.store_templates
FOR SELECT USING (is_active = true);

-- Only admins can manage templates
CREATE POLICY "Admins manage templates" ON public.store_templates
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- 5. Function to Apply Template to Store
CREATE OR REPLACE FUNCTION public.apply_template_to_store(
    p_store_id UUID,
    p_template_id UUID
) RETURNS VOID AS $$
BEGIN
    -- Verify store ownership
    IF NOT EXISTS (
        SELECT 1 FROM public.stores 
        WHERE id = p_store_id AND owner_id = auth.uid()
    ) THEN
        RAISE EXCEPTION 'Unauthorized: You do not own this store';
    END IF;

    -- Apply template
    UPDATE public.stores
    SET active_template_id = p_template_id,
        updated_at = NOW()
    WHERE id = p_store_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Index for Performance
CREATE INDEX IF NOT EXISTS idx_stores_template ON public.stores(active_template_id);
