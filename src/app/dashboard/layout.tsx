'use client'

import { NotificationBell } from '@/components/ui/notification-bell'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, ShoppingBag } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Suspense, useState, useEffect } from 'react'
import { useCart } from '@/context/cart-context'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const { cartCount, toggleCart } = useCart()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const isSpecialRoute = pathname?.startsWith('/dashboard/admin') ||
        pathname?.startsWith('/dashboard/vendor') ||
        pathname?.startsWith('/dashboard/chat')

    // For specialized portals (Admin/Vendor), we bypass the standard dashboard layout shell
    // to prevent nesting conflicts and interaction blocks.
    if (isSpecialRoute) {
        return <>{children}</>
    }

    // Default structure (for Buyer portal and general account pages)
    return (
        <div className="flex min-h-screen bg-black" suppressHydrationWarning>
            {/* Sidebar - only for standard dashboard routes */}
            {mounted && (
                <Suspense fallback={<div className="w-64 border-r border-white/10" />}>
                    <DashboardSidebar />
                </Suspense>
            )}

            <div className="flex-1 flex flex-col min-w-0 relative">
                {/* Header - only for standard dashboard routes */}
                {mounted && (
                    <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-40">
                        <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">
                            {pathname?.split('/').pop()?.replace(/-/g, ' ')}
                        </h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-zinc-400 hover:text-white"
                            onClick={toggleCart}
                        >
                            <ShoppingBag className="h-5 w-5" />
                        </Button>
                    </header>
                )}

                {/* Content */}
                <main className="flex-1 relative">
                    {children}
                </main>
            </div>
        </div>
    )
}
