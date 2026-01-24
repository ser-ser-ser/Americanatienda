-- ========================================
-- BUSCAR TODOS LOS CHATS (CORRECTO)
-- ========================================

-- 1. Ver conversaciones seguras (E2EE)
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

-- 2. Ver mensajes seguros (tabla realtime de Supabase)
SELECT 
    sm.id,
    sm.conversation_id,
    sm.sender_id,
    sm.content,
    sm.payload,
    sm.created_at,
    p.email as sender_email
FROM public.secure_messages sm
LEFT JOIN public.profiles p ON sm.sender_id = p.id
ORDER BY sm.created_at DESC
LIMIT 20;

-- 3. Ver conversaciones legacy (no encriptadas)
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

-- 5. BUSCAR MENSAJES DEL BUYER ESPECÍFICAMENTE
SELECT 
    m.id,
    m.sender_id,
    m.content,
    m.created_at,
    c.type as conversation_type,
    p.email
FROM public.messages m
LEFT JOIN public.conversations c ON m.conversation_id = c.id
LEFT JOIN public.profiles p ON m.sender_id = p.id
WHERE m.sender_id = 'b61a1834-b5b4-4c0c-b202-629393477b36'
ORDER BY m.created_at DESC;
