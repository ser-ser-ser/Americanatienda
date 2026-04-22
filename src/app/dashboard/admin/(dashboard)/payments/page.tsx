'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
    Search,
    Download,
    Filter,
    ArrowUpRight,
    CreditCard,
    DollarSign,
    Users,
    Calendar,
    MoreHorizontal,
    CheckCircle2,
    Clock,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    ExternalLink
} from 'lucide-react'

export default function GlobalPayoutsPage() {
    // Mock Data for UI Matching
    const transactions = [
        {
            date: 'Oct 24, 2023',
            vendor: 'Velvet Zen Shop',
            vendorInitials: 'VZ',
            vendorColor: 'bg-pink-600',
            saleAmount: '$1,250.00',
            commissionRate: '12%',
            commissionEarned: '$150.00',
            status: 'success'
        },
        {
            date: 'Oct 23, 2023',
            vendor: 'High Gardens CBD',
            vendorInitials: 'HG',
            vendorColor: 'bg-blue-600',
            saleAmount: '$840.00',
            commissionRate: '10%',
            commissionEarned: '$84.00',
            status: 'pending'
        },
        {
            date: 'Oct 23, 2023',
            vendor: 'Neon Electronics',
            vendorInitials: 'NE',
            vendorColor: 'bg-purple-600',
            saleAmount: '$3,450.00',
            commissionRate: '15%',
            commissionEarned: '$517.50',
            status: 'payout'
        },
        {
            date: 'Oct 22, 2023',
            vendor: 'Pulse Apparel',
            vendorInitials: 'PA',
            vendorColor: 'bg-orange-600',
            saleAmount: '$210.00',
            commissionRate: '12%',
            commissionEarned: '$25.20',
            status: 'success'
        },
        {
            date: 'Oct 21, 2023',
            vendor: 'Midnight Tech',
            vendorInitials: 'MT',
            vendorColor: 'bg-zinc-700',
            saleAmount: '$1,890.00',
            commissionRate: '15%',
            commissionEarned: '$283.50',
            status: 'success'
        }
    ]

    return (
        <div className="min-h-screen bg-[#110C1D] text-white font-sans p-8 relative overflow-hidden">
            {/* Ambient Background - Dark Purple Tone */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#ff007f]/10 rounded-full blur-[150px] pointer-events-none" />

            {/* HEADER */}
            <div className="flex justify-between items-end mb-10 relative z-10">
                <div>
                    <h1 className="text-4xl font-bold font-serif tracking-tight text-white mb-2">Global Payouts & Commission Reports</h1>
                    <p className="text-zinc-400">Manage vendor finances and track marketplace earnings in real-time.</p>
                </div>
                <Button className="bg-[#ff007f] hover:bg-[#ff007f]/90 text-white font-bold px-6 shadow-[0_0_20px_rgba(255,0,127,0.3)]">
                    <ExternalLink className="mr-2 h-4 w-4" /> Go to Stripe Dashboard
                </Button>
            </div>

            {/* KPI GRID */}
            <div className="grid grid-cols-3 gap-6 mb-12 relative z-10">
                <MetricCard
                    label="TOTAL COMMISSIONS EARNED"
                    value="$128,450.00"
                    change="+12.5% vs last month"
                    icon={<ArrowUpRight className="h-5 w-5 text-pink-500" />}
                    borderColor="border-pink-500/20"
                />
                <MetricCard
                    label="PENDING PAYOUTS"
                    value="$12,320.50"
                    change="+4.2% processing now"
                    icon={<Clock className="h-5 w-5 text-purple-500" />}
                    borderColor="border-purple-500/20"
                />
                <MetricCard
                    label="ACTIVE VENDORS"
                    value="1,248"
                    change="+28 new this week"
                    icon={<CreditCard className="h-5 w-5 text-blue-500" />}
                    borderColor="border-blue-500/20"
                />
            </div>

            {/* FILTERS & TABLE CONTAINER */}
            <div className="bg-[#1A1625] border border-white/5 rounded-3xl overflow-hidden relative z-10 p-6">

                {/* Filters */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <h3 className="font-bold text-lg mr-4">Filter Reports</h3>

                        <div className="flex items-center gap-2">
                            <Button size="sm" className="bg-[#ff007f] hover:bg-[#ff007f]/90 text-white border-0 text-xs font-bold">
                                All Categories
                            </Button>
                            <Button size="sm" variant="outline" className="border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 text-xs">
                                Smoke Shop
                            </Button>
                            <Button size="sm" variant="outline" className="border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 text-xs">
                                CBD
                            </Button>
                            <Button size="sm" variant="outline" className="border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 text-xs">
                                Sex Shop
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="outline" className="border-white/10 text-zinc-300 hover:bg-white/5 text-xs">
                            <Calendar className="mr-2 h-4 w-4" /> Last 30 Days
                        </Button>
                        <Button variant="ghost" className="text-[#ff007f] text-xs font-bold hover:bg-[#ff007f]/10">
                            Clear Filters
                        </Button>
                    </div>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    <div className="col-span-2">Date</div>
                    <div className="col-span-3">Vendor Name</div>
                    <div className="col-span-2">Sale Amount</div>
                    <div className="col-span-2">Commission %</div>
                    <div className="col-span-2 text-[#ff007f]">Commission Earned</div>
                    <div className="col-span-1">Stripe Status</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-white/5">
                    {transactions.map((tx, idx) => (
                        <div key={idx} className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-white/[0.02] transition-colors group">

                            <div className="col-span-2 text-sm font-medium text-white">{tx.date}</div>

                            <div className="col-span-3 flex items-center gap-3">
                                <div className={`h-8 w-8 rounded flex items-center justify-center font-bold text-xs text-white ${tx.vendorColor}`}>
                                    {tx.vendorInitials}
                                </div>
                                <span className="font-bold text-sm text-white">{tx.vendor}</span>
                            </div>

                            <div className="col-span-2 font-mono text-sm text-zinc-300">{tx.saleAmount}</div>

                            <div className="col-span-2 font-mono text-sm text-zinc-400">{tx.commissionRate}</div>

                            <div className="col-span-2 font-mono text-sm font-bold text-[#ff007f]">{tx.commissionEarned}</div>

                            <div className="col-span-1 flex items-center justify-between">
                                <Badge variant="outline" className={`
                                    border-0 text-[10px] px-3 py-1 font-bold
                                    ${tx.status === 'success' ? 'bg-green-500/20 text-green-500' :
                                        tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                                            'bg-purple-500/20 text-purple-400'}
                                `}>
                                    {tx.status === 'payout' ? 'Payout' : tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                                </Badge>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-600 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer / Pagination */}
                <div className="p-6 border-t border-white/5 flex justify-between items-center">
                    <p className="text-zinc-500 text-xs">Showing <span className="text-white font-bold">1-10</span> of 1,248 results</p>

                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-white/10 text-zinc-400 hover:bg-white/5 text-xs">
                            Previous
                        </Button>
                        <Button size="sm" className="bg-[#ff007f] text-white text-xs px-4">1</Button>
                        <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white text-xs">2</Button>
                        <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white text-xs">3</Button>
                        <Button variant="outline" size="sm" className="border-white/10 text-zinc-400 hover:bg-white/5 text-xs">
                            Next
                        </Button>
                    </div>
                </div>

            </div>

            {/* System Health Footer */}
            <div className="mt-8 flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest pl-2">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                All Systems Operational
            </div>

        </div>
    )
}

function MetricCard({ label, value, change, icon, borderColor }: any) {
    return (
        <Card className={`bg-[#1A1625] border border-white/5 p-6 relative overflow-hidden group hover:border-pink-500/30 transition-all duration-500`}>
            <div className="flex justify-between items-start mb-4">
                <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{label}</div>
                <div className="p-1 rounded bg-white/5 text-zinc-400 group-hover:text-white transition-colors">
                    {icon}
                </div>
            </div>
            <div className="text-4xl font-bold text-white mb-2 tracking-tight">{value}</div>
            <div className="text-xs font-bold text-green-500 flex items-center gap-1">
                {change}
            </div>
        </Card>
    )
}
