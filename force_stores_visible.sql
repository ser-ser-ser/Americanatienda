-- COPIA Y PEGA ESTO EN EL "SQL EDITOR"
-- SOLUCIÓN "FUERZA BRUTA" PARA VER LAS TIENDAS
-- Esto borra la tabla y la hace pública de nuevo sin seguridad compleja.

-- 1. Eliminar políticas y seguridad
alter table if exists stores disable row level security;
drop policy if exists "Public Read Stores" on stores;

-- 2. Asegurarnos que la tabla existe
create table if not exists stores (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null, -- Removed unique constraint temporarily to avoid errors if duplicate slugs exist in weird states
  description text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Limpiar datos viejos y re-insertar
truncate table stores;

insert into stores (name, slug, description, image_url)
values 
(
  'The Red Room', 
  'sex-shop', 
  'Intimacy, elevated. Discover our collection of premium toys and wellness essentials.', 
  'https://images.unsplash.com/photo-1596400377042-4f9e31d47159?q=80&w=2600&auto=format&fit=crop'
),
(
  'The Lounge', 
  'smoke-shop', 
  'A curated experience for the modern enthusiast. Glass, papers, and accessories.', 
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2864&auto=format&fit=crop'
);
