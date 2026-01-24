-- ========================================
-- OBTENER ESTRUCTURA REAL DE LAS TABLAS
-- ========================================

-- 1. Columnas de order_items
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'order_items'
ORDER BY ordinal_position;

-- 2. Columnas de secure_messages
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'secure_messages'
ORDER BY ordinal_position;

-- 3. Columnas de messages (legacy)
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'messages'
ORDER BY ordinal_position;
