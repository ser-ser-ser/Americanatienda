"use client"

import React from 'react'
import {
    Eye,
    Droplets,
    Wind,
    Waves,
    Play,
    Settings,
    RotateCcw,
    Check,
    MousePointer2,
    Move,
    Activity,
    Layers,
    ArrowUpRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function MotionPanel() {
    return (
        <aside className="w-96 bg-[#22101c] border-l border-white/10 flex flex-col h-full overflow-y-auto animate-in slide-in-from-right-4 duration-300">
            {/* Header */}
            <div className="p-6 border-b border-white/10">
                <h1 className="text-lg font-bold tracking-tight uppercase text-white font-display">Interaction Engine</h1>
                <p className="text-xs text-[#f425af]/60 font-mono mt-1">v1.0.4-BETA_BUILD</p>
            </div>

            {/* Animation Presets */}
            <div className="p-6 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 font-display">Entrance Presets</h3>
                <div className="grid grid-cols-2 gap-2">
                    <button className="flex flex-col items-center justify-center gap-2 p-4 rounded border border-white/5 bg-white/5 hover:border-[#f425af]/50 transition-colors group">
                        <Eye className="w-6 h-6 text-white/60 group-hover:text-white" />
                        <span className="text-[10px] font-bold tracking-widest uppercase text-white font-display">Reveal</span>
                    </button>
                    <button className="flex flex-col items-center justify-center gap-2 p-4 rounded border border-white/5 bg-white/5 hover:border-[#f425af]/50 transition-colors group">
                        <Droplets className="w-6 h-6 text-white/60 group-hover:text-white" />
                        <span className="text-[10px] font-bold tracking-widest uppercase text-white font-display">Fade</span>
                    </button>
                    <button className="flex flex-col items-center justify-center gap-2 p-4 rounded border-2 border-[#f425af] bg-[#f425af]/10">
                        <ArrowUpRight className="w-6 h-6 text-[#f425af]" />
                        <span className="text-[10px] font-bold tracking-widest uppercase text-[#f425af] font-display">Glide</span>
                    </button>
                    <button className="flex flex-col items-center justify-center gap-2 p-4 rounded border border-white/5 bg-white/5 hover:border-[#f425af]/50 transition-colors group">
                        <Waves className="w-6 h-6 text-white/60 group-hover:text-white" />
                        <span className="text-[10px] font-bold tracking-widest uppercase text-white font-display">Float</span>
                    </button>
                </div>
            </div>

            {/* Fine Tuning */}
            <div className="p-6 space-y-6 border-t border-white/10">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 font-display">Motion Config</h3>

                {/* Sliders */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-mono tracking-tighter text-white">
                            <span className="uppercase text-white/60">Duration</span>
                            <span className="text-[#f425af] font-bold">0.85s</span>
                        </div>
                        <input className="w-full h-1 bg-white/10 appearance-none rounded cursor-pointer accent-[#f425af]" max="200" min="0" type="range" defaultValue="85" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-mono tracking-tighter text-white">
                            <span className="uppercase text-white/60">Delay</span>
                            <span className="text-[#f425af] font-bold">0.20s</span>
                        </div>
                        <input className="w-full h-1 bg-white/10 appearance-none rounded cursor-pointer accent-[#f425af]" max="500" min="0" type="range" defaultValue="20" />
                    </div>
                </div>

                {/* Bezier Curve Visualizer */}
                <div className="space-y-3 pt-4">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/60 font-display">Cubic-Bezier</span>
                        <select className="bg-transparent border-none text-[10px] text-[#f425af] font-bold uppercase focus:ring-0 cursor-pointer outline-none">
                            <option>Ease-In-Out</option>
                            <option>Linear</option>
                            <option>Elastic</option>
                            <option>Custom</option>
                        </select>
                    </div>
                    <div
                        className="aspect-square w-full rounded-lg bg-[#34182b]/30 border border-white/10 relative overflow-hidden"
                        style={{
                            backgroundImage: 'linear-gradient(#34182b 1px, transparent 1px), linear-gradient(90deg, #34182b 1px, transparent 1px)',
                            backgroundSize: '20px 20px'
                        }}
                    >
                        <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 100 100">
                            <path d="M 0 100 C 20 100 20 0 100 0" fill="none" stroke="#f425af" strokeWidth="2"></path>
                            <circle cx="20" cy="80" fill="white" r="3"></circle>
                            <circle cx="80" cy="20" fill="white" r="3"></circle>
                        </svg>
                    </div>
                    <p className="text-[10px] font-mono text-white/40 text-center">cubic-bezier(0.42, 0, 0.58, 1)</p>
                </div>
            </div>

            {/* Trigger Logic */}
            <div className="p-6 space-y-4 border-t border-white/10">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 font-display">Event Trigger</h3>
                <div className="flex gap-1 p-1 bg-white/5 rounded">
                    <button className="flex-1 py-2 rounded text-[10px] font-bold uppercase tracking-widest bg-[#f425af] text-white shadow-lg">Scroll</button>
                    <button className="flex-1 py-2 rounded text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">Hover</button>
                    <button className="flex-1 py-2 rounded text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">Click</button>
                </div>
                <div className="flex items-center gap-3 px-3 py-3 border border-white/5 bg-white/5 rounded">
                    <Activity className="w-5 h-5 text-[#f425af]" />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Viewport Threshold</span>
                        <span className="text-[10px] text-white/40">Trigger at 20% visibility</span>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-auto p-6 grid grid-cols-2 gap-3 border-t border-white/10 bg-[#22101c]">
                <button className="border border-white/10 hover:bg-white/5 px-4 py-3 rounded text-[10px] font-bold uppercase tracking-widest transition-colors text-white">
                    RESET
                </button>
                <button className="bg-[#f425af] hover:bg-[#f425af]/90 px-4 py-3 rounded text-[10px] font-bold uppercase tracking-widest transition-colors text-white">
                    APPLY ALL
                </button>
            </div>
        </aside>
    )
}
