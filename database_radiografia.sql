-- ========================================
-- RADIOGRAFÍA COMPLETA DE LA BASE DE DATOS
-- ========================================
-- Ejecuta TODO esto en Supabase SQL Editor

-- 1. VER ESTRUCTURA DE LA TABLA ORDERS (names reales de columnas)
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'orders'
ORDER BY ordinal_position;

-- 2. VER TODAS LAS ÓRDENES (sin importar columnas)
SELECT * FROM public.orders ORDER BY created_at DESC LIMIT 10;

-- 3. VER ESTRUCTURA DE TRANSACTIONS
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'transactions'
ORDER BY ordinal_position;

-- 4. VER TODAS LAS TRANSACCIONES
SELECT * FROM public.transactions ORDER BY created_at DESC LIMIT 10;

-- 5. VER ESTRUCTURA DE SECURE_MESSAGES (chats)
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'secure_messages'
ORDER BY ordinal_position;

-- 6. VER TODOS LOS CHATS
SELECT * FROM public.secure_messages ORDER BY created_at DESC LIMIT 20;

-- 7. VER ESTRUCTURA DE SECURE_CONVERSATIONS
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'secure_conversations'
ORDER BY ordinal_position;

-- 8. VER TODAS LAS CONVERSACIONES
SELECT * FROM public.secure_conversations ORDER BY created_at DESC LIMIT 20;

-- 9. LISTAR TODAS LAS TABLAS QUE EXISTEN
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name AND table_schema = 'public') as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 10. VER WEBHOOKS DE STRIPE (si la tabla existe)
SELECT * FROM public.webhook_events 
WHERE provider = 'stripe' 
ORDER BY created_at DESC 
LIMIT 10;
