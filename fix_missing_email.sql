-- 1. Add email column if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email TEXT;

-- 2. Backfill email from auth.users (Using a correlated subquery update)
-- note: we cannot directly access auth.users in a simple update due to permissions sometimes, 
-- but as a superuser/migration tool execution, this should work.
-- If direct access fails, we might just leave it null until next login/update, 
-- but let's try to fill it for better UX.

DO $$
BEGIN
    UPDATE public.profiles p
    SET email = u.email
    FROM auth.users u
    WHERE p.id = u.id
    AND p.email IS NULL;
END $$;

-- 3. Force schema cache reload (usually happens auto, but good to be safe)
NOTIFY pgrst, 'reload config';
