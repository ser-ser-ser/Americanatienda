'use client'

import {
    Network,
    Terminal,
    Box,
    Eye,
    Database,
    Monitor,
    CloudUpload,
    Activity,
    Shield,
    FileJson,
    Code,
    Cpu
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function CMSArchitecturePage() {
    return (
        <div className="bg-[#0a0508] text-white font-sans min-h-screen overflow-x-hidden selection:bg-[#f425af]/30">
            {/* HEADER */}
            <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-[#34182b] bg-[#1a0c16] px-8">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-[#f425af] text-white">
                            <Network className="h-4 w-4" />
                        </div>
                        <h1 className="text-lg font-bold tracking-tight uppercase">Technical <span className="text-[#f425af]">Architecture</span></h1>
                    </div>
                    <div className="h-6 w-[1px] bg-[#34182b]"></div>
                    <nav className="hidden md:flex items-center gap-6">
                        <a className="text-xs font-bold uppercase tracking-widest text-[#f425af] border-b border-[#f425af] pb-1" href="#">Logic Flow</a>
                        <a className="text-xs font-bold uppercase tracking-widest text-[#cb90b7] hover:text-white transition" href="#">Data Schema</a>
                        <a className="text-xs font-bold uppercase tracking-widest text-[#cb90b7] hover:text-white transition" href="#">API Docs</a>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#34182b] bg-[#0a0508]/50">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#3ecf8e]"></div>
                        <span className="text-[10px] font-bold uppercase tracking-tighter text-[#cb90b7]">Database: Supabase Live</span>
                    </div>
                    <button className="flex h-9 items-center gap-2 rounded-lg bg-[#49223c] px-4 text-xs font-bold uppercase tracking-widest transition hover:bg-[#f425af]/20 hover:border-[#f425af] border border-transparent">
                        <Terminal className="h-4 w-4" />
                        Console
                    </button>
                </div>
            </header>

            <main className="pt-32 pb-20 px-8 max-w-7xl mx-auto">
                <div className="mb-16 text-center">
                    <h2 className="text-5xl font-black uppercase tracking-tighter mb-4 italic">The Americana Stack</h2>
                    <p className="text-[#cb90b7] max-w-2xl mx-auto text-sm leading-relaxed">
                        A high-performance technical workflow for the God-Mode Page Builder. Integrating real-time state management with atomic revalidation for a seamless high-fashion editing experience.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative">

                    {/* NODE 1 */}
                    <div className="relative group">
                        <div className="bg-[rgba(26,12,22,0.6)] backdrop-blur-md border border-[#f425af]/10 rounded-2xl p-6 h-full transition hover:border-[#f425af]/40">
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-4xl font-black text-[#f425af]/20 italic group-hover:text-[#f425af] transition-colors">01</span>
                                <Box className="h-10 w-10 text-white bg-white/10 p-2 rounded-lg" />
                            </div>
                            <h3 className="text-lg font-bold uppercase mb-2">Editor UI State</h3>
                            <p className="text-xs text-[#cb90b7] leading-relaxed mb-6">
                                Next.js client-side state management using a structured JSONB object. Every block interaction updates the local tree.
                            </p>
                            <div className="space-y-2">
                                <div className="bg-black/40 rounded-lg p-3 border border-[#34182b] font-mono text-[10px] text-[#f425af]/70">
                                    {`{ "blocks": [`} <br />
                                    &nbsp;&nbsp;{`{ "id": "hero_1",`} <br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;{`"type": "video_hero" }`} <br />
                                    {`] }`}
                                </div>
                            </div>
                        </div>
                        <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-[2px] bg-gradient-to-r from-[#f425af] to-transparent z-10"></div>
                    </div>

                    {/* NODE 2 (Active) */}
                    <div className="relative group">
                        <div className="bg-[rgba(26,12,22,0.6)] backdrop-blur-md border border-[#f425af]/10 rounded-2xl p-6 h-full transition hover:border-[#f425af]/40 animate-pulse shadow-[0_0_15px_rgba(244,37,175,0.1)] ring-1 ring-[#f425af]/30">
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-4xl font-black text-[#f425af]/20 italic group-hover:text-[#f425af] transition-colors">02</span>
                                <Eye className="h-10 w-10 text-[#f425af] bg-[#f425af]/10 p-2 rounded-lg" />
                            </div>
                            <h3 className="text-lg font-bold uppercase mb-2">Instant Preview</h3>
                            <p className="text-xs text-[#cb90b7] leading-relaxed mb-6">
                                React rendering engine interprets the JSONB state instantly. Hot-reloading visual changes without database roundtrips.
                            </p>
                            <div className="flex gap-2">
                                <div className="flex-1 h-12 bg-[#49223c]/40 rounded border border-[#34182b] flex items-center justify-center">
                                    <Monitor className="h-5 w-5 text-[#cb90b7]" /> {/* Assuming Monitor icon here */}
                                </div>
                                <div className="flex-1 h-12 bg-[#49223c]/40 rounded border border-[#34182b] flex items-center justify-center">
                                    <Cpu className="h-5 w-5 text-[#cb90b7]" />
                                </div>
                            </div>
                        </div>
                        <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-[2px] bg-gradient-to-r from-[#f425af] to-transparent z-10"></div>
                    </div>

                    {/* NODE 3 */}
                    <div className="relative group">
                        <div className="bg-[rgba(26,12,22,0.6)] backdrop-blur-md border border-[#f425af]/10 rounded-2xl p-6 h-full transition hover:border-[#f425af]/40">
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-4xl font-black text-[#f425af]/20 italic group-hover:text-[#f425af] transition-colors">03</span>
                                <Database className="h-10 w-10 text-[#3ecf8e] bg-[#3ecf8e]/10 p-2 rounded-lg" />
                            </div>
                            <h3 className="text-lg font-bold uppercase mb-2">Supabase Sync</h3>
                            <p className="text-xs text-[#cb90b7] leading-relaxed mb-6">
                                Saving the JSON layout to PostgreSQL. Row Level Security ensures only authenticated 'Master Admins' can persist changes.
                            </p>
                            <div className="p-3 bg-[#3ecf8e]/5 border border-[#3ecf8e]/20 rounded-lg flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-[#3ecf8e] animate-pulse"></div>
                                <span className="text-[10px] font-mono text-[#3ecf8e] uppercase tracking-wider">UPDATING TABLE: pages</span>
                            </div>
                        </div>
                        <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-[2px] bg-gradient-to-r from-[#f425af] to-transparent z-10"></div>
                    </div>

                    {/* NODE 4 */}
                    <div className="relative group">
                        <div className="bg-[rgba(26,12,22,0.6)] backdrop-blur-md border border-[#f425af]/10 rounded-2xl p-6 h-full transition hover:border-[#f425af]/40">
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-4xl font-black text-[#f425af]/20 italic group-hover:text-[#f425af] transition-colors">04</span>
                                <CloudUpload className="h-10 w-10 text-white bg-black p-2 rounded-lg border border-white/20" />
                            </div>
                            <h3 className="text-lg font-bold uppercase mb-2">Vercel Edge ISR</h3>
                            <p className="text-xs text-[#cb90b7] leading-relaxed mb-6">
                                Triggering Incremental Static Regeneration. Vercel revalidates the production route for global low-latency delivery.
                            </p>
                            <div className="flex items-center justify-center h-12 bg-white/5 rounded-lg border border-white/10 italic text-[10px] uppercase font-bold text-[#cb90b7]">
                                revalidatePath('/shop')
                            </div>
                        </div>
                    </div>

                </div>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="p-8 border border-[#34182b] rounded-3xl bg-[#1a0c16]/40">
                        <div className="flex items-center gap-3 mb-6">
                            <FileJson className="h-5 w-5 text-[#f425af]" />
                            <h4 className="text-sm font-bold uppercase tracking-widest">Data Structure</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-[#f425af] shrink-0"></div>
                                <div>
                                    <p className="text-xs font-bold uppercase mb-1">Polymorphic Blocks</p>
                                    <p className="text-xs text-[#cb90b7]">Each block type (Hero, Grid, Text) has its own schema validation via Zod.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-[#f425af] shrink-0"></div>
                                <div>
                                    <p className="text-xs font-bold uppercase mb-1">Atomic Revalidation</p>
                                    <p className="text-xs text-[#cb90b7]">On-demand ISR prevents full site rebuilds, updating only the modified path.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 border border-[#34182b] rounded-3xl bg-[#1a0c16]/40">
                        <div className="flex items-center gap-3 mb-6">
                            <Shield className="h-5 w-5 text-[#f425af]" />
                            <h4 className="text-sm font-bold uppercase tracking-widest">Infrastructure Edge</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-[#f425af] shrink-0"></div>
                                <div>
                                    <p className="text-xs font-bold uppercase mb-1">PostgreSQL + JSONB</p>
                                    <p className="text-xs text-[#cb90b7]">Combines relational data (Products) with flexible layout structures.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-[#f425af] shrink-0"></div>
                                <div>
                                    <p className="text-xs font-bold uppercase mb-1">Server Actions</p>
                                    <p className="text-xs text-[#cb90b7]">Direct editor-to-database communication with built-in CSRF protection.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 px-6 py-3 bg-[rgba(26,12,22,0.6)] backdrop-blur-md rounded-full border border-[#f425af]/30 shadow-2xl z-50">
                <div className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f425af]/20">
                        <Code className="h-3 w-3 text-[#f425af]" />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#cb90b7]">Architecture v2.4.0</p>
                </div>
                <div className="h-4 w-[1px] bg-[#34182b]"></div>
                <div className="flex gap-4">
                    <span className="text-[10px] font-bold uppercase text-white hover:text-[#f425af] cursor-pointer transition">System Health: 99.9%</span>
                    <span className="text-[10px] font-bold uppercase text-white hover:text-[#f425af] cursor-pointer transition">Uptime: 42d</span>
                </div>
                <div className="h-4 w-[1px] bg-[#34182b]"></div>
                <button className="bg-[#f425af] px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition">
                    Export Diagram
                </button>
            </div>
        </div>
    )
}
