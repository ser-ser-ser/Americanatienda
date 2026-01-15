
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
        <div className="flex gap-4 py-4 border-b border-zinc-800">
            {/* Image */}
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-zinc-800 bg-zinc-900">
                {(product.images?.[0] || product.image_url) ? (
                    <img
                        src={product.images?.[0] || product.image_url}
                        alt={product.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-xs text-zinc-500">
                        No Image
                    </div>
                )}
            </div>

            {/* Details */}
            <div className="flex flex-1 flex-col justify-between">
                <div>
                    <h4 className="text-sm font-medium text-white line-clamp-2">{product.name}</h4>
                    <p className="mt-1 text-sm text-zinc-400">$ {product.price}</p>
                </div>

                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full border-zinc-700 bg-transparent text-zinc-400 hover:bg-zinc-800 hover:text-white"
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                        >
                            <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm w-4 text-center text-white">{quantity}</span>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full border-zinc-700 bg-transparent text-zinc-400 hover:bg-zinc-800 hover:text-white"
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                        >
                            <Plus className="h-3 w-3" />
                        </Button>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-500 hover:text-red-500 hover:bg-transparent"
                        onClick={() => removeItem(product.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
