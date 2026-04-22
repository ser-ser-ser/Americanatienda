import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-12-18.acacia'
})

export interface StripePaymentIntent {
    amount: number
    currency: string
    storeId: string
    orderId: string
    customerId?: string
    metadata?: Record<string, any>
}

export interface StripeConnectAccount {
    storeId: string
    email: string
    country?: string
}

/**
 * Stripe Payment Adapter for Americana Marketplace
 * Handles Stripe Connect for multi-vendor payments with commission splits
 */
export class StripeAdapter {

    /**
     * Create a Connected Account for a vendor
     * @returns Account ID and onboarding URL
     */
    async createConnectedAccount({ storeId, email, country = 'MX' }: StripeConnectAccount) {
        try {
            // 1. Create Stripe Connect Account (Standard type for full control)
            const account = await stripe.accounts.create({
                type: 'standard',
                country,
                email,
                metadata: {
                    americana_store_id: storeId
                }
            })

            // 2. Create Account Link for onboarding
            const accountLink = await stripe.accountLinks.create({
                account: account.id,
                refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/vendor/settings?refresh=true`,
                return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/vendor/settings?success=true`,
                type: 'account_onboarding'
            })

            return {
                accountId: account.id,
                onboardingUrl: accountLink.url,
                expiresAt: accountLink.expires_at
            }
        } catch (error: any) {
            console.error('Stripe Connect Account Creation Error:', error)
            throw new Error(`Failed to create Stripe account: ${error.message}`)
        }
    }

    /**
     * Create Payment Intent with Application Fee (commission)
     * This is the "Direct Charge" method where marketplace collects payment
     * and transfers to vendor minus commission
     */
    async createPaymentIntent({
        amount,
        currency = 'mxn',
        storeId,
        orderId,
        customerId,
        connectedAccountId,
        commissionRate,
        metadata = {}
    }: StripePaymentIntent & { connectedAccountId: string; commissionRate: number }) {
        try {
            // Calculate marketplace fee (e.g., 10% = 0.10)
            const applicationFeeAmount = Math.floor(amount * 100 * commissionRate)

            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.floor(amount * 100), // Convert to cents
                currency,
                application_fee_amount: applicationFeeAmount,
                transfer_data: {
                    destination: connectedAccountId // Vendor's Stripe account
                },
                metadata: {
                    americana_store_id: storeId,
                    americana_order_id: orderId,
                    ...metadata
                },
                // Optional: attach customer for saved cards
                ...(customerId && { customer: customerId })
            })

            return {
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
                status: paymentIntent.status
            }
        } catch (error: any) {
            console.error('Stripe Payment Intent Error:', error)
            throw new Error(`Failed to create payment intent: ${error.message}`)
        }
    }

    /**
     * Handle Stripe Webhooks
     * Call this from /api/webhooks/stripe
     */
    async handleWebhook(payload: string | Buffer, signature: string) {
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

        try {
            const event = stripe.webhooks.constructEvent(
                payload,
                signature,
                webhookSecret
            )

            // Process different event types
            switch (event.type) {
                case 'payment_intent.succeeded':
                    return this.handlePaymentSuccess(event.data.object as Stripe.PaymentIntent)

                case 'payment_intent.payment_failed':
                    return this.handlePaymentFailed(event.data.object as Stripe.PaymentIntent)

                case 'account.updated':
                    return this.handleAccountUpdated(event.data.object as Stripe.Account)

                case 'charge.refunded':
                    return this.handleRefund(event.data.object as Stripe.Charge)

                default:
                    console.log(`Unhandled Stripe event type: ${event.type}`)
                    return { received: true }
            }
        } catch (error: any) {
            console.error('Stripe Webhook Error:', error)
            throw new Error(`Webhook signature verification failed: ${error.message}`)
        }
    }

    /**
     * Handle successful payment
     */
    private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
        const orderId = paymentIntent.metadata.americana_order_id
        const storeId = paymentIntent.metadata.americana_store_id

        console.log(`Payment succeeded for order ${orderId}`)

        // Return data to update database
        return {
            type: 'payment.succeeded',
            orderId,
            storeId,
            paymentIntentId: paymentIntent.id,
            chargeId: paymentIntent.latest_charge as string,
            amount: paymentIntent.amount / 100, // Convert from cents
            applicationFeeAmount: paymentIntent.application_fee_amount ? paymentIntent.application_fee_amount / 100 : 0
        }
    }

    /**
     * Handle failed payment
     */
    private async handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
        const orderId = paymentIntent.metadata.americana_order_id

        console.error(`Payment failed for order ${orderId}:`, paymentIntent.last_payment_error?.message)

        return {
            type: 'payment.failed',
            orderId,
            error: paymentIntent.last_payment_error?.message
        }
    }

    /**
     * Handle vendor account updates
     */
    private async handleAccountUpdated(account: Stripe.Account) {
        const storeId = account.metadata.americana_store_id

        return {
            type: 'account.updated',
            storeId,
            accountId: account.id,
            chargesEnabled: account.charges_enabled,
            payoutsEnabled: account.payouts_enabled
        }
    }

    /**
     * Handle refunds
     */
    private async handleRefund(charge: Stripe.Charge) {
        return {
            type: 'charge.refunded',
            chargeId: charge.id,
            refundAmount: charge.amount_refunded / 100
        }
    }

    /**
     * Create a manual payout to vendor (Settlement Mode)
     * Note: For Stripe Connect Standard accounts, Stripe handles automatic payouts
     * This is mainly for Express/Custom accounts
     */
    async createPayout(accountId: string, amount: number, currency = 'mxn') {
        try {
            const transfer = await stripe.transfers.create({
                amount: Math.floor(amount * 100),
                currency,
                destination: accountId,
                metadata: {
                    type: 'weekly_settlement'
                }
            })

            return {
                transferId: transfer.id,
                status: transfer.reversed ? 'reversed' : 'completed',
                amount: transfer.amount / 100
            }
        } catch (error: any) {
            console.error('Stripe Payout Error:', error)
            throw new Error(`Failed to create payout: ${error.message}`)
        }
    }

    /**
     * Get account details (for vendor dashboard)
     */
    async getAccountDetails(accountId: string) {
        try {
            const account = await stripe.accounts.retrieve(accountId)

            return {
                id: account.id,
                email: account.email,
                chargesEnabled: account.charges_enabled,
                payoutsEnabled: account.payouts_enabled,
                country: account.country,
                defaultCurrency: account.default_currency
            }
        } catch (error: any) {
            console.error('Stripe Account Retrieval Error:', error)
            throw new Error(`Failed to get account: ${error.message}`)
        }
    }
}

export const stripeAdapter = new StripeAdapter()
