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
    ChevronDown,
    MessageCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/cart-context'
import { useChat } from '@/providers/chat-provider'
import { StoreHeader } from '@/components/storefront/StoreHeader'
import { StoreFooter } from '@/components/storefront/StoreFooter'
import { toast } from 'sonner'
import { Store, Product } from '@/types'
import { cn } from '@/lib/utils'

interface MinimalProductDetailProps {
    store: Store
    product: Product
}

export function MinimalProductDetail({ store, product }: MinimalProductDetailProps) {
    const router = useRouter()
    const { addItem, items, updateQuantity } = useCart()
    const { startInquiryChat } = useChat()

    const cartItem = items.find(i => i.product.id === product.id)
    const quantity = cartItem?.quantity || 0

    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const images = (product.images && product.images.length > 0) ? product.images : [product.image_url || '']
    const validImages = images.filter(Boolean)

    const themeColor = store.theme_color || '#000000'

    const handleAddToCart = () => {
        addItem(product)
        toast.success(`Agregado a la bolsa`)
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
        <div className="min-h-screen bg-white font-sans text-zinc-900 pb-20">
            <StoreHeader store={store} themeColor={themeColor} />

            <div className="container mx-auto px-4 md:px-6 pt-10 md:pt-16 pb-20">
                {/* 3-Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

                    {/* --- LEFT COLUMN: Description & Details (Order 2 on Mobile, 1 on Desktop) --- */}
                    <div className="lg:col-span-3 flex flex-col gap-8 order-2 lg:order-1">

                        {/* Description */}
                        <div>
                            <div className="prose prose-sm prose-zinc max-w-none text-zinc-600 leading-relaxed font-light">
                                <p>{product.description}</p>
                            </div>
                        </div>

                        {/* Dummy "Read More" Accordion */}
                        <div className="border-t border-zinc-200 pt-4">
                            <button className="flex items-center justify-between w-full text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">
                                Read More <ChevronDown className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Dummy "Shipping" Accordion */}
                        <div className="border-t border-zinc-200 pt-4">
                            <button className="flex items-center justify-between w-full text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">
                                Shipping & Returns <ChevronDown className="h-4 w-4" />
                            </button>
                        </div>

                    </div>


                    {/* --- CENTER COLUMN: Product Image (Order 1 on Mobile, 2 on Desktop) --- */}
                    <div className="lg:col-span-6 order-1 lg:order-2">
                        <div className="relative aspect-3/4 w-full bg-zinc-50 overflow-hidden group">
                            {validImages.length > 0 ? (
                                <Image
                                    src={validImages[selectedImageIndex]}
                                    alt={product.name}
                                    fill
                                    className="object-cover object-center"
                                    priority
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-300">
                                    <span className="text-sm uppercase font-bold tracking-widest">Sin Imagen</span>
                                </div>
                            )}

                            {/* Navigation Arrows */}
                            {validImages.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/80 hover:bg-white backdrop-blur-sm border border-zinc-200 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/80 hover:bg-white backdrop-blur-sm border border-zinc-200 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Image Dots */}
                        {validImages.length > 1 && (
                            <div className="flex justify-center gap-2 mt-4">
                                {validImages.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImageIndex(idx)}
                                        className={cn(
                                            "h-1.5 w-1.5 rounded-full transition-all",
                                            idx === selectedImageIndex ? "bg-zinc-900 w-3" : "bg-zinc-300"
                                        )}
                                    />
                                ))}
                            </div>
                        )}
                    </div>


                    {/* --- RIGHT COLUMN: Actions & Price (Order 3) --- */}
                    <div className="lg:col-span-3 flex flex-col gap-6 order-3">
                        <div>
                            <h1 className="text-2xl font-bold text-zinc-900 mb-1 leading-tight font-serif">
                                {product.name}
                            </h1>
                            {/* SKU placeholder */}
                            <p className="text-[10px] text-zinc-400 font-mono mb-4 uppercase">
                                REF: {product.slug?.substring(0, 8) || product.id.substring(0, 8)}
                            </p>

                            <p className="text-xl font-medium text-zinc-900">
                                ${Number(product.price).toFixed(2)}
                            </p>
                        </div>

                        {/* Mock Size Selector */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold uppercase tracking-wider text-zinc-500">Size</span>
                                <button className="underline text-zinc-400 hover:text-zinc-600">Size Guide</button>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                                    <button
                                        key={size}
                                        className="h-10 border border-zinc-200 flex items-center justify-center text-sm hover:border-zinc-900 hover:bg-zinc-50 transition-colors focus:border-black focus:bg-zinc-900 focus:text-white"
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3 pt-4 border-t border-zinc-100">
                            {quantity === 0 ? (
                                <Button
                                    className="w-full h-12 bg-black text-white hover:bg-zinc-800 rounded-none uppercase tracking-widest text-xs font-bold"
                                    onClick={handleAddToCart}
                                >
                                    Add to Bag
                                </Button>
                            ) : (
                                <div className="flex items-center justify-between border border-zinc-200 h-12 px-2 w-full">
                                    <button
                                        className="h-full px-3 text-zinc-500 hover:text-black"
                                        onClick={() => updateQuantity(product.id, Math.max(0, quantity - 1))}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="font-bold text-sm">{quantity}</span>
                                    <button
                                        className="h-full px-3 text-zinc-500 hover:text-black"
                                        onClick={() => updateQuantity(product.id, quantity + 1)}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                            )}

                            <Button
                                variant="outline"
                                className="w-full h-12 border-zinc-200 text-zinc-900 hover:bg-zinc-50 rounded-none uppercase tracking-widest text-xs font-bold"
                                onClick={() => toast.success('Added to Wishlist')}
                            >
                                Save to Wishlist
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full h-10 text-zinc-500 hover:text-zinc-900 text-xs"
                                onClick={() => startInquiryChat(store.id, product)}
                            >
                                <MessageCircle className="mr-2 h-3 w-3" /> Preguntar al vendedor
                            </Button>

                        </div>

                        {/* Free Delivery Note */}
                        <div className="bg-zinc-50 p-4 text-xs text-zinc-600 leading-relaxed">
                            <p>
                                <span className="font-bold block mb-1">Free Delivery available.</span>
                                Members get free standard delivery on orders over $50.
                            </p>
                        </div>

                    </div>

                </div>

                {/* Recommendations Section (Placeholder) */}
                <div className="mt-24 pt-12 border-t border-zinc-100">
                    <h3 className="text-center font-serif text-xl md:text-2xl font-bold mb-10">Who Viewed This Also Viewed</h3>
                    {/* Placeholder for a recommendation grid - could reuse ProductCard if data available */}
                    <div className="text-center text-zinc-400 text-sm italic">
                        Recommended products would appear here
                    </div>
                </div>

            </div>

            {/* Mobile Sticky Add to Cart (Only visible on small screens) */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-zinc-100 z-40 safe-area-bottom">
                {quantity === 0 ? (
                    <Button
                        size="lg"
                        className="w-full h-12 text-sm uppercase tracking-widest font-bold bg-black text-white rounded-none shadow-lg"
                        onClick={handleAddToCart}
                    >
                        Add to Bag - ${Number(product.price).toFixed(2)}
                    </Button>
                ) : (
                    <Link href="/cart" className="block w-full">
                        <Button size="lg" className="w-full h-12 text-sm uppercase tracking-widest font-bold bg-zinc-900 text-white rounded-none">
                            View Bag ({quantity})
                        </Button>
                    </Link>
                )}
            </div>

            <StoreFooter store={store} themeColor={themeColor} />
        </div>
    )
}
