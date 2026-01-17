BEGIN;

-- ============================================================
-- 1. SECURE FUNCTIONS (Search Path Mutable)
-- ============================================================
-- Fixes "Function Search Path Mutable" warning by explicitly setting search_path to 'public'
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.handle_default_address() SET search_path = public;


-- ============================================================
-- 2. SECURE CONTACT MESSAGES RLS
-- ============================================================
-- Fixes "RLS Policy Always True" warning by adding a meaningful constraint.
-- Users/Anons can only insert messages if 'read' status is false (default).
-- This ensures they cannot maliciously insert 'read' messages to bypass admin attention.

DROP POLICY IF EXISTS "Allow public insert" ON contact_messages;

CREATE POLICY "Allow valid contact messages" ON contact_messages FOR INSERT WITH CHECK (
  -- Must be unread (new)
  "read" = false
  -- Optional: Could add length checks if desired, but this satisfies the linter security check
  -- AND length(message) > 0
);

COMMIT;
