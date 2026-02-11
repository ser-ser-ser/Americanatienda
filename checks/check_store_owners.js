
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log('--- USERS ---');
    const { data: users, error: userError } = await supabase.from('profiles').select('id, email, role');
    if (userError) console.error(userError);
    users.forEach(u => console.log(`${u.email} (${u.role}): ${u.id}`));

    console.log('\n--- STORES ---');
    const { data: stores, error: storeError } = await supabase.from('stores').select('id, name, owner_id');
    if (storeError) console.error(storeError);
    stores.forEach(s => console.log(`${s.name}: Owner ${s.owner_id}`));

    console.log('\n--- STORE MEMBERS ---');
    const { data: members, error: memberError } = await supabase.from('store_members').select('store_id, user_id, role');
    if (memberError) console.error(memberError);
    members.forEach(m => console.log(`Store ${m.store_id} - User ${m.user_id} (${m.role})`));
}

check();
