import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { stripeAdapter } from '@/lib/payments/adapters/stripe-adapter'

/**
 * Stripe Webhook Handler
 * POST /api/webhooks/stripe
 * 
 * Listens for:
 * - payment_intent.succeeded → Mark order as paid
 * - payment_intent.payment_failed → Mark order as failed
 * - account.updated → Update vendor connection status
 * - charge.refunded → Process refund
 */
export async function POST(request: NextRequest) {
    const supabase = await createClient()


    try {
        const body = await request.text()
        const signature = request.headers.get('stripe-signature')

        if (!signature) {
            return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
        }

        // Verify and parse webhook
        const event = await stripeAdapter.handleWebhook(body, signature)

        // Log webhook event
        await supabase.from('webhook_events').insert({
            provider: 'stripe',
            event_type: event.type,
            event_id: (event as any).id || null,
            payload: event,
            processed: false
        })

        // Handle different event types
        switch (event.type) {
            case 'payment.succeeded': {
                const { orderId, storeId, paymentIntentId, chargeId, amount, applicationFeeAmount } = event as any

                // 1. Update order status
                await supabase
                    .from('orders')
                    .update({ status: 'paid', payment_status: 'completed' })
                    .eq('id', orderId)

                // 2. Log transaction
                await supabase.from('transactions').insert({
                    order_id: orderId,
                    store_id: storeId,
                    buyer_id: (await supabase.from('orders').select('user_id').eq('id', orderId).single()).data?.user_id,
                    provider: 'stripe',
                    payment_intent_id: paymentIntentId,
                    charge_id: chargeId,
                    amount,
                    marketplace_fee: applicationFeeAmount,
                    vendor_payout: amount - applicationFeeAmount,
                    status: 'completed'
                })

                // 3. Mark webhook as processed
                await supabase
                    .from('webhook_events')
                    .update({ processed: true, processed_at: new Date().toISOString() })
                    .eq('event_id', paymentIntentId)

                console.log(`✅ Payment succeeded for order ${orderId}`)
                break
            }

            case 'payment.failed': {
                const { orderId, error } = event as any

                await supabase
                    .from('orders')
                    .update({ status: 'failed', payment_status: 'failed' })
                    .eq('id', orderId)

                console.error(`❌ Payment failed for order ${orderId}:`, error)
                break
            }

            case 'account.updated': {
                const { storeId, accountId, chargesEnabled, payoutsEnabled } = event as any

                // Update vendor payment account status
                await supabase
                    .from('vendor_payment_accounts')
                    .update({
                        is_active: chargesEnabled && payoutsEnabled,
                        metadata: { charges_enabled: chargesEnabled, payouts_enabled: payoutsEnabled }
                    })
                    .eq('store_id', storeId)
                    .eq('provider', 'stripe')

                console.log(`📝 Stripe account updated for store ${storeId}`)
                break
            }

            case 'charge.refunded': {
                const { chargeId, refundAmount } = event as any

                // Find transaction and mark as refunded
                await supabase
                    .from('transactions')
                    .update({ status: 'refunded' })
                    .eq('charge_id', chargeId)

                console.log(`💸 Refund processed for charge ${chargeId}: $${refundAmount}`)
                break
            }
        }

        return NextResponse.json({ received: true })
    } catch (error: any) {
        console.error('Stripe Webhook Error:', error)
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}
