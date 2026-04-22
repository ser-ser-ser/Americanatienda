'use client'

import React, { useState } from 'react'
import {
    Activity,
    CreditCard,
    Users,
    ChevronRight,
    Search,
    Download,
    Plus,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    Wallet,
    Sparkles,
    MousePointer2,
    Calendar,
    Filter,
    MoreHorizontal,
    ExternalLink,
    Zap,
    Rocket
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import Image from 'next/image'

const STATS = [
    {
        label: 'Ad Spend (Month)',
        value: '$12,450.00',
        change: '+12.4%',
        trend: 'up',
        icon: <Wallet className="h-4 w-4" />,
        color: 'from-blue-500/20 to-transparent',
        accent: 'text-blue-500'
    },
    {
        label: 'Reach',
        value: '842.5K',
        change: '+5.2%',
        trend: 'up',
        icon: <Users className="h-4 w-4" />,
        color: 'from-cyan-500/20 to-transparent',
        accent: 'text-cyan-500'
    },
    {
        label: 'Return on Spend (ROAS)',
        value: '4.8x',
        change: '-2.1%',
        trend: 'down',
        icon: <Rocket className="h-4 w-4" />,
        color: 'from-purple-500/20 to-transparent',
        accent: 'text-purple-500',
        tag: 'Optimal: 3.5x+'
    }
]

const CAMPAIGNS = [
    {
        id: 'AD-7729-XR',
        name: 'Midnight Runway \'24',
        status: 'ACTIVE',
        audience: 'Gen Z | Urban High-Fashion',
        location: 'NYC, London, Tokyo',
        budget: '$4,200.00',
        daily: '$150',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&h=200&auto=format&fit=crop'
    },
    {
        id: 'AD-1044-ML',
        name: 'Minimalist Aesthetic',
        status: 'PAUSED',
        audience: 'Millennial | Luxury Minimalist',
        location: 'EU, North America',
        budget: '$1,850.00',
        daily: '$0',
        image: 'https://images.unsplash.com/photo-1539109132382-381bb3f1c2b3?q=80&w=200&h=200&auto=format&fit=crop'
    },
    {
        id: 'AD-8912-CC',
        name: 'Cyber Chic Noir',
        status: 'REVIEW',
        audience: 'Global | Avant-Garde',
        location: 'Worldwide Tech Hubs',
        budget: '$900.00',
        daily: 'Pending Appr.',
        image: 'https://images.unsplash.com/photo-1583743814966-893bee5f5505?q=80&w=200&h=200&auto=format&fit=crop'
    }
]

export default function AdsManagerPage() {
    return (
        <div className="min-h-screen bg-[#09090b] text-white p-6 md:p-10 font-sans pb-32">
            <div className="max-w-7xl mx-auto">

                {/* Header Breadcrumb */}
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                    <Sparkles className="h-3 w-3 text-blue-500" />
                    <span>Marketing Hub</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-blue-500 font-bold">Ads Manager</span>
                </div>

                {/* Main Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                            <Zap className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-3xl font-serif font-bold text-white tracking-tight">Ads Management Studio</h1>
                                <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[8px] uppercase tracking-tighter h-4">BETA</Badge>
                            </div>
                            <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mt-1">Noir Avant-Garde Studio <span className="text-zinc-800 mx-2">|</span> <span className="text-zinc-600">Precision Precision social presence management</span></p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="bg-transparent border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 font-bold h-10 px-6 uppercase text-[10px] tracking-widest gap-2">
                            <Download className="h-4 w-4" /> Export Report
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-6 shadow-lg shadow-blue-600/20 rounded-lg uppercase text-[10px] tracking-widest gap-2">
                            <Plus className="h-4 w-4" /> Create Campaign
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Main Content Area */}
                    <div className="lg:col-span-9 space-y-8">

                        {/* Stats Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {STATS.map((stat) => (
                                <Card key={stat.label} className="bg-[#121217] border-white/5 overflow-hidden group hover:border-blue-500/30 transition-all">
                                    <CardContent className="p-6 relative">
                                        <div className={cn("absolute top-0 right-0 w-24 h-24 blur-3xl rounded-full opacity-20 bg-linear-to-br", stat.color)} />

                                        <div className="flex justify-between items-start mb-4">
                                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                                            <div className={cn("h-8 w-8 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center transition-colors", stat.accent)}>
                                                {stat.icon}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <h3 className="text-2xl font-mono font-black text-white">{stat.value}</h3>
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    "text-[10px] font-bold flex items-center gap-0.5",
                                                    stat.trend === 'up' ? "text-green-500" : "text-red-500"
                                                )}>
                                                    {stat.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                                    {stat.change}
                                                </span>
                                                {stat.tag && <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter">{stat.tag}</span>}
                                            </div>
                                        </div>

                                        {/* Miniature Visualizer simulation */}
                                        <div className="mt-6 h-8 flex items-end gap-1.5 overflow-hidden">
                                            {[...Array(15)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={cn(
                                                        "w-full rounded-t-[1px] transition-all duration-700",
                                                        stat.accent.replace('text-', 'bg-'),
                                                        "opacity-20 group-hover:opacity-40"
                                                    )}
                                                    style={{
                                                        height: `${20 + Math.random() * 80}%`,
                                                        transitionDelay: `${i * 30}ms`
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Active Campaigns Table */}
                        <Card className="bg-[#121217] border-white/5 overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-4">
                                <CardTitle className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Active Campaigns</CardTitle>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-zinc-600 font-bold uppercase">Sort by:</span>
                                    <Button variant="ghost" size="sm" className="h-7 text-[10px] text-zinc-400 uppercase font-bold gap-1 px-2">
                                        Latest <Filter className="h-3 w-3" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/5 bg-zinc-900/40">
                                                <th className="p-4 text-[9px] font-black text-zinc-600 uppercase tracking-widest">Creative</th>
                                                <th className="p-4 text-[9px] font-black text-zinc-600 uppercase tracking-widest">Campaign Name</th>
                                                <th className="p-4 text-[9px] font-black text-zinc-600 uppercase tracking-widest">Americana Status</th>
                                                <th className="p-4 text-[9px] font-black text-zinc-600 uppercase tracking-widest">Audience Summary</th>
                                                <th className="p-4 text-[9px] font-black text-zinc-600 uppercase tracking-widest text-center">Budget</th>
                                                <th className="p-4 text-[9px] font-black text-zinc-600 uppercase tracking-widest text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {CAMPAIGNS.map((campaign) => (
                                                <tr key={campaign.id} className="group hover:bg-white/2 transition-colors">
                                                    <td className="p-4">
                                                        <div className="h-12 w-10 rounded bg-zinc-800 border border-white/10 overflow-hidden relative group-hover:scale-110 transition-transform">
                                                            <img src={campaign.image} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                                            <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{campaign.name}</span>
                                                            <span className="text-[9px] text-zinc-500 font-mono mt-0.5">ID: {campaign.id}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <Badge className={cn(
                                                            "text-[8px] font-black px-2 py-0.5 rounded-full border shadow-sm",
                                                            campaign.status === 'ACTIVE' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                                                                campaign.status === 'PAUSED' ? "bg-zinc-800 text-zinc-500 border-white/5" :
                                                                    "bg-pink-500/10 text-pink-500 border-pink-500/20"
                                                        )}>
                                                            <div className={cn(
                                                                "h-1 w-1 rounded-full mr-1.5",
                                                                campaign.status === 'ACTIVE' ? "bg-blue-500 animate-pulse" :
                                                                    campaign.status === 'PAUSED' ? "bg-zinc-500" :
                                                                        "bg-pink-500"
                                                            )} />
                                                            {campaign.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-bold text-white uppercase tracking-tight">{campaign.audience}</span>
                                                            <span className="text-[9px] text-zinc-500 italic mt-0.5">{campaign.location}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-black text-white">{campaign.budget}</span>
                                                            <span className="text-[8px] text-zinc-500 uppercase mt-0.5 tracking-tight flex items-center justify-center gap-1">
                                                                Daily: <span className="text-zinc-400 font-bold">{campaign.daily}</span>
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <Button variant="outline" size="sm" className="h-8 border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 text-[9px] font-bold uppercase tracking-widest px-4">
                                                            View Details
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Sidebar Area */}
                    <div className="lg:col-span-3 space-y-6">

                        {/* Quick Actions */}
                        <Card className="bg-[#121217] border-white/5 overflow-hidden">
                            <CardHeader className="pb-4 border-b border-white/5">
                                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                                    <Zap className="h-3 w-3 text-blue-500" /> Quick Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-3">
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl uppercase text-[10px] tracking-widest flex items-center justify-between px-6 shadow-lg shadow-blue-600/10 group">
                                    Create New Ad <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                                <Button variant="outline" className="w-full bg-transparent border-white/5 text-zinc-400 hover:text-white hover:bg-white/5 font-bold h-12 rounded-xl uppercase text-[10px] tracking-widest flex items-center justify-between px-6 group">
                                    <div className="flex items-center gap-3">
                                        <Users className="h-4 w-4 text-blue-500" /> Audience Builder
                                    </div>
                                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Button>
                                <Button variant="outline" className="w-full bg-transparent border-white/5 text-zinc-400 hover:text-white hover:bg-white/5 font-bold h-12 rounded-xl uppercase text-[10px] tracking-widest flex items-center justify-between px-6 group">
                                    <div className="flex items-center gap-3">
                                        <Sparkles className="h-4 w-4 text-purple-500" /> AI Creative Studio
                                    </div>
                                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Ad Wallet */}
                        <Card className="bg-[#121217] border-white/5 overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4">
                                <Wallet className="h-4 w-4 text-zinc-700" />
                            </div>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Ad Wallet</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 pt-0 space-y-6">
                                <div className="space-y-1">
                                    <p className="text-[9px] text-zinc-600 uppercase font-black tracking-widest">Current Balance</p>
                                    <h3 className="text-3xl font-mono font-black text-white tracking-widest">$2,410.50</h3>
                                </div>

                                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                                            <Zap className="h-4 w-4 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] font-bold text-white uppercase tracking-tight">Stripe Connect</p>
                                            <p className="text-[8px] text-zinc-500 font-mono">•••• 4242</p>
                                        </div>
                                        <span className="text-[8px] text-zinc-600 font-bold uppercase">Exp: 12/26</span>
                                    </div>
                                    <Button className="w-full bg-white text-black hover:bg-zinc-200 font-black h-10 rounded-lg uppercase text-[9px] tracking-widest gap-2">
                                        <CreditCard className="h-3 w-3" /> Top Up via Stripe
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Assistance Card */}
                        <div className="bg-blue-600/5 border border-blue-500/10 rounded-2xl p-6 relative overflow-hidden group">
                            <div className="flex items-start gap-3 relative z-10">
                                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                                    <Activity className="h-4 w-4 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold text-white uppercase tracking-wider leading-tight">Need Ad Assistance?</p>
                                    <p className="text-[9px] text-zinc-500 leading-relaxed">Connect with an Americana Marketing Specialist to optimize your ROAS.</p>
                                    <button className="text-[9px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest flex items-center gap-1 transition-colors">
                                        Book a 15m session <ExternalLink className="h-3 w-3" />
                                    </button>
                                </div>
                            </div>
                            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
