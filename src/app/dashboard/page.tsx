'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export default function DashboardDispatcher() {
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const dispatch = async () => {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.replace('/login')
                return
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            const role = profile?.role || 'buyer'

            if (role === 'admin') {
                router.replace('/dashboard/admin')
            } else if (role === 'seller' || role === 'vendor') {
                router.replace('/dashboard/vendor')
            } else {
                // Buyer or No Role - Send to New Buyer Dashboard
                router.replace('/dashboard/buyer')
            }
        }

        dispatch()
    }, [router, supabase])

    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
            <span className="ml-2 text-zinc-500">Redirecting...</span>
        </div>
    )
}
