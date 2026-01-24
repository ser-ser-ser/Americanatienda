'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Globe,
    ShoppingBag,
    ArrowRight,
    RefreshCcw,
    CheckCircle2,
    AlertCircle,
    Zap,
    Link2
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

const INTEGRATIONS = [
    {
        id: 'mercadolibre',
        name: 'Mercado Libre',
        description: 'Sync your inventory and orders with LATAMs largest marketplace.',
        icon: 'https://http2.mlstatic.com/frontend-assets/ui-navigation/5.21.22/mercadolibre/logo__large_plus.png',
        color: 'bg-[#FFE600]',
        textColor: 'text-black',
        status: 'DISCONNECTED'
    },
    {
        id: 'amazon',
        name: 'Amazon Business',
        description: 'Sell globally. Automate price synchronization and FBA tracking.',
        icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
        color: 'bg-black',
        textColor: 'text-white',
        status: 'DISCONNECTED'
    },
    {
        id: 'tiendanube',
        name: 'Tiendanube / Nuvemshop',
        description: 'Import your existing store layout and products in one click.',
        icon: 'https://assets.tiendanube.com/images/branding/nuvemshop-logo.png',
        color: 'bg-[#5B39A0]',
        textColor: 'text-white',
        status: 'DISCONNECTED'
    },
    {
        id: 'wix',
        name: 'Wix eCommerce',
        description: 'Bridge your Wix catalog with Americana curated marketplace.',
        icon: 'https://upload.wikimedia.org/wikipedia/commons/7/76/Wix.com_website_logo.svg',
        color: 'bg-white',
        textColor: 'text-black',
        status: 'DISCONNECTED'
    }
]

export default function VendorIntegrationsPage() {
    const [connecting, setConnecting] = useState<string | null>(null)

    const handleConnect = (id: string) => {
        setConnecting(id)
        setTimeout(() => {
            setConnecting(null)
            toast.success(`Redirecting to ${id} OAuth...`)
        }, 1500)
    }

    return (
        <div className="p-8 bg-black min-h-screen text-white font-sans">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-[#ff007f]/20 p-2 rounded-lg border border-[#ff007f]/30">
                            <Zap className="h-5 w-5 text-[#ff007f]" />
                        </div>
                        <Badge variant="outline" className="text-[10px] font-bold tracking-widest uppercase border-[#ff007f]/50 text-[#ff007f]">Omnichannel Hub</Badge>
                    </div>
                    <h1 className="text-4xl font-serif font-bold tracking-tight mb-2">Marketplace Integrations</h1>
                    <p className="text-zinc-500 text-lg max-w-2xl">Connect your external stores to centralize inventory, orders, and fulfillment. Build once, sell everywhere.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {INTEGRATIONS.map((app) => (
                        <Card key={app.id} className="bg-zinc-900/50 border-zinc-800 hover:border-[#ff007f]/30 transition-all group">
                            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center p-2 bg-zinc-800 border border-white/5`}>
                                    <img src={app.icon} alt={app.name} className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-xl text-white">{app.name}</CardTitle>
                                        <Badge className="bg-zinc-800 text-zinc-500 border-0 text-[9px]">{app.status}</Badge>
                                    </div>
                                    <CardDescription className="text-zinc-400 text-xs line-clamp-1">{app.description}</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4 px-6 flex items-center justify-between">
                                <ul className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest space-y-1">
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-zinc-800" /> Stock Sync</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-zinc-800" /> Order Import</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-zinc-800" /> Unified Pricing</li>
                                </ul>
                                <Button
                                    onClick={() => handleConnect(app.id)}
                                    disabled={connecting === app.id}
                                    variant="outline"
                                    className="border-zinc-700 text-white hover:bg-white hover:text-black rounded-full text-xs font-bold px-6 h-10"
                                >
                                    {connecting === app.id ? 'Connecting...' : 'Connect Now'}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2 bg-gradient-to-br from-zinc-900 to-black border-zinc-800 p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Globe className="h-32 w-32 rotate-12" />
                        </div>
                        <div className="relative z-10 flex-1">
                            <h3 className="text-2xl font-serif font-bold mb-4 italic">The Bling Strategy</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                                Why manage five dashboards? Americana Hub acts as your central node. Any change to your stock here automatically ripples through to Amazon, Mercado Libre and your personal Tiendanube.
                            </p>
                            <div className="flex gap-4">
                                <div className="flex flex-col">
                                    <span className="text-3xl font-bold text-white">0s</span>
                                    <span className="text-[10px] font-bold text-zinc-600 uppercase">Sync Latency</span>
                                </div>
                                <div className="w-px bg-zinc-800 h-10" />
                                <div className="flex flex-col">
                                    <span className="text-3xl font-bold text-white">4</span>
                                    <span className="text-[10px] font-bold text-zinc-600 uppercase">Supported Channels</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-40 w-40 bg-zinc-800 rounded-3xl border border-white/5 flex items-center justify-center p-6 grayscale">
                            <RefreshingIcon />
                        </div>
                    </Card>

                    <Card className="bg-zinc-900/30 border-zinc-800 border-dashed p-6 flex flex-col items-center justify-center text-center">
                        <Link2 className="h-12 w-12 text-zinc-700 mb-4" />
                        <h4 className="font-bold text-white mb-2">Custom API Integration</h4>
                        <p className="text-zinc-500 text-xs mb-6">Built a custom store? Use our GraphQL API to bridge your backend.</p>
                        <Button variant="link" className="text-[#ff007f] text-[10px] font-bold uppercase tracking-widest p-0">Read Docs <ArrowRight className="ml-2 h-3 w-3" /></Button>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function RefreshingIcon() {
    return (
        <div className="relative">
            <RefreshCcw className="h-16 w-16 text-zinc-600 animate-spin-slow" />
            <div className="absolute inset-0 flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-zinc-400" />
            </div>
        </div>
    )
}
