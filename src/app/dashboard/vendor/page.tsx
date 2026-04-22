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
    Zap,
    MessageSquare,
    Download,
    Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useVendor } from '@/providers/vendor-provider'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts'

function VendorDashboardContent() {
    const supabase = createClient()
    const router = useRouter()
    const { activeStore, isLoading: isVendorLoading } = useVendor()
    const [stats, setStats] = useState({
        balance: 0,
        inTransit: 0,
        pending: 0,
        lowStockCount: 0,
        inquiriesCount: 0
    })
    const [userProfile, setUserProfile] = useState<any>(null)

    const [recentInquiries, setRecentInquiries] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const [realActivity, setRealActivity] = useState<any[]>([])
    const [realInventory, setRealInventory] = useState<any[]>([])
    const [chartData, setChartData] = useState<any[]>([])

    useEffect(() => {
        if (!activeStore) return

        const fetchStatsAndProfiles = async () => {
            try {
                // 0. Fetch logged-in user profile
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', user.id)
                        .single()
                    setUserProfile(profile)
                }

                // 2. Fetch Active Shipments & Total Sales for this store
                const { data: storeOrders } = await supabase
                    .from('orders')
                    .select('total_amount, status, created_at')
                    .eq('store_id', activeStore.id)

                const totalBalance = (storeOrders || [])
                    .filter((o: any) => o.status !== 'cancelled')
                    .reduce((sum: number, o: any) => sum + Number(o.total_amount), 0)

                const activeShipmentsCount = (storeOrders || [])
                    .filter((o: any) => ['processing', 'shipped', 'in_transit'].includes(o.status))
                    .length

                // 3. Fetch Low Stock
                const { data: lowStockProducts } = await supabase
                    .from('products')
                    .select('name, sku, stock, images')
                    .eq('store_id', activeStore.id)
                    .lt('stock', 10)
                    .order('stock', { ascending: true })
                    .limit(5)

                if (lowStockProducts) {
                    setRealInventory(lowStockProducts.map((p: any) => ({
                        name: p.name,
                        sku: p.sku || 'NO-SKU',
                        stock: p.stock,
                        status: p.stock < 3 ? 'Critically Low' : 'Restock Suggested',
                        image: p.images?.[0] || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=100&h=100&fit=crop'
                    })))
                }

                // 4. Fetch Chat Inquiries & Real Activity
                const { data: recentOrders } = await supabase
                    .from('orders')
                    .select('*, profiles(full_name)')
                    .eq('store_id', activeStore.id)
                    .order('created_at', { ascending: false })
                    .limit(4)

                if (recentOrders) {
                    setRealActivity(recentOrders.map((o: any) => ({
                        type: 'order',
                        user: (o.profiles as any)?.full_name || 'Nuevo Cliente',
                        text: `placed Order #${o.id.slice(0, 8).toUpperCase()}`,
                        item: `$${o.total_amount}`,
                        time: new Date(o.created_at).toLocaleTimeString(),
                    })))
                }

                // 4. Fetch Real Activity
                const { data: inquiryList } = await supabase
                    .from('conversations')
                    .select('*, conversation_participants(user_id)')
                    .eq('store_id', activeStore.id)
                    .eq('type', 'inquiry')
                    .order('updated_at', { ascending: false })
                    .limit(5)

                const processedInquiries = await Promise.all((inquiryList || []).map(async (inq: any) => {
                    const buyerId = inq.conversation_participants?.find((p: any) => p.user_id !== user?.id)?.user_id
                    if (buyerId) {
                        const { data: buyerProfile } = await supabase
                            .from('profiles')
                            .select('full_name, avatar_url')
                            .eq('id', buyerId)
                            .single()
                        return { ...inq, buyer: buyerProfile }
                    }
                    return inq
                }))

                setStats({
                    balance: totalBalance,
                    inTransit: activeShipmentsCount,
                    pending: (storeOrders || []).filter((o: any) => o.status === 'processing').length,
                    lowStockCount: lowStockProducts?.length || 0,
                    inquiriesCount: processedInquiries.length
                })
                setRecentInquiries(processedInquiries)

                // 7. Process Chart Data
                const chartDataMap = (storeOrders || []).reduce((acc: any, order: any) => {
                    const date = order.created_at.split('T')[0]
                    acc[date] = (acc[date] || 0) + Number(order.total_amount)
                    return acc
                }, {})



                const finalChartData = Array.from({ length: 7 }, (_, i) => {
                    const d = new Date()
                    d.setDate(d.getDate() - (6 - i))
                    const dateKey = d.toISOString().split('T')[0]
                    return {
                        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
                        amount: chartDataMap[dateKey] || 0
                    }
                })
                setChartData(finalChartData)

            } catch (error) {
                console.error('Dashboard Error:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchStatsAndProfiles()
    }, [activeStore])


    // ------------------------------------------------------------------
    // RENDER: Loading / Empty / Data
    // ------------------------------------------------------------------

    if (isVendorLoading || loading) {
        return <div className="p-10 text-zinc-500 animate-pulse">Loading dashboard...</div>
    }

    if (!activeStore) {
        return <div className="p-10 text-zinc-500">No store selected.</div>
    }

    return (
        <div className="flex-1 h-full overflow-y-auto bg-black p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-white tracking-tight">
                            Dashboard
                        </h1>
                        <div className="text-zinc-400 mt-1 flex items-center gap-2">
                            Overview for <span className="text-[#f4256a] font-bold">{activeStore.name}</span>
                            <Badge variant="outline" className="border-[#f4256a]/30 text-[#f4256a] bg-[#f4256a]/5 text-[10px] uppercase tracking-widest">{activeStore.status}</Badge>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="border-white/10 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300">
                            <Download className="mr-2 h-4 w-4" /> Reports
                        </Button>
                        <Button className="bg-[#f4256a] hover:bg-[#f4256a]/90 text-white font-bold tracking-wide shadow-[0_0_20px_rgba(244,37,106,0.5)] border border-[#f4256a]/20">
                            <Plus className="mr-2 h-4 w-4" /> Create Product
                        </Button>
                    </div>
                </div>

                {/* KPI Grid - Neon Style */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Revenue */}
                    <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-sm hover:border-[#f4256a]/30 transition-all group">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Total Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <span className="text-3xl font-mono font-bold text-white group-hover:text-[#f4256a] transition-colors">
                                    ${stats.balance.toLocaleString()}
                                </span>
                                <div className="h-8 w-8 rounded-full bg-[#f4256a]/10 flex items-center justify-center border border-[#f4256a]/20">
                                    <DollarSign className="h-4 w-4 text-[#f4256a]" />
                                </div>
                            </div>
                            <div className="mt-2 text-xs text-emerald-500 font-bold flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" /> +12.5% <span className="text-zinc-600 font-normal">vs last month</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Active Shipments */}
                    <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-sm hover:border-[#f4256a]/30 transition-all group">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-zinc-400 text-xs font-bold uppercase tracking-widest">In Transit</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <span className="text-3xl font-mono font-bold text-white group-hover:text-[#f4256a] transition-colors">
                                    {stats.inTransit}
                                </span>
                                <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                    <Truck className="h-4 w-4 text-blue-500" />
                                </div>
                            </div>
                            <div className="mt-2 text-xs text-zinc-500 flex items-center gap-1">
                                {stats.pending} pending processing
                            </div>
                        </CardContent>
                    </Card>

                    {/* Store Visitors (Mock) */}
                    <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-sm hover:border-[#f4256a]/30 transition-all group">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Store Visitors</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <span className="text-3xl font-mono font-bold text-white group-hover:text-[#f4256a] transition-colors">
                                    8.2k
                                </span>
                                <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                                    <Eye className="h-4 w-4 text-purple-500" />
                                </div>
                            </div>
                            <div className="mt-2 text-xs text-emerald-500 font-bold flex items-center gap-1">
                                <Zap className="h-3 w-3" /> High Traffic
                            </div>
                        </CardContent>
                    </Card>

                    {/* New Messages */}
                    <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-sm hover:border-[#f4256a]/30 transition-all group">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Inquiries</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <span className="text-3xl font-mono font-bold text-white group-hover:text-[#f4256a] transition-colors">
                                    {stats.inquiriesCount}
                                </span>
                                <div className="h-8 w-8 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                                    <MessageSquare className="h-4 w-4 text-yellow-500" />
                                </div>
                            </div>
                            <div className="mt-2 text-xs text-zinc-500 flex items-center gap-1">
                                Response time: &lt; 5m
                            </div>
                        </CardContent>
                    </Card>
                </div>


                {/* Main Content Split */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Visual Analytics - Graph */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="bg-zinc-900/40 border-white/5 overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg font-bold text-white">Revenue Performance</CardTitle>
                                    <p className="text-zinc-500 text-xs uppercase tracking-wider mt-1">Last 30 Days</p>
                                </div>
                                <Tabs defaultValue="revenue">
                                    <TabsList className="bg-black border border-white/10 h-8">
                                        <TabsTrigger value="revenue" className="text-xs h-6 data-[state=active]:bg-[#f4256a] data-[state=active]:text-white">Revenue</TabsTrigger>
                                        <TabsTrigger value="orders" className="text-xs h-6 data-[state=active]:bg-[#f4256a] data-[state=active]:text-white">Orders</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </CardHeader>
                            <CardContent className="h-[300px] w-full p-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData.length > 0 ? chartData : [{ date: 'No Data', amount: 0 }]}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#f4256a" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#f4256a" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="amount"
                                            stroke="#f4256a"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorRevenue)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Inventory Warning */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="bg-zinc-900/40 border-white/5">
                                <CardHeader>
                                    <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-orange-500" /> Low Stock Alert
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {realInventory.length === 0 ? (
                                        <div className="text-zinc-500 text-sm italic">All stock levels good.</div>
                                    ) : (
                                        realInventory.map((item, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className="h-10 w-10 bg-zinc-800 rounded-md bg-cover bg-center border border-white/5"
                                                    style={{ backgroundImage: `url(${item.image})` }}></div>
                                                <div className="flex-1">
                                                    <div className="text-sm font-bold text-white">{item.name}</div>
                                                    <div className="text-xs text-zinc-500">SKU: {item.sku}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-bold text-orange-500">{item.stock} left</div>
                                                    <Button variant="link" className="h-auto p-0 text-[10px] text-zinc-400 hover:text-white">Restock</Button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </CardContent>
                            </Card>

                            {/* Global Activity Feed */}
                            <Card className="bg-zinc-900/40 border-white/5">
                                <CardHeader>
                                    <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                                        <Zap className="h-4 w-4 text-yellow-500" /> Live Feed
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {realActivity.map((act, i) => (
                                        <div key={i} className="flex gap-3 relative">
                                            {i !== realActivity.length - 1 && (
                                                <div className="absolute left-[15px] top-8 bottom-[-24px] w-px bg-zinc-800"></div>
                                            )}
                                            <div className="h-8 w-8 rounded-full border border-white/10 bg-cover bg-center shrink-0 z-10"
                                                style={{ backgroundImage: `url(${act.avatar || 'https://github.com/shadcn.png'})` }}></div>
                                            <div>
                                                <p className="text-xs text-zinc-300">
                                                    <span className="font-bold text-white">{act.user}</span> {act.action}
                                                </p>
                                                <p className="text-[10px] text-zinc-500 mt-1">{act.time}</p>
                                            </div>
                                            {act.amount && (
                                                <div className="ml-auto text-xs font-mono font-bold text-emerald-500">{act.amount}</div>
                                            )}
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Sidebar / Quick Actions */}
                    <div className="space-y-6">
                        {/* Welcome Card */}
                        <div className="bg-linear-to-br from-[#f4256a] to-[#ff007f] rounded-xl p-6 relative overflow-hidden text-white shadow-lg">
                            <div className="relative z-10">
                                <h2 className="text-2xl font-serif font-black italic mb-2">Welcome Back, {userProfile?.full_name?.split(' ')[0] || 'Boss'}</h2>
                                <p className="text-white/80 text-sm mb-6 max-w-[80%]">
                                    Your store is currently visible to 12.4k active shoppers in your region.
                                </p>
                                <Button className="bg-white text-[#f4256a] hover:bg-zinc-100 font-bold border-0">
                                    Promote Store <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                            {/* Decorative Circles */}
                            <div className="absolute -right-10 -bottom-10 h-40 w-40 bg-white/20 rounded-full blur-2xl"></div>
                            <div className="absolute top-0 right-0 h-20 w-20 bg-purple-500/30 rounded-full blur-xl"></div>
                        </div>

                        {/* Quick Links */}
                        <Card className="bg-zinc-900/40 border-white/5">
                            <CardHeader>
                                <CardTitle className="text-sm font-bold text-white">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-3">
                                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 border-zinc-800 bg-black hover:bg-zinc-800 text-zinc-400 hover:text-white group transition-all">
                                    <Package className="h-5 w-5 group-hover:text-[#f4256a] transition-colors" />
                                    <span className="text-xs">Orders</span>
                                </Button>
                                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 border-zinc-800 bg-black hover:bg-zinc-800 text-zinc-400 hover:text-white group transition-all">
                                    <MessageSquare className="h-5 w-5 group-hover:text-[#f4256a] transition-colors" />
                                    <span className="text-xs">Chat Support</span>
                                </Button>
                                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 border-zinc-800 bg-black hover:bg-zinc-800 text-zinc-400 hover:text-white group transition-all">
                                    <AlertTriangle className="h-5 w-5 group-hover:text-orange-500 transition-colors" />
                                    <span className="text-xs">Disputes</span>
                                </Button>
                                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 border-zinc-800 bg-black hover:bg-zinc-800 text-zinc-400 hover:text-white group transition-all">
                                    <MoreHorizontal className="h-5 w-5" />
                                    <span className="text-xs">Settings</span>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Recent Inquiries List */}
                        <Card className="bg-zinc-900/40 border-white/5 h-full">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-sm font-bold text-white">Recent Inquiries</CardTitle>
                                <Link href="/dashboard/chat" className="text-[10px] text-[#f4256a] hover:underline uppercase font-bold tracking-wider">
                                    View All
                                </Link>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {recentInquiries.length === 0 ? (
                                    <div className="text-center py-8">
                                        <MessageSquare className="h-8 w-8 text-zinc-700 mx-auto mb-2" />
                                        <p className="text-zinc-500 text-xs">No active chats.</p>
                                    </div>
                                ) : (
                                    recentInquiries.map((chat) => (
                                        <div key={chat.id} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer" onClick={() => router.push('/dashboard/chat')}>
                                            <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-500 text-xs border border-white/5">
                                                {chat.id.slice(0, 2).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="text-xs font-bold text-white truncate w-24">User {chat.user_id?.slice(0, 4)}</h4>
                                                    <span className="text-[10px] text-zinc-500 whitespace-nowrap">
                                                        {new Date(chat.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-zinc-400 truncate">
                                                    Latest message preview...
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
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
