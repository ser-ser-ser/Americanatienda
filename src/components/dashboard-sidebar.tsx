'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, ShoppingBag, Package, Settings, LogOut, TrendingUp, Sparkles, Store, FolderOpen, BookOpen, LayoutTemplate } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export function DashboardSidebar() {
    const router = useRouter()
    const pathname = usePathname()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    const isActive = (path: string) => pathname === path

    return (
        <aside className="w-64 border-r border-white/10 bg-black/50 backdrop-blur-xl hidden md:flex flex-col h-screen sticky top-0">
            <div className="p-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 text-white bg-primary rounded-lg flex items-center justify-center font-bold text-xl">
                        ⚡️
                    </div>
                    <div>
                        <h2 className="font-bold text-white tracking-tight">ALT-Fashion</h2>
                        <p className="text-xs text-zinc-500 uppercase tracking-wider">Vendor Command</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                <Link href="/dashboard">
                    <Button variant="ghost" className={`w-full justify-start ${isActive('/dashboard') ? 'text-primary bg-primary/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                        <LayoutDashboard className="mr-3 h-5 w-5" /> Dashboard
                    </Button>
                </Link>

                {/* Vendor Tools */}
                <Link href="/dashboard/vendor">
                    <Button variant="ghost" className={`w-full justify-start ${isActive('/dashboard/vendor') && !isActive('/dashboard/vendor/') ? 'text-primary bg-primary/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                        <LayoutDashboard className="mr-3 h-5 w-5" /> Overview
                    </Button>
                </Link>
                <Link href="/dashboard/vendor/orders">
                    <Button variant="ghost" className={`w-full justify-start ${isActive('/dashboard/vendor/orders') ? 'text-primary bg-primary/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                        <ShoppingBag className="mr-3 h-5 w-5" /> Orders
                    </Button>
                </Link>
                <Link href="/dashboard/vendor/products">
                    <Button variant="ghost" className={`w-full justify-start ${isActive('/dashboard/vendor/products') ? 'text-primary bg-primary/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                        <Package className="mr-3 h-5 w-5" /> Products
                    </Button>
                </Link>
                <Link href="/dashboard/vendor/settings">
                    <Button variant="ghost" className={`w-full justify-start ${isActive('/dashboard/vendor/settings') ? 'text-primary bg-primary/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                        <Settings className="mr-3 h-5 w-5" /> My Store
                    </Button>
                </Link>

                {/* Admin Tools (Ideally protected by role check) */}
                <div className="pt-4 mt-4 border-t border-white/5">
                    <p className="px-4 text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">Admin</p>
                    <Link href="/dashboard/admin/categories">
                        <Button variant="ghost" className={`w-full justify-start ${isActive('/dashboard/admin/categories') ? 'text-primary bg-primary/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                            <FolderOpen className="mr-3 h-5 w-5" /> Categories
                        </Button>
                    </Link>
                    <Link href="/dashboard/admin/stores">
                        <Button variant="ghost" className={`w-full justify-start ${isActive('/dashboard/admin/stores') ? 'text-primary bg-primary/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                            <Store className="mr-3 h-5 w-5" /> Stores
                        </Button>
                    </Link>
                    <Link href="/dashboard/admin/editorial">
                        <Button variant="ghost" className={`w-full justify-start ${isActive('/dashboard/admin/editorial') ? 'text-primary bg-primary/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                            <BookOpen className="mr-3 h-5 w-5" /> Editorial
                        </Button>
                    </Link>
                    <Link href="/dashboard/admin/site-config">
                        <Button variant="ghost" className={`w-full justify-start ${isActive('/dashboard/admin/site-config') ? 'text-primary bg-primary/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                            <LayoutTemplate className="mr-3 h-5 w-5" /> Site Config
                        </Button>
                    </Link>
                </div>
            </nav>

            <div className="p-4 border-t border-white/5">
                <Link href="/dashboard/settings">
                    <Button variant="ghost" className={`w-full justify-start ${isActive('/dashboard/settings') ? 'text-primary bg-primary/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                        <Settings className="mr-3 h-5 w-5" /> Settings
                    </Button>
                </Link>
                <Button onClick={handleSignOut} variant="ghost" className="w-full justify-start text-red-500 hover:text-red-400 hover:bg-red-500/10 mt-2">
                    <LogOut className="mr-3 h-5 w-5" /> Sign Out
                </Button>
            </div>
        </aside>
    )
}
