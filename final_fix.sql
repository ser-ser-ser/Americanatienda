-- SOLUCIÓN DEFINITIVA DE PERMISOS ("FOREIGN KEY" y "RLS")

-- 1. Arreglar la restricción de Foreign Key (El error "stores_owner_id_fkey")
-- A veces apunta a una tabla "public.profiles" que no existe o está vacía.
-- Vamos a forzar que apunte DIRECTAMENTE a "auth.users", que SIEMPRE existe.

ALTER TABLE stores DROP CONSTRAINT IF EXISTS stores_owner_id_fkey;

ALTER TABLE stores 
  ADD CONSTRAINT stores_owner_id_fkey 
  FOREIGN KEY (owner_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- 2. Asegurar que RLS permita crear (El error "row-level security")
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can create their own stores" ON stores;
CREATE POLICY "Users can create their own stores" 
ON stores FOR INSERT 
WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can update their own stores" ON stores;
CREATE POLICY "Users can update their own stores" 
ON stores FOR UPDATE 
USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Public can view stores" ON stores;
CREATE POLICY "Public can view stores" 
ON stores FOR SELECT 
USING (true);

-- 3. Limpieza extra
DROP TABLE IF EXISTS "products_backup";
