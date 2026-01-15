import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import Stripe from 'stripe'

// Initialize Stripe
// Initialize Stripe lazily
const getStripe = () => {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY is missing')
    }
    return new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-12-15.clover',
    })
}

export async function POST(req: Request) {
    try {
        const stripe = getStripe()
        const body = await req.json()
        const { items, customer_details } = body

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
        }

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'You must be logged in to checkout' }, { status: 401 })
        }

        // 1. Group items by Store ID to ensure Single Store Checkout
        const storeId = items[0].product.store_id
        const isSingleStore = items.every((item: any) => item.product.store_id === storeId)

        if (!isSingleStore) {
            return NextResponse.json({ error: 'Multi-store checkout is not supported yet. Please purchase from one store at a time.' }, { status: 400 })
        }

        // 2. Fetch Store Details (mainly for Stripe Account ID)
        const { data: store } = await supabase.from('stores').select('*').eq('id', storeId).single()

        if (!store) {
            return NextResponse.json({ error: 'Store not found' }, { status: 404 })
        }

        // 3. Construct Line Items
        const line_items = items.map((item: any) => ({
            price_data: {
                currency: 'usd', // Assuming USD for now
                product_data: {
                    name: item.product.name,
                    images: item.product.images ? [item.product.images[0]] : [],
                    metadata: {
                        product_id: item.product.id
                    }
                },
                unit_amount: Math.round(item.product.price * 100), // Cents
            },
            quantity: item.quantity,
        }))

        // 4. Calculate Application Fee (10%)
        // Total amount in cents
        const totalAmount = line_items.reduce((acc: number, item: any) => acc + (item.price_data.unit_amount * item.quantity), 0)
        const appFeeAmount = Math.round(totalAmount * 0.10)

        // 5. Create Checkout Session Configuration
        const sessionConfig: Stripe.Checkout.SessionCreateParams = {
            mode: 'payment',
            line_items,
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout`,
            customer_email: customer_details?.email,
            metadata: {
                store_id: storeId,
                customer_name: customer_details?.name,
                shipping_address: customer_details?.address,
                user_id: user.id
            }
        }

        // 6. Handle Stripe Connect (Payment Split)
        if (store.stripe_account_id) {
            sessionConfig.payment_intent_data = {
                application_fee_amount: appFeeAmount,
                transfer_data: {
                    destination: store.stripe_account_id,
                },
            }
        } else {
            // Fallback: If store is NOT connected, Platform keeps funds (or we block). 
            // For safety/demo: We will allow it but funds stay in Platform, and we add a metadata flag.
            // Ideally we should block regular vendors, but for "Admin" stores (Red Room) they might be platform owned as well.
            sessionConfig.metadata!.payout_status = 'held_by_platform'
        }

        const session = await stripe.checkout.sessions.create(sessionConfig)

        return NextResponse.json({ url: session.url })

    } catch (error: any) {
        console.error('Checkout API Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
