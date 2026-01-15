'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Package, Truck, CheckCircle2, ShoppingBag, Clock, MapPin, CreditCard, LogOut, Bell, Settings as SettingsIcon } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import BuyerFeed from '@/components/dashboard/buyer/buyer-feed'
import { NotificationBell } from '@/components/ui/notification-bell'

export default function BuyerDashboard() {
    const supabase = createClient()
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }
            setUser(user)

            // Fetch Orders
            const { data: ordersData } = await supabase
                .from('orders')
                .select(`
                    *,
                    order_items (
                        *,
                        products (name, images, price)
                    )
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (ordersData) setOrders(ordersData)
            setLoading(false)
        }
        fetchData()
    }, [supabase, router])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Loading interface...</div>

    const latestOrder = orders[0]

    return (
        <div className="min-h-screen bg-zinc-950 text-foreground pb-20">
            {/* Top Navigation Bar */}
            <header className="border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="text-xl font-serif font-bold text-white tracking-tight">AMERICANA</Link>

                    <div className="flex items-center gap-6 text-sm font-medium text-zinc-400">
                        <Link href="/dashboard" className="text-white">My Orders</Link>
                        <Link href="/wishlist" className="hover:text-white transition-colors">Wishlist</Link>
                        <Link href="/rewards" className="hover:text-white transition-colors">Rewards</Link>
                        <NotificationBell />
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-black">
                            {user?.user_metadata?.full_name?.[0] || 'U'}
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-12 space-y-12">
                {/* Welcome Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-primary text-xs font-bold uppercase tracking-widest">Premium Member</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">
                            Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'Guest'}
                        </h1>
                        <p className="text-zinc-400 max-w-xl">
                            {latestOrder ? `Your order #${latestOrder.id.slice(0, 8)} is currently being processed.` : 'Explore our curated collections today.'}
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <Card className="bg-white/5 border-white/10 p-4 w-40">
                            <div className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Reward Points</div>
                            <div className="text-2xl font-bold text-pink-500">1,250</div>
                        </Card>
                        <Card className="bg-white/5 border-white/10 p-4 w-40">
                            <div className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Member Tier</div>
                            <div className="text-xl font-serif italic text-white">Gold Elite</div>
                        </Card>
                    </div>
                </div>

                {/* Active Order Tracking */}
                {latestOrder && (
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Active Order Tracking</h2>
                            <span className="text-xs text-zinc-500 font-mono">ORDER #{latestOrder.id.split('-')[0].toUpperCase()}</span>
                        </div>

                        <Card className="bg-black/40 border-zinc-800 p-8 relative overflow-hidden">
                            {/* Progress Bar Visual */}
                            <div className="relative flex justify-between items-center z-10">
                                {/* Step 1: Processed */}
                                <div className="flex flex-col items-center gap-2">
                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${latestOrder.status !== 'cancelled' ? 'bg-pink-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                                        <CheckCircle2 className="h-4 w-4" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-white">Processed</span>
                                </div>

                                <div className="h-px flex-1 bg-zinc-800 mx-4" />

                                {/* Step 2: Shipped */}
                                <div className="flex flex-col items-center gap-2">
                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${latestOrder.status === 'shipped' || latestOrder.status === 'delivered' ? 'bg-pink-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                                        <Truck className="h-4 w-4" />
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${latestOrder.status === 'shipped' || latestOrder.status === 'delivered' ? 'text-white' : 'text-zinc-600'}`}>Shipped</span>
                                </div>

                                <div className="h-px flex-1 bg-zinc-800 mx-4" />

                                {/* Step 3: Delivered */}
                                <div className="flex flex-col items-center gap-2">
                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${latestOrder.status === 'delivered' ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-500'}`}>
                                        <Package className="h-4 w-4" />
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${latestOrder.status === 'delivered' ? 'text-white' : 'text-zinc-600'}`}>Delivered</span>
                                </div>
                            </div>
                        </Card>
                    </section>
                )}

                {/* Dashboard Grid / Feed */}
                <BuyerFeed />

                {/* Main Content Area (Order History) */}
                <div className="lg:col-span-3 space-y-6">
                    <h3 className="text-xl font-serif font-bold text-white">Order History</h3>

                    {orders.length === 0 ? (
                        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-xl">
                            <ShoppingBag className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-white">No orders yet</h3>
                            <p className="text-zinc-500 mb-6">Start building your collection today.</p>
                            <Button asChild className="bg-white text-black hover:bg-zinc-200 rounded-full">
                                <Link href="/">Browse Marketplace</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div key={order.id} className="bg-white/5 border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors">
                                    <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 bg-zinc-900 rounded-lg flex items-center justify-center border border-white/10">
                                                <ShoppingBag className="h-5 w-5 text-zinc-400" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white">Order #{order.id.slice(0, 8)}</div>
                                                <div className="text-xs text-zinc-500">{format(new Date(order.created_at), 'MMMM d, yyyy')}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <div className="text-sm font-bold text-white">${order.total_amount}</div>
                                                <div className="text-xs text-zinc-500">{order.status}</div>
                                            </div>
                                            <Link href={`/dashboard/buyer/tracking/${order.id}`}>
                                                <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300 hover:text-white">
                                                    Track Order
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                    {/* Preview Items */}
                                    <div className="p-4 bg-black/20 flex gap-2 overflow-x-auto">
                                        {order.order_items?.map((item: any, idx: number) => (
                                            <div key={idx} className="h-16 w-16 relative bg-zinc-900 rounded border border-white/5 flex-shrink-0">
                                                {/* Placeholder or Image if available */}
                                                {item.products?.images?.[0] ? (
                                                    <Image src={item.products.images[0]} alt="Product" fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xs text-zinc-600">Img</div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
