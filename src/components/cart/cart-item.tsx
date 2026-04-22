
'use client'

import { CartItem as CartItemType, useCart } from '@/context/cart-context'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface CartItemProps {
    item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
    const { updateQuantity, removeItem } = useCart()
    const { product, quantity } = item

    return (
        <div className="flex gap-4 py-4 border-b border-white/5 group">
            {/* Image */}
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-white/10 bg-zinc-900 group-hover:border-white/20 transition-colors">
                {(product.images?.[0] || product.image_url) ? (
                    <img
                        src={product.images?.[0] || product.image_url}
                        alt={product.name}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                        No Image
                    </div>
                )}
            </div>

            {/* Details */}
            <div className="flex flex-1 flex-col justify-between">
                <div>
                    <h4 className="text-sm font-bold text-white line-clamp-2 tracking-tight leading-snug">{product.name}</h4>
                    <p className="mt-1 text-xs font-mono text-zinc-500 uppercase tracking-widest">${Number(product.price).toFixed(2)}</p>
                </div>

                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3 bg-zinc-900/50 rounded-lg p-1 border border-white/5">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-md text-zinc-500 hover:text-white hover:bg-white/5"
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                        >
                            <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-xs font-bold w-4 text-center text-white">{quantity}</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-md text-zinc-500 hover:text-white hover:bg-white/5"
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                        >
                            <Plus className="h-3 w-3" />
                        </Button>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-700 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                        onClick={() => removeItem(product.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
