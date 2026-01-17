import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('storeId')

    if (!storeId) {
        return NextResponse.json({ error: 'Store ID is required' }, { status: 400 })
    }

    const supabase = await createClient()

    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Check if user has access to this store (Owner or Member)
        // Ideally we use RLS, but for explicit check:
        // Query stores table or store_members
        // But since we use RLS on shipping_configs, we can just try to SELECT.
        
        const { data, error } = await supabase
            .from('shipping_configs')
            .select('*')
            .eq('store_id', storeId)
            .single()

        if (error && error.code !== 'PGRST116') { // PGRST116 is 'not found' which is fine, return defaults
            throw error
        }

        // If no config found, return defaults (or null which frontend handles as defaults)
        return NextResponse.json(data || { 
            local_delivery_enabled: false,
            national_shipping_enabled: false
        })

    } catch (error: any) {
        console.error('Error fetching shipping config:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const supabase = await createClient()

    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { storeId, ...config } = body

        if (!storeId) {
            return NextResponse.json({ error: 'Store ID is required' }, { status: 400 })
        }

        // Verify access (RLS handles it, but explicit check is good practice if logic is complex)
        // Here we rely on RLS policies "Enable insert/update for store admins"

        const { data, error } = await supabase
            .from('shipping_configs')
            .upsert({
                store_id: storeId,
                ...config,
                updated_at: new Date().toISOString()
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(data)

    } catch (error: any) {
        console.error('Error saving shipping config:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
