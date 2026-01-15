'use client'

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Play } from 'lucide-react'

export default function OnboardingSplashPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleStart = () => {
        router.push('/onboarding/apply')
    }

    return (
        <div className="flex h-screen bg-black text-white font-sans overflow-hidden">

            {/* LEFT: Atmospheric Image */}
            <div className="hidden lg:block w-1/2 relative bg-zinc-900 h-full">
                <img
                    src="https://images.unsplash.com/photo-1590845947698-8924d7409b56?q=80&w=2000&auto=format&fit=crop"
                    alt="Artisan Studio"
                    className="w-full h-full object-cover grayscale"
                />
                <div className="absolute inset-0 bg-black/20" /> {/* Subtle overlay */}

                <Link href="/" className="absolute top-8 left-8 flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="h-6 w-6 bg-pink-600 rounded-full" />
                    <span className="font-bold tracking-widest uppercase text-sm">Americana</span>
                </Link>

                <div className="absolute bottom-12 left-12 max-w-lg">
                    <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Editorial Series 04</p>
                    <h1 className="text-5xl font-black italic uppercase leading-none mb-1">
                        The Artisans of the
                    </h1>
                    <h1 className="text-5xl font-black italic uppercase leading-none text-white">
                        Underground
                    </h1>
                </div>
            </div>

            {/* RIGHT: Call to Action */}
            <div className="w-full lg:w-1/2 bg-[#0a0a0a] flex flex-col justify-center px-12 md:px-24 relative">

                <div className="max-w-[420px] mx-auto w-full">
                    <div className="mb-12">
                        <p className="text-[10px] font-bold tracking-[0.3em] text-zinc-500 uppercase mb-2">Merchant Access</p>
                        <h2 className="text-6xl font-black text-white leading-[0.9] tracking-tighter mb-1">
                            JOIN THE
                        </h2>
                        <h2 className="text-6xl font-black text-pink-600 leading-[0.9] italic tracking-tighter">
                            COLLECTIVE
                        </h2>
                        <p className="mt-6 text-zinc-400 text-lg leading-relaxed">
                            We are looking for the next generation of avant-garde creators. Apply now to open your store in the underground market.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <Button
                            onClick={handleStart}
                            className="w-full h-14 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white font-bold tracking-[0.1em] uppercase rounded-md shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all transform hover:scale-[1.02]"
                        >
                            Start Application
                        </Button>
                    </div>

                    <div className="mt-10 text-center text-sm text-zinc-600">
                        Already have a store? <Link href="/login/vendor" className="text-pink-500 font-bold hover:text-pink-400 transition-colors">Login here</Link>
                    </div>


                </div>
            </div>
        </div>
    )
}
