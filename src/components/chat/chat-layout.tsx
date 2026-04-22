'use client'

import React, { useState, useEffect } from "react"
import { ChatLockScreen } from "./chat-lock-screen"
import { Loader2 } from "lucide-react"

export default function ChatLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-screen flex bg-black text-white overflow-hidden">
            <div className="flex-1 flex flex-col relative z-0">
                {children}
            </div>
        </div>
    )
}
