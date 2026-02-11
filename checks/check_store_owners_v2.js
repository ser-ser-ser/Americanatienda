
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
const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log('--- USERS (buyer@demo.com) ---');
    const { data: users, error: userError } = await supabase.from('profiles').select('id, email, role').eq('email', 'buyer@demo.com');
    if (userError) console.error(userError);
    users.forEach(u => console.log(`${u.email} (${u.role}): ${u.id}`));

    const buyerId = users[0]?.id;

    console.log('\n--- TARGET STORES (The Red Room, The Lounge) ---');
    const { data: stores, error: storeError } = await supabase.from('stores').select('id, name, owner_id').in('name', ['The Red Room', 'The Lounge']);
    if (storeError) console.error(storeError);

    stores.forEach(s => {
        const isOwner = buyerId && s.owner_id === buyerId;
        console.log(`Store: ${s.name} (${s.id})`);
        console.log(`Owner ID: ${s.owner_id}`);
        console.log(`Is Buyer the Owner? ${isOwner ? 'YES' : 'NO'}`);
    });

    if (buyerId) {
        console.log('\n--- STORE MEMBERSHIP FOR BUYER ---');
        const { data: members, error: memberError } = await supabase.from('store_members').select('*').eq('user_id', buyerId);
        if (memberError) console.error(memberError);
        if (members.length === 0) console.log('Buyer is NOT a member of any store.');
        members.forEach(m => console.log(`Member of Store ${m.store_id} with role ${m.role}`));
    }
}

check();
