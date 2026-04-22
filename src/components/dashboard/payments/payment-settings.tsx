'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Loader2, CreditCard, Bitcoin, Landmark, Save } from 'lucide-react'
import { toast } from 'sonner'
import { useVendor } from '@/providers/vendor-provider'

const paymentSchema = z.object({
    stripe_enabled: z.boolean(),
    mercadopago_enabled: z.boolean(),
    mercadopago_access_token: z.string().optional(),
    mercadopago_public_key: z.string().optional(),
    crypto_enabled: z.boolean(),
    crypto_wallet_address: z.string().optional(),
    bitso_api_key: z.string().optional(),
    manual_payment_enabled: z.boolean(),
    manual_method_name: z.string().optional(),
    manual_payment_instructions: z.string().optional(),
})

type PaymentFormValues = z.infer<typeof paymentSchema>

export function PaymentSettings() {
    const { activeStore } = useVendor()
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const form = useForm<PaymentFormValues>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            stripe_enabled: false,
            mercadopago_enabled: false,
            crypto_enabled: false,
            manual_payment_enabled: false,
        }
    })

    useEffect(() => {
        if (activeStore) {
            fetchConfig()
        }
    }, [activeStore])

    async function fetchConfig() {
        try {
            const res = await fetch(`/api/vendor/payment-config?storeId=${activeStore?.id}`)
            if (res.ok) {
                const data = await res.json()
                if (Object.keys(data).length > 0) {
                    form.reset(data)
                }
            }
        } catch (error) {
            toast.error('Failed to load payment settings')
        } finally {
            setIsLoading(false)
        }
    }

    async function onSubmit(data: PaymentFormValues) {
        if (!activeStore) return
        setIsSaving(true)
        try {
            const res = await fetch('/api/vendor/payment-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    storeId: activeStore.id,
                    ...data
                })
            })

            if (!res.ok) throw new Error('Failed to save')
            toast.success('Métodos de pago actualizados')
        } catch (error) {
            toast.error('Error al guardar configuración')
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs defaultValue="mercadopago" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 bg-[#121217] border border-zinc-800">
                        <TabsTrigger value="mercadopago" className="data-[state=active]:bg-zinc-800">Mercado Pago</TabsTrigger>
                        <TabsTrigger value="stripe" className="data-[state=active]:bg-zinc-800">Stripe</TabsTrigger>
                        <TabsTrigger value="crypto" className="data-[state=active]:bg-zinc-800">Cripto</TabsTrigger>
                        <TabsTrigger value="manual" className="data-[state=active]:bg-zinc-800">Manual (SWIFT)</TabsTrigger>
                    </TabsList>

                    {/* MERCADO PAGO */}
                    <TabsContent value="mercadopago">
                        <Card className="bg-[#121217] border-zinc-800">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <CreditCard className="text-cyan-400" /> Mercado Pago Integration
                                </CardTitle>
                                <CardDescription>Accept cards, cash, and bank transfers in Latam.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="mercadopago_enabled"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-zinc-800 p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base text-white">Enable Mercado Pago</FormLabel>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                {form.watch('mercadopago_enabled') && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                        <FormField
                                            control={form.control}
                                            name="mercadopago_public_key"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-white">Public Key</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} className="bg-black border-zinc-800 text-white" placeholder="TEST-..." />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="mercadopago_access_token"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-white">Access Token</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} type="password" className="bg-black border-zinc-800 text-white" placeholder="TEST-..." />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* STRIPE */}
                    <TabsContent value="stripe">
                        <Card className="bg-[#121217] border-zinc-800">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <CreditCard className="text-purple-400" /> Stripe Connect
                                </CardTitle>
                                <CardDescription>Global payments standard.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="stripe_enabled"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-zinc-800 p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base text-white">Enable Stripe</FormLabel>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                {form.watch('stripe_enabled') && (
                                    <Button variant="outline" className="w-full border-purple-500/50 text-purple-400 hover:bg-purple-500/10">
                                        Connect with Stripe
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* CRYPTO */}
                    <TabsContent value="crypto">
                        <Card className="bg-[#121217] border-zinc-800">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Bitcoin className="text-orange-400" /> Crypto & Bitso
                                </CardTitle>
                                <CardDescription>Accept Bitcoin, USDT, and Ethereum.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="crypto_enabled"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-zinc-800 p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base text-white">Enable Crypto</FormLabel>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                {form.watch('crypto_enabled') && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                        <FormField
                                            control={form.control}
                                            name="crypto_wallet_address"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-white">USDT/USDC Wallet Address (ERC20/TRC20)</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} className="bg-black border-zinc-800 text-white font-mono" placeholder="0x..." />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="bitso_api_key"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-white">Bitso API Key (Optional)</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} className="bg-black border-zinc-800 text-white" />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* MANUAL / SWIFT */}
                    <TabsContent value="manual">
                        <Card className="bg-[#121217] border-zinc-800">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Landmark className="text-green-400" /> Manual / Bank Transfer
                                </CardTitle>
                                <CardDescription>Payoneer, SWIFT, or Cash on Delivery.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="manual_payment_enabled"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-zinc-800 p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base text-white">Enable Manual Payment</FormLabel>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                {form.watch('manual_payment_enabled') && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                        <FormField
                                            control={form.control}
                                            name="manual_method_name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-white">Method Name</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} className="bg-black border-zinc-800 text-white" placeholder="e.g. Bank Transfer (SWIFT)" />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="manual_payment_instructions"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-white">Payment Instructions</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            className="bg-black border-zinc-800 text-white min-h-[100px]"
                                                            placeholder="Bank Name: XYZ&#10;Account: 123456&#10;SWIFT: ABCD..."
                                                        />
                                                    </FormControl>
                                                    <FormDescription className="text-zinc-500">
                                                        These instructions will be shown to the customer at checkout.
                                                    </FormDescription>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end">
                    <Button type="submit" disabled={isSaving} className="bg-white text-black hover:bg-zinc-200">
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Payment Settings
                    </Button>
                </div>
            </form>
        </Form>
    )
}
