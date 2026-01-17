'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { Loader2, ShieldAlert, Lock, Home, ChevronDown, Store as StoreIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { VendorProvider, useVendor } from '@/providers/vendor-provider'

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
            <div className="flex h-screen w-full flex-col items-center justify-center bg-black p-4 text-white">
                <div className="max-w-md text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-500">
                        <Lock className="h-8 w-8" />
                    </div>
                    <h1 className="mb-2 text-2xl font-bold">Application Under Review</h1>
                    <p className="mb-4 text-zinc-400">
                        Thanks for registering <strong>{activeStore?.name}</strong>! Our team is currently reviewing your application.
                    </p>

                    {/* Store Switcher for Pending State if they have others */}
                    {stores.length > 1 && (
                        <div className="mb-8 flex justify-center">
                            <select
                                className="bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm text-white"
                                value={activeStore?.id}
                                onChange={(e) => selectStore(e.target.value)}
                            >
                                {stores.map(s => (
                                    <option key={s.id} value={s.id}>{s.name} ({s.status})</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <Link href="/">
                        <Button variant="outline" className="border-zinc-800 text-white hover:bg-zinc-800 hover:text-white">
                            <Home className="mr-2 h-4 w-4" /> Return to Home
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
                    {stores.length > 1 && (
                        <div className="mb-8 flex justify-center">
                            <select
                                className="bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm text-white"
                                value={activeStore?.id}
                                onChange={(e) => selectStore(e.target.value)}
                            >
                                {stores.map(s => (
                                    <option key={s.id} value={s.id}>{s.name} ({s.status})</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <Button variant="destructive">Contact Support</Button>
                </div>
            </div>
        )
    }

    // Insert the Sticky Store Header if multiple stores exist (or always for consistency)
    return (
        <div className="flex flex-col min-h-screen">
            {stores.length > 1 && (
                <div className="bg-zinc-950 border-b border-white/5 py-2 px-6 flex justify-between items-center z-50 sticky top-0">
                    <div className="flex items-center gap-3">
                        <StoreIcon className="h-4 w-4 text-zinc-500" />
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest hidden md:inline">Current Store:</span>
                        <div className="relative group flex items-center gap-2">
                            {/* Select Store Dropdown */}
                            <div className="relative">
                                <select
                                    className="appearance-none bg-black border border-zinc-800 hover:border-zinc-600 rounded-lg pl-3 pr-8 py-1.5 text-sm text-white font-bold cursor-pointer transition-colors focus:outline-none focus:ring-1 focus:ring-pink-600"
                                    value={activeStore?.id || ''}
                                    onChange={(e) => selectStore(e.target.value)}
                                >
                                    {stores.map(s => (
                                        <option key={s.id} value={s.id}>
                                            {s.name} {s.status !== 'active' ? `(${s.status})` : ''}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                            </div>

                            {/* NEW: Add Store Button directly in Header */}
                            <Link href="/dashboard/vendor/setup">
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full border border-dashed border-zinc-700 hover:border-pink-500 hover:text-pink-500 text-zinc-500">
                                    <span className="text-lg font-light leading-none">+</span>
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* NEW: Back to Master Admin Link (Only visible if user has multiple roles or via logic, but here we add it as a utility) 
                        Note: We check if user is admin via a client-side check or just link to it. 
                        Since we are inside layout we might not have 'isAdmin' prop easily without context. 
                        But we can add a subtle link. 
                    */}
                    <Link href="/dashboard/admin">
                        <Button variant="ghost" size="sm" className="text-[10px] uppercase font-bold text-zinc-600 hover:text-white hover:bg-white/5">
                            <ShieldAlert className="mr-2 h-3 w-3" /> Master Admin
                        </Button>
                    </Link>
                </div>
            )}
            <div className="flex-1">
                {children}
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
