'use client'

import React from 'react'
import LinkNext from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    LayoutDashboard,
    Layout,
    ShoppingBag,
    Package,
    Truck,
    CreditCard,
    Store,
    Settings2,
    Users,
    ShieldCheck,
    Activity,
    LogOut,
    Plus,
    Zap,
    ChevronDown,
    ChevronRight,
    Globe,
    Database,
    ShieldAlert,
    BarChart3,
    FileText,
    BookOpen,
    Crown,
    Image as ImageIcon,
    MessageSquare
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

const NAV_GROUPS = [
    {
        label: 'PLATFORM',
        iconColor: 'text-pink-500',
        items: [
            { href: '/dashboard/admin/stats', icon: BarChart3, label: 'Global Stats' },
            { href: '/dashboard/admin/finance', icon: CreditCard, label: 'Finance Matrix' },
        ]
    },
    {
        label: 'LOGISTICS & OPS',
        iconColor: 'text-emerald-500',
        items: [
            { href: '/dashboard/admin/logistics', icon: Truck, label: 'Logistics Hub' },
            { href: '/dashboard/admin/shipping', icon: Package, label: 'Shipping Registry' },
            { href: '/dashboard/admin/tracking-monitor', icon: Activity, label: 'Tracking Monitor' },
        ]
    },
    {
        label: 'ECOSYSTEM',
        iconColor: 'text-blue-500',
        items: [
            { href: '/dashboard/admin/categories', icon: LayoutDashboard, label: 'Global Categories' },
            { href: '/dashboard/admin/portals', icon: Store, label: 'Stores Portals' },
            { href: '/dashboard/admin/domain-registry', icon: Globe, label: 'Domain Registry' },
        ]
    },
    {
        label: 'MANAGEMENT',
        iconColor: 'text-amber-500',
        items: [
            { href: '/dashboard/admin/roles', icon: ShieldCheck, label: 'Roles & Permissions' },
            { href: '/dashboard/admin/stores', icon: Store, label: 'Vendors / Approvals' },
            { href: '/dashboard/admin/users', icon: Users, label: 'Buyer Accounts' },
            { href: '/dashboard/chat', icon: MessageSquare, label: 'Direct Messages' },
        ]
    },
    {
        label: 'CONTENT',
        iconColor: 'text-amber-500',
        items: [
            { href: '/dashboard/admin/editorial', icon: BookOpen, label: 'Editorial' },
            { href: '/dashboard/admin/club', icon: Crown, label: 'The Club' },
            { href: '/dashboard/admin/media', icon: ImageIcon, label: 'Media Library' },
        ]
    },
    {
        label: 'TECHNICAL',
        iconColor: 'text-cyan-500',
        items: [
            { href: '/dashboard/admin/api-registry', icon: Zap, label: 'Global API Registry' },
            { href: '/dashboard/admin/architecture', icon: Database, label: 'System Health' },
            { href: '/dashboard/admin/error-logs', icon: ShieldAlert, label: 'Error Logs' },
        ]
    }
]

export function AdminSidebar() {
    const pathname = usePathname()
    const isActive = (path: string) => pathname === path

    return (
        <aside className="w-72 border-r border-[#222222] bg-[#0a0a0a] flex flex-col shrink-0 z-50 h-screen font-sans">
            <div className="p-8 pb-4">
                <LinkNext href="/" className="flex items-center gap-4 mb-10 group">
                    <div className="relative flex items-center justify-center h-10 w-10 bg-black/50 rounded-xl border border-white/5 group-hover:border-[#ff007f]/50 transition-all">
                        <div className="h-4 w-4 bg-[#ff007f] rounded-full animate-pulse z-10 shadow-[0_0_10px_#ff007f]" />
                        <div className="absolute inset-0 bg-[#ff007f]/20 rounded-full animate-ping opacity-20" />
                    </div>
                    <div>
                        <h1 className="text-white text-base font-bold leading-tight tracking-tighter font-display uppercase">AMERICANA</h1>
                        <p className="text-[#ff007f] text-[10px] font-bold tracking-[0.3em] uppercase">Marketplace OS</p>
                    </div>
                </LinkNext>
            </div>

            <div className="flex-1 overflow-y-auto px-4 space-y-2 custom-scrollbar pb-10">
                {NAV_GROUPS.map((group) => (
                    <SidebarGroup key={group.label} group={group} pathname={pathname} />
                ))}

                <div className="pt-8">
                    <h3 className="text-[10px] font-bold text-[#ff007f] uppercase tracking-[0.2em] mb-4 pl-4">Americana Stores</h3>
                    <div className="px-2 space-y-3">
                        <StoreSwitcher />
                        <Button asChild variant="outline" className="w-full justify-start border-[#ff007f]/50 text-[#ff007f] hover:bg-[#ff007f]/10 uppercase font-bold text-[10px] tracking-widest h-9">
                            <LinkNext href="/dashboard/vendor">
                                <Store className="mr-2 h-3.5 w-3.5" /> Go to Stores Admin
                            </LinkNext>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="p-6 border-t border-[#222] bg-[#0d0d0d]">
                <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-white/5 border border-white/10 group cursor-default">
                    <div className="relative flex items-center justify-center h-10 w-10 bg-black rounded-lg border border-white/10">
                        <Users className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
                        <div className="absolute -top-1 -right-1 h-3 w-3 bg-[#ff007f] rounded-full border-2 border-black" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black text-white uppercase tracking-wider truncate">Master Admin</p>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest truncate">Level 05 Access</p>
                    </div>
                    <LogoutButton />
                </div>

                {/* Master Pulse Monitor */}
                <div className="p-3 rounded-xl bg-black/60 border border-[#ff007f]/20">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-[#ff007f] animate-pulse" />
                            <span className="text-[9px] font-black text-[#ff007f] uppercase tracking-widest">Master Pulse</span>
                        </div>
                        <span className="text-[8px] font-bold text-emerald-500 uppercase">Live</span>
                    </div>
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[7px] font-bold text-zinc-500 uppercase">
                            <span>API Cluster</span>
                            <span className="text-white">Active</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-[#ff007f] w-[88%] shadow-[0_0_5px_#ff007f]" />
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 0px;
                    background: transparent;
                }
            `}</style>
        </aside>
    )
}

function SidebarGroup({ group, pathname }: { group: any, pathname: string }) {
    const isAnyActive = group.items.some((item: any) => pathname === item.href)
    const [isOpen, setIsOpen] = React.useState(isAnyActive)

    React.useEffect(() => {
        if (isAnyActive) setIsOpen(true)
    }, [isAnyActive])

    return (
        <div className="space-y-1">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all group",
                    isOpen ? "text-white" : "text-zinc-500 hover:text-white"
                )}
            >
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{group.label}</span>
                {isOpen ? <ChevronDown className="w-3 h-3 text-zinc-600" /> : <ChevronRight className="w-3 h-3 text-zinc-600" />}
            </button>

            {isOpen && (
                <div className="space-y-1 pb-2">
                    {group.items.map((item: any) => {
                        const active = pathname === item.href
                        const Icon = item.icon
                        return (
                            <LinkNext
                                key={item.label}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-6 py-2 rounded-lg transition-all group",
                                    active ? "bg-[#111] text-white" : "text-zinc-500 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <Icon className={cn("w-4 h-4 transition-colors", active ? "text-[#ff007f]" : "group-hover:text-[#ff007f]")} />
                                <span className="text-[11px] font-bold uppercase tracking-wider">{item.label}</span>
                            </LinkNext>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

function LogoutButton() {
    const router = useRouter()
    const supabase = createClient()

    return (
        <button
            onClick={async () => {
                await supabase.auth.signOut()
                router.push('/login')
            }}
            className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
            title="Logout"
        >
            <LogOut className="w-4 h-4" />
        </button>
    )
}

function StoreSwitcher() {
    const router = useRouter()

    return (
        <div className="space-y-2">
            <select
                className="w-full bg-[#111] border border-[#222] rounded-xl px-3 py-2 text-[10px] font-bold text-white focus:outline-none focus:border-[#ff007f] transition-all appearance-none cursor-pointer hover:bg-[#1a1a1a] uppercase tracking-widest"
                onChange={(e) => {
                    if (e.target.value) router.push(`/dashboard/vendor?store=${e.target.value}`)
                }}
                defaultValue=""
            >
                <option value="" disabled>Active Store...</option>
                <option value="the-lounge">The Lounge</option>
                <option value="the-red-room">The Red Room</option>
            </select>
        </div>
    )
}
