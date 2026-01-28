'use client'

import { NotificationBell } from '@/components/ui/notification-bell'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, ShoppingBag } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Suspense } from 'react'
import { useCart } from '@/context/cart-context'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const { cartCount, toggleCart } = useCart()

    // BYPASS: If we are in the Admin, Vendor or Chat section, let their respective layouts handle the full page structure.
    // This prevents "Double Sidebar" and "Nested Layout" issues.
    if (pathname?.startsWith('/dashboard/admin') || pathname?.startsWith('/dashboard/vendor') || pathname?.startsWith('/dashboard/chat')) {
        return <>{children}</>
    }

    return (
        <div className="flex min-h-screen bg-black relative z-10">
            <Suspense fallback={<div className="w-64 border-r border-white/10 bg-black/50" />}>
                <DashboardSidebar />
            </Suspense>
            <main className="flex-1 overflow-y-auto h-screen scrollbar-hide">
                <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-black/50 backdrop-blur-xl sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <div className="md:hidden font-bold text-white tracking-widest text-xs">AMERICANA</div>
                        <div className="hidden md:block relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-pink-500 transition-colors" />
                            <Input
                                placeholder="Search curated shops"
                                className="bg-white/5 border-white/10 rounded-lg pl-10 text-xs w-64 focus:ring-0 focus:border-white/20 transition-all text-white placeholder:text-zinc-600"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <NotificationBell />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-zinc-400 hover:text-white hover:bg-white/5 relative"
                            onClick={toggleCart}
                        >
                            <ShoppingBag className="h-5 w-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 h-4 w-4 bg-pink-500 rounded-full text-[9px] font-black text-white flex items-center justify-center border-2 border-black">
                                    {cartCount}
                                </span>
                            )}
                        </Button>
                    </div>
                </header>
                {children}
            </main>
        </div>
    )
}
