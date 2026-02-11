'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, Minus, CreditCard, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/cart-context'
import { Product, Store } from '@/types'
import { cn } from '@/lib/utils'

interface MinimalProductCardProps {
    product: Product
    store: Store
    aspectRatio?: string
}

export function MinimalProductCard({ product, store, aspectRatio = 'aspect-[3/4]' }: MinimalProductCardProps) {
    const { addItem, updateQuantity, items } = useCart()
    const cartItem = items.find(i => i.product.id === product.id)
    const quantity = cartItem?.quantity || 0

    // Detect if it's a builder/mock product
    const isMock = product.id.startsWith('mock-');
    const productUrl = `/shops/${store.slug}/product/${product.slug || product.id}${isMock ? '?mode=builder' : ''}`;

    const handleIncrement = (e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
        if (quantity === 0) {
            addItem(product)
        } else {
            updateQuantity(product.id, quantity + 1)
        }
    }

    const handleDecrement = (e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
        if (quantity > 1) {
            updateQuantity(product.id, quantity - 1)
        } else {
            updateQuantity(product.id, 0)
        }
    }

    return (
        <div className="group relative bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 flex flex-col h-full">
            {/* Image */}
            <div className={cn("relative w-full bg-zinc-100 overflow-hidden", aspectRatio)}>
                <Link href={productUrl} className="block w-full h-full relative">
                    {product.image_url ? (
                        <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-300">No Image</div>
                    )}
                    {/* Badge */}
                    {(product.stock || 0) < 5 && (product.stock || 0) > 0 && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                            Low Stock
                        </div>
                    )}
                </Link>
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                    <div className="flex justify-between items-start mb-1 h-12">
                        <Link href={productUrl}>
                            <h4 className="font-sans font-medium text-zinc-900 leading-tight line-clamp-2 hover:text-zinc-600 transition text-sm">
                                {product.name}
                            </h4>
                        </Link>
                    </div>

                    <div className="flex items-baseline gap-2 mb-3">
                        <span className="font-mono text-base font-bold text-zinc-900">${product.price.toFixed(2)}</span>
                    </div>

                    {/* Features Badges (Optional - kept minimal) */}
                    {product.price > 1000 && (
                        <div className="mb-3 space-y-1">
                            <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                                <CreditCard className="h-3 w-3 text-emerald-600" />
                                3 MSI de ${(product.price / 3).toFixed(2)}
                            </div>
                        </div>
                    )}
                </div>

                {/* All-Black Action Button (Fred Perry Style) */}
                <div className="mt-auto pt-4 border-t border-zinc-100">
                    {quantity === 0 ? (
                        <Button
                            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg h-10 font-bold text-[10px] uppercase tracking-widest opacity-90 group-hover:opacity-100 transition-opacity"
                            onClick={handleIncrement}
                        >
                            Add to Bag
                        </Button>
                    ) : (
                        <div className="flex items-center justify-between bg-zinc-900 text-white p-1 rounded-lg w-full h-10">
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-white hover:bg-white/20 rounded-md"
                                onClick={handleDecrement}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="font-mono text-sm font-bold">{quantity}</span>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-white hover:bg-white/20 rounded-md"
                                onClick={handleIncrement}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
