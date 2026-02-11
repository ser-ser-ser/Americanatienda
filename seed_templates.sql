INSERT INTO public.store_templates (name, description, preview_image_url, config, is_active)
VALUES
(
    'Minimal Theme', 
    'Clean, whitespace-heavy design for modern brands.', 
    NULL, 
    '{"category": "Fashion", "component_key": "minimal", "colors": {"primary": "#000000", "background": "#ffffff"}}', 
    true
),
(
    'Le Boutique', 
    'Elegant serif typography and soft colors.', 
    NULL, 
    '{"category": "Luxury", "component_key": "boutique", "colors": {"primary": "#4a4a4a", "background": "#f8f5f2"}}', 
    true
),
(
    'Brutalist / Grunge', 
    'Raw, high-contrast aesthetic for streetwear.', 
    NULL, 
    '{"category": "Streetwear", "component_key": "brutalist", "colors": {"primary": "#ffffff", "background": "#18181b"}}', 
    true
)
ON CONFLICT (name) DO NOTHING;
