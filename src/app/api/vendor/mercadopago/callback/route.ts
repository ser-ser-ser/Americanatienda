import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { mercadoPagoAdapter } from '@/lib/payments/adapters/mercadopago-adapter'

/**
 * GET /api/vendor/mercadopago/callback
 * OAuth callback from Mercado Pago
 */
export async function GET(request: NextRequest) {
    const supabase = await createClient()

    try {
        const { searchParams } = new URL(request.url)
        const code = searchParams.get('code')
        const state = searchParams.get('state')

        if (!code || !state) {
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/vendor/settings?error=oauth_failed`)
        }

        // Decode state to get storeId
        const { storeId } = JSON.parse(Buffer.from(state, 'base64').toString())

        // Exchange code for tokens
        const { accessToken, refreshToken, publicKey, userId } =
            await mercadoPagoAdapter.exchangeAuthorizationCode(code)

        // Save to database
        await supabase.from('vendor_payment_accounts').upsert({
            store_id: storeId,
            provider: 'mercadopago',
            account_id: userId,
            access_token: accessToken, // TODO: Encrypt in production
            refresh_token: refreshToken,
            is_active: true,
            metadata: {
                public_key: publicKey,
                connected_at: new Date().toISOString()
            }
        })

        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/vendor/settings?mercadopago=connected`
        )

    } catch (error: any) {
        console.error('Mercado Pago Callback Error:', error)
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/vendor/settings?error=${encodeURIComponent(error.message)}`
        )
    }
}
