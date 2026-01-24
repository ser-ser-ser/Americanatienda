-- Query para investigar los chats (CORREGIDO)
-- Ejecuta esto en Supabase

-- 1. Ver todas las conversaciones
SELECT 
    sc.id,
    sc.store_id,
    sc.context_type,
    sc.context_id,
    sc.created_at,
    s.name as store_name
FROM public.secure_conversations sc
LEFT JOIN public.stores s ON sc.store_id = s.id
ORDER BY sc.created_at DESC
LIMIT 20;

-- 2. Ver todos los mensajes
SELECT 
    sm.id,
    sm.conversation_id,
    sm.sender_id,
    sm.encrypted_content,
    sm.created_at,
    p.email as sender_email
FROM public.secure_messages sm
LEFT JOIN public.profiles p ON sm.sender_id = p.id
ORDER BY sm.created_at DESC
LIMIT 20;

-- 3. Ver mensajes NO encriptados (legacy conversations table)
SELECT 
    c.id,
    c.type,
    c.created_at,
    COUNT(m.id) as message_count
FROM public.conversations c
LEFT JOIN public.messages m ON c.id = m.conversation_id
GROUP BY c.id, c.type, c.created_at
ORDER BY c.created_at DESC
LIMIT 20;

-- 4. Ver mensajes legacy
SELECT 
    m.id,
    m.conversation_id,
    m.sender_id,
    m.content,
    m.created_at,
    p.email as sender_email
FROM public.messages m
LEFT JOIN public.profiles p ON m.sender_id = p.id
ORDER BY m.created_at DESC
LIMIT 20;
