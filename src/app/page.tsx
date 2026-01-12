'use client'

import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { ArrowRight, Sparkles, User, ShoppingBag, Instagram, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
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

export default function Home() {
    const supabase = createClient()
    const [stores, setStores] = useState<any[]>([])
    const [content, setContent] = useState<Record<string, string>>({})
    const [categories, setCategories] = useState<{ label: string, link: string }[]>([])

    const [featuredProducts, setFeaturedProducts] = useState<any[]>([])

    // Parallax & Scroll Effects
    const { scrollY } = useScroll()
    const y1 = useTransform(scrollY, [0, 500], [0, 200])
    const opacityHero = useTransform(scrollY, [0, 400], [1, 0])

    useEffect(() => {
        const fetchData = async () => {
            // Fetch Stores
            const { data: storesData } = await supabase.from('stores').select('*')
            if (storesData) setStores(storesData)

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

                // Parse Categories
                if (contentMap['nav_categories']) {
                    try {
                        setCategories(JSON.parse(contentMap['nav_categories']))
                    } catch (e) {
                        // Fallback default
                        setCategories([
                            { label: 'Curations', link: '#' },
                            { label: 'Editorial', link: '#' },
                            { label: 'The Club', link: '#' }
                        ])
                    }
                } else {
                    // Default
                    setCategories([
                        { label: 'Curations', link: '#' },
                        { label: 'Editorial', link: '#' },
                        { label: 'The Club', link: '#' }
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
                        <Link href="/categories" className="hover:text-primary transition-colors hover:shadow-[0_0_20px_var(--primary)]">Categorías</Link>
                        <Link href="#" className="hover:text-primary transition-colors hover:shadow-[0_0_20px_var(--primary)]">Editorial</Link>
                        <Link href="#" className="hover:text-primary transition-colors hover:shadow-[0_0_20px_var(--primary)]">El Club</Link>
                        <Link href="/shops" className="hover:text-primary transition-colors hover:shadow-[0_0_20px_var(--primary)]">Tiendas</Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link href="/login" className="hidden md:inline-flex">
                            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
                                <User className="h-5 w-5" />
                            </Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
                            <ShoppingBag className="h-5 w-5" />
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
                                        <Link href="/categories" className="text-primary transition-colors">Categorías</Link>
                                        <Link href="#" className="hover:text-primary transition-colors">Editorial</Link>
                                        <Link href="#" className="hover:text-primary transition-colors">El Club</Link>
                                        <Link href="/shops" className="hover:text-primary transition-colors">Tiendas</Link>
                                        <div className="h-px bg-white/10 my-2" />
                                        <Link href="/login" className="hover:text-primary transition-colors flex items-center gap-2"><User className="h-4 w-4" /> My Account</Link>
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
                    <span className="italic font-light text-white">{content['home_hero_subtitle'] || 'DESIRE'}</span>
                </h1>

                <p className="text-xl md:text-2xl text-zinc-300 max-w-2xl mx-auto mb-12 font-light leading-relaxed mix-blend-plus-lighter">
                    {content['home_hero_description'] || 'Where aesthetics meet indulgence. Explore curated collections for the modern provocateur.'}
                </p>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href={content['home_hero_cta_link'] || '/shops'}>
                        <Button size="lg" className="bg-white text-black hover:bg-zinc-200 text-lg px-8 py-6 rounded-full font-bold tracking-tight shadow-[0_0_40px_-5px_rgba(255,255,255,0.4)] transition-all">
                            {content['home_hero_cta_label'] || 'Explore The Collections'}
                        </Button>
                    </Link>
                </motion.div>
            </motion.section>

            {/* Stores Grid - "The Portals" */}
            <section className="relative z-20 py-32 bg-black">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={containerVariants}
                        className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto"
                    >
                        {stores?.map((store, index) => {
                            // Determine Dynamic Cover Image based on slug
                            let dynamicCover = null
                            if (store.slug === 'the-red-room') dynamicCover = content['store_cover_sex']
                            if (store.slug === 'the-lounge') dynamicCover = content['store_cover_smoke']

                            return (
                                <motion.div variants={itemVariants} key={store.id}>
                                    <div className="group block relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/10">
                                        {/* Store Image / Video Placeholder */}
                                        <div className="absolute inset-0 bg-zinc-900 transition-transform duration-700 group-hover:scale-110">
                                            {dynamicCover ? (
                                                dynamicCover.match(/\.(mp4|webm|ogg)$/i) ? (
                                                    <video src={dynamicCover} autoPlay muted loop playsInline className="w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-opacity" />
                                                ) : (
                                                    <img src={dynamicCover} alt={store.name} className="w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-opacity" />
                                                )
                                            ) : store.image_url ? (
                                                <img src={store.image_url} alt={store.name} className="w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-opacity" />
                                            ) : (
                                                <div className={`w-full h-full bg-gradient-to-br ${index === 0 ? 'from-pink-900 via-black to-purple-900' : 'from-green-900 via-black to-yellow-900'}`} />
                                            )}
                                        </div>

                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                                        {/* Content Wrapper - Using div to handle spacing, Link is on the button */}
                                        <div className="absolute inset-0 p-12 flex flex-col justify-between pointer-events-none">
                                            <div className="flex justify-between items-start">
                                                <div className="px-4 py-1 rounded-full border border-white/20 bg-black/30 backdrop-blur-md text-xs font-bold uppercase tracking-widest text-white">
                                                    {store.slug === 'the-red-room' ? 'The Red Room' : 'The Lounge'}
                                                </div>
                                                <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                                                    <ArrowRight className="h-5 w-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-2xl font-serif font-bold text-white mb-2">{store.slug === 'the-red-room' ? 'The Red Room' : 'The Lounge'}</h3>
                                                <p className="text-zinc-300 mb-6">{store.description}</p>
                                                <Button asChild className={`w-full text-white border-0 pointer-events-auto ${store.slug === 'the-red-room' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
                                                    <Link href={`/shops/${store.slug}`}>Enter {store.slug === 'the-red-room' ? 'Red Room' : 'Lounge'}</Link>
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Full Card Clickable Overlay (Alternative to nested Link) */}
                                        <Link href={`/shops/${store.slug}`} className="absolute inset-0 z-10" aria-label={`Enter ${store.name}`} />
                                    </div>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                </div>
            </section >

            {/* Instagram / Social Proof Section */}
            {/* Instagram / Social Proof Section */}
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

            {/* Marketplace Highlights */}
            <section className="py-24 px-6 bg-zinc-950">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <span className="text-primary text-sm font-bold uppercase tracking-widest">Curated for You</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white">Marketplace Favorites</h2>
                        <p className="text-zinc-400 max-w-2xl mx-auto">
                            Strictly filtered selection from our most exclusive vendors.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6">
                        {featuredProducts.length > 0 ? (
                            featuredProducts.map(product => (
                                <Link key={product.id} href={`/shops/${product.stores?.slug}/${product.store_categories?.slug}/${product.slug}`} className="group">
                                    <div className="aspect-[4/5] bg-zinc-900 rounded-lg overflow-hidden mb-4 relative">
                                        {product.images?.[0] && (
                                            <Image
                                                src={product.images[0]}
                                                alt={product.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        )}
                                        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur px-2 py-1 rounded text-xs font-bold uppercase text-white">
                                            {product.stores?.name}
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-serif font-bold text-white group-hover:text-primary transition-colors">{product.name}</h3>
                                    <p className="text-zinc-500">${product.price}</p>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 border border-dashed border-zinc-800 rounded-2xl">
                                <p className="text-zinc-500 italic">Curating best sellers...</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </div >
    )
}
