'use client'

import { createClient } from '@/utils/supabase/client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Footer } from '@/components/footer'

export default function VisionaryTributeClient() {
    const params = useParams()
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [store, setStore] = useState<any>(null)

    useEffect(() => {
        const fetchStore = async () => {
            const slug = params.slug as string
            const { data, error } = await supabase
                .from('stores')
                .select('*')
                .eq('slug', slug)
                .single()

            if (data) setStore(data)
            setLoading(false)
        }

        if (params.slug) fetchStore()
    }, [params.slug])

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
        )
    }

    if (!store) return <div className="text-white">Store not found</div>

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-rose-500/30 selection:text-white">

            {/* Nav */}
            <nav className="fixed top-0 left-0 p-6 z-50">
                <Link href={`/shops/${store.slug}`}>
                    <Button variant="ghost" className="text-white hover:bg-white/10 gap-2">
                        <ArrowLeft className="h-4 w-4" /> Back to Store
                    </Button>
                </Link>
            </nav>

            {/* Hero / Portrait Section */}
            <main className="max-w-7xl mx-auto px-6 py-24 min-h-screen flex flex-col justify-center">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">

                    {/* Image Column */}
                    <div className="relative order-2 lg:order-1">
                        <div className="aspect-[3/4] relative rounded-lg overflow-hidden border border-white/5 shadow-2xl">
                            {store.founder_image_url ? (
                                <Image
                                    src={store.founder_image_url}
                                    alt={store.founder_name}
                                    fill
                                    className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                                />
                            ) : (
                                <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                                    <span className="text-zinc-700 font-serif text-2xl">Visionary</span>
                                </div>
                            )}
                        </div>
                        {/* Decorative Badge */}
                        {store.establishment_date && (
                            <div className="absolute -bottom-8 -right-8 bg-rose-600 text-white font-bold font-serif px-8 py-4 text-2xl rotate-[-4deg] shadow-xl z-10">
                                {store.establishment_date}
                            </div>
                        )}
                    </div>

                    {/* Content Column */}
                    <div className="order-1 lg:order-2 space-y-10">
                        <div className="space-y-4">
                            <h4 className="text-rose-500 text-sm font-bold uppercase tracking-[0.3em] pl-1">The Visionary</h4>
                            <h1 className="text-6xl md:text-8xl font-serif font-bold text-white italic leading-[0.9]">
                                {store.founder_name}
                            </h1>
                            {store.founder_role && (
                                <p className="text-2xl text-zinc-400 font-serif border-b border-zinc-800 pb-6 inline-block pr-12">
                                    {store.founder_role}
                                </p>
                            )}
                        </div>

                        {store.founder_quote && (
                            <blockquote className="italic text-3xl md:text-4xl text-zinc-200 leading-tight font-serif">
                                <span className="text-rose-600 mr-2">"</span>
                                {store.founder_quote}
                                <span className="text-rose-600 ml-2">"</span>
                            </blockquote>
                        )}

                        {store.founder_bio && (
                            <div className="text-zinc-400 leading-loose text-lg space-y-6 max-w-xl">
                                <p>{store.founder_bio}</p>
                            </div>
                        )}

                        <div className="pt-8 flex gap-4">
                            <Link href={`/shops/${store.slug}`}>
                                <Button className="bg-white text-black hover:bg-zinc-200 rounded-none px-8 py-6 text-sm uppercase tracking-widest font-bold">
                                    View Collection
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
