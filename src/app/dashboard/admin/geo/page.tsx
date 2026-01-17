'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Map, Zap, Truck, Target, Layers, Plus } from 'lucide-react'

export default function GeoIntelligencePage() {
    const [activeLayer, setActiveLayer] = useState<'demand' | 'logistics'>('demand')

    return (
        <div className="min-h-screen bg-[#050505] p-6 text-white font-sans relative overflow-hidden">

            {/* Background Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: 'linear-gradient(#222 1px, transparent 1px), linear-gradient(90deg, #222 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Header Overlay */}
            <div className="relative z-10 flex justify-between items-start mb-6 pointer-events-none">
                <div className="pointer-events-auto">
                    <div className="flex items-center gap-2 mb-2">
                        <Map className="h-5 w-5 text-[#ff007f]" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Global Intelligence Unit</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter mb-1">GEO<span className="text-[#ff007f]">INTEL</span></h1>
                    <p className="text-zinc-400 text-sm max-w-md">
                        Real-time visualization of market demand vs. logistics coverage.
                        Use this to identify expansion zones.
                    </p>
                </div>

                <div className="flex gap-2 pointer-events-auto">
                    <Button
                        variant="outline"
                        onClick={() => setActiveLayer('demand')}
                        className={`border-zinc-800 ${activeLayer === 'demand' ? 'bg-[#ff007f]/10 text-[#ff007f] border-[#ff007f]' : 'bg-black text-zinc-500'}`}
                    >
                        <Zap className="mr-2 h-4 w-4" /> Market Heatmap
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setActiveLayer('logistics')}
                        className={`border-zinc-800 ${activeLayer === 'logistics' ? 'bg-cyan-900/10 text-cyan-500 border-cyan-500' : 'bg-black text-zinc-500'}`}
                    >
                        <Truck className="mr-2 h-4 w-4" /> Logistics Net
                    </Button>
                </div>
            </div>

            {/* MAIN MAP AREA (Simulated) */}
            <div className="relative w-full h-[600px] bg-[#0a0a0a] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl group">

                {/* Map Base (SVG) */}
                <svg className="w-full h-full object-cover opacity-30" viewBox="0 0 1000 600">
                    <path d="M150,100 Q250,50 400,120 T700,150 T900,100" stroke="#333" strokeWidth="2" fill="none" opacity="0.5" />
                    <path d="M100,200 Q300,250 500,200 T900,300" stroke="#333" strokeWidth="2" fill="none" opacity="0.5" />
                    {/* Abstract shapes representing regions */}
                    <circle cx="450" cy="300" r="150" fill="#111" stroke="#222" />
                </svg>

                {/* Layer: DEMAND (Pink) */}
                {activeLayer === 'demand' && (
                    <div className="absolute inset-0 animate-in fade-in duration-700">
                        {/* CDMX - High Intensity */}
                        <div className="absolute top-[45%] left-[42%]">
                            <div className="relative w-24 h-24 flex items-center justify-center">
                                <div className="absolute inset-0 bg-[#ff007f] rounded-full blur-[40px] opacity-40 animate-pulse" />
                                <div className="w-4 h-4 bg-[#ff007f] rounded-full shadow-[0_0_20px_#ff007f] z-10" />
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black border border-[#ff007f] px-2 py-1 rounded text-[10px] font-bold text-[#ff007f] whitespace-nowrap">
                                    CDMX (HQ) - 68% Vol
                                </div>
                            </div>
                        </div>

                        {/* Guadalajara - Rising */}
                        <div className="absolute top-[38%] left-[30%]">
                            <div className="relative w-16 h-16 flex items-center justify-center">
                                <div className="absolute inset-0 bg-[#ff007f] rounded-full blur-[30px] opacity-20" />
                                <div className="w-3 h-3 bg-[#ff007f]/80 rounded-full shadow-[0_0_15px_#ff007f] z-10" />
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 border border-zinc-800 px-2 py-1 rounded text-[10px] font-bold text-zinc-300">
                                    GDL +15%
                                </div>
                            </div>
                        </div>

                        {/* Monterrey - Opportunity */}
                        <div className="absolute top-[30%] left-[45%] group/mty cursor-pointer">
                            <div className="relative w-16 h-16 flex items-center justify-center">
                                <div className="absolute inset-0 bg-white rounded-full blur-[30px] opacity-10 group-hover/mty:opacity-30 transition-opacity" />
                                <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_15px_white] z-10 animate-bounce" />
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover/mty:opacity-100 transition-opacity">
                                    Underserved Market
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Layer: LOGISTICS (Cyan) */}
                {activeLayer === 'logistics' && (
                    <div className="absolute inset-0 animate-in fade-in duration-700">
                        {/* Connecting Lines */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <path d="M420,270 L300,220" stroke="#06b6d4" strokeWidth="1" strokeDasharray="5,5" className="animate-pulse opacity-50" />
                            <path d="M420,270 L450,180" stroke="#06b6d4" strokeWidth="1" strokeDasharray="5,5" className="animate-pulse opacity-50" />
                        </svg>

                        {/* Hub CDMX */}
                        <div className="absolute top-[45%] left-[42%]">
                            <div className="w-6 h-6 border-2 border-cyan-500 bg-black flex items-center justify-center shadow-[0_0_20px_cyan]">
                                <Truck className="w-3 h-3 text-cyan-500" />
                            </div>
                            <div className="absolute top-8 left-1/2 -translate-x-1/2 text-[9px] font-mono text-cyan-500 bg-black/80 px-1">Pri. Warehouse</div>
                        </div>

                        {/* 3PL Partner GDL */}
                        <div className="absolute top-[38%] left-[30%]">
                            <div className="w-4 h-4 border border-cyan-800 bg-black flex items-center justify-center">
                                <div className="w-1.5 h-1.5 bg-cyan-800 rounded-full" />
                            </div>
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 text-[9px] font-mono text-zinc-500 bg-black/80 px-1">99min Partner</div>
                        </div>
                    </div>
                )}


                {/* Overlay Controls */}
                <div className="absolute bottom-6 left-6 space-y-2">
                    <Card className="bg-black/80 backdrop-blur border-zinc-800 p-4 w-60">
                        <h4 className="text-[10px] font-bold text-zinc-400 uppercase mb-2">Expansion Radar</h4>
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-white">Monterrey, NL</span>
                            <Badge className="bg-green-900 text-green-400 border-0 text-[9px]">High Potential</Badge>
                        </div>
                        <p className="text-[10px] text-zinc-500 leading-tight">
                            Search volume up 400% in "Streetwear" category. 0 local vendors detected.
                        </p>
                        <Button size="sm" className="w-full mt-3 h-7 text-[10px] bg-white text-black hover:bg-zinc-200">
                            <Plus className="w-3 h-3 mr-1" /> Create Logistics Zone
                        </Button>
                    </Card>
                </div>
            </div>

            {/* Quick Stat Bar */}
            <div className="grid grid-cols-4 gap-4 mt-6">
                {['Total Coverage: 85%', 'Avg Delivery: 1.2 Days', 'Pending Routes: 4', 'Active Fleets: 12'].map((stat, i) => (
                    <div key={i} className="bg-[#0a0a0a] border border-white/5 p-3 rounded-lg flex items-center justify-center text-xs font-mono text-zinc-500">
                        {stat}
                    </div>
                ))}
            </div>
        </div>
    )
}
