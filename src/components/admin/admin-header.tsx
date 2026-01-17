'use client'

import { Search, Bell, Settings, HelpCircle, ShieldAlert, Command } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function AdminHeader() {
    return (
        <header className="h-16 border-b border-[#222] bg-[#0a0a0a]/95 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-40">
            {/* Left: Breadcrumbs / Title */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-zinc-500">
                    <span className="text-[#0db9f2] font-bold font-mono tracking-wider">//</span>
                    <span className="text-xs font-bold tracking-widest uppercase">System Administration</span>
                </div>
            </div>

            {/* Center: Global Search */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8 relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-[#0db9f2] transition-colors" />
                <input
                    type="text"
                    placeholder="Global System Search (Users, Stores, TxIDs)..."
                    className="w-full bg-[#111] border border-[#222] rounded-lg pl-10 pr-12 py-2 text-sm text-white focus:outline-none focus:border-[#0db9f2]/50 focus:bg-black transition-all placeholder:text-zinc-700 font-mono"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <Command className="h-3 w-3 text-zinc-600" />
                    <span className="text-[10px] text-zinc-600 font-bold">K</span>
                </div>
            </div>

            {/* Right: Actions & Profile */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 pr-4 border-r border-[#222]">
                    <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white hover:bg-white/5">
                        <HelpCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white hover:bg-white/5 relative">
                        <Bell className="h-4 w-4" />
                        <span className="absolute top-2 right-2 h-2 w-2 bg-[#ff007f] rounded-full animate-pulse"></span>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white hover:bg-white/5">
                        <Settings className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-center gap-3 pl-2">
                    <div className="text-right hidden md:block">
                        <div className="text-xs font-bold text-white uppercase tracking-wider">Master Administrator</div>
                        <div className="flex items-center justify-end gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#ff007f] animate-pulse"></span>
                            <span className="text-[9px] text-[#ff007f] font-mono">LEVEL 05 ACCESS</span>
                        </div>
                    </div>
                    <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-[#ff007f] to-purple-600 flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(255,0,127,0.3)]">
                        <ShieldAlert className="h-4 w-4 text-white fill-white/20" />
                    </div>
                </div>
            </div>
        </header>
    )
}
