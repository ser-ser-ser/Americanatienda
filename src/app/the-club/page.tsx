'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Star, Lock, Crown, Gem } from 'lucide-react'

export default function TheClubPage() {
    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500/30 selection:text-white">

            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black z-0" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 brightness-100 contrast-150"></div>

                <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-bold uppercase tracking-widest mb-8 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                        <Crown className="h-3 w-3" /> Members Only
                    </div>

                    <h1 className="text-6xl md:text-9xl font-serif font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-purple-200">
                        The Club.
                    </h1>

                    <p className="text-lg md:text-2xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Access the unseen. Exclusive drops, private events, and a community for the true visionaries of Americana.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Button className="h-14 px-8 text-lg rounded-full bg-white text-black hover:bg-zinc-200 font-bold tracking-wide w-full sm:w-auto">
                            Apply for Membership
                        </Button>
                        <Link href="/login" className="text-zinc-400 hover:text-white font-medium text-sm transition-colors border-b border-transparent hover:border-white pb-0.5">
                            Already a member? Sign in
                        </Link>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-zinc-600 animate-bounce">
                    <div className="h-12 w-0.5 bg-gradient-to-b from-transparent via-zinc-600 to-transparent"></div>
                </div>
            </section>

            {/* Benefits Grid */}
            <section className="py-32 px-6 border-t border-white/5 bg-zinc-950">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Benefit 1 */}
                        <div className="group p-8 rounded-2xl bg-black border border-white/10 hover:border-purple-500/50 transition-colors relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-32 bg-purple-500/10 blur-[100px] pointer-events-none group-hover:bg-purple-500/20 transition-colors" />
                            <Lock className="h-10 w-10 text-purple-400 mb-6" />
                            <h3 className="text-2xl font-bold mb-4 font-serif">Vault Access</h3>
                            <p className="text-zinc-500 leading-relaxed">
                                Get first dibs on limited edition drops and archive collections before they hit the public market.
                            </p>
                        </div>

                        {/* Benefit 2 */}
                        <div className="group p-8 rounded-2xl bg-black border border-white/10 hover:border-purple-500/50 transition-colors relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-32 bg-pink-500/10 blur-[100px] pointer-events-none group-hover:bg-pink-500/20 transition-colors" />
                            <Star className="h-10 w-10 text-pink-400 mb-6" />
                            <h3 className="text-2xl font-bold mb-4 font-serif">Private Events</h3>
                            <p className="text-zinc-500 leading-relaxed">
                                Invitations to secret pop-ups, launch parties, and networking nights with fellow visionaries.
                            </p>
                        </div>

                        {/* Benefit 3 */}
                        <div className="group p-8 rounded-2xl bg-black border border-white/10 hover:border-purple-500/50 transition-colors relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-32 bg-blue-500/10 blur-[100px] pointer-events-none group-hover:bg-blue-500/20 transition-colors" />
                            <Gem className="h-10 w-10 text-blue-400 mb-6" />
                            <h3 className="text-2xl font-bold mb-4 font-serif">Concierge</h3>
                            <p className="text-zinc-500 leading-relaxed">
                                Dedicated support to help you source rare items or set up your own visionary store.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-32 px-6 text-center border-t border-white/5">
                <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8">Ready to ascend?</h2>
                <Button variant="outline" className="h-14 px-10 rounded-full border-white/20 text-white hover:bg-white hover:text-black transition-all">
                    View Membership Tiers <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </section>

        </div>
    )
}
