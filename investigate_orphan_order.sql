-- ========================================
-- INVESTIGAR ORDEN HUÉRFANA DE $400
-- ========================================

-- Orden problemática: f0e4b396-cb32-4d18-9d44-551941fd030f
-- Creada: 2026-01-16 15:00:01 (PRIMERA del día)
-- Usuario: b61a1834-b5b4-4c0c-b202-629393477b36

-- 1. Ver si tiene order_items
SELECT * FROM public.order_items 
WHERE order_id = 'f0e4b396-cb32-4d18-9d44-551941fd030f';

-- 2. Ver orden completa
SELECT * FROM public.orders 
WHERE id = 'f0e4b396-cb32-4d18-9d44-551941fd030f';

-- 3. Ver TODAS las order_items del buyer (otros orders)
SELECT 
    oi.*,
    o.total_amount,
    o.created_at,
    p.name as product_name
FROM public.order_items oi
JOIN public.orders o ON oi.order_id = o.id
LEFT JOIN public.products p ON oi.product_id = p.id
WHERE o.user_id = 'b61a1834-b5b4-4c0c-b202-629393477b36'
ORDER BY o.created_at DESC;

-- 4. Buscar si el producto existe pero fue eliminado
-- (Buscar en logs o audit trail si existe)

-- 5. HIPÓTESIS: Puede ser un intento fallido de checkout
-- La orden se creó pero el proceso se interrumpió antes de crear order_items
-- Sugerencia: ELIMINAR esta orden huérfana
-- DELETE FROM public.orders WHERE id = 'f0e4b396-cb32-4d18-9d44-551941fd030f';
-- (Comentado por seguridad - ejecutar solo si confirmas que no tiene datos importantes)
