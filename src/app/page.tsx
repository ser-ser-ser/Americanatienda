'use client'

import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { ArrowRight, Sparkles, User, ShoppingBag, Instagram, Play, Search, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { useCart } from '@/context/cart-context'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Footer } from '@/components/footer'
import { Menu } from 'lucide-react'
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"

// This allows the page to be statically exported while fetching data client-side
// export const revalidate = 3600

import { NotificationBell } from '@/components/ui/notification-bell'

export default function Home() {
    const supabase = createClient()
    const { toggleCart, cartCount } = useCart()
    const [user, setUser] = useState<any>(null)
    const [stores, setStores] = useState<any[]>([])
    const [content, setContent] = useState<Record<string, string>>({})
    const [navLinks, setNavLinks] = useState<{ label: string, link: string }[]>([])
    const [dbCategories, setDbCategories] = useState<any[]>([])

    const [featuredProducts, setFeaturedProducts] = useState<any[]>([])

    // Parallax & Scroll Effects
    const { scrollY } = useScroll()
    const y1 = useTransform(scrollY, [0, 500], [0, 200])
    const opacityHero = useTransform(scrollY, [0, 400], [1, 0])

    useEffect(() => {
        const fetchData = async () => {
            // Check User
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)

            // Fetch Stores
            const { data: storesData } = await supabase.from('stores').select('*')
            if (storesData) setStores(storesData)

            // Fetch Categories (DB)
            const { data: catsData } = await supabase.from('categories').select('*').order('created_at', { ascending: true })
            if (catsData) setDbCategories(catsData)

            // Fetch Featured Products (Marketplace Feed)
            const { data: featured } = await supabase
                .from('products')
                .select(`
                    *,
                    stores (name, slug),
                    store_categories (slug)
                `)
                .eq('is_featured', true)
                .limit(8)

            if (featured) setFeaturedProducts(featured)

            // Fetch Site Content
            const { data: contentData } = await supabase.from('site_content').select('*')
            if (contentData) {
                const contentMap = contentData.reduce((acc: any, item: any) => {
                    acc[item.key] = item.value
                    return acc
                }, {})
                setContent(contentMap)

                // Parse Nav Links
                if (contentMap['nav_categories']) {
                    try {
                        setNavLinks(JSON.parse(contentMap['nav_categories']))
                    } catch (e) {
                        setNavLinks([
                            { label: 'Categories', link: '/collections' },
                            { label: 'Stores', link: '/shops' },
                            { label: 'Editorial', link: '/editorial' },
                            { label: 'The Club', link: '/club' }
                        ])
                    }
                } else {
                    setNavLinks([
                        { label: 'Categories', link: '/collections' },
                        { label: 'Stores', link: '/shops' },
                        { label: 'Editorial', link: '/editorial' },
                        { label: 'The Club', link: '/club' }
                    ])
                }
            }
        }
        fetchData()
    }, [supabase])

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    }

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 50 } as any
        }
    }

    return (
        <div className="min-h-screen bg-black text-foreground overflow-hidden">

            {/* 1. CINEMATIC VIDEO BACKGROUND HERO */}
            <div className="fixed inset-0 z-0 h-screen w-full overflow-hidden">
                {content['home_hero_video']?.endsWith('.mp4') || !content['home_hero_video'] ? (
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen"
                        src={content['home_hero_video'] || "https://assets.mixkit.co/videos/preview/mixkit-abstract-purple-lights-in-dark-background-31448-large.mp4"}
                    />
                ) : (
                    <img
                        src={content['home_hero_video']}
                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                        alt="Hero background"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black z-10" />
            </div>

            {/* Header */}
            <header className="fixed w-full z-50 border-b border-white/5 bg-black/20 backdrop-blur-xl transition-all duration-300">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2"
                    >
                        <span className="text-3xl font-serif font-bold tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                            {content['home_hero_title'] || 'AMERICANA'}
                        </span>
                    </motion.div>

                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
                        {navLinks.map((cat, idx) => (
                            <Link key={idx} href={cat.link} className="hover:text-primary transition-colors hover:shadow-[0_0_20px_var(--primary)]">
                                {cat.label}
                            </Link>
                        ))}
                    </nav>


                    <div className="flex items-center gap-4">
                        {/* Search Bar (Desktop) */}
                        <div className="hidden lg:flex items-center bg-white/5 rounded-full px-4 h-10 border border-white/10 hover:border-white/20 transition-colors w-64">
                            <Search className="h-4 w-4 text-zinc-400 mr-2" />
                            <input
                                type="text"
                                placeholder="Search products, stores..."
                                className="bg-transparent border-none outline-none text-sm text-white placeholder:text-zinc-500 w-full"
                            />
                        </div>



                        {/* Favorites */}
                        <Link href="/favorites">
                            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
                                <Heart className="h-5 w-5" />
                            </Button>
                        </Link>

                        <div className="text-white">
                            <NotificationBell />
                        </div>

                        {/* Auth Button / User Profile */}
                        <Link href={user ? "/dashboard" : "/login"} className="hidden md:inline-flex items-center gap-2">
                            {user ? (
                                <div className="flex items-center gap-2 pl-2 pr-4 py-1.5 bg-white/10 rounded-full border border-white/5 hover:bg-white/20 transition-all">
                                    <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center text-[10px] font-bold text-white">
                                        {user.email?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-xs font-medium text-white max-w-[100px] truncate">
                                        {user.email?.split('@')[0]}
                                    </span>
                                </div>
                            ) : (
                                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
                                    <User className="h-5 w-5" />
                                </Button>
                            )}
                        </Link>

                        {/* Cart Button with Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/10 rounded-full relative"
                            onClick={toggleCart}
                        >
                            <ShoppingBag className="h-5 w-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold">
                                    {cartCount}
                                </span>
                            )}
                        </Button>

                        {/* Mobile Menu */}
                        <div className="md:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-white">
                                        <Menu className="h-6 w-6" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="bg-zinc-950 border-white/10 text-white">
                                    <nav className="flex flex-col gap-6 mt-10 text-lg font-medium">
                                        {navLinks.map((cat, idx) => (
                                            <Link key={idx} href={cat.link} className="hover:text-primary transition-colors">
                                                {cat.label}
                                            </Link>
                                        ))}
                                        <div className="h-px bg-white/10 my-2" />
                                        <Link href={user ? "/dashboard" : "/login"} className="hover:text-primary transition-colors flex items-center gap-2">
                                            <User className="h-4 w-4" /> {user ? 'My Dashboard' : 'My Account'}
                                        </Link>
                                    </nav>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Content */}
            <motion.section
                style={{ y: y1, opacity: opacityHero }}
                className="relative z-10 h-screen flex flex-col items-center justify-center text-center px-4"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md text-xs font-bold text-primary mb-8 tracking-widest uppercase shadow-[0_0_30px_-5px_var(--primary)]">
                    <Sparkles className="h-3 w-3 animate-pulse" />
                    <span>Est. 2026 • Exclusive Marketplace</span>
                </div>

                <h1 className="text-6xl md:text-9xl font-serif font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-zinc-600 mb-6 drop-shadow-2xl">
                    {content['home_hero_title'] || 'AMERICANA'} <br />
                    <span className="italic font-light text-white">{content['home_hero_subtitle'] || 'REDIFINE'}</span>
                </h1>

                <p className="text-xl md:text-2xl text-zinc-300 max-w-2xl mx-auto mb-12 font-light leading-relaxed mix-blend-plus-lighter">
                    {content['home_hero_description'] || 'Where aesthetics meet indulgence. Explore curated collections for the modern provocateur.'}
                </p>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="#categories">
                        <Button size="lg" className="bg-white text-black hover:bg-zinc-200 text-lg px-8 py-6 rounded-full font-bold tracking-tight shadow-[0_0_40px_-5px_rgba(255,255,255,0.4)] transition-all">
                            {content['home_hero_cta_label'] || 'Explore The Collections'}
                        </Button>
                    </Link>
                </motion.div>
            </motion.section>

            {/* 2. CATEGORIES GRID (Replacing Stores Grid) */}
            <section id="categories" className="relative z-20 py-32 bg-black">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                        <div>
                            <span className="text-primary text-sm font-bold uppercase tracking-widest block mb-2">Descubre</span>
                            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white">Categorías Populares</h2>
                        </div>
                        <Link href="/collections">
                            <Button variant="outline" className="text-white border-white/20 hover:bg-white hover:text-black">
                                Ver todas
                            </Button>
                        </Link>
                    </div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={containerVariants}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
                    >
                        {dbCategories?.map((category, index) => {
                            const mediaUrl = category.image_url

                            return (
                                <motion.div variants={itemVariants} key={category.id}>
                                    <div className="group block relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/10">
                                        {/* Category Media */}
                                        <div className="absolute inset-0 bg-zinc-900 transition-transform duration-700 group-hover:scale-105">
                                            {mediaUrl ? (
                                                mediaUrl.match(/\.(mp4|webm|ogg)$/i) || mediaUrl.includes('cloudinary') && mediaUrl.includes('video') ? (
                                                    <video
                                                        src={mediaUrl}
                                                        autoPlay
                                                        muted
                                                        loop
                                                        playsInline
                                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                                                    />
                                                ) : (
                                                    <img src={mediaUrl} alt={category.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                                                )
                                            ) : (
                                                <div className={`w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-950`} />
                                            )}
                                        </div>

                                        {/* Content Wrapper */}
                                        <div className="absolute inset-0 p-8 flex flex-col justify-end pointer-events-none">
                                            <div>
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <h3 className="text-2xl font-serif font-bold text-white mb-1 group-hover:text-rose-500 transition-colors">{category.name}</h3>
                                                        <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">View Collection</p>
                                                    </div>
                                                    <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                                                        <ArrowRight className="h-5 w-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Full Card Clickable Overlay */}
                                        <Link href={`/collections/${category.slug}`} className="absolute inset-0 z-10" aria-label={`View ${category.name}`} />
                                    </div>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                </div>
            </section >

            {/* 3. Instagram / Social Proof Section */}
            <section className="relative z-20 py-24 border-t border-white/5 bg-zinc-950">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                        <div>
                            <h3 className="text-3xl font-serif font-bold text-white mb-2">Follow The Culture</h3>
                            <p className="text-zinc-400">@americanatienda • Join 50k+ connoisseurs</p>
                        </div>
                        <Button
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white hover:text-black gap-2"
                            onClick={() => window.open(content['social_instagram_url'] || 'https://instagram.com', '_blank')}
                        >
                            <Instagram className="h-4 w-4" /> Follow on Instagram
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => {
                            const url = content[`social_img_${i}`]
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="aspect-square bg-zinc-900 rounded-xl border border-white/5 relative group cursor-pointer overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                        <Instagram className="h-8 w-8 text-white drop-shadow-lg" />
                                    </div>

                                    {url && url.match(/\.(mp4|webm|ogg)$/i) ? (
                                        <video
                                            src={url}
                                            autoPlay muted loop playsInline
                                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                                        />
                                    ) : (
                                        <img
                                            src={url || `https://images.unsplash.com/photo-${i === 1 ? '1534528741775-53994a69daeb' : i === 2 ? '1539136788836-5699e1c73867' : i === 3 ? '1504198458649-3128b932f49e' : '1596400377042-4f9e31d47159'}?auto=format&fit=crop&w=400&q=80`}
                                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                                            alt="Instagram post"
                                        />
                                    )}
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>


            {/* 4. STORES / PORTALS (Swapped from Top) */}
            <section className="py-24 px-6 bg-zinc-950 border-t border-white/5">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-6 px-4 md:px-0">
                        <div className="text-left">
                            <span className="text-primary text-sm font-bold uppercase tracking-widest block mb-2">The Portals</span>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white">Stores</h2>
                        </div>
                        <Link href="/shops">
                            <Button variant="outline" className="border-white/10 text-zinc-400 hover:bg-white hover:text-black rounded-full px-8">
                                Ver más
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {stores?.map((store, index) => {
                            const mediaUrl = store.cover_video_url || store.cover_image_url

                            return (
                                <Link key={store.id} href={`/shops/${store.slug}`} className="group block relative aspect-video md:aspect-[2/1] bg-zinc-900 rounded-3xl overflow-hidden border border-white/10 hover:border-white/30 transition-all">
                                    {/* Background */}
                                    {mediaUrl ? (
                                        mediaUrl.match(/\.(mp4|webm|ogg)$/i) || mediaUrl.includes('cloudinary') && mediaUrl.includes('video') ? (
                                            <video
                                                src={mediaUrl}
                                                autoPlay muted loop playsInline
                                                className="w-full h-full object-cover opacity-50 group-hover:opacity-40 transition-opacity duration-700"
                                            />
                                        ) : (
                                            <img src={mediaUrl} alt={store.name} className="w-full h-full object-cover opacity-50 group-hover:opacity-40 transition-opacity duration-700" />
                                        )
                                    ) : (
                                        <div className={`w-full h-full bg-gradient-to-br ${index % 2 === 0 ? 'from-rose-900/40 via-black to-black' : 'from-emerald-900/40 via-black to-black'}`} />
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                                    <div className="absolute inset-0 p-8 flex flex-col justify-end items-start tracking-wide">
                                        <div className="px-3 py-1 bg-white/10 backdrop-blur rounded-full text-xs font-bold uppercase text-white mb-3">
                                            Portal {index + 1}
                                        </div>
                                        <h3 className="text-3xl font-serif font-bold text-white italic group-hover:text-primary transition-colors">
                                            {store.name}
                                        </h3>
                                        {store.description && (
                                            <p className="text-zinc-400 text-sm mt-2 max-w-md line-clamp-2">
                                                {store.description}
                                            </p>
                                        )}

                                        <div className="mt-6 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white/50 group-hover:text-white transition-colors">
                                            Enter Portal <ArrowRight className="h-4 w-4" />
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </section>

            <Footer />
        </div >
    )
}
