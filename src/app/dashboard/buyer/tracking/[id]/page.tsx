'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Moon, MoreHorizontal, User, Truck, Package, CheckCircle2, Home, MapPin, Navigation } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Image from 'next/image'

export default function OrderTrackingPage() {
    const params = useParams()
    const id = params.id as string

    return (
        <div className="min-h-screen bg-black text-foreground relative overflow-hidden">

            {/* Header */}
            <header className="absolute top-0 left-0 right-0 z-50 h-20 flex items-center justify-between px-6 border-b border-white/5 bg-black/80 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <span className="text-2xl font-serif font-bold tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                        AMERICANA
                    </span>
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400 ml-8">
                        <Link href="/shops" className="hover:text-white transition-colors">Shop</Link>
                        <Link href="/collections" className="hover:text-white transition-colors">Collections</Link>
                        <span className="text-pink-500">Track Order</span>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/dashboard/buyer" className="text-sm font-medium text-zinc-400 hover:text-white flex items-center gap-2 transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Back to My Orders
                    </Link>
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                        U
                    </div>
                </div>
            </header>

            <div className="flex h-screen pt-20">
                {/* Left Panel: Status & Timeline */}
                <div className="w-full md:w-[450px] bg-zinc-950 border-r border-white/5 flex flex-col h-full z-20 relative shadow-[10px_0_50px_-5px_rgba(0,0,0,0.5)]">
                    <div className="p-8 border-b border-white/5">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Order ID</div>
                                <div className="text-xl font-bold text-white">#{id.slice(0, 8).toUpperCase()}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Est. Delivery</div>
                                <div className="text-xl font-bold text-white">Oct 28, 2026</div>
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-xl p-4 flex items-center justify-between border border-white/5 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                                <div>
                                    <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">Status: Shipped</div>
                                    <div className="text-xs text-zinc-400">Currently in transit to regional hub</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="px-3 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400">
                                    Carrier: DHL Express
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-8 relative">
                        <div className="absolute left-[54px] top-12 bottom-12 w-px bg-zinc-800" />

                        {/* Event 1: In Transit (Current) */}
                        <div className="relative flex gap-6">
                            <div className="relative z-10 h-12 w-12 rounded-full bg-pink-600 border-4 border-zinc-950 flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.5)]">
                                <Truck className="h-5 w-5 text-white" />
                            </div>
                            <div className="pt-2">
                                <div className="text-xs font-bold text-pink-500 uppercase tracking-wider mb-1">In Transit</div>
                                <h3 className="text-white font-bold mb-1">Shipped from Distribution Center</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed mb-2">
                                    Brooklyn, NY. Package is on its way to your local facility.
                                </p>
                                <div className="text-[10px] text-zinc-600 font-mono">OCT 25, 2026 • 02:14 PM</div>
                            </div>
                        </div>

                        {/* Event 2: Processing */}
                        <div className="relative flex gap-6 opacity-60">
                            <div className="relative z-10 h-10 w-10 rounded-full bg-pink-600 flex items-center justify-center border-4 border-zinc-950">
                                <Package className="h-4 w-4 text-white" />
                            </div>
                            <div className="pt-1">
                                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Completed</div>
                                <h3 className="text-white font-bold mb-1">Processing & Inspection</h3>
                                <p className="text-zinc-500 text-sm mb-1">
                                    Awaiting quality control checks at the New York warehouse.
                                </p>
                                <div className="text-[10px] text-zinc-700 font-mono">OCT 24, 2026 • 11:45 AM</div>
                            </div>
                        </div>

                        {/* Event 3: Order Confirmed */}
                        <div className="relative flex gap-6 opacity-40">
                            <div className="relative z-10 h-10 w-10 rounded-full bg-pink-600 flex items-center justify-center border-4 border-zinc-950">
                                <CheckCircle2 className="h-4 w-4 text-white" />
                            </div>
                            <div className="pt-1">
                                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Completed</div>
                                <h3 className="text-white font-bold mb-1">Order Confirmed</h3>
                                <p className="text-zinc-500 text-sm mb-1">
                                    Payment verified and order details sent to the vendor.
                                </p>
                                <div className="text-[10px] text-zinc-700 font-mono">OCT 24, 2026 • 09:12 AM</div>
                            </div>
                        </div>

                        {/* Future Steps */}
                        <div className="relative flex gap-6 opacity-30 grayscale">
                            <div className="relative z-10 h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center border-4 border-zinc-950 ml-1">
                                <Navigation className="h-3 w-3 text-white" />
                            </div>
                            <div className="pt-1">
                                <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider mb-1">Upcoming</div>
                                <h3 className="text-white font-medium">Out for Delivery</h3>
                            </div>
                        </div>

                        <div className="relative flex gap-6 opacity-30 grayscale">
                            <div className="relative z-10 h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center border-4 border-zinc-950 ml-1">
                                <Home className="h-3 w-3 text-white" />
                            </div>
                            <div className="pt-1">
                                <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider mb-1">Upcoming</div>
                                <h3 className="text-white font-medium">Delivered</h3>
                            </div>
                        </div>

                    </div>

                    {/* Bottom: Item Preview */}
                    <div className="p-6 bg-zinc-900/50 border-t border-white/5">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">Items in this Shipment</div>
                        <div className="flex gap-3">
                            <div className="h-12 w-12 bg-black rounded border border-white/10 overflow-hidden">
                                {/* Placeholder for item image */}
                                <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-600">Img</div>
                            </div>
                            <div className="h-12 w-12 bg-black rounded border border-white/10 overflow-hidden">
                                <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-600">Img</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Map Visualization (Placeholder) */}
                <div className="flex-1 bg-zinc-900 relative hidden md:block">
                    {/* Dark Map grid pattern */}
                    <div className="absolute inset-0 z-0 opacity-20"
                        style={{
                            backgroundImage: 'radial-gradient(#333 1px, transparent 1px)',
                            backgroundSize: '20px 20px'
                        }}
                    />

                    {/* Simulated Map Elements */}
                    <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-px bg-gradient-to-r from-pink-500/0 via-pink-500/50 to-pink-500/0 rotate-[-25deg]" />

                    {/* Truck Icon on Map */}
                    <div className="absolute top-[45%] left-[45%]">
                        <div className="relative">
                            <div className="absolute -inset-4 bg-pink-500/20 rounded-full blur-xl animate-pulse" />
                            <div className="h-10 w-10 bg-pink-600 rounded-full flex items-center justify-center shadow-lg relative z-10">
                                <Truck className="h-5 w-5 text-white" />
                            </div>
                            {/* Tooltip */}
                            <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-800 p-3 rounded-lg w-40 shadow-2xl z-20">
                                <div className="text-[10px] font-bold uppercase text-pink-500 mb-1">Live Location</div>
                                <div className="text-white font-bold text-sm">Jersey City, NJ</div>
                                <div className="text-xs text-zinc-500">55 mph • I-95 South</div>
                            </div>
                        </div>
                    </div>

                    {/* Origin Point */}
                    <div className="absolute top-[20%] right-[20%]">
                        <div className="h-3 w-3 bg-zinc-600 rounded-full" />
                    </div>

                    {/* Map Controls */}
                    <div className="absolute bottom-8 right-8 flex flex-col gap-2">
                        <Button size="icon" variant="secondary" className="bg-zinc-800 text-white hover:bg-zinc-700"><div className="text-lg">+</div></Button>
                        <Button size="icon" variant="secondary" className="bg-zinc-800 text-white hover:bg-zinc-700"><div className="text-lg">-</div></Button>
                        <Button size="icon" className="bg-pink-600 hover:bg-pink-700 mt-2"><Navigation className="h-4 w-4" /></Button>
                    </div>

                    <div className="absolute top-8 right-8 bg-zinc-900/80 backdrop-blur px-4 py-2 rounded-full border border-white/5 text-xs text-white flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-400" />
                        42°F • Light Rain
                    </div>
                </div>
            </div>
        </div>
    )
}
