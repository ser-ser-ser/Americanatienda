import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

// Server Component: no client-side lock contention with middleware.
// The middleware already validates the session via cookies; we just read it here.
export default async function DashboardDispatcher() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    const role = profile?.role || 'buyer'

    if (role === 'admin') {
        redirect('/dashboard/admin/stats')
    }

    if (role === 'seller' || role === 'vendor') {
        const { data: stores } = await supabase
            .from('stores')
            .select('id')
            .eq('owner_id', user.id)
            .limit(1)

        if (!stores || stores.length === 0) {
            redirect('/dashboard/vendor/setup')
        } else {
            redirect('/dashboard/vendor')
        }
    }

    redirect('/dashboard/buyer')
}
