-- Fix: Add missing 'title' column to secure_conversations
-- Run this in Supabase SQL Editor

-- Check if column exists first
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'secure_conversations' 
        AND column_name = 'title'
    ) THEN
        -- Add the column
        ALTER TABLE public.secure_conversations 
        ADD COLUMN title text;
        
        RAISE NOTICE 'Column title added to secure_conversations';
    ELSE
        RAISE NOTICE 'Column title already exists';
    END IF;
END $$;

-- Verify the column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'secure_conversations' 
AND column_name = 'title';
