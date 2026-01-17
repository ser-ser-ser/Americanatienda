BEGIN;

-- ============================================================
-- 9. CONVERSATIONS
-- Remove duplicates and optimize performance
-- ============================================================
DROP POLICY IF EXISTS "Users can view conversations" ON conversations;
DROP POLICY IF EXISTS "Users can view conversations they are participating in" ON conversations;
DROP POLICY IF EXISTS "select_conversations" ON conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON conversations;
DROP POLICY IF EXISTS "insert_conversations" ON conversations;

-- Updated Policies
CREATE POLICY "Users view their conversations" ON conversations FOR SELECT USING (
  exists (
    select 1 from conversation_participants cp
    where cp.conversation_id = conversations.id
    and cp.user_id = (select auth.uid())
  )
);

CREATE POLICY "Users create conversations" ON conversations FOR INSERT WITH CHECK (
  -- Allow creation if authenticated? Or restrict? 
  -- Usually authenticated users can start chats.
  (select auth.role()) = 'authenticated'
);


-- ============================================================
-- 10. CONVERSATION PARTICIPANTS
-- Remove duplicates and optimize performance
-- ============================================================
DROP POLICY IF EXISTS "Users can view participants" ON conversation_participants;
DROP POLICY IF EXISTS "select_participants" ON conversation_participants;
DROP POLICY IF EXISTS "Users can join conversations" ON conversation_participants;
DROP POLICY IF EXISTS "insert_participants" ON conversation_participants;

-- Updated Policies
CREATE POLICY "View conversation participants" ON conversation_participants FOR SELECT USING (
  -- Can view participants if I am a participant in that conversation
  exists (
    select 1 from conversation_participants cp_self
    where cp_self.conversation_id = conversation_participants.conversation_id
    and cp_self.user_id = (select auth.uid())
  )
);

CREATE POLICY "Join conversation" ON conversation_participants FOR INSERT WITH CHECK (
  -- Can add myself or others? Usually logic is confusing here without custom function.
  -- Simplified: Can add SELF
  user_id = (select auth.uid())
);


-- ============================================================
-- 11. MESSAGES
-- Optimize performance (initplan)
-- ============================================================
DROP POLICY IF EXISTS "select_messages" ON messages;
DROP POLICY IF EXISTS "insert_messages" ON messages;

CREATE POLICY "View messages" ON messages FOR SELECT USING (
  exists (
    select 1 from conversation_participants cp
    where cp.conversation_id = messages.conversation_id
    and cp.user_id = (select auth.uid())
  )
);

CREATE POLICY "Insert messages" ON messages FOR INSERT WITH CHECK (
  sender_id = (select auth.uid())
  AND
  exists (
    select 1 from conversation_participants cp
    where cp.conversation_id = messages.conversation_id
    and cp.user_id = (select auth.uid())
  )
);


-- ============================================================
-- 12. SITE CONTENT & CONTACT MESSAGES
-- Optimize performance
-- ============================================================
DROP POLICY IF EXISTS "Allow authenticated write" ON site_content;
-- Recreate with optimized auth check
CREATE POLICY "Allow authenticated write" ON site_content FOR ALL USING (
  (select auth.role()) = 'authenticated'
);

DROP POLICY IF EXISTS "Allow admin read" ON contact_messages;
DROP POLICY IF EXISTS "Allow admin select" ON contact_messages;

CREATE POLICY "Admin read contact messages" ON contact_messages FOR SELECT USING (
  exists (
    select 1 from profiles
    where profiles.id = (select auth.uid())
    and profiles.role = 'admin'
  )
);

COMMIT;
