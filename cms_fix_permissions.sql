-- COPIA Y PEGA ESTO EN EL "SQL EDITOR"
-- ELIMINA RESTRICCIONES DE ADMIN PARA LA TABLA DE CONTENIDO (site_content)

-- 1. Eliminar políticas existentes de site_content
drop policy if exists "Allow admin write" on site_content;
drop policy if exists "Allow public read" on site_content;

-- 2. Crear nueva política "Permitir TODO a TODOS (Logueados)"
-- Esto permitirá que guardes cambios sin importar si tu rol de admin está perfectamente configurado o no.
create policy "Allow authenticated write"
on site_content
for all
using ( auth.role() = 'authenticated' )
with check ( auth.role() = 'authenticated' );

-- 3. Restaurar lectura pública
create policy "Allow public read"
on site_content for select
using (true);
