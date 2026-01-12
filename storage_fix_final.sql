-- COPIA Y PEGA ESTO EN EL "SQL EDITOR" DE TU DASHBOARD DE SUPABASE
-- VERSIÓN FINAL: DESACTIVAR RLS PARA STORAGE (SOLUCIÓN DEFINITIVA)

-- 1. Asegurar bucket (público)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-assets', 'site-assets', true, 52428800, null) -- 50MB Limit
on conflict (id) do update set public = true;

-- 2. DESACTIVAR LA SEGURIDAD EN LA TABLA DE OBJETOS
-- Esto permitirá que CUALQUIERA suba archivos. 
-- Úsalo para desbloquear tu trabajo. Luego lo aseguraremos.
alter table storage.objects disable row level security;

-- (Opcional) Si Supabase te obliga a tener RLS, usaremos esta política "mágica":
create policy "Allow Everything"
on storage.objects for all
using (true)
with check (true);

-- 3. Confirmar que el usuario Admin tiene permisos
grant all on table storage.objects to postgres, anon, authenticated, service_role;
