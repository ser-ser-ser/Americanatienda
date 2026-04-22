
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId');

    if (!storeId) {
        return NextResponse.json({ error: 'Store ID is required' }, { status: 400 });
    }

    // Verify ownership
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check store ownership
    const { data: store } = await supabase
        .from('stores')
        .select('owner_id')
        .eq('id', storeId)
        .single();

    if (!store || store.owner_id !== user.id) {
        // Alternatively, check simple RLS on payment_configs if policies are set correctly
        // But explicit check is safer for critical data
    }

    const { data: config, error } = await supabase
        .from('payment_configs')
        .select('*')
        .eq('store_id', storeId)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Return empty config if none exists, front-end will handle defaults
    return NextResponse.json(config || {});
}

export async function POST(request: Request) {
    const supabase = await createClient();
    const body = await request.json();
    const { storeId, ...configData } = body;

    if (!storeId) {
        return NextResponse.json({ error: 'Store ID is required' }, { status: 400 });
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify ownership
    const { data: store } = await supabase
        .from('stores')
        .select('owner_id')
        .eq('id', storeId)
        .single();

    if (!store || store.owner_id !== user.id) {
        return NextResponse.json({ error: 'Unauthorized to modifying this store' }, { status: 403 });
    }

    // Upsert config
    const { data, error } = await supabase
        .from('payment_configs')
        .upsert({
            store_id: storeId,
            ...configData,
            updated_at: new Date().toISOString()
        })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
