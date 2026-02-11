'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, MessageCircle, UserPlus, Share2, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/context/cart-context'
import { Store } from '@/types'

interface StoreHeaderProps {
    store: Store
    themeColor: string
}

export function StoreHeader({ store, themeColor }: StoreHeaderProps) {
    const { toggleCart, cartCount } = useCart()
    const router = useRouter()

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-zinc-100">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

                {/* Mobile Menu */}
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="-ml-2">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[80vw] bg-white text-black">
                            <nav className="flex flex-col gap-6 mt-10 text-2xl font-light">
                                <Link href={`/shops/${store.slug}`} onClick={() => document.getElementById('close-sheet')?.click()}>
                                    Inicio
                                </Link>
                                <Link href={`/shops/${store.slug}/collections`} onClick={() => document.getElementById('close-sheet')?.click()}>
                                    Colección
                                </Link>
                                <Link href={`/shops/${store.slug}/about`} onClick={() => document.getElementById('close-sheet')?.click()}>
                                    Quiénes Somos
                                </Link>
                                <Link href={`/shops/${store.slug}#visit`} onClick={() => document.getElementById('close-sheet')?.click()}>
                                    Contacto
                                </Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Logo / Brand Name */}
                <Link href={`/shops/${store.slug}`} className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 md:flex-1">
                    <h1 className="text-xl font-bold tracking-tight uppercase hover:opacity-80 transition" style={{ color: themeColor }}>
                        {store.name}
                    </h1>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex gap-8 text-sm font-medium tracking-wide mr-8">
                    <Link href={`/shops/${store.slug}`} className="hover:opacity-70 transition" style={{ color: themeColor }}>
                        Inicio
                    </Link>
                    <Link href={`/shops/${store.slug}/collections`} className="hover:opacity-70 transition" style={{ color: themeColor }}>
                        Colección
                    </Link>
                    {/* Sections on Home Page */}
                    <Link href={`/shops/${store.slug}#visit`} className="hover:opacity-70 transition" style={{ color: themeColor }}>
                        Visítanos
                    </Link>
                    <Link href={`/shops/${store.slug}/about`} className="hover:opacity-70 transition" style={{ color: themeColor }}>
                        Quiénes Somos
                    </Link>
                </nav>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    {/* Chat with Vendor */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-zinc-900"
                        onClick={() => router.push(`/dashboard/buyer/messages/new?recipient=${store.owner_id}`)}
                    >
                        <MessageCircle className="h-5 w-5" style={{ color: themeColor }} />
                    </Button>

                    {/* Follow */}
                    <Button variant="ghost" size="icon" className="hidden md:flex text-zinc-900">
                        <UserPlus className="h-5 w-5" style={{ color: themeColor }} />
                    </Button>

                    {/* Share */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="hidden md:flex text-zinc-900"
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({ title: store.name, url: window.location.href })
                            } else {
                                alert('Link copiado al portapapeles') // Simple fallback
                            }
                        }}
                    >
                        <Share2 className="h-5 w-5" style={{ color: themeColor }} />
                    </Button>

                    <div className="h-6 w-px bg-zinc-200 mx-1 hidden md:block" />

                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative text-zinc-900 group"
                        onClick={toggleCart}
                    >
                        <ShoppingBag className="h-5 w-5 group-hover:scale-110 transition-transform" style={{ color: themeColor }} />
                        {cartCount > 0 && (
                            <Badge className="absolute -top-1 -right-1 px-1.5 h-4 min-w-4 flex items-center justify-center text-[10px] bg-black text-white border-none rounded-full">
                                {cartCount}
                            </Badge>
                        )}
                    </Button>
                </div>
            </div>
        </header>
    )
}
