-- ========================================
-- LIMPIAR ORDEN HUÉRFANA DE $400
-- ========================================

-- Esta orden NO tiene productos (order_items vacío)
-- Fue creada el 2026-01-16 a las 15:00:01 pero el checkout falló
-- Es la PRIMERA de las 3 órdenes del día (las otras 2 SÍ tienen productos)

-- ANTES DE ELIMINAR, VERIFICAR:
SELECT 
    o.id,
    o.total_amount,
    o.status,
    o.created_at,
    COUNT(oi.id) as items_count
FROM public.orders o
LEFT JOIN public.order_items oi ON o.id = oi.order_id
WHERE o.id = 'f0e4b396-cb32-4d18-9d44-551941fd030f'
GROUP BY o.id, o.total_amount, o.status, o.created_at;

-- SI items_count = 0, entonces ES SEGURO eliminar:

-- OPCIÓN 1: Marcar como "cancelled" (más seguro)
UPDATE public.orders 
SET status = 'cancelled'
WHERE id = 'f0e4b396-cb32-4d18-9d44-551941fd030f';

-- OPCIÓN 2: Eliminar permanentemente (solo si confirmas que no hay riesgo)
-- DELETE FROM public.orders 
-- WHERE id = 'f0e4b396-cb32-4d18-9d44-551941fd030f';

-- Verificar después:
SELECT id, total_amount, status, store_id
FROM public.orders
WHERE user_id = 'b61a1834-b5b4-4c0c-b202-629393477b36'
ORDER BY created_at DESC;
