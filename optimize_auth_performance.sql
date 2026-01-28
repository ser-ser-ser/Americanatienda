-- Optimize Auth Performance by syncing role and store_status to JWT (app_metadata)
-- This avoids extra database lookups in middleware.

-- 1. Sync Role from Profiles to Auth Users
CREATE OR REPLACE FUNCTION public.sync_user_role()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the user's app_metadata with the new role
  UPDATE auth.users
  SET raw_app_meta_data =
    COALESCE(raw_app_meta_data, '{}'::jsonb) ||
    jsonb_build_object('role', NEW.role)
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_role_change ON public.profiles;
CREATE TRIGGER on_profile_role_change
  AFTER INSERT OR UPDATE OF role ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.sync_user_role();

-- 2. Sync Store Status from Stores to Auth Users
CREATE OR REPLACE FUNCTION public.sync_store_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update if owner_id is present
  IF NEW.owner_id IS NOT NULL THEN
    UPDATE auth.users
    SET raw_app_meta_data =
      COALESCE(raw_app_meta_data, '{}'::jsonb) ||
      jsonb_build_object('store_status', NEW.status)
    WHERE id = NEW.owner_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_store_status_change ON public.stores;
CREATE TRIGGER on_store_status_change
  AFTER INSERT OR UPDATE OF status, owner_id ON public.stores
  FOR EACH ROW EXECUTE FUNCTION public.sync_store_status();

-- 3. Backfill Existing Data
-- This block ensures existing users get the metadata updates immediately.

DO $$
DECLARE
  profile_record RECORD;
  store_record RECORD;
BEGIN
  -- Backfill Roles
  FOR profile_record IN SELECT id, role FROM public.profiles WHERE role IS NOT NULL LOOP
    UPDATE auth.users
    SET raw_app_meta_data =
      COALESCE(raw_app_meta_data, '{}'::jsonb) ||
      jsonb_build_object('role', profile_record.role)
    WHERE id = profile_record.id;
  END LOOP;

  -- Backfill Store Status
  FOR store_record IN SELECT owner_id, status FROM public.stores WHERE owner_id IS NOT NULL AND status IS NOT NULL LOOP
    UPDATE auth.users
    SET raw_app_meta_data =
      COALESCE(raw_app_meta_data, '{}'::jsonb) ||
      jsonb_build_object('store_status', store_record.status)
    WHERE id = store_record.owner_id;
  END LOOP;
END;
$$;
