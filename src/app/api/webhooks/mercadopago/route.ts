import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { mercadoPagoAdapter } from '@/lib/payments/adapters/mercadopago-adapter'

/**
 * POST /api/webhooks/mercadopago
 * IPN (Instant Payment Notification) from Mercado Pago
 */
export async function POST(request: NextRequest) {
    const supabase = await createClient()

    try {
        const { searchParams } = new URL(request.url)
        const topic = searchParams.get('topic')
        const id = searchParams.get('id')

        if (!topic || !id) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
        }

        console.log(`Mercado Pago IPN received: ${topic} - ${id}`)

        // Log webhook event
        await supabase.from('webhook_events').insert({
            provider: 'mercadopago',
            event_type: topic,
            payload: { topic, id },
            processed: false
        })

        // Handle the notification
        const result = await mercadoPagoAdapter.handleIPN(topic, id)

        // Update order status based on payment
        if (result.type === 'payment.notification' && result.approved) {
            await supabase
                .from('orders')
                .update({
                    payment_status: 'completed',
                    status: 'confirmed'
                })
                .eq('id', result.orderId)

            // Log transaction
            await supabase.from('transactions').insert({
                order_id: result.orderId,
                payment_intent_id: result.paymentId,
                amount: result.amount,
                marketplace_fee: result.fee,
                vendor_payout: result.netAmount,
                status: 'completed',
                provider: 'mercadopago'
            })
        }

        // Mark webhook as processed
        await supabase
            .from('webhook_events')
            .update({ processed: true })
            .eq('event_type', topic)
            .eq('payload', { topic, id })

        return NextResponse.json({ received: true })

    } catch (error: any) {
        console.error('Mercado Pago Webhook Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
