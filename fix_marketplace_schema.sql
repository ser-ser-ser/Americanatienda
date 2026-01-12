-- MARTEKPLACE SCHEMA FIX
-- Run this to enable Products and Store Categories for your shops.

-- 1. Create store_categories table (for "Vintage", "Gear", etc. per store)
create table if not exists store_categories (
  id uuid default gen_random_uuid() primary key,
  store_id uuid references stores(id) on delete cascade not null,
  name text not null,
  slug text not null,
  image_url text, -- for categories grid
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (store_id, slug)
);

-- 2. Create products table
create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  store_id uuid references stores(id) on delete cascade not null,
  store_category_id uuid references store_categories(id) on delete set null,
  name text not null,
  slug text not null,
  description text,
  price decimal(10,2) not null default 0.00,
  stock integer default 0,
  images text[] default '{}', -- Array of image URLs
  is_active boolean default true, -- To hide/show products
  is_featured boolean default false, -- for "Marketplace Favorites"
  sales_count integer default 0,
  view_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Security Policies (RLS)

-- Store Categories
alter table store_categories enable row level security;

-- Everyone can view categories
create policy "Public view categories" on store_categories for select using (true);

-- Only store owner can manage categories
create policy "Owners manage categories" on store_categories 
  for all 
  using (
    exists (select 1 from stores where id = store_categories.store_id and owner_id = auth.uid())
  );

-- Products
alter table products enable row level security;

-- Everyone can view products
create policy "Public view products" on products for select using (true);

-- Only store owner can manage products
create policy "Owners manage products" on products 
  for all 
  using (
    exists (select 1 from stores where id = products.store_id and owner_id = auth.uid())
  );

-- 4. Indicies for performance
create index if not exists idx_products_store on products(store_id);
create index if not exists idx_products_category on products(store_category_id);
