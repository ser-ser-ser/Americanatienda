-- ========================================
-- MIGRATION: Agregar columnas de Stripe a orders
-- ========================================

-- 1. Agregar columnas para integración con Stripe
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
ADD COLUMN IF NOT EXISTS payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'stripe' CHECK (payment_method IN ('stripe', 'mercadopago', 'manual', 'crypto'));

-- 2. Crear índices para performance
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_intent_id ON public.orders(payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_orders_store_id ON public.orders(store_id);

-- 3. Actualizar el trigger de notificaciones para considerar store_id
DROP TRIGGER IF EXISTS trg_new_order_notification ON public.orders;

CREATE OR REPLACE FUNCTION public.notify_on_new_order()
RETURNS TRIGGER AS $$
DECLARE
    v_store_owner UUID;
BEGIN
    -- Get store owner to notify them (solo si store_id existe)
    IF NEW.store_id IS NOT NULL THEN
        SELECT owner_id INTO v_store_owner FROM public.stores WHERE id = NEW.store_id;
        
        IF v_store_owner IS NOT NULL THEN
            INSERT INTO public.notifications (user_id, type, title, message, link)
            VALUES (v_store_owner, 'order', 'New Order', 'You have received a new order.', '/dashboard/vendor/orders');
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_new_order_notification
AFTER INSERT ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.notify_on_new_order();

-- 4. Ver las órdenes huérfanas (sin store_id)
SELECT 
    o.id,
    o.user_id,
    o.total_amount,
    o.status,
    o.created_at,
    oi.product_id,
    p.name as product_name,
    p.store_id as product_store_id
FROM public.orders o
LEFT JOIN public.order_items oi ON o.id = oi.order_id
LEFT JOIN public.products p ON oi.product_id = p.id
WHERE o.store_id IS NULL
ORDER BY o.created_at DESC;

-- 5. RECUPERAR store_id de las órdenes existentes (basado en los productos)
UPDATE public.orders o
SET store_id = (
    SELECT DISTINCT p.store_id
    FROM public.order_items oi
    JOIN public.products p ON oi.product_id = p.id
    WHERE oi.order_id = o.id
    LIMIT 1
)
WHERE o.store_id IS NULL
AND EXISTS (
    SELECT 1 FROM public.order_items oi WHERE oi.order_id = o.id
);
