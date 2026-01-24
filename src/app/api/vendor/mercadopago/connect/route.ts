import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { mercadoPagoAdapter } from '@/lib/payments/adapters/mercadopago-adapter'

/**
 * POST /api/vendor/mercadopago/connect
 * Initiates Mercado Pago OAuth for vendor
 */
export async function POST(request: NextRequest) {
    const supabase = await createClient()

    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { storeId } = await request.json()

        // Verify user owns this store
        const { data: store, error: storeError } = await supabase
            .from('stores')
            .select('id, name, owner_id')
            .eq('id', storeId)
            .eq('owner_id', user.id)
            .single()

        if (storeError || !store) {
            return NextResponse.json({ error: 'Store not found or unauthorized' }, { status: 404 })
        }

        // Generate OAuth URL
        const authUrl = await mercadoPagoAdapter.getAuthorizationUrl(storeId)

        return NextResponse.json({
            authorizationUrl: authUrl
        })

    } catch (error: any) {
        console.error('Mercado Pago Connect Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

/**
 * GET /api/vendor/mercadopago/status?storeId=xxx
 * Check Mercado Pago connection status
 */
export async function GET(request: NextRequest) {
    const supabase = await createClient()

    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const storeId = searchParams.get('storeId')

        if (!storeId) {
            return NextResponse.json({ error: 'Missing storeId' }, { status: 400 })
        }

        // Get account from DB
        const { data: account, error: accountError } = await supabase
            .from('vendor_payment_accounts')
            .select('account_id, is_active, metadata')
            .eq('store_id', storeId)
            .eq('provider', 'mercadopago')
            .single()

        if (accountError || !account) {
            return NextResponse.json({ connected: false })
        }

        return NextResponse.json({
            connected: true,
            accountId: account.account_id,
            isActive: account.is_active
        })

    } catch (error: any) {
        console.error('Mercado Pago Status Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
