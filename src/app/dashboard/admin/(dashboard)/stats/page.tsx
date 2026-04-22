'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Users, ShoppingBag, DollarSign, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function AdminStatsPage() {
    const supabase = createClient()
    const [stats, setStats] = useState({
        revenue: 0,
        orders: 0,
        users: 0,
        stores: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            const [users, stores, products] = await Promise.all([
                supabase.from('profiles').select('*', { count: 'exact', head: true }),
                supabase.from('stores').select('*', { count: 'exact', head: true }),
                supabase.from('products').select('*', { count: 'exact', head: true })
            ])

            setStats({
                revenue: 12450.50, // Mock for now
                orders: 156, // Mock for now
                users: users.count || 0,
                stores: stores.count || 0
            })
            setLoading(false)
        }
        fetchStats()
    }, [])

    if (loading) return <div className="p-8 bg-black min-h-screen text-zinc-500">Loading System Intelligence...</div>

    return (
        <div className="p-8 bg-[#050505] min-h-screen text-white">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-serif tracking-tight">Marketplace Intelligence</h1>
                    <p className="text-zinc-500 text-sm">Comprehensive performance metrics across the Americana ecosystem.</p>
                </div>
                <Badge className="bg-green-500/20 text-green-500 border-green-500/30">SYSTEM STABLE</Badge>
            </div>

            <div className="grid grid-cols-4 gap-6 mb-8">
                <StatCard
                    label="Total Revenue"
                    value={`$${stats.revenue.toLocaleString()}`}
                    change="+14.2%"
                    isUp={true}
                    icon={<DollarSign className="w-5 h-5 text-green-500" />}
                />
                <StatCard
                    label="Total Orders"
                    value={stats.orders.toString()}
                    change="+5.1%"
                    isUp={true}
                    icon={<ShoppingBag className="w-5 h-5 text-[#ff007f]" />}
                />
                <StatCard
                    label="Active Curators"
                    value={stats.stores.toString()}
                    change="+2"
                    isUp={true}
                    icon={<ArrowUpRight className="w-5 h-5 text-blue-500" />}
                />
                <StatCard
                    label="Platform Users"
                    value={stats.users.toString()}
                    change="+124"
                    isUp={true}
                    icon={<Users className="w-5 h-5 text-zinc-400" />}
                />
            </div>

            <div className="grid grid-cols-3 gap-6">
                <Card className="col-span-2 bg-zinc-900/50 border-zinc-800 p-6 min-h-[300px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Growth Projection</h3>
                        <TrendingUp className="w-5 h-5 text-[#ff007f]" />
                    </div>
                    {/* Placeholder for a line chart */}
                    <div className="h-48 w-full bg-black/40 rounded flex items-center justify-center border border-zinc-800">
                        <span className="text-zinc-700 font-mono text-xs uppercase">Rendering Neural Plot...</span>
                    </div>
                </Card>

                <Card className="bg-zinc-900/50 border-zinc-800 p-6 min-h-[300px]">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-6">Conversion Funnel</h3>
                    <div className="space-y-4">
                        <FunnelStep label="Views" value="45.2k" color="bg-zinc-700" width="100%" />
                        <FunnelStep label="Added" value="8.4k" color="bg-[#ff007f]/60" width="40%" />
                        <FunnelStep label="Checkouts" value="1.2k" color="bg-[#ff007f]/80" width="15%" />
                        <FunnelStep label="Paid" value="854" color="bg-[#ff007f]" width="8%" />
                    </div>
                </Card>
            </div>
        </div>
    )
}

function StatCard({ label, value, change, isUp, icon }: any) {
    return (
        <Card className="bg-zinc-950 border-zinc-800 p-6 hover:border-[#ff007f]/50 transition-all group">
            <div className="flex justify-between items-start mb-4">
                <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{label}</div>
                <div className="p-2 bg-zinc-900 rounded-lg border border-white/5 group-hover:border-[#ff007f]/20 transition-colors">
                    {icon}
                </div>
            </div>
            <div className="text-2xl font-bold text-white mb-2">{value}</div>
            <div className={`text-[10px] font-bold ${isUp ? 'text-green-500' : 'text-red-500'} flex items-center gap-1`}>
                {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {change} <span className="text-zinc-600 ml-1">vs last period</span>
            </div>
        </Card>
    )
}

function FunnelStep({ label, value, color, width }: any) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                <span className="text-zinc-500">{label}</span>
                <span className="text-white">{value}</span>
            </div>
            <div className="h-2 bg-black rounded-full overflow-hidden">
                <div className={`h-full ${color} transition-all duration-1000`} style={{ width }} />
            </div>
        </div>
    )
}
