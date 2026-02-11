'use client'

import { useVendor } from '@/providers/vendor-provider'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Store, Plus, ArrowRight, LayoutDashboard, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function VendorPortalPage() {
    const { stores, selectStore, refreshStores } = useVendor()
    const router = useRouter()

    useEffect(() => {
        refreshStores()
    }, [])

    const handleEnterStore = (storeId: string) => {
        selectStore(storeId)
        router.push('/dashboard/vendor')
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans flex flex-col">
            {/* Header */}
            <div className="p-8 border-b border-white/10 flex justify-between items-center bg-zinc-950">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-[#ff007f]/20 rounded-xl flex items-center justify-center border border-[#ff007f]/30">
                        <Store className="h-5 w-5 text-[#ff007f]" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold font-serif tracking-tight">Vendor Portal</h1>
                        <p className="text-zinc-400 text-sm">Select a store to manage or create a new one.</p>
                    </div>
                </div>
                <Link href="/dashboard/vendor/setup">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-widest text-xs">
                        <Plus className="mr-2 h-4 w-4" /> Create New Store
                    </Button>
                </Link>
            </div>

            {/* Content */}
            <div className="flex-1 p-12 max-w-7xl mx-auto w-full">

                {stores.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="mx-auto h-20 w-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
                            <Store className="h-10 w-10 text-zinc-700" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">No Stores Found</h2>
                        <p className="text-zinc-500 mb-8 max-w-md mx-auto">
                            You don't have any active stores yet. Launch your first brand to get started.
                        </p>
                        <Link href="/dashboard/vendor/setup">
                            <Button size="lg" className="bg-[#ff007f] hover:bg-[#ff007f]/90 text-white font-bold px-8">
                                Setup Your First Store
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {stores.map(store => (
                            <div
                                key={store.id}
                                className="group relative bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden hover:border-[#ff007f]/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,0,127,0.15)] flex flex-col"
                            >
                                {/* Cover Image */}
                                <div className="h-40 bg-zinc-800 relative overflow-hidden">
                                    {store.cover_image_url ? (
                                        <img src={store.cover_image_url} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full bg-linear-to-br from-zinc-800 to-zinc-950" />
                                    )}
                                    <div className="absolute inset-0 bg-linear-to-t from-zinc-900 to-transparent" />

                                    {/* Logo */}
                                    <div className="absolute bottom-4 left-6 h-16 w-16 bg-black rounded-lg border border-white/10 overflow-hidden shadow-lg group-hover:border-[#ff007f]/50 transition-colors">
                                        {store.logo_url ? (
                                            <img src={store.logo_url} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-700 font-bold">LOGO</div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="mb-4">
                                        <h3 className="text-xl font-bold text-white mb-1">{store.name}</h3>
                                        <p className="text-xs text-zinc-500 line-clamp-2 min-h-[2.5em]">
                                            {store.description || 'No description provided.'}
                                        </p>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                                            <div className={`h-2 w-2 rounded-full ${store.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                            {store.status.toUpperCase()}
                                        </div>
                                        <Button
                                            onClick={() => handleEnterStore(store.id)}
                                            className="bg-white text-black hover:bg-zinc-200 font-bold text-xs uppercase tracking-wider"
                                        >
                                            Enter Dashboard <ArrowRight className="ml-2 h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
