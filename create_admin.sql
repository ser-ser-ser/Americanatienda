-- 0. Asegurar que las extensiones necesarias existen
create extension if not exists pgcrypto;

-- 1. Crear usuario Admin de forma segura (Verificando si existe primero)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@americana.com') THEN
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            recovery_sent_at,
            last_sign_in_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'admin@americana.com',
            crypt('admin123', gen_salt('bf')),
            now(),
            now(),
            now(),
            '{"provider":"email","providers":["email"]}',
            '{"full_name":"Americana Admin","role":"admin"}',
            now(),
            now(),
            '',
            '',
            '',
            ''
        );
    ELSE
        -- Opcional: Si ya existe, nos aseguramos que tenga el rol admin
        UPDATE auth.users 
        SET raw_user_meta_data = jsonb_set(raw_user_meta_data, '{role}', '"admin"') 
        WHERE email = 'admin@americana.com';
    END IF;
END $$;
