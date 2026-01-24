-- EJECUTA ESTO AHORA para recuperar el store_id de las órdenes

-- 1. Actualizar las órdenes con el store_id recuperado
UPDATE public.orders
SET store_id = 'dfdb7390-f7bd-462d-868d-51dad5ac2a23'
WHERE id = '69efe632-7b98-4144-9719-875512a712bb'; -- Familia americana ($200)

UPDATE public.orders  
SET store_id = 'ca57701a-ac98-4abc-abe1-5ff9a340665c'
WHERE id = '7bb78a0c-c24b-4309-b0ee-9aba45e8dbac'; -- Rush ($350)

-- 2. Verificar las órdenes actualizadas
SELECT 
    o.id,
    o.total_amount,
    o.status,
    o.store_id,
    s.name as store_name,
    o.created_at
FROM public.orders o
LEFT JOIN public.stores s ON o.store_id = s.id
WHERE o.user_id = 'b61a1834-b5b4-4c0c-b202-629393477b36'
ORDER BY o.created_at DESC;

-- 3. Investigar la orden de $400 (sin productos)
SELECT 
    o.id,
    o.total_amount,
    o.status,
    o.created_at,
    oi.id as order_item_id,
    oi.product_id,
    oi.quantity,
    oi.price
FROM public.orders o
LEFT JOIN public.order_items oi ON o.id = oi.order_id
WHERE o.id = 'f0e4b396-cb32-4d18-9d44-551941fd030f';
