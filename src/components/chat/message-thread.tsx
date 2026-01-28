import { ArrowLeft, Home, MoreVertical, Send, Shield, Zap, Store } from "lucide-react"
import { useChat } from "@/providers/chat-provider"
import { useEffect, useRef, useState } from "react"
import { ChatMessageBubble } from "./chat-message-bubble"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ProductSelector } from "./product-selector"
import { ProductCardMessage } from "./product-card-message"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface MessageThreadProps {
    conversationId: string
    onBack: () => void
}

export default function MessageThread({ conversationId, onBack }: MessageThreadProps) {
    const { messages, sendMessage, user, participantProfiles, conversations, activeOrder, typingUsers, setTyping } = useChat()
    const [messageInput, setMessageInput] = useState("")
    const scrollRef = useRef<HTMLDivElement>(null)
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const activeConv = conversations.find(c => c.id === conversationId)
    const otherProfile = participantProfiles.find(p => activeConv?.participants.includes(p.id) && p.id !== user?.id)

    const isOtherTyping = Object.values(typingUsers).some(v => v === true)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isOtherTyping])

    const handleSend = async () => {
        if (!messageInput.trim()) return
        const content = messageInput
        setMessageInput("")
        // Stop typing immediately on send
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
        setTyping(false)
        await sendMessage(content)
    }

    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessageInput(e.target.value)

        // Presence Typing Logic
        setTyping(true)
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
        typingTimeoutRef.current = setTimeout(() => {
            setTyping(false)
        }, 3000)
    }

    const handleProductSelect = async (product: any) => {
        // Use standard metadata format - Clean content for notification previews
        await sendMessage(`Compartió un producto: ${product.name}`, {
            type: 'product_card',
            productId: product.id,
            title: product.name,
            image: product.images?.[0] || '',
            price: Number(product.price),
            slug: product.slug,
            storeSlug: product.store_slug || activeConv?.store_id, // Ensure storeSlug is passed
            is_manual_share: true
        })
    }

    return (
        <div className="flex flex-col h-full bg-zinc-950/40 backdrop-blur-3xl relative">
            {/* Ambient Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />

            {/* Header */}
            <div className="h-20 px-6 flex items-center justify-between border-b border-white/5 bg-white/5 backdrop-blur-xl sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="md:hidden text-zinc-400 hover:text-white transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                    </button>

                    {/* Avatar */}
                    <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-white ring-1 ring-white/10 uppercase font-bold text-xs overflow-hidden">
                        {otherProfile?.avatar_url ? (
                            <img src={otherProfile.avatar_url} className="h-full w-full object-cover" />
                        ) : (
                            <span>{otherProfile?.full_name?.[0] || 'C'}</span>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-white tracking-tight">
                                {otherProfile?.full_name || 'Consulta Americana'}
                            </span>
                            <span className="px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-[7px] font-black uppercase tracking-[0.2em] text-indigo-300 border border-indigo-500/30">
                                CRM ACTIVO
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest leading-none">Canal Verificado</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Back to Dashboard Button */}
                    <Link href="/dashboard/vendor" className="hidden sm:block">
                        <Button variant="ghost" size="sm" className="text-[9px] uppercase font-black tracking-[0.2em] text-zinc-500 hover:text-white hover:bg-white/5 gap-2 px-3">
                            <Home className="h-3 w-3" /> Dashboard
                        </Button>
                    </Link>
                    <button className="p-2 text-zinc-500 hover:text-white transition-colors">
                        <MoreVertical className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Contextual Intelligence Bar (Order/Shipping/Product) */}
            {activeOrder ? (
                <div className="bg-indigo-600/10 border-b border-indigo-500/20 backdrop-blur-md px-6 py-2 flex items-center justify-between animate-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-indigo-300 uppercase tracking-widest">Pedido Reciente</span>
                            <span className="text-[10px] font-bold text-white uppercase tracking-tighter">#{activeOrder.id.split('-')[0]}</span>
                        </div>
                        <div className="h-6 w-px bg-white/5" />
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Estado</span>
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter flex items-center gap-1">
                                <Zap className="h-2 w-2 fill-current" /> {activeOrder.status}
                            </span>
                        </div>
                        {activeOrder.tracking_number && (
                            <>
                                <div className="h-6 w-px bg-white/5" />
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Rastreo</span>
                                    <span className="text-[10px] font-bold text-sky-400 uppercase tracking-tighter underline decoration-sky-400/30 cursor-pointer">
                                        {activeOrder.tracking_number}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 text-[8px] font-black uppercase text-indigo-300 hover:bg-indigo-500/20 border border-indigo-500/20">
                        Ver Detalles
                    </Button>
                </div>
            ) : activeConv?.context_type === 'product' ? (
                <div className="bg-zinc-900/50 border-b border-white/5 backdrop-blur-md px-6 py-2 flex items-center justify-between animate-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-500 overflow-hidden border border-white/5">
                            <Store className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-cyan-500 uppercase tracking-widest leading-tight">Interés en Producto</span>
                            <span className="text-[10px] font-bold text-white uppercase tracking-tighter truncate max-w-[150px]">
                                {activeConv.title || 'Consulta de Producto'}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-7 text-[8px] font-black uppercase text-zinc-400 hover:text-white hover:bg-white/5 border border-white/10">
                            Detalles
                        </Button>
                        <Button size="sm" className="h-7 text-[8px] font-black uppercase bg-white text-black hover:bg-zinc-200 px-3">
                            Generar Oferta
                        </Button>
                    </div>
                </div>
            ) : null}

            {/* Message List */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative z-10 scroll-smooth">
                {/* Security Badge - Simplified */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white/5 backdrop-blur-md rounded-full py-1.5 px-4 flex items-center gap-2 text-[9px] text-zinc-500 border border-white/5 uppercase tracking-[0.2em] font-black">
                        <Shield className="h-3 w-3 text-indigo-400" />
                        Privacidad Americana Garantizada
                    </div>
                </div>

                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-12 opacity-30">
                        <Zap className="h-12 w-12 text-zinc-500 mb-4" />
                        <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500">Inicia la conversación</h3>
                    </div>
                ) : (
                    Array.from(new Map(messages.map(m => [m.id, m])).values()).map((msg) => {
                        const isMe = msg.sender_id === user?.id

                        // 1. Check for Standard Metadata Card (New Architecture)
                        if (msg.metadata?.type === 'product_card') {
                            return (
                                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-4 w-full`}>
                                    <ProductCardMessage
                                        id={msg.metadata.productId || msg.metadata.product_id} // Support both casing versions
                                        name={msg.metadata.title || msg.metadata.product_name}
                                        price={msg.metadata.price || msg.metadata.product_price}
                                        imageUrl={msg.metadata.image || msg.metadata.product_image}
                                        slug={msg.metadata.slug || msg.metadata.product_slug}
                                        storeSlug={msg.metadata.storeSlug || msg.metadata.store_slug}
                                    />
                                </div>
                            )
                        }

                        return (
                            <ChatMessageBubble
                                key={msg.id}
                                message={msg}
                                isMe={isMe}
                            />
                        )
                    })
                )}

                {/* Typing Indicator */}
                {isOtherTyping && (
                    <div className="flex justify-start animate-in fade-in slide-in-from-left-2 duration-300">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2 flex items-center gap-2 border border-white/5">
                            <div className="flex gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-cyan-500/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="h-1.5 w-1.5 rounded-full bg-cyan-500/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="h-1.5 w-1.5 rounded-full bg-cyan-500/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Escribiendo...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/5 bg-black/40 backdrop-blur-xl relative z-20">
                <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5 focus-within:border-indigo-500/50 transition-all shadow-inner max-w-4xl mx-auto">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button size="icon" variant="ghost" className="text-zinc-500 hover:text-white hover:bg-white/10 shrink-0 h-10 w-10 rounded-xl transition-all">
                                <Store className="h-5 w-5" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-transparent border-none" align="start" side="top">
                            <ProductSelector onSelect={handleProductSelect} />
                        </PopoverContent>
                    </Popover>
                    <input
                        className="flex-1 bg-transparent border-none focus:outline-none text-white placeholder:text-zinc-600 px-4 h-12 text-sm font-medium"
                        placeholder="Escribe un mensaje de lujo..."
                        value={messageInput}
                        onChange={handleTyping}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!messageInput.trim()}
                        className={`h-10 w-10 flex items-center justify-center rounded-xl shadow-lg transition-all active:scale-95 ${messageInput.trim()
                            ? 'bg-white text-black hover:bg-zinc-200'
                            : 'bg-zinc-800 text-zinc-600'
                            }`}
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}
