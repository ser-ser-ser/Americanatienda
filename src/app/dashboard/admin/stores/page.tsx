'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, ShieldCheck, Ban, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import Image from 'next/image'

export default function AdminStoresPage() {
    const supabase = createClient()
    const [stores, setStores] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchStores = async () => {
        const { data, error } = await supabase.from('stores').select('*').order('created_at', { ascending: false })
        if (data) setStores(data)
        setLoading(false)
    }

    const updateStatus = async (id: string, status: string) => {
        try {
            const { error } = await supabase.from('stores').update({ status }).eq('id', id)
            if (error) throw error
            toast.success(`Store ${status === 'active' ? 'Approved' : 'Suspended'}`)
            fetchStores()
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchStores()
    }, [])

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                                <ArrowLeft className="h-6 w-6" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-serif font-bold">Store Registry</h1>
                            <p className="text-zinc-400">Manage vendor approvals and access.</p>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-zinc-500">Loading...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stores.map((store) => (
                            <div key={store.id} className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors">
                                <div className="h-32 w-full relative bg-zinc-950">
                                    {store.cover_image_url ? (
                                        store.cover_image_url.endsWith('.mp4') || store.cover_image_url.endsWith('.webm') ? (
                                            <video src={store.cover_image_url} className="w-full h-full object-cover opacity-60" muted loop autoPlay playsInline />
                                        ) : (
                                            <Image src={store.cover_image_url} alt={store.name} fill className="object-cover opacity-60" />
                                        )
                                    ) : (
                                        <div className="w-full h-full bg-zinc-800 animate-pulse" />
                                    )}
                                    <div className="absolute top-2 right-2">
                                        <Badge variant={store.status === 'active' ? 'default' : store.status === 'pending' ? 'secondary' : 'destructive'}>
                                            {store.status || 'active'}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-lg">{store.name}</h3>
                                        {store.logo_url && (
                                            <img src={store.logo_url} className="w-8 h-8 rounded-full border border-white/10" />
                                        )}
                                    </div>
                                    <p className="text-sm text-zinc-400 mt-1 line-clamp-2">{store.description}</p>

                                    <div className="mt-4 flex gap-2">
                                        {store.status === 'pending' && (
                                            <Button size="sm" className="w-full bg-green-600 hover:bg-green-700" onClick={() => updateStatus(store.id, 'active')}>
                                                <ShieldCheck className="h-4 w-4 mr-2" /> Approve
                                            </Button>
                                        )}
                                        {store.status === 'active' && (
                                            <Button size="sm" variant="destructive" className="w-full" onClick={() => updateStatus(store.id, 'suspended')}>
                                                <Ban className="h-4 w-4 mr-2" /> Suspend
                                            </Button>
                                        )}
                                        {store.status === 'suspended' && (
                                            <Button size="sm" variant="secondary" className="w-full" onClick={() => updateStatus(store.id, 'active')}>
                                                <Clock className="h-4 w-4 mr-2" /> Reactivate
                                            </Button>
                                        )}
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
