"use client"

import React from 'react'
import {
    Settings2 as SettingsIcon,
    Radio,
    Clock,
    User,
    Database,
    Server,
    Activity,
    Cpu,
    Zap,
    Rocket,
    Globe,
    AlertCircle,
    Download,
    Trash2,
    X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useBuilderStore } from '@/components/builder/store'

export function InfrastructureMonitor() {
    const { setActiveModal } = useBuilderStore()

    return (
        <div className="fixed inset-0 z-[100] bg-[#f8f5f7] dark:bg-[#0a0609] text-slate-900 dark:text-slate-100 flex flex-col font-display overflow-hidden animate-in fade-in duration-300">
            {/* Top Navigation */}
            <header className="h-16 border-b border-[#f425af]/20 bg-[#f8f5f7] dark:bg-[#0a0609]/80 backdrop-blur-md flex items-center justify-between px-6 z-20">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-[#f425af] flex items-center justify-center rounded">
                        <SettingsIcon className="text-white w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tighter uppercase">Americana <span className="text-[#f425af]">Ops</span></h1>
                        <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase -mt-1">Railway Infrastructure Monitor</p>
                    </div>
                </div>
                <div className="flex items-center gap-8">
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#39ff14] shadow-[0_0_8px_#39ff14]"></span>
                            <span className="text-[#39ff14]">System Healthy</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                            <Clock className="w-4 h-4" />
                            <span>Uptime: 99.98%</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="bg-[#f425af]/10 border border-[#f425af]/30 text-[#f425af] px-4 py-1.5 rounded text-sm font-bold uppercase hover:bg-[#f425af] hover:text-white transition-all">
                            Emergency Stop
                        </button>
                        <button
                            onClick={() => setActiveModal(null)}
                            className="w-10 h-10 rounded bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-slate-700 transition"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 border-r border-slate-800 bg-[#f8f5f7] dark:bg-[#161616]/30 hidden lg:flex flex-col p-6 gap-8">
                    <div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Core Metrics</h3>
                        <div className="space-y-4">
                            <div className="p-3 border border-slate-800 bg-black/20 rounded">
                                <p className="text-xs text-slate-500 mb-1">Monthly Spend</p>
                                <p className="text-lg font-bold font-mono">$428.12 <span className="text-[10px] text-[#39ff14]">+2.4%</span></p>
                            </div>
                            <div className="p-3 border border-slate-800 bg-black/20 rounded">
                                <p className="text-xs text-slate-500 mb-1">Active Containers</p>
                                <p className="text-lg font-bold font-mono text-[#f425af]">12 / 12</p>
                            </div>
                            <div className="p-3 border border-slate-800 bg-black/20 rounded">
                                <p className="text-xs text-slate-500 mb-1">Network Out</p>
                                <p className="text-lg font-bold font-mono flex items-center gap-1">1.2 TB <Activity className="w-3 h-3" /></p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-auto">
                        <div className="p-4 border-2 border-[#f425af]/20 bg-[#f425af]/5 rounded relative overflow-hidden group">
                            <div className="relative z-10">
                                <h4 className="text-sm font-bold mb-2">Deploy Changes</h4>
                                <p className="text-xs text-slate-400 mb-4">Current build: v4.8.2-alpha. Deployment takes approx. 45s.</p>
                                <button className="w-full bg-[#f425af] py-2.5 rounded font-bold text-sm text-white shadow-[0_0_20px_rgba(244,37,175,0.4)] hover:shadow-[0_0_30px_rgba(244,37,175,0.6)] transition-all flex items-center justify-center gap-2">
                                    <Rocket className="w-4 h-4" />
                                    DEPLOY NOW
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Dashboard Content */}
                <section className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 relative">
                    {/* Scanline Effect */}
                    <div className="w-full h-[100px] z-10 absolute top-0 left-0 pointer-events-none opacity-10" style={{
                        background: 'linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, rgba(244, 37, 175, 0.05) 50%, rgba(0, 0, 0, 0) 100%)'
                    }}></div>

                    {/* Dashboard Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {/* Service Card 1 */}
                        <div className="bg-[#161616] border border-slate-800 rounded p-5 relative overflow-hidden group hover:border-[#f425af]/50 transition-colors">
                            <div className="absolute top-0 right-0 p-4">
                                <span className="flex h-3 w-3 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39ff14] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#39ff14]"></span>
                                </span>
                            </div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-slate-800 flex items-center justify-center rounded">
                                    <Globe className="text-slate-400 w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-tight">Americana Frontend</h3>
                                    <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded uppercase">Next.js Framework</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">CPU Load</p>
                                    <div className="flex items-end gap-1 h-8">
                                        <div className="w-1.5 bg-[#39ff14]/40 h-2"></div>
                                        <div className="w-1.5 bg-[#39ff14]/40 h-4"></div>
                                        <div className="w-1.5 bg-[#39ff14] h-6"></div>
                                        <div className="w-1.5 bg-[#39ff14]/40 h-3"></div>
                                        <div className="w-1.5 bg-[#39ff14]/40 h-2"></div>
                                        <div className="w-1.5 bg-[#39ff14] h-5"></div>
                                        <span className="font-mono font-bold text-xs ml-1">12%</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Memory Usage</p>
                                    <div className="flex items-end gap-1 h-8">
                                        <div className="w-1.5 bg-blue-500/40 h-4"></div>
                                        <div className="w-1.5 bg-blue-500 h-5"></div>
                                        <div className="w-1.5 bg-blue-500/40 h-5"></div>
                                        <div className="w-1.5 bg-blue-500 h-4"></div>
                                        <div className="w-1.5 bg-blue-500/40 h-5"></div>
                                        <div className="w-1.5 bg-blue-500 h-6"></div>
                                        <span className="font-mono font-bold text-xs ml-1 text-blue-400">256MB</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pt-4 border-t border-slate-800">
                                <span>REGION: us-east-1</span>
                                <span className="text-[#39ff14]">ACTIVE: 14d 2h 11m</span>
                            </div>
                        </div>

                        {/* Service Card 2 */}
                        <div className="bg-[#161616] border border-slate-800 rounded p-5 relative overflow-hidden group hover:border-[#f425af]/50 transition-colors">
                            <div className="absolute top-0 right-0 p-4">
                                <span className="flex h-3 w-3 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                                </span>
                            </div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-slate-800 flex items-center justify-center rounded">
                                    <Server className="text-slate-400 w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-tight">Merchant API</h3>
                                    <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded uppercase">Node.js Engine</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">CPU Load</p>
                                    <div className="flex items-end gap-1 h-8">
                                        <div className="w-1.5 bg-yellow-500 h-4"></div>
                                        <div className="w-1.5 bg-yellow-500 h-6"></div>
                                        <div className="w-1.5 bg-yellow-500 h-8"></div>
                                        <div className="w-1.5 bg-yellow-500 h-7"></div>
                                        <div className="w-1.5 bg-yellow-500 h-5"></div>
                                        <div className="w-1.5 bg-yellow-500 h-6"></div>
                                        <span className="font-mono font-bold text-xs ml-1 text-yellow-500">45%</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Memory Usage</p>
                                    <div className="flex items-end gap-1 h-8">
                                        <div className="w-1.5 bg-blue-500 h-6"></div>
                                        <div className="w-1.5 bg-blue-500 h-7"></div>
                                        <div className="w-1.5 bg-blue-500 h-8"></div>
                                        <div className="w-1.5 bg-blue-500 h-8"></div>
                                        <div className="w-1.5 bg-blue-500 h-7"></div>
                                        <div className="w-1.5 bg-blue-500 h-8"></div>
                                        <span className="font-mono font-bold text-xs ml-1 text-blue-400">512MB</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pt-4 border-t border-slate-800">
                                <span>REGION: eu-west-2</span>
                                <span className="text-yellow-500 uppercase">Deploying v2.4.1...</span>
                            </div>
                        </div>

                        {/* Service Card 3 */}
                        <div className="bg-[#161616] border border-slate-800 rounded p-5 relative overflow-hidden group hover:border-[#f425af]/50 transition-colors">
                            <div className="absolute top-0 right-0 p-4">
                                <span className="flex h-3 w-3 relative">
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#39ff14]"></span>
                                </span>
                            </div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-slate-800 flex items-center justify-center rounded">
                                    <Zap className="text-slate-400 w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-tight">Logistics Worker</h3>
                                    <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded uppercase">Python / Redis</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">CPU Load</p>
                                    <div className="flex items-end gap-1 h-8">
                                        <div className="w-1.5 bg-[#39ff14]/20 h-1"></div>
                                        <div className="w-1.5 bg-[#39ff14]/20 h-2"></div>
                                        <div className="w-1.5 bg-[#39ff14]/40 h-2"></div>
                                        <div className="w-1.5 bg-[#39ff14]/20 h-1"></div>
                                        <div className="w-1.5 bg-[#39ff14]/20 h-2"></div>
                                        <div className="w-1.5 bg-[#39ff14]/20 h-1"></div>
                                        <span className="font-mono font-bold text-xs ml-1">5%</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Memory Usage</p>
                                    <div className="flex items-end gap-1 h-8">
                                        <div className="w-1.5 bg-blue-500/20 h-2"></div>
                                        <div className="w-1.5 bg-blue-500/20 h-2"></div>
                                        <div className="w-1.5 bg-blue-500/20 h-3"></div>
                                        <div className="w-1.5 bg-blue-500/20 h-2"></div>
                                        <div className="w-1.5 bg-blue-500/20 h-2"></div>
                                        <div className="w-1.5 bg-blue-500/20 h-3"></div>
                                        <span className="font-mono font-bold text-xs ml-1 text-blue-400">128MB</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pt-4 border-t border-slate-800">
                                <span>REGION: us-east-1</span>
                                <span className="text-[#39ff14]">ACTIVE: 32d 5h 02m</span>
                            </div>
                        </div>
                    </div>

                    {/* Terminal Area */}
                    <div className="flex-1 min-h-0 bg-black border border-slate-800 rounded flex flex-col font-mono text-xs">
                        <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                                    <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                                </div>
                                <span className="text-slate-500 uppercase font-bold tracking-widest text-[10px]">Real-Time Server Logs</span>
                            </div>
                            <div className="flex items-center gap-4 text-slate-400">
                                <button className="hover:text-[#f425af] transition-colors flex items-center gap-1">
                                    <Trash2 className="w-4 h-4" />
                                    <span>CLEAR</span>
                                </button>
                                <button className="hover:text-[#f425af] transition-colors flex items-center gap-1">
                                    <Download className="w-4 h-4" />
                                    <span>EXPORT</span>
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 terminal-scroll text-slate-300 leading-relaxed custom-scrollbar bg-black/90">
                            <div className="mb-1"><span className="text-slate-600">[2023-10-24 14:22:01]</span> <span className="text-[#f425af]">INF</span> - Starting deployment for merchant-api-v2.4.1</div>
                            <div className="mb-1"><span className="text-slate-600">[2023-10-24 14:22:05]</span> <span className="text-blue-400">LOG</span> - Fetching dependencies from railway registry...</div>
                            <div className="mb-1"><span className="text-slate-600">[2023-10-24 14:22:12]</span> <span className="text-[#39ff14]">SUC</span> - GET /api/v1/orders/ORD-8821 200 OK (42ms)</div>
                            <div className="mb-1"><span className="text-slate-600">[2023-10-24 14:22:15]</span> <span className="text-blue-400">LOG</span> - Worker-01: Processing Queue Batch ID #9921...</div>
                            <div className="mb-1"><span className="text-slate-600">[2023-10-24 14:22:18]</span> <span className="text-[#39ff14]">SUC</span> - Deployment health check passed for node-01</div>
                            <div className="mb-1 text-slate-500">...</div>
                            <div className="mb-1"><span className="text-slate-600">[2023-10-24 14:22:30]</span> <span className="text-[#39ff14]">SUC</span> - GET /api/v1/health 200 OK</div>
                            <div className="mb-1"><span className="text-slate-600">[2023-10-24 14:22:31]</span> <span className="text-[#f425af]">INF</span> - Migrating database schema (12/12)</div>
                            <div className="mb-1"><span className="text-slate-600">[2023-10-24 14:22:35]</span> <span className="text-[#39ff14]">SUC</span> - POST /api/v1/inventory/sync 201 Created</div>
                            <div className="mb-1"><span className="text-slate-600">[2023-10-24 14:22:38]</span> <span className="text-yellow-500">WRN</span> - Rate limit approaching for client-ip: 192.168.1.102</div>
                            <div className="mb-1"><span className="text-slate-600">[2023-10-24 14:22:42]</span> <span className="text-[#f425af]">INF</span> - Service 'Americana Frontend' scaling to 4 replicas</div>
                            <div className="flex gap-2 animate-pulse mt-2">
                                <span className="text-[#f425af] font-bold">root@americana-ops:~$</span>
                                <span className="w-2 h-4 bg-[#f425af] inline-block"></span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer Stats */}
            <footer className="h-10 bg-black border-t border-slate-800 flex items-center justify-between px-6 text-[10px] font-mono text-slate-500">
                <div className="flex items-center gap-6">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#39ff14]"></span> DB: CONNECTED</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#39ff14]"></span> REDIS: UP</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> REPLICAS: 4/5</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-slate-400">LATENCY: 12ms</span>
                    <span className="text-slate-400">LAST SYNC: JUST NOW</span>
                    <span className="text-[#f425af] font-bold">PROD-ENVIRONMENT</span>
                </div>
            </footer>
        </div>
    )
}
