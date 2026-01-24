-- ========================================
-- RADIOGRAFÍA COMPLETA DE LA BASE DE DATOS
-- Ejecuta TODO esto en Supabase SQL Editor
-- ========================================

-- 1. LISTAR TODAS LAS TABLAS CON DETALLES
SELECT 
    t.table_name,
    (SELECT COUNT(*) FROM information_schema.columns c WHERE c.table_name = t.table_name) as column_count,
    pg_size_pretty(pg_total_relation_size(quote_ident(t.table_name)::regclass)) as total_size,
    (SELECT COUNT(*) FROM information_schema.table_constraints tc 
     WHERE tc.table_name = t.table_name AND tc.constraint_type = 'FOREIGN KEY') as foreign_keys_count
FROM information_schema.tables t
WHERE t.table_schema = 'public'
AND t.table_type = 'BASE TABLE'
ORDER BY t.table_name;

-- 2. CONTAR REGISTROS EN CADA TABLA
SELECT 
    'addresses' as table_name, COUNT(*) as row_count FROM addresses
UNION ALL SELECT 'categories', COUNT(*) FROM categories
UNION ALL SELECT 'commission_config', COUNT(*) FROM commission_config
UNION ALL SELECT 'contact_messages', COUNT(*) FROM contact_messages
UNION ALL SELECT 'conversation_participants', COUNT(*) FROM conversation_participants
UNION ALL SELECT 'conversations', COUNT(*) FROM conversations
UNION ALL SELECT 'details_sex_shop', COUNT(*) FROM details_sex_shop
UNION ALL SELECT 'details_smoke_shop', COUNT(*) FROM details_smoke_shop
UNION ALL SELECT 'inventory_logs', COUNT(*) FROM inventory_logs
UNION ALL SELECT 'messages', COUNT(*) FROM messages
UNION ALL SELECT 'notifications', COUNT(*) FROM notifications
UNION ALL SELECT 'order_items', COUNT(*) FROM order_items
UNION ALL SELECT 'orders', COUNT(*) FROM orders
UNION ALL SELECT 'payment_configs', COUNT(*) FROM payment_configs
UNION ALL SELECT 'posts', COUNT(*) FROM posts
UNION ALL SELECT 'products', COUNT(*) FROM products
UNION ALL SELECT 'profiles', COUNT(*) FROM profiles
UNION ALL SELECT 'secure_conversations', COUNT(*) FROM secure_conversations
UNION ALL SELECT 'secure_messages', COUNT(*) FROM secure_messages
UNION ALL SELECT 'shipments', COUNT(*) FROM shipments
UNION ALL SELECT 'shipping_configs', COUNT(*) FROM shipping_configs
UNION ALL SELECT 'site_content', COUNT(*) FROM site_content
UNION ALL SELECT 'store_categories', COUNT(*) FROM store_categories
UNION ALL SELECT 'store_layouts', COUNT(*) FROM store_layouts
UNION ALL SELECT 'store_members', COUNT(*) FROM store_members
UNION ALL SELECT 'store_templates', COUNT(*) FROM store_templates
UNION ALL SELECT 'stores', COUNT(*) FROM stores
UNION ALL SELECT 'transactions', COUNT(*) FROM transactions
UNION ALL SELECT 'user_addresses', COUNT(*) FROM user_addresses
UNION ALL SELECT 'user_security', COUNT(*) FROM user_security
UNION ALL SELECT 'vendor_payment_accounts', COUNT(*) FROM vendor_payment_accounts
UNION ALL SELECT 'vendor_payouts', COUNT(*) FROM vendor_payouts
UNION ALL SELECT 'webhook_events', COUNT(*) FROM webhook_events
ORDER BY row_count DESC;

-- 3. PRODUCTOS FANTASMAS (productos sin tienda o con tienda eliminada)
SELECT 
    p.id,
    p.name,
    p.price,
    p.stock,
    p.store_id,
    s.name as store_name,
    s.status as store_status,
    p.created_at
FROM products p
LEFT JOIN stores s ON p.store_id = s.id
WHERE s.id IS NULL OR s.status != 'active'
ORDER BY p.created_at DESC;

-- 4. ORDER_ITEMS HUÉRFANOS (sin producto o sin orden)
SELECT 
    oi.id,
    oi.order_id,
    oi.product_id,
    oi.quantity,
    oi.price_at_purchase,
    o.status as order_status,
    p.name as product_name
FROM order_items oi
LEFT JOIN orders o ON oi.order_id = o.id
LEFT JOIN products p ON oi.product_id = p.id
WHERE o.id IS NULL OR p.id IS NULL
ORDER BY oi.created_at DESC;

-- 5. ÓRDENES SIN ITEMS
SELECT 
    o.id,
    o.user_id,
    o.total_amount,
    o.status,
    o.store_id,
    o.created_at,
    COUNT(oi.id) as items_count
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, o.user_id, o.total_amount, o.status, o.store_id, o.created_at
HAVING COUNT(oi.id) = 0
ORDER BY o.created_at DESC;

-- 6. TIENDAS SIN PRODUCTOS
SELECT 
    s.id,
    s.name,
    s.slug,
    s.status,
    s.owner_id,
    COUNT(p.id) as products_count,
    s.created_at
FROM stores s
LEFT JOIN products p ON s.id = p.store_id
GROUP BY s.id, s.name, s.slug, s.status, s.owner_id, s.created_at
HAVING COUNT(p.id) = 0
ORDER BY s.created_at DESC;

-- 7. PRODUCTOS SIN STOCK
SELECT 
    p.id,
    p.name,
    p.price,
    p.stock,
    p.store_id,
    s.name as store_name,
    p.created_at
FROM products p
JOIN stores s ON p.store_id = s.id
WHERE p.stock = 0 OR p.stock IS NULL
ORDER BY p.created_at DESC;

-- 8. CONVERSACIONES SIN MENSAJES
SELECT 
    c.id,
    c.type,
    c.title,
    c.created_at,
    COUNT(m.id) as messages_count
FROM conversations c
LEFT JOIN messages m ON c.id = m.conversation_id
GROUP BY c.id, c.type, c.title, c.created_at
HAVING COUNT(m.id) = 0
ORDER BY c.created_at DESC;

-- 9. USUARIOS SIN TIENDAS NI ÓRDENES (Inactivos)
SELECT 
    p.id,
    p.email,
    p.role,
    p.created_at,
    COUNT(DISTINCT s.id) as stores_count,
    COUNT(DISTINCT o.id) as orders_count
FROM profiles p
LEFT JOIN stores s ON p.id = s.owner_id
LEFT JOIN orders o ON p.id = o.user_id
GROUP BY p.id, p.email, p.role, p.created_at
HAVING COUNT(DISTINCT s.id) = 0 AND COUNT(DISTINCT o.id) = 0
ORDER BY p.created_at DESC;

-- 10. RELACIONES ROTAS (Foreign Keys inválidos)
-- Productos con store_id que no existe
SELECT 'products → stores' as relation, COUNT(*) as broken_count
FROM products p
LEFT JOIN stores s ON p.store_id = s.id
WHERE p.store_id IS NOT NULL AND s.id IS NULL

UNION ALL

-- Orders con user_id que no existe
SELECT 'orders → users', COUNT(*)
FROM orders o
LEFT JOIN profiles p ON o.user_id = p.id
WHERE o.user_id IS NOT NULL AND p.id IS NULL

UNION ALL

-- Order_items con order_id que no existe
SELECT 'order_items → orders', COUNT(*)
FROM order_items oi
LEFT JOIN orders o ON oi.order_id = o.id
WHERE oi.order_id IS NOT NULL AND o.id IS NULL;
