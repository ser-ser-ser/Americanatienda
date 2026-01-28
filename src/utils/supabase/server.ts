import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
    let cookieStore: any;
    try {
        cookieStore = await cookies()
    } catch {
        // Static generation context - no cookies available
    }

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ppslfiigpnocylbgozed.supabase.co",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwc2xmaWlncG5vY3lsYmdvemVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5MTA0MzcsImV4cCI6MjA4MzQ4NjQzN30.IUVKX7KrgHTWb34a4zCOCFEirv-Uy9WLTCJuZ1X0G_U",
        {
            cookies: {
                getAll() {
                    return cookieStore?.getAll() ?? []
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore?.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )
}
