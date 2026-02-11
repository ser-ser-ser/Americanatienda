'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Play, CheckCircle2, Loader2, Rocket } from 'lucide-react'

export default function RegistrationSuccessPage() {
    return (
        <div className="min-h-screen bg-black text-white overflow-hidden relative font-sans">

            {/* Header */}
            <header className="absolute top-0 left-0 right-0 z-50 px-12 py-8 flex justify-between items-center bg-linear-to-b from-black/80 to-transparent">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <span className="text-pink-600 font-bold text-xl tracking-tighter">AMERICANA</span>
                    <span className="text-zinc-500 text-[10px] tracking-widest uppercase mt-1">Marketplace</span>
                </Link>
                <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-zinc-400">
                    <Link href="#" className="hover:text-white">Documentation</Link>
                    <Link href="#" className="hover:text-white">Support</Link>
                    <div className="h-6 w-6 rounded-full bg-pink-600 text-white flex items-center justify-center text-[10px]">AM</div>
                </div>
            </header>

            {/* Main Content */}
            <div className="relative h-[80vh] flex flex-col items-center justify-center text-center px-4">

                {/* Background Image/Video Placeholder */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1537832816519-689ad163238b?q=80&w=2000&auto=format&fit=crop"
                        className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
                </div>

                <div className="relative z-10 animate-fade-in-up">
                    <div className="inline-block px-4 py-1.5 rounded-full border border-pink-500/30 bg-pink-900/10 text-[10px] font-bold uppercase tracking-widest text-pink-400 mb-8 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                        Registration Received
                    </div>

                    <h1 className="text-7xl font-black text-white leading-none tracking-tighter mb-2">
                        YOUR STORE IS
                    </h1>
                    <h1 className="text-7xl font-black text-transparent bg-clip-text bg-linear-to-r from-pink-600 to-white leading-none tracking-tighter italic mb-8">
                        BEING BORN.
                    </h1>

                    <p className="max-w-xl mx-auto text-zinc-400 text-lg leading-relaxed mb-10">
                        Welcome to the underground high-fashion elite. Our curators are reviewing your brand to ensure it meets our provocative standards.
                    </p>

                    <div className="flex gap-4 justify-center">
                        <Link href="/dashboard/vendor">
                            <Button className="h-12 px-8 bg-linear-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-bold uppercase tracking-wider rounded-full shadow-[0_0_25px_rgba(236,72,153,0.4)] transition-transform hover:scale-105">
                                Visit your Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                        <Button variant="outline" className="h-12 px-6 border-zinc-700 bg-black/50 hover:bg-white/10 text-white font-bold uppercase tracking-wider rounded-full">
                            Preview your Store <div className="ml-2 h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                        </Button>
                    </div>
                </div>

            </div>

            {/* Status Steps */}
            <div className="max-w-5xl mx-auto px-8 pb-20 relative z-20 -mt-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Step 1 */}
                    <div className="space-y-4 opacity-100">
                        <div className="h-10 w-10 bg-pink-600 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.5)]">
                            <Play className="h-4 w-4 text-white fill-white" />
                        </div>
                        <div>
                            <div className="text-pink-500 text-[10px] font-bold uppercase tracking-widest mb-1">01. Reviewing Brand</div>
                            <p className="text-xs text-zinc-500 leading-relaxed">
                                Our design team checks your aesthetic alignment. Expect a response within 24-48 hours.
                            </p>
                            <div className="mt-2 inline-block px-2 py-0.5 bg-pink-900/20 text-pink-500 text-[8px] font-bold uppercase rounded">In Progress</div>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="space-y-4 opacity-50">
                        <div className="h-10 w-10 bg-zinc-800 rounded-full flex items-center justify-center border border-white/10">
                            <span className="text-zinc-500 font-bold">02</span>
                        </div>
                        <div>
                            <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Stripe Onboarding</div>
                            <p className="text-xs text-zinc-600 leading-relaxed">
                                Connect your bank account securely to start receiving payouts for your sales.
                            </p>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="space-y-4 opacity-50">
                        <div className="h-10 w-10 bg-zinc-800 rounded-full flex items-center justify-center border border-white/10">
                            <Rocket className="h-4 w-4 text-zinc-600" />
                        </div>
                        <div>
                            <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Go Live</div>
                            <p className="text-xs text-zinc-600 leading-relaxed">
                                Your products hit the marketplace. Start reaching the modern provocateur.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Stats & Links */}
            <div className="bg-[#0a0a0a] border-t border-zinc-900 py-12">
                <div className="max-w-6xl mx-auto px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-4">While you wait...</h3>
                            <p className="text-zinc-500 text-sm mb-6 max-w-sm">
                                Explore our seller resources to optimize your high-conversion product photography and descriptions.
                            </p>
                            <Link href="#" className="text-pink-600 font-bold text-xs uppercase tracking-wider flex items-center hover:text-pink-500">
                                Seller Education Hub <ArrowRight className="ml-2 h-3 w-3" />
                            </Link>
                        </div>
                        <div className="flex gap-6 justify-end">
                            <div className="bg-zinc-900 rounded-xl p-6 w-40 border border-white/5">
                                <div className="text-3xl font-bold text-white mb-1">98%</div>
                                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Approval Rate</div>
                            </div>
                            <div className="bg-zinc-900 rounded-xl p-6 w-40 border border-white/5">
                                <div className="text-3xl font-bold text-white mb-1">&lt;36h</div>
                                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Avg Response</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-zinc-900 pt-12">
                        <div>
                            <h4 className="text-white font-black tracking-tighter uppercase text-xl mb-4">Americana</h4>
                            <p className="text-zinc-600 text-xs leading-relaxed">Curated essentials for the modern provocateur. Experience the intersection of aesthetics and indulgence.</p>
                        </div>
                        <div className="md:col-start-3">
                            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Explore</div>
                            <ul className="space-y-2 text-xs text-zinc-400">
                                <li><Link href="#" className="hover:text-white">Categories</Link></li>
                                <li><Link href="#" className="hover:text-white">Stores</Link></li>
                                <li><Link href="#" className="hover:text-white">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Connect</div>
                            <div className="flex gap-4">
                                {/* Social Icons Placeholder */}
                                <div className="h-8 w-8 bg-zinc-900 rounded flex items-center justify-center text-zinc-500">IG</div>
                                <div className="h-8 w-8 bg-zinc-900 rounded flex items-center justify-center text-zinc-500">TW</div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center text-[10px] text-zinc-700 uppercase tracking-widest mt-20">
                        © 2026 Americana Stores. All rights reserved. | info@americanastores.com
                    </div>
                </div>
            </div>

        </div>
    )
}
