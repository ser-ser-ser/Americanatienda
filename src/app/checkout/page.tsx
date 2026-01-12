
'use client'

import { useState } from 'react'
import { useCart } from '@/context/cart-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'

export default function CheckoutPage() {
    const { items, cartTotal, clearCart } = useCart()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        zip: ''
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        if (items.length === 0) {
            toast.error("Your cart is empty")
            setIsLoading(false)
            return
        }

        try {
            const supabase = createClient()

            const orderData = {
                customer_name: formData.name,
                email: formData.email,
                shipping_address: formData.address, // Combining for simplicity in DB if singular field, but keeping separate in UI
                city: formData.city,
                zip: formData.zip,
                items: items, // Supabase handles JSONB
                total_amount: cartTotal,
                status: 'pending'
            }

            const { data, error } = await supabase
                .from('orders')
                .insert([orderData])
                .select()

            if (error) throw error

            toast.success("Order placed successfully!")
            clearCart()
            router.push('/checkout/success')

        } catch (error: any) {
            console.error('Checkout error:', error)
            toast.error("Failed to place order. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
                <h1 className="text-3xl font-serif mb-4">Your Cart is Empty</h1>
                <Link href="/">
                    <Button variant="outline" className="border-white/20 text-white">Return to Shop</Button>
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
                    <div className="font-serif font-bold tracking-tight">AMERICANA CHECKOUT</div>
                    <div className="w-20" /> {/* Spacer */}
                </div>
            </header>

            <main className="container mx-auto px-6 pt-32 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">

                    {/* Left Column: Form */}
                    <div>
                        <h2 className="text-2xl font-serif font-bold mb-8 flex items-center gap-2">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-black text-sm font-bold">1</span>
                            Shipping Information
                        </h2>

                        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-zinc-400">Full Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    required
                                    className="bg-zinc-900 border-zinc-800 text-white focus:border-white/50 h-12"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-zinc-400">Email Address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="bg-zinc-900 border-zinc-800 text-white focus:border-white/50 h-12"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address" className="text-zinc-400">Address</Label>
                                <Input
                                    id="address"
                                    name="address"
                                    required
                                    className="bg-zinc-900 border-zinc-800 text-white focus:border-white/50 h-12"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city" className="text-zinc-400">City</Label>
                                    <Input
                                        id="city"
                                        name="city"
                                        required
                                        className="bg-zinc-900 border-zinc-800 text-white focus:border-white/50 h-12"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="zip" className="text-zinc-400">ZIP Code</Label>
                                    <Input
                                        id="zip"
                                        name="zip"
                                        required
                                        className="bg-zinc-900 border-zinc-800 text-white focus:border-white/50 h-12"
                                        value={formData.zip}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:pl-12 lg:border-l border-white/5">
                        <h2 className="text-2xl font-serif font-bold mb-8 flex items-center gap-2">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-black text-sm font-bold">2</span>
                            Order Summary
                        </h2>

                        <div className="bg-zinc-900/30 rounded-2xl p-6 border border-white/5 mb-8">
                            <div className="space-y-4 mb-6">
                                {items.map((item) => (
                                    <div key={item.product.id} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded bg-zinc-800 overflow-hidden relative">
                                                {item.product.image_url ? (
                                                    <img src={item.product.image_url} alt={item.product.name} className="object-cover h-full w-full" />
                                                ) : <div className="w-full h-full bg-zinc-800" />}
                                                <span className="absolute -top-2 -right-2 bg-zinc-700 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border border-zinc-900">
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            <span className="text-zinc-300 line-clamp-1 max-w-[140px]">{item.product.name}</span>
                                        </div>
                                        <span className="font-mono">$ {(item.product.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-white/10 pt-4 space-y-2 text-sm text-zinc-400">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>$ {cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                            </div>
                            <div className="border-t border-white/10 pt-4 mt-4 flex justify-between items-center text-xl font-bold text-white">
                                <span>Total</span>
                                <span>$ {cartTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            form="checkout-form"
                            className="w-full h-14 text-lg font-bold bg-white text-black hover:bg-zinc-200 rounded-full"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                `Pay $ ${cartTotal.toFixed(2)}`
                            )}
                        </Button>
                        <p className="text-center text-xs text-zinc-600 mt-4">
                            Secure payment processing via Stripe (Simulated).
                        </p>
                    </div>

                </div>
            </main>
        </div>
    )
}
