'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ShoppingBag, ArrowLeft, MessageCircle, Instagram, MapPin, Clock, Video } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Footer } from '@/components/footer'
import { DarkProductCard } from '@/components/DarkProductCard'
import { useChat } from '@/providers/chat-provider'
import { NotificationBell } from '@/components/ui/notification-bell'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCart } from '@/context/cart-context'

interface DarkSocialThemeProps {
    store: any
    products: any[]
    categories: any[]
    user: any
}

export function DarkSocialTheme({ store, products, categories, user }: DarkSocialThemeProps) {
    const router = useRouter()
    const supabase = createClient()
    const { cartCount, toggleCart } = useCart()
    const { startInquiryChat } = useChat()
    const [activeCategory, setActiveCategory] = useState<string>('all')
    
    // Instagram Dynamic Feed State
    const [igMedia, setIgMedia] = useState<any[]>([])
    const [loadingIg, setLoadingIg] = useState(true)

    useEffect(() => {
        const fetchIg = async () => {
            if (!store?.id) return
            try {
                const res = await fetch(`/api/instagram/feed?store_id=${store.id}`)
                const data = await res.json()
                if (data.data) {
                    setIgMedia(data.data)
                }
            } catch (error) {
                console.error("IG Fetch Error:", error)
            } finally {
                setLoadingIg(false)
            }
        }
        fetchIg()
    }, [store?.id])

    const filteredProducts = activeCategory === 'all'
        ? products
        : products.filter(p => p.store_category_id === activeCategory)

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20">
            {/* Store Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/shops" className="text-zinc-400 hover:text-white transition-colors" title="Back to The Arcade">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        {/* Store Name in Sticky Header */}
                        <Link href={`/shops/${store.slug}`} className="flex items-center gap-3">
                            <span className="text-xl font-serif font-bold tracking-tight">{store.name}</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-6">
                        <Button
                            variant="ghost"
                            className="text-white hover:bg-white/10 rounded-full h-10 w-10 p-0"
                            onClick={() => startInquiryChat(store.id)}
                        >
                            <MessageCircle className="h-5 w-5" />
                        </Button>

                        <Button
                            variant="ghost"
                            className="text-white hover:bg-white/10 rounded-full h-10 w-10 p-0 relative"
                            onClick={toggleCart}
                        >
                            <ShoppingBag className="h-5 w-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-[10px] font-black text-black rounded-full flex items-center justify-center border-2 border-black">
                                    {cartCount}
                                </span>
                            )}
                        </Button>

                        <NotificationBell />

                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full overflow-hidden border border-white/20">
                                        {user.avatar_url ? (
                                            <Image src={user.avatar_url} alt="User" fill className="object-cover" />
                                        ) : (
                                            <div className="h-full w-full bg-zinc-800 flex items-center justify-center text-xs font-bold">
                                                {user.email?.[0]?.toUpperCase()}
                                            </div>
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 bg-zinc-900 border-zinc-800 text-white" align="end">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-white/10" />
                                    <DropdownMenuItem className="focus:bg-white/10 cursor-pointer" onClick={() => router.push('/dashboard/buyer')}>
                                        Dashboard
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="focus:bg-white/10 cursor-pointer" onClick={() => router.push('/dashboard/profile')}>
                                        Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="focus:bg-white/10 cursor-pointer" onClick={() => router.push('/dashboard/orders')}>
                                        Orders
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-white/10" />
                                    <DropdownMenuItem className="focus:bg-white/10 cursor-pointer text-red-400" onClick={() => supabase.auth.signOut().then(() => router.refresh())}>
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button variant="ghost" onClick={() => router.push('/login')} className="text-white hover:bg-white/10">
                                Login
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            {/* Store Hero / Profile Header */}
            <section className="relative bg-zinc-900 pb-24">
                {/* Cover Image */}
                <div className="h-64 sm:h-80 md:h-96 w-full relative bg-zinc-800 overflow-hidden">
                    {
                        store.cover_image_url ? (
                            <Image src={store.cover_image_url} alt="Cover" fill className="object-cover" />
                        ) : store.theme_color ? (
                            <div
                                className="w-full h-full"
                                style={{ background: `linear-gradient(to bottom right, ${store.theme_color}, #000000)` }}
                            />
                        ) : (
                            <div className="w-full h-full bg-linear-to-br from-zinc-800 to-zinc-950" />
                        )
                    }
                    <div className="absolute inset-0 bg-black/20" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative">
                    <div className="flex flex-col md:flex-row items-end md:items-end gap-6 -mt-16 sm:-mt-20 relative z-10">
                        {/* Profile Picture / Logo */}
                        <div className="h-32 w-32 sm:h-40 sm:w-40 rounded-full border-4 border-black bg-zinc-900 relative overflow-hidden shadow-2xl shrink-0">
                            {store.logo_url ? (
                                <Image src={store.logo_url} alt={store.name} fill className="object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center bg-linear-to-br from-zinc-900 to-zinc-800 text-zinc-700">
                                    <span className="font-serif italic">No Image</span>
                                </div>
                            )}
                        </div>

                        {/* Store Info */}
                        <div className="flex-1 text-center md:text-left space-y-2 pb-4">
                            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white tracking-tight">{store.name}</h1>
                            {store.description && (
                                <p className="text-zinc-400 max-w-2xl text-lg leading-relaxed">{store.description}</p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pb-4 w-full md:w-auto justify-center md:justify-end">
                            <Button className="bg-white text-black hover:bg-zinc-200">Follow</Button>
                            <Button
                                className="bg-rose-600/90 text-white hover:bg-rose-600 border border-white/10"
                                onClick={() => startInquiryChat(store.id)}
                            >
                                <MessageCircle className="mr-2 h-4 w-4" /> Contact
                            </Button>
                            {store.founder_name && (
                                <Link href={`/shops/${store.slug}/visionary`}>
                                    <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                                        The Visionary
                                    </Button>
                                </Link>
                            )}
                            <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">Share</Button>
                        </div>
                    </div>

                    {/* Category Navigation */}
                    {categories.length > 0 && (
                        <nav className="flex flex-wrap justify-center md:justify-start gap-2 mt-8 py-4 border-t border-white/10">
                            <button
                                onClick={() => setActiveCategory('all')}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === 'all' ? 'bg-white text-black' : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'}`}
                            >
                                All Products
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat.id ? 'bg-white text-black' : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'}`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </nav>
                    )}
                </div>
            </section>

            {/* Product Grid */}
            <section className="px-6 py-24 bg-black">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div>
                            <h4 className="text-rose-500 text-xs font-bold uppercase tracking-[0.2em] mb-2">Editor's Choice</h4>
                            <h3 className="text-3xl sm:text-4xl font-serif font-bold text-white">
                                {store.founder_name ? `Curated by ${store.founder_name.split(' ')[0]}` : 'Selected Drops'}
                            </h3>
                        </div>
                        <Link href="/" className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors border-b border-zinc-800 pb-1">
                            View All Drops
                        </Link>
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-20 border border-dashed border-white/10 rounded-xl">
                            <p className="text-zinc-500 text-lg">No products found in this category.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6">
                            {filteredProducts.map((product) => (
                                <DarkProductCard key={product.id} product={product} storeSlug={store.slug} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Instagram Grid - Only visible if connected or we can show mock for demo */}
            {(igMedia.length > 0 || loadingIg) && (
                <section className="bg-black py-16 border-t border-white/5 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h4 className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-2">Social Feed</h4>
                            <h3 className="text-2xl font-serif text-white hover:text-rose-500 transition-colors cursor-pointer flex items-center gap-2">
                                <Instagram className="h-6 w-6" />
                                {store.instagram_username ? `@${store.instagram_username}` : (store.instagram_handle ? `@${store.instagram_handle}` : `@${store.slug}`)}
                            </h3>
                        </div>
                    </div>
                    
                    <div className="flex w-full gap-2 px-2 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4">
                        {loadingIg ? (
                            // Skeletons
                            Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="min-w-[280px] w-[280px] h-[340px] md:min-w-[320px] md:w-[320px] md:h-[400px] shrink-0 relative bg-zinc-900 animate-pulse rounded-xl border border-white/10" />
                            ))
                        ) : (
                            igMedia.map((post) => (
                                <a href={post.link} target="_blank" rel="noopener noreferrer" key={post.id} className="min-w-[280px] w-[280px] h-[340px] md:min-w-[320px] md:w-[320px] md:h-[400px] shrink-0 snap-center relative group cursor-pointer overflow-hidden rounded-xl bg-zinc-900 border border-white/10 block">
                                    <Image src={post.url} alt="Instagram Post" fill className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                                    {post.type === 'VIDEO' && (
                                        <div className="absolute top-4 right-4 bg-black/60 rounded-full p-1 border border-white/20">
                                            <Video className="h-4 w-4 text-white" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Instagram className="text-white h-8 w-8" />
                                    </div>
                                </a>
                            ))
                        )}
                    </div>
                </section>
            )}

            {/* Store Locator (Map) */}
            <section className="bg-zinc-950 py-24 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h4 className="text-rose-500 font-bold uppercase tracking-widest text-xs">Flagship Store</h4>
                            <h3 className="text-4xl font-serif text-white">Visit {store.name}</h3>
                            <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
                                Experience the collection in person. Book a private styling session at our main location.
                            </p>
                            <div className="pt-4 space-y-4 text-zinc-300">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-white/5 rounded-full"><MapPin className="h-5 w-5 text-white" /></div>
                                    <div>
                                        <p className="font-bold text-white">El Palacio de Hierro Polanco</p>
                                        <p className="text-sm">Moliere 222, Polanco II Secc, Miguel Hidalgo, 11550 CDMX</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-white/5 rounded-full"><Clock className="h-5 w-5 text-white" /></div>
                                    <div>
                                        <p className="font-bold text-white">Store Hours</p>
                                        <p className="text-sm">Mon - Sun: 11:00 AM - 9:00 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="h-[400px] w-full rounded-2xl overflow-hidden grayscale contrast-125 hover:grayscale-0 transition-all duration-700 border border-white/10 shadow-2xl relative bg-zinc-900">
                            <iframe 
                                title="Store Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m3!1d15050.490184497576!2d-99.2066063!3d19.4385154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d2021c5fdf6861%3A0x6bba8475855fde8b!2sEl%20Palacio%20de%20Hierro%20Polanco!5e0!3m2!1sen!2smx!4v1700000000000!5m2!1sen!2smx" 
                                width="100%" 
                                height="100%" 
                                style={{ border: 0 }} 
                                allowFullScreen={false} 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                            <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/20" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Immersive Contact Form */}
            <section className="bg-black py-24 border-t border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800 via-black to-black pointer-events-none" />
                <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                    <h4 className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-4">Direct Channel</h4>
                    <h3 className="text-4xl md:text-5xl font-serif text-white mb-6">Concierge & Enquiries</h3>
                    <p className="text-zinc-400 mb-12 max-w-lg mx-auto">
                        For bespoke requests, press inquiries, or private sourcing, leave a message directly for {store.founder_name ? store.founder_name.split(' ')[0] : 'our team'}.
                    </p>
                    
                    <form className="space-y-6 text-left max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest font-bold text-zinc-500">First Name</label>
                                <input type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-none px-4 py-3 text-white focus:outline-none focus:border-rose-500 transition-colors" placeholder="Jane" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest font-bold text-zinc-500">Email Address</label>
                                <input type="email" className="w-full bg-zinc-950 border border-zinc-800 rounded-none px-4 py-3 text-white focus:outline-none focus:border-rose-500 transition-colors" placeholder="jane@example.com" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest font-bold text-zinc-500">Message</label>
                            <textarea rows={4} className="w-full bg-zinc-950 border border-zinc-800 rounded-none px-4 py-3 text-white focus:outline-none focus:border-rose-500 transition-colors resize-none" placeholder="How can we assist you?"></textarea>
                        </div>
                        <div className="pt-2">
                            <Button className="w-full bg-white text-black hover:bg-zinc-200 rounded-none py-6 uppercase tracking-widest font-bold text-xs" type="submit">
                                Send Message
                            </Button>
                        </div>
                    </form>
                </div>
            </section>

            <Footer />
        </div>
    )
}
