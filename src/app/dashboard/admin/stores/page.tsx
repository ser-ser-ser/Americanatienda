'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { CheckCircle2, XCircle, Search, MoreHorizontal, ShieldCheck, MapPin, Mail, Globe, FileText, Check, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'

export default function MasterAdminStoresPage() {
    const supabase = createClient()
    const [stores, setStores] = useState<any[]>([])
    const [selectedStore, setSelectedStore] = useState<any | null>(null)
    const [storeProducts, setStoreProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // Data Load
    const fetchStores = async () => {
        // Fetch ALL stores for the list
        const { data } = await supabase
            .from('stores')
            .select('*')
            .order('created_at', { ascending: false })

        if (data) {
            setStores(data)
            // Select the first one by default if none selected
            if (!selectedStore && data.length > 0) {
                handleSelectStore(data[0])
            }
        }
        setLoading(false)
    }

    const handleSelectStore = async (store: any) => {
        setSelectedStore(store)
        // Fetch Portfolio (Products) for this store
        const { data: products } = await supabase
            .from('products')
            .select('*')
            .eq('store_id', store.id)
            .limit(4)
        setStoreProducts(products || [])
    }

    const updateStatus = async (status: string) => {
        if (!selectedStore) return
        try {
            const { error } = await supabase
                .from('stores')
                .update({ status })
                .eq('id', selectedStore.id)

            if (error) throw error

            toast.success(`Store ${selectedStore.name} marked as ${status.toUpperCase()}`)

            // Refresh list and update local state
            fetchStores()
            setSelectedStore((prev: any) => ({ ...prev, status }))

        } catch (error: any) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchStores()
    }, [])

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500">Loading Master Admin...</div>

    return (
        <div className="flex h-screen bg-black text-white overflow-hidden font-sans">

            {/* LEFT SIDEBAR: List */}
            <div className="w-1/3 min-w-[350px] max-w-[400px] border-r border-white/5 flex flex-col bg-zinc-950">
                {/* Header */}
                <div className="p-6 border-b border-white/5">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="bg-pink-600 p-2 rounded-lg">
                            <ShieldCheck className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-bold font-serif text-lg tracking-tight">Master Admin</span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Applications</h2>
                        <Badge variant="outline" className="bg-pink-900/20 text-pink-500 border-pink-900">
                            {stores.filter(s => s.status === 'pending').length} PENDING
                        </Badge>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search applications..."
                            className="w-full bg-zinc-900/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-pink-500 transition-colors"
                        />
                    </div>
                </div>

                {/* List Container */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {stores.map(store => (
                        <div
                            key={store.id}
                            onClick={() => handleSelectStore(store)}
                            className={`p-4 rounded-xl cursor-pointer border transition-all duration-200 group relative overflow-hidden
                                ${selectedStore?.id === store.id
                                    ? 'bg-zinc-900 border-pink-500/50 shadow-[0_0_20px_rgba(236,72,153,0.1)]'
                                    : 'bg-transparent border-transparent hover:bg-zinc-900 hover:border-zinc-800'
                                }
                            `}
                        >
                            {/* Selection Indicator */}
                            {selectedStore?.id === store.id && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-pink-500" />
                            )}

                            <div className="flex justify-between items-start mb-2">
                                <h3 className={`font-bold ${selectedStore?.id === store.id ? 'text-white' : 'text-zinc-300'}`}>
                                    {store.name}
                                </h3>
                                <span className="text-[10px] text-zinc-500 font-mono">
                                    {new Date(store.created_at).toLocaleDateString()}
                                </span>
                            </div>

                            <div className="flex gap-2 mb-3">
                                <Badge variant="secondary" className="bg-zinc-800 text-zinc-400 border-0 text-[10px] uppercase h-5">
                                    {store.category || 'Retail'}
                                </Badge>
                                <Badge variant="outline" className={`
                                    text-[10px] uppercase h-5 border-0
                                    ${store.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                                        store.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}
                                `}>
                                    {store.status === 'active' ? 'VERIFIED' : store.status}
                                </Badge>
                            </div>

                            <p className="text-xs text-zinc-500 line-clamp-2">
                                {store.description || "No description provided."}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT MAIN AREA: Detail View */}
            <div className="col-span-2 flex-1 flex flex-col bg-black h-full overflow-hidden">
                {selectedStore ? (
                    <>
                        {/* Detail Header */}
                        {/* Detail Header */}
                        <div className="relative h-64 w-full bg-zinc-900 group">
                            {selectedStore.cover_video_url ? (
                                <video
                                    src={selectedStore.cover_video_url}
                                    className="w-full h-full object-cover opacity-60"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                />
                            ) : selectedStore.cover_image_url ? (
                                <img src={selectedStore.cover_image_url} className="w-full h-full object-cover opacity-60" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-r from-zinc-900 to-black opacity-60" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                            <div className="absolute bottom-6 left-8 flex items-end gap-6 z-10">
                                <div className="h-24 w-24 rounded-2xl bg-zinc-900 border border-white/10 overflow-hidden relative shadow-2xl">
                                    {selectedStore.logo_url ? (
                                        <img src={selectedStore.logo_url} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full text-zinc-700 font-bold bg-zinc-800">
                                            LOGO
                                        </div>
                                    )}
                                </div>
                                <div className="mb-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h1 className="text-4xl font-bold text-white font-serif tracking-tight">{selectedStore.name}</h1>
                                        {selectedStore.status === 'active' && <CheckCircle2 className="h-6 w-6 text-blue-500 fill-blue-500/20" />}
                                    </div>
                                    <p className="text-pink-500 font-medium">{selectedStore.description?.slice(0, 60) || 'Alternative Fashion & Techwear Boutique'}...</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 pb-4 border-b border-white/5 flex justify-between items-start bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-10">
                            <div className="flex items-center gap-6 text-sm text-zinc-400 pl-36">
                                <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Global</div>
                                <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> contact@{selectedStore.slug}.com</div>
                                <div className="flex items-center gap-2"><Globe className="h-4 w-4" /> {selectedStore.slug}.americanatienda.com</div>
                            </div>

                            <div className="flex gap-4">
                                <div className="bg-zinc-900 rounded-lg p-3 text-center border border-white/5">
                                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Est. Volume</div>
                                    <div className="text-xl font-bold text-white">$ --</div>
                                </div>
                                <div className="bg-zinc-900 rounded-lg p-3 text-center border border-white/5">
                                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">SKU Count</div>
                                    <div className="text-xl font-bold text-white">{storeProducts.length}</div>
                                </div>
                            </div>
                        </div>

                        {/* Detail Content Scrollable */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-10">

                            {/* Store Concept */}
                            <section>
                                <h3 className="flex items-center gap-2 text-lg font-bold text-white mb-4">
                                    <FileText className="h-5 w-5 text-pink-500" /> Store Concept
                                </h3>
                                <Card className="bg-zinc-900/50 border-zinc-800 p-6 text-zinc-300 leading-relaxed max-w-2xl">
                                    {selectedStore.description || "The vendor has not provided a detailed concept description yet. However, based on the category, this store likely specializes in niche market products."}
                                    <br /><br />
                                    Our goal is to bring high-performance products into the nightlife and fashion scene.
                                </Card>
                            </section>

                            {/* Product Portfolio */}
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                                        <div className="h-2 w-2 bg-pink-500 rounded-full" /> Product Portfolio
                                    </h3>
                                    <span className="text-sm text-pink-500 font-bold cursor-pointer">View All ({storeProducts.length})</span>
                                </div>

                                {storeProducts.length === 0 ? (
                                    <div className="p-10 border border-dashed border-zinc-800 rounded-xl text-center text-zinc-600">
                                        No products uploaded yet.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-4 gap-4">
                                        {storeProducts.map(product => (
                                            <div key={product.id} className="aspect-[3/4] bg-zinc-900 rounded-xl border border-white/5 overflow-hidden group relative">
                                                {(product.images?.[0] || product.image_url) && (
                                                    <img
                                                        src={product.images?.[0] || product.image_url}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                )}
                                                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black to-transparent">
                                                    <p className="text-white text-sm font-bold truncate">{product.name}</p>
                                                    <p className="text-zinc-400 text-xs">${product.price}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>

                            {/* Verification Steps */}
                            <section className="bg-zinc-900/30 border border-white/5 rounded-xl p-6">
                                <h3 className="text-lg font-bold text-white mb-6">Verification Steps</h3>

                                <div className="space-y-4">
                                    {/* Step 1 */}
                                    <div className="flex items-center justify-between p-4 bg-zinc-900/80 rounded-lg border border-green-900/30">
                                        <div className="flex items-center gap-4">
                                            <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                                <CheckCircle2 className="h-5 w-5" />
                                            </div>
                                            <span className="font-bold text-white">Identity Verification</span>
                                        </div>
                                        <Badge variant="outline" className="border-green-800 text-green-500 bg-green-900/20 text-[10px]">AUTO-PASSED</Badge>
                                    </div>

                                    {/* Step 2 */}
                                    <div className="flex items-center justify-between p-4 bg-zinc-900/80 rounded-lg border border-white/5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500">
                                                {selectedStore.stripe_account_id ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <AlertCircle className="h-5 w-5" />}
                                            </div>
                                            <span className="font-bold text-white">Tax Info & Stripe Connect</span>
                                        </div>
                                        {selectedStore.stripe_account_id ? (
                                            <Badge variant="outline" className="border-green-800 text-green-500 bg-green-900/20 text-[10px]">VALID DATA</Badge>
                                        ) : (
                                            <Badge variant="outline" className="border-yellow-800 text-yellow-500 bg-yellow-900/20 text-[10px]">PENDING</Badge>
                                        )}
                                    </div>

                                    {/* Step 3 */}
                                    <div className="flex items-center justify-between p-4 bg-zinc-900/80 rounded-lg border border-red-900/20">
                                        <div className="flex items-center gap-4">
                                            <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                                                <MoreHorizontal className="h-5 w-5" />
                                            </div>
                                            <span className="font-bold text-white">Product Quality Audit</span>
                                        </div>
                                        <Badge variant="outline" className="border-red-900 text-red-500 bg-red-900/10 text-[10px]">MANUAL REVIEW REQUIRED</Badge>
                                    </div>
                                </div>
                            </section>

                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 border-t border-white/10 bg-zinc-950 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-zinc-900 rounded flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-zinc-500" />
                                </div>
                                <div className="text-xs">
                                    <div className="font-bold text-white">Review Timer</div>
                                    <div className="text-zinc-500">14 mins remaining to meet SLA</div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button variant="outline" className="border-zinc-800 text-red-500 hover:bg-red-950 hover:text-red-400 font-bold uppercase tracking-wider" onClick={() => updateStatus('suspended')}>
                                    Reject
                                </Button>
                                <Button variant="outline" className="border-zinc-800 text-white hover:bg-zinc-800 font-bold uppercase tracking-wider">
                                    Request More Info
                                </Button>
                                <Button className="bg-green-600 hover:bg-green-700 text-white font-bold uppercase tracking-wider px-8" onClick={() => updateStatus('active')}>
                                    Approve Store
                                </Button>
                            </div>
                        </div>

                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-600">
                        <ShieldCheck className="h-16 w-16 mb-4 opacity-50" />
                        <p>Select an application to begin review.</p>
                    </div>
                )}
            </div>

        </div>
    )
}
