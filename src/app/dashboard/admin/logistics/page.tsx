
'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Truck,
    ShieldCheck,
    Globe,
    MapPin,
    Plus,
    Activity,
    AlertCircle,
    CheckCircle2
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

const providers = [
    {
        id: 'soloenvios',
        name: 'SoloEnvíos',
        status: 'Active',
        type: 'Aggregator',
        carriers: ['DHL', 'Estafeta', 'FedEx'],
        lastSync: '5m ago',
        health: 100
    },
    {
        id: 'skydrops',
        name: 'Skydrops',
        status: 'Configuring',
        type: 'Aggregator',
        carriers: ['Paquetexpress', 'Redpack'],
        lastSync: 'N/A',
        health: 85
    },
    {
        id: 'uber',
        name: 'Uber Direct',
        status: 'Active',
        type: 'Last Mile',
        carriers: ['Local Courier'],
        lastSync: '10m ago',
        health: 98
    },
]

export default function LogisticsHubPage() {
    return (
        <div className="p-8 space-y-8 bg-zinc-950 min-h-screen text-white">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Logistics Control Tower</h1>
                    <p className="text-zinc-500">Manage global shipping providers and monitor delivery performance.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="border-zinc-800 text-white hover:bg-zinc-900 rounded-full">
                        System Health
                    </Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6">
                        <Plus className="mr-2 h-4 w-4" />
                        Connect Provider
                    </Button>
                </div>
            </div>

            {/* Provider Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {providers.map((provider) => (
                    <Card key={provider.id} className="bg-zinc-900 border-zinc-800 text-white hover:border-emerald-500/50 transition-all cursor-pointer group">
                        <CardHeader className="flex flex-row items-start justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    {provider.name}
                                    <Badge variant={provider.status === 'Active' ? 'default' : 'secondary'} className={provider.status === 'Active' ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/20' : 'bg-zinc-800 text-zinc-400'}>
                                        {provider.status}
                                    </Badge>
                                </CardTitle>
                                <CardDescription className="text-zinc-500 text-xs mt-1">{provider.type}</CardDescription>
                            </div>
                            <Activity className={`h-4 w-4 ${provider.health > 90 ? 'text-emerald-500' : 'text-amber-500'}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex flex-wrap gap-1">
                                    {provider.carriers.map(c => (
                                        <span key={c} className="text-[10px] px-2 py-0.5 bg-zinc-800 rounded text-zinc-400 border border-white/5">
                                            {c}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between text-[11px] text-zinc-500 border-t border-white/5 pt-4">
                                    <span>Global Coverage</span>
                                    <span className="text-white font-medium">92%</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px] text-zinc-500">
                                    <span>Sync Status</span>
                                    <span className="text-white font-medium">{provider.lastSync}</span>
                                </div>
                                <Button variant="ghost" className="w-full mt-2 border border-zinc-800 hover:bg-zinc-800 group-hover:border-emerald-500/30">
                                    Manage API Keys
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Live Shipments Monitor */}
                <Card className="bg-zinc-900 border-zinc-800 text-white">
                    <CardHeader>
                        <CardTitle className="text-lg">Live Dispatch Monitor</CardTitle>
                        <CardDescription className="text-zinc-500">Real-time status of all active platform shipments</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { id: "AM-7721", store: "The Red Room", destination: "Mexico City, MX", status: "In Transit", provider: "SoloEnvíos (DHL)" },
                                { id: "AM-7722", store: "Vapor Wave", destination: "Guadalajara, MX", status: "Delivered", provider: "Skydrops (FedEx)" },
                                { id: "AM-7723", store: "Amnesia Boutique", destination: "Monterrey, MX", status: "Exception", provider: "Uber Direct" },
                            ].map((shipment, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${shipment.status === 'In Transit' ? 'bg-cyan-500/10 text-cyan-500' : shipment.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                            <Truck className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-bold">{shipment.id}</p>
                                                <Badge variant="outline" className="text-[9px] uppercase tracking-tighter border-zinc-800 text-zinc-500">
                                                    {shipment.provider}
                                                </Badge>
                                            </div>
                                            <p className="text-[11px] text-zinc-400">{shipment.store} → {shipment.destination}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-xs font-bold ${shipment.status === 'In Transit' ? 'text-cyan-500' : shipment.status === 'Delivered' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                            {shipment.status}
                                        </p>
                                        <Button variant="link" className="h-auto p-0 text-[10px] text-zinc-500 hover:text-white">
                                            Track Order
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Logistics Intelligence */}
                <Card className="bg-zinc-900 border-zinc-800 text-white">
                    <CardHeader>
                        <CardTitle className="text-lg">Matrix Intel: Logistics</CardTitle>
                        <CardDescription className="text-zinc-500">Performance metrics and cost analysis</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                <p className="text-[10px] uppercase font-bold text-emerald-500 mb-1">Avg Delivery Time</p>
                                <p className="text-2xl font-bold tracking-tighter">1.8 Days</p>
                            </div>
                            <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                                <p className="text-[10px] uppercase font-bold text-cyan-500 mb-1">Success Rate</p>
                                <p className="text-2xl font-bold tracking-tighter">99.4%</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-1">Upcoming Integrations</h4>
                            <div className="space-y-1">
                                <div className="flex items-center justify-between p-2 text-xs text-zinc-500">
                                    <span className="flex items-center gap-2 italic">
                                        <AlertCircle className="h-3 w-3" /> Bitso Logistics Payment Gateway
                                    </span>
                                    <Badge className="bg-zinc-800 text-zinc-400">Backlog</Badge>
                                </div>
                                <div className="flex items-center justify-between p-2 text-xs text-zinc-500">
                                    <span className="flex items-center gap-2 italic">
                                        <AlertCircle className="h-3 w-3" /> AI Dispatch Optimization (v2)
                                    </span>
                                    <Badge className="bg-zinc-800 text-zinc-400">Backlog</Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
