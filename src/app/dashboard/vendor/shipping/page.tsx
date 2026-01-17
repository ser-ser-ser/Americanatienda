'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import {
    Truck,
    Plane,
    Package,
    Search,
    Filter,
    Download,
    MapPin,
    MoreVertical,
    Plus,
    Navigation,
    Bike,
    Clock,
    CheckCircle2,
    AlertCircle
} from 'lucide-react'
import { useVendor } from '@/providers/vendor-provider'
import Link from 'next/link'

export default function ShippingManagementPage() {
    const { activeStore } = useVendor()
    const [searchTerm, setSearchTerm] = useState('')

    // Mock Data mimicking the screenshot structure
    const orders = [
        {
            id: 'ORD-9921',
            buyer: 'Jonathan Harker',
            address: '124 Baker Street, London, UK',
            method: 'Uber Direct',
            type: 'local',
            status: 'Awaiting Label',
            amount: '$124.00'
        },
        {
            id: 'ORD-9844',
            buyer: 'Mina Murray',
            address: '45 High Street, Whitby, UK',
            method: 'Last-mile Van',
            type: 'local',
            status: 'In Transit',
            amount: '$89.50'
        },
        {
            id: 'ORD-9730',
            buyer: 'Arthur Holmwood',
            address: 'Ringwood Hall, Derbyshire',
            method: 'Express Courier',
            type: 'local',
            status: 'Delivered',
            amount: '$240.00'
        },
        {
            id: 'ORD-9612',
            buyer: 'Quincey Morris',
            address: '600 Congress Ave, Austin, TX',
            method: 'DHL Global',
            type: 'global',
            status: 'Pending',
            amount: '$450.00'
        },
        {
            id: 'ORD-9500',
            buyer: 'Lucy Westenra',
            address: 'Hillingham, London',
            method: 'FedEx Intl',
            type: 'global',
            status: 'Customs',
            amount: '$1,200.00'
        }
    ]

    const filteredOrders = orders.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.buyer.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-[#09090b] text-white p-6 md:p-10 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-white tracking-tight">Shipping Management</h1>
                        <p className="text-zinc-400 mt-1">Handle your active fulfillment pipeline and track real-time deliveries.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" size="icon" className="border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800">
                            <AlertCircle className="h-5 w-5" />
                        </Button>
                        <Button className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold">
                            <Plus className="mr-2 h-4 w-4" /> New Shipment
                        </Button>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-[#121217] border-zinc-800 p-2">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div className="h-10 w-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                                <Package className="h-5 w-5 text-cyan-500" />
                            </div>
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 font-mono text-xs">+12% vs LY</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-1">Total Active</div>
                            <div className="text-4xl font-bold font-mono">142</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#121217] border-zinc-800 p-2">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div className="h-10 w-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                                <TagIcon className="h-5 w-5 text-orange-500" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-1">Pending Labels</div>
                            <div className="text-4xl font-bold font-mono">28</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#121217] border-zinc-800 p-2">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div className="h-10 w-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                            </div>
                            <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 font-mono text-xs">-2%</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-1">Deliveries Today</div>
                            <div className="text-4xl font-bold font-mono">54</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Controls & Filters */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#121217] p-4 rounded-xl border border-zinc-800">
                    <Tabs defaultValue="local" className="w-full md:w-auto">
                        <TabsList className="bg-black border border-zinc-800">
                            <TabsTrigger value="local" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400">
                                Local Delivery (Uber/Last-mile)
                            </TabsTrigger>
                            <TabsTrigger value="global" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400">
                                Global Shipping (DHL/FedEx)
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                            <Input
                                placeholder="Search by Order ID, Buyer..."
                                className="pl-9 bg-black border-zinc-800 focus:border-cyan-500 h-10 w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" className="border-zinc-800 bg-black hover:bg-zinc-900 text-zinc-300">
                            <Filter className="mr-2 h-4 w-4" /> Filter
                        </Button>
                        <Button variant="outline" className="border-zinc-800 bg-black hover:bg-zinc-900 text-zinc-300">
                            <Download className="mr-2 h-4 w-4" /> Export
                        </Button>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-[#121217] rounded-xl border border-zinc-800 overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 bg-black/40 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        <div className="col-span-2">Order ID</div>
                        <div className="col-span-2">Buyer</div>
                        <div className="col-span-3">Destination</div>
                        <div className="col-span-2">Method</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-1 text-right">Actions</div>
                    </div>

                    <div className="divide-y divide-white/5">
                        {filteredOrders.map((order) => (
                            <div key={order.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors group">

                                {/* Order ID */}
                                <div className="col-span-2 font-mono text-sm text-zinc-300 group-hover:text-cyan-400 transition-colors">
                                    {order.id}
                                    <div className="text-[10px] text-zinc-600 block sm:hidden">{order.amount}</div>
                                </div>

                                {/* Buyer */}
                                <div className="col-span-2 text-sm font-bold text-white">
                                    {order.buyer}
                                </div>

                                {/* Destination */}
                                <div className="col-span-3 text-sm text-zinc-400 truncate">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="h-3 w-3 mt-1 text-zinc-600" />
                                        <span className="truncate">{order.address}</span>
                                    </div>
                                </div>

                                {/* Method */}
                                <div className="col-span-2 flex items-center gap-2 text-sm text-zinc-300">
                                    {order.type === 'local' ? <Bike className="h-4 w-4 text-blue-400" /> : <Plane className="h-4 w-4 text-orange-400" />}
                                    {order.method}
                                </div>

                                {/* Status */}
                                <div className="col-span-2">
                                    <Badge variant="outline" className={`
                                        border-0 px-2 py-1 font-bold text-[10px] uppercase tracking-wider
                                        ${order.status === 'Awaiting Label' ? 'bg-yellow-500/10 text-yellow-500' :
                                            order.status === 'In Transit' ? 'bg-blue-500/10 text-blue-500' :
                                                order.status === 'Delivered' ? 'bg-green-500/10 text-green-500' :
                                                    'bg-zinc-800 text-zinc-400'}
                                    `}>
                                        <div className="h-1.5 w-1.5 rounded-full bg-current mr-2 inline-block animate-pulse" />
                                        {order.status}
                                    </Badge>
                                </div>

                                {/* Actions */}
                                <div className="col-span-1 flex justify-end gap-2">
                                    {order.status === 'Awaiting Label' ? (
                                        <Button size="sm" className="h-8 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs">
                                            Generate Label
                                        </Button>
                                    ) : (
                                        <Button size="sm" variant="outline" className="h-8 border-zinc-700 hover:bg-zinc-800 text-xs">
                                            <Navigation className="mr-2 h-3 w-3" /> Track
                                        </Button>
                                    )}
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-500">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Footer */}
                    <div className="p-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500">
                        <div>Showing <span className="font-bold text-white">1-10</span> of <span className="font-bold text-white">142</span> orders</div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="h-7 border-zinc-800 bg-black text-zinc-400" disabled>Previous</Button>
                            <Button variant="outline" size="sm" className="h-7 border-zinc-800 bg-black text-zinc-400">Next</Button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

function TagIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
            <path d="M7 7h.01" />
        </svg>
    )
}
