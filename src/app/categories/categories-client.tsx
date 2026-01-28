'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"

interface Category {
    label: string
    link: string
    image?: string
}

interface CategoriesClientProps {
    categories: Category[]
    footer: React.ReactNode
}

export default function CategoriesClient({ categories, footer }: CategoriesClientProps) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 50 } as any
        }
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-primary/30">
            {/* Header / Nav */}
            <header className="fixed w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                        <ArrowLeft className="h-5 w-5" /> <span className="hidden md:inline">Back to Home</span>
                    </Link>
                    <span className="text-xl font-serif font-bold tracking-tighter">AMERICANA</span>

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
                                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                                    <Link href="/categories" className="text-primary transition-colors">Categorías</Link>
                                    <Link href="#" className="hover:text-primary transition-colors">Editorial</Link>
                                    <Link href="#" className="hover:text-primary transition-colors">El Club</Link>
                                    <Link href="/#stores" className="hover:text-primary transition-colors">Tiendas</Link>
                                    <Link href="/login" className="hover:text-primary transition-colors">My Account</Link>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <div className="hidden md:block w-24" /> {/* Spacer */}
                </div>
            </header>

            <main className="pt-32 pb-24 container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16 text-center"
                >
                    <h1 className="text-5xl md:text-7xl font-serif font-black mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-600">
                        Collections
                    </h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-lg font-light">
                        Explore our curated selections defined by aesthetics, mood, and desire.
                    </p>
                </motion.div>

                {categories.length === 0 ? (
                    <div className="text-center text-zinc-500 py-20">Loading collections...</div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {categories.map((cat, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10"
                            >
                                <Link href={cat.link} className="block w-full h-full">
                                    <div className="absolute inset-0 bg-zinc-900">
                                        {cat.image ? (
                                            cat.image.endsWith('.mp4') || cat.image.endsWith('.webm') ? (
                                                <video
                                                    src={cat.image}
                                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                                                    muted
                                                    loop
                                                    autoPlay
                                                    playsInline
                                                />
                                            ) : (
                                                <img
                                                    src={cat.image}
                                                    alt={cat.label}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-60"
                                                />
                                            )
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-black" />
                                        )}
                                    </div>

                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                        <h2 className="text-3xl font-serif font-bold text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                            {cat.label}
                                        </h2>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0 delay-100">
                                            <span className="inline-flex items-center gap-2 text-primary font-bold tracking-widest text-xs uppercase border border-primary/30 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md">
                                                Explore <ArrowRight className="h-3 w-3" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </main>

            {footer}
        </div>
    )
}
