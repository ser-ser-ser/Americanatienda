'use client'

import Link from 'next/link'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
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
    Search,
    Truck,
    Shield,
    Bell,
    Lock,
    TrendingUp,
    Palette,
    MessageSquare,
    ShoppingCart
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useCart } from '@/context/cart-context'

export function DashboardSidebar() {
    const [store, setStore] = useState<any>(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [userRole, setUserRole] = useState<string | null>(null)
    const [user, setUser] = useState<any>(null)
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const supabase = createClient()
    const { cartCount, toggleCart } = useCart()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUser(user)
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

    // Hide standard sidebar on Admin Pages AND Vendor Pages (they use their own Sidebars)
    if (pathname?.startsWith('/dashboard/admin') || pathname?.startsWith('/dashboard/vendor')) {
        return null
    }

    return (
        <aside className="w-64 border-r border-white/10 bg-black/50 backdrop-blur-xl hidden md:flex flex-col h-screen sticky top-0">
            <div className="p-6 border-b border-white/5">
                <Link href="/" className="flex items-center gap-3 group">
                    {/* Store Logo or Brand Logo */}
                    {store?.logo_url ? (
                        <img src={store.logo_url} alt={store.name} className="h-10 w-10 rounded-lg object-cover" />
                    ) : (
                        <div className="flex items-center gap-3 pl-1">
                            <div className="relative flex items-center justify-center h-4 w-4">
                                <div className="h-3 w-3 bg-pink-500 rounded-full animate-pulse z-10" />
                                <div className="absolute inset-0 bg-pink-500/20 rounded-full animate-ping" />
                            </div>
                        </div>
                    )}
                    <div className="flex flex-col">
                        <span className="font-bold text-sm leading-none text-white tracking-wider group-hover:text-pink-500 transition-colors">
                            {store?.name || 'AMERICANA'}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-medium">MY ACCOUNT</span>
                    </div>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-1">


                {/* VENDOR LINKS - Visible to Sellers, Vendors, and Admins */}
                {(userRole === 'seller' || userRole === 'vendor' || isAdmin) && (
                    <div className="pt-4 mt-4 border-t border-white/5">
                        <p className="px-4 text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">My Store</p>

                        {/* OVERVIEW (Dashboard) */}
                        <Link href="/dashboard/vendor">
                            <Button variant="ghost" className={`w-full justify-start ${isActive('/dashboard/vendor') && !isActive('/dashboard/vendor/') ? 'text-cyan-500 bg-cyan-950/20' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                                <LayoutDashboard className="mr-3 h-5 w-5" /> Overview
                            </Button>
                        </Link>

                        <Link href="/dashboard/vendor/analytics">
                            <Button variant="ghost" className={`w-full justify-start ${isActive('/dashboard/vendor/analytics') ? 'text-cyan-500 bg-cyan-950/20' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                                <TrendingUp className="mr-3 h-5 w-5" /> Insights
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

                        <Link href="/dashboard/vendor/shipping">
                            <Button variant="ghost" className={`w-full justify-start ${isActive('/dashboard/vendor/shipping') ? 'text-primary bg-primary/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                                <Truck className="mr-3 h-5 w-5" /> Logistics
                            </Button>
                        </Link>

                        <Link href="/dashboard/vendor/payments">
                            <Button variant="ghost" className={`w-full justify-start ${isActive('/dashboard/vendor/payments') ? 'text-primary bg-primary/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                                <DollarSign className="mr-3 h-5 w-5" /> Payments
                            </Button>
                        </Link>

                        <Link href="/dashboard/chat">
                            <Button variant="ghost" className={`w-full justify-start ${isActive('/dashboard/chat') ? 'text-primary bg-primary/10' : 'text-zinc-400 hover:text-white hover:bg-white/5 relative'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 h-5 w-5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                Messages
                                {/* Notification Badge */}
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
                            </Button>
                        </Link>

                        <Link href="/dashboard/vendor/design">
                            <Button variant="ghost" className={`w-full justify-start ${isActive('/dashboard/vendor/design') ? 'text-[#ff007f] bg-[#ff007f]/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                                <Palette className="mr-3 h-5 w-5" /> Store Design
                            </Button>
                        </Link>

                        {/* STORE PORTAL (Video Cover capable) */}
                        <Link href="/dashboard/vendor/settings">
                            <Button variant="ghost" className={`w-full justify-start ${isActive('/dashboard/vendor/settings') ? 'text-[#ff007f] bg-[#ff007f]/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
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
                        {/* Simplified Admin Links for Context Switching */}
                        <Link href="/dashboard/admin/site-config">
                            <Button variant="ghost" className={`w-full justify-start ${isActive('/dashboard/admin/site-config') ? 'text-primary bg-primary/10' : 'text-zinc-600 hover:text-white hover:bg-white/5'}`}>
                                <Settings className="mr-3 h-5 w-5" /> Platform Configuration
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
                        {/* Added Shopping Cart explicitly */}
                        <button
                            onClick={toggleCart}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-md transition-all group"
                        >
                            <ShoppingCart className="h-5 w-5 group-hover:text-primary transition-colors" /> Cart
                            {cartCount > 0 && (
                                <span className="ml-auto h-5 px-1.5 rounded-full bg-primary text-[10px] font-black text-black flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                        <Link href="/dashboard/chat">
                            <Button variant="ghost" className={`w-full justify-start ${isActive('/dashboard/chat') ? 'text-primary bg-primary/10' : 'text-zinc-400 hover:text-white hover:bg-white/5 relative'}`}>
                                <MessageSquare className="mr-3 h-5 w-5" /> Messages
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
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

                {/* BUYER SECURITY & SETTINGS - Removed as requested, now inside Profile Settings page */}
            </nav>

            <div className="p-4 border-t border-white/5">
                <Link href="/dashboard/buyer/settings?tab=profile" className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-lg transition-colors group">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 border border-white/10 flex items-center justify-center shadow-inner group-hover:border-pink-500/50 transition-colors">
                        <span className="text-xs font-bold text-white">{user?.email?.[0]?.toUpperCase()}</span>
                    </div>
                    <div className="flex flex-col text-left overflow-hidden">
                        <span className="text-sm font-medium text-white truncate group-hover:text-pink-400 transition-colors">
                            {user?.user_metadata?.full_name || 'My Profile'}
                        </span>
                        <span className="text-[10px] text-zinc-500 truncate">Settings</span>
                    </div>
                </Link>

                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950/20 mt-2"
                    onClick={handleSignOut}
                >
                    <LogOut className="mr-3 h-4 w-4" /> Sign Out
                </Button>
            </div>
        </aside >
    )
}
