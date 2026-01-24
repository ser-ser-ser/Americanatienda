-- ========================================
-- BUSCAR CHATS - VERSIÓN ULTRA SIMPLE
-- ========================================

-- 1. Ver TODO de secure_messages (sin filtrar columnas)
SELECT * FROM public.secure_messages 
ORDER BY created_at DESC 
LIMIT 10;

-- 2. Ver TODO de messages (legacy)
SELECT * FROM public.messages
ORDER BY created_at DESC
LIMIT 10;

-- 3. Mensajes del buyer específicamente (legacy)
SELECT * FROM public.messages
WHERE sender_id = 'b61a1834-b5b4-4c0c-b202-629393477b36'
ORDER BY created_at DESC;

-- 4. Conversaciones del buyer
SELECT * FROM public.conversations
ORDER BY created_at DESC
LIMIT 10;
