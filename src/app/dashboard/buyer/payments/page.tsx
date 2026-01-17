'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard, ShieldCheck, AlertCircle } from 'lucide-react'

export default function BuyerPaymentsPage() {
    return (
        <div className="p-6 md:p-10 max-w-5xl mx-auto text-white">
            <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold mb-2">Payment Methods</h1>
                <p className="text-zinc-400">Manage your saved cards for faster checkout.</p>
            </div>

            <div className="grid gap-6">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-pink-500" />
                            Saved Cards
                        </CardTitle>
                        <CardDescription>
                            Your payment information is securely stored by Stripe. We do not hold your card details.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-12 border border-dashed border-zinc-800 rounded-lg bg-black/20">
                            <div className="h-16 w-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CreditCard className="h-8 w-8 text-zinc-600" />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-400 mb-2">No cards saved</h3>
                            <p className="text-zinc-500 max-w-md mx-auto mb-6">
                                You can save a card during your next checkout. For security reasons, adding a card directly from the dashboard is currently disabled.
                            </p>
                            <Button variant="outline" className="border-zinc-700 text-zinc-300 pointer-events-none opacity-50">
                                Add New Card (Coming Soon)
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-200 text-sm">
                    <ShieldCheck className="h-5 w-5 text-blue-400" />
                    Payments are processed securely via Stripe. All transactions are encrypted.
                </div>
            </div>
        </div>
    )
}
