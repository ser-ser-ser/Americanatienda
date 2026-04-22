'use client'

import { useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Loader2, Truck, MapPin, Globe, Info } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'

const shippingFormSchema = z.object({
    local_delivery_enabled: z.boolean().default(false),
    local_radius_km: z.coerce.number().min(0).max(100).default(5),
    local_base_price: z.coerce.number().min(0).default(0),
    national_shipping_enabled: z.boolean().default(false),
    national_flat_rate: z.coerce.number().min(0).default(0),
    free_shipping_threshold: z.coerce.number().min(0).default(0),
    active_providers: z.array(z.string()).default([]),
})

type ShippingFormValues = z.infer<typeof shippingFormSchema>

const PROVIDERS = [
    { id: 'uber', label: 'Uber Direct (Local)' },
    { id: 'dhl', label: 'DHL Express' },
    { id: 'fedex', label: 'FedEx' },
    { id: 'estafeta', label: 'Estafeta' },
]

interface ShippingSettingsProps {
    onSuccess?: () => void
}

export function ShippingSettings({ onSuccess }: ShippingSettingsProps) {
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const form = useForm<ShippingFormValues>({
        resolver: zodResolver(shippingFormSchema),
        defaultValues: {
            local_delivery_enabled: false,
            local_radius_km: 5,
            local_base_price: 0,
            national_shipping_enabled: false,
            national_flat_rate: 0,
            free_shipping_threshold: 0,
            active_providers: [],
        },
    })

    useEffect(() => {
        async function loadConfig() {
            try {
                const res = await fetch('/api/vendor/shipping-config')
                if (res.ok) {
                    const data = await res.json()
                    // If empty object (no config yet), defaults apply
                    if (data && data.store_id) {
                        form.reset({
                            local_delivery_enabled: data.local_delivery_enabled,
                            local_radius_km: data.local_radius_km,
                            local_base_price: data.local_base_price,
                            national_shipping_enabled: data.national_shipping_enabled,
                            national_flat_rate: data.national_flat_rate,
                            free_shipping_threshold: data.free_shipping_threshold,
                            active_providers: data.active_providers || [],
                        })
                    }
                }
            } catch (error) {
                console.error('Failed to load shipping config', error)
                toast.error('Could not load shipping settings')
            } finally {
                setIsLoading(false)
            }
        }
        loadConfig()
    }, [form])

    async function onSubmit(data: ShippingFormValues) {
        setIsSaving(true)
        try {
            const res = await fetch('/api/vendor/shipping-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (!res.ok) throw new Error('Failed to save')

            toast.success('Calculadora de envíos actualizada')
            if (onSuccess) onSuccess()
        } catch (error) {
            toast.error('Error al guardar la configuración')
            console.error(error)
        } finally {
            setIsLoading(false)
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Configuración de Logística</h3>
                <p className="text-sm text-slate-500">
                    Define cómo recibirán sus productos tus clientes.
                </p>
            </div>
            <Separator />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    {/* LOCAL DELIVERY */}
                    <Card className="border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <div className="p-2 w-fit rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-base">Entrega Local</CardTitle>
                                    <CardDescription>Para clientes en tu misma ciudad.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="local_delivery_enabled"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-white dark:bg-black/20">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Habilitar Entrega Local</FormLabel>
                                            <FormDescription>
                                                Permitir entregas rápidas en un radio cercano.
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {form.watch('local_delivery_enabled') && (
                                <div className="grid gap-4 md:grid-cols-2 animate-in slide-in-from-top-2 fade-in duration-300">
                                    <FormField
                                        control={form.control}
                                        name="local_radius_km"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Radio de Cobertura (km)</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input type="number" {...field} className="pl-9" />
                                                        <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                                                    </div>
                                                </FormControl>
                                                <FormDescription>Distancia máxima desde tu tienda.</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="local_base_price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tarifa Base Local ($)</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                                                        <Input type="number" {...field} className="pl-7" />
                                                    </div>
                                                </FormControl>
                                                <FormDescription>Costo fijo por envío local.</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* NATIONAL SHIPPING */}
                    <Card className="border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <div className="p-2 w-fit rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                                    <Globe className="w-5 h-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-base">Envío Nacional</CardTitle>
                                    <CardDescription>Para clientes en todo México.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="national_shipping_enabled"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-white dark:bg-black/20">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Habilitar envíos nacionales</FormLabel>
                                            <FormDescription>
                                                Enviar a cualquier estado de la república.
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {form.watch('national_shipping_enabled') && (
                                <div className="space-y-4 animate-in slide-in-from-top-2 fade-in duration-300">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="national_flat_rate"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Tarifa Plana Nacional ($)</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                                                            <Input type="number" {...field} className="pl-7" />
                                                        </div>
                                                    </FormControl>
                                                    <FormDescription>Cobrar lo mismo a todos los destinos.</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="free_shipping_threshold"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Envío Gratis desde ($)</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                                                            <Input type="number" {...field} className="pl-7" />
                                                        </div>
                                                    </FormControl>
                                                    <FormDescription>0 para desactivar envío gratis.</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="active_providers"
                                        render={() => (
                                            <FormItem>
                                                <div className="mb-4">
                                                    <FormLabel className="text-base">Paqueterías Preferidas</FormLabel>
                                                    <FormDescription>
                                                        Selecciona con qué servicios trabajas.
                                                    </FormDescription>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    {PROVIDERS.map((provider) => (
                                                        <FormField
                                                            key={provider.id}
                                                            control={form.control}
                                                            name="active_providers"
                                                            render={({ field }) => {
                                                                return (
                                                                    <FormItem
                                                                        key={provider.id}
                                                                        className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-white dark:bg-black/20"
                                                                    >
                                                                        <FormControl>
                                                                            <Checkbox
                                                                                checked={field.value?.includes(provider.id)}
                                                                                onCheckedChange={(checked) => {
                                                                                    return checked
                                                                                        ? field.onChange([...field.value, provider.id])
                                                                                        : field.onChange(
                                                                                            field.value?.filter(
                                                                                                (value) => value !== provider.id
                                                                                            )
                                                                                        )
                                                                                }}
                                                                            />
                                                                        </FormControl>
                                                                        <FormLabel className="font-normal cursor-pointer text-sm">
                                                                            {provider.label}
                                                                        </FormLabel>
                                                                    </FormItem>
                                                                )
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={isSaving} className="min-w-[150px] bg-[#FF007F] hover:bg-[#FF007F]/90 text-white">
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Truck className="mr-2 h-4 w-4" />
                                    Guardar Cambios
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
