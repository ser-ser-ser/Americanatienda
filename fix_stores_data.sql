-- COPIA Y PEGA ESTO EN EL "SQL EDITOR"
-- REPARACIÓN DE TABLA DE TIENDAS (PORTALS)
-- Si no ves nada en la sección de Smoke Shop / Sex Shop, es porque esta tabla está vacía.

create table if not exists stores (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar seguridad pero permitir lectura pública
alter table stores enable row level security;

create policy "Public Read Stores"
on stores for select
using (true);

-- Insertar las 2 tiendas por defecto (Si ya existen, no hace nada)
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
)
on conflict (slug) do nothing;
