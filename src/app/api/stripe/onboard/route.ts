import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import Stripe from 'stripe'

export async function POST(req: Request) {
    if (!process.env.STRIPE_SECRET_KEY) {
        console.error('❌ MISSING STRIPE_SECRET_KEY in .env.local')
        return NextResponse.json({ error: 'Server configuration error: STRIPE_SECRET_KEY is missing' }, { status: 500 })
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-12-15.clover',
    })

    try {
        const supabase = await createClient()

        // 1. Authenticate User
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // 2. Get User's Store
        const { data: store } = await supabase
            .from('stores')
            .select('*')
            .eq('owner_id', user.id)
            .single()

        if (!store) {
            return NextResponse.json({ error: 'No store found' }, { status: 404 })
        }

        // 3. Check if already has account, if not Create one
        let accountId = store.stripe_account_id

        if (!accountId) {
            const account = await stripe.accounts.create({
                type: 'express',
                country: 'MX', // Defaulting to Mexico for this user
                email: user.email,
                capabilities: {
                    card_payments: { requested: true },
                    transfers: { requested: true },
                },
                business_type: 'individual', // Default, can be changed in onboarding
                business_profile: {
                    name: store.name,
                    url: `https://americanatienda.com/shops/${store.slug}`, // Production URL placeholder
                },
            })
            accountId = account.id

            // Save account ID to DB
            const { error: dbError } = await supabase
                .from('stores')
                .update({ stripe_account_id: accountId })
                .eq('id', store.id)

            if (dbError) throw dbError
        }

        // 4. Create Account Link (The Onboarding URL)
        const accountLink = await stripe.accountLinks.create({
            account: accountId,
            refresh_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard/vendor/payments?refresh=true`,
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard/vendor/payments?success=true`,
            type: 'account_onboarding',
        })

        return NextResponse.json({ url: accountLink.url })

    } catch (error: any) {
        console.error('Stripe Onboarding Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
