-- QUERY URGENTE: Buscar órdenes pagadas en Stripe
-- Ejecuta esto en Supabase SQL Editor AHORA

-- 1. Ver todas las órdenes existentes
SELECT 
    id,
    user_id,
    store_id,
    total,
    status,
    payment_status,
    payment_intent_id,
    created_at
FROM public.orders
ORDER BY created_at DESC
LIMIT 20;

-- 2. Ver si hay transacciones en Stripe que no están en orders
SELECT 
    t.id,
    t.payment_intent_id,
    t.order_id,
    t.amount,
    t.status as transaction_status,
    o.status as order_status,
    t.created_at
FROM public.transactions t
LEFT JOIN public.orders o ON t.order_id = o.id
ORDER BY t.created_at DESC
LIMIT 20;

-- 3. Buscar órdenes SIN transacciones (posible problema)
SELECT 
    o.id,
    o.total,
    o.status,
    o.payment_status,
    o.payment_intent_id,
    o.created_at
FROM public.orders o
LEFT JOIN public.transactions t ON o.id = t.order_id
WHERE t.id IS NULL
ORDER BY o.created_at DESC;

-- 4. Ver webhooks recibidos de Stripe
SELECT 
    id,
    event_type,
    processed,
    created_at,
    payload->>'id' as stripe_event_id
FROM public.webhook_events
WHERE provider = 'stripe'
ORDER BY created_at DESC
LIMIT 10;
