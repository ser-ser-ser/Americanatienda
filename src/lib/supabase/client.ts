
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ppslfiigpnocylbgozed.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwc2xmaWlncG5vY3lsYmdvemVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5MTA0MzcsImV4cCI6MjA4MzQ4NjQzN30.IUVKX7KrgHTWb34a4zCOCFEirv-Uy9WLTCJuZ1X0G_U';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
