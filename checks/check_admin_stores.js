
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
const envConfig = fs.readFileSync(envPath, 'utf8');
const env = {};
envConfig.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log('--- Checking Admin Stores (JS) ---');

    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    if (error) {
        console.error('Error listing users:', error);
        return;
    }

    const admin = users.find(u => u.email === 'admin@americana.com');
    if (!admin) {
        console.error('Admin user not found');
        return;
    }
    console.log(`Admin ID: ${admin.id}`);

    const targetStores = ['The Red Room', 'The Lounge'];
    const { data: stores } = await supabase
        .from('stores')
        .select('*')
        .in('name', targetStores);

    console.log(`Found ${stores?.length || 0} stores.`);

    if (stores) {
        for (const store of stores) {
            console.log(`\nStore: ${store.name} (${store.id})`);
            console.log(`Owner: ${store.owner_id} (Match Admin? ${store.owner_id === admin.id})`);

            // Check Orders
            const { count: orders } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('store_id', store.id);
            console.log(`Orders: ${orders}`);

            // Check Products
            const { count: products } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('store_id', store.id);
            console.log(`Products: ${products}`);
        }
    }
}

check();
