-- COPIA Y PEGA ESTO EN EL "SQL EDITOR" DE TU DASHBOARD DE SUPABASE
-- VERSIÓN 3: Permisiva (Para solucionar error de subida)

-- 1. Asegurar bucket
insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do nothing;

-- 2. Limpiar políticas viejas
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Authenticated Upload" on storage.objects;
drop policy if exists "Admin Update/Delete" on storage.objects;
drop policy if exists "Allow Public Uploads" on storage.objects;

-- 3. Crear Políticas NUEVAS

-- Lectura PARA TODOS
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'site-assets' );

-- Escritura (Upload) PARA CUALQUIER USUARIO LOGUEADO
-- Quitamos la restricción extraña, solo validamos que esté en el bucket correcto
create policy "Authenticated Upload"
on storage.objects for insert
with check (
  bucket_id = 'site-assets'
  and auth.role() = 'authenticated'
);

-- UPDATE/DELETE también para cualquier usuario logueado (por ahora, para probar)
create policy "Authenticated Update"
on storage.objects for update
using ( bucket_id = 'site-assets' and auth.role() = 'authenticated' );

create policy "Authenticated Delete"
on storage.objects for delete
using ( bucket_id = 'site-assets' and auth.role() = 'authenticated' );
