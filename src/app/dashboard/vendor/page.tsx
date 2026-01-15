'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Package, Truck, AlertTriangle, Loader2, DollarSign, ShoppingBag, ArrowUpRight, Box, Zap, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { useVendor } from '@/providers/vendor-provider'

export default function VendorDashboardPage() {
    const router = useRouter()
    const supabase = createClient()

    // CONSUMING CONTEXT
    const { activeStore, isLoading: isContextLoading } = useVendor()

    const [pageLoading, setPageLoading] = useState(false) // Local loading for data refetch

    // Stats State
    const [stats, setStats] = useState({
        balance: 0,
        inTransit: 0,
        pending: 0,
        lowStockCount: 0
    })

    const [recentOrders, setRecentOrders] = useState<any[]>([])
    const [lowStockItems, setLowStockItems] = useState<any[]>([])
    const [stripeUrl, setStripeUrl] = useState<string | null>(null)

    useEffect(() => {
        const loadDashboardData = async () => {
            if (!activeStore) return

            setPageLoading(true)

            try {
                // mock Stripe Dashboard URL for now 
                setStripeUrl('https://dashboard.stripe.com/')

                // 1. Fetch Orders for THIS store
                const { data: orders } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('store_id', activeStore.id)
                    .order('created_at', { ascending: false })
                    .limit(10)

                if (orders) {
                    setRecentOrders(orders)

                    // Calculate Stats
                    const balance = orders
                        .filter(o => o.status === 'paid' || o.status === 'shipped' || o.status === 'delivered')
                        .reduce((acc, o) => acc + (o.total_amount || 0), 0)

                    const inTransit = orders.filter(o => o.status === 'shipped').length
                    const pending = orders.filter(o => o.status === 'paid').length // Paid but not shipped

                    setStats(prev => ({ ...prev, balance, inTransit, pending }))
                }

                // 2. Fetch Inventory (Low Stock) for THIS store
                const { data: products } = await supabase
                    .from('products')
                    .select('id, name, stock, image_url, images')
                    .eq('store_id', activeStore.id)
                    .lt('stock', 10) // Threshold for low stock
                    .limit(5)

                if (products) {
                    setLowStockItems(products)
                    setStats(prev => ({ ...prev, lowStockCount: products.length }))
                }

            } catch (err) {
                console.error("Error loading dashboard data", err)
            } finally {
                setPageLoading(false)
            }
        }

        if (activeStore) {
            loadDashboardData()
        }
    }, [activeStore]) // Re-run when activeStore changes

    if (isContextLoading || pageLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500"><Loader2 className="animate-spin mr-2" /> Loading Command Center...</div>

    if (!activeStore) return <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500">No Active Store Selected</div>

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-10 font-sans">
            <div className="max-w-7xl mx-auto space-y-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Zap className="h-5 w-5 text-pink-500 fill-pink-500" />
                            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">{activeStore.name}</h2>
                        </div>
                        <h1 className="text-4xl font-serif font-bold text-white tracking-tight">VENDOR COMMAND CENTER</h1>
                        <p className="text-zinc-500 mt-1">Manage logistics, finances, and growth for <strong>{activeStore.name}</strong>.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800">
                            Payout History
                        </Button>
                        <Button className="bg-pink-600 hover:bg-pink-700 text-white font-bold">
                            + New Shipment
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Balance */}
                    <Card className="bg-zinc-900 border-zinc-800 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <DollarSign className="h-16 w-16 text-white" />
                        </div>
                        <CardHeader className="pb-2">
                            <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Total Balance</div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white font-mono">${stats.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                        </CardContent>
                    </Card>

                    {/* In Transit */}
                    <Card className="bg-zinc-900 border-zinc-800 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Truck className="h-16 w-16 text-blue-500" />
                        </div>
                        <CardHeader className="pb-2">
                            <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">In Transit</div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline gap-2">
                                <div className="text-3xl font-bold text-white font-mono">{stats.inTransit}</div>
                                <span className="text-xs font-bold text-blue-500 uppercase">Active</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pending Orders */}
                    <Card className="bg-zinc-900 border-zinc-800 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Box className="h-16 w-16 text-yellow-500" />
                        </div>
                        <CardHeader className="pb-2">
                            <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Pending Orders</div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline gap-2">
                                <div className="text-3xl font-bold text-white font-mono">{stats.pending.toString().padStart(2, '0')}</div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Low Stock */}
                    <Card className="bg-zinc-900 border-zinc-800 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <AlertTriangle className="h-16 w-16 text-red-500" />
                        </div>
                        <CardHeader className="pb-2">
                            <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Low Stock</div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline gap-2">
                                <div className="text-3xl font-bold text-red-500 font-mono">{stats.lowStockCount.toString().padStart(2, '0')}</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Split */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN: Recent Orders Table */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-bold text-white uppercase tracking-tight">Recent Orders</h3>
                                <Badge variant="secondary" className="bg-pink-900/50 text-pink-500 border-pink-900 hover:bg-pink-900/50">LIVE</Badge>
                            </div>
                            <Button variant="link" className="text-pink-500 text-xs font-bold uppercase tracking-wider hover:text-pink-400 p-0">View All</Button>
                        </div>

                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 bg-black/20 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                <div className="col-span-2">Order ID</div>
                                <div className="col-span-3">Customer</div>
                                <div className="col-span-3">Shipping Status</div>
                                <div className="col-span-2 text-right">Amount</div>
                                <div className="col-span-2 text-right">Status</div>
                            </div>

                            {/* Table Rows */}
                            {recentOrders.length === 0 ? (
                                <div className="p-12 text-center text-zinc-600 italic">No orders found. Ready for action.</div>
                            ) : (
                                <div className="divide-y divide-white/5">
                                    {recentOrders.map(order => (
                                        <div key={order.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors group">
                                            <div className="col-span-2 font-mono text-sm text-white font-bold">#{order.id.slice(0, 4)}...</div>
                                            <div className="col-span-3 text-sm text-zinc-300 truncate">
                                                {/* Mock Name if not in shipping_address, else use metadata or fallback */}
                                                {order.shipping_address?.name || "Guest Customer"}
                                            </div>
                                            <div className="col-span-3">
                                                {order.status === 'shipped' || order.status === 'delivered' ? (
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">In Transit</span>
                                                        <span className="text-[10px] text-zinc-600 font-mono">FX-{Math.floor(Math.random() * 90000) + 10000}</span>
                                                    </div>
                                                ) : order.status === 'paid' ? (
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-yellow-500 uppercase tracking-wider">Processing</span>
                                                        <span className="text-[10px] text-zinc-600 font-mono">Ready to Ship</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs font-bold text-zinc-500 uppercase">{order.status}</span>
                                                )}
                                            </div>
                                            <div className="col-span-2 text-right font-mono text-sm text-white font-bold">
                                                ${order.total_amount}
                                            </div>
                                            <div className="col-span-2 flex justify-end">
                                                <Badge variant="outline" className={`
                                                    uppercase text-[10px] font-bold tracking-wider border-0
                                                    ${order.status === 'paid' ? 'bg-pink-500/10 text-pink-500' :
                                                        order.status === 'shipped' ? 'bg-blue-500/10 text-blue-500' :
                                                            order.status === 'delivered' ? 'bg-green-500/10 text-green-500' : 'bg-zinc-800 text-zinc-500'}
                                                 `}>
                                                    {order.status === 'paid' ? 'PAID' : order.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Sidebar Widgets */}
                    <div className="lg:col-span-1 space-y-8">

                        {/* 1. Inventory Health */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold text-white uppercase tracking-tight">Inventory Health</h3>
                                <Loader2 className="h-3 w-3 text-zinc-600" />
                            </div>

                            <div className="space-y-3">
                                {lowStockItems.length === 0 ? (
                                    <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-500 text-sm text-center">
                                        All systems optimal. No low stock.
                                    </div>
                                ) : (
                                    lowStockItems.map(item => (
                                        <div key={item.id} className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between group hover:border-red-900/50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 bg-black rounded border border-white/10 overflow-hidden relative">
                                                    {(item.images?.[0] || item.image_url) && (
                                                        <img src={item.images?.[0] || item.image_url} className="object-cover w-full h-full opacity-60 group-hover:opacity-100 transition-opacity" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-white uppercase tracking-tight">{item.name}</div>
                                                    <div className="text-xs text-red-500 font-bold">Only {item.stock} units left</div>
                                                </div>
                                            </div>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-600 hover:text-white">
                                                <Box className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))
                                )}

                                <Button variant="outline" className="w-full border-zinc-800 text-zinc-400 hover:text-white uppercase text-[10px] font-bold tracking-widest h-10">
                                    View Full Inventory
                                </Button>
                            </div>
                        </div>

                        {/* 2. Financial Hub (Stripe Card) */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-white uppercase tracking-tight">Financial Hub</h3>

                            <div className="rounded-2xl p-6 bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-900/20 relative overflow-hidden">
                                <div className="relative z-10">
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-blue-100/80 mb-2">Connected via Stripe</div>
                                    <div className="text-3xl font-bold font-mono mb-6">${stats.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>

                                    <div className="flex justify-between text-xs text-blue-100 mb-6 border-t border-white/20 pt-4">
                                        <span>Processing Fees (7d)</span>
                                        <span className="font-mono">$ {(stats.balance * 0.03).toFixed(2)}</span>
                                    </div>

                                    <Button
                                        className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold uppercase tracking-wider text-xs h-10"
                                        onClick={() => window.open(stripeUrl || '#', '_blank')}
                                    >
                                        Open Stripe Dashboard
                                    </Button>
                                </div>

                                {/* Background decoration */}
                                <DollarSign className="absolute -bottom-8 -right-8 h-40 w-40 text-white/10 rotate-12" />
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}
