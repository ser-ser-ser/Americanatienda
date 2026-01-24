
-- SECURE CHAT SCHEMA (v2 - Conflict Resolved)
-- Enables "Stealth Mode" communication with PIN protection

-- 1. USER SECURITY (Table to store the Chat PIN)
CREATE TABLE IF NOT EXISTS public.user_security (
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    chat_pin_hash text, 
    is_stealth_mode_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 1.5 PROFILES ADDITION (For E2EE)
-- Run this if chat_public_key doesn't exist in your profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS chat_public_key jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS chat_pin_hash text; -- Alternative storage for PIN


-- 2. SECURE CONVERSATIONS (Renamed to avoid conflict with legacy 'conversations')
CREATE TABLE IF NOT EXISTS public.secure_conversations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    participants uuid[] NOT NULL, -- Array of User IDs involved
    last_message_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_message_preview text,
    is_encrypted boolean DEFAULT true,
    metadata jsonb DEFAULT '{}'::jsonb, 
    context_type text, -- 'order', 'product', 'support'
    context_id text, -- ID of the related object
    type text DEFAULT 'inquiry', -- 'support', 'inquiry', 'order', 'product'
    title text,
    store_id uuid REFERENCES public.stores(id) ON DELETE SET NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. SECURE MESSAGES
CREATE TABLE IF NOT EXISTS public.secure_messages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id uuid REFERENCES public.secure_conversations(id) ON DELETE CASCADE NOT NULL,
    sender_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    content text NOT NULL, -- Encrypted content
    type text DEFAULT 'text', -- 'text', 'image', 'system'
    read_by uuid[] DEFAULT '{}'::uuid[], -- Array of users who read it
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS POLICIES

-- User Security
ALTER TABLE public.user_security ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own security" ON public.user_security;
CREATE POLICY "Users view own security" ON public.user_security FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own security" ON public.user_security;
CREATE POLICY "Users update own security" ON public.user_security FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own security" ON public.user_security;
CREATE POLICY "Users insert own security" ON public.user_security FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Secure Conversations
ALTER TABLE public.secure_conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view joined secure conversations" ON public.secure_conversations;
CREATE POLICY "Users view joined secure conversations" ON public.secure_conversations
    FOR SELECT USING (auth.uid() = ANY(participants));

DROP POLICY IF EXISTS "Users create secure conversations" ON public.secure_conversations;
CREATE POLICY "Users create secure conversations" ON public.secure_conversations
    FOR INSERT WITH CHECK (auth.uid() = ANY(participants));

DROP POLICY IF EXISTS "Users update joined secure conversations" ON public.secure_conversations;
CREATE POLICY "Users update joined secure conversations" ON public.secure_conversations
    FOR UPDATE USING (auth.uid() = ANY(participants));

-- Secure Messages
ALTER TABLE public.secure_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view secure conversation messages" ON public.secure_messages;
CREATE POLICY "Users view secure conversation messages" ON public.secure_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.secure_conversations c 
            WHERE c.id = secure_messages.conversation_id 
            AND auth.uid() = ANY(c.participants)
        )
    );

DROP POLICY IF EXISTS "Users send secure messages" ON public.secure_messages;
CREATE POLICY "Users send secure messages" ON public.secure_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.secure_conversations c 
            WHERE c.id = conversation_id 
            AND auth.uid() = ANY(c.participants)
        )
    );

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_secure_conversations_participants ON public.secure_conversations USING GIN(participants);
CREATE INDEX IF NOT EXISTS idx_secure_messages_conversation_id ON public.secure_messages(conversation_id);
