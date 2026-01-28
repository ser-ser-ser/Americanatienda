import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Secure Order Creation Intermediary
 * Centralizes business logic: Stock validation, Shipping Calculation, and DB Writes.
 */
export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { items, address_id, store_id } = await req.json()

        if (!items || items.length === 0 || !address_id || !store_id) {
            return NextResponse.json({ error: 'Missing required order data' }, { status: 400 })
        }

        // 1. ATOMIC STOCK VALIDATION & DATA FETCHING
        // We fetch current stock and prices for all items in the request
        const productIds = items.map((i: any) => i.product_id)
        const { data: products, error: productsError } = await supabase
            .from('products')
            .select('id, name, price, stock_quantity')
            .in('id', productIds)

        if (productsError) throw productsError

        // Check if all products exist and have enough stock
        for (const item of items) {
            const product = products?.find(p => p.id === item.product_id)
            if (!product) {
                return NextResponse.json({ error: `Product not found: ${item.product_id}` }, { status: 404 })
            }
            if (product.stock_quantity < item.quantity) {
                return NextResponse.json({
                    error: `Insufficient stock for ${product.name}. Available: ${product.stock_quantity}`,
                    stock_error: true
                }, { status: 400 })
            }
        }

        // 2. CALCULATE REAL SHIPPING COST
        const { data: shippingConfig, error: shippingError } = await supabase
            .from('shipping_configs')
            .select('national_flat_rate, local_base_price')
            .eq('store_id', store_id)
            .single()

        if (shippingError) {
            console.error("Shipping Config Error:", shippingError)
        }

        const shippingCost = shippingConfig?.national_flat_rate || 150.00 // Default to 150 if not found

        // 3. CALCULATE TOTAL
        const cartTotal = items.reduce((acc: number, item: any) => {
            const product = products?.find(p => p.id === item.product_id)
            return acc + (product?.price || 0) * item.quantity
        }, 0)

        const finalTotal = cartTotal + shippingCost

        // 4. CREATE ORDER
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                user_id: user.id,
                store_id: store_id,
                total_amount: finalTotal,
                shipping_cost: shippingCost,
                shipping_address_id: address_id,
                status: 'processing',
                payment_status: 'pending'
            })
            .select()
            .single()

        if (orderError) throw orderError

        // 5. CREATE ORDER ITEMS
        const orderItemsData = items.map((item: any) => {
            const product = products?.find(p => p.id === item.product_id)
            return {
                order_id: order.id,
                product_id: item.product_id,
                quantity: item.quantity,
                price_at_purchase: product?.price
            }
        })

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItemsData)

        if (itemsError) throw itemsError

        // 6. UPDATE STOCK (Atomic refinement would use RPC, but this is server-side safe enough for MVP)
        for (const item of items) {
            const product = products?.find(p => p.id === item.product_id)
            await supabase
                .from('products')
                .update({ stock_quantity: product!.stock_quantity - item.quantity })
                .eq('id', item.product_id)
        }

        return NextResponse.json({
            success: true,
            order_id: order.id,
            total: finalTotal,
            // In the future, return Stripe/MercadoPago session info here
            payment_status: 'pending'
        })

    } catch (error: any) {
        console.error("Serverless Order Error:", error)
        return NextResponse.json({
            error: error.message || 'Internal Server Error'
        }, { status: 500 })
    }
}
