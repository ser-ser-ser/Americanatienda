import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Identify Store ID owned by user (Assuming 1 store per vendor for now)
    const { data: store } = await supabase
        .from('stores')
        .select('id')
        .eq('owner_id', user.id)
        .single()

    if (!store) {
        return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    const { data: config } = await supabase
        .from('shipping_configs')
        .select('*')
        .eq('store_id', store.id)
        .single()

    return NextResponse.json(config || {}) // Return empty object if no config yet (frontend will handle defaults)
}

export async function POST(request: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Get Store ID
    const { data: store } = await supabase
        .from('stores')
        .select('id')
        .eq('owner_id', user.id)
        .single()

    if (!store) {
        return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    // Upsert Config
    const { data, error } = await supabase
        .from('shipping_configs')
        .upsert({
            store_id: store.id,
            local_delivery_enabled: body.local_delivery_enabled,
            local_radius_km: body.local_radius_km,
            local_base_price: body.local_base_price,
            national_shipping_enabled: body.national_shipping_enabled,
            national_flat_rate: body.national_flat_rate,
            free_shipping_threshold: body.free_shipping_threshold,
            active_providers: body.active_providers || [],
            updated_at: new Date().toISOString()
        }, { onConflict: 'store_id' })
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
}
