'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Truck, CheckCircle2, AlertCircle, Copy, Power, ExternalLink, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface Carrier {
    id: string
    name: string
    logo: string
    description: string
    connected: boolean
    type: 'last-mile' | 'national'
}

export default function LogisticsHubPage() {
    const [carriers, setCarriers] = useState<Carrier[]>([
        { id: 'borzo', name: 'Borzo', type: 'last-mile', connected: false, description: 'Same-day delivery for urban areas. Ideal for food & retail.', logo: 'https://play-lh.googleusercontent.com/W2dDr5-7fQwL7lYhVfow9yM7gX9gQ62fQ8o0o0o0o0o0o0o0o0' },
        { id: 'uber', name: 'Uber Direct', type: 'last-mile', connected: false, description: 'Leverage the Uber network for fast local delivery.', logo: 'https://logo.clearbit.com/uber.com' },
        { id: 'fedex', name: 'FedEx', type: 'national', connected: false, description: 'Reliable national and international shipping.', logo: 'https://logo.clearbit.com/fedex.com' },
        { id: 'dhl', name: 'DHL Express', type: 'national', connected: false, description: 'Global leader in logistics and express delivery.', logo: 'https://logo.clearbit.com/dhl.com' },
        { id: 'soloenvios', name: 'SoloEnvios', type: 'national', connected: false, description: 'Multi-carrier aggregator. Best rates for Mexico.', logo: 'https://soloenvios.com/wp-content/uploads/2021/06/SoloEnvios-Logo-1.png' },
    ])

    const [config, setConfig] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [selectedCarrier, setSelectedCarrier] = useState<Carrier | null>(null)
    const [apiKey, setApiKey] = useState('')
    const [apiSecret, setApiSecret] = useState('')
    const [isConnecting, setIsConnecting] = useState(false)

    useEffect(() => {
        fetchConfig()
    }, [])

    const fetchConfig = async () => {
        try {
            const res = await fetch('/api/vendor/shipping-config')
            const data = await res.json()
            if (data && !data.error) {
                setConfig(data)
                // Sync carrier connection status
                const active = data.active_providers || []
                setCarriers(prev => prev.map(c => ({
                    ...c,
                    connected: active.includes(c.id)
                })))
            }
        } catch (error) {
            console.error('Failed to fetch shipping config:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleConnect = async () => {
        if (!selectedCarrier) return
        setIsConnecting(true)

        try {
            const activeProviders = [...(config?.active_providers || [])]
            if (!activeProviders.includes(selectedCarrier.id)) {
                activeProviders.push(selectedCarrier.id)
            }

            const updatedMetadata = {
                ...(config?.carrier_metadata || {}),
                [`${selectedCarrier.id}_key`]: apiKey,
                [`${selectedCarrier.id}_secret`]: apiSecret,
            }

            const res = await fetch('/api/vendor/shipping-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...config,
                    active_providers: activeProviders,
                    carrier_metadata: updatedMetadata,
                    // Enable the relevant mode if first provider of its type
                    local_delivery_enabled: selectedCarrier.type === 'last-mile' ? true : config?.local_delivery_enabled,
                    national_shipping_enabled: selectedCarrier.type === 'national' ? true : config?.national_shipping_enabled,
                })
            })

            if (res.ok) {
                toast.success(`Integración con ${selectedCarrier.name} activada`)
                await fetchConfig()
                setApiKey('')
                setApiSecret('')
                setSelectedCarrier(null)
            } else {
                toast.error('Error al guardar la configuración')
            }
        } catch (error) {
            toast.error('Error de conexión')
        } finally {
            setIsConnecting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-[#ff007f] animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            <Truck className="h-8 w-8 text-[#ff007f]" /> Logistics Control Tower
                        </h1>
                        <p className="text-zinc-400 mt-1">Gestión de transportistas y automatización de envíos de Americana.</p>
                    </div>
                </div>

                {/* Active Integrations Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-zinc-900/50 border-zinc-800 p-6 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-green-900/20 flex items-center justify-center text-green-500">
                            <Power className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Estado del Sistema</p>
                            <h3 className="text-2xl font-bold text-white">Online</h3>
                        </div>
                    </Card>
                    <Card className="bg-zinc-900/50 border-zinc-800 p-6 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-[#ff007f]/20 flex items-center justify-center text-[#ff007f]">
                            <Truck className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Transportistas Activos</p>
                            <h3 className="text-2xl font-bold text-white">{carriers.filter(c => c.connected).length} / {carriers.length}</h3>
                        </div>
                    </Card>
                </div>

                {/* Carrier Grid */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        Integraciones Disponibles
                        <Badge variant="outline" className="border-zinc-700 text-zinc-500">v1.1.0 - Americana Bridge</Badge>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {carriers.map(carrier => (
                            <Card key={carrier.id} className={`bg-black border ${carrier.connected ? 'border-green-900 bg-green-950/5' : 'border-zinc-800'} p-6 relative overflow-hidden group hover:border-zinc-600 transition-colors`}>

                                <div className="flex justify-between items-start mb-4">
                                    <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center p-2 relative">
                                        <Image src={carrier.logo} alt={carrier.name} fill className="object-contain p-1 opacity-80 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    {carrier.connected ? (
                                        <Badge className="bg-green-500 text-black font-bold hover:bg-green-600 animate-pulse">Connected</Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-zinc-500 border-zinc-700">Not Configured</Badge>
                                    )}
                                </div>

                                <h3 className="text-lg font-bold text-white mb-2">{carrier.name}</h3>
                                <p className="text-sm text-zinc-400 mb-6 h-10">{carrier.description}</p>

                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant={carrier.connected ? "outline" : "default"}
                                            className={`w-full ${carrier.connected ? 'border-green-800 text-green-500 hover:bg-green-950' : 'bg-white text-black hover:bg-zinc-200'}`}
                                            onClick={() => setSelectedCarrier(carrier)}
                                        >
                                            {carrier.connected ? 'Gestionar Conexión' : 'Conectar Portal'}
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-[#111] border-zinc-800 text-white">
                                        <DialogHeader>
                                            <DialogTitle className="flex items-center gap-2">
                                                Conectar con {carrier.name}
                                                {carrier.type === 'last-mile' && <Badge className="bg-blue-600">Last Mile</Badge>}
                                            </DialogTitle>
                                            <DialogDescription>
                                                Ingresa las credenciales API obtenidas del portal de desarrolladores de {carrier.name}.
                                            </DialogDescription>
                                        </DialogHeader>

                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label>API Key / Client ID</Label>
                                                <Input
                                                    value={apiKey}
                                                    onChange={e => setApiKey(e.target.value)}
                                                    className="bg-black border-zinc-800 font-mono"
                                                    placeholder="pk_live_..."
                                                />
                                            </div>
                                            {(carrier.id === 'soloenvios' || carrier.id === 'fedex') && (
                                                <div className="space-y-2">
                                                    <Label>Secret Key</Label>
                                                    <Input
                                                        type="password"
                                                        value={apiSecret}
                                                        onChange={e => setApiSecret(e.target.value)}
                                                        className="bg-black border-zinc-800 font-mono"
                                                        placeholder="sk_live_..."
                                                    />
                                                </div>
                                            )}

                                            <div className="rounded-lg bg-blue-950/30 p-4 border border-blue-900/50 flex gap-3 text-xs text-blue-200">
                                                <AlertCircle className="h-4 w-4 shrink-0" />
                                                <p>
                                                    ¿No tienes credenciales? <a href="#" className="underline font-bold">Crea una cuenta en {carrier.name}</a> para obtener tus llaves.
                                                </p>
                                            </div>
                                        </div>

                                        <DialogFooter>
                                            <Button
                                                onClick={handleConnect}
                                                disabled={!apiKey || isConnecting}
                                                className="bg-[#ff007f] hover:bg-[#d6006b] text-white w-full"
                                            >
                                                {isConnecting ? 'Verificando...' : `Confirmar Integración`}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>

                            </Card>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}

import Image from 'next/image'
