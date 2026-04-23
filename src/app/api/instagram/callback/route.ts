import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state') // we passed store_id as state
    const error = searchParams.get('error')

    if (error || !code || !state) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/vendor/portal?error=${error || 'no_code'}`)
    }

    try {
        const storeId = state

        // 1. Exchange 'code' for Short-Lived Access Token
        const clientId = process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID
        const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET
        const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/instagram/callback`

        if (!clientId || !clientSecret) {
            throw new Error('Missing Instagram Developer Keys')
        }

        const tokenForm = new URLSearchParams()
        tokenForm.append('client_id', clientId)
        tokenForm.append('client_secret', clientSecret)
        tokenForm.append('grant_type', 'authorization_code')
        tokenForm.append('redirect_uri', redirectUri)
        tokenForm.append('code', code)

        const shortLivedRes = await fetch('https://api.instagram.com/oauth/access_token', {
            method: 'POST',
            body: tokenForm
        })

        const shortLivedData = await shortLivedRes.json()
        if (shortLivedData.error_message || !shortLivedData.access_token) {
            throw new Error(shortLivedData.error_message || 'Failed to get short-lived token')
        }

        const shortLivedToken = shortLivedData.access_token
        const userId = shortLivedData.user_id

        // 2. Exchange Short-Lived for Long-Lived Token (lasts 60 days)
        const longLivedRes = await fetch(`https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${clientSecret}&access_token=${shortLivedToken}`)
        const longLivedData = await longLivedRes.json()
        
        if (longLivedData.error || !longLivedData.access_token) {
             throw new Error(longLivedData.error?.message || 'Failed to get long-lived token')
        }

        const longLivedToken = longLivedData.access_token

        // 3. Save to Supabase (bypassing RLS with service_role since we are in a serverless function)
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
        const supabaseAdmin = createClient(supabaseUrl, supabaseKey)

        const { error: dbError } = await supabaseAdmin
            .from('stores')
            .update({
                instagram_access_token: longLivedToken,
                instagram_account_id: userId,
                // token_expires_in returns seconds, so we add it to current time
                instagram_token_expires_at: new Date(Date.now() + (longLivedData.expires_in * 1000)).toISOString()
            })
            .eq('id', storeId)

        if (dbError) throw dbError

        // Redirect back to portal with success
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/vendor/portal?instagram=connected`)

    } catch (err: any) {
        console.error('Instagram Callback Error:', err.message)
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/vendor/portal?error=auth_failed`)
    }
}
