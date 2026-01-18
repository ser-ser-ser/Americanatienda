'use client'

import { useState } from 'react'
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
import { Truck, CheckCircle2, AlertCircle, Copy, Power, ExternalLink } from 'lucide-react'
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

    const [selectedCarrier, setSelectedCarrier] = useState<Carrier | null>(null)
    const [apiKey, setApiKey] = useState('')
    const [apiSecret, setApiSecret] = useState('')
    const [isConnecting, setIsConnecting] = useState(false)

    const handleConnect = () => {
        setIsConnecting(true)
        // Simulate API check
        setTimeout(() => {
            setCarriers(prev => prev.map(c => c.id === selectedCarrier?.id ? { ...c, connected: true } : c))
            toast.success(`Connected to ${selectedCarrier?.name} Successfully`)
            setIsConnecting(false)
            setApiKey('')
            setApiSecret('')
            setSelectedCarrier(null)
            // Close dialog logic would be here if controlled fully
        }, 1500)
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
                        <p className="text-zinc-400 mt-1">Connect external carriers to automate fulfillment.</p>
                    </div>
                    <Button variant="outline" className="border-zinc-700 text-zinc-300">
                        View Documentation
                    </Button>
                </div>

                {/* Active Integrations Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-zinc-900/50 border-zinc-800 p-6 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-green-900/20 flex items-center justify-center text-green-500">
                            <Power className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-zinc-400 uppercase tracking-wider">System Status</p>
                            <h3 className="text-2xl font-bold text-white">Online</h3>
                        </div>
                    </Card>
                    <Card className="bg-zinc-900/50 border-zinc-800 p-6 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-[#ff007f]/20 flex items-center justify-center text-[#ff007f]">
                            <Truck className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Active Carriers</p>
                            <h3 className="text-2xl font-bold text-white">{carriers.filter(c => c.connected).length} / {carriers.length}</h3>
                        </div>
                    </Card>
                    <Card className="bg-zinc-900/50 border-zinc-800 p-6 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-blue-900/20 flex items-center justify-center text-blue-500">
                            <Copy className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-zinc-400 uppercase tracking-wider">API Requests</p>
                            <h3 className="text-2xl font-bold text-white">0</h3>
                        </div>
                    </Card>
                </div>

                {/* Carrier Grid */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        Available Integrations
                        <Badge variant="outline" className="border-zinc-700 text-zinc-500">v1.0.0</Badge>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {carriers.map(carrier => (
                            <Card key={carrier.id} className={`bg-black border ${carrier.connected ? 'border-green-900 bg-green-950/5' : 'border-zinc-800'} p-6 relative overflow-hidden group hover:border-zinc-600 transition-colors`}>

                                <div className="flex justify-between items-start mb-4">
                                    <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center p-2">
                                        {/* Fallback Icon if image fails, but usually these URLs work or we use Text */}
                                        <Truck className="h-6 w-6 text-black" />
                                    </div>
                                    {carrier.connected ? (
                                        <Badge className="bg-green-500 text-black font-bold hover:bg-green-600">Connected</Badge>
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
                                            {carrier.connected ? 'Manage Settings' : 'Connect'}
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-[#111] border-zinc-800 text-white">
                                        <DialogHeader>
                                            <DialogTitle className="flex items-center gap-2">
                                                Connect {carrier.name}
                                                {carrier.type === 'last-mile' && <Badge className="bg-blue-600">Last Mile</Badge>}
                                            </DialogTitle>
                                            <DialogDescription>
                                                Enter your API credentials from the {carrier.name} developer portal.
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

                                            <div className="rounded-lg bg-blue-950/30 p-4 border border-blue-900/50 flex gap-3 text-xs text-blue-200">
                                                <AlertCircle className="h-4 w-4 shrink-0" />
                                                <p>
                                                    Need credential? <a href="#" className="underline font-bold">Create a {carrier.name} Account</a> to get your keys.
                                                </p>
                                            </div>
                                        </div>

                                        <DialogFooter>
                                            <Button
                                                onClick={handleConnect}
                                                disabled={!apiKey || isConnecting}
                                                className="bg-[#ff007f] hover:bg-[#d6006b] text-white w-full"
                                            >
                                                {isConnecting ? 'Verifying...' : `Connect ${carrier.name}`}
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
