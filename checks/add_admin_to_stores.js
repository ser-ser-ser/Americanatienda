
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
const envConfig = fs.readFileSync(envPath, 'utf8');
const env = {};
envConfig.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim().replace(/^"|"$/g, '');
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY']; // Service Role Needed

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addAdmin() {
    // 1. Get Admin User
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
    const admin = users?.find(u => u.email === 'admin@americana.com' || u.email === 'ivantovilla@gmail.com'); // Fallback to likely admin email if specific one is unknown, usually admin@americana.com based on context

    if (!admin) {
        console.error('Admin user not found in listUsers');
        return;
    }
    console.log(`Admin ID: ${admin.id} (${admin.email})`);

    // 2. Get Stores
    const targetStores = ['The Red Room', 'The Lounge'];
    const { data: stores } = await supabase.from('stores').select('id, name').in('name', targetStores);

    if (!stores || stores.length === 0) {
        console.log('Stores not found.');
        return;
    }

    // 3. Add to Store Members
    for (const store of stores) {
        console.log(`Adding Admin to ${store.name}...`);
        const { error } = await supabase.from('store_members').upsert({
            store_id: store.id,
            user_id: admin.id,
            role: 'admin' // Granting full store admin rights
        });

        if (error) console.error('Error:', error);
        else console.log('Success!');
    }
}

addAdmin();
