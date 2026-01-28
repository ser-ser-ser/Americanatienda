'use client'

import { cn } from "@/lib/utils"
import { Check, CheckCheck, Shield } from "lucide-react"
import { useChat } from "@/providers/chat-provider"

interface ChatMessageBubbleProps {
    message: {
        id: string
        content: string
        sender_id: string
        created_at: string
        is_read?: boolean
        metadata?: any
    }
    isMe: boolean
}

export function ChatMessageBubble({ message, isMe }: ChatMessageBubbleProps) {
    const { bubbleColors } = useChat()
    const time = new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const isEncrypted = message.metadata?.e2ee

    const bgColor = isMe
        ? "bg-gradient-to-br from-indigo-600 to-violet-700 shadow-[0_4px_15px_rgba(99,102,241,0.3)]"
        : "bg-white/10 backdrop-blur-md border border-white/10 shadow-lg"
    const textColor = "text-white"

    return (
        <div className={cn(
            "flex flex-col mb-3 max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300",
            isMe ? "ml-auto items-end" : "mr-auto items-start"
        )}>
            <div className={cn(
                "relative px-4 py-2.5 rounded-[22px] min-w-[90px]",
                bgColor,
                textColor,
                isMe ? "rounded-tr-sm" : "rounded-tl-sm"
            )}>
                {/* CRM Security Indicator */}
                {isEncrypted && !message.metadata?.is_plain && (
                    <div className={cn(
                        "flex items-center gap-1 text-[7px] mb-1.5 opacity-70 uppercase tracking-[0.2em] font-black",
                        isMe ? "text-indigo-100" : "text-zinc-400"
                    )}>
                        <Shield className="h-2 w-2" />
                        Privado
                    </div>
                )}

                <div className="text-[13.5px] leading-relaxed font-medium tracking-tight break-words">
                    {message.content}
                </div>

                <div className={cn(
                    "flex items-center justify-end gap-1.5 mt-1.5 opacity-60",
                    isMe ? "text-indigo-100" : "text-zinc-400"
                )}>
                    <span className="text-[9px] font-bold tracking-tighter">
                        {time}
                    </span>
                    {isMe && (
                        <div className="flex">
                            {message.is_read ? (
                                <div className="relative flex items-center">
                                    <CheckCheck className="h-3 w-3 text-cyan-400" />
                                    <div className="absolute inset-0 bg-cyan-400/20 blur-[4px] rounded-full" />
                                </div>
                            ) : (
                                <Check className="h-3 w-3 text-white/50" />
                            )}
                        </div>
                    )}
                </div>

                {/* Bubble Tail Replacement - subtle glow instead of sharp tail */}
                {isMe && (
                    <div className="absolute -right-1 -top-1 h-4 w-4 bg-indigo-500/20 blur-xl rounded-full pointer-events-none" />
                )}
            </div>
        </div>
    )
}
