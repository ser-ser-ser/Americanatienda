-- LIMPIEZA DE DATOS FANTASMA (Keeping Stores)

-- 1. Borrar todos los productos
DELETE FROM products;

-- 2. Borrar todas las categorías de tienda
DELETE FROM store_categories;

-- 3. Borrar todas las órdenes (si la tabla existe)
DELETE FROM orders;

-- No borramos 'stores' porque esas son las que acabas de importar.
-- Ahora tu dashboard de productos estará limpio y listo para usar.
