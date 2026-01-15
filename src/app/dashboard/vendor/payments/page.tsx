'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CreditCard, CheckCircle, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

export default function VendorPaymentsPage() {
    const supabase = createClient()
    const router = useRouter()
    const searchParams = useSearchParams()

    const [loading, setLoading] = useState(true)
    const [connecting, setConnecting] = useState(false)
    const [store, setStore] = useState<any>(null)
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        const checkStatus = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // Get store details
            const { data: storeData } = await supabase
                .from('stores')
                .select('*')
                .eq('owner_id', user.id)
                .single()

            if (storeData) {
                setStore(storeData)
                if (storeData.stripe_account_id) {
                    setIsConnected(true)
                }
            }
            setLoading(false)

            // Handle return from Stripe
            if (searchParams.get('success') === 'true') {
                toast.success('Stripe onboarding completed!')
                // Clear params
                router.replace('/dashboard/vendor/payments')
            }
        }

        checkStatus()
    }, [searchParams, router])

    const handleConnectStripe = async () => {
        setConnecting(true)
        try {
            const res = await fetch('/api/stripe/onboard', { method: 'POST' })
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

    const handleLoginToStripe = async () => {
        // TODO: Create a login link via API if needed, or just redirect to dashboard
        // For Express accounts, we usually generate a login link via API similar to onboarding
        toast.info('Redirecting to Stripe Dashboard...')
        // We reuse the onboard endpoint for now (Stripe handles login vs onboard automatically based on state)
        handleConnectStripe()
    }

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
            </div>
        )
    }

    return (
        <div className="p-8 max-w-5xl mx-auto text-white">
            <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold mb-2">Payments & Payouts</h1>
                <p className="text-zinc-400">Manage how you get paid and view your transaction history.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Connection Status Card */}
                <Card className="bg-zinc-900 border-zinc-800 md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            Payout Account
                            {isConnected ? (
                                <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">Active</Badge>
                            ) : (
                                <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20">Pending Setup</Badge>
                            )}
                        </CardTitle>
                        <CardDescription>
                            {isConnected
                                ? `Connected Stripe Account: ${store.stripe_account_id}`
                                : 'Connect a Stripe account to receive payouts from your sales.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isConnected ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-green-950/20 border border-green-900/50 rounded-lg flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold text-green-500">Ready for Payouts</h4>
                                        <p className="text-sm text-green-400/80">Your account is linked and verified. Payouts will be transferred automatically according to your Stripe settings.</p>
                                    </div>
                                </div>
                                <Button onClick={handleLoginToStripe} variant="outline" className="border-zinc-700 hover:bg-zinc-800 text-white w-full sm:w-auto">
                                    <ExternalLink className="mr-2 h-4 w-4" /> View Stripe Dashboard
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row gap-4 items-center p-6 bg-black/40 border border-white/5 rounded-xl">
                                    <div className="h-12 w-12 bg-[#635BFF] rounded-lg flex items-center justify-center shrink-0">
                                        <CreditCard className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="font-bold text-lg mb-1">Stripe Connect</h3>
                                        <p className="text-sm text-zinc-400">Securely link your bank account or debit card using Stripe to receive automated payouts.</p>
                                    </div>
                                    <Button
                                        onClick={handleConnectStripe}
                                        disabled={connecting}
                                        className="bg-[#635BFF] hover:bg-[#5851E1] text-white font-bold px-6 h-12 w-full sm:w-auto"
                                    >
                                        {connecting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : 'Connect Payouts'}
                                    </Button>
                                </div>
                                <p className="text-xs text-center text-zinc-500">
                                    By connecting your account, you agree to our Platform Services Agreement and the Stripe Connected Account Agreement.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Balance Summary (Placeholder until real data) */}
                <Card className="bg-zinc-900 border-zinc-800 opacity-60">
                    <CardHeader>
                        <CardTitle className="text-sm text-zinc-400">Available for Payout</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-white">$0.00</div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800 opacity-60">
                    <CardHeader>
                        <CardTitle className="text-sm text-zinc-400">Pending</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-zinc-500">$0.00</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
