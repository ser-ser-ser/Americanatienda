'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Loader2, CreditCard, CheckCircle } from 'lucide-react'

export default function StripeTestPage() {
    const [loading, setLoading] = useState(false)
    const [storeId, setStoreId] = useState('')
    const [connectUrl, setConnectUrl] = useState('')
    const [accountStatus, setAccountStatus] = useState<any>(null)

    const handleConnectStripe = async () => {
        if (!storeId) {
            toast.error('Enter a store ID first')
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

            setConnectUrl(data.onboardingUrl)
            toast.success('Stripe Connect URL generated!')

            // Open in new tab
            window.open(data.onboardingUrl, '_blank')
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const checkStatus = async () => {
        if (!storeId) {
            toast.error('Enter a store ID first')
            return
        }

        setLoading(true)
        try {
            const res = await fetch(`/api/vendor/stripe/status?storeId=${storeId}`)
            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Failed to check status')
            }

            setAccountStatus(data)
            toast.success('Status retrieved!')
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-zinc-950 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">🧪 Stripe Integration Test</h1>
                    <p className="text-zinc-500">Test Stripe Connect and payment flows</p>
                </div>

                {/* Stripe Connect Test */}
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-rose-500" />
                            Stripe Connect - Vendor Onboarding
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm text-zinc-400 mb-2 block">Store ID (UUID)</label>
                            <Input
                                placeholder="e.g., 550e8400-e29b-41d4-a716-446655440000"
                                value={storeId}
                                onChange={(e) => setStoreId(e.target.value)}
                                className="bg-zinc-800 border-zinc-700 text-white"
                            />
                            <p className="text-xs text-zinc-600 mt-1">
                                Get a Store ID from Supabase → stores table
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                onClick={handleConnectStripe}
                                disabled={loading || !storeId}
                                className="bg-rose-600 hover:bg-rose-700"
                            >
                                {loading ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                                ) : (
                                    <>Connect Stripe Account</>
                                )}
                            </Button>

                            <Button
                                onClick={checkStatus}
                                disabled={loading || !storeId}
                                variant="outline"
                                className="border-zinc-700 text-white hover:bg-zinc-800"
                            >
                                Check Status
                            </Button>
                        </div>

                        {connectUrl && (
                            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                                <p className="text-sm text-emerald-400 mb-2">✅ Onboarding URL Generated</p>
                                <a
                                    href={connectUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-zinc-400 hover:text-white break-all underline"
                                >
                                    {connectUrl}
                                </a>
                            </div>
                        )}

                        {accountStatus && (
                            <div className="p-4 bg-zinc-800 border border-zinc-700 rounded-lg space-y-2">
                                <p className="text-sm font-bold text-white">Account Status:</p>
                                {accountStatus.connected ? (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                                            <span className="text-sm text-white">Connected</span>
                                        </div>
                                        <div className="text-xs text-zinc-400 space-y-1">
                                            <p>Account ID: {accountStatus.accountId}</p>
                                            <p>Charges Enabled: {accountStatus.chargesEnabled ? '✅' : '❌'}</p>
                                            <p>Payouts Enabled: {accountStatus.payoutsEnabled ? '✅' : '❌'}</p>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-sm text-zinc-500">Not connected</p>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Links */}
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white text-sm">📚 Quick Links</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <a
                            href="https://dashboard.stripe.com/test/apikeys"
                            target="_blank"
                            className="block text-rose-400 hover:text-rose-300 underline"
                        >
                            Stripe Dashboard - API Keys
                        </a>
                        <a
                            href="https://dashboard.stripe.com/test/connect/accounts/overview"
                            target="_blank"
                            className="block text-rose-400 hover:text-rose-300 underline"
                        >
                            Stripe Dashboard - Connected Accounts
                        </a>
                        <a
                            href="https://dashboard.stripe.com/test/webhooks"
                            target="_blank"
                            className="block text-rose-400 hover:text-rose-300 underline"
                        >
                            Stripe Dashboard - Webhooks
                        </a>
                    </CardContent>
                </Card>

                {/* Instructions */}
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white text-sm">🧪 How to Test</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-zinc-400 space-y-3">
                        <div>
                            <p className="font-bold text-white mb-1">1. Get a Store ID:</p>
                            <p>Go to Supabase → Table Editor → `stores` table → Copy a UUID</p>
                        </div>
                        <div>
                            <p className="font-bold text-white mb-1">2. Click "Connect Stripe Account":</p>
                            <p>This will generate an onboarding link (opens in new tab)</p>
                        </div>
                        <div>
                            <p className="font-bold text-white mb-1">3. Fill Stripe form:</p>
                            <p>Use TEST data (any name, fake tax ID, etc.)</p>
                        </div>
                        <div>
                            <p className="font-bold text-white mb-1">4. Check Status:</p>
                            <p>Click "Check Status" to see if onboarding is complete</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
