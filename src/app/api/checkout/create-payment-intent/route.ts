import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { stripeAdapter } from '@/lib/payments/adapters/stripe-adapter'

/**
 * POST /api/checkout/create-payment-intent
 * Creates a Stripe Payment Intent for the order
 * 
 * Body: {
 *   orderId: string,
 *   amount: number,
 *   storeId: string
 * }
 */
export async function POST(request: NextRequest) {
    const supabase = await createClient()


    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { orderId, amount, storeId, items } = body

        if (!orderId || !amount || !storeId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // 1. Get vendor's Stripe Connect account
        const { data: vendorAccount, error: accountError } = await supabase
            .from('vendor_payment_accounts')
            .select('account_id, is_active')
            .eq('store_id', storeId)
            .eq('provider', 'stripe')
            .eq('is_active', true)
            .single()

        if (accountError || !vendorAccount) {
            // Fallback: If vendor doesn't have Stripe, use direct charge (marketplace as merchant of record)
            console.warn(`Store ${storeId} doesn't have Stripe Connect. Using direct charge.`)

            // For now, return error - we'll implement direct charge later
            return NextResponse.json({
                error: 'Vendor has not connected Stripe account. Please contact support.',
                code: 'VENDOR_PAYMENT_NOT_CONFIGURED'
            }, { status: 400 })
        }

        // 2. Calculate marketplace commission
        // TODO: Get category from first product in items to calculate dynamic rate
        const { data: commissionData } = await supabase
            .from('commission_config')
            .select('commission_rate')
            .is('category_id', null)
            .is('store_id', null)
            .eq('is_active', true)
            .single()

        const commissionRate = commissionData?.commission_rate || 0.10 // Default 10%

        // 3. Create Stripe Payment Intent
        const paymentIntent = await stripeAdapter.createPaymentIntent({
            amount,
            currency: 'mxn',
            storeId,
            orderId,
            customerId: user.id,
            connectedAccountId: vendorAccount.account_id,
            commissionRate,
            metadata: {
                buyer_email: user.email,
                items: JSON.stringify(items)
            }
        })


        // 4. Update order with payment intent ID
        await supabase
            .from('orders')
            .update({
                payment_status: 'pending',
                payment_intent_id: paymentIntent.paymentIntentId
            })
            .eq('id', orderId)

        return NextResponse.json({
            clientSecret: paymentIntent.clientSecret,
            paymentIntentId: paymentIntent.paymentIntentId
        })

    } catch (error: any) {
        console.error('Checkout Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
