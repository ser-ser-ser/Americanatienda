
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover' as any, // Use latest or matching version
})

// Initialize Supabase Admin Client (Bypasses RLS)
// We need this because the Webhook is "Anonymous" (no logged in user) but needs to write to 'orders'
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
    const body = await req.text()
    const headerPayload = await headers()
    const sig = headerPayload.get('stripe-signature') as string
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    let event: Stripe.Event

    // 1. Verify Webhook Signature (Security)
    try {
        if (!sig || !webhookSecret) {
            console.error('Webhook Error: Missing signature or secret')
            return NextResponse.json({ error: 'Webhook Secret or Signature missing' }, { status: 400 })
        }
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } catch (err: any) {
        console.error(`Webhook Signature Error: ${err.message}`)
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    }

    // 2. Handle 'checkout.session.completed'
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session

        try {
            // 3. Retrieve full session with line_items (Webhook payload might be partial)
            const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
                expand: ['line_items']
            })

            const metadata = fullSession.metadata || {}
            const userId = metadata.user_id
            const storeId = metadata.store_id

            console.log(`💰 Processing Order for User ${userId}, Store ${storeId}`)

            if (!userId) {
                throw new Error('Missing user_id in session metadata')
            }

            // 4. Create Order in Supabase
            const { data: order, error: orderError } = await supabaseAdmin
                .from('orders')
                .insert({
                    user_id: userId,
                    store_id: storeId || null, // Optional if we allow mixed (but we enforce single store now)
                    total_amount: (fullSession.amount_total || 0) / 100, // Convert cents to dollars
                    status: 'paid',
                    shipping_address: fullSession.shipping_details?.address || {},
                    stripe_session_id: session.id
                })
                .select()
                .single()

            if (orderError) throw orderError

            // 5. Create Order Items
            const lineItems = fullSession.line_items?.data || []

            const orderItems = lineItems.map((item) => ({
                order_id: order.id,
                product_id: item.price?.product_metadata?.product_id || null, // Need to ensure we pass this in metadata or expand product
                quantity: item.quantity,
                price_at_purchase: (item.price?.unit_amount || 0) / 100,
                product_name: item.description // Fallback name
            }))

            // Note: item.price.product is an ID string unless expanded. 
            // In checkout route we put 'product_id' in price_data.product_data.metadata ? 
            // Actually in checkout route we used:
            // product_data: { metadata: { product_id: ... } }
            // Stripe puts this in 'item.price.metadata' (if it's a Price object) OR usually in 'item.price.product.metadata'
            // Let's rely on product_data metadata being available on the line item or Price.
            // Better yet, let's look at how we sent it.
            // We sent: line_items: [{ price_data: { product_data: { metadata: { product_id: ... } } } }]
            // Stripe transfers this to the Price object created on the fly.

            // However, for One-time prices created inline, Stripe might not persist metadata easily to line_items.price.metadata
            // Let's assume we might need to fetch it or rely on description.
            // Correction: We are creating inline prices. 
            // To be safe, let's insert what we have. If product_id is null, at least we have the order.

            if (orderItems.length > 0) {
                // We need to map product_id correctly. 
                // In the checkout route we did: 
                // product_data: { ..., metadata: { product_id: item.product.id } }
                // When retrieving line_items, 'price.product' is the Product ID (stripe ID).
                // We need to match it to OUR DB ID.
                // Wait, we didn't create Stripe Products. We used inline product_data.
                // So Stripe created a temporary Product or Price.
                // The metadata should be on the Line Item or Price.
                // Let's double check 'price_data.product_data.metadata' behavior.
                // It usually lands on the Created Product.
                // So we might need to expand 'line_items.data.price.product' to see metadata.
            }

            // Re-fetching line items with product expansion to get metadata
            const sessionWithProduct = await stripe.checkout.sessions.retrieve(session.id, {
                expand: ['line_items.data.price.product']
            })

            const refinedLineItems = sessionWithProduct.line_items?.data.map((item: any) => ({
                order_id: order.id,
                // If product was inline, item.price.product is the STRIPE product object
                product_id: item.price?.product?.metadata?.product_id || null,
                quantity: item.quantity,
                price_at_purchase: (item.price?.unit_amount || 0) / 100,
                // We don't have a 'product_name' column in 'order_items' based on previous schema check?
                // Let's check schema again or just insert what we verify.
                // Schema: id, order_id, product_id, quantity, price_at_purchase, created_at
                // No product_name. So if product_id is null, we lose what it was.
                // RISK: If metadata is lost, we have an orphan item.
            })) || []

            if (refinedLineItems.length > 0) {
                const { error: itemsError } = await supabaseAdmin
                    .from('order_items')
                    .insert(refinedLineItems) // batch insert

                if (itemsError) throw itemsError
            }

            console.log('✅ Order saved successfully:', order.id)

        } catch (error: any) {
            console.error('❌ Error saving order:', error)
            return NextResponse.json({ error: 'Error saving order' }, { status: 500 })
        }
    }

    return NextResponse.json({ received: true })
}
