import { createClient } from '@/utils/supabase/server'

export interface MercadoPagoPreference {
    amount: number
    currency?: string
    storeId: string
    orderId: string
    customerId: string
    items: Array<{
        title: string
        quantity: number
        unit_price: number
    }>
    metadata?: Record<string, any>
}

export interface MercadoPagoVendorAuth {
    storeId: string
    authorizationCode: string
}

/**
 * Mercado Pago Payment Adapter for Americana Marketplace
 * Handles OAuth, preferences, and IPN webhooks for multi-vendor payments
 */
export class MercadoPagoAdapter {
    private clientId: string
    private clientSecret: string
    private accessToken: string

    constructor() {
        this.clientId = process.env.MERCADOPAGO_CLIENT_ID!
        this.clientSecret = process.env.MERCADOPAGO_CLIENT_SECRET!
        this.accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN!
    }

    /**
     * Generate OAuth URL for vendor authorization
     * Vendor clicks this to connect their Mercado Pago account
     */
    async getAuthorizationUrl(storeId: string): Promise<string> {
        const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/vendor/mercadopago/callback`
        const state = Buffer.from(JSON.stringify({ storeId })).toString('base64')

        return `https://auth.mercadopago.com.mx/authorization?` +
            `client_id=${this.clientId}` +
            `&response_type=code` +
            `&platform_id=mp` +
            `&state=${state}` +
            `&redirect_uri=${encodeURIComponent(redirectUri)}`
    }

    /**
     * Exchange authorization code for access token
     * Called from OAuth callback
     */
    async exchangeAuthorizationCode(code: string): Promise<{
        accessToken: string
        refreshToken: string
        publicKey: string
        userId: string
    }> {
        const response = await fetch('https://api.mercadopago.com/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                client_id: this.clientId,
                client_secret: this.clientSecret,
                code,
                grant_type: 'authorization_code',
                redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/vendor/mercadopago/callback`
            })
        })

        if (!response.ok) {
            const error = await response.text()
            throw new Error(`Mercado Pago OAuth error: ${error}`)
        }

        const data = await response.json()

        return {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            publicKey: data.public_key,
            userId: data.user_id
        }
    }

    /**
     * Create payment preference for checkout
     * This is like Stripe's Payment Intent
     */
    async createPreference({
        amount,
        currency = 'MXN',
        storeId,
        orderId,
        customerId,
        items,
        metadata = {}
    }: MercadoPagoPreference & { vendorAccessToken: string; commissionRate: number }): Promise<{
        preferenceId: string
        initPoint: string
        sandboxInitPoint: string
    }> {
        const { vendorAccessToken, commissionRate } = metadata as any

        // Calculate marketplace fee (10% default)
        const marketplaceFee = Math.floor(amount * commissionRate)

        const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${vendorAccessToken}`
            },
            body: JSON.stringify({
                items: items.map(item => ({
                    title: item.title,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    currency_id: currency
                })),
                payer: {
                    email: metadata.buyer_email || 'buyer@example.com'
                },
                back_urls: {
                    success: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?orderId=${orderId}`,
                    failure: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/failure?orderId=${orderId}`,
                    pending: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/pending?orderId=${orderId}`
                },
                auto_return: 'approved',
                notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
                external_reference: orderId,
                marketplace_fee: marketplaceFee,
                metadata: {
                    americana_store_id: storeId,
                    americana_order_id: orderId,
                    americana_customer_id: customerId
                }
            })
        })

        if (!response.ok) {
            const error = await response.text()
            throw new Error(`Mercado Pago preference error: ${error}`)
        }

        const data = await response.json()

        return {
            preferenceId: data.id,
            initPoint: data.init_point,
            sandboxInitPoint: data.sandbox_init_point
        }
    }

    /**
     * Handle IPN (Instant Payment Notification) webhook
     * Called from /api/webhooks/mercadopago
     */
    async handleIPN(topic: string, resourceId: string) {
        if (topic === 'payment') {
            return await this.handlePaymentNotification(resourceId)
        } else if (topic === 'merchant_order') {
            return await this.handleMerchantOrderNotification(resourceId)
        }

        return { received: true }
    }

    /**
     * Handle payment notification
     */
    private async handlePaymentNotification(paymentId: string) {
        const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        })

        if (!response.ok) {
            throw new Error('Failed to fetch payment details')
        }

        const payment = await response.json()

        const orderId = payment.external_reference
        const status = payment.status

        console.log(`Mercado Pago Payment ${paymentId}: ${status}`)

        return {
            type: 'payment.notification',
            orderId,
            paymentId,
            status,
            amount: payment.transaction_amount,
            netAmount: payment.transaction_amount - (payment.marketplace_fee || 0),
            fee: payment.marketplace_fee || 0,
            approved: status === 'approved'
        }
    }

    /**
     * Handle merchant order notification
     */
    private async handleMerchantOrderNotification(orderId: string) {
        const response = await fetch(`https://api.mercadopago.com/merchant_orders/${orderId}`, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        })

        if (!response.ok) {
            throw new Error('Failed to fetch merchant order')
        }

        const order = await response.json()

        return {
            type: 'merchant_order.notification',
            orderId: order.external_reference,
            status: order.status,
            totalPaid: order.total_amount
        }
    }

    /**
     * Get vendor account details
     */
    async getAccountDetails(userId: string) {
        const response = await fetch(`https://api.mercadopago.com/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`
            }
        })

        if (!response.ok) {
            throw new Error('Failed to get account details')
        }

        const user = await response.json()

        return {
            id: user.id,
            email: user.email,
            nickname: user.nickname,
            country: user.site_id
        }
    }
}

export const mercadoPagoAdapter = new MercadoPagoAdapter()
