'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    ShoppingCart,
    Heart,
    ChevronLeft,
    ChevronRight,
    Minus,
    Plus,
    MessageCircle,
    ShoppingBag,
    ArrowLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/cart-context'
import { useChat } from '@/providers/chat-provider'
import { toast } from 'sonner'
import { Store, Product } from '@/types'
import { cn } from '@/lib/utils'
import { NotificationBell } from '@/components/ui/notification-bell'

interface DarkProductDetailProps {
    store: Store
    product: Product
}

export function DarkProductDetail({ store, product }: DarkProductDetailProps) {
    const router = useRouter()
    const { addItem, items, updateQuantity, toggleCart, cartCount } = useCart()
    const { startInquiryChat } = useChat()

    const cartItem = items.find(i => i.product.id === product.id)
    const quantity = cartItem?.quantity || 0

    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const images = (product.images && product.images.length > 0) ? product.images : [product.image_url || '']
    const validImages = images.filter(Boolean)

    const handleAddToCart = () => {
        addItem(product)
        toast.success(`Added to cart`)
    }

    const nextImage = () => {
        if (validImages.length <= 1) return
        setSelectedImageIndex((prev) => (prev + 1) % validImages.length)
    }

    const prevImage = () => {
        if (validImages.length <= 1) return
        setSelectedImageIndex((prev) => (prev - 1 + validImages.length) % validImages.length)
    }

    return (
        <div className="min-h-screen bg-black font-sans text-white pb-20 selection:bg-rose-500/30">
            {/* Header (Simplified from DarkSocialTheme) */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href={`/shops/${store.slug}`} className="text-zinc-400 hover:text-white transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <span className="text-xl font-serif font-bold tracking-tight">{store.name}</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <Button
                            variant="ghost"
                            className="text-white hover:bg-white/10 rounded-full h-10 w-10 p-0 relative"
                            onClick={toggleCart}
                        >
                            <ShoppingBag className="h-5 w-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 h-4 w-4 bg-rose-600 text-[10px] font-black text-white rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 md:px-6 pt-32 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* --- LEFT: Images --- */}
                    <div className="relative aspect-square w-full bg-zinc-900 rounded-2xl overflow-hidden border border-white/10">
                        {validImages.length > 0 ? (
                            <Image
                                src={validImages[selectedImageIndex]}
                                alt={product.name}
                                fill
                                className="object-cover object-center"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-700">
                                <span className="text-sm uppercase font-bold tracking-widest">No Image</span>
                            </div>
                        )}

                        {/* Navigation */}
                        {validImages.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 bg-black/50 hover:bg-black/80 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center transition-all text-white"
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 bg-black/50 hover:bg-black/80 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center transition-all text-white"
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </button>
                            </>
                        )}

                        {/* Dots */}
                        {validImages.length > 1 && (
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                                {validImages.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImageIndex(idx)}
                                        className={cn(
                                            "h-2 w-2 rounded-full transition-all shadow-sm",
                                            idx === selectedImageIndex ? "bg-white w-4" : "bg-white/30 hover:bg-white/50"
                                        )}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* --- RIGHT: Details --- */}
                    <div className="flex flex-col justify-center space-y-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider border border-rose-500/20">
                                    New Drop
                                </span>
                                {product.store_type && (
                                    <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 text-xs font-bold uppercase tracking-wider border border-white/10">
                                        {product.store_type.replace('-', ' ')}
                                    </span>
                                )}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                                {product.name}
                            </h1>
                            <p className="text-2xl font-bold text-white mb-6">
                                ${Number(product.price).toFixed(2)}
                            </p>
                            <p className="text-zinc-400 text-lg leading-relaxed font-light">
                                {product.description}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-4 pt-8 border-t border-white/10">
                            {quantity === 0 ? (
                                <Button
                                    size="lg"
                                    className="w-full h-14 bg-white text-black hover:bg-zinc-200 rounded-full text-sm font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                                    onClick={handleAddToCart}
                                >
                                    Add to Cart
                                </Button>
                            ) : (
                                <div className="flex items-center justify-between w-full h-14 bg-zinc-900 border border-white/20 rounded-full px-2">
                                    <button
                                        className="h-full w-14 flex items-center justify-center text-white hover:text-rose-500 transition-colors"
                                        onClick={() => updateQuantity(product.id, Math.max(0, quantity - 1))}
                                    >
                                        <Minus className="h-6 w-6" />
                                    </button>
                                    <span className="text-lg font-bold">{quantity}</span>
                                    <button
                                        className="h-full w-14 flex items-center justify-center text-white hover:text-green-500 transition-colors"
                                        onClick={() => updateQuantity(product.id, quantity + 1)}
                                    >
                                        <Plus className="h-6 w-6" />
                                    </button>
                                </div>
                            )}

                            <Button
                                variant="outline"
                                className="w-full h-14 border-white/20 text-white hover:bg-white/10 rounded-full font-bold uppercase tracking-widest"
                                onClick={() => startInquiryChat(store.id, product)}
                            >
                                <MessageCircle className="mr-2 h-5 w-5" /> Chat with Vendor
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
