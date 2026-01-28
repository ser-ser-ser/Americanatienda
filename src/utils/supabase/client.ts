import { createBrowserClient } from '@supabase/ssr'

let client: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
    if (client) return client

    client = createBrowserClient(
        'https://ppslfiigpnocylbgozed.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwc2xmaWlncG5vY3lsYmdvemVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5MTA0MzcsImV4cCI6MjA4MzQ4NjQzN30.IUVKX7KrgHTWb34a4zCOCFEirv-Uy9WLTCJuZ1X0G_U'
    )
    return client
}
