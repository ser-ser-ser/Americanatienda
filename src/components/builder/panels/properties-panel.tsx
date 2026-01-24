"use client"

import React from 'react'
import {
    Sliders,
    MoreVertical,
    Info,
    Pipette,
    ChevronUp,
    ChevronDown,
    Zap,
    Play,
    RotateCcw,
    Droplets,
    ZoomIn,
    Code,
    History,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Type,
    ChevronRight,
    Square,
    Smartphone,
    EyeOff,
    LayoutGrid as GridView,
    Rows,
    Smartphone as MobileIcon
} from 'lucide-react'
import { useBuilderStore } from '@/components/builder/store'
import { cn } from '@/lib/utils'

export function PropertiesPanel({ activePanel }: { activePanel: string }) {
    const { device } = useBuilderStore()

    if (activePanel === 'pages') return null;

    // Mobile Properties View
    if (device === 'mobile') {
        return (
            <aside className="w-80 bg-white dark:bg-[#141414] border-l border-slate-200 dark:border-white/10 flex flex-col z-30 animate-in slide-in-from-right-4 duration-300">
                <div className="p-4 border-b border-slate-200 dark:border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <MobileIcon className="text-[#FF007F] w-4 h-4" />
                            <h2 className="font-display text-[10px] tracking-tighter uppercase font-bold dark:text-white">Mobile Properties</h2>
                        </div>
                        <span className="text-[8px] bg-[#FF007F]/20 text-[#FF007F] px-1.5 py-0.5 rounded font-bold">OVERRIDE ACTIVE</span>
                    </div>
                    <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded">
                        <button className="flex-1 py-1.5 text-[10px] font-bold tracking-widest uppercase bg-white dark:bg-white/10 shadow-sm text-slate-900 dark:text-white">Design</button>
                        <button className="flex-1 py-1.5 text-[10px] font-bold tracking-widest uppercase text-slate-500 hover:text-slate-900 dark:hover:text-white transition">Layout</button>
                        <button className="flex-1 py-1.5 text-[10px] font-bold tracking-widest uppercase text-slate-500 hover:text-slate-900 dark:hover:text-white transition">Events</button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {/* Typography Override */}
                    <div>
                        <label className="text-[10px] font-display tracking-widest uppercase font-bold text-slate-400 mb-3 flex items-center gap-2">
                            <Type className="w-3 h-3" /> Mobile Typography
                        </label>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-[10px] text-slate-500 uppercase">Font Size</span>
                                    <span className="text-[10px] font-mono text-[#FF007F]">36px <span className="text-slate-600 line-through ml-1 italic">96px</span></span>
                                </div>
                                <input className="w-full accent-[#FF007F] h-1 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer" max="120" min="12" type="range" defaultValue="36" />
                            </div>
                            <div>
                                <span className="text-[10px] text-slate-500 block mb-2 uppercase">Line Height</span>
                                <div className="bg-slate-100 dark:bg-black/40 px-3 py-2 rounded text-xs border border-slate-200 dark:border-white/5 dark:text-white">0.9</div>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-slate-100 dark:bg-white/5"></div>

                    {/* Visibility Override */}
                    <div>
                        <label className="text-[10px] font-display tracking-widest uppercase font-bold text-slate-400 mb-3 flex items-center gap-2">
                            <EyeOff className="w-3 h-3" /> Mobile Visibility
                        </label>
                        <div className="flex items-center justify-between p-3 bg-[#FF007F]/5 border border-[#FF007F]/20 rounded cursor-pointer group">
                            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">Hide on Mobile</span>
                            <div className="w-8 h-4 bg-[#FF007F] rounded-full relative transition-colors">
                                <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full transition-transform"></div>
                            </div>
                        </div>
                        <p className="text-[9px] text-slate-500 mt-2 italic leading-tight">This element will only be visible on tablet and desktop viewports.</p>
                    </div>

                    <div className="h-px bg-slate-100 dark:bg-white/5"></div>

                    {/* Layout Override */}
                    <div>
                        <label className="text-[10px] font-display tracking-widest uppercase font-bold text-slate-400 mb-3 flex items-center gap-2">
                            <GridView className="w-3 h-3" /> Catalog Layout
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <button className="p-3 border border-[#FF007F]/50 bg-[#FF007F]/10 rounded flex flex-col items-center gap-2 group transition">
                                <Rows className="text-[#FF007F] w-4 h-4" />
                                <span className="text-[9px] font-bold text-slate-900 dark:text-white">STACK</span>
                            </button>
                            <button className="p-3 border border-slate-200 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/20 rounded flex flex-col items-center gap-2 group transition">
                                <GridView className="text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white w-4 h-4" />
                                <span className="text-[9px] font-bold text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white">GRID</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-[#141414]">
                    <div className="flex gap-2">
                        <button className="p-2 rounded bg-white dark:bg-white/10 text-slate-400 hover:text-white transition"><Code className="w-4 h-4" /></button>
                        <button className="p-2 rounded bg-white dark:bg-white/10 text-slate-400 hover:text-white transition"><History className="w-4 h-4" /></button>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Responsi-v1</span>
                </div>
            </aside>
        )
    }

    // Default Desktop View
    return (
        <aside className="w-80 bg-[#141414] border-l border-white/10 flex flex-col z-30 animate-in slide-in-from-right-4 duration-300">
            <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Sliders className="text-[#FF007F] w-4 h-4" />
                        <h2 className="font-display text-[11px] tracking-widest uppercase font-bold text-white">Properties</h2>
                    </div>
                    <button className="text-slate-500 hover:text-white transition"><MoreVertical className="w-4 h-4" /></button>
                </div>
                <div className="flex bg-black/40 p-1 rounded-sm border border-white/5">
                    <button className="flex-1 py-1.5 text-[9px] font-bold tracking-widest uppercase bg-[#FF007F] text-white shadow-lg rounded-sm">Design</button>
                    <button className="flex-1 py-1.5 text-[9px] font-bold tracking-widest uppercase text-slate-500 hover:text-slate-300 transition">Layout</button>
                    <button className="flex-1 py-1.5 text-[9px] font-bold tracking-widest uppercase text-slate-500 hover:text-slate-300 transition">Action</button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-8">
                {/* Background & Fill */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <label className="text-[9px] font-display tracking-[0.2em] uppercase font-bold text-slate-500">Background & Fill</label>
                        <Info className="text-slate-600 w-3 h-3" />
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex-1 flex items-center gap-2 bg-black/40 border border-white/5 p-2 rounded-sm group hover:border-white/20 transition cursor-pointer">
                                <div className="w-5 h-5 bg-transparent border border-white/30 rounded-full"></div>
                                <span className="text-[10px] text-slate-300 font-mono">None (Transparent)</span>
                            </div>
                            <button className="p-2 bg-black/40 border border-white/5 text-slate-400 hover:text-[#FF007F] rounded-sm"><Pipette className="w-4 h-4" /></button>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[9px] text-slate-500 uppercase tracking-tighter">Opacity</span>
                                <span className="text-[9px] font-mono text-slate-300">0%</span>
                            </div>
                            <div className="relative h-1 bg-white/5 rounded-full">
                                <div className="absolute left-0 top-0 h-full w-0 bg-[#FF007F]"></div>
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border border-[#FF007F] rounded-full cursor-pointer shadow-xl"></div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="h-px bg-white/5"></div>

                {/* Stroke & Borders */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <label className="text-[9px] font-display tracking-[0.2em] uppercase font-bold text-slate-500">Stroke & Borders</label>
                        <Zap className="text-[#FF007F] w-3 h-3" />
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                                <span className="text-[9px] text-slate-500 uppercase tracking-tighter">Weight</span>
                                <div className="flex items-center justify-between bg-black/40 border border-white/5 px-2 py-1.5 rounded-sm">
                                    <span className="text-[10px] text-slate-300">2px</span>
                                    <div className="flex flex-col">
                                        <ChevronUp className="w-3 h-3 text-slate-500 hover:text-white cursor-pointer" />
                                        <ChevronDown className="w-3 h-3 text-slate-500 hover:text-white cursor-pointer" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <span className="text-[9px] text-slate-500 uppercase tracking-tighter">Style</span>
                                <div className="flex items-center justify-between bg-black/40 border border-white/5 px-2 py-1.5 rounded-sm cursor-pointer">
                                    <div className="w-full h-px bg-white"></div>
                                    <ChevronDown className="w-3 h-3 text-slate-500 ml-1" />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <span className="text-[9px] text-slate-500 uppercase tracking-tighter">Color</span>
                            <div className="flex items-center gap-2 bg-black/40 border border-white/5 p-2 rounded-sm">
                                <div className="w-5 h-5 bg-white rounded-sm"></div>
                                <span className="text-[10px] text-slate-300 font-mono">#FFFFFF</span>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="h-px bg-white/5"></div>

                {/* Hover Transition */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <label className="text-[9px] font-display tracking-[0.2em] uppercase font-bold text-slate-500">Hover Transition</label>
                        <div className="flex gap-2">
                            <button className="text-slate-600 hover:text-white"><RotateCcw className="w-3 h-3" /></button>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-black/40 border border-white/5 rounded-sm p-3">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] text-slate-300">Cubic Bezier Editor</span>
                                <span className="text-[10px] font-mono text-[#FF007F] italic">.42, 0, .58, 1</span>
                            </div>
                            <div className="relative h-28 bg-black/60 rounded border border-white/10 overflow-hidden group/bezier">
                                <div className="absolute inset-0 opacity-30" style={{
                                    backgroundImage: 'linear-gradient(45deg, transparent 49%, #262626 49%, #262626 51%, transparent 51%)',
                                    backgroundSize: '20px 20px'
                                }}></div>
                                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                                    <path d="M 0 100 C 42 100, 58 0, 100 0" fill="none" stroke="#FF007F" strokeWidth="2"></path>
                                </svg>
                                {/* Drag Handles Visualization */}
                                <div className="absolute left-[42%] bottom-0 w-2.5 h-2.5 bg-[#FF007F] border border-white rounded-full -translate-x-1/2 translate-y-1/2 cursor-grab active:cursor-grabbing z-10"></div>
                                <div className="absolute right-[42%] top-0 w-2.5 h-2.5 bg-[#FF007F] border border-white rounded-full translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing z-10"></div>
                                <div className="absolute left-0 bottom-0 w-[42%] h-px bg-white/20 origin-left"></div>
                                <div className="absolute right-0 top-0 w-[42%] h-px bg-white/20 origin-right"></div>
                            </div>
                            <div className="mt-3 flex justify-between items-center">
                                <button className="text-[9px] uppercase tracking-widest text-slate-500 hover:text-[#FF007F] transition">Presets</button>
                                <Play className="w-3 h-3 text-slate-500" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <span className="text-[9px] text-slate-500 uppercase tracking-tighter">Duration</span>
                            <div className="flex items-center gap-3">
                                <input className="flex-1 accent-[#FF007F] h-0.5 bg-white/10 rounded-lg appearance-none cursor-pointer" max="2000" min="0" type="range" defaultValue="500" />
                                <span className="text-[10px] font-mono w-10 text-right text-slate-300">500ms</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="flex items-center justify-between mb-4">
                        <label className="text-[9px] font-display tracking-[0.2em] uppercase font-bold text-slate-500">Effects on Hover</label>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col items-center gap-1 p-3 bg-white/5 border border-[#FF007F]/20 rounded-sm">
                            <Droplets className="w-4 h-4 text-[#FF007F]" />
                            <span className="text-[8px] uppercase tracking-widest text-slate-300">Invert</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 p-3 bg-black/40 border border-white/5 rounded-sm hover:border-white/20 cursor-pointer">
                            <ZoomIn className="w-4 h-4 text-slate-500" />
                            <span className="text-[8px] uppercase tracking-widest text-slate-400">Scale</span>
                        </div>
                    </div>
                </section>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#141414] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button className="text-slate-500 hover:text-white transition"><Code className="w-4 h-4" /></button>
                    <button className="text-slate-500 hover:text-white transition"><History className="w-4 h-4" /></button>
                </div>
                <div className="flex items-center gap-1 opacity-50">
                    <span className="text-[8px] font-display tracking-widest uppercase text-slate-400">Precision Mode</span>
                    <div className="w-6 h-3 bg-[#FF007F] rounded-full relative">
                        <div className="absolute right-0.5 top-0.5 w-2 h-2 bg-white rounded-full"></div>
                    </div>
                </div>
            </div>
        </aside>
    )
}
