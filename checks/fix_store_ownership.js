
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
const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY']; // Service Role Needed for RLS bypass/update

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fix() {
    const targetEmail = 'buyer@demo.com';
    console.log(`Finding user: ${targetEmail}`);

    const { data: users, error: userError } = await supabase.from('profiles').select('id, email').eq('email', targetEmail);
    if (userError || !users.length) {
        console.error('User not found', userError);
        return;
    }

    const newOwnerId = users[0].id;
    console.log(`Target User ID: ${newOwnerId}`);

    const targetStores = ['The Red Room', 'The Lounge'];

    // Update Ownership
    const { data, error } = await supabase
        .from('stores')
        .update({ owner_id: newOwnerId })
        .in('name', targetStores)
        .select();

    if (error) {
        console.error('Error updating stores:', error);
    } else {
        console.log('Success! Transferred ownership of:', data.map(s => s.name));
    }
}

fix();
