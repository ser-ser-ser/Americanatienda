-- Añadir campos para la integración de Instagram y metadatos de OAuth en las tiendas
ALTER TABLE public.stores
ADD COLUMN IF NOT EXISTS instagram_access_token text,
ADD COLUMN IF NOT EXISTS instagram_account_id text,
ADD COLUMN IF NOT EXISTS instagram_username text,
ADD COLUMN IF NOT EXISTS instagram_token_expires_at timestamp with time zone;

-- Índice para búsquedas rápidas si es necesario (opcional)
-- CREATE INDEX IF NOT EXISTS idx_stores_instagram_account ON public.stores(instagram_account_id);

COMMENT ON COLUMN public.stores.instagram_access_token IS 'Long-lived access token para consultar el Graph API de Instagram';
COMMENT ON COLUMN public.stores.instagram_account_id IS 'ID de la cuenta de Instagram conectada devuelto por Meta';
