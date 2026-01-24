'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { Loader2, ShieldAlert, Lock, Home, ChevronDown, Store as StoreIcon, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { VendorProvider, useVendor } from '@/providers/vendor-provider'
import { VendorSidebar } from '@/components/vendor/vendor-sidebar'

// This component handles the logic using the context
function VendorLayoutContent({ children }: { children: React.ReactNode }) {
    const { stores, activeStore, isLoading, selectStore } = useVendor()
    const pathname = usePathname()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading) {
            // If on setup page, don't redirect
            if (pathname === '/dashboard/vendor/setup') return

            // If no stores found, redirect to setup
            if (stores.length === 0) {
                router.replace('/dashboard/vendor/setup')
                return
            }
        }
    }, [isLoading, stores, pathname, router])


    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-black text-white">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
            </div>
        )
    }

    // Allow access to setup page always
    if (pathname === '/dashboard/vendor/setup') {
        return <>{children}</>
    }

    // Use activeStore status for gating
    const status = activeStore?.status

    if (status === 'pending') {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center bg-black p-4 text-white font-sans">
                <div className="max-w-md text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                        <Lock className="h-8 w-8" />
                    </div>
                    <h1 className="mb-2 text-2xl font-bold font-serif tracking-tight uppercase">Boutique Under Review</h1>
                    <p className="mb-4 text-zinc-400 text-sm">
                        Welcome to the elite tier. Your brand <strong>{activeStore?.name}</strong> is currently being vetted by our curators.
                    </p>

                    <div className="p-4 bg-zinc-900/50 rounded-xl border border-white/5 mb-8">
                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Estimated Review Time</div>
                        <div className="text-2xl font-bold font-mono text-cyan-500">24-48H</div>
                    </div>

                    <Link href="/">
                        <Button variant="outline" className="border-zinc-800 text-white hover:bg-white hover:text-black rounded-full font-bold uppercase text-[10px] tracking-widest px-8">
                            <Home className="mr-2 h-3 w-3" /> Return to Marketplace
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    if (status === 'suspended') {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center bg-black p-4 text-white">
                <div className="max-w-md text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                        <ShieldAlert className="h-8 w-8" />
                    </div>
                    <h1 className="mb-2 text-2xl font-bold">Account Suspended</h1>
                    <p className="mb-8 text-zinc-400">
                        The store <strong>{activeStore?.name}</strong> has been suspended.
                    </p>
                    <Button variant="destructive">Contact Support</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen w-full bg-black text-white font-sans overflow-hidden">
            <VendorSidebar />

            <div className="flex-1 flex flex-col min-w-0 bg-black relative">
                {/* Global Top Bar */}
                <header className="h-16 flex items-center justify-between border-b border-white/5 px-8 bg-black/50 backdrop-blur-xl z-40 shrink-0">
                    <div className="flex items-center gap-4">
                        <Badge variant="outline" className="border-cyan-500/30 text-cyan-500 text-[9px] font-bold uppercase px-2 h-5">
                            {activeStore?.status?.toUpperCase() || 'OFFLINE'}
                        </Badge>
                        <h2 className="text-zinc-500 text-[10px] font-bold tracking-[0.2em] uppercase">
                            Operational Command
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Store Selection Filter */}
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-[9px] font-bold text-zinc-500 leading-none mb-1 uppercase tracking-widest">Active Boutique</p>
                                <p className="text-xs font-bold text-white leading-none uppercase tracking-tight">{activeStore?.name}</p>
                            </div>
                            <select
                                className="appearance-none bg-zinc-900/50 border border-white/5 rounded-lg pl-3 pr-8 py-1.5 text-xs text-white font-bold cursor-pointer transition-all hover:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                value={activeStore?.id || ''}
                                onChange={(e) => selectStore(e.target.value)}
                            >
                                {stores.map(s => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="h-8 w-px bg-white/5"></div>

                        <Link href="/shops/[slug]" as={`/shops/${activeStore?.slug}`} target="_blank">
                            <Button variant="ghost" size="sm" className="text-[9px] uppercase font-bold text-zinc-400 hover:text-cyan-500 gap-2">
                                <Eye className="h-3.5 w-3.5" /> View Store
                            </Button>
                        </Link>
                    </div>
                </header>

                <main className="flex-1 overflow-auto relative custom-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default function VendorLayout({ children }: { children: React.ReactNode }) {
    return (
        <VendorProvider>
            <VendorLayoutContent>{children}</VendorLayoutContent>
        </VendorProvider>
    )
}
