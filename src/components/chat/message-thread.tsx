import { ArrowLeft, Info, Image as ImageIcon, SendHorizontal, Lock, ShieldCheck } from "lucide-react"
import { useChat } from "@/providers/chat-provider"
import { useEffect, useRef, useState } from "react"

interface MessageThreadProps {
    conversationId: string
    onBack: () => void
}

export function MessageThread({ conversationId, onBack }: MessageThreadProps) {
    const { messages, sendMessage, user, activeConversationId, isSecure } = useChat()
    const [messageInput, setMessageInput] = useState("")
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSend = async () => {
        if (!messageInput.trim()) return
        const content = messageInput
        setMessageInput("")
        await sendMessage(content)
    }

    return (
        <div className="flex flex-col h-full bg-black">
            {/* Header */}
            <div className="h-14 px-4 flex items-center justify-between border-b border-zinc-800 bg-black/80 backdrop-blur-xl sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="md:hidden text-zinc-400 hover:text-white">
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div className="flex flex-col">
                        <span className="font-bold text-white text-sm flex items-center gap-2">
                            Secure Channel
                            {isSecure && <ShieldCheck className="h-3 w-3 text-cyan-500" />}
                        </span>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Signal-Grade Encryption</span>
                    </div>
                </div>
                <Info className="h-5 w-5 text-zinc-500 hover:text-white cursor-pointer" />
            </div>

            {/* Message List */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {/* Security Notice */}
                <div className="flex justify-center my-4">
                    <div className="bg-zinc-900/30 rounded-lg py-2 px-4 flex items-center gap-2 text-[10px] text-zinc-500 border border-white/5 uppercase tracking-wider">
                        <Lock className="h-3 w-3 text-cyan-500" />
                        End-to-End Encrypted
                    </div>
                </div>

                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`
                            max-w-[80%] rounded-2xl px-4 py-2 text-sm
                            ${msg.sender_id === user?.id
                                ? 'bg-zinc-50 text-black rounded-tr-sm'
                                : 'bg-zinc-900 text-white rounded-tl-sm border border-white/5'
                            }
                        `}>
                            {msg.content}
                            <div className={`text-[9px] mt-1 opacity-50 font-bold ${msg.sender_id === user?.id ? 'text-right' : 'text-left'}`}>
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-zinc-800 bg-black">
                <div className="bg-zinc-900/50 rounded-2xl flex items-center px-4 py-2 gap-3 border border-zinc-700 focus-within:border-cyan-500/50 transition-colors">
                    <ImageIcon className="h-5 w-5 text-zinc-500 cursor-pointer hover:text-white" />
                    <input
                        className="flex-1 bg-transparent border-none focus:outline-none text-white placeholder:text-zinc-600 h-10 text-sm"
                        placeholder="Type a secure message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!messageInput.trim()}
                        className={`transition-colors p-2 rounded-full ${messageInput.trim() ? 'text-cyan-500 hover:bg-cyan-500/10' : 'text-zinc-800'}`}
                    >
                        <SendHorizontal className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}
