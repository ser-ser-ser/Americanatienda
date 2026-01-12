'use client'

import { useCart } from '@/context/cart-context'
import { Button } from '@/components/ui/button'
import { Minus, Plus, Trash2, ArrowRight, ArrowLeft, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function CartPage() {
    const { items, removeItem, updateQuantity, cartTotal } = useCart()

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-zinc-900/50 p-6 rounded-full mb-6 text-zinc-500">
                    <ShoppingBag className="h-10 w-10" />
                </div>
                <h1 className="text-3xl font-serif mb-2">Your Cart is Empty</h1>
                <p className="text-zinc-400 mb-8 max-w-sm">Looks like you haven't added anything to your cart yet.</p>
                <Link href="/">
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white hover:text-black transition-colors rounded-full px-8">
                        Start Shopping
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-zinc-800">
            <header className="fixed w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="text-sm text-zinc-400 hover:text-white flex items-center gap-2 transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Continue Shopping
                    </Link>
                    <div className="font-serif font-bold tracking-tight">SHOPPING BAG ({items.length})</div>
                    <div className="w-20" /> {/* Spacer */}
                </div>
            </header>

            <main className="container mx-auto px-6 pt-32 pb-20">
                <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-6">
                        {items.map((item) => (
                            <div key={item.product.id} className="group flex gap-6 bg-zinc-900/30 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                {/* Product Image */}
                                <div className="h-28 w-28 bg-zinc-800 rounded-lg overflow-hidden shrink-0 relative">
                                    {item.product.images?.[0] ? (
                                        <Image
                                            src={item.product.images[0]}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                            <ShoppingBag className="h-8 w-8" />
                                        </div>
                                    )}
                                </div>

                                {/* Product Details */}
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-serif font-bold text-lg line-clamp-1">{item.product.name}</h3>
                                            <p className="font-mono text-lg">${(item.product.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                        <p className="text-zinc-500 text-sm line-clamp-2">{item.product.description}</p>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-3 bg-black border border-zinc-800 rounded-full h-9 px-1">
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                                            >
                                                <Minus className="h-3 w-3" />
                                            </button>
                                            <span className="text-sm font-mono w-4 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                                            >
                                                <Plus className="h-3 w-3" />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeItem(item.product.id)}
                                            className="text-zinc-500 hover:text-red-500 transition-colors text-sm flex items-center gap-1.5"
                                        >
                                            <Trash2 className="h-4 w-4" /> Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-zinc-900/50 rounded-2xl p-6 border border-white/5 sticky top-24">
                            <h2 className="text-xl font-serif font-bold mb-6">Order Summary</h2>

                            <div className="space-y-3 text-sm text-zinc-400 mb-6 pb-6 border-b border-white/5">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="text-white font-mono">${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping Estimate</span>
                                    <span className="text-green-500">Free</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax Estimate</span>
                                    <span className="text-zinc-600">Calculated at checkout</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end mb-8 relative">
                                <span className="text-lg font-bold">Total</span>
                                <span className="text-2xl font-mono font-bold">${cartTotal.toFixed(2)}</span>
                            </div>

                            <Link href="/checkout" className="block">
                                <Button className="w-full h-12 rounded-full bg-white text-black hover:bg-zinc-200 font-bold text-base">
                                    Checkout <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>

                            <div className="mt-6 flex justify-center gap-4 text-zinc-600 grayscale opacity-50">
                                {/* Simplified Payment Icons Text */}
                                <span className="text-[10px] uppercase font-bold tracking-widest">Secure Checkout</span>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    )
}
