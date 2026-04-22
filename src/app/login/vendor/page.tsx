'use client'

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Eye, EyeOff, ArrowLeft, ArrowRight, Store } from 'lucide-react'

// Reuse the same logic, just different branding
export default function VendorLoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            router.push('/dashboard')
            router.refresh()
        }
    }

    return (
        <div className="flex min-h-screen bg-black text-white font-sans overflow-hidden">

            {/* LEFT COLUMN: Vendor Branding */}
            <div className="hidden lg:flex w-1/2 relative bg-zinc-950 border-r border-white/10">
                {/* Darker, edgier background for vendors */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-zinc-900 to-black z-0" />

                {/* Abstract Grid Line */}
                <div className="absolute inset-0 z-0 opacity-20"
                    style={{ backgroundImage: 'linear-gradient(#222 1px, transparent 1px), linear-gradient(90deg, #222 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                />

                <div className="relative z-10 flex flex-col justify-center px-20">
                    <div className="h-16 w-16 bg-white rounded-lg flex items-center justify-center mb-6 text-black">
                        <Store className="h-8 w-8" />
                    </div>
                    <h1 className="text-6xl font-serif font-bold text-white mb-6">
                        Start Selling<br />Your Vision.
                    </h1>
                    <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
                        Join the curated marketplace for alternative fashion. Tools, analytics, and global reach included.
                    </p>
                </div>
            </div>

            {/* RIGHT COLUMN: Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-24 relative bg-zinc-950">

                {/* Navigation Controls */}
                <div className="absolute top-8 right-8 flex gap-6 text-sm font-medium z-10">
                    <Link href="/" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2">
                        Back to Home
                    </Link>
                    <Link href="/login" className="text-white hover:text-zinc-300 transition-colors flex items-center gap-2">
                        Are you a buyer?
                    </Link>
                </div>

                <div className="max-w-[400px] mx-auto w-full">
                    <div className="mb-10">
                        <div className="inline-block px-3 py-1 rounded bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest mb-4">
                            Vendor Portal
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Vendor Login</h2>
                        <p className="text-zinc-400">Manage your store and orders.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-zinc-500">Email Address</label>
                            <Input
                                type="email"
                                placeholder="vendor@brand.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-12 bg-black border-zinc-800 text-white placeholder:text-zinc-700 focus:border-white transition-all rounded-lg"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold uppercase text-zinc-500">Password</label>
                                <Link href="/forgot-password" className="text-xs text-zinc-400 hover:text-white transition-colors">
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-12 bg-black border-zinc-800 text-white placeholder:text-zinc-700 focus:border-white transition-all rounded-lg pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm bg-red-950/50 p-3 rounded-md border border-red-900 flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-12 bg-white hover:bg-zinc-200 text-black font-bold tracking-wide rounded-lg text-base"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Enter Dashboard'}
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-zinc-500 text-sm">
                        Interested in selling? <Link href="/onboarding" className="text-white font-bold hover:underline">Apply here</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
