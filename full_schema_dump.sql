-- ==========================================
-- 1. CHAT SYSTEM
-- ==========================================

-- Conversations
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('support', 'inquiry')),
    title TEXT,
    store_id UUID REFERENCES public.stores(id),
    product_id UUID REFERENCES public.products(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    -- New Fields
    created_by UUID REFERENCES auth.users(id),
    ephemeral_duration TEXT -- '1h', '24h', etc
);

-- Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Participants
CREATE TABLE IF NOT EXISTS public.conversation_participants (
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('admin', 'vendor', 'buyer')),
    last_read_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (conversation_id, user_id)
);

ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;

-- Messages
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_read BOOLEAN DEFAULT FALSE,
    -- New Fields
    expires_at TIMESTAMPTZ
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;


-- ==========================================
-- 2. CHAT POLICIES (UPDATED)
-- ==========================================

-- Conversations: Insert allow for authenticated users (to start chats)
DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;
CREATE POLICY "Users can create conversations" ON public.conversations
FOR INSERT WITH CHECK ( auth.uid() = created_by );

-- Conversations: Select if creator or participant
DROP POLICY IF EXISTS "Users can view conversations" ON public.conversations;
CREATE POLICY "Users can view conversations" ON public.conversations
FOR SELECT USING (
    created_by = auth.uid() OR
    exists (
        select 1 from public.conversation_participants
        where conversation_id = conversations.id
        and user_id = auth.uid()
    )
);

-- Participants
DROP POLICY IF EXISTS "Users can view participants" ON public.conversations;
CREATE POLICY "Users can view participants" ON public.conversation_participants
FOR SELECT USING (
    user_id = auth.uid() OR
    exists (
        select 1 from public.conversation_participants as cp
        where cp.conversation_id = conversation_participants.conversation_id
        and cp.user_id = auth.uid()
    )
);

-- Messages: Secure Select (hiding expired messages)
DROP POLICY IF EXISTS "select_messages" ON public.messages;
CREATE POLICY "select_messages" ON public.messages
FOR SELECT USING (
    exists (
        select 1 from public.conversation_participants
        where conversation_id = messages.conversation_id
        and user_id = auth.uid()
    )
    AND 
    (expires_at IS NULL OR expires_at > NOW())
);

-- Messages: Insert
DROP POLICY IF EXISTS "insert_messages" ON public.messages;
CREATE POLICY "insert_messages" ON public.messages
FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    exists (
        select 1 from public.conversation_participants
        where conversation_id = messages.conversation_id
        and user_id = auth.uid()
    )
);


-- ==========================================
-- 3. LOGISTICS (SHIPMENTS)
-- ==========================================

CREATE TABLE IF NOT EXISTS public.shipments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL, 
    store_id UUID REFERENCES public.stores(id) NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, shipped, delivered, cancelled
    courier TEXT,
    tracking_code TEXT,
    estimated_delivery TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;

-- Shipment Policies
-- Vendors view/update their own
CREATE POLICY "Vendors view own shipments" ON public.shipments
FOR SELECT USING (
    exists (select 1 from public.stores where id = shipments.store_id and owner_id = auth.uid())
);

CREATE POLICY "Vendors update own shipments" ON public.shipments
FOR UPDATE USING (
    exists (select 1 from public.stores where id = shipments.store_id and owner_id = auth.uid())
);

-- Buyers view their own orders' shipments
CREATE POLICY "Buyers view own shipments" ON public.shipments
FOR SELECT USING (
    exists (select 1 from public.orders where id = shipments.order_id and user_id = auth.uid())
);


-- ==========================================
-- 4. NOTIFICATIONS (REALTIME)
-- ==========================================

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users view own notifications" ON public.notifications
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users update own notifications" ON public.notifications
FOR UPDATE USING (auth.uid() = user_id);

-- Trigger: Notify on Shipment Update
CREATE OR REPLACE FUNCTION public.notify_shipment_update()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id UUID;
BEGIN
    IF OLD.status <> NEW.status THEN
        SELECT user_id INTO v_user_id FROM public.orders WHERE id = NEW.order_id;
        IF v_user_id IS NOT NULL THEN
            INSERT INTO public.notifications (user_id, type, title, message, link)
            VALUES (v_user_id, 'order', 'Shipping Update', 'Your order is now: ' || NEW.status, '/dashboard/buyer');
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_shipment_update ON public.shipments;
CREATE TRIGGER on_shipment_update
AFTER UPDATE ON public.shipments
FOR EACH ROW EXECUTE FUNCTION public.notify_shipment_update();
