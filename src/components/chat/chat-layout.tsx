'use client'

import React, { useState, useEffect } from "react"
import { ChatLockScreen } from "./chat-lock-screen"
import { Loader2 } from "lucide-react"

export function ChatLayout({ children }: { children: React.ReactNode }) {
    const [isUnlocked, setIsUnlocked] = useState(false)
    const [isChecking, setIsChecking] = useState(true)

    // In a real app, we would check a session storage or cookie validity 
    // to keep it unlocked during the session, but locking on refresh is 
    // actually a FEATURE for "Stealth Mode".

    // However, if we want to persist unlock state during navigation:
    // useEffect(() => {
    //    const unlocked = sessionStorage.getItem('chat_unlocked')
    //    if (unlocked) setIsUnlocked(true)
    //    setIsChecking(false)
    // }, [])

    useEffect(() => {
        // For Stealth Mode, default is ALWAYS LOCKED on mount
        setIsChecking(false)
    }, [])

    const handleUnlock = () => {
        setIsUnlocked(true)
        // sessionStorage.setItem('chat_unlocked', 'true')
    }

    if (isChecking) return <div className="h-screen bg-black flex items-center justify-center text-white"><Loader2 className="animate-spin" /></div>

    if (!isUnlocked) {
        return <ChatLockScreen onUnlock={handleUnlock} />
    }

    return (
        <div className="h-screen flex bg-black text-white overflow-hidden">
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col relative z-0">
                {children}
            </div>
        </div>
    )
}
