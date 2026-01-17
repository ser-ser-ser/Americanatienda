import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'

// Reusing the header logic from layout or page, but simplified for this page
// We will fetch stores server-side for SEO
export default async function ShopsPage() {
    const supabase = await createClient()
    const { data: stores } = await supabase.from('stores').select('*').order('created_at', { ascending: true })

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20">
            {/* Header / Nav - ideally this should be a Layout, but adhering to current structure */}
            <header className="fixed w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-white transition-colors">
                        <span className="text-xl font-serif font-bold tracking-tighter">AMERICANA</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
                        <Link href="/shops" className="text-primary transition-colors cursor-default">Tiendas</Link>
                        <Link href="#" className="hover:text-primary transition-colors">Editorial</Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">
                            <Button variant="outline" className="border-white/10 text-white hover:bg-white/10 hover:text-white">
                                Back to Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="pt-32 pb-24 container mx-auto px-6">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-bold uppercase tracking-widest text-zinc-400">
                        <Sparkles className="h-3 w-3 text-primary" />
                        <span>Official Partners</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-white tracking-tight">
                        The Arcade
                    </h1>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                        Explore our exclusive roster of verified vendors. From vintage collections to modern essentials.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {stores?.map((store) => (
                        <Link key={store.id} href={`/shops/${store.slug}`} className="group block h-full">
                            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 transition-all duration-500 group-hover:border-white/30">
                                {/* Cover Image */}
                                <div className="absolute inset-0">
                                    {store.image_url ? (
                                        store.image_url.endsWith('.mp4') || store.image_url.endsWith('.webm') ? (
                                            <video
                                                src={store.image_url}
                                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                                                muted
                                                loop
                                                autoPlay
                                                playsInline
                                            />
                                        ) : (
                                            <img
                                                src={store.image_url}
                                                alt={store.name}
                                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                                            />
                                        )
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-black p-8 flex items-center justify-center">
                                            <span className="text-zinc-600 text-6xl font-serif opacity-20">{store.name.charAt(0)}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                                {/* Content */}
                                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <div className="flex items-center justify-between mb-2">
                                            <h2 className="text-3xl font-serif font-bold text-white group-hover:text-primary transition-colors">
                                                {store.name}
                                            </h2>
                                            <div className="h-8 w-8 rounded-full bg-white/10 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity delay-75">
                                                <ArrowRight className="h-4 w-4 text-white -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                            </div>
                                        </div>
                                        <p className="text-zinc-400 line-clamp-2 text-sm group-hover:text-zinc-200 transition-colors">
                                            {store.description || 'Welcome to the official store.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {(!stores || stores.length === 0) && (
                        <div className="col-span-full py-20 text-center border border-dashed border-zinc-800 rounded-2xl">
                            <p className="text-zinc-500">No stores available yet.</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}
