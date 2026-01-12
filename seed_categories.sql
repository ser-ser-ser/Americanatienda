-- Seed Categories for known stores

DO $$
DECLARE
    red_room_id uuid;
    lounge_id uuid;
BEGIN
    -- Get Store IDs (Assuming names are consistent)
    SELECT id INTO red_room_id FROM stores WHERE slug = 'the-red-room' OR name ILIKE '%Red Room%' LIMIT 1;
    SELECT id INTO lounge_id FROM stores WHERE slug = 'the-lounge' OR name ILIKE '%Lounge%' LIMIT 1;

    -- Seed Red Room Categories (Sex Shop)
    IF red_room_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM store_categories WHERE store_id = red_room_id) THEN
        INSERT INTO store_categories (store_id, name, slug) VALUES
        (red_room_id, 'Lingerie', 'lingerie'),
        (red_room_id, 'Toys', 'toys'),
        (red_room_id, 'Accessories', 'accessories'),
        (red_room_id, 'Wellness', 'wellness');
    END IF;

    -- Seed The Lounge Categories (Smoke Shop)
    IF lounge_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM store_categories WHERE store_id = lounge_id) THEN
        INSERT INTO store_categories (store_id, name, slug) VALUES
        (lounge_id, 'Glass', 'glass'),
        (lounge_id, 'Papers & Wraps', 'papers-wraps'),
        (lounge_id, 'Vaporizers', 'vaporizers'),
        (lounge_id, 'Accessories', 'accessories');
    END IF;

END $$;
