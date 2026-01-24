"use client"

import React from 'react'
import { X, Play, PlayCircle, ChevronRight, MessageSquare, ArrowRight } from 'lucide-react'
import { useBuilderStore } from '@/components/builder/store'

export function SupportCenter() {
    const { setActiveModal } = useBuilderStore()

    return (
        <div className="absolute inset-0 z-[60] flex items-center justify-center p-8 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-4xl rounded-2xl border border-[#262626] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col h-[700px] bg-[#0A0A0A]/95 backdrop-blur-[20px]">
                {/* Header */}
                <div className="p-8 border-b border-[#262626] flex items-center justify-between">
                    <div>
                        <h1 className="font-display text-2xl font-bold tracking-tighter text-white mb-1 uppercase">Support Center</h1>
                        <p className="text-[10px] font-display tracking-[0.2em] text-slate-500 uppercase">Master Builder Shortcuts & Resources</p>
                    </div>
                    <button
                        onClick={() => setActiveModal(null)}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition border border-[#262626] text-slate-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 grid grid-cols-12 gap-10">
                    {/* Left Column: Shortcuts & Support */}
                    <div className="col-span-5 space-y-8">
                        <div>
                            <h3 className="text-[10px] font-display font-bold tracking-widest text-[#FF007F] mb-6 uppercase">Keyboard Shortcuts</h3>
                            <div className="space-y-4">
                                {[
                                    { label: 'Save Project', keys: ['CMD', 'S'] },
                                    { label: 'Undo Change', keys: ['CMD', 'Z'] },
                                    { label: 'Redo Change', keys: ['CMD', 'Y'] },
                                    { label: 'Duplicate Element', keys: ['CMD', 'D'] },
                                    { label: 'Preview Mode', keys: ['P'] }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between group">
                                        <span className="text-xs text-slate-400 group-hover:text-white transition">{item.label}</span>
                                        <div className="flex gap-1">
                                            {item.keys.map((key, k) => (
                                                <kbd key={k} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-mono text-slate-300 min-w-[24px] text-center">
                                                    {key}
                                                </kbd>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-[#262626]">
                            <h3 className="text-[10px] font-display font-bold tracking-widest text-slate-400 mb-4 uppercase">Direct Support</h3>
                            <button className="w-full flex items-center justify-between p-4 bg-[#FF007F] text-white rounded-xl hover:opacity-90 transition shadow-lg shadow-[#FF007F]/20 group">
                                <div className="flex items-center gap-3">
                                    <MessageSquare className="w-5 h-5" />
                                    <span className="text-xs font-bold font-display uppercase tracking-widest">Agent Support</span>
                                </div>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <p className="mt-3 text-[10px] text-slate-500 italic text-center">Avg. response time: 2 minutes</p>
                        </div>
                    </div>

                    {/* Right Column: Masterclasses */}
                    <div className="col-span-7 border-l border-[#262626] pl-10">
                        <h3 className="text-[10px] font-display font-bold tracking-widest text-slate-400 mb-6 uppercase">Video Masterclasses</h3>
                        <div className="space-y-6">
                            {/* Hero Video */}
                            <div className="group cursor-pointer">
                                <div className="aspect-video w-full bg-[#141414] rounded-xl border border-[#262626] overflow-hidden relative mb-3">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-[#141414] to-transparent z-10"></div>
                                    {/* Placeholder styling for video thumbnail */}
                                    <div className="w-full h-full bg-neutral-900 opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-60 transition duration-500 flex items-center justify-center">
                                        <PlayCircle className="w-16 h-16 text-white/50" />
                                    </div>

                                    <div className="absolute inset-0 flex items-center justify-center z-20">
                                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-black group-hover:scale-110 transition shadow-xl">
                                            <Play className="w-5 h-5 ml-0.5 fill-black" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 text-[10px] font-mono rounded text-slate-300 z-20 border border-white/10">02:45</div>
                                </div>
                                <h4 className="text-sm font-semibold text-white group-hover:text-[#FF007F] transition mb-1">How to add a new Store Portal</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">Learn how to configure your marketplace storefront with the portal widget.</p>
                            </div>

                            {/* List Videos */}
                            {[
                                { title: 'How to sync with Supabase', subtitle: 'Real-time database integration guide.' },
                                { title: 'Noir Design Principles', subtitle: 'Mastering the luxury aesthetic.' }
                            ].map((video, i) => (
                                <div key={i} className="group cursor-pointer">
                                    <div className="flex gap-4 items-center p-3 rounded-xl border border-transparent hover:border-[#262626] hover:bg-white/5 transition">
                                        <div className="w-24 h-16 bg-[#141414] rounded-lg border border-[#262626] overflow-hidden flex-shrink-0 relative flex items-center justify-center">
                                            <div className="absolute inset-0 bg-neutral-800 opacity-30"></div>
                                            <PlayCircle className="absolute w-6 h-6 text-white z-10" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-white mb-1 group-hover:text-[#FF007F] transition">{video.title}</h4>
                                            <p className="text-[10px] text-slate-500">{video.subtitle}</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-600 ml-auto group-hover:text-white transition" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-white/5 border-t border-[#262626] flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-500">SYSTEM STATUS:</span>
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            OPERATIONAL
                        </span>
                    </div>
                    <div className="text-[10px] font-display text-slate-500 tracking-widest uppercase">Americana Documentation © 2024</div>
                </div>
            </div>
        </div>
    )
}
