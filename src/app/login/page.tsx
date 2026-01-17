'use client'

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label' // Assuming this component exists or standard label
import { Loader2, Eye, EyeOff, ArrowLeft, ArrowRight, Store, Checkbox } from 'lucide-react'

export default function LoginPage() {
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

            {/* LEFT COLUMN: Image & Branding */}
            <div className="hidden lg:flex w-1/2 relative bg-zinc-900 border-r border-white/10">
                <div className="absolute inset-0">
                    {/* Placeholder Fashion Image - Replace with local asset if provided */}
                    <img
                        src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop"
                        alt="Americana Fashion"
                        className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000"
                    />
                </div>

                {/* Branding Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />

                <div className="absolute bottom-20 left-12 z-10">
                    <h1 className="text-8xl font-black text-white leading-none tracking-tighter mb-4">
                        OFF<br />LIMITS
                    </h1>
                    <p className="text-pink-500 font-bold tracking-[0.5em] text-sm uppercase">
                        Niche Fashion Marketplace
                    </p>
                </div>

                <div className="absolute top-12 left-12 z-10 flex items-center gap-3">
                    <div className="h-8 w-8 bg-pink-600 rounded-full" />
                    <span className="text-xl font-bold tracking-tight">Americana</span>
                </div>
            </div>

            {/* RIGHT COLUMN: Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-24 relative">

                {/* Navigation Controls */}
                <div className="absolute top-8 right-8 flex gap-6 text-sm font-medium z-10">
                    <Link href="/" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" /> Back to Home
                    </Link>
                    <Link href="/login/vendor" className="text-pink-500 hover:text-pink-400 transition-colors flex items-center gap-2">
                        Are you a seller? <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="max-w-[400px] mx-auto w-full">
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                        <p className="text-zinc-400">Join the Rebellion.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-zinc-500">Email Address</label>
                            <Input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-12 bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-600 focus:border-pink-500 transition-all rounded-lg"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold uppercase text-zinc-500">Password</label>
                                <Link
                                    href="/forgot-password"
                                    className="text-xs text-pink-500 hover:text-pink-400 transition-colors"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-12 bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-600 focus:border-pink-500 transition-all rounded-lg pr-10"
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

                        <div className="flex items-center space-x-2">
                            <div className="h-4 w-4 rounded border border-zinc-700 bg-zinc-900" /> {/* Simulating Checkbox style */}
                            <label className="text-sm text-zinc-400 font-medium">
                                Remember me for 30 days
                            </label>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-md border border-red-500/20 flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-12 bg-pink-600 hover:bg-pink-700 text-white font-bold tracking-wide rounded-lg text-base"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Login'}
                        </Button>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/10" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-black px-2 text-zinc-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline" type="button" className="h-12 border-white/10 bg-white/5 hover:bg-white/10 text-white" disabled>
                                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                                Google
                            </Button>
                            <Button variant="outline" type="button" className="h-12 border-white/10 bg-white/5 hover:bg-white/10 text-white" disabled>
                                <svg className="mr-2 h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05 2.3-2.9 2.3-.85 0-1.85-1.4-3.15-1.4-1.3 0-2.45 1.5-3.3 1.5-1.05 0-2.45-1.7-3.65-3.8-1.85-3.25-1.55-7.45.65-9.3 1.1-1 2.9-1.3 3.8-1.3 1 0 2.25.9 3.05.9s1.85-.95 3-.9c3 0 5 2.25 5 2.25s-2.85 1.45-2.85 4.5c0 3.6 3.3 4.8 3.35 4.8-.1.45-.25.9-.4 1.35zM12.05 5.58c.85-1.05 1.45-2.4 1.3-3.7-.95.05-2.25.65-2.95 1.65-.65.95-1.2 2.25-1.15 3.5.95.1 2.25-.65 2.8-1.45z" /></svg>
                                Apple
                            </Button>
                        </div>
                    </form>

                    <div className="mt-8 text-center text-zinc-500 text-sm">
                        New to Americana? <Link href="/signup" className="text-pink-500 font-bold hover:underline">Create an account</Link>
                    </div>
                </div>

                {/* Footer Links */}
                <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-8 text-[10px] text-zinc-600 uppercase tracking-widest">
                    <Link href="#" className="hover:text-zinc-400">Terms</Link>
                    <Link href="#" className="hover:text-zinc-400">Privacy</Link>
                    <Link href="#" className="hover:text-zinc-400">Help</Link>
                </div>
            </div>
        </div>
    )
}
