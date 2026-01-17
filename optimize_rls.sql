BEGIN;

-- ============================================================
-- 1. PROFILES
-- Remove duplicates and optimize performance
-- ============================================================
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON profiles;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (id = (select auth.uid()));


-- ============================================================
-- 2. PRODUCTS
-- Remove duplicates and optimize performance
-- ============================================================
DROP POLICY IF EXISTS "Permitir lectura pública de productos" ON products;
DROP POLICY IF EXISTS "Products viewable by everyone" ON products;
DROP POLICY IF EXISTS "Public view products" ON products;
DROP POLICY IF EXISTS "Store owners can manage products" ON products;
DROP POLICY IF EXISTS "Owners manage products" ON products;

CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);

CREATE POLICY "Store Owners Manage Products" ON products FOR ALL USING (
  exists (
    select 1 from stores 
    where stores.id = products.store_id 
    and stores.owner_id = (select auth.uid())
  )
);


-- ============================================================
-- 3. STORES
-- Remove duplicates and optimize performance
-- ============================================================
DROP POLICY IF EXISTS "Public can view stores" ON stores;
DROP POLICY IF EXISTS "Stores are viewable by everyone." ON stores;
DROP POLICY IF EXISTS "Public Read Stores" ON stores;

CREATE POLICY "Public Read Stores" ON stores FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create their own stores" ON stores;
CREATE POLICY "Users can create their own stores" ON stores FOR INSERT WITH CHECK (owner_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update their own stores" ON stores;
CREATE POLICY "Users can update their own stores" ON stores FOR UPDATE USING (owner_id = (select auth.uid()));

DROP POLICY IF EXISTS "Admins and Owners can update stores." ON stores; -- Remove problematic one with potential perf issue if not optimized
-- Re-implement admin override if needed, but "Users can update their own stores" covers owners. 
-- If admins need access, we can add a specific admin policy, optimized.
CREATE POLICY "Admins can update stores" ON stores FOR UPDATE USING (
  exists (
    select 1 from profiles
    where profiles.id = (select auth.uid()) 
    and profiles.role = 'admin'
  )
);


-- ============================================================
-- 4. CATEGORIES
-- Remove duplicates
-- ============================================================
DROP POLICY IF EXISTS "Enable read access for all users" ON categories;
DROP POLICY IF EXISTS "Permitir lectura pública de categorías" ON categories;
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;

CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);


-- ============================================================
-- 5. NOTIFICATIONS
-- Remove duplicates and optimize
-- ============================================================
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications (mark read)" ON notifications;
DROP POLICY IF EXISTS "Users view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users update own notifications" ON notifications;

CREATE POLICY "Users view own notifications" ON notifications FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "Users update own notifications" ON notifications FOR UPDATE USING (user_id = (select auth.uid()));


-- ============================================================
-- 6. ORDERS & ORDER ITEMS
-- Optimize auth calls
-- ============================================================
-- Orders
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (user_id = (select auth.uid()));

-- Order Items
DROP POLICY IF EXISTS "Users can view their own order items" ON order_items;
CREATE POLICY "Users can view their own order items" ON order_items FOR SELECT USING (
  exists (
    select 1 from orders
    where orders.id = order_items.order_id
    and orders.user_id = (select auth.uid())
  )
);


-- ============================================================
-- 7. POSTS
-- Remove duplicates
-- ============================================================
DROP POLICY IF EXISTS "Enable read access for all users" ON posts;
DROP POLICY IF EXISTS "Public Read Published" ON posts;
DROP POLICY IF EXISTS "Auth Read All" ON posts;

CREATE POLICY "Public Read Posts" ON posts FOR SELECT USING (true);


-- ============================================================
-- 8. SHIPMENTS
-- Remove duplicates and optimize
-- ============================================================
DROP POLICY IF EXISTS "Buyers can view shipments for their orders" ON shipments;
DROP POLICY IF EXISTS "Buyers view own shipments" ON shipments;
DROP POLICY IF EXISTS "Vendors can view their shipments" ON shipments;
DROP POLICY IF EXISTS "Vendors view own shipments" ON shipments;

-- Consolidated Viewer Policy
CREATE POLICY "Users view relevant shipments" ON shipments FOR SELECT USING (
  -- As Buyer
  exists (
    select 1 from orders
    where orders.id = shipments.order_id
    and orders.user_id = (select auth.uid())
  )
  OR
  -- As Vendor
  exists (
    select 1 from stores
    where stores.id = shipments.store_id
    and stores.owner_id = (select auth.uid())
  )
);

COMMIT;
