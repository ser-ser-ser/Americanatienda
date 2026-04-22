import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import Stripe from 'stripe'

export async function POST(req: Request) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "dummy-key-for-build", {
        apiVersion: '2025-12-15.clover',
    })

    try {
        const supabase = await createClient()

        // 1. Authenticate User
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // 2. Get User's Store (Specific Store Logic)
        const { storeId } = await req.json().catch(() => ({ storeId: null }))

        let query = supabase.from('stores').select('*').eq('owner_id', user.id)

        // If storeId is provided, enforce it (Security check: it must still belong to owner)
        if (storeId) {
            query = query.eq('id', storeId)
        }

        const { data: store, error: storeError } = await query.maybeSingle()

        if (storeError) throw storeError

        if (!store) {
            // Need a better error if they have NO stores vs wrong ID
            return NextResponse.json({ error: 'Store not found or access denied.' }, { status: 404 })
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
                    url: `https://americanastores.com/shops/${store.slug}`, // Production URL placeholder
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
