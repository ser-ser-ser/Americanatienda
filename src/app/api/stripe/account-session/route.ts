import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import Stripe from 'stripe'

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
        const { accountId } = await req.json()

        if (!accountId) {
            return NextResponse.json({ error: 'Missing accountId' }, { status: 400 })
        }

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Verify ownership: Does this user own a store with this stripe_account_id?
        const { data: store } = await supabase
            .from('stores')
            .select('*')
            .eq('owner_id', user.id)
            .eq('stripe_account_id', accountId)
            .single()

        if (!store) {
            return NextResponse.json({ error: 'Access denied to this Stripe account' }, { status: 403 })
        }

        // Create Account Session
        // Note: For Express accounts, ensure 'account_onboarding' is used if details are missing,
        // but for dashboards we need 'account_management'.
        console.log(`Creating Account Session for ${accountId}...`)

        try {
            const accountSession = await stripe.accountSessions.create({
                account: accountId,
                components: {
                    payouts: { enabled: true },
                    balances: { enabled: true },
                    // payments: { enabled: true }, // Commenting out to test minimum viability
                    // notifications: { enabled: true },
                    account_management: { enabled: true },
                },
            })
            console.log('Session created successfully:', (accountSession as any).id)
            return NextResponse.json({ clientSecret: (accountSession as any).client_secret })
        } catch (stripeError: any) {
            console.error('⚠️ STRIPE SDK ERROR:', stripeError)
            return NextResponse.json({
                error: stripeError.message,
                code: stripeError.code,
                type: stripeError.type
            }, { status: 500 })
        }
    } catch (error: any) {
        console.error('General Server Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
