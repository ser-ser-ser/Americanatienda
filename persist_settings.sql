BEGIN;

-- Add privacy_settings column
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS privacy_settings JSONB DEFAULT '{"public_profile": true, "show_city": false}'::jsonb;

-- Add notification_preferences column
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"order_updates": true, "marketing_emails": false}'::jsonb;

-- Comment on columns for clarity
COMMENT ON COLUMN public.profiles.privacy_settings IS 'Stores user privacy toggles like public profile visibility.';
COMMENT ON COLUMN public.profiles.notification_preferences IS 'Stores user email/notification preferences.';

COMMIT;
