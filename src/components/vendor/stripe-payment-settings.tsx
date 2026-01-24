'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, CreditCard, CheckCircle, ExternalLink } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function VendorStripeSettings() {
    const [loading, setLoading] = useState(false)
    const [storeId, setStoreId] = useState<string | null>(null)
    const [accountStatus, setAccountStatus] = useState<any>(null)
    const supabase = createClient()

    useEffect(() => {
        loadStoreId()
        checkStatus()
    }, [])

    const loadStoreId = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // Auto-detect vendor's store
            const { data: store } = await supabase
                .from('stores')
                .select('id, name')
                .eq('owner_id', user.id)
                .single()

            if (store) {
                setStoreId(store.id)
            } else {
                toast.error('No store found. Create a store first.')
            }
        } catch (error: any) {
            console.error('Load store error:', error)
        }
    }

    const checkStatus = async () => {
        if (!storeId) return

        try {
            const res = await fetch(`/api/vendor/stripe/status?storeId=${storeId}`)
            const data = await res.json()

            if (res.ok) {
                setAccountStatus(data)
            }
        } catch (error: any) {
            console.error('Status check error:', error)
        }
    }

    const handleConnectStripe = async () => {
        if (!storeId) {
            toast.error('No store found')
            return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/vendor/stripe/connect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ storeId })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Failed to connect Stripe')
            }

            toast.success('Redirecting to Stripe onboarding...')

            // Redirect to Stripe onboarding
            window.location.href = data.onboardingUrl
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-rose-500" />
                        Stripe Payment Gateway
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                        Connect your Stripe account to receive payments from customers
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {accountStatus?.connected ? (
                        <div className="space-y-4">
                            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                                    <span className="font-bold text-white">Connected to Stripe</span>
                                </div>
                                <div className="text-sm text-zinc-400 space-y-1">
                                    <p>Account ID: {accountStatus.accountId}</p>
                                    <p>Charges: {accountStatus.chargesEnabled ? '✅ Enabled' : '❌ Pending'}</p>
                                    <p>Payouts: {accountStatus.payoutsEnabled ? '✅ Enabled' : '❌ Pending'}</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    className="border-zinc-700 text-white hover:bg-zinc-800"
                                    onClick={checkStatus}
                                >
                                    Refresh Status
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-zinc-700 text-white hover:bg-zinc-800"
                                    onClick={() => window.open('https://dashboard.stripe.com', '_blank')}
                                >
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Open Stripe Dashboard
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="p-4 bg-zinc-800 border border-zinc-700 rounded-lg">
                                <p className="text-sm text-zinc-400">
                                    Connect your Stripe account to start receiving payments.
                                    You'll be redirected to Stripe to complete the onboarding process.
                                </p>
                            </div>

                            <Button
                                onClick={handleConnectStripe}
                                disabled={loading || !storeId}
                                className="bg-rose-600 hover:bg-rose-700"
                            >
                                {loading ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connecting...</>
                                ) : (
                                    <><CreditCard className="mr-2 h-4 w-4" /> Connect Stripe Account</>
                                )}
                            </Button>

                            {!storeId && (
                                <p className="text-xs text-rose-400">
                                    No store found. Create a store first to connect Stripe.
                                </p>
                            )}
                        </div>
                    )}

                    <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
                        <p className="text-xs text-zinc-500 font-bold mb-2">How it works:</p>
                        <ul className="text-xs text-zinc-400 space-y-1 list-disc list-inside">
                            <li>You receive 90% of each sale</li>
                            <li>Americana keeps 10% marketplace fee</li>
                            <li>Stripe charges ~2.9% + $0.30 per transaction</li>
                            <li>Payouts are automatic (weekly by default)</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
