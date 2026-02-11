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
                router.replace('/dashboard/admin/stats') // Go specifically to stats to avoid top-level layout ambiguity
            } else if (role === 'seller' || role === 'vendor') {
                // For vendors, check if we should go to setup or dashboard
                const { data: stores } = await supabase.from('stores').select('id').eq('owner_id', user.id).limit(1)
                if (!stores || stores.length === 0) {
                    router.replace('/dashboard/vendor/setup')
                } else {
                    router.replace('/dashboard/vendor')
                }
            } else {
                router.replace('/dashboard/buyer')
            }
        }

        dispatch()
    }, [router, supabase])

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#ff007f]" />
            <span className="mt-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest animate-pulse">
                Sincronizando Accesos...
            </span>
        </div>
    )
}
