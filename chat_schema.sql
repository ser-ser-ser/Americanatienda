-- Create Conversations Table
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('support', 'inquiry')),
    title TEXT,
    store_id UUID REFERENCES public.stores(id),
    product_id UUID REFERENCES public.products(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Create Participants Table
CREATE TABLE IF NOT EXISTS public.conversation_participants (
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('admin', 'vendor', 'buyer')),
    last_read_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (conversation_id, user_id)
);

-- Enable RLS
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;

-- Create Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_read BOOLEAN DEFAULT FALSE
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- POLICIES

-- Conversations: Visible if you are a participant
CREATE POLICY "Users can view conversations they are participating in"
ON public.conversations
FOR SELECT
USING (
    exists (
        select 1 from public.conversation_participants
        where conversation_id = conversations.id
        and user_id = auth.uid()
    )
);

-- Participants: Visible if you are a participant in the same conversation (or self)
CREATE POLICY "Users can view participants of their conversations"
ON public.conversation_participants
FOR SELECT
USING (
    user_id = auth.uid() OR
    exists (
        select 1 from public.conversation_participants as cp
        where cp.conversation_id = conversation_participants.conversation_id
        and cp.user_id = auth.uid()
    )
);

-- Messages: Visible if you are a participant in the conversation
CREATE POLICY "Users can view messages in their conversations"
ON public.messages
FOR SELECT
USING (
    exists (
        select 1 from public.conversation_participants
        where conversation_id = messages.conversation_id
        and user_id = auth.uid()
    )
);

-- Messages: Insert allowed if you are a participant
CREATE POLICY "Users can send messages to their conversations"
ON public.messages
FOR INSERT
WITH CHECK (
    auth.uid() = sender_id AND
    exists (
        select 1 from public.conversation_participants
        where conversation_id = messages.conversation_id
        and user_id = auth.uid()
    )
);

-- Function to update updated_at on new message
CREATE OR REPLACE FUNCTION public.handle_new_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.conversations
    SET updated_at = NOW()
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for looking up latest message time
CREATE TRIGGER on_new_message
AFTER INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_message();

-- Enable Realtime
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.conversations;
