'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
    ShoppingBag, MessageCircle, ArrowLeft, Menu, X,
    Search, ChevronDown, User as UserIcon
} from 'lucide-react'
import { useCart } from '@/context/cart-context'
import { useChat } from '@/providers/chat-provider'
import { createClient } from '@/utils/supabase/client'
import { cn } from '@/lib/utils'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface StoreNavbarProps {
    store: any
    categories?: any[]
    user?: any
}

export function StoreNavbar({ store, categories = [], user }: StoreNavbarProps) {
    const router = useRouter()
    const supabase = createClient()
    const { cartCount, toggleCart } = useCart()
    const { startInquiryChat } = useChat()
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [activeCategory, setActiveCategory] = useState('all')

    // Accent color from store or default
    const accent = store?.theme_color || '#ff007f'

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handler)
        return () => window.removeEventListener('scroll', handler)
    }, [])

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false)
    }, [])

    return (
        <>
            <header
                className={cn(
                    'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                    scrolled
                        ? 'bg-black/90 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
                        : 'bg-transparent'
                )}
            >
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-18 flex items-center justify-between gap-4">
                    {/* Left: Back + Logo */}
                    <div className="flex items-center gap-3 md:gap-4 min-w-0">
                        <Link
                            href="/shops"
                            className="flex-shrink-0 text-zinc-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
                            title="Volver al marketplace"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>

                        <Link href={`/shops/${store?.slug}`} className="flex items-center gap-2.5 min-w-0">
                            {store?.logo_url && (
                                <div className="h-8 w-8 rounded-full overflow-hidden border border-white/10 flex-shrink-0">
                                    <Image src={store.logo_url} alt={store.name} width={32} height={32} className="object-cover" />
                                </div>
                            )}
                            <span className="text-white font-bold text-base tracking-tight truncate">
                                {store?.name}
                            </span>
                        </Link>
                    </div>

                    {/* Center: Category nav (desktop) */}
                    {categories.length > 0 && (
                        <nav className="hidden md:flex items-center gap-1">
                            <button
                                onClick={() => setActiveCategory('all')}
                                className={cn(
                                    'px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all',
                                    activeCategory === 'all'
                                        ? 'text-black'
                                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                                )}
                                style={activeCategory === 'all' ? { backgroundColor: accent } : {}}
                            >
                                Todo
                            </button>
                            {categories.slice(0, 5).map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={cn(
                                        'px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all',
                                        activeCategory === cat.id
                                            ? 'text-black'
                                            : 'text-zinc-400 hover:text-white hover:bg-white/5'
                                    )}
                                    style={activeCategory === cat.id ? { backgroundColor: accent } : {}}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </nav>
                    )}

                    {/* Right: Actions */}
                    <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                        {/* Chat */}
                        <button
                            onClick={() => startInquiryChat(store?.id)}
                            className="h-9 w-9 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                            title="Contactar tienda"
                        >
                            <MessageCircle className="h-[18px] w-[18px]" />
                        </button>

                        {/* Cart */}
                        <button
                            onClick={toggleCart}
                            className="h-9 w-9 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all relative"
                            title="Carrito"
                        >
                            <ShoppingBag className="h-[18px] w-[18px]" />
                            {cartCount > 0 && (
                                <span
                                    className="absolute -top-0.5 -right-0.5 h-4 w-4 text-[9px] font-black text-white rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: accent }}
                                >
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* User */}
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="h-8 w-8 rounded-full overflow-hidden border border-white/20 flex-shrink-0 hover:border-white/40 transition-all">
                                        {user.avatar_url ? (
                                            <Image src={user.avatar_url} alt="User" width={32} height={32} className="object-cover" />
                                        ) : (
                                            <div className="h-full w-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-white">
                                                {user.email?.[0]?.toUpperCase()}
                                            </div>
                                        )}
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-48 bg-zinc-900 border-zinc-800 text-white" align="end">
                                    <DropdownMenuLabel className="text-xs text-zinc-500">Mi cuenta</DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-white/10" />
                                    <DropdownMenuItem className="focus:bg-white/10 cursor-pointer text-sm" onClick={() => router.push('/dashboard/buyer')}>
                                        Dashboard
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="focus:bg-white/10 cursor-pointer text-sm" onClick={() => router.push('/dashboard/orders')}>
                                        Mis pedidos
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-white/10" />
                                    <DropdownMenuItem className="focus:bg-white/10 cursor-pointer text-sm text-red-400" onClick={() => supabase.auth.signOut().then(() => router.refresh())}>
                                        Cerrar sesión
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <button
                                onClick={() => router.push('/login')}
                                className="hidden md:flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-white/5"
                            >
                                <UserIcon className="h-3.5 w-3.5" /> Entrar
                            </button>
                        )}

                        {/* Hamburger (mobile) */}
                        {categories.length > 0 && (
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="md:hidden h-9 w-9 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                            >
                                {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile category menu */}
                {mobileOpen && categories.length > 0 && (
                    <div className="md:hidden border-t border-white/5 bg-black/95 backdrop-blur-xl px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => { setActiveCategory('all'); setMobileOpen(false) }}
                                className={cn('px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all', activeCategory === 'all' ? 'text-black' : 'bg-white/5 text-zinc-400')}
                                style={activeCategory === 'all' ? { backgroundColor: accent } : {}}
                            >
                                Todo
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => { setActiveCategory(cat.id); setMobileOpen(false) }}
                                    className={cn('px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all', activeCategory === cat.id ? 'text-black' : 'bg-white/5 text-zinc-400')}
                                    style={activeCategory === cat.id ? { backgroundColor: accent } : {}}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </header>

            {/* Spacer so content doesn't hide under fixed header */}
            <div className="h-16 md:h-18" />
        </>
    )
}
