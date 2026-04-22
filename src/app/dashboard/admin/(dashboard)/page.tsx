'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Users,
    ShoppingCart,
    CreditCard,
    Target,
    Download,
    Info,
    MoreHorizontal,
    Cloud,
    Star,
    Leaf,
    Moon,
    Package
} from 'lucide-react'
import Link from 'next/link'

// Mock Data for "Marketplace Traffic Trends"
// (In a real app, use recharts. Here we simulate the sine waves with SVG for performance/dependencies)
const TrafficChart = () => (
    <div className="relative w-full h-[250px] mt-6 flex flex-col justify-end">
        {/* Legend - Moved Top Right */}
        <div className="absolute top-0 right-0 flex gap-4 z-10">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <span className="text-[10px] text-zinc-400 font-bold uppercase">The Lounge (Smoke)</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#ff007f]" />
                <span className="text-[10px] text-zinc-400 font-bold uppercase">Fashion & Art</span>
            </div>
        </div>

        {/* Chart Area */}
        <div className="relative flex-1 w-full">
            {/* Grids */}
            <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
            <div className="absolute inset-x-0 top-1/2 h-px bg-white/5 border-dashed border-b border-white/5" />
            <div className="absolute inset-x-0 top-0 h-px bg-white/5" />

            {/* Lines (SVG) - Now filling the relative container properly */}
            <svg viewBox="0 0 800 200" preserveAspectRatio="none" className="w-full h-full overflow-visible absolute inset-0">
                {/* Orange Line (The Lounge - Smoke Shop) */}
                <path
                    d="M0,150 C150,150 250,50 400,100 C550,150 650,50 800,80"
                    fill="none"
                    stroke="#F97316"
                    strokeWidth="3"
                    vectorEffect="non-scaling-stroke"
                    className="drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                />
                {/* Pink Line (Marketplace Growth - Fashion/Art) */}
                <path
                    d="M0,180 C100,170 300,160 400,80 C500,0 600,60 800,20"
                    fill="none"
                    stroke="#ff007f"
                    strokeWidth="3"
                    vectorEffect="non-scaling-stroke"
                    className="drop-shadow-[0_0_15px_rgba(255,0,127,0.8)]"
                />
            </svg>
        </div>

        {/* X-Axis Labels */}
        <div className="flex justify-between text-[10px] text-zinc-600 font-bold uppercase tracking-wider mt-2 px-1">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
        </div>
    </div>
)

const BehavioralFunnel = () => {
    // Funnel Steps
    const steps = [
        { label: 'LANDING PAGE', value: '100%', color: 'bg-[#ff007f]/40', width: '100%' },
        { label: 'Category View', value: '72%', color: 'bg-[#ff007f]/50', width: '72%' },
        { label: 'PRODUCT DETAILS', value: '45%', color: 'bg-[#ff007f]/60', width: '45%' },
        { label: 'ADD TO CART', value: '18%', color: 'bg-[#ff007f]/80', width: '30%' }, // Visually adjusted
        { label: 'PURCHASE', value: '4.2%', color: 'bg-[#ff007f]', width: '15%' },
    ]

    return (
        <div className="space-y-5 mt-2 relative">
            {steps.map((step, i) => (
                <div key={i}>
                    <div className="flex justify-between text-[9px] font-bold text-white mb-1 uppercase tracking-wider">
                        <span>{step.label}</span>
                        <span className="text-[#ff007f]">{step.value}</span>
                    </div>
                    <div className="h-3 bg-zinc-900 rounded-sm overflow-hidden relative">
                        <div
                            className={`h-full ${step.color} rounded-r-sm transition-all duration-1000 ease-out`}
                            style={{ width: step.width }}
                        />
                        {/* Vertical Marker for Goal */}
                        <div className="absolute right-[10%] top-0 h-full w-px bg-white/10 border-r border-dashed border-white/20" />
                    </div>
                </div>
            ))}

            <div className="mt-8 p-3 rounded bg-zinc-900/50 border border-zinc-800 flex items-start gap-3">
                <Info className="h-4 w-4 text-[#ff007f] shrink-0 mt-0.5" />
                <p className="text-[10px] text-zinc-500 italic">
                    Highest conviction seen in "Fine Art" category visitors this week.
                </p>
            </div>
        </div>
    )
}

const DemographicsMap = () => (
    <div className="h-[300px] w-full bg-[#0D0D0D] border border-white/5 relative rounded-lg overflow-hidden flex items-center justify-center group">
        {/* Simple Grid Background */}
        <div className="absolute inset-0 opacity-10"
            style={{
                backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
                backgroundSize: '20px 20px'
            }}
        />

        {/* Mock Map Shapes (Abstract) */}
        <div className="absolute inset-10 border border-zinc-800 rounded opacity-20" />

        {/* CDMX Focus (Center) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="w-4 h-4 bg-[#ff007f] rounded-full shadow-[0_0_30px_6px_#ff007f] animate-pulse z-20 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white]" />
            </div>
            <div className="absolute w-20 h-20 border border-[#ff007f]/30 rounded-full animate-ping" />
        </div>

        {/* Guadalajara / Monterrey (Mock positions based on abstract box) */}
        <div className="absolute top-[30%] left-[30%] w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_15px_cyan] z-10 opacity-60" />
        <div className="absolute top-[25%] left-[60%] w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_15px_orange] z-10 opacity-60" />

        <div className="absolute bottom-8 right-8 bg-black/90 border border-zinc-800 p-4 rounded-lg w-40 z-20 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
                <div className="w-2 h-2 rounded-full bg-[#ff007f]" />
                <h4 className="text-[9px] font-bold text-zinc-400 uppercase">Primary Market</h4>
            </div>
            {[
                { region: 'Mexico City', val: '68%' },
                { region: 'Guadalajara', val: '15%' },
                { region: 'Monterrey', val: '12%' },
            ].map((r, i) => (
                <div key={i} className="flex justify-between text-[10px] text-white mb-1 last:mb-0">
                    <span>{r.region}</span>
                    <span className="text-[#ff007f] font-bold">{r.val}</span>
                </div>
            ))}
        </div>

        <div className="absolute top-4 left-4">
            <h3 className="text-3xl font-mono font-bold text-[#ff007f]/5 tracking-[0.2em] group-hover:text-[#ff007f]/10 transition-colors">MX-CNTRL</h3>
        </div>
    </div>
)


const TopStoresTable = () => {
    const stores = [
        { name: 'Neon Smokehouse', icon: <Cloud className="h-4 w-4 text-orange-500" />, status: 'ACTIVE', revenue: '$42,500.00', growth: '+18.4%', growCol: 'text-pink-500' },
        { name: 'The Silk Room', icon: <Star className="h-4 w-4 text-pink-500" />, status: 'ACTIVE', revenue: '$38,120.50', growth: '+12.1%', growCol: 'text-pink-500' },
        { name: 'Organic Leaves', icon: <Leaf className="h-4 w-4 text-green-500" />, status: 'REVIEW', revenue: '$12,400.00', growth: '-2.5%', growCol: 'text-yellow-500' },
        { name: 'Midnight Toys', icon: <Moon className="h-4 w-4 text-purple-500" />, status: 'ACTIVE', revenue: '$29,905.10', growth: '+24.8%', growCol: 'text-pink-500' },
    ]

    return (
        <div className="mt-4 space-y-2">

            {/* Header */}
            <div className="flex justify-between text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-4 pb-2 border-b border-white/5">
                <span className="w-1/3">Store Name</span>
                <span className="w-1/6">Status</span>
                <span className="w-1/4 text-right">Revenue</span>
                <span className="w-1/6 text-right">Growth</span>
            </div>

            {/* Rows */}
            {stores.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-zinc-900/30 rounded hover:bg-zinc-900 transition-colors group">
                    <div className="w-1/3 flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-zinc-800 border border-white/5 flex items-center justify-center">
                            {s.icon}
                        </div>
                        <span className="text-xs font-bold text-white group-hover:text-[#ff007f] transition-colors">{s.name}</span>
                    </div>
                    <div className="w-1/6">
                        <Badge variant="outline" className={`border-0 text-[9px] h-4 px-1.5 ${s.status === 'ACTIVE' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-zinc-400'}`}>
                            {s.status}
                        </Badge>
                    </div>
                    <div className="w-1/4 text-right font-mono text-xs text-white">
                        {s.revenue}
                    </div>
                    <div className={`w-1/6 text-right font-mono text-xs font-bold ${s.growCol}`}>
                        {s.growth}
                    </div>
                </div>
            ))}

            {/* Footer Bar */}
            <div className="mt-6 pt-2">
                <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-zinc-700 w-[80%]" />
                </div>
                <div className="text-center text-[9px] font-bold text-zinc-500 uppercase tracking-widest cursor-pointer hover:text-white">
                    View All 412 Stores
                </div>
            </div>
        </div>
    )
}

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        users: 0,
        stores: 0,
        products: 0,
        orders: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSystemStats = async () => {
            const supabase = createClient()
            const [usersRes, storesRes, productsRes] = await Promise.all([
                supabase.from('profiles').select('id', { count: 'exact', head: true }),
                supabase.from('stores').select('id', { count: 'exact', head: true }),
                supabase.from('products').select('id', { count: 'exact', head: true })
            ])

            setStats({
                users: usersRes.count || 0,
                stores: storesRes.count || 0,
                products: productsRes.count || 0,
                orders: 0 // Placeholder for orders until table is ready
            })
            setLoading(false)
        }
        fetchSystemStats()
    }, [])

    if (loading) return <div className="p-8 bg-black min-h-screen text-zinc-500 flex items-center justify-center font-mono uppercase tracking-widest animate-pulse">Initializing System Monitor...</div>

    return (
        <div className="p-8 bg-[#050505] min-h-screen text-white font-sans">

            {/* Header / Search */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-[#ff007f] text-white hover:bg-[#ff007f] border-0 text-[10px] px-1.5 h-5 rounded-sm">LIVE MONITOR</Badge>
                        <span className="text-[10px] text-zinc-500">Last update: 2 mins ago</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Global User Analytics <span className="italic text-[#ff007f]">Overview</span>
                    </h1>
                    <p className="text-zinc-500 text-sm">Real-time marketplace health and cross-shop behavioral insights.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex bg-[#111] rounded-lg border border-[#222] p-1">
                        <Button size="sm" variant="ghost" className="h-7 text-[10px] font-bold bg-[#ff007f] text-white rounded hover:bg-[#ff007f]">30D</Button>
                        <Button size="sm" variant="ghost" className="h-7 text-[10px] font-bold text-zinc-500 hover:text-white">90D</Button>
                        <Button size="sm" variant="ghost" className="h-7 text-[10px] font-bold text-zinc-500 hover:text-white">1Y</Button>
                    </div>
                    <Button className="bg-[#ff007f] hover:bg-[#ff007f]/90 text-white font-bold h-9">
                        <Download className="w-4 h-4 mr-2" /> Report
                    </Button>
                </div>
            </div>

            {/* KPI ROW */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                <MetricCard
                    label="Registered Users"
                    value={stats.users.toLocaleString()}
                    change="+12% vs last month"
                    icon={<Users className="w-5 h-5 text-[#ff007f]" />}
                    color="text-[#ff007f]"
                />
                <MetricCard
                    label="Active Stores"
                    value={stats.stores.toLocaleString()}
                    change="Verified Portals"
                    icon={<ShoppingCart className="w-5 h-5 text-green-500" />}
                    color="text-green-500"
                />
                <MetricCard
                    label="Listed Products"
                    value={stats.products.toLocaleString()}
                    change="System Inventory"
                    icon={<Package className="w-5 h-5 text-zinc-400" />}
                    color="text-white"
                />
                <MetricCard
                    label="Acquisition Cost"
                    value="$12.45"
                    change="-- STABLE optimized"
                    icon={<Target className="w-5 h-5 text-zinc-400" />}
                    color="text-white"
                />
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="grid grid-cols-12 gap-6 h-auto">

                {/* LEFT: Traffic Trends (Large) */}
                <Card className="col-span-8 bg-[#0D0D0D] border-[#222] p-6 min-h-[400px]">
                    <h3 className="text-sm font-bold text-white mb-4">Marketplace Traffic Trends</h3>
                    <TrafficChart />
                </Card>

                {/* RIGHT: Behavioral Funnel */}
                <Card className="col-span-4 bg-[#0D0D0D] border-[#222] p-6 min-h-[400px]">
                    <h3 className="text-sm font-bold text-white mb-8">Behavioral Funnel</h3>
                    <BehavioralFunnel />
                </Card>

                {/* BOTTOM LEFT: Demographics */}
                <Card className="col-span-12 lg:col-span-5 bg-[#0D0D0D] border-[#222] p-6 min-h-[400px]">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-sm font-bold text-white">User Demographics</h3>
                            <p className="text-[10px] text-zinc-500">Global density heatmap</p>
                        </div>
                        <Link href="/dashboard/admin/geo">
                            <Button variant="ghost" size="sm" className="text-[9px] text-[#ff007f] font-bold uppercase hover:bg-[#ff007f]/10">View Heatmap</Button>
                        </Link>
                    </div>
                    <DemographicsMap />
                </Card>

                {/* BOTTOM RIGHT: Top Stores */}
                <Card className="col-span-12 lg:col-span-7 bg-[#0D0D0D] border-[#222] p-6 min-h-[400px]">
                    <div className="flex justify-between items-center mb-2">
                        <div>
                            <h3 className="text-sm font-bold text-white">Top Performing Stores</h3>
                            <p className="text-[10px] text-zinc-500">Revenue & Volume Leaderboard</p>
                        </div>
                        <MoreHorizontal className="text-zinc-500 w-5 h-5" />
                    </div>
                    <TopStoresTable />
                    <div className="text-center text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-4">
                        Total {stats.stores} Stores in System
                    </div>
                </Card>

            </div>
        </div>
    )
}

function MetricCard({ label, value, change, icon, color, isNegative }: any) {
    return (
        <Card className="bg-[#0D0D0D] border-[#222] p-6 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
                <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{label}</div>
                <div className="p-1">{icon}</div>
            </div>
            <div className="text-3xl font-bold text-white mb-2">{value}</div>
            <div className={`text-[10px] font-bold ${isNegative ? 'text-orange-500' : 'text-green-500'} flex items-center gap-2`}>
                {change}
            </div>
        </Card>
    )
}
