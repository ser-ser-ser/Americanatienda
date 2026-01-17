'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Package,
    Truck,
    AlertTriangle,
    CheckCircle2,
    Search,
    RefreshCw,
    Download,
    MapPin,
    Plane,
    Ship,
    X,
    Phone
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminLogisticsPage() {
    const [selectedShipment, setSelectedShipment] = useState<any>(null)

    // Mock Data for UI Matching
    const shipments = [
        {
            id: '#AM-9921-2024',
            tracking: '12999AA1012345678',
            customer: 'Julianne Moore',
            location: 'New York, US',
            courier: 'FedEx Express',
            type: 'plane',
            status: 'transit', // ordered, transit, delivery, arrived
            progress: 65,
            eta: 'Today, 4:00 PM'
        },
        {
            id: '#AM-9844-2024',
            tracking: 'DHL-992233110',
            customer: 'Anders Kjellberg',
            location: 'Stockholm, SE',
            courier: 'DHL Global',
            type: 'plane',
            status: 'transit',
            progress: 40,
            eta: 'Oct 15, 10:00 AM'
        },
        {
            id: '#AM-9701-2024',
            tracking: 'UPS-44552233',
            customer: 'Lea Miller',
            location: 'London, UK',
            courier: 'UPS Priority',
            type: 'truck',
            status: 'delivery',
            progress: 85,
            eta: 'In 2 hours'
        }
    ]

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white font-sans p-8 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-pink-600/5 rounded-full blur-[120px] pointer-events-none" />

            {/* HEADER */}
            <div className="flex justify-between items-end mb-10 relative z-10">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-2 w-2 bg-pink-500 rounded-full animate-pulse" />
                        <span className="text-xs font-bold tracking-[0.2em] text-[#ff007f] uppercase">Global Operations</span>
                    </div>
                    <h1 className="text-5xl font-bold font-serif italic tracking-tighter text-white mb-2">LOGISTICS COMMAND</h1>
                    <p className="text-zinc-400 max-w-xl">Real-time tracking of global Americana shipments and last-mile delivery status.</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800">
                        <Download className="mr-2 h-4 w-4" /> Export Report
                    </Button>
                    <Button className="bg-[#ff007f] hover:bg-[#ff007f]/80 text-white font-bold px-6">
                        <RefreshCw className="mr-2 h-4 w-4" /> Sync Nodes
                    </Button>
                </div>
            </div>

            {/* KPI GRID */}
            <div className="grid grid-cols-4 gap-6 mb-12 relative z-10">
                <MetricCard
                    label="Active Shipments"
                    value="2,482"
                    change="+12%"
                    icon={<Package className="h-6 w-6 text-pink-500" />}
                />
                <MetricCard
                    label="In-Transit"
                    value="1,854"
                    change="+5%"
                    icon={<Truck className="h-6 w-6 text-pink-500" />}
                />
                <MetricCard
                    label="Delayed"
                    value="48"
                    change="-2%"
                    isNegative
                    icon={<AlertTriangle className="h-6 w-6 text-red-500" />}
                />
                <MetricCard
                    label="Delivered Today"
                    value="932"
                    change="+18%"
                    icon={<CheckCircle2 className="h-6 w-6 text-green-500" />}
                />
            </div>

            {/* MAIN LIST SECTION */}
            <div className="bg-[#111] border border-[#222] rounded-3xl overflow-hidden relative z-10">
                {/* List Header */}
                <div className="p-6 border-b border-[#222] flex justify-between items-center bg-[#151515]">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Live Operations Tracking</h2>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-zinc-500">Sort by:</span>
                        <select className="bg-black border border-zinc-800 rounded px-3 py-1 text-xs text-white focus:outline-none">
                            <option>Latest Updates</option>
                            <option>Priority</option>
                        </select>
                    </div>
                </div>

                {/* Column Headers */}
                <div className="grid grid-cols-12 gap-4 p-4 px-8 bg-[#0F0F0F] border-b border-[#222] text-[10px] font-bold uppercase tracking-widest text-[#ff007f]/70">
                    <div className="col-span-3">Order / Tracking</div>
                    <div className="col-span-2">Customer</div>
                    <div className="col-span-2">Courier</div>
                    <div className="col-span-4">Status Journey</div>
                    <div className="col-span-1 text-right">Action</div>
                </div>

                {/* List Rows */}
                <div className="divide-y divide-[#222]">
                    {shipments.map((item, idx) => (
                        <div key={idx} className="grid grid-cols-12 gap-4 p-6 px-8 items-center hover:bg-white/[0.02] transition-colors group">

                            {/* Order Info */}
                            <div className="col-span-3">
                                <div className="font-bold text-white text-lg font-mono tracking-tight">{item.id}</div>
                                <div className="text-xs text-[#ff007f] font-mono mt-1">{item.tracking}</div>
                            </div>

                            {/* Customer */}
                            <div className="col-span-2 flex items-center gap-3">
                                <div className="h-8 w-8 rounded bg-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-500">
                                    {item.customer.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-white">{item.customer}</div>
                                    <div className="text-xs text-zinc-500">{item.location}</div>
                                </div>
                            </div>

                            {/* Courier */}
                            <div className="col-span-2 flex items-center gap-3">
                                {item.type === 'plane' ? <Plane className="h-5 w-5 text-zinc-600" /> : <Truck className="h-5 w-5 text-zinc-600" />}
                                <div className="text-sm font-medium text-zinc-300">{item.courier}</div>
                            </div>

                            {/* Status Journey (Bar) */}
                            <div className="col-span-4 pr-8">
                                <div className="flex justify-between text-[10px] text-zinc-500 uppercase font-bold mb-2">
                                    <span className={item.progress > 0 ? 'text-[#ff007f]' : ''}>Ordered</span>
                                    <span className={item.progress > 33 ? 'text-[#ff007f]' : ''}>Transit</span>
                                    <span className={item.progress > 66 ? 'text-[#ff007f]' : ''}>Delivery</span>
                                    <span className={item.progress === 100 ? 'text-[#ff007f]' : ''}>Arrived</span>
                                </div>
                                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden relative">
                                    <div
                                        className="absolute top-0 left-0 h-full bg-[#ff007f] shadow-[0_0_10px_#ff007f]"
                                        style={{ width: `${item.progress}%` }}
                                    />
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <Badge variant="outline" className="border-[#ff007f]/30 text-[#ff007f] bg-[#ff007f]/10 text-[9px] px-1 h-4">
                                        ON TIME
                                    </Badge>
                                    <span className="text-[10px] text-zinc-500 font-mono">ETA: {item.eta}</span>
                                </div>
                            </div>

                            {/* Action */}
                            <div className="col-span-1 text-right">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-zinc-800 text-zinc-300 hover:border-[#ff007f] hover:text-[#ff007f] hover:bg-[#ff007f]/10"
                                    onClick={() => setSelectedShipment(item)}
                                >
                                    <MapPin className="h-3 w-3 mr-2" /> Map View
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* MAP OVERLAY MODAL */}
            <AnimatePresence>
                {selectedShipment && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8"
                        onClick={() => setSelectedShipment(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-[#111] border border-[#333] w-full max-w-4xl h-[600px] rounded-3xl overflow-hidden shadow-2xl relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Map Placeholder Graphic */}
                            <div className="absolute inset-0 bg-[#0f0f0f] flex items-center justify-center">
                                {/* Simulated Map Grid */}
                                <div className="absolute inset-0 opacity-20"
                                    style={{
                                        backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
                                        backgroundSize: '40px 40px'
                                    }}
                                />
                                {/* Simulated Rivers/Roads */}
                                <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    <path d="M0,50 Q25,40 50,50 T100,50" fill="none" stroke="#222" strokeWidth="2" />
                                    <path d="M30,0 Q40,50 30,100" fill="none" stroke="#222" strokeWidth="2" />
                                </svg>

                                {/* Location Dot */}
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <div className="relative">
                                        <div className="h-4 w-4 bg-[#ff007f] rounded-full shadow-[0_0_20px_#ff007f] z-10 relative" />
                                        <div className="absolute inset-0 bg-[#ff007f] rounded-full animate-ping opacity-50 h-4 w-4" />
                                        {/* Label Tooltip */}
                                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/90 text-white text-[10px] font-bold px-3 py-1 rounded border border-[#ff007f]/50 whitespace-nowrap">
                                            Currently in Transit
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Stats Card Overlay */}
                            <div className="absolute bottom-8 right-8 w-96 bg-black/90 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 shadow-2xl">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-1">Live Tracking</h3>
                                        <div className="text-xl font-bold text-white">{selectedShipment.id}</div>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => setSelectedShipment(null)} className="h-6 w-6 rounded-full hover:bg-white/10">
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Target Location</span>
                                        <span className="text-white font-medium">{selectedShipment.location}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Current Node</span>
                                        <span className="text-[#ff007f] font-bold">Sorting Facility - Manhattan North, NY</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Estimated Arrival</span>
                                        <span className="text-white font-medium">{selectedShipment.eta}</span>
                                    </div>
                                </div>

                                <Button className="w-full bg-[#ff007f] hover:bg-[#ff007f]/90 text-white font-bold h-12">
                                    <Phone className="mr-2 h-4 w-4" /> CONTACT COURIER
                                </Button>
                            </div>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function MetricCard({ label, value, change, icon, isNegative = false }: { label: string, value: string, change: string, icon: any, isNegative?: boolean }) {
    return (
        <Card className="bg-[#111] border-zinc-800 p-6 relative overflow-hidden group hover:border-[#ff007f]/30 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-zinc-900 rounded-lg group-hover:bg-[#ff007f]/10 transition-colors">
                    {icon}
                </div>
                <Badge variant="outline" className={`border-0 ${isNegative ? 'text-red-500 bg-red-500/10' : 'text-green-500 bg-green-500/10'}`}>
                    {change}
                </Badge>
            </div>
            <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">{label}</p>
                <div className="text-3xl font-bold text-white">{value}</div>
            </div>
        </Card>
    )
}
