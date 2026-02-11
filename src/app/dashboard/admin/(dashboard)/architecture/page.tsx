'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import {
    Database,
    Users,
    Store,
    Package,
    ShoppingCart,
    ArrowRight,
    Activity,
    Server,
    ShieldAlert,
    GitBranch
} from 'lucide-react'

export default function ERDVisualizerPage() {
    const supabase = createClient()
    const [counts, setCounts] = useState({
        users: 0,
        stores: 0,
        products: 0,
        orders: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCounts = async () => {
            setLoading(true)
            const stats = { users: 0, stores: 0, products: 0, orders: 0 }

            // Parallel fetching for speed
            const [u, s, p, o] = await Promise.all([
                supabase.from('profiles').select('*', { count: 'exact', head: true }),
                supabase.from('stores').select('*', { count: 'exact', head: true }),
                supabase.from('products').select('*', { count: 'exact', head: true }),
                supabase.from('orders').select('*', { count: 'exact', head: true })
            ])

            stats.users = u.count || 0
            stats.stores = s.count || 0
            stats.products = p.count || 0
            stats.orders = o.count || 0

            setCounts(stats)
            setLoading(false)
        }
        fetchCounts()
    }, [])

    // Card Component for Tables
    const TableNode = ({ title, icon: Icon, count, color, x, y }: any) => (
        <div
            className={cn(
                "absolute w-64 p-5 backdrop-blur-xl border bg-[#121212]/90 transition-all duration-300 group hover:scale-105 hover:z-10",
                color === 'blue' ? "border-[#0db9f2] shadow-[0_0_15px_rgba(13,185,242,0.1)]" :
                    color === 'pink' ? "border-[#ff007f] shadow-[0_0_15px_rgba(255,0,127,0.1)]" :
                        color === 'green' ? "border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.1)]" :
                            "border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.1)]"
            )}
            style={{ left: x, top: y }}
        >
            <div className="flex items-center justify-between mb-4">
                <span className={cn("text-[9px] font-bold tracking-widest uppercase",
                    color === 'blue' ? "text-[#0db9f2]" :
                        color === 'pink' ? "text-[#ff007f]" :
                            color === 'green' ? "text-green-500" : "text-orange-500"
                )}>Table Entity</span>
                <Icon className={cn("w-5 h-5",
                    color === 'blue' ? "text-[#0db9f2]" :
                        color === 'pink' ? "text-[#ff007f]" :
                            color === 'green' ? "text-green-500" : "text-orange-500"
                )} />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-1 text-white">{title}</h3>
            <div className="flex items-end gap-2 mb-4">
                <span className="text-3xl font-mono text-white leading-none">{loading ? '--' : count}</span>
                <span className="text-[10px] text-zinc-500 mb-1">records</span>
            </div>

            {/* Columns Preview */}
            <div className="space-y-1 border-t border-white/5 pt-3">
                <div className="flex items-center justify-between text-[10px] text-zinc-500">
                    <span className="font-mono">id</span>
                    <span className="text-zinc-700">uuid pk</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-zinc-500">
                    <span className="font-mono">created_at</span>
                    <span className="text-zinc-700">timestamp</span>
                </div>
            </div>
        </div>
    )

    return (
        <div className="h-full bg-[#050505] relative overflow-hidden flex flex-col font-sans">
            {/* Background Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{
                backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)',
                backgroundSize: '40px 40px'
            }}></div>

            {/* Header / Control Bar */}
            <div className="p-6 border-b border-[#222] bg-[#0a0a0a]/90 backdrop-blur z-20 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-[#0db9f2]/10 rounded border border-[#0db9f2]/20">
                        <Database className="w-5 h-5 text-[#0db9f2]" />
                    </div>
                    <div>
                        <h1 className="text-white font-bold uppercase tracking-widest text-sm">System Architecture Visualizer</h1>
                        <p className="text-[10px] text-zinc-500 font-mono">Live Database Connection</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[10px] font-bold text-green-500 uppercase">Supabase: Connected</span>
                    </div>
                    <div className="h-8 w-px bg-[#222]"></div>
                    <div className="text-right">
                        <p className="text-[10px] text-zinc-500 uppercase">Total Records</p>
                        <p className="text-sm font-bold text-white font-mono">
                            {loading ? '...' : counts.users + counts.stores + counts.products + counts.orders}
                        </p>
                    </div>
                </div>
            </div>

            {/* Visualization Area */}
            <div className="flex-1 relative overflow-auto ml-10 mt-10">

                {/* SVG Connections Layer */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
                    <defs>
                        <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                            <path d="M0,0 L0,6 L9,3 z" fill="#333" />
                        </marker>
                    </defs>

                    {/* Users -> Orders */}
                    <path d="M280 150 C 350 150, 450 150, 450 320" fill="none" stroke="#222" strokeWidth="2" markerEnd="url(#arrow)" />

                    {/* Stores -> Products */}
                    <path d="M280 400 C 350 400, 400 400, 450 400" fill="none" stroke="#222" strokeWidth="2" markerEnd="url(#arrow)" />

                    {/* Products -> Orders (Order Items) */}
                    <path d="M730 400 C 680 400, 680 350, 730 350" fill="none" stroke="#222" strokeWidth="2" strokeDasharray="5,5" />

                </svg>

                <div className="relative min-w-[1000px] min-h-[800px]">
                    {/* USERS Node */}
                    <TableNode
                        title="Profiles (Users)"
                        icon={Users}
                        count={counts.users}
                        color="blue"
                        x="20px"
                        y="80px"
                    />

                    {/* STORES Node */}
                    <TableNode
                        title="Stores (Vendors)"
                        icon={Store}
                        count={counts.stores}
                        color="pink"
                        x="20px"
                        y="350px"
                    />

                    {/* PRODUCTS Node */}
                    <TableNode
                        title="Products"
                        icon={Package}
                        count={counts.products}
                        color="orange"
                        x="450px"
                        y="350px"
                    />

                    {/* ORDERS Node */}
                    <TableNode
                        title="Orders"
                        icon={ShoppingCart}
                        count={counts.orders}
                        color="green"
                        x="450px"
                        y="80px"
                    />

                    {/* System Status Node (Decorator) */}
                    <div className="absolute right-20 top-20 w-72 p-6 bg-black border border-[#333] rounded-lg">
                        <div className="flex items-center gap-3 mb-4 text-zinc-500">
                            <Activity className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">System Health</span>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                                    <span>API Latency</span>
                                    <span className="text-green-500">24ms</span>
                                </div>
                                <div className="h-1 w-full bg-[#111] rounded-full overflow-hidden">
                                    <div className="h-full w-[20%] bg-green-500"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                                    <span>Storage Usage</span>
                                    <span className="text-[#0db9f2]">45%</span>
                                </div>
                                <div className="h-1 w-full bg-[#111] rounded-full overflow-hidden">
                                    <div className="h-full w-[45%] bg-[#0db9f2]"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
