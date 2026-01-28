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
    MessageSquare
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useVendor } from '@/providers/vendor-provider'

import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

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
                    .select('total_amount, status')
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
                    setRealInventory(lowStockProducts.map(p => ({
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
                    setRealActivity(recentOrders.map(o => ({
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
            } catch (error) {
                console.error('Error fetching stats:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchStatsAndProfiles()
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
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
                        <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center border border-white/5 overflow-hidden">
                            {userProfile?.avatar_url ? (
                                <img src={userProfile.avatar_url} className="h-full w-full object-cover" />
                            ) : (
                                <span className="font-serif italic text-xs uppercase">{userProfile?.full_name?.substring(0, 2) || 'AM'}</span>
                            )}
                        </div>
                        <div className="text-right">
                            <div className="text-xs font-bold text-white tracking-tight">{userProfile?.full_name || 'Vendor Admin'}</div>
                            <div className="text-[8px] text-zinc-500 uppercase tracking-[0.2em] font-black">{activeStore?.name}</div>
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
                                <div className="text-3xl font-bold font-mono text-white mb-2">
                                    ${stats.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                                <div className="text-xs font-medium text-green-500 flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" /> Real-time <span className="text-zinc-600">from orders</span>
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
                                <div className="text-3xl font-bold font-mono text-white mb-2">{stats.inTransit}</div>
                                <div className="text-xs font-medium text-blue-500 flex items-center gap-1">
                                    <Truck className="h-3 w-3" /> {stats.pending} <span className="text-zinc-600">pending processing</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Inquiries */}
                        <Card className="bg-[#121217] border-zinc-800 relative overflow-hidden border-l-2 border-l-cyan-500">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Nuevas Consultas</div>
                                    <div className="p-1.5 bg-cyan-500/10 rounded text-cyan-500">
                                        <MessageSquare className="h-4 w-4" />
                                    </div>
                                </div>
                                <div className="text-3xl font-bold font-mono text-white mb-2">{stats.inquiriesCount}</div>
                                <div className="text-xs font-bold text-cyan-500">Chat CRM Activo</div>
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
                            {realInventory.length === 0 ? (
                                <div className="text-zinc-600 text-xs py-4 text-center">Todo el inventario està saludable.</div>
                            ) : (
                                realInventory.map((item, i) => (
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
                                ))
                            )}
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN (1/3 width) - Activity & Leads */}
                <div className="space-y-6">
                    {/* Recent Leads / Inquiries */}
                    <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-white tracking-tight">Active Inquiries</h3>
                        {stats.inquiriesCount > 0 && <Badge className="bg-cyan-500 text-black font-bold h-5 px-1.5">{stats.inquiriesCount}</Badge>}
                    </div>

                    <div className="space-y-3">
                        {recentInquiries.length === 0 ? (
                            <div className="p-4 rounded-xl border border-dashed border-zinc-800 text-center text-zinc-600 text-[10px] uppercase tracking-widest">
                                Sin nuevas consultas
                            </div>
                        ) : (
                            recentInquiries.map((inq, i) => (
                                <button
                                    key={i}
                                    onClick={() => router.push(`/dashboard/chat?id=${inq.id}`)}
                                    className="w-full bg-[#121217] border border-zinc-800/80 p-3 rounded-xl hover:bg-white/5 transition-all group text-left"
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-[10px] font-bold text-cyan-500 tracking-widest uppercase">{inq.title || 'Consulta de Producto'}</span>
                                        <span className="text-[9px] text-zinc-600">{new Date(inq.updated_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                                        {inq.buyer?.full_name || 'Solicitud de Cliente'}
                                    </div>
                                    <div className="text-xs text-zinc-500 mt-1 line-clamp-1">{inq.last_message_preview || 'Abriendo canal de comunicación...'}</div>
                                </button>
                            ))
                        )}
                        <Button
                            variant="link"
                            onClick={() => router.push('/dashboard/chat')}
                            className="text-zinc-500 hover:text-cyan-500 text-[10px] uppercase tracking-widest font-bold p-0 h-auto"
                        >
                            Ver Centro de Mensajes <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                    </div>

                    <div className="pt-4 flex items-center gap-3">
                        <h3 className="text-lg font-bold text-white">Global Activity</h3>
                        <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
                    </div>

                    <div className="relative border-l border-zinc-800 ml-3 space-y-8 py-2">
                        {realActivity.length === 0 ? (
                            <div className="text-zinc-600 text-[10px] uppercase tracking-widest pl-8">Sin actividad reciente</div>
                        ) : (
                            realActivity.map((event, i) => (
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
                            ))
                        )}
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

import { AIAssistant } from '@/components/ai/ai-assistant'

export default function VendorDashboard() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#09090b] flex items-center justify-center text-cyan-500">Loading Vendor Interface...</div>}>
            <VendorDashboardContent />
            <AIAssistant />
        </Suspense>
    )
}
