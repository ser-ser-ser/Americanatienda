'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
    BookOpen,
    Crown,
    Image,
    GlassWater,
    Flame,
    Activity,
    LogOut,
    Plus
} from 'lucide-react'

export function AdminSidebar() {
    const pathname = usePathname()

    const isActive = (path: string) => pathname === path

    return (
        <aside className="w-72 border-r border-[#222222] bg-[#0a0a0a] flex flex-col shrink-0 z-50 h-screen font-sans">
            <div className="p-8 pb-4">
                <div className="flex items-center gap-4 mb-8">
                    {/* Pink Circle Logo (Restored) */}
                    <div className="relative flex items-center justify-center h-10 w-10 bg-black/50 rounded-xl border border-white/5">
                        <div className="h-4 w-4 bg-[#ff007f] rounded-full animate-pulse z-10 shadow-[0_0_10px_#ff007f]" />
                        <div className="absolute inset-0 bg-[#ff007f]/20 rounded-full animate-ping opacity-20" />
                    </div>
                    <div>
                        <h1 className="text-white text-base font-bold leading-tight tracking-tighter font-display">AMERICANA</h1>
                        <p className="text-[#ff007f] text-[10px] font-bold tracking-[0.3em] uppercase">Marketplace OS</p>
                    </div>
                </div>
            </div>

            {/* Scrollable Nav Area */}
            <div className="flex-1 overflow-y-auto px-6 space-y-8 custom-scrollbar">

                {/* DASHBOARD */}
                <NavItem href="/dashboard/admin" icon={<LayoutDashboard className="w-4 h-4" />} label="Command Center" active={isActive('/dashboard/admin')} />

                {/* PLATFORM */}
                <div>
                    <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4 pl-3">Platform</h3>
                    <div className="space-y-1">
                        <NavItem href="/dashboard/admin/cms" icon={<Layout className="w-4 h-4 text-[#ff007f]" />} label="Site Editor (CMS)" active={isActive('/dashboard/admin/cms')} />
                        <NavItem href="/dashboard/admin/site-config" icon={<Settings2 className="w-4 h-4" />} label="Americana Admin Settings" active={isActive('/dashboard/admin/site-config')} />

                        <NavItem href="/dashboard/admin/payments" icon={<CreditCard className="w-4 h-4" />} label="Payments" active={isActive('/dashboard/admin/payments')} />
                        <NavItem href="/dashboard/admin/logistics-hub" icon={<Truck className="w-4 h-4 text-emerald-500" />} label="Logistics Hub" active={isActive('/dashboard/admin/logistics-hub')} />
                        <NavItem href="/dashboard/admin/portals" icon={<Store className="w-4 h-4 text-pink-500" />} label="Stores Portals" active={isActive('/dashboard/admin/portals')} />
                        <NavItem href="/dashboard/admin/categories" icon={<LayoutDashboard className="w-4 h-4" />} label="Categories" active={isActive('/dashboard/admin/categories')} />
                        <NavItem href="/dashboard/admin/niche" icon={<Activity className="w-4 h-4" />} label="Niche" active={isActive('/dashboard/admin/niche')} />
                    </div>
                </div>

                {/* MANAGEMENT */}
                <div>
                    <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4 pl-3">Management</h3>
                    <div className="space-y-1">
                        <NavItem href="/dashboard/admin/roles" icon={<ShieldCheck className="w-4 h-4" />} label="Roles & Permissions" active={isActive('/dashboard/admin/roles')} />
                        <NavItem href="/dashboard/admin/teams" icon={<Users className="w-4 h-4 text-cyan-500" />} label="Store Teams & Delegation" active={isActive('/dashboard/admin/teams')} />
                        <NavItem href="/dashboard/admin/stores" icon={<Store className="w-4 h-4" />} label="Vendors / Approvals" active={isActive('/dashboard/admin/stores')} />
                        <NavItem href="/dashboard/admin/users" icon={<Users className="w-4 h-4" />} label="Buyers" active={isActive('/dashboard/admin/users')} />
                    </div>
                </div>

                {/* CONTENT */}
                <div>
                    <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4 pl-3">Content</h3>
                    <div className="space-y-1">
                        <NavItem href="/dashboard/admin/editorial" icon={<BookOpen className="w-4 h-4" />} label="Editorial" active={isActive('/dashboard/admin/editorial')} />
                        <NavItem href="/dashboard/admin/club" icon={<Crown className="w-4 h-4 text-amber-500" />} label="The Club" active={isActive('/dashboard/admin/club')} />
                        <NavItem href="/dashboard/admin/media" icon={<Image className="w-4 h-4" />} label="Media Library" active={isActive('/dashboard/admin/media')} />
                    </div>
                </div>

                {/* AMERICANA STORES */}
                <div>
                    <h3 className="text-[10px] font-bold text-[#ff007f] uppercase tracking-[0.2em] mb-4 pl-3">Americana Stores</h3>
                    <div className="px-3 space-y-3">
                        <StoreSwitcher />
                        <Link href="/dashboard/vendor">
                            <Button variant="outline" className="w-full justify-start border-[#ff007f]/50 text-[#ff007f] hover:bg-[#ff007f]/10 uppercase font-bold text-xs tracking-wider">
                                <Store className="mr-2 h-4 w-4" /> Go to Stores Admin
                            </Button>
                        </Link>
                    </div>
                </div>

            </div>

            {/* FOOTER */}
            <div className="p-6 border-t border-[#222]">
                <div className="space-y-1">
                    <NavItem href="/dashboard/admin/architecture" icon={<Activity className="w-4 h-4 text-green-500" />} label="System Health" active={isActive('/dashboard/admin/architecture')} />
                    <LogoutButton />
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

function NavItem({ href, icon, label, active, count }: { href: string, icon: React.ReactNode, label: string, active: boolean, count?: number }) {
    return (
        <Link
            href={href}
            className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg transition-all group",
                active ? "bg-[#111] text-white" : "text-zinc-500 hover:text-white hover:bg-[#111]"
            )}
        >
            <div className="flex items-center gap-3">
                <span className={cn("transition-colors", active ? "text-[#ff007f]" : "group-hover:text-white")}>
                    {icon}
                </span>
                <span className="text-xs font-bold tracking-wide">{label}</span>
            </div>
            {count !== undefined && (
                <span className="bg-[#ff007f] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    {count}
                </span>
            )}
        </Link>
    )
}

// Separate component for client-side logic to keep sidebar mostly clean if needed, 
// though regular button works fine here since we are 'use client'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

function LogoutButton() {
    const router = useRouter()
    const supabase = createClient()

    return (
        <button
            onClick={async () => {
                await supabase.auth.signOut()
                router.push('/login')
            }}
            className="w-full h-10 flex items-center px-3 rounded-lg text-xs font-bold text-zinc-500 hover:text-white hover:bg-white/5 transition-all group"
        >
            <LogOut className="w-4 h-4 mr-3 group-hover:text-red-500 transition-colors" />
            Logout
        </button>
    )
}

function StoreSwitcher() {
    const router = useRouter()

    return (
        <div className="space-y-2">
            <select
                className="w-full bg-[#111] border border-[#222] rounded-lg px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#ff007f] transition-all appearance-none cursor-pointer hover:bg-[#1a1a1a]"
                onChange={(e) => {
                    if (e.target.value) router.push(`/dashboard/vendor?store=${e.target.value}`)
                }}
                defaultValue=""
            >
                <option value="" disabled>Select Active Store...</option>
                <option value="the-lounge">The Lounge</option>
                <option value="the-red-room">The Red Room</option>
            </select>
            <Button variant="ghost" size="sm" className="w-full text-[10px] text-zinc-500 hover:text-[#ff007f] hover:bg-[#ff007f]/10 h-6 border border-dashed border-zinc-800">
                <Plus className="w-3 h-3 mr-1" /> Add New Store
            </Button>
        </div>
    )
}
