'use client'

import { useState } from 'react'
import {
    DollarSign,
    TrendingUp,
    Package,
    Zap,
    ArrowUpRight,
    ArrowRight,
    Wallet,
    MoreVertical,
    Download
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

export default function VendorAnalyticsPage() {

    // Mock Data reflecting the "Sales & Inventory Insights" screenshot
    const inventoryData = [
        {
            name: 'Nordic Lounge Chair',
            sku: 'FURN-082',
            itemsLeft: 8,
            status: 'Critically Low',
            velocity: '12.4/day',
            trend: 'up',
            image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=100&h=100&fit=crop',
            action: 'Restock Now'
        },
        {
            name: 'Aura Desk Lamp',
            sku: 'LITE-041',
            itemsLeft: 45,
            status: 'Healthy',
            velocity: '4.1/day',
            trend: 'stable',
            image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=100&h=100&fit=crop',
            action: null
        },
        {
            name: 'Orbital Ceramic Vase',
            sku: 'DECO-019',
            itemsLeft: 18,
            status: 'Warning',
            velocity: '8.7/day',
            trend: 'up',
            image: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=100&h=100&fit=crop',
            action: 'Restock'
        },
        {
            name: 'Horizon Wall Art',
            sku: 'ART-992',
            itemsLeft: 122,
            status: 'Overstock',
            velocity: '0.5/day',
            trend: 'down',
            image: 'https://images.unsplash.com/photo-1582236371190-2003c9d2f2d9?w=100&h=100&fit=crop',
            action: null
        }
    ]

    return (
        <div className="min-h-screen bg-[#09090b] text-white p-8 font-sans">

            {/* Header */}
            <div className="flex items-end justify-between mb-8 border-b border-white/10 pb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="h-4 w-1 bg-cyan-500 rounded-full" />
                        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Merchant Insights</h2>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Sales & Inventory Insights</h1>
                    <p className="text-zinc-500 mt-1">Real-time performance and financial overview for your storefront.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800">
                        <Download className="mr-2 h-4 w-4" /> Export Report
                    </Button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Revenue */}
                <Card className="bg-[#121217] border-zinc-800">
                    <CardHeader className="pb-2">
                        <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Total Revenue</div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2">
                            <div className="text-3xl font-bold text-white font-mono">$124,500.00</div>
                            <span className="text-xs text-green-500 font-bold flex items-center">
                                <TrendingUp className="h-3 w-3 mr-1" /> +12.5%
                            </span>
                        </div>
                        <Progress value={75} className="h-1 mt-4 bg-zinc-800" indicatorClassName="bg-cyan-500" />
                    </CardContent>
                </Card>

                {/* Marketplace Contribution */}
                <Card className="bg-[#121217] border-zinc-800">
                    <CardHeader className="pb-2">
                        <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Marketplace Contribution</div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2">
                            <div className="text-3xl font-bold text-white font-mono">4.2%</div>
                            <span className="text-xs text-green-500 font-bold flex items-center">
                                <TrendingUp className="h-3 w-3 mr-1" /> +0.8%
                            </span>
                        </div>
                        <div className="text-[10px] text-zinc-500 mt-2">of global marketplace volume</div>
                    </CardContent>
                </Card>

                {/* Active Listings */}
                <Card className="bg-[#121217] border-zinc-800">
                    <CardHeader className="pb-2">
                        <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Active Listings</div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2">
                            <div className="text-3xl font-bold text-white font-mono">842</div>
                            <span className="text-xs text-green-500 font-bold flex items-center">
                                <TrendingUp className="h-3 w-3 mr-1" /> +15%
                            </span>
                        </div>
                        <div className="text-[10px] text-zinc-500 mt-2">32 items added this month</div>
                    </CardContent>
                </Card>

                {/* Sales Velocity */}
                <Card className="bg-[#121217] border-zinc-800">
                    <CardHeader className="pb-2">
                        <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Sales Velocity</div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2">
                            <div className="text-3xl font-bold text-white font-mono">48.5</div>
                            <span className="text-xs text-zinc-500 font-bold">units/day</span>
                        </div>
                        <div className="text-[10px] text-cyan-500 mt-2 font-bold">+2.1 vs last week</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT COLUMN: Stripe Payouts & Global Impact */}
                <div className="space-y-8">

                    {/* Stripe Payouts Card */}
                    <Card className="bg-[#121217] border-zinc-800">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-bold text-white">Stripe Payouts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-[#09090b] rounded-xl p-6 border border-zinc-800 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4">
                                    <div className="h-10 w-10 bg-cyan-900/20 rounded-full flex items-center justify-center text-cyan-500">
                                        <Wallet className="h-5 w-5" />
                                    </div>
                                </div>

                                <div className="text-xs text-zinc-400 mb-1 flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
                                    Next Transfer: Oct 24, 2023
                                </div>
                                <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Available Balance</div>
                                <div className="text-4xl font-bold text-cyan-500 font-mono mb-6">$12,450.00</div>

                                <div className="flex justify-between text-[10px] text-zinc-500 mb-4 border-t border-zinc-800 pt-4">
                                    <div>Pending: $2,140.00</div>
                                    <div>Processing: $480.00</div>
                                </div>

                                <Progress value={85} className="h-1.5 bg-zinc-800 mb-6" indicatorClassName="bg-cyan-500" />

                                <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold">
                                    Trigger Manual Payout <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>

                            {/* Recent Transfers List Mock */}
                            <div className="mt-6 space-y-4">
                                <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold border-b border-zinc-800 pb-2">Recent Transfers</div>
                                <div className="flex justify-between items-center text-sm">
                                    <div>
                                        <div className="text-white font-bold">Oct 17, 2023</div>
                                        <div className="text-[10px] text-zinc-500">Direct Deposit</div>
                                    </div>
                                    <div className="font-mono text-white">$8,942.00</div>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <div>
                                        <div className="text-white font-bold">Oct 10, 2023</div>
                                        <div className="text-[10px] text-zinc-500">Direct Deposit</div>
                                    </div>
                                    <div className="font-mono text-white">$10,120.00</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Global Impact Card */}
                    <Card className="bg-[#121217] border-zinc-800 h-[300px] flex flex-col justify-between overflow-hidden relative">
                        {/* Background Graphic */}
                        <div className="absolute inset-0 opacity-20 bg-gradient-to-tr from-[#09090b] to-transparent pointer-events-none" />

                        <CardContent className="p-8 relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">Global Impact</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    Your storefront's sales performance is currently outperforming <span className="text-white font-bold">82%</span> of marketplace vendors in the <span className="text-cyan-400 font-bold">Home & Decor</span> category.
                                </p>
                            </div>

                            <div className="flex justify-between items-end mt-4">
                                <div>
                                    <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Peer Rank</div>
                                    <div className="text-2xl font-mono text-white">#42 / 1,200</div>
                                </div>
                                <div>
                                    <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Growth Index</div>
                                    <div className="text-2xl font-bold text-cyan-500">A+</div>
                                </div>
                            </div>
                        </CardContent>

                        {/* Simple Bar Chart Decoration at bottom right */}
                        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 flex items-end gap-1 px-4 pb-0 opacity-50">
                            <div className="w-full bg-cyan-900/30 h-[40%] rounded-t" />
                            <div className="w-full bg-cyan-900/40 h-[60%] rounded-t" />
                            <div className="w-full bg-cyan-900/50 h-[30%] rounded-t" />
                            <div className="w-full bg-cyan-800/60 h-[70%] rounded-t" />
                            <div className="w-full bg-cyan-700/70 h-[90%] rounded-t" />
                            <div className="w-full bg-cyan-600/80 h-[55%] rounded-t" />
                            <div className="w-full bg-cyan-500 h-[80%] rounded-t" />
                        </div>
                    </Card>

                </div>

                {/* RIGHT COLUMN (2/3): Product Performance */}
                <div className="col-span-1 lg:col-span-2">
                    <Card className="bg-[#121217] border-zinc-800 h-full">
                        <CardHeader className="flex flex-row items-center justify-between pb-6">
                            <CardTitle className="text-lg font-bold text-white">Product Performance</CardTitle>
                            <Button variant="ghost" className="text-cyan-500 hover:text-cyan-400 hover:bg-cyan-500/10 text-xs font-bold">View All Inventory</Button>
                        </CardHeader>
                        <CardContent className="px-0">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-4 px-6 pb-4 border-b border-zinc-800 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                <div className="col-span-5">Product</div>
                                <div className="col-span-3">Inventory</div>
                                <div className="col-span-2">Velocity</div>
                                <div className="col-span-2 text-right">Action</div>
                            </div>

                            {/* Table Body */}
                            <div className="divide-y divide-zinc-800">
                                {inventoryData.map((item, i) => (
                                    <div key={i} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/5 transition-colors group">

                                        {/* Product Info */}
                                        <div className="col-span-5 flex items-center gap-4">
                                            <img src={item.image} className="h-12 w-12 rounded bg-zinc-800 object-cover" />
                                            <div>
                                                <div className="text-sm font-bold text-white">{item.name}</div>
                                                <div className="text-[10px] text-zinc-500 font-mono">SKU: {item.sku}</div>
                                            </div>
                                        </div>

                                        {/* Inventory Bar */}
                                        <div className="col-span-3 pr-8">
                                            <div className="flex justify-between text-[10px] mb-1">
                                                <span className="text-zinc-400">{item.itemsLeft} items left</span>
                                                <span className={`font-bold ${item.status === 'Critically Low' ? 'text-red-500' :
                                                        item.status === 'Warning' ? 'text-orange-500' :
                                                            item.status === 'Healthy' ? 'text-green-500' : 'text-zinc-500'
                                                    }`}>{item.status}</span>
                                            </div>
                                            <Progress
                                                value={item.itemsLeft < 10 ? 10 : item.itemsLeft < 50 ? 40 : 80}
                                                className="h-1.5 bg-zinc-800"
                                                indicatorClassName={`
                                                    ${item.status === 'Critically Low' ? 'bg-red-500' :
                                                        item.status === 'Warning' ? 'bg-orange-500' : 'bg-green-500'}
                                                `}
                                            />
                                        </div>

                                        {/* Velocity */}
                                        <div className="col-span-2 flex items-center gap-2">
                                            <span className="text-sm font-bold text-white">{item.velocity}</span>
                                            {item.trend === 'up' && <ArrowUpRight className="h-3 w-3 text-green-500" />}
                                            {item.trend === 'down' && <ArrowUpRight className="h-3 w-3 text-red-500 rotate-90" />}
                                            {item.trend === 'stable' && <ArrowRight className="h-3 w-3 text-zinc-500" />}
                                        </div>

                                        {/* Actions */}
                                        <div className="col-span-2 flex justify-end">
                                            {item.action ? (
                                                <Button size="sm" variant="outline" className="border-cyan-900/50 bg-cyan-950/20 text-cyan-500 hover:bg-cyan-900/40 hover:text-cyan-400 text-xs font-bold shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                                                    {item.action}
                                                </Button>
                                            ) : (
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-500">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 px-6 text-center">
                                <Button variant="ghost" className="text-xs text-zinc-500 hover:text-white">Show More Products</Button>
                            </div>

                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
