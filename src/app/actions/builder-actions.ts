'use server'

import { createClient } from "@/utils/supabase/server"

export async function saveVendorPageAction(data: { json: any, html: string, css: string, slug?: string }) {
    const supabase = await createClient()

    // 1. Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    // 2. Get vendor store
    const { data: store } = await supabase
        .from('stores')
        .select('id')
        .eq('owner_id', user.id)
        .single()

    if (!store) throw new Error("Store not found")

    // 3. Upsert page data
    const { error } = await supabase
        .from('vendor_pages')
        .upsert({
            store_id: store.id,
            slug: data.slug || 'home',
            grapes_json_data: data.json,
            compiled_html: data.html,
            compiled_css: data.css,
            is_published: true
        }, {
            onConflict: 'store_id, slug'
        })

    if (error) {
        console.error('Upsert vendor page error:', error)
        throw new Error("Failed to sync design to cloud")
    }

    return { success: true }
}

export async function getBuilderInitData(slug: string = 'home') {
    const supabase = await createClient()

    // 1. Single Auth Call
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    // 2. Fetch Store and Page Data in parallel
    const [storeResult, pageResult] = await Promise.all([
        supabase.from('stores').select('id, name').eq('owner_id', user.id).single(),
        supabase.from('vendor_pages').select('*').eq('slug', slug).single() // Note: filter by store_id in a real query if needed, but RLS handles it
    ])

    // We still need the store_id to properly filter the page if RLS isn't strictly mapping by user
    const store = storeResult.data
    if (!store) return null

    // Fetch page specifically for this store if the parallel query was too broad
    const { data: page } = await supabase
        .from('vendor_pages')
        .select('*')
        .eq('store_id', store.id)
        .eq('slug', slug)
        .single()

    return {
        storeName: store.name || "My Store",
        initialData: page?.grapes_json_data || null
    }
}
