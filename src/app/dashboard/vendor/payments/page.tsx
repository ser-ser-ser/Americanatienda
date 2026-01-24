'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import {
    Loader2,
    CreditCard,
    CheckCircle,
    LayoutDashboard,
    Settings,
    Wallet
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { useVendor } from '@/providers/vendor-provider'
import ConnectWrapper from '@/components/stripe/connect-wrapper'
import { PaymentSettings } from '@/components/dashboard/payments/payment-settings'
import {
    ConnectPayments,
    ConnectPayouts,
    ConnectBalances,
} from "@stripe/react-connect-js"

function VendorPaymentsContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { activeStore, isLoading: storeLoading, refreshStores } = useVendor()

    const [connecting, setConnecting] = useState(false)
    const [pageLoading, setPageLoading] = useState(true)
    const processedSuccess = useState(false) // Use state/ref to track execution

    // Derived state
    const isStripeConnected = !!activeStore?.stripe_account_id

    useEffect(() => {
        if (!storeLoading) setPageLoading(false)

        // Prevent double-firing or loops
        if (searchParams.get('success') === 'true' && !processedSuccess[0]) {
            processedSuccess[1](true) // Mark as processed immediately
            toast.success('Stripe onboarding completed!')

            // Execute logic
            refreshStores().then(() => {
                router.replace('/dashboard/vendor/payments')
            })
        }
    }, [searchParams, router, storeLoading, refreshStores, processedSuccess])

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
            <div className="flex h-full items-center justify-center p-8 bg-[#09090b]">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
            </div>
        )
    }

    if (!activeStore) {
        return <div className="p-8 text-zinc-500">No active store selected.</div>
    }

    return (
        <div className="min-h-screen bg-[#09090b] p-8 text-white relative z-10">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-serif font-bold tracking-tight">Finanzas & Pagos</h1>
                        <p className="text-zinc-400 mt-1">Gestiona tus métodos de cobro y visualiza tus ingresos.</p>
                    </div>
                    {isStripeConnected && (
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-sm font-medium text-green-500">Stripe Activo</span>
                        </div>
                    )}
                </div>

                {/* Main Tabs: Overview (Stripe) vs Settings (Config) */}
                <Tabs defaultValue="settings" className="space-y-6">
                    <TabsList className="bg-[#121217] border border-zinc-800 p-1 w-full md:w-auto grid grid-cols-2 md:inline-flex">
                        <TabsTrigger value="overview" className="data-[state=active]:bg-zinc-800">
                            <LayoutDashboard className="mr-2 h-4 w-4" /> Resumen & Stripe
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="data-[state=active]:bg-zinc-800">
                            <Settings className="mr-2 h-4 w-4" /> Configuración de Pagos
                        </TabsTrigger>
                    </TabsList>

                    {/* TAB: SETTINGS (ALL GATEWAYS) */}
                    <TabsContent value="settings" className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <PaymentSettings />
                    </TabsContent>

                    {/* TAB: OVERVIEW (STRIPE DASHBOARD) */}
                    <TabsContent value="overview" className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        {isStripeConnected ? (
                            <ConnectWrapper stripeAccountId={activeStore.stripe_account_id!}>
                                <div className="grid gap-6">
                                    {/* Custom Stats or Shortcuts could go here */}

                                    <Tabs defaultValue="balances" className="w-full">
                                        <div className="flex items-center justify-between mb-4">
                                            <TabsList className="bg-transparent p-0 gap-4 border-b border-zinc-800 w-full justify-start rounded-none h-auto">
                                                <TabsTrigger value="balances" className="rounded-none border-b-2 border-transparent data-[state=active]:border-white data-[state=active]:bg-transparent px-0 pb-2">Balances</TabsTrigger>
                                                <TabsTrigger value="payouts" className="rounded-none border-b-2 border-transparent data-[state=active]:border-white data-[state=active]:bg-transparent px-0 pb-2">Payouts</TabsTrigger>
                                                <TabsTrigger value="transactions" className="rounded-none border-b-2 border-transparent data-[state=active]:border-white data-[state=active]:bg-transparent px-0 pb-2">Transactions</TabsTrigger>
                                            </TabsList>
                                        </div>

                                        <TabsContent value="balances">
                                            <div className="bg-[#121217] border border-zinc-800 rounded-xl overflow-hidden p-1">
                                                <ConnectBalances />
                                            </div>
                                        </TabsContent>
                                        <TabsContent value="payouts">
                                            <div className="bg-[#121217] border border-zinc-800 rounded-xl overflow-hidden p-1">
                                                <ConnectPayouts />
                                            </div>
                                        </TabsContent>
                                        <TabsContent value="transactions">
                                            <div className="bg-[#121217] border border-zinc-800 rounded-xl overflow-hidden p-1">
                                                <ConnectPayments />
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </div>
                            </ConnectWrapper>
                        ) : (
                            <Card className="bg-[#121217] border-zinc-800">
                                <CardHeader>
                                    <div className="h-12 w-12 bg-[#635BFF]/20 rounded-lg flex items-center justify-center mb-4">
                                        <CreditCard className="h-6 w-6 text-[#635BFF]" />
                                    </div>
                                    <CardTitle className="text-white">Conectar con Stripe</CardTitle>
                                    <CardDescription>Para ver tus balances y transacciones de Stripe, necesitas conectar tu cuenta.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button onClick={handleConnectStripe} disabled={connecting} className="bg-[#635BFF] hover:bg-[#5851E1] text-white">
                                        {connecting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : 'Conectar Stripe Ahora'}
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default function VendorPaymentsPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center bg-[#09090b]"><Loader2 className="h-8 w-8 animate-spin text-zinc-500" /></div>}>
            <VendorPaymentsContent />
        </Suspense>
    )
}
