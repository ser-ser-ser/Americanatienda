'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import {
    Package,
    AlertTriangle,
    TrendingUp,
    DollarSign,
    MoreHorizontal,
    Heart,
    ShoppingCart,
    Eye,
    Truck,
    ArrowRight,
    Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useVendor } from '@/providers/vendor-provider'

import { Suspense } from 'react'

function VendorDashboardContent() {
    const supabase = createClient()
    const router = useRouter()
    const { activeStore, isLoading: isVendorLoading } = useVendor()
    const [stats, setStats] = useState({
        balance: 0,
        inTransit: 0,
        pending: 0,
        lowStockCount: 0
    })
    const [loading, setLoading] = useState(true)

    // Mock Global Activity Data
    const activityFeed = [
        { type: 'like', user: '@Julian_V', text: 'favorited', item: 'Silk Blazer', time: '2 MINUTES AGO', location: 'LONDON, UK' },
        { type: 'order', user: 'Boutique Moderne', text: 'placed Order #8829', time: '15 MINUTES AGO', location: 'PARIS, FR' },
        { type: 'view', count: 12, text: 'Users are currently viewing', item: "Winter Collection '24", time: 'JUST NOW', isLive: true },
        { type: 'ship', text: 'Order #8810 has reached', item: 'Customs Clearance', time: '1 HOUR AGO', location: 'NYC, USA' }
    ]

    const inventoryHealth = [
        { name: 'Black Noir Silk Blazer', sku: 'HQ-9921-X', stock: 2, status: 'Critically Low', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=100&h=100&fit=crop' },
        { name: 'Velvet Stiletto Heels', sku: 'VT-4402-L', stock: 5, status: 'Restock Suggested', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=100&h=100&fit=crop' }
    ]

    useEffect(() => {
        if (!activeStore) return

        const fetchStats = async () => {
            try {
                // 1. Fetch Stripe Balance (Mock for now or use real if available)
                // In a real scenario, we'd fetch this from our API
                const stripeBalance = 124500.00 // Mocking to match screenshot

                // 2. Fetch Active Shipments
                // const { count: inTransitCount } = await supabase
                //     .from('orders') // Assuming orders table
                //     .select('*', { count: 'exact', head: true })
                //     .eq('store_id', activeStore.id)
                //     .eq('status', 'in_transit')

                // 3. Fetch Low Stock
                const { count: lowStock } = await supabase
                    .from('products')
                    .select('*', { count: 'exact', head: true })
                    .eq('store_id', activeStore.id)
                    .lt('stock', 5)

                setStats({
                    balance: stripeBalance,
                    inTransit: 42, // Mock from Screenshot
                    pending: 8,
                    lowStockCount: lowStock || 8
                })
            } catch (error) {
                console.error('Error fetching stats:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [activeStore])

    if (isVendorLoading || loading) {
        return <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-cyan-500">Loading Command Center...</div>
    }

    if (!activeStore) {
        return <div className="text-white p-10">Please select a store.</div>
    }

    return (
        <div className="min-h-screen bg-[#09090b] text-white p-8 font-sans">

            {/* Top Bar */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="h-2 w-2 bg-cyan-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-500">System Operational</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Merchant Hub</h1>
                    <p className="text-zinc-500 text-sm mt-1">Real-time performance and luxury logistics monitoring.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#121217] rounded-full border border-white/10">
                        <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center border border-white/5">
                            <span className="font-serif italic text-xs">AM</span>
                        </div>
                        <div className="text-right">
                            <div className="text-xs font-bold text-white">Alexander McQueen</div>
                            <div className="text-[9px] text-zinc-500 uppercase tracking-widest">Verified Studio</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT COLUMN (2/3 width) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* 1. Stat Cards Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Sales */}
                        <Card className="bg-[#121217] border-zinc-800 relative overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Total Sales (Stripe)</div>
                                    <div className="p-1.5 bg-cyan-500/10 rounded text-cyan-500">
                                        <DollarSign className="h-4 w-4" />
                                    </div>
                                </div>
                                <div className="text-3xl font-bold font-mono text-white mb-2">$124,500.00</div>
                                <div className="text-xs font-medium text-green-500 flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" /> +12.5% <span className="text-zinc-600">vs last month</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Shipments */}
                        <Card className="bg-[#121217] border-zinc-800 relative overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Active Shipments</div>
                                    <div className="p-1.5 bg-blue-500/10 rounded text-blue-500">
                                        <Package className="h-4 w-4" />
                                    </div>
                                </div>
                                <div className="text-3xl font-bold font-mono text-white mb-2">42</div>
                                <div className="text-xs font-medium text-green-500 flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" /> +5.2% <span className="text-zinc-600">8 out for delivery</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Inventory Alerts */}
                        <Card className="bg-[#121217] border-zinc-800 relative overflow-hidden border-l-2 border-l-cyan-500">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Low Stock Alerts</div>
                                    <div className="p-1.5 bg-cyan-500/10 rounded text-cyan-500">
                                        <AlertTriangle className="h-4 w-4" />
                                    </div>
                                </div>
                                <div className="text-3xl font-bold font-mono text-white mb-2">{stats.lowStockCount}</div>
                                <div className="text-xs font-bold text-cyan-500">Immediate Action Required</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* 2. Revenue Trends - THE GRAPH */}
                    <Card className="bg-[#121217] border-zinc-800 h-[320px]">
                        <CardHeader className="flex flex-row items-center justify-between pb-0">
                            <div>
                                <CardTitle className="text-lg font-bold text-white">Revenue Trends</CardTitle>
                                <p className="text-xs text-zinc-500 mt-1">Daily performance across all boutique channels</p>
                            </div>
                            <div className="flex gap-2">
                                <Badge variant="secondary" className="bg-cyan-950/50 text-cyan-500 border border-cyan-900/50 hover:bg-cyan-900/50">7D</Badge>
                                <Badge variant="outline" className="text-zinc-500 border-zinc-800 hover:text-white">1M</Badge>
                                <Badge variant="outline" className="text-zinc-500 border-zinc-800 hover:text-white">1Y</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-8 h-full relative p-0 overflow-hidden">
                            {/* Custom SVG Curve for "Blue Wave" - Fixed Responsiveness */}
                            <div className="absolute inset-0 w-full h-full">
                                <svg
                                    className="w-full h-full"
                                    viewBox="0 0 1000 200"
                                    preserveAspectRatio="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <defs>
                                        <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
                                            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    {/* The Area Fill */}
                                    <path d="M0,150 C150,150 200,80 350,80 C500,80 550,40 1000,40 L1000,200 L0,200 Z" fill="url(#gradient-blue)" />
                                    {/* The Line */}
                                    <path d="M0,150 C150,150 200,80 350,80 C500,80 550,40 1000,40" stroke="#06b6d4" strokeWidth="4" fill="none" vectorEffect="non-scaling-stroke" />
                                    {/* Data Point */}
                                    <circle cx="650" cy="50" r="6" fill="#121217" stroke="#06b6d4" strokeWidth="3" />
                                </svg>
                            </div>

                            {/* Axis Labels - Positioned Absolutely at bottom */}
                            <div className="absolute bottom-4 left-0 right-0 flex justify-between text-[10px] text-zinc-600 font-bold uppercase tracking-widest px-6">
                                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 3. Inventory Health */}
                    <div className="bg-[#121217] border border-zinc-800 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-white">Inventory Health</h3>
                        </div>
                        <div className="space-y-4">
                            {inventoryHealth.map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg transition-colors group cursor-pointer border border-transparent hover:border-zinc-800">
                                    <div className="flex items-center gap-4">
                                        <img src={item.image} className="h-10 w-10 rounded object-cover bg-zinc-800" />
                                        <div>
                                            <div className="text-sm font-bold text-white">{item.name}</div>
                                            <div className="text-[10px] text-zinc-500 font-mono">{item.sku}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-cyan-500">{item.stock} Items Left</div>
                                        <div className="text-[10px] text-zinc-500 uppercase tracking-wider">{item.status}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN (1/3 width) - Global Activity Sidebar */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-white">Global Activity</h3>
                        <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
                    </div>

                    <div className="relative border-l border-zinc-800 ml-3 space-y-8 py-2">
                        {activityFeed.map((event, i) => (
                            <div key={i} className="relative pl-8">
                                {/* Icon Bubble */}
                                <div className={`absolute -left-4 top-0 h-8 w-8 rounded-full border-4 border-[#09090b] flex items-center justify-center bg-[#1a1a20]`}>
                                    {event.type === 'like' && <Heart className="h-3 w-3 text-cyan-500 fill-cyan-500" />}
                                    {event.type === 'order' && <ShoppingCart className="h-3 w-3 text-green-500" />}
                                    {event.type === 'view' && <Eye className="h-3 w-3 text-cyan-500" />}
                                    {event.type === 'ship' && <Truck className="h-3 w-3 text-blue-500" />}
                                </div>

                                {/* Content */}
                                <div>
                                    <div className="text-sm text-zinc-300">
                                        {event.user && <span className="font-bold text-white">{event.user} </span>}
                                        {event.count && <span className="font-bold text-cyan-500">{event.count} Users </span>}
                                        <span className="text-zinc-400">{event.text} </span>
                                        <span className="font-bold text-white">{event.item}</span>
                                    </div>
                                    <div className="text-[10px] font-bold text-zinc-600 mt-1 uppercase tracking-wider flex items-center gap-2">
                                        {event.time}
                                        {event.location && <span>• {event.location}</span>}
                                        {event.isLive && <span className="text-cyan-500">• LIVE STREAM</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button variant="outline" className="w-full border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 mt-4 text-xs font-bold uppercase tracking-widest py-6">
                        View Full History
                    </Button>
                </div>

            </div>

            {/* Bottom Floating Action, maybe? No, let's keep it clean as per screenshot */}
        </div>
    )
}

export default function VendorDashboard() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#09090b] flex items-center justify-center text-cyan-500">Loading Vendor Interface...</div>}>
            <VendorDashboardContent />
        </Suspense>
    )
}
