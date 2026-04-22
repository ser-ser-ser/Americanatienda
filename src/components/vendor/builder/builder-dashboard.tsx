'use client'

import React from 'react'
import { ExternalLink, Eye, Layout, Monitor, Smartphone, Tablet, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

interface BuilderDashboardProps {
    storeName: string
    storeSlug: string
}

export default function BuilderDashboard({ storeName, storeSlug }: BuilderDashboardProps) {
    const builderUrl = `https://builder.io/content?model=page&view=list` // General list view, or specific if we have the link

    return (
        <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/5">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-8 w-8 bg-[#ff007f]/10 rounded-lg flex items-center justify-center border border-[#ff007f]/20">
                                <Zap className="h-4 w-4 text-[#ff007f]" />
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight uppercase tracking-tighter">Site Studio</h1>
                        </div>
                        <p className="text-zinc-500 font-medium">Visual Design & Content Management via <span className="text-white">Builder.io</span></p>
                    </div>

                    <Button asChild className="bg-[#ff007f] hover:bg-[#d6006b] text-white font-bold h-12 px-8 rounded-full shadow-[0_0_20px_rgba(255,0,127,0.3)]">
                        <a href={builderUrl} target="_blank" rel="noopener noreferrer">
                            Launch Visual Editor <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                    </Button>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Status Card */}
                    <Card className="md:col-span-2 bg-zinc-900/50 border-white/5 overflow-hidden group">
                        <CardContent className="p-8">
                            <div className="flex items-start justify-between mb-8">
                                <div>
                                    <h3 className="text-lg font-bold mb-1">Preview Live Store</h3>
                                    <p className="text-zinc-500 text-xs uppercase tracking-widest font-black">Current Production Design</p>
                                </div>
                                <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-bold border border-emerald-500/20">
                                    <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                    SYNCED
                                </div>
                            </div>

                            <div className="aspect-video w-full bg-black rounded-2xl border border-white/10 overflow-hidden relative group-hover:border-[#ff007f]/30 transition-colors">
                                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 backdrop-blur-sm">
                                    <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white hover:text-black">
                                        <Link href={`/shops/${storeSlug}`} target="_blank">
                                            <Eye className="mr-2 h-4 w-4" /> Open Live Preview
                                        </Link>
                                    </Button>
                                </div>

                                {/* Mock Browser UI */}
                                <div className="absolute top-0 left-0 right-0 h-8 bg-zinc-800 border-b border-white/5 flex items-center px-4 gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="h-2 w-2 rounded-full bg-zinc-700" />
                                        <div className="h-2 w-2 rounded-full bg-zinc-700" />
                                        <div className="h-2 w-2 rounded-full bg-zinc-700" />
                                    </div>
                                    <div className="mx-auto bg-black/40 rounded px-10 py-1 text-[8px] text-zinc-600 font-mono italic">
                                        americanatienda.com/shops/{storeSlug}
                                    </div>
                                </div>

                                <div className="pt-8 h-full flex items-center justify-center">
                                    <Layout className="h-12 w-12 text-zinc-800" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Stats / Info */}
                    <div className="space-y-6">
                        <Card className="bg-zinc-900/40 border-white/5">
                            <CardContent className="p-6">
                                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Responsive Controls</h4>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5">
                                        <Monitor className="h-4 w-4 text-zinc-400" />
                                        <span className="text-[8px] font-bold">Desktop</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5">
                                        <Tablet className="h-4 w-4 text-zinc-400" />
                                        <span className="text-[8px] font-bold">Tablet</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[#ff007f]/10 border border-[#ff007f]/20">
                                        <Smartphone className="h-4 w-4 text-[#ff007f]" />
                                        <span className="text-[8px] font-bold text-[#ff007f]">Mobile</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-zinc-900/40 border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 bg-[#ff007f]/5 blur-2xl rounded-full" />
                            <CardContent className="p-6 relative z-10">
                                <div className="p-2 bg-cyan-500/10 rounded-lg w-fit mb-4 border border-cyan-500/20">
                                    <Zap className="h-4 w-4 text-cyan-500" />
                                </div>
                                <h3 className="font-bold text-white mb-2 italic">How it works</h3>
                                <p className="text-zinc-500 text-xs leading-relaxed">
                                    Americana uses <strong className="text-white">Builder.io</strong> as a visual engine. Your specialized theme components are already registered there. Just drag and drop to build your rebel storefront.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Integration Help */}
                <div className="pt-12">
                    <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-6 text-center">Connected Ecosystem</h3>
                    <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                        <div className="text-xl font-black italic tracking-tighter">NEXT.JS</div>
                        <div className="text-xl font-black italic tracking-tighter">SUPABASE</div>
                        <div className="text-xl font-black italic tracking-tighter">BUILDER.IO</div>
                        <div className="text-xl font-black italic tracking-tighter">STRIPE</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
