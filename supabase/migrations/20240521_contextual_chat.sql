-- Migration to add context to secure conversations
ALTER TABLE secure_conversations 
ADD COLUMN IF NOT EXISTS context_type TEXT CHECK (context_type IN ('support', 'order', 'product')),
ADD COLUMN IF NOT EXISTS context_id UUID;

-- Optional: Indexing for performance
CREATE INDEX IF NOT EXISTS idx_secure_conversations_context ON secure_conversations(context_type, context_id);
