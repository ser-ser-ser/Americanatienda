'use client'

import React from 'react'

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
    Eye,
    Globe,
    ChevronDown,
    ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const NAV_ITEMS = [
    // Management
    { href: '/dashboard/vendor', icon: LayoutDashboard, label: 'Command Center', section: 'Management' },
    { href: '/dashboard/vendor/site-studio', icon: Globe, label: 'Site Studio', section: 'Management', iconColor: 'text-[#ff007f]' },
    { href: '/dashboard/vendor/products', icon: Package, label: 'Stock & Inventory', section: 'Management' },
    { href: '/dashboard/vendor/orders', icon: ShoppingBag, label: 'Orders', section: 'Management' },
    { href: '/dashboard/vendor/integrations', icon: Zap, label: 'Marketplace Connect', section: 'Management', iconColor: 'text-cyan-500' },
    { href: '/dashboard/vendor/team', icon: Users, label: 'Team & Access', section: 'Management', iconColor: 'text-cyan-500' },

    // Marketing & Growth (Sandwich Architecture)
    {
        label: 'Social Hub',
        icon: Users,
        iconColor: 'text-purple-500',
        section: 'Marketing & Growth',
        subItems: [
            { label: 'Conexiones (FB, IG, WA)', href: '/dashboard/vendor/marketing/social-hub' },
            { label: 'Mensajería CRM', href: '/dashboard/vendor/marketing/crm' },
        ]
    },
    {
        label: 'Tracking & Intelligence',
        icon: Activity,
        iconColor: 'text-cyan-500',
        section: 'Marketing & Growth',
        subItems: [
            { label: 'Omnichannel Tracking', href: '/dashboard/vendor/marketing/pixels' },
        ]
    },
    {
        label: 'SEO & Branding',
        icon: Globe,
        iconColor: 'text-green-500',
        section: 'Marketing & Growth',
        subItems: [
            { label: 'Metadatos y SEO Studio', href: '/dashboard/vendor/marketing/seo' },
            { label: 'Favicon y OG Assets', href: '/dashboard/vendor/marketing/seo?tab=assets' },
            { label: 'Custom Domains', href: '/dashboard/vendor/domains' },
        ]
    },
    {
        label: 'Ads Management',
        icon: CreditCard,
        iconColor: 'text-blue-500',
        section: 'Marketing & Growth',
        subItems: [
            { label: 'FB/IG Ads Manager', href: '/dashboard/vendor/marketing/ads' },
            { label: 'Reportes de ROAS', href: '/dashboard/vendor/marketing/ads/reports' },
        ]
    },

    // Operations
    { href: '/dashboard/chat', icon: MessageSquareIcon, label: 'Direct Messages', section: 'Operations', iconColor: 'text-[#ff007f]' },
    { href: '/dashboard/vendor/payments', icon: CreditCard, label: 'Finances', section: 'Operations' },
    { href: '/dashboard/vendor/shipping', icon: Truck, label: 'Logistics', section: 'Operations' },
    { href: '/dashboard/vendor/analytics', icon: Activity, label: 'Intelligence', section: 'Operations' },
]

function MessageSquareIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
    )
}

export function VendorSidebar() {
    const pathname = usePathname()
    const isActive = (path: string) => pathname === path

    return (
        <aside className="w-64 border-r border-white/5 bg-[#09090b] flex flex-col shrink-0 z-50 h-screen font-sans overflow-y-auto">
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

            <nav className="flex-1 px-4 space-y-6">
                {/* Management */}
                <div>
                    <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest pl-4 mb-2">Management</h3>
                    {NAV_ITEMS.filter(i => i.section === 'Management').map((item: any) => (
                        <SidebarLink key={item.label} item={item} active={item.href ? isActive(item.href) : false} />
                    ))}
                </div>

                {/* Marketing & Growth */}
                <div>
                    <h3 className="text-[10px] font-bold text-purple-500 uppercase tracking-widest pl-4 mb-2 flex items-center gap-2">
                        Marketing & Growth <span className="bg-purple-500/20 text-purple-400 text-[8px] px-1 rounded-sm">NEW</span>
                    </h3>
                    <div className="space-y-1">
                        {NAV_ITEMS.filter(i => i.section === 'Marketing & Growth').map((item: any) => (
                            <SidebarLink key={item.label} item={item} active={item.href ? isActive(item.href) : false} isAccordion={!!item.subItems} />
                        ))}
                    </div>
                </div>

                {/* Operations */}
                <div>
                    <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest pl-4 mb-2">Operations</h3>
                    {NAV_ITEMS.filter(i => i.section === 'Operations').map((item: any) => (
                        <SidebarLink key={item.label} item={item} active={item.href ? isActive(item.href) : false} />
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

function SidebarLink({ item, active, isAccordion }: { item: any, active: boolean, isAccordion?: boolean }) {
    const pathname = usePathname()
    const hasActiveChild = item.subItems?.some((sub: any) => pathname === sub.href)
    const [isOpen, setIsOpen] = React.useState(hasActiveChild)

    React.useEffect(() => {
        if (hasActiveChild) setIsOpen(true)
    }, [hasActiveChild])

    const Icon = item.icon

    if (isAccordion) {
        return (
            <div className="space-y-1">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all text-xs font-bold uppercase tracking-wider group",
                        (active || isOpen)
                            ? "bg-[#121217] text-white border border-white/5"
                            : "text-zinc-500 hover:text-white hover:bg-white/5"
                    )}
                >
                    <div className="flex items-center gap-3">
                        <span className={cn(item.iconColor || "text-zinc-500")}><Icon className="w-4 h-4" /></span>
                        {item.label}
                    </div>
                    {isOpen ? <ChevronDown className="w-3 h-3 text-zinc-500" /> : <ChevronRight className="w-3 h-3 text-zinc-500" />}
                </button>

                {isOpen && (
                    <div className="pl-11 space-y-1 relative">
                        <div className="absolute left-6 top-0 bottom-2 w-px bg-white/5" />
                        {item.subItems.map((sub: any) => {
                            const isSubActive = pathname === sub.href
                            return (
                                <LinkNext
                                    key={sub.label}
                                    href={sub.href}
                                    className={cn(
                                        "block text-[10px] py-1.5 font-bold uppercase tracking-wider transition-colors relative",
                                        isSubActive ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                                    )}
                                >
                                    {sub.label}
                                </LinkNext>
                            )
                        })}
                    </div>
                )}
            </div>
        )
    }

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
                active ? "text-cyan-500" : (item.iconColor || "group-hover:text-cyan-500")
            )}>
                <Icon className="w-4 h-4" />
            </span>
            {item.label}
        </LinkNext>
    )
}
