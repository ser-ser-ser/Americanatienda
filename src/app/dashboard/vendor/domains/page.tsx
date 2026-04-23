'use client'

import React from 'react'
import { Plus, Globe, Settings2, Link2, ExternalLink, ShieldCheck, HelpCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import DomainSearch from '@/components/vendor/domains/domain-search'
import { Badge } from '@/components/ui/badge'

export default function VendorDomainsPage() {
    return (
        <div className="p-8 bg-[#0a0a0a] min-h-screen text-white font-sans max-w-6xl mx-auto">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-[#ff007f] text-white hover:bg-[#ff007f] border-0 text-[10px] px-1.5 h-5 rounded-sm uppercase font-black">Americana Edge</Badge>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">v4.0.0 Stable</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic">
                        Domain <span className="text-[#ff007f]">Ecosystem</span>
                    </h1>
                    <p className="text-zinc-500 text-sm font-medium mt-1">Manage your custom storefront domains and edge connectivity.</p>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" className="border-white/10 text-zinc-400 hover:text-white uppercase text-[10px] font-black tracking-widest bg-white/5">
                        <Link2 className="mr-2 h-3.5 w-3.5" /> Connect Existing
                    </Button>
                    <Button className="bg-[#ff007f] hover:bg-[#ff007f]/80 text-white font-black uppercase text-[10px] tracking-widest px-6 h-10">
                        <Plus className="mr-2 h-4 w-4" /> Register New
                    </Button>
                </div>
            </div>

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* Search and Discovery (Left 2/3) */}
                <div className="lg:col-span-2 space-y-10">
                    <Card className="bg-[#0d0d0d] border-white/5 p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
                            <Globe className="w-32 h-32 text-white" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-xl font-black text-white uppercase italic mb-6">Discovery Terminal</h3>
                            <DomainSearch />
                        </div>
                    </Card>

                    {/* Active Domains (Table-like section) */}
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-sm font-black text-zinc-500 uppercase tracking-[0.2em] border-l-2 border-[#ff007f] pl-4">Active Deployments</h3>
                            <Badge variant="outline" className="border-white/10 text-zinc-600">Total: 1</Badge>
                        </div>
                        <Card className="bg-[#0d0d0d] border-white/5 overflow-hidden">
                            <div className="p-6 flex items-center justify-between border-b border-white/5 bg-linear-to-r from-[#ff007f]/5 to-transparent">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center">
                                        <Globe className="h-6 w-6 text-green-500" />
                                    </div>
                                    <div>
                                        <div className="text-white font-bold text-lg flex items-center gap-2">
                                            mi-tienda.americana.shop
                                            <Badge className="bg-green-500/20 text-green-500 border-0 text-[8px] px-1 rounded-sm">PRIMARY</Badge>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Deploy Stage:</span>
                                            <span className="text-[10px] text-zinc-400 font-medium">Production (Vercel Edge)</span>
                                            <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5">
                                        <Settings2 className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-zinc-500 hover:text-[#ff007f] hover:bg-[#ff007f]/5">
                                        <ExternalLink className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="p-6 bg-black/40 flex items-center justify-between text-[11px] font-medium text-zinc-500">
                                <div className="flex items-center gap-6">
                                    <span className="flex items-center gap-2"><ShieldCheck className="h-3 w-3 text-zinc-700" /> SSL: Standard (Americana)</span>
                                    <span className="flex items-center gap-2"><Globe className="h-3 w-3 text-zinc-700" /> DNS: Proxied</span>
                                </div>
                                <span>Updated 12h ago</span>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Sidebar / Info Panel (Right 1/3) */}
                <div className="space-y-6">
                    <Card className="bg-black border-white/5 p-6 border-l-4 border-l-[#ff007f]/40 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                            <HelpCircle className="w-5 h-5 text-zinc-800" />
                        </div>
                        <h4 className="text-xs font-black text-white uppercase tracking-widest mb-4">Edge Optimization</h4>
                        <p className="text-[11px] text-zinc-500 leading-relaxed font-medium mb-6">
                            All domains connected to Americana Marketplace OS are automatically optimized for
                            <span className="text-white"> Layer 7 Performance</span>, including Global CDN caching and Brotli compression.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#ff007f]" />
                                Zero-config SSL termination
                            </li>
                            <li className="flex items-center gap-3 text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#ff007f]" />
                                DDoS Protection (L3-L7)
                            </li>
                            <li className="flex items-center gap-3 text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#ff007f]" />
                                Image Optimization Pipeline
                            </li>
                        </ul>
                    </Card>

                    <Card className="bg-zinc-900/40 border-white/5 p-6">
                        <h4 className="text-xs font-black text-white uppercase tracking-widest mb-4">Configuration Guides</h4>
                        <div className="space-y-4">
                            <a href="#" className="flex justify-between items-center group">
                                <span className="text-[11px] font-bold text-zinc-500 group-hover:text-white transition-colors uppercase">GODADDY DNS SETUP</span>
                                <ExternalLink className="h-3 w-3 text-zinc-700 group-hover:text-[#ff007f] transition-all" />
                            </a>
                            <a href="#" className="flex justify-between items-center group">
                                <span className="text-[11px] font-bold text-zinc-500 group-hover:text-white transition-colors uppercase">NAMECHEAP CNAME GUIDE</span>
                                <ExternalLink className="h-3 w-3 text-zinc-700 group-hover:text-[#ff007f] transition-all" />
                            </a>
                            <a href="#" className="flex justify-between items-center group">
                                <span className="text-[11px] font-bold text-zinc-500 group-hover:text-white transition-colors uppercase">CLOUDFLARE PROXYING</span>
                                <ExternalLink className="h-3 w-3 text-zinc-700 group-hover:text-[#ff007f] transition-all" />
                            </a>
                        </div>
                    </Card>
                </div>

            </div>
        </div>
    )
}
