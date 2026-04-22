
'use client'

import Link from 'next/link'
import { ArrowLeft, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/cart-context'

interface StoreHeaderProps {
    storeSlug?: string
    categorySlug?: string
}

export function StoreHeader({ storeSlug, categorySlug }: StoreHeaderProps) {
    const { toggleCart, cartCount } = useCart()

    return (
        <header className="fixed w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                {storeSlug && categorySlug ? (
                    <Link href={`/${storeSlug}/${categorySlug}`} className="text-sm text-zinc-400 hover:text-white flex items-center gap-2 transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Back to {categorySlug}
                    </Link>
                ) : (
                    <Link href="/" className="text-sm text-zinc-400 hover:text-white flex items-center gap-2 transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Back Home
                    </Link>
                )}

                <div className="font-serif font-bold tracking-tight">AMERICANA</div>

                <Button variant="ghost" size="icon" className="text-white relative" onClick={toggleCart}>
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold">
                            {cartCount}
                        </span>
                    )}
                </Button>
            </div>
        </header>
    )
}
