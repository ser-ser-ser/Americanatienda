-- ========================================
-- CREAR USUARIO VENDOR DE PRUEBA
-- ========================================
-- IMPORTANTE: Ejecuta esto en Supabase SQL Editor

-- 1. Primero, crea el usuario en Auth (hazlo desde Supabase Dashboard → Authentication → Add User)
--    Email: vendor@test.com
--    Password: test123456
--    Confirma el email manualmente en el dashboard

-- 2. Después, ejecuta esto para crear su perfil y tienda:

DO $$
DECLARE
    v_user_id uuid;
    v_store_id uuid;
BEGIN
    -- Buscar el user_id del vendor que acabas de crear
    SELECT id INTO v_user_id 
    FROM auth.users 
    WHERE email = 'vendor@test.com';
    
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'User vendor@test.com not found. Create it first in Auth dashboard.';
    END IF;
    
    -- Crear perfil como vendor
    INSERT INTO public.profiles (id, email, role, full_name)
    VALUES (v_user_id, 'vendor@test.com', 'vendor', 'Test Vendor')
    ON CONFLICT (id) DO UPDATE SET role = 'vendor';
    
    -- Crear tienda
    INSERT INTO public.stores (
        owner_id,
        name,
        slug,
        description,
        status
    )
    VALUES (
        v_user_id,
        'Tienda de Prueba Stripe',
        'tienda-stripe-test',
        'Tienda para probar integración de pagos',
        'active'
    )
    RETURNING id INTO v_store_id;
    
    RAISE NOTICE 'Vendor created! Store ID: %', v_store_id;
    
    -- Mostrar info para login
    RAISE NOTICE 'Login credentials:';
    RAISE NOTICE 'Email: vendor@test.com';
    RAISE NOTICE 'Password: test123456';
    RAISE NOTICE 'Store ID: %', v_store_id;
END $$;
