import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ppslfiigpnocylbgozed.supabase.co'.trim()
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwc2xmaWlncG5vY3lsYmdvemVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5MTA0MzcsImV4cCI6MjA4MzQ4NjQzN30.IUVKX7KrgHTWb34a4zCOCFEirv-Uy9WLTCJuZ1X0G_U'.trim()
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzkxMDQzNywiZXhwIjoyMDgzNDg2NDM3fQ.PtmTxYLk10HXgk7xuLJourdhapjIR8BdajVUYrcN9DY'.trim()

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY)

async function debugOrder() {
    console.log("--- DEBUGGING ORDER INSERT (ADMIN MODE) ---")

    // 1. Inspect Table Structure by reading 1 row or using a failed insert to see error
    console.log("1. Checking 'orders' table columns...")
    const { data: orders, error: fetchError } = await supabaseAdmin.from('orders').select('*').limit(1)

    if (fetchError) {
        console.error("CRITICAL: Cannot access table even as Admin:", fetchError)
        return
    }

    console.log("Table Access OK. Existing keys (if any):", orders.length > 0 ? Object.keys(orders[0]) : "No rows found")

    // 2. Try to Insert a Dummy Order
    console.log("\n2. Attempting Test Insert...")

    // We need a valid user ID. Let's find one.
    const { data: { users }, error: userError } = await supabaseAdmin.auth.admin.listUsers()
    if (userError || !users?.length) {
        console.error("Cannot find any users to test with.")
        return
    }

    const testUserId = users[0].id
    console.log(`Using test user: ${testUserId} (${users[0].email})`)

    const dummyOrder = {
        user_id: testUserId,
        total_amount: 10.00,
        status: 'processing',
        items: [{ id: "test", name: "debug item", price: 10, quantity: 1, image_url: "", size: "S" }]
    }

    const { data: inserted, error: insertError } = await supabaseAdmin
        .from('orders')
        .insert(dummyOrder)
        .select()
        .single()

    if (insertError) {
        console.error("INSERT FAILED:", insertError)
        console.log("Error Details:", JSON.stringify(insertError, null, 2))
    } else {
        console.log("INSERT SUCCESS! Order ID:", inserted.id)
        console.log("This means the SCHEMA is correct. The issue is likely RLS (Permissions) or Client-Side Payload.")

        // Clean up
        await supabaseAdmin.from('orders').delete().eq('id', inserted.id)
        console.log("Cleaned up test order.")
    }
}

debugOrder()
