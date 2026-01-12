-- COPIA Y PEGA ESTO EN EL "SQL EDITOR" DE TU DASHBOARD DE SUPABASE

-- 1. Crear la tabla de contenido
create table if not exists site_content (
  key text primary key,
  value text,
  section text,
  type text default 'text',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Habilitar seguridad
alter table site_content enable row level security;

-- 3. Crear políticas de acceso
-- Cualquiera puede leer (para que la página web se vea)
create policy "Allow public read" on site_content for select using (true);

-- Solo los Admins pueden escribir (basado en el rol de usuario)
create policy "Allow admin write" on site_content 
  for all 
  using (
    (select raw_user_meta_data->>'role' from auth.users where id = auth.uid()) = 'admin'
  )
  with check (
    (select raw_user_meta_data->>'role' from auth.users where id = auth.uid()) = 'admin'
  );

-- 4. Datos por defecto (Seed)
insert into site_content (key, value, section, type) values
('home_hero_title', 'AMERICANA', 'hero', 'text'),
('home_hero_subtitle', 'REDEFINE DESIRE', 'hero', 'text'),
('home_hero_video', 'https://assets.mixkit.co/videos/preview/mixkit-abstract-purple-lights-in-dark-background-31448-large.mp4', 'hero', 'video'),
('nav_curations', 'Curations', 'navigation', 'text'),
('nav_editorial', 'Editorial', 'navigation', 'text'),
('nav_club', 'The Club', 'navigation', 'text')
on conflict (key) do nothing;
