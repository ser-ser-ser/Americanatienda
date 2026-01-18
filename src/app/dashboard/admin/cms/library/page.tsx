'use client'

import { useState } from 'react'
import {
    Workflow,
    Library,
    FileText,
    CheckCircle,
    Terminal,
    Search,
    Plus,
    Upload,
    Settings2,
    Code,
    BadgeCheck,
    Monitor,
    Maximize,
    Bolt,
    Grid,
    Layout,
    Box,
    FileJson,
    Cpu,
    Server,
    Database,
    Cloud
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function CMSLibraryPage() {
    return (
        <div className="flex flex-col h-screen overflow-hidden bg-[#050505] text-white font-sans selection:bg-[#f425af]/30">
            {/* HEADER */}
            <header className="h-14 flex items-center justify-between border-b border-[#1f1f1f] bg-[#050505] px-6 z-50">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="h-6 w-6 bg-[#f425af] flex items-center justify-center rounded-sm text-black">
                            <Workflow className="h-4 w-4 text-white" />
                        </div>
                        <h1 className="text-xs font-bold tracking-[0.2em] uppercase">Americana <span className="text-[#f425af]">Schema</span></h1>
                    </div>
                    <nav className="flex items-center gap-6">
                        <a className="text-[10px] font-bold uppercase tracking-widest text-[#f425af] border-b border-[#f425af] pb-0.5" href="#">Library</a>
                        <a className="text-[10px] font-bold uppercase tracking-widest text-[#888888] hover:text-white transition" href="#">Validation</a>
                        <a className="text-[10px] font-bold uppercase tracking-widest text-[#888888] hover:text-white transition" href="#">Docs</a>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 rounded border border-[#1f1f1f] bg-[#0f0f0f]/50">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#3ecf8e] shadow-[0_0_15px_rgba(62,207,142,0.1)]"></div>
                        <span className="text-[9px] font-mono text-[#888888] uppercase tracking-tighter">API: Stable 2.4.1</span>
                    </div>
                    <button className="flex h-8 items-center gap-2 rounded bg-white text-black px-4 text-[10px] font-bold uppercase tracking-widest transition hover:bg-[#f425af] hover:text-white">
                        Publish Schema
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* LEFT SIDEBAR - JSON TREE */}
                <aside className="w-80 border-r border-[#1f1f1f] flex flex-col bg-[#0f0f0f]/30">
                    <div className="p-4 border-b border-[#1f1f1f] flex justify-between items-center">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#888888]">Polymorphic Blocks</h2>
                        <Search className="h-4 w-4 text-[#888888]" />
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px] custom-scrollbar">
                        <div className="text-[#f425af] mb-2">"blocks": [</div>
                        <div className="pl-4 border-l border-[#1f1f1f] ml-3">
                            <div className="group cursor-pointer py-1">
                                <span className="text-[#3ecf8e]">{`{`}</span>
                                <div className="pl-4 border-l border-[#1f1f1f] ml-3">
                                    <div><span className="text-[#888888]">"id":</span> <span className="text-white">"hero_v1"</span>,</div>
                                    <div className="bg-[#251220]/50 -mx-2 px-2 border-l-2 border-[#f425af]"><span className="text-[#888888]">"type":</span> <span className="text-[#f425af]">"video_hero"</span>,</div>
                                    <div><span className="text-[#888888]">"props":</span> <span className="text-[#3ecf8e]">{`{ ... }`}</span></div>
                                </div>
                                <span className="text-[#3ecf8e]">{`}`}</span>,
                            </div>
                            <div className="group cursor-pointer py-1 opacity-60 hover:opacity-100 transition">
                                <span className="text-[#3ecf8e]">{`{`}</span>
                                <div className="pl-4 border-l border-[#1f1f1f] ml-3">
                                    <div><span className="text-[#888888]">"id":</span> <span className="text-white">"gal_02"</span>,</div>
                                    <div><span className="text-[#888888]">"type":</span> <span className="text-white">"editorial_gallery"</span>,</div>
                                    <div><span className="text-[#888888]">"props":</span> <span className="text-[#3ecf8e]">{`{ ... }`}</span></div>
                                </div>
                                <span className="text-[#3ecf8e]">{`}`}</span>,
                            </div>
                            <div className="group cursor-pointer py-1 opacity-60 hover:opacity-100 transition">
                                <span className="text-[#3ecf8e]">{`{`}</span>
                                <div className="pl-4 border-l border-[#1f1f1f] ml-3">
                                    <div><span className="text-[#888888]">"id":</span> <span className="text-white">"portal_sub"</span>,</div>
                                    <div><span className="text-[#888888]">"type":</span> <span className="text-white">"store_portal"</span>,</div>
                                    <div><span className="text-[#888888]">"props":</span> <span className="text-[#3ecf8e]">{`{ ... }`}</span></div>
                                </div>
                                <span className="text-[#3ecf8e]">{`}`}</span>
                            </div>
                        </div>
                        <div className="text-[#f425af] mt-2">]</div>
                    </div>
                    <div className="p-4 bg-black/40 border-t border-[#1f1f1f]">
                        <div className="flex items-center gap-2 text-[9px] font-bold text-[#888888] uppercase mb-2">
                            <Terminal className="h-3 w-3" />
                            Quick Actions
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <button className="bg-[#1f1f1f] hover:bg-[#f425af]/20 p-2 rounded text-[9px] uppercase tracking-wider transition">New Block</button>
                            <button className="bg-[#1f1f1f] hover:bg-[#f425af]/20 p-2 rounded text-[9px] uppercase tracking-wider transition">Import</button>
                        </div>
                    </div>
                </aside>

                {/* MAIN - SCHEMA DEFINITION */}
                <main className="flex-1 flex flex-col bg-[#050505]">
                    <div className="p-6 border-b border-[#1f1f1f] flex items-end justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-bold text-[#f425af] uppercase tracking-widest">Selected Component</span>
                                <span className="h-px w-8 bg-[#f425af]"></span>
                            </div>
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter">Video_Hero_Block</h2>
                        </div>
                        <div className="flex gap-4 mb-1">
                            <div className="text-right">
                                <p className="text-[9px] text-[#888888] uppercase font-bold">Zod Validation</p>
                                <p className="text-[10px] text-[#3ecf8e] font-mono flex items-center justify-end gap-1">
                                    schema.parse(data) <CheckCircle className="h-3 w-3" />
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#888888] mb-4 flex items-center gap-2">
                                        <Settings2 className="h-3 w-3" /> Block Properties
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 rounded border border-[#1f1f1f] bg-[#0f0f0f]/50 group hover:border-[#f425af]/50 transition">
                                            <span className="text-xs font-mono text-white/80">heading_text</span>
                                            <span className="text-[9px] font-bold uppercase text-[#888888] px-2 py-0.5 bg-black rounded">String</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded border border-[#1f1f1f] bg-[#0f0f0f]/50 group hover:border-[#f425af]/50 transition">
                                            <span className="text-xs font-mono text-white/80">accent_color</span>
                                            <div className="flex items-center gap-2">
                                                <div className="h-3 w-3 rounded-full bg-[#f425af] shadow-sm shadow-[#f425af]/50"></div>
                                                <span className="text-[9px] font-mono text-[#888888]">#F425AF</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded border border-[#1f1f1f] bg-[#0f0f0f]/50 group hover:border-[#f425af]/50 transition">
                                            <span className="text-xs font-mono text-white/80">video_url</span>
                                            <span className="text-[9px] font-bold uppercase text-[#3ecf8e] px-2 py-0.5 bg-[#3ecf8e]/10 rounded border border-[#3ecf8e]/20">URI.REQUIRED</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded border border-[#1f1f1f] bg-[#0f0f0f]/50 group hover:border-[#f425af]/50 transition">
                                            <span className="text-xs font-mono text-white/80">padding_top</span>
                                            <span className="text-[9px] font-bold uppercase text-[#888888] px-2 py-0.5 bg-black rounded">Int (0-120)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#888888] mb-4 flex items-center gap-2">
                                    <Code className="h-3 w-3" /> Zod Schema Definition
                                </h4>
                                <div className="rounded-lg bg-[#0a0a0a] border border-[#1f1f1f] p-5 font-mono text-[11px] leading-relaxed relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-2 opacity-20">
                                        <FileJson className="h-8 w-8" />
                                    </div>
                                    <div className="text-[#888888]">const VideoHeroSchema = z.object({`{`}</div>
                                    <div className="pl-4 text-white">
                                        <div><span className="text-[#f425af]">id</span>: z.string().uuid(),</div>
                                        <div><span className="text-[#f425af]">heading</span>: z.string().max(48),</div>
                                        <div><span className="text-[#f425af]">video_url</span>: z.string().url(),</div>
                                        <div><span className="text-[#f425af]">overlay</span>: z.boolean().default(true),</div>
                                        <div><span className="text-[#f425af]">spacing</span>: z.number().min(0).max(120)</div>
                                    </div>
                                    <div className="text-[#888888]">{`}`});</div>
                                    <div className="mt-6 pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-2 text-[#3ecf8e]">
                                            <BadgeCheck className="h-4 w-4" />
                                            <span className="text-[9px] font-bold uppercase tracking-widest">Type Inference Valid</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* RIGHT SIDEBAR - PREVIEW */}
                <aside className="w-[450px] border-l border-[#1f1f1f] flex flex-col bg-[#050505]">
                    <div className="p-4 border-b border-[#1f1f1f] flex justify-between items-center bg-[#0f0f0f]/30">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#888888]">Live Component Library</h2>
                        <div className="flex gap-2 text-[#888888]">
                            <Monitor className="h-4 w-4 cursor-pointer hover:text-white" />
                            <Maximize className="h-4 w-4 cursor-pointer hover:text-white" />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-8">
                        <div className="group relative">
                            <div className="absolute -top-3 left-3 px-2 py-0.5 bg-[#f425af] text-[8px] font-bold uppercase tracking-tighter z-10 text-black">Active Render</div>
                            <div className="relative aspect-[4/5] bg-[#0f0f0f] overflow-hidden border border-white/10 group-hover:border-[#f425af]/50 transition-colors">
                                <img
                                    alt="Fashion Preview"
                                    className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuGgWdU2dpAYwrLBsxC4qBguHGfbq4AubGjDR7nI49WtTGtX9clgSL69lP86jHvXqFEOy2G61t6CoMj1_9nYKYh5e-1QaI07xGCTlEePynJ6Nu_ebSn3VdDDxM5p3Poh7ZuQkBOGq8bV2FN-s9GXB6ZG2NQlOqO-kAXEkonIihjgFJgFt5W2TalzY-NvujlYpeYQO6fCMkZNDxYG8r-bd5oXTqqkAXkgJBzSlmp3e2PNM9PSY2B1PvtbFg03GX2Xnejn9PaI5q6nhI"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                                <div className="absolute bottom-8 left-8 right-8">
                                    <div className="text-[8px] font-bold text-[#f425af] uppercase mb-2 tracking-[0.4em]">Spring/Summer 24</div>
                                    <h3 className="text-2xl font-black italic uppercase leading-none tracking-tighter mb-4 text-white">The Noir<br />Collection</h3>
                                    <div className="flex items-center gap-4 text-white">
                                        <div className="h-0.5 w-12 bg-white"></div>
                                        <span className="text-[9px] font-bold uppercase tracking-widest">Discover</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 flex justify-between items-center">
                                <span className="text-[9px] font-mono text-[#888888] uppercase">Hero_Variant_01.tsx</span>
                                <span className="text-[9px] font-mono text-[#3ecf8e]">2.4kb gzipped</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 opacity-40">
                            <div className="aspect-square bg-[#0f0f0f] border border-white/5 flex flex-col items-center justify-center p-4 text-center">
                                <Grid className="h-6 w-6 mb-2 text-white" />
                                <span className="text-[8px] font-bold uppercase tracking-widest text-[#888888]">Grid_Portal</span>
                            </div>
                            <div className="aspect-square bg-[#0f0f0f] border border-white/5 flex flex-col items-center justify-center p-4 text-center">
                                <Layout className="h-6 w-6 mb-2 text-white" />
                                <span className="text-[8px] font-bold uppercase tracking-widest text-[#888888]">Editorial_Flow</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            {/* FOOTER */}
            <footer className="h-8 border-t border-[#1f1f1f] bg-black px-6 flex items-center justify-between text-[9px] font-mono text-[#888888]">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#3ecf8e]"></span>
                        <span>SYSTEM_ONLINE</span>
                    </div>
                    <div>LATENCY: 24ms</div>
                    <div className="text-[#f425af]/70">ENVIRONMENT: PRODUCTION</div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="cursor-pointer hover:text-white">v2.4.1-alpha.rc3</span>
                    <span className="cursor-pointer hover:text-white">MEM: 124MB</span>
                    <div className="flex items-center gap-1 bg-[#f425af]/10 text-[#f425af] px-2 py-0.5 rounded">
                        <Bolt className="h-3 w-3" />
                        <span>REVALIDATED</span>
                    </div>
                </div>
            </footer>
        </div>
    )
}
