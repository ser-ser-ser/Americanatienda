BEGIN;

-- ============================================================
-- 1. ADD MISSING INDICES (Performance)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_categories_store_id ON categories(store_id);
CREATE INDEX IF NOT EXISTS idx_conv_participants_user_id ON conversation_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_by ON conversations(created_by);
CREATE INDEX IF NOT EXISTS idx_conversations_product_id ON conversations(product_id);
CREATE INDEX IF NOT EXISTS idx_conversations_store_id ON conversations(store_id);
CREATE INDEX IF NOT EXISTS idx_inventory_logs_product_id ON inventory_logs(product_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_store_category_id ON products(store_category_id);
CREATE INDEX IF NOT EXISTS idx_products_store_id ON products(store_id);
CREATE INDEX IF NOT EXISTS idx_shipments_store_id ON shipments(store_id);
CREATE INDEX IF NOT EXISTS idx_stores_owner_id ON stores(owner_id);
CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON user_addresses(user_id);


-- ============================================================
-- 2. OPTIMIZE ORDER POLICIES (Admin & Sellers)
-- ============================================================
DROP POLICY IF EXISTS "Admins can manage all orders" ON orders;
DROP POLICY IF EXISTS "Sellers can view orders for their own store" ON orders;

-- Admin Policy
CREATE POLICY "Admins can manage all orders" ON orders FOR ALL USING (
  exists (
    select 1 from profiles
    where profiles.id = (select auth.uid())
    and profiles.role = 'admin'
  )
);

-- Seller Policy
CREATE POLICY "Sellers can view store orders" ON orders FOR SELECT USING (
  exists (
    select 1 from order_items
    join products on products.id = order_items.product_id
    join stores on stores.id = products.store_id
    where order_items.order_id = orders.id
    and stores.owner_id = (select auth.uid())
  )
);


-- ============================================================
-- 3. OPTIMIZE ORDER ITEMS POLICIES
-- ============================================================
DROP POLICY IF EXISTS "Admins can manage all order items" ON order_items;

-- Admin Policy
CREATE POLICY "Admins can manage all order items" ON order_items FOR ALL USING (
  exists (
    select 1 from profiles
    where profiles.id = (select auth.uid())
    and profiles.role = 'admin'
  )
);


-- ============================================================
-- 4. OPTIMIZE STORE CATEGORIES POLICIES
-- ============================================================
DROP POLICY IF EXISTS "Store owners can insert categories" ON store_categories;
DROP POLICY IF EXISTS "Store owners can update categories" ON store_categories;
DROP POLICY IF EXISTS "Store owners can delete categories" ON store_categories;
DROP POLICY IF EXISTS "Owners manage categories" ON store_categories;

-- Unified Owner Policy
CREATE POLICY "Store owners manage categories" ON store_categories FOR ALL USING (
  exists (
    select 1 from stores
    where stores.id = store_categories.store_id
    and stores.owner_id = (select auth.uid())
  )
);

-- Public Read Policy (if not exists or verify)
DROP POLICY IF EXISTS "Public categories are viewable by everyone" ON store_categories;
DROP POLICY IF EXISTS "Public view categories" ON store_categories;
CREATE POLICY "Public read store categories" ON store_categories FOR SELECT USING (true);


-- ============================================================
-- 5. OPTIMIZE INVENTORY LOGS
-- ============================================================
DROP POLICY IF EXISTS "Admins can view inventory logs" ON inventory_logs;

CREATE POLICY "Admins view inventory logs" ON inventory_logs FOR SELECT USING (
  exists (
    select 1 from profiles
    where profiles.id = (select auth.uid())
    and profiles.role = 'admin'
  )
);


-- ============================================================
-- 6. OPTIMIZE REMAINING ADMIN WRITE POLICIES
-- ============================================================
-- Categories
DROP POLICY IF EXISTS "Enable write access for admins" ON categories;
CREATE POLICY "Admins manage categories" ON categories FOR ALL USING (
  exists (
    select 1 from profiles
    where profiles.id = (select auth.uid())
    and profiles.role = 'admin'
  )
);

-- Posts
DROP POLICY IF EXISTS "Enable write access for admins" ON posts;
CREATE POLICY "Admins manage posts" ON posts FOR ALL USING (
  exists (
    select 1 from profiles
    where profiles.id = (select auth.uid())
    and profiles.role = 'admin'
  )
);


-- ============================================================
-- 7. CLEANUP REMAINING DUPLICATES
-- ============================================================
-- User Addresses (ensure only one select policy)
DROP POLICY IF EXISTS "Users view own addresses" ON user_addresses; 
-- (I created 'Users can view own addresses' previously? Or standard names. 
-- The warning said "Users view own addresses" duplicates. 
-- I'll ensure the one I want exists)
DROP POLICY IF EXISTS "Users view own addresses" ON user_addresses;
CREATE POLICY "Users view own addresses" ON user_addresses FOR SELECT USING (user_id = (select auth.uid()));

COMMIT;
