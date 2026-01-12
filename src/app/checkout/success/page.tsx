
'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { useEffect } from 'react'
import { useCart } from '@/context/cart-context'

export default function CheckoutSuccessPage() {
    // Optional: could grab order ID from URL params if we passed it
    // For now, just a generic success message

    // Ensure cart is cleared (redundant safety check if page reached directly)
    // In a real app, we'd verify the session/order.

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-green-500/10 text-green-500 p-6 rounded-full mb-8 animate-in zoom-in duration-500">
                <CheckCircle2 className="h-24 w-24" />
            </div>

            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Order Placed Successfully!</h1>
            <p className="text-zinc-400 text-lg max-w-md mb-10 leading-relaxed">
                Thank you for your purchase. You will receive a confirmation email with your order details shortly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/">
                    <Button size="lg" className="h-14 px-8 rounded-full bg-white text-black hover:bg-zinc-200 font-bold text-lg">
                        Continue Shopping
                    </Button>
                </Link>
                <Link href="/dashboard">
                    <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-zinc-700 text-white hover:bg-zinc-800">
                        View Order Status <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </div>
        </div>
    )
}
