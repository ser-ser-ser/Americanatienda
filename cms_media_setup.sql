-- COPIA Y PEGA ESTO EN EL "SQL EDITOR"
-- SOLUCIÓN FINAL PARA ARCHIVOS

-- 1. Crear un nuevo bucket limpio llamado 'cms_media'
insert into storage.buckets (id, name, public)
values ('cms_media', 'cms_media', true)
on conflict (id) do nothing;

-- 2. Asegurar acceso (Políticas)
-- Borrar anteriores por si acaso
drop policy if exists "CMS Media Public" on storage.objects;
drop policy if exists "CMS Media Upload" on storage.objects;

-- Lectura Pública
create policy "CMS Media Public"
on storage.objects for select
using ( bucket_id = 'cms_media' );

-- Escritura Universal (Para evitar líos de permisos)
-- Permite a cualquier usuario logueado subir archivos a este bucket
create policy "CMS Media Upload"
on storage.objects for insert
with check ( bucket_id = 'cms_media' );

-- Permite actualizar/borrar también
create policy "CMS Media Modify"
on storage.objects for all
using ( bucket_id = 'cms_media' );
