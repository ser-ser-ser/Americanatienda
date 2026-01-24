-- Query para encontrar tus tiendas con el UUID correcto
-- Ejecuta esto en Supabase SQL Editor

SELECT 
    s.id AS store_uuid,
    s.name AS store_name,
    s.slug,
    s.owner_id,
    p.email AS owner_email,
    s.created_at
FROM public.stores s
LEFT JOIN public.profiles p ON s.owner_id = p.id
WHERE s.status = 'active'
ORDER BY s.created_at DESC;

-- Esto te mostrará:
-- 1. store_uuid: El UUID que necesitas para /test/stripe
-- 2. store_name: Nombre de la tienda
-- 3. owner_email: Email del dueño
--
-- Copia el "store_uuid" de "The Red Room" o "The Lounge"
