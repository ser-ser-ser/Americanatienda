
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function debugSystem() {
    console.log("--- DEBUGGING PRODUCTS ---")
    const { data: products, error } = await supabase.from('products').select('id, name, image_url, images, store_id')
    if (error) console.error("Error fetching products:", error)
    else {
        console.log(`Found ${products.length} products.`)
        products.forEach(p => {
            console.log(`Product: ${p.name} | URL: ${p.image_url} | Array: ${p.images}`)
        })
    }

    console.log("\n--- DEBUGGING CHAT SCHEMA ---")
    // Try to insert a dummy message to see structure error
    const { error: chatError } = await supabase.from('messages').select('*').limit(1)
    if (chatError) console.error("Chat Table Access Error:", chatError)
    else console.log("Chat table is accessible.")
}

debugSystem()
