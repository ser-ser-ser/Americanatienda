
const { createClient } = require('@supabase/supabase-js');
// Direct credentials for the script
const supabaseUrl = 'https://ppslfiigpnocylbgozed.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwc2xmaWlncG5vY3lsYmdvemVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5MTA0MzcsImV4cCI6MjA4MzQ4NjQzN30.IUVKX7KrgHTWb34a4zCOCFEirv-Uy9WLTCJuZ1X0G_U';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log('Checking connection...');
    const { data, error } = await supabase.from('products').select('count', { count: 'exact', head: true });

    if (error) {
        console.error('Error connecting or table missing:', error);
        process.exit(1);
    }

    console.log('Connection successful. Products table exists.');
    process.exit(0);
}

check();
