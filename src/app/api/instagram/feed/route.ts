import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('store_id')

    if (!storeId) {
        return NextResponse.json({ error: 'store_id is required' }, { status: 400 })
    }

    try {
        // Use service role to bypass RLS and read the protected token
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
        const supabaseAdmin = createClient(supabaseUrl, supabaseKey)

        const { data: store, error } = await supabaseAdmin
            .from('stores')
            .select('instagram_access_token, instagram_account_id')
            .eq('id', storeId)
            .single()

        if (error || !store) {
            return NextResponse.json({ error: 'Store not found' }, { status: 404 })
        }

        if (!store.instagram_access_token) {
            return NextResponse.json({ data: [] }) // Return empty if not connected
        }

        // Fetch recent media from Instagram Basic Display API
        // fields=id,media_type,media_url,thumbnail_url,permalink
        const feedUrl = `https://graph.instagram.com/me/media?fields=id,media_type,media_url,thumbnail_url,permalink&limit=6&access_token=${store.instagram_access_token}`
        const igRes = await fetch(feedUrl)
        const igData = await igRes.json()

        if (igData.error) {
            throw new Error(igData.error.message)
        }

        // Map data to clean format
        const media = igData.data.map((item: any) => ({
            id: item.id,
            url: item.media_url || item.thumbnail_url,
            link: item.permalink,
            type: item.media_type // IMAGE, VIDEO, CAROUSEL_ALBUM
        }))

        return NextResponse.json({ data: media })

    } catch (err: any) {
        console.error('Failed to fetch Instagram feed:', err)
        return NextResponse.json({ error: 'Failed to fetch feed' }, { status: 500 })
    }
}
