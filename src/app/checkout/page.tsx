'use client'

import { useCart } from '@/context/cart-context'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { ArrowLeft, CreditCard, ShieldCheck, Lock, Loader2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
    const { items, cartTotal, clearCart } = useCart()
    const supabase = createClient()
    const router = useRouter()

    // Form States
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [zip, setZip] = useState('')

    // Payment States
    const [cardName, setCardName] = useState('')
    const [cardNumber, setCardNumber] = useState('')
    const [expiry, setExpiry] = useState('')
    const [cvc, setCvc] = useState('')

    const [loading, setLoading] = useState(false)

    // Pre-fill user data if logged in
    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setEmail(user.email || '')
                setName(user.user_metadata?.full_name || '')
            }
        }
        fetchUser()
    }, [])

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Simple Validation for "Test Mode"
        if (cardNumber.replace(/\s/g, '') !== '4242424242424242') {
            toast.error("Payment Failed", {
                description: "Please use the Stripe Test Card (4242 4242 4242 4242) for this demo."
            })
            setLoading(false)
            return
        }

        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                toast.error("Please login to checkout")
                // In real app, offer guest checkout or redirect to login
                setLoading(false)
                return
            }

            // Create Order in Supabase
            const { data: order, error } = await supabase
                .from('orders')
                .insert({
                    user_id: user.id,
                    total_amount: cartTotal,
                    status: 'processing', // Initial status
                    status: 'processing' // Initial status
                })
                .select()
                .single()

            if (error) throw error

            // Create Order Items (optional relational table if schema demands it, 
            // but relying on JSONB 'items' column in 'orders' is easier for MVP unless we have strict normalization)
            // Assuming we also want rows in 'order_items' based on previous context:
            const orderItemsData = items.map(item => ({
                order_id: order.id,
                product_id: item.product.id,
                quantity: item.quantity,
                price_at_purchase: item.product.price
            }))

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItemsData)

            if (itemsError) {
                console.error('Error saving items relation (FULL):', itemsError)
                console.error('Error saving items relation (JSON):', JSON.stringify(itemsError, null, 2))
                // Try to continue anyway since order uses JSON 'items' (deprecated) or just warn
                toast.error("Order created but items failed to save.", { description: itemsError.message })
            }

            // Success!
            toast.success("Order Placed Successfully!")
            clearCart()
            router.push('/dashboard/buyer')

        } catch (error: any) {
            console.error("FULL ERROR OBJECT:", error)
            console.error("Error Stringified:", JSON.stringify(error, null, 2)) // Capture everything
            toast.error("Checkout Failed", {
                description: error.message || error.error_description || "Unknown error occurred"
            })
        } finally {
            setLoading(false)
        }
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
                <Link href="/">
                    <Button variant="outline">Back to Shopping</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-pink-500/30 font-sans">
            {/* Simple Header */}
            <header className="border-b border-white/5 py-6">
                <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
                    <Link href="/" className="font-serif font-bold text-xl tracking-tight">AMERICANA</Link>
                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                        <Lock className="h-3 w-3" /> Secure Checkout
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16">

                {/* Left: Form */}
                <div>
                    <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors text-sm">
                        <ArrowLeft className="h-4 w-4" /> Return to store
                    </Link>

                    <form onSubmit={handleCheckout} className="space-y-10">

                        {/* Section 1: Contact */}
                        <section className="space-y-4">
                            <h2 className="text-lg font-bold">Contact Information</h2>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    required
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="bg-black border-white/10 h-11 focus:border-pink-500"
                                />
                            </div>
                        </section>

                        {/* Section 2: Shipping */}
                        <section className="space-y-4">
                            <h2 className="text-lg font-bold">Shipping Address</h2>
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        required
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        className="bg-black border-white/10 h-11 focus:border-pink-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input
                                        id="address"
                                        required
                                        placeholder="123 Fashion St"
                                        value={address}
                                        onChange={e => setAddress(e.target.value)}
                                        className="bg-black border-white/10 h-11 focus:border-pink-500"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City</Label>
                                        <Input
                                            id="city"
                                            required
                                            value={city}
                                            onChange={e => setCity(e.target.value)}
                                            className="bg-black border-white/10 h-11 focus:border-pink-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="zip">ZIP Code</Label>
                                        <Input
                                            id="zip"
                                            required
                                            value={zip}
                                            onChange={e => setZip(e.target.value)}
                                            className="bg-black border-white/10 h-11 focus:border-pink-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 3: Payment */}
                        <section className="space-y-6 pt-6 border-t border-white/5">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold">Payment Method</h2>
                                <div className="flex gap-2 opacity-50 grayscale">
                                    <div className="h-6 w-10 bg-white rounded"></div>
                                    <div className="h-6 w-10 bg-white rounded"></div>
                                </div>
                            </div>

                            <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 space-y-4">

                                <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg mb-6">
                                    <CheckCircle2 className="h-5 w-5 text-blue-400" />
                                    <div>
                                        <p className="text-sm font-bold text-blue-200">Test Mode Enabled</p>
                                        <p className="text-xs text-blue-300 mb-2">Use card <span className="font-mono bg-blue-500/20 px-1 rounded">4242 4242 4242 4242</span></p>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="sm"
                                            className="h-7 text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-100 border-none"
                                            onClick={() => {
                                                setCardNumber('4242 4242 4242 4242')
                                                setExpiry('12/30')
                                                setCvc('123')
                                                toast.success("Test credentials filled!")
                                            }}
                                        >
                                            Auto-Fill Test Data
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Card Number</Label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                        <Input
                                            required
                                            placeholder="0000 0000 0000 0000"
                                            value={cardNumber}
                                            onChange={e => setCardNumber(e.target.value)}
                                            className="bg-black border-white/10 h-11 pl-10 font-mono tracking-wider focus:border-pink-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Expiry</Label>
                                        <Input
                                            required
                                            placeholder="MM/YY"
                                            value={expiry}
                                            onChange={e => {
                                                let v = e.target.value.replace(/\D/g, '')
                                                if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2, 4)
                                                setExpiry(v)
                                            }}
                                            maxLength={5}
                                            className="bg-black border-white/10 h-11 text-center font-mono focus:border-pink-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>CVC</Label>
                                        <Input
                                            required
                                            placeholder="123"
                                            value={cvc}
                                            onChange={e => setCvc(e.target.value)}
                                            className="bg-black border-white/10 h-11 text-center font-mono focus:border-pink-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 bg-[#f4256a] hover:bg-[#d41b55] text-white font-bold text-lg rounded-xl shadow-[0_0_30px_rgba(244,37,106,0.3)] transition-all"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
                                    </>
                                ) : (
                                    `Pay $${cartTotal.toFixed(2)}`
                                )}
                            </Button>

                            <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
                                <ShieldCheck className="h-3 w-3" />
                                Payments are secure and encrypted
                            </div>

                        </section>
                    </form>
                </div>

                {/* Right: Summary */}
                <div className="hidden lg:block">
                    <div className="sticky top-12 bg-[#0A0A0A] border border-white/5 rounded-3xl p-8">
                        <h3 className="text-xl font-bold mb-6">Order Summary</h3>

                        <div className="space-y-6 mb-8">
                            {items.map(item => (
                                <div key={item.product.id} className="flex gap-4">
                                    <div
                                        className="h-16 w-16 bg-zinc-800 rounded-lg bg-cover bg-center border border-white/10"
                                        style={{ backgroundImage: `url(${item.product.image_url || item.product.images?.[0] || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8'})` }}
                                    ></div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm">{item.product.name}</h4>
                                        <div className="text-xs text-zinc-500 mt-1">Qty: {item.quantity} · Size: Standard</div>
                                    </div>
                                    <div className="font-bold text-sm">${(item.product.price * item.quantity).toFixed(2)}</div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3 py-6 border-t border-white/5 text-sm">
                            <div className="flex justify-between text-zinc-400">
                                <span>Subtotal</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-zinc-400">
                                <span>Shipping</span>
                                <span>Calculated at next step</span>
                            </div>
                            <div className="flex justify-between text-zinc-400">
                                <span>Taxes</span>
                                <span>$0.00</span>
                            </div>
                        </div>

                        <div className="flex justify-between text-xl font-black py-6 border-t border-white/5">
                            <span>Total</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>

                    </div>
                </div>

            </main>
        </div>
    )
}
