'use client'

import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    ArrowLeft,
    MapPin,
    Navigation,
    Phone,
    MessageSquare,
    Clock,
    CheckCircle2,
    Truck,
    Box,
    MoreHorizontal
} from 'lucide-react'

export default function LiveTrackingPage() {
    const params = useParams()
    const router = useRouter()
    const orderId = params.id as string

    // Mock Data for "Uber Flash" style tracking
    const trackingData = {
        status: 'In Transit',
        eta: '12:45 PM',
        remaining: '12 min',
        driver: {
            name: 'Marcus V.',
            rating: 4.9,
            vehicle: 'Toyota Prius (White)',
            plate: 'K-902-ZFL',
            image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&auto=format&fit=crop&q=60'
        },
        timeline: [
            { time: '10:15 AM', status: 'Order Picked Up', desc: 'Sorting Facility, Zone A', done: true },
            { time: '10:45 AM', status: 'In Transit', desc: 'Highway 101, Near Exit 42', done: true, current: true },
            { time: '12:40 PM', status: 'Near Destination', desc: 'Pending Arrival', done: false },
            { time: '12:45 PM', status: 'Delivered', desc: 'Scheduled', done: false },
        ]
    }

    return (
        <div className="min-h-screen bg-[#09090b] text-white flex flex-col font-sans h-screen overflow-hidden">

            {/* Header */}
            <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#121217]">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-zinc-400 hover:text-white">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-bold">Order #{orderId || 'UF-92834'}</h1>
                            <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20 text-[10px] uppercase">Uber Flash</Badge>
                        </div>
                        <div className="text-xs text-zinc-500 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            Live Tracking • GPS Sync: 2s ago
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="border-zinc-800 text-zinc-400">
                        Help
                    </Button>
                </div>
            </header>

            {/* Main Content: Split Layout */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">

                {/* 1. Sidebar Control Panel */}
                <div className="w-full md:w-96 bg-[#09090b] border-r border-white/10 p-6 flex flex-col gap-8 overflow-y-auto z-10">

                    {/* Time Station */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#121217] border border-white/5 p-4 rounded-xl">
                            <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Estimated Arrival</div>
                            <div className="text-2xl font-bold font-mono text-white">{trackingData.eta}</div>
                        </div>
                        <div className="bg-[#121217] border border-white/5 p-4 rounded-xl">
                            <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Remaining</div>
                            <div className="text-2xl font-bold font-mono text-cyan-500">{trackingData.remaining}</div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
                            <NetworkIcon className="h-4 w-4" /> Journey Milestones
                        </h3>
                        <div className="space-y-8 relative pl-2">
                            {/* Vertical Line */}
                            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-zinc-800" />

                            {trackingData.timeline.map((step, idx) => (
                                <div key={idx} className={`relative flex gap-4 ${step.done || step.current ? 'opacity-100' : 'opacity-40'}`}>
                                    <div className={`
                                        h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 z-10 bg-[#09090b]
                                        ${step.current ? 'border-cyan-500 text-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]' :
                                            step.done ? 'border-blue-500 text-blue-500' : 'border-zinc-700 text-zinc-700'}
                                    `}>
                                        {step.done ? <CheckCircle2 className="h-3 w-3" /> : step.current ? <Truck className="h-3 w-3 fill-current" /> : <Box className="h-3 w-3" />}
                                    </div>
                                    <div>
                                        <div className={`text-sm font-bold ${step.current ? 'text-cyan-400' : step.done ? 'text-white' : 'text-zinc-400'}`}>
                                            {step.status}
                                        </div>
                                        <div className="text-xs text-zinc-500 mt-1">
                                            {step.time} — {step.desc}
                                        </div>
                                        {step.current && (
                                            <Badge variant="secondary" className="mt-2 bg-cyan-950/30 text-cyan-500 border-cyan-900/50 text-[10px]">
                                                Current speed: 64 km/h
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-bold h-12 mt-auto">
                        View Full Details
                    </Button>
                </div>

                {/* 2. Map Area */}
                <div className="flex-1 bg-zinc-900 relative flex items-center justify-center overflow-hidden bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/-99.1332,19.4326,12,0/1200x800?access_token=Pk_mock')] bg-cover bg-center">

                    {/* Dark Map Placeholder (CSS Pattern) */}
                    <div className="absolute inset-0 bg-[#111] opacity-90 pattern-grid-lg text-blue-500/5" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent pointer-events-none" />

                    {/* Mock Map UI Elements */}
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="h-4 w-4 bg-cyan-500 rounded-full animate-ping absolute" />
                        <div className="h-8 w-8 bg-cyan-500 rounded-full border-4 border-[#09090b] flex items-center justify-center shadow-lg shadow-cyan-500/40 relative z-20">
                            <Truck className="h-4 w-4 text-black fill-black" />
                        </div>
                        <div className="mt-4 bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs font-mono text-cyan-400 shadow-xl">
                            In Transit • 5 mins away
                        </div>
                    </div>

                    {/* Driver Card Float */}
                    <Card className="absolute bottom-8 right-8 w-80 bg-[#121217]/90 backdrop-blur-xl border-zinc-800 shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-700">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-4 mb-4">
                                <img src={trackingData.driver.image} alt="Driver" className="h-12 w-12 rounded-lg object-cover border border-white/10" />
                                <div>
                                    <div className="font-bold text-white text-sm">{trackingData.driver.name}</div>
                                    <div className="text-xs text-blue-400 flex items-center gap-1">
                                        Elite Courier • ⭐ {trackingData.driver.rating}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400 mb-4 bg-black/50 p-2 rounded-lg">
                                <div>
                                    <span className="block text-[10px] uppercase tracking-wider text-zinc-600">Vehicle</span>
                                    {trackingData.driver.vehicle}
                                </div>
                                <div>
                                    <span className="block text-[10px] uppercase tracking-wider text-zinc-600">License Plate</span>
                                    <span className="font-mono text-white">{trackingData.driver.plate}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <Button size="sm" variant="outline" className="border-zinc-700 hover:bg-zinc-800 text-zinc-300">
                                    <MessageSquare className="mr-2 h-3 w-3" /> Message
                                </Button>
                                <Button size="sm" className="bg-cyan-600 hover:bg-cyan-500 text-black font-bold">
                                    <Phone className="mr-2 h-3 w-3" /> Call
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Zoom / Map Controls */}
                    <div className="absolute top-8 right-8 flex flex-col gap-2">
                        <Button size="icon" variant="outline" className="bg-black/50 border-white/10 hover:bg-black text-white hover:text-cyan-400 h-10 w-10">
                            <PlusIcon className="h-5 w-5" />
                        </Button>
                        <Button size="icon" variant="outline" className="bg-black/50 border-white/10 hover:bg-black text-white hover:text-cyan-400 h-10 w-10">
                            <MinusIcon className="h-5 w-5" />
                        </Button>
                        <Button size="icon" variant="outline" className="bg-black/50 border-white/10 hover:bg-black text-cyan-500 h-10 w-10 mt-2">
                            <Navigation className="h-5 w-5 fill-current" />
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    )
}

function NetworkIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <rect x="16" y="16" width="6" height="6" rx="1" />
            <rect x="2" y="16" width="6" height="6" rx="1" />
            <rect x="9" y="2" width="6" height="6" rx="1" />
            <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
            <path d="M12 12V8" />
        </svg>
    )
}

function PlusIcon({ className }: { className?: string }) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14" /><path d="M12 5v14" /></svg> }
function MinusIcon({ className }: { className?: string }) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14" /></svg> }
