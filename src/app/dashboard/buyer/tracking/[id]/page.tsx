'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Headphones, MapPin, Navigation, Truck, Package, CheckCircle2, Home, Minus, Plus, CloudRain, List, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

export default function TrackingPage() {
    const params = useParams()
    const id = params.id as string
    const supabase = createClient()
    const [order, setOrder] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOrder = async () => {
            if (id === 'ORD-DEMO-1234' || id.startsWith('AMR-')) {
                // Mock Order logic for Demo
                setOrder({
                    id: id,
                    status: 'shipped', // "in transit"
                    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
                    items: [{ name: "Leather Corset", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8" }]
                })
                setLoading(false)
                return
            }

            const { data } = await supabase
                .from('orders')
                .select('*, order_items(*)')
                .eq('id', id)
                .single()

            if (data) setOrder(data)
            setLoading(false)
        }
        fetchOrder()
    }, [id])

    if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-zinc-500">Loading tracking...</div>

    if (!order) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Order not found</div>

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-[#050505] text-slate-900 dark:text-white font-sans">
            {/* Header / Top Bar */}
            <div className="bg-[#0A0A0A] border-b border-white/5 px-4 md:px-10 py-4 shrink-0">
                <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold block mb-1">Order ID</span>
                            <span className="text-white font-bold tracking-tight">#{order.id.slice(0, 8).toUpperCase()}</span>
                        </div>
                        <div className="h-10 w-px bg-white/10 hidden sm:block"></div>
                        <div>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold block mb-1">Est. Delivery</span>
                            <span className="text-white font-bold tracking-tight">{format(new Date(Date.now() + 86400000 * 2), 'MMM d, yyyy')}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-[#f4256a]/10 border border-[#f4256a]/20 px-4 py-2.5 rounded-xl">
                        <div className="h-2 w-2 rounded-full bg-[#f4256a] animate-pulse shadow-[0_0_10px_rgba(244,37,106,0.8)]"></div>
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-wider text-[#f4256a] font-black">Status: {order.status?.toUpperCase() || 'SHIPPED'}</span>
                            <span className="text-xs text-[#ba9ca6]">Currently in transit to regional hub</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/dashboard/buyer">
                            <Button variant="outline" className="h-10 px-4 bg-[#0A0A0A] text-white border-white/10 hover:bg-white/5 hover:text-white transition-colors">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back
                            </Button>
                        </Link>
                        <button className="flex items-center justify-center h-10 w-10 bg-[#0A0A0A] text-[#f4256a] rounded-lg hover:bg-[#f4256a]/10 transition-all border border-white/10">
                            <Headphones className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            <main className="flex-1 flex overflow-hidden">
                {/* Sidebar (History) */}
                <aside className="w-full max-w-md bg-[#0A0A0A] border-r border-white/5 overflow-y-auto hidden lg:block">
                    <div className="p-8">
                        <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-2">
                            <List className="text-[#f4256a] h-5 w-5" />
                            Tracking History
                        </h3>
                        <div className="relative space-y-12">
                            {/* Timeline Line */}
                            <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-white/5"></div>
                            <div className="absolute left-[19px] top-2 h-1/2 w-0.5 bg-[#f4256a] shadow-[0_0_8px_rgba(244,37,106,0.4)]"></div>

                            {/* Event 1: In Transit (Active) */}
                            <div className="relative flex gap-6 group">
                                <div className="z-10 flex items-center justify-center h-10 w-10 rounded-full bg-[#0A0A0A] border-2 border-[#f4256a] text-[#f4256a] shadow-[0_0_15px_rgba(244,37,106,0.3)]">
                                    <Truck className="h-5 w-5" />
                                </div>
                                <div className="flex flex-col pt-1">
                                    <span className="text-xs font-bold text-[#f4256a] uppercase tracking-widest mb-1">In Transit</span>
                                    <h4 className="text-white font-bold">Shipped from Distribution Center</h4>
                                    <p className="text-[#ba9ca6] text-sm mt-1">Brooklyn, NY. Package is on its way to your local facility.</p>
                                    <span className="text-[10px] text-zinc-600 mt-2 font-medium">{format(new Date(), 'MMM d, yyyy')} • 02:14 PM</span>
                                </div>
                            </div>

                            {/* Event 2: Processing (Done) */}
                            <div className="relative flex gap-6 group">
                                <div className="z-10 flex items-center justify-center h-10 w-10 rounded-full bg-[#f4256a] text-white">
                                    <Package className="h-5 w-5" />
                                </div>
                                <div className="flex flex-col pt-1">
                                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Completed</span>
                                    <h4 className="text-white font-bold">Processing & Inspection</h4>
                                    <p className="text-[#ba9ca6] text-sm mt-1">Awaiting quality control checks at the New York warehouse.</p>
                                    <span className="text-[10px] text-zinc-600 mt-2 font-medium">{format(new Date(Date.now() - 86400000), 'MMM d, yyyy')} • 11:45 AM</span>
                                </div>
                            </div>

                            {/* Event 3: Order Confirmed (Done) */}
                            <div className="relative flex gap-6 group">
                                <div className="z-10 flex items-center justify-center h-10 w-10 rounded-full bg-[#f4256a] text-white">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                                <div className="flex flex-col pt-1">
                                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Completed</span>
                                    <h4 className="text-white font-bold">Order Confirmed</h4>
                                    <p className="text-[#ba9ca6] text-sm mt-1">Payment verified and order details sent to the vendor.</p>
                                    <span className="text-[10px] text-zinc-600 mt-2 font-medium">{format(new Date(Date.now() - 86400000 * 2), 'MMM d, yyyy')} • 09:12 AM</span>
                                </div>
                            </div>

                            {/* Event 4: Future */}
                            <div className="relative flex gap-6 group opacity-40">
                                <div className="z-10 flex items-center justify-center h-10 w-10 rounded-full bg-[#0A0A0A] border-2 border-white/10 text-slate-400">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <div className="flex flex-col pt-1">
                                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Upcoming</span>
                                    <h4 className="text-white font-bold">Delivered</h4>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 p-4 bg-[#121212] rounded-xl border border-white/5">
                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Items in this shipment</p>
                            {order.order_items && order.order_items.map((item: any, idx: number) => (
                                <div
                                    key={idx}
                                    className="h-12 w-12 rounded-lg bg-cover bg-center border border-white/10 bg-zinc-800"
                                    style={{ backgroundImage: `url(${item.image_url || item.images?.[0] || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8'})` }}
                                    title={item.name}
                                ></div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Map Section */}
                <section className="flex-1 relative bg-[#050505] map-grid">
                    {/* SVG Curve Path */}
                    <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                        <path className="route-path" d="M100 600 C 200 500, 400 450, 600 300 S 900 150, 1100 100" fill="none" stroke="#f4256a" strokeWidth="3"></path>
                    </svg>

                    {/* Location 1: Origin */}
                    <div className="absolute left-[10%] bottom-[20%] group">
                        <div className="relative">
                            <div className="h-6 w-6 bg-white rounded-full flex items-center justify-center shadow-2xl">
                                <div className="h-2 w-2 bg-[#050505] rounded-full"></div>
                            </div>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap bg-[#050505] text-white text-[10px] px-2 py-1 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                                Brooklyn DC
                            </div>
                        </div>
                    </div>

                    {/* Truck Location */}
                    <div className="absolute left-[45%] top-[45%] z-20">
                        <div className="relative">
                            <div className="absolute -inset-4 bg-[#f4256a]/20 rounded-full blur-lg animate-pulse"></div>
                            <div className="relative h-12 w-12 bg-[#f4256a] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(244,37,106,0.6)] border-4 border-[#050505]">
                                <Truck className="text-white h-6 w-6" />
                            </div>
                            {/* Stats Card */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 whitespace-nowrap bg-[#0A0A0A] border border-[#f4256a]/30 text-white p-3 rounded-xl shadow-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black uppercase tracking-tighter text-[#f4256a]">Live Location</span>
                                        <span className="text-xs font-bold">Jersey City, NJ</span>
                                    </div>
                                    <div className="h-6 w-px bg-white/10"></div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black uppercase tracking-tighter text-slate-400">Speed</span>
                                        <span className="text-xs font-bold">55 mph</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Destination */}
                    <div className="absolute right-[15%] top-[10%]">
                        <div className="relative">
                            <div className="h-8 w-8 bg-[#00d4ff] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,212,255,0.4)] border-4 border-[#050505]">
                                <Home className="text-white h-4 w-4" />
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="absolute bottom-10 right-10 flex flex-col gap-2">
                        <button className="h-12 w-12 bg-[#0A0A0A]/80 backdrop-blur-md border border-white/10 text-white rounded-xl flex items-center justify-center hover:bg-[#151515] transition-all">
                            <Plus className="h-6 w-6" />
                        </button>
                        <button className="h-12 w-12 bg-[#0A0A0A]/80 backdrop-blur-md border border-white/10 text-white rounded-xl flex items-center justify-center hover:bg-[#151515] transition-all">
                            <Minus className="h-6 w-6" />
                        </button>
                        <button className="h-12 w-12 bg-[#f4256a]/90 backdrop-blur-md border border-white/10 text-white rounded-xl flex items-center justify-center hover:bg-[#f4256a] transition-all mt-4">
                            <Navigation className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Weather */}
                    <div className="absolute top-10 right-10 flex gap-4">
                        <div className="bg-[#0A0A0A]/60 backdrop-blur-lg border border-white/5 px-4 py-2 rounded-full flex items-center gap-3">
                            <CloudRain className="text-[#00d4ff] h-5 w-5" />
                            <span className="text-xs font-bold text-white">42°F · Light Rain</span>
                        </div>
                    </div>

                </section>
            </main>
        </div>
    )
}
