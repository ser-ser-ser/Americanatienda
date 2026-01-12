-- SOLUCIÓN PARA "TIENDAS FANTASMA" O DUPLICADAS
-- Este script asignará TODAS las tiendas que existen en la base de datos a TU usuario.
-- Así podrás verlas en tu Dashboard (/dashboard/vendor) y borrar las que sobran.

-- 1. Asignar todas las tiendas al usuario que ejecuta este script (Tú)
UPDATE stores
SET owner_id = auth.uid();

-- 2. (Opcional) Borrar tiendas que no tengan nombre (limpieza)
DELETE FROM stores WHERE name IS NULL OR name = '';
