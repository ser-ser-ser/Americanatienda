import { Suspense } from 'react'
import BuilderDashboard from '@/components/vendor/builder/builder-dashboard'
import { createClient } from '@/utils/supabase/server'

export default async function VendorBuilderPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data: store } = await supabase
        .from('stores')
        .select('name, slug')
        .eq('owner_id', user.id)
        .single()

    if (!store) return null

    return (
        <div className="h-screen w-full bg-black">
            <Suspense fallback={
                <div className="h-screen flex items-center justify-center bg-[#0a0a0a]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-2 w-48 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-[#ff007f] w-1/3 animate-[loading_2s_infinite]" />
                        </div>
                        <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] animate-pulse">Initializing Design Engine...</p>
                    </div>
                </div>
            }>
                <BuilderDashboard
                    storeName={store.name || "My Store"}
                    storeSlug={store.slug || ""}
                />
            </Suspense>
        </div>
    )
}
