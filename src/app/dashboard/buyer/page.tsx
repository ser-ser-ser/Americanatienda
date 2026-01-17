'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { RewardsCard } from '@/components/dashboard/rewards-card'
import { TrackingTimeline } from '@/components/dashboard/tracking-timeline'
import Link from 'next/link'
import { ShoppingBag, ArrowRight, Search, Download, ChevronDown, Package, Truck, Filter, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

export default function BuyerDashboardPage() {
    const supabase = createClient()
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [activeTab, setActiveTab] = useState<'active' | 'past' | 'cancelled'>('active')

    useEffect(() => {
        const fetchOrders = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUser(user)
                const { data } = await supabase
                    .from('orders')
                    .select('*, order_items(*, product:products(*))')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                if (data) setOrders(data)
            }
            setLoading(false)
        }
        fetchOrders()
    }, [activeTab])

    const latestOrder = orders.length > 0 ? orders[0] : {
        id: 'AMR-89241',
        status: 'shipped',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        total_amount: 149.00,
        order_items: [],
        estimated_delivery: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString()
    }

    // DEMO DATA for "Active" tab if no real data
    const demoOrders = [
        {
            id: 'AMR-89241',
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
            total_amount: 428.00,
            status: 'shipped',
            carrier: 'DHL Express',
            tracking_number: '1234567890',
            order_items: [
                {
                    name: "Chrome Gothic Link Necklace",
                    price: 280.00,
                    quantity: 1,
                    size: "Standard",
                    image_url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8"
                },
                {
                    name: "Void Matte Sunglasses",
                    price: 148.00,
                    quantity: 1,
                    size: "One Size",
                    image_url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083"
                }
            ]
        },
        {
            id: 'AMR-77512',
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
            total_amount: 95.00,
            status: 'processing',
            carrier: 'FedEx',
            tracking_number: null,
            order_items: [
                {
                    name: "Oversized Heavyweight Tee",
                    price: 95.00,
                    quantity: 1,
                    size: "L",
                    image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"
                }
            ]
        }
    ]

    const displayOrders = orders.length > 0 ? orders : demoOrders

    if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-zinc-500">Loading experience...</div>

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-pink-500/30 pb-20 font-sans">
            <main className="max-w-7xl mx-auto px-6 md:px-12 pt-8">

                {/* 1. Header & Welcome */}
                <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
                    WELCOME BACK, <span className="uppercase">{user?.user_metadata?.full_name?.split(' ')[0] || 'TRAVELER'}</span>
                </h1>

                {/* 2. Top Dashboard: Active Tracking & Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                    {/* Left: Active Order Tracking */}
                    <div className="lg:col-span-2">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold tracking-tight">Active Order Tracking</h2>
                            <span className="text-xs font-mono text-zinc-500">ORDER #{latestOrder.id.slice(0, 12).toUpperCase()}</span>
                        </div>
                        <div className="p-6 bg-[#0A0A0A] border border-white/5 rounded-3xl">
                            <TrackingTimeline
                                status={latestOrder.status}
                                created_at={latestOrder.created_at}
                                estimated_delivery={latestOrder.estimated_delivery}
                            />
                            <div className="mt-8 flex justify-end">
                                <Link href={`/dashboard/buyer/tracking/${latestOrder.id}`}>
                                    <Button variant="outline" className="text-xs uppercase tracking-widest border-zinc-800 hover:bg-white hover:text-black transition-colors rounded-full px-6">
                                        View Live Map <ArrowRight className="ml-2 h-3 w-3" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right: Rewards & Actions */}
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="flex-1 bg-[#0A0A0A] border border-white/5 rounded-3xl p-6 flex flex-col justify-between">
                                <div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Reward Points</div>
                                    <div className="text-3xl font-black text-white">1,250</div>
                                </div>
                                <div className="h-1 w-full bg-zinc-800 rounded-full mt-4 overflow-hidden">
                                    <div className="h-full w-[65%] bg-[#f4256a]"></div>
                                </div>
                            </div>
                            <div className="flex-1 bg-[#0A0A0A] border border-white/5 rounded-3xl p-6 flex flex-col justify-between">
                                <div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Member Tier</div>
                                    <div className="text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-br from-[#FFD700] to-[#B8860B]">Gold</div>
                                </div>
                                <div className="text-[10px] text-zinc-500 mt-2">Next Tier: Platinum</div>
                            </div>
                        </div>

                        <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6">
                            <h3 className="font-bold text-xs text-zinc-500 uppercase tracking-wider mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <Link href="/dashboard/buyer/settings" className="p-3 bg-zinc-900/50 hover:bg-white/5 border border-white/5 rounded-xl transition-all flex items-center justify-center text-center">
                                    <span className="font-bold text-xs">Settings</span>
                                </Link>
                                <button className="p-3 bg-zinc-900/50 hover:bg-white/5 border border-white/5 rounded-xl transition-all flex items-center justify-center text-center">
                                    <span className="font-bold text-xs">Past Orders</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Divider / Section Heading */}
                <div className="border-t border-white/5 pt-10 mb-8">
                    <p className="text-zinc-500 text-sm mb-6">Manage your niche fashion acquisitions and track delivery status.</p>

                    {/* Controls */}
                    <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-4">
                        <div className="flex flex-col md:flex-row gap-4 justify-between">
                            {/* Tabs */}
                            <div className="flex p-1 bg-[#121212] rounded-xl w-fit">
                                {['active', 'past', 'cancelled'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab as any)}
                                        className={cn(
                                            "px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all",
                                            activeTab === tab
                                                ? "bg-[#f4256a] text-white shadow-lg shadow-pink-900/20"
                                                : "text-zinc-500 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {/* Search */}
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                <input
                                    type="text"
                                    placeholder="Search by item name or order ID..."
                                    className="w-full h-11 bg-[#121212] border border-white/5 rounded-xl pl-11 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-pink-500/50 transition-colors"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Orders List (Consolidated) */}
                <div className="space-y-6">
                    {displayOrders.map((order, i) => (
                        <div key={i} className="bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors">
                            {/* Order Header */}
                            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center border-b border-white/5">
                                <div className="flex gap-8 md:gap-16">
                                    <div>
                                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Order ID</div>
                                        <div className="font-bold text-white">#{order.id.slice(0, 8).toUpperCase()}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Placed On</div>
                                        <div className="font-medium text-zinc-300">{format(new Date(order.created_at), 'MMM d, yyyy')}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Total</div>
                                        <div className="font-bold text-white">${order.total_amount}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${order.status === 'shipped' ? 'bg-blue-500/10 text-blue-500' :
                                        order.status === 'delivered' ? 'bg-green-500/10 text-green-500' :
                                            'bg-pink-500/10 text-pink-500'
                                        }`}>
                                        <div className={`h-1.5 w-1.5 rounded-full ${order.status === 'shipped' ? 'bg-blue-500' : order.status === 'delivered' ? 'bg-green-500' : 'bg-pink-500'}`}></div>
                                        {order.status}
                                    </div>

                                    <Link href={`/dashboard/buyer/tracking/${order.id}`} className="flex-1 md:flex-none">
                                        <Button className="w-full bg-[#f4256a] hover:bg-[#d41b55] text-white font-bold text-xs tracking-wider uppercase h-10 px-6 rounded-lg shadow-[0_0_20px_rgba(244,37,106,0.2)]">
                                            Track Package
                                        </Button>
                                    </Link>

                                    <Button size="icon" variant="ghost" className="h-10 w-10 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg">
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Carrier Info Bar */}
                            {order.carrier && (
                                <div className="px-6 md:px-8 py-3 bg-white/[0.02] flex items-center gap-3 border-b border-white/5">
                                    <Truck className="h-4 w-4 text-zinc-500" />
                                    <span className="text-xs text-zinc-400">Shipped via <strong className="text-white">{order.carrier}</strong></span>
                                    {order.tracking_number && (
                                        <span className="text-xs text-zinc-600 font-mono tracking-wider ml-auto">TRK: {order.tracking_number}</span>
                                    )}
                                </div>
                            )}

                            {/* Order Items */}
                            <div className="p-6 md:p-8 space-y-6">
                                {order.order_items?.map((item: any, idx: number) => (
                                    <div key={idx} className="flex gap-4 md:gap-6 group">
                                        {/* Product Image */}
                                        <Link href={`/product/demo-${idx}`} className="shrink-0 relative overflow-hidden rounded-xl h-24 w-24 md:h-20 md:w-20 border border-white/10 bg-zinc-900">
                                            <div
                                                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                                                style={{ backgroundImage: `url(${item.product?.images?.[0] || item.product?.image_url || 'https://placehold.co/400x400/111/444?text=No+Image'})` }}
                                            />
                                        </Link>

                                        {/* Item Details */}
                                        <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div>
                                                <Link href={`/product/demo-${idx}`} className="text-white font-bold text-lg leading-tight hover:text-[#f4256a] transition-colors">
                                                    {item.name}
                                                </Link>
                                                <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-500 font-medium">
                                                    <span>Size: {item.size || 'Standard'}</span>
                                                    <span className="h-3 w-px bg-white/10"></span>
                                                    <span>Qty: {item.quantity || 1}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-white font-bold">${item.price?.toFixed(2)}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer Actions */}
                            <div className="px-6 md:px-8 py-4 bg-[#121212] border-t border-white/5 flex justify-end">
                                <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#f4256a] hover:text-white transition-colors">
                                    <Download className="h-3 w-3" />
                                    Download Invoice PDF
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More */}
                <div className="flex justify-center mt-12 mb-20">
                    <button className="flex items-center gap-2 px-6 py-3 border border-zinc-800 rounded-full text-zinc-500 text-xs font-bold uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all">
                        Load Older Orders <RefreshCw className="h-3 w-3" />
                    </button>
                </div>
            </main>
        </div>
    )
}
