'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CreditCard, CheckCircle, ExternalLink, RefreshCw } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { useVendor } from '@/providers/vendor-provider'
import ConnectWrapper from '@/components/stripe/connect-wrapper'
import {
    ConnectPayments,
    ConnectPayouts,
    ConnectBalances,
    ConnectAccountOnboarding
} from "@stripe/react-connect-js"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function VendorPaymentsPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { activeStore, isLoading: storeLoading, refreshStores } = useVendor()

    const [connecting, setConnecting] = useState(false)
    const [pageLoading, setPageLoading] = useState(true)

    const isConnected = !!activeStore?.stripe_account_id

    useEffect(() => {
        if (!storeLoading) {
            setPageLoading(false)
        }

        if (searchParams.get('success') === 'true') {
            toast.success('Stripe onboarding completed!')
            refreshStores()
            router.replace('/dashboard/vendor/payments')
        }
    }, [searchParams, router, storeLoading, refreshStores])

    const handleConnectStripe = async () => {
        if (!activeStore) return
        setConnecting(true)
        try {
            const res = await fetch('/api/stripe/onboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ storeId: activeStore.id })
            })
            const data = await res.json()
            if (data.url) {
                window.location.href = data.url
            } else {
                throw new Error(data.error || 'Failed to get onboarding URL')
            }
        } catch (error: any) {
            toast.error(error.message)
            setConnecting(false)
        }
    }

    if (storeLoading || pageLoading) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
            </div>
        )
    }

    if (!activeStore) {
        return <div className="p-8 text-zinc-500">No active store selected. Please select a store from the menu.</div>
    }

    return (
        <div className="p-8 max-w-6xl mx-auto text-white">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold mb-2">Financial Command</h1>
                    <p className="text-zinc-400">Real-time payouts and balance tracking for <span className="text-white font-bold">{activeStore.name}</span>.</p>
                </div>
                {isConnected && (
                    <Badge variant="outline" className="w-fit border-green-500/30 text-green-500 bg-green-500/10 px-3 py-1">
                        <CheckCircle className="mr-2 h-3 w-3" /> Stripe Connected
                    </Badge>
                )}
            </div>

            {/* IF CONNECTED: SHOW EMBEDDED DASHBOARD */}
            {isConnected && activeStore.stripe_account_id ? (
                <ConnectWrapper stripeAccountId={activeStore.stripe_account_id}>
                    <Tabs defaultValue="overview" className="space-y-6">
                        <TabsList className="bg-zinc-900 border border-white/10 p-1">
                            <TabsTrigger value="overview">Overview & Balances</TabsTrigger>
                            <TabsTrigger value="payouts">Payouts</TabsTrigger>
                            <TabsTrigger value="history">Payments History</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-6">
                            <div className="grid gap-6">
                                <div className="bg-zinc-950 border border-white/10 rounded-xl overflow-hidden p-1">
                                    <ConnectBalances />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="payouts">
                            <div className="bg-zinc-950 border border-white/10 rounded-xl overflow-hidden p-1">
                                <ConnectPayouts />
                            </div>
                        </TabsContent>

                        <TabsContent value="history">
                            <div className="bg-zinc-950 border border-white/10 rounded-xl overflow-hidden p-1">
                                <ConnectPayments />
                            </div>
                        </TabsContent>
                    </Tabs>
                </ConnectWrapper>
            ) : (
                /* IF NOT CONNECTED: SHOW ONBOARDING CARD */
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="bg-zinc-900 border-zinc-800 md:col-span-2 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#635BFF] to-pink-500" />
                        <CardHeader>
                            <div className="h-12 w-12 bg-[#635BFF]/20 rounded-lg flex items-center justify-center mb-4">
                                <CreditCard className="h-6 w-6 text-[#635BFF]" />
                            </div>
                            <CardTitle className="text-2xl">Activate Payouts</CardTitle>
                            <CardDescription className="text-zinc-400 text-base">
                                Connect your bank account to start receiving automated payouts from your sales.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <ul className="space-y-3 text-zinc-300 text-sm">
                                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Secure daily or weekly payouts</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Real-time financial analytics dashboard</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Automated tax reporting</li>
                                </ul>
                                <Button
                                    onClick={handleConnectStripe}
                                    disabled={connecting}
                                    className="bg-[#635BFF] hover:bg-[#5851E1] text-white font-bold px-8 h-14 w-full sm:w-auto shadow-[0_0_30px_rgba(99,91,255,0.3)] transition-all hover:scale-105 text-lg"
                                >
                                    {connecting ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : 'Connect with Stripe'}
                                </Button>
                                <p className="text-xs text-zinc-500">
                                    By connecting, you agree to the Stripe Connected Account Agreement.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
