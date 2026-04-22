'use client'

import { useState, useEffect } from 'react'
import { ShippingRate, ShippingAddress } from '@/lib/shipping/types'
import { useCart } from '@/context/cart-context'
import { Card } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Truck, Zap, Clock, Loader2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ShippingSelectorProps {
    storeId: string
    address: ShippingAddress
}

export function ShippingSelector({ storeId, address }: ShippingSelectorProps) {
    const { setShippingTotal } = useCart()
    const [rates, setRates] = useState<ShippingRate[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedRate, setSelectedRate] = useState<string>('')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let mounted = true

        async function fetchRates() {
            setLoading(true)
            setError(null)
            try {
                const res = await fetch('/api/checkout/shipping-rates', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        storeId,
                        address,
                        items: [] // In future pass actual items for weight calc
                    })
                })

                if (!res.ok) throw new Error('Failed to fetch rates')

                const data = await res.json()
                if (mounted) {
                    setRates(data.rates || [])
                    // Auto-select first option if available
                    if (data.rates?.length > 0) {
                        const first = data.rates[0]
                        setSelectedRate(first.provider_id + '_' + first.service_name)
                        setShippingTotal(first.price)
                    } else {
                        setShippingTotal(0)
                        setError('No shipping options available for this address.')
                    }
                }
            } catch (err) {
                if (mounted) setError('Could not calculate shipping.')
            } finally {
                if (mounted) setLoading(false)
            }
        }

        if (storeId && address.postal_code) {
            fetchRates()
        }

        return () => { mounted = false }
    }, [storeId, address.postal_code, address.city, setShippingTotal])

    const handleSelect = (value: string) => {
        setSelectedRate(value)
        const rate = rates.find(r => (r.provider_id + '_' + r.service_name) === value)
        if (rate) {
            setShippingTotal(rate.price)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8 space-x-2 text-zinc-500">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Calculando envíos...</span>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center p-4 rounded-lg bg-red-500/10 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center">
                <Truck className="w-5 h-5 mr-2" />
                Método de Envío
            </h3>

            <RadioGroup value={selectedRate} onValueChange={handleSelect} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rates.map((rate, idx) => {
                    const id = rate.provider_id + '_' + rate.service_name
                    const isSelected = selectedRate === id

                    return (
                        <div key={idx} className="relative">
                            <RadioGroupItem value={id} id={id} className="peer sr-only" />
                            <Label
                                htmlFor={id}
                                className={cn(
                                    "flex flex-col justify-between p-4 h-full cursor-pointer transition-all duration-300",
                                    "bg-[#121217] border-2 rounded-xl",
                                    isSelected
                                        ? "border-[#FF007F] bg-[#FF007F]/5 shadow-[0_0_20px_rgba(255,0,127,0.3)]"
                                        : "border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900"
                                )}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center space-x-2">
                                        {rate.provider_id === 'uber' ? (
                                            <Zap className="w-5 h-5 text-yellow-400" />
                                        ) : (
                                            <Truck className="w-5 h-5 text-cyan-400" />
                                        )}
                                        <span className="font-bold text-white uppercase tracking-wider text-sm">
                                            {rate.provider_id === 'manual-local' ? 'Local' : rate.provider_id}
                                        </span>
                                    </div>
                                    <span className="font-mono font-bold text-white">
                                        ${rate.price.toFixed(2)}
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    <div className="text-sm font-medium text-zinc-300">
                                        {rate.service_name}
                                    </div>
                                    <div className="flex items-center text-xs text-zinc-500">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {rate.estimated_arrival || '2-5 días hábiles'}
                                    </div>
                                </div>

                                {isSelected && (
                                    <div className="absolute top-0 right-0 p-1.5 rounded-bl-lg bg-[#FF007F]">
                                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                    </div>
                                )}
                            </Label>
                        </div>
                    )
                })}
            </RadioGroup>
        </div>
    )
}
