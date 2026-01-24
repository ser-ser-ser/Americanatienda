-- ========================================
-- BUSCAR CHATS (FINAL - CORREGIDO)
-- ========================================

-- 1. Ver conversaciones seguras
SELECT 
    sc.id,
    sc.store_id,
    sc.context_type,
    sc.context_id,
    sc.created_at,
    s.name as store_name
FROM public.secure_conversations sc
LEFT JOIN public.stores s ON sc.store_id = s.id
ORDER BY sc.created_at DESC;

-- 2. Ver mensajes seguros (SIN payload)
SELECT 
    sm.id,
    sm.conversation_id,
    sm.sender_id,
    sm.content,
    sm.created_at,
    sm.is_read,
    p.email as sender_email
FROM public.secure_messages sm
LEFT JOIN public.profiles p ON sm.sender_id = p.id
ORDER BY sm.created_at DESC;

-- 3. Mensajes del BUYER en conversaciones legacy
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

-- 4. TODAS las conversaciones del buyer
SELECT 
    c.id,
    c.type,
    c.created_at,
    COUNT(m.id) as message_count
FROM public.conversations c
LEFT JOIN public.conversation_participants cp ON c.id = cp.conversation_id
LEFT JOIN public.messages m ON c.id = m.conversation_id
WHERE cp.user_id = 'b61a1834-b5b4-4c0c-b202-629393477b36'
GROUP BY c.id, c.type, c.created_at
ORDER BY c.created_at DESC;
