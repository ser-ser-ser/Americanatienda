-- COPIA Y PEGA ESTO EN EL "SQL EDITOR"
-- VERSIÓN SEGURA (Solo Políticas)

-- 1. Intentar crear bucket si no existe
insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do nothing;

-- 2. Eliminar políticas anteriores (si existen, para limpiar)
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Authenticated Upload" on storage.objects;
drop policy if exists "Admin Update/Delete" on storage.objects;
drop policy if exists "Allow Everything" on storage.objects;
-- Eliminamos también versiones con nombres genéricos que a veces existen
drop policy if exists "Public Access 1" on storage.objects;
drop policy if exists "Authenticated Upload 1" on storage.objects;

-- 3. Crear UNA SOLA política maestra
-- "Cualquiera puede hacer TODO en el bucket site-assets"
create policy "Universal Access"
on storage.objects for all
using ( bucket_id = 'site-assets' )
with check ( bucket_id = 'site-assets' );
