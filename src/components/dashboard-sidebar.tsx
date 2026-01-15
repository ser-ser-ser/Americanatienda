'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Settings,
    LogOut,
    Store,
    FolderOpen,
    BookOpen,
    User,
    DollarSign,
    MapPin,
    CreditCard,
    Heart,
    Search
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export function DashboardSidebar() {
    const [store, setStore] = useState<any>(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [userRole, setUserRole] = useState<string | null>(null)
    const router = useRouter()
    const pathname = usePathname()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                // Fetch Profile
                const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
                if (profile) {
                    setUserRole(profile.role)
                    if (profile.role === 'admin') setIsAdmin(true)

                    // Fetch Store if Vendor
                    if (profile.role === 'vendor' || profile.role === 'seller') {
                        const { data: storeData } = await supabase
                            .from('stores')
                            .select('name, logo_url')
                            .eq('owner_id', user.id)
                            .single()
                        if (storeData) setStore(storeData)
                    }
                }
            }
        }
        fetchData()
    }, [])

    const isActive = (path: string) => pathname === path

    return (
        <aside className="w-64 border-r border-white/10 bg-black/50 backdrop-blur-xl hidden md:flex flex-col h-screen sticky top-0">
            <div className="p-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                    {store?.logo_url ? (
                        <img src={store.logo_url} alt={store.name} className="h-10 w-10 rounded-lg object-cover" />
                    ) : (
                        <div className="h-10 w-10 text-white bg-primary rounded-lg flex items-center justify-center font-bold text-xl">
                            {isAdmin ? '🛡️' : '🐍'}
                        </div>
                    )}
                    <div className="overflow-hidden">
                        <h2 className="font-bold text-white tracking-tight truncate">
                            {store?.name || (isAdmin ? 'Admin Console' : 'Americanatienda')}
                        </h2>
                        <p className="text-xs text-zinc-500 uppercase tracking-wider">
                            {isAdmin ? 'System Admin' : ((userRole === 'vendor' || userRole === 'seller') ? 'Vendor Portal' : 'My Account')}
                        </p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                <Link href="/dashboard">
                    <Button variant="ghost" className={`w-full justify-start ${isActive('/dashboard') ? 'text-primary bg-primary/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                        <LayoutDashboard className="mr-3 h-5 w-5" /> Dashboard
                    </Button>
                </Link>

                {/* VENDOR LINKS - Visible to Sellers, Vendors, and Admins */}
                {(userRole === 'seller' || userRole === 'vendor' || isAdmin) && (
                    <div className="pt-4 mt-4 border-t border-white/5">
                        <p className="px-4 text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">My Store</p>
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
                        <Link href="/dashboard/vendor/payments">
                            <Button variant="ghost" className={`w-full justify-start ${isActive('/dashboard/vendor/payments') ? 'text-primary bg-primary/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                                <DollarSign className="mr-3 h-5 w-5" /> Payments
                            </Button>
                        </Link>
                        <Link href="/dashboard/vendor/settings">
                            <Button variant="ghost" className={`w-full justify-start ${isActive('/dashboard/vendor/settings') ? 'text-primary bg-primary/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                                <Settings className="mr-3 h-5 w-5" /> Store Portal
                            </Button>
                        </Link>
                        <Link href="/dashboard/vendor/profile">
                            <Button variant="ghost" className={`w-full justify-start ${isActive('/dashboard/vendor/profile') ? 'text-primary bg-primary/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                                <User className="mr-3 h-5 w-5" /> Visionary Profile
                            </Button>
                        </Link>
                    </div>
                )}

                {/* ADMIN LINKS */}
                {isAdmin && (
                    <div className="pt-4 mt-4 border-t border-white/5">
                        <p className="px-4 text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">Platform Admin</p>
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
                                <Settings className="mr-3 h-5 w-5" /> Site Config
                            </Button>
                        </Link>
                    </div>
                )}

                {/* BUYER LINKS (Visible to everyone except when in specific vendor/admin modes, or generally available) */}
                {/* For now, active for standard users or if specifically in buyer mode. 
                    Simplification: If not admin/vendor specific dashboard active, show these? 
                    Or just show them as "My Account" section for everyone? */}
                {(!isAdmin && userRole !== 'seller' && userRole !== 'vendor') && (
                    <div className="pt-4 mt-4 border-t border-white/5">
                        <p className="px-4 text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">My Account</p>
                        <Link href="/shops">
                            <Button variant="ghost" className={`w-full justify-start ${isActive('/shops') ? 'text-primary bg-primary/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                                <Search className="mr-3 h-5 w-5" /> Explore Stores
                            </Button>
                        </Link>
                        <Link href="/favorites">
                            <Button variant="ghost" className={`w-full justify-start ${isActive('/favorites') ? 'text-primary bg-primary/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                                <Heart className="mr-3 h-5 w-5" /> Favorites
                            </Button>
                        </Link>
                        <Link href="/dashboard/buyer">
                            <Button variant="ghost" className={`w-full justify-start ${isActive('/dashboard/buyer') || isActive('/dashboard') ? 'text-primary bg-primary/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                                <ShoppingBag className="mr-3 h-5 w-5" /> My Orders
                            </Button>
                        </Link>
                        <Link href="/dashboard/buyer/addresses">
                            <Button variant="ghost" className={`w-full justify-start ${isActive('/dashboard/buyer/addresses') ? 'text-primary bg-primary/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                                <MapPin className="mr-3 h-5 w-5" /> Addresses
                            </Button>
                        </Link>
                        <Link href="/dashboard/buyer/payments">
                            <Button variant="ghost" className={`w-full justify-start ${isActive('/dashboard/buyer/payments') ? 'text-primary bg-primary/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                                <CreditCard className="mr-3 h-5 w-5" /> Payment Methods
                            </Button>
                        </Link>
                    </div>
                )}
            </nav>

            <div className="p-4 border-t border-white/5">
                <Link href={(userRole === 'vendor' || userRole === 'seller') ? "/dashboard/vendor/settings" : "/dashboard/settings"}>
                    <Button variant="ghost" className={`w-full justify-start ${isActive('/dashboard/settings') || isActive('/dashboard/vendor/settings') ? 'text-primary bg-primary/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                        <Settings className="mr-3 h-5 w-5" /> {(userRole === 'vendor' || userRole === 'seller') ? 'Store Settings' : 'Account Settings'}
                    </Button>
                </Link>
                <Button onClick={handleSignOut} variant="ghost" className="w-full justify-start text-red-500 hover:text-red-400 hover:bg-red-500/10 mt-2">
                    <LogOut className="mr-3 h-5 w-5" /> Sign Out
                </Button>
            </div>
        </aside>
    )
}
