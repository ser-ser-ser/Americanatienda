
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role to bypass RLS for checking
)

async function checkStores() {
    console.log('--- Checking Admin Stores ---')

    // 1. Get Admin User ID
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers()
    if (userError) {
        console.error('Error fetching users:', userError)
        return
    }

    const adminUser = (users as any[]).find(u => u.email === 'admin@americana.com')
    if (!adminUser) {
        console.log('CRITICAL: admin@americana.com NOT FOUND')
    } else {
        console.log(`Admin Found: ${adminUser.email} (${adminUser.id})`)
    }

    // 2. Check Stores by Name
    const targetStores = ['The Red Room', 'The Lounge']
    const { data: stores, error: storeError } = await supabase
        .from('stores')
        .select('id, name, owner_id, status')
        .in('name', targetStores)

    if (storeError) {
        console.error('Error fetching stores:', storeError)
        return
    }

    if (!stores || stores.length === 0) {
        console.log('No Admin Stores found with names:', targetStores)
        return
    }

    console.log(`Found ${stores.length} target stores:`)

    for (const store of stores) {
        console.log(`\n[Store: ${store.name}]`)
        console.log(`- ID: ${store.id}`)
        console.log(`- Owner: ${store.owner_id}`)
        console.log(`- Status: ${store.status}`)
        console.log(`- Is Owned by Admin? ${store.owner_id === adminUser?.id ? 'YES' : 'NO (Mismatch!)'}`)

        // Check Products
        const { count: productCount } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('store_id', store.id)
        console.log(`- Products: ${productCount}`)

        // Check Orders (via order_items potentially, or orders if store_id is on orders)
        // Assuming simple orders table for now
        const { count: orderCount } = await supabase
            .from('orders') // Adjust if table is different
            .select('*', { count: 'exact', head: true })
            .eq('store_id', store.id) // This might fail if store_id isn't on orders directly
        console.log(`- Orders: ${orderCount} (may be 0 if schema differs)`)
    }
}

checkStores()
