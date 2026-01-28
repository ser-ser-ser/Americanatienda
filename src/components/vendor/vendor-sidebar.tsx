'use client'

import React from 'react'
import Link from 'next/image'
import { usePathname } from 'next/navigation'
import LinkNext from 'next/link'
import { cn } from '@/lib/utils'
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Settings,
    CreditCard,
    Truck,
    Zap,
    Users,
    Activity,
    ChevronLeft,
    LogOut,
    Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const NAV_ITEMS = [
    { href: '/dashboard/vendor', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Command Center' },
    { href: '/dashboard/vendor/products', icon: <Package className="w-4 h-4" />, label: 'Stock & Inventory' },
    { href: '/dashboard/vendor/orders', icon: <ShoppingBag className="w-4 h-4" />, label: 'Orders' },
    { href: '/dashboard/vendor/integrations', icon: <Zap className="w-4 h-4 text-cyan-500" />, label: 'Multichannel Hub' },
    { href: '/dashboard/vendor/team', icon: <Users className="w-4 h-4 text-cyan-500" />, label: 'Team & Access' },
    { href: '/dashboard/chat', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#ff007f]"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>, label: 'Direct Messages' },
    { href: '/dashboard/vendor/payments', icon: <CreditCard className="w-4 h-4" />, label: 'Finances' },
    { href: '/dashboard/vendor/shipping', icon: <Truck className="w-4 h-4" />, label: 'Logistics' },
    { href: '/dashboard/vendor/analytics', icon: <Activity className="w-4 h-4" />, label: 'Intelligence' },
]

export function VendorSidebar() {
    const pathname = usePathname()
    const isActive = (path: string) => pathname === path

    return (
        <aside className="w-64 border-r border-white/5 bg-[#09090b] flex flex-col shrink-0 z-50 h-screen font-sans">
            <div className="p-8 pb-10">
                <LinkNext href="/" className="flex items-center gap-3 group">
                    <div className="h-8 w-8 bg-cyan-500/10 rounded-lg border border-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/20 transition-all">
                        <div className="h-2 w-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_10px_#06b6d4]" />
                    </div>
                    <div>
                        <h1 className="text-white text-sm font-bold tracking-tighter uppercase">Americana</h1>
                        <p className="text-cyan-500 text-[9px] font-bold tracking-widest uppercase">Vendor OS</p>
                    </div>
                </LinkNext>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                <div className="mb-4">
                    <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest pl-4 mb-2">Management</h3>
                    {NAV_ITEMS.slice(0, 6).map((item) => (
                        <SidebarLink key={item.href} item={item} active={isActive(item.href)} />
                    ))}
                </div>

                <div>
                    <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest pl-4 mb-2">Operations</h3>
                    {NAV_ITEMS.slice(6).map((item) => (
                        <SidebarLink key={item.href} item={item} active={isActive(item.href)} />
                    ))}
                </div>
            </nav>

            <div className="p-4 border-t border-white/5">
                <LinkNext href="/dashboard/vendor/settings">
                    <Button variant="ghost" className="w-full justify-start text-zinc-500 hover:text-white hover:bg-white/5 font-bold text-xs uppercase tracking-widest gap-3">
                        <Settings className="w-4 h-4" /> Settings
                    </Button>
                </LinkNext>
                <div className="mt-4 p-4 rounded-xl bg-zinc-900/50 border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-bold text-zinc-500 uppercase">Current Tier</span>
                        <div className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                    </div>
                    <div className="text-xs font-bold text-white mb-3 tracking-tight">PLATINUM PARTNER</div>
                    <Button size="sm" variant="link" className="text-cyan-500 p-0 h-auto text-[9px] font-bold uppercase tracking-widest">Upgrade Hub <ChevronLeft className="h-3 w-3 rotate-180" /></Button>
                </div>
            </div>
        </aside>
    )
}

function SidebarLink({ item, active }: { item: typeof NAV_ITEMS[0], active: boolean }) {
    return (
        <LinkNext
            href={item.href}
            className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-xs font-bold uppercase tracking-wider group",
                active
                    ? "bg-[#121217] text-white border border-white/5"
                    : "text-zinc-500 hover:text-white hover:bg-white/5"
            )}
        >
            <span className={cn(
                "transition-colors",
                active ? "text-cyan-500" : "group-hover:text-cyan-500"
            )}>
                {item.icon}
            </span>
            {item.label}
        </LinkNext>
    )
}
