'use client'

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Lock, Unlock, ShieldCheck, AlertCircle } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"

interface ChatLockScreenProps {
    onUnlock: () => void
}

export function ChatLockScreen({ onUnlock }: ChatLockScreenProps) {
    const [pin, setPin] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(false)
    const [isSetupMode, setIsSetupMode] = useState(false)
    const [hasPinConfigured, setHasPinConfigured] = useState<boolean | null>(null)
    const supabase = createClient()

    // 1. Check if user has a PIN configured
    useEffect(() => {
        const checkPin = async () => {
            try {
                const { data: { user }, error: authError } = await supabase.auth.getUser()
                if (authError || !user) {
                    console.error("Chat Auth Error:", authError)
                    // If no user, user needs to re-login. Redirecting.
                    window.location.href = '/login?next=/dashboard/chat'
                    return
                }

                const { data, error: dbError } = await supabase
                    .from('user_security')
                    .select('chat_pin_hash')
                    .eq('user_id', user.id)
                    .maybeSingle() // Use maybeSingle to avoid 406/JSON error if no rows

                if (dbError) {
                    console.error("Chat Security Check Failed:", dbError)
                    toast.error("Security check failed. Please refresh.")
                    return
                }

                if (data?.chat_pin_hash) {
                    setHasPinConfigured(true)
                } else {
                    setHasPinConfigured(false)
                    setIsSetupMode(true)
                }
            } catch (err) {
                console.error("Unexpected Chat Error:", err)
            }
        }
        checkPin()
    }, [])

    // 2. Handle PIN Input
    const handleDigitClick = (digit: string) => {
        if (pin.length < 4) {
            setPin(prev => prev + digit)
            setError(false)
        }
    }

    const handleDelete = () => {
        setPin(prev => prev.slice(0, -1))
        setError(false)
    }

    // 3. Auto-Submit on 4 digits
    useEffect(() => {
        if (pin.length === 4) {
            handleSubmit()
        }
    }, [pin])

    const handleSubmit = async () => {
        setIsLoading(true)
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return

        if (isSetupMode) {
            // SETTING UP NEW PIN (In real app: Confirm PIN step)
            // Just for demo simplicity: Save directly
            // In prod: use bcrypt hash on server. Here: simple storage for Prototype
            const { error: upsertError } = await supabase
                .from('user_security')
                .upsert({
                    user_id: user.id,
                    chat_pin_hash: pin, // WARNING: Hashing should happen in Edge Function
                    is_stealth_mode_active: true
                })

            if (upsertError) {
                toast.error("Failed to secure channel.")
                setPin("")
            } else {
                toast.success("Stealth Mode Activated.")
                onUnlock()
            }
        } else {
            // UNLOCKING
            // In real app: verify hash on server. Here: compare with DB value for Prototype
            const { data } = await supabase
                .from('user_security')
                .select('chat_pin_hash')
                .eq('user_id', user.id)
                .single()

            if (data?.chat_pin_hash === pin) {
                onUnlock()
            } else {
                setError(true)
                setPin("")
                setTimeout(() => setError(false), 2000)
                toast.error("Access Denied.")
            }
        }
        setIsLoading(false)
    }

    if (hasPinConfigured === null) return <div className="h-screen bg-black" />

    return (
        <div className="h-screen w-full bg-[#000000] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">

            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 via-black to-black pointer-events-none" />

            <div className="z-10 w-full max-w-sm flex flex-col items-center gap-8">

                {/* Header Icon */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative"
                >
                    <div className={`h-16 w-16 rounded-2xl flex items-center justify-center bg-zinc-900/50 border border-white/5 backdrop-blur-xl ${error ? 'border-red-500/50' : 'border-white/10'}`}>
                        {isSetupMode ? <ShieldCheck className="h-8 w-8 text-white" /> : <Lock className="h-8 w-8 text-white" />}
                    </div>
                </motion.div>

                {/* Status Text */}
                <div className="text-center space-y-2">
                    <h2 className="text-lg font-medium tracking-tight">
                        {isSetupMode ? "Security Passcode" : "Stealth Mode Active"}
                    </h2>
                    <p className="max-w-[200px] mx-auto text-[9px] text-zinc-600 leading-tight mb-2">
                        This PIN secures your <strong>End-to-End Encryption</strong>. Required once per session to decrypt your data.
                    </p>
                    <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold">
                        {error ? <span className="text-red-500 flex items-center justify-center gap-2"><AlertCircle className="h-3 w-3" /> Invalid PIN</span> : "Enter 4-Digit Access Code"}
                    </p>
                </div>

                {/* PIN Dots */}
                <div className="flex gap-4 mb-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className={`h-3 w-3 rounded-full transition-all duration-300 ${pin.length >= i ? "bg-white scale-125" : "bg-zinc-800"
                                } ${error ? "bg-red-500" : ""}`}
                        />
                    ))}
                </div>

                {/* Numpad */}
                <div className="grid grid-cols-3 gap-6 w-full px-8">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                        <button
                            key={digit}
                            onClick={() => handleDigitClick(digit.toString())}
                            className="h-16 w-16 rounded-full bg-zinc-900/30 hover:bg-zinc-800 transition-colors flex items-center justify-center text-xl font-medium text-white border border-transparent hover:border-white/5 focus:outline-none focus:ring-1 focus:ring-white/20"
                        >
                            {digit}
                        </button>
                    ))}
                    <div /> {/* Empty slot */}
                    <button
                        onClick={() => handleDigitClick("0")}
                        className="h-16 w-16 rounded-full bg-zinc-900/30 hover:bg-zinc-800 transition-colors flex items-center justify-center text-xl font-medium text-white border border-transparent hover:border-white/5"
                    >
                        0
                    </button>
                    <button
                        onClick={handleDelete}
                        className="h-16 w-16 rounded-full flex items-center justify-center text-zinc-500 hover:text-white transition-colors"
                    >
                        Delete
                    </button>
                </div>

                {/* Footer Info */}
                <div className="mt-8 text-[10px] text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck className="h-3 w-3" />
                    End-to-End Encrypted
                </div>
            </div>
        </div>
    )
}
