'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { Loader2, ShieldAlert, Lock, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function VendorLayout({ children }: { children: React.ReactNode }) {
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [status, setStatus] = useState<string | null>(null)
    const [hasStore, setHasStore] = useState(false)
    const pathname = usePathname()
    const router = useRouter()

    useEffect(() => {
        const checkStatus = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // Get store status
            const { data: store, error } = await supabase
                .from('stores')
                .select('status')
                .eq('owner_id', user.id)
                .single()

            if (store) {
                setHasStore(true)
                setStatus(store.status)
            } else {
                setHasStore(false)
            }
            setLoading(false)
        }

        checkStatus()
    }, [])

    useEffect(() => {
        if (!loading) {
            // If on setup page, don't redirect
            if (pathname === '/dashboard/vendor/setup') return

            // If no store, redirect to setup
            if (!hasStore) {
                router.push('/dashboard/vendor/setup')
                return
            }

            // If pending/suspended, blocking is handled by valid status check below
        }
    }, [loading, hasStore, pathname, router])


    if (loading) {
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

    if (status === 'pending') {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center bg-black p-4 text-white">
                <div className="max-w-md text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-500">
                        <Lock className="h-8 w-8" />
                    </div>
                    <h1 className="mb-2 text-2xl font-bold">Application Under Review</h1>
                    <p className="mb-8 text-zinc-400">
                        Thanks for registering your store! Our team is currently reviewing your application.
                        You will receive an email once your store is approved.
                    </p>
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
                        Your vendor account has been suspended due to a violation of our terms.
                        Please contact support for more information.
                    </p>
                    <Button variant="destructive">Contact Support</Button>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
