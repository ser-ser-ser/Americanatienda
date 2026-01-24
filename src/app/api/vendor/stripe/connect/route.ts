import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/vendor/stripe/connect
 * Initiates Stripe Connect onboarding for a vendor
 * 
 * Body: { storeId: string }
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

        // Check if already connected
        const { data: existingAccount } = await supabase
            .from('vendor_payment_accounts')
            .select('account_id, is_active')
            .eq('store_id', storeId)
            .eq('provider', 'stripe')
            .single()

        if (existingAccount?.is_active) {
            return NextResponse.json({
                error: 'Stripe account already connected',
                accountId: existingAccount.account_id
            }, { status: 400 })
        }

        // Create Stripe Connect account
        const { stripeAdapter } = await import('@/lib/payments/adapters/stripe-adapter')

        const { accountId, onboardingUrl, expiresAt } = await stripeAdapter.createConnectedAccount({
            storeId: store.id,
            email: user.email!,
            country: 'MX'
        })

        // Save to database
        await supabase.from('vendor_payment_accounts').upsert({
            store_id: storeId,
            provider: 'stripe',
            account_id: accountId,
            is_active: false, // Will be activated after onboarding
            metadata: { onboarding_started_at: new Date().toISOString() }
        })

        return NextResponse.json({
            accountId,
            onboardingUrl,
            expiresAt
        })

    } catch (error: any) {
        console.error('Stripe Connect Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

/**
 * GET /api/vendor/stripe/status?storeId=xxx
 * Check Stripe Connect account status
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
            .eq('provider', 'stripe')
            .single()

        if (accountError || !account) {
            return NextResponse.json({ connected: false })
        }

        // Get details from Stripe (may fail if onboarding not complete)
        try {
            const { stripeAdapter } = await import('@/lib/payments/adapters/stripe-adapter')
            const details = await stripeAdapter.getAccountDetails(account.account_id)

            return NextResponse.json({
                connected: true,
                accountId: account.account_id,
                chargesEnabled: details.chargesEnabled,
                payoutsEnabled: details.payoutsEnabled,
                isActive: account.is_active,
                onboardingComplete: details.chargesEnabled && details.payoutsEnabled
            })
        } catch (stripeError: any) {
            // Account exists in DB but Stripe call failed (probably onboarding incomplete)
            console.warn('Stripe API error (onboarding may be incomplete):', stripeError.message)

            return NextResponse.json({
                connected: true,
                accountId: account.account_id,
                chargesEnabled: false,
                payoutsEnabled: false,
                isActive: false,
                onboardingComplete: false,
                message: 'Account created but onboarding not completed. Please complete Stripe onboarding.'
            })
        }

    } catch (error: any) {
        console.error('Stripe Status Error:', error)
        return NextResponse.json({
            error: error.message,
            details: error.toString()
        }, { status: 500 })
    }
}
