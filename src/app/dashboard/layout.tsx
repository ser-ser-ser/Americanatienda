'use client'

import { NotificationBell } from '@/components/ui/notification-bell'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, ShoppingBag } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    // BYPASS: If we are in the Admin section, let the AdminLayout handle the full page structure.
    // This prevents "Double Sidebar" and "Nested Layout" issues.
    if (pathname?.startsWith('/dashboard/admin')) {
        return <>{children}</>
    }

    return (
        <div className="flex min-h-screen bg-black">
            <DashboardSidebar />
            <main className="flex-1 overflow-y-auto h-screen">
                <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        {/* Mobile Toggle could go here */}
                        <div className="md:hidden font-bold text-white">AMERICANA</div>
                        <div className="hidden md:block relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                            <Input
                                placeholder="Search curated shops"
                                className="bg-white/5 border-white/10 rounded-lg pl-10 text-sm w-64 focus:ring-pink-500/20 focus:border-pink-500/50 transition-all text-white placeholder:text-zinc-600"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <NotificationBell />
                        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-white/5 relative">
                            <ShoppingBag className="h-5 w-5" />
                            {/* Badge could go here if cart has items */}
                        </Button>
                        {/* <UserNav />  - Leaving simple for now as requested */}
                    </div>
                </header>
                {children}
            </main>
        </div>
    )
}
