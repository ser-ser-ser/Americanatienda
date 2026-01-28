'use client'

import { useChat } from '@/providers/chat-provider'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, ArrowLeft, Store, User, Clock } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { ProductCardMessage } from './product-card-message'
import { ProductSelector } from './product-selector'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChatLockScreen } from './chat-lock-screen'

export function ChatSheet() {
    const {
        isOpen,
        setIsOpen,
        activeConversationId,
        setActiveConversationId,
        conversations,
        messages,
        sendMessage,
        toggleEphemeralMode,
        isLoading,
        user
    } = useChat()

    const [input, setInput] = useState('')
    const scrollRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages])

    const handleSend = async () => {
        if (!input.trim()) return
        await sendMessage(input)
        setInput('')
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const handleProductSelect = async (product: any) => {
        await sendMessage('Sent a product', {
            type: 'product_card',
            product_id: product.id,
            product_name: product.name,
            product_price: product.price,
            product_image: product.images?.[0] || ''
        })
    }

    const activeConversation = conversations.find(c => c.id === activeConversationId)

    const handleEphemeralCycle = () => {
        const current = activeConversation?.ephemeral_duration
        let next = null
        if (!current) next = '1h'
        else if (current === '1h') next = '24h'
        else next = null

        toggleEphemeralMode(next)
    }

    const [isUnlocked, setIsUnlocked] = useState(false)

    const handleUnlock = () => {
        setIsUnlocked(true)
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent className="w-full sm:max-w-md p-0 flex flex-col bg-zinc-950 border-white/10 text-white">
                <SheetTitle className="sr-only">Stealth Chat Interface</SheetTitle>
                <SheetDescription className="sr-only">Secure messaging with end-to-end encryption</SheetDescription>
                {!isUnlocked ? (
                    <div className="h-full w-full">
                        <ChatLockScreen onUnlock={handleUnlock} />
                    </div>
                ) : (
                    <>

                        {/* Header */}
                        <div className="p-4 border-b border-white/10 flex items-center gap-3">
                            {activeConversationId ? (
                                <>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 -ml-2 text-zinc-400 hover:text-white"
                                        onClick={() => setActiveConversationId(null)}
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                    </Button>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h2 className="font-bold text-sm">
                                                {activeConversation?.title || (activeConversation?.type === 'support' ? 'Soporte' : 'Chat')}
                                            </h2>
                                            {activeConversation?.context_type && (
                                                <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-bold uppercase tracking-widest text-zinc-400 border border-white/5">
                                                    {activeConversation.context_type}: #{activeConversation.context_id?.slice(0, 8)}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-zinc-400 flex items-center gap-1">
                                            En línea
                                            {activeConversation?.ephemeral_duration && (
                                                <span className="text-pink-500 font-medium ml-1 flex items-center gap-0.5">
                                                    <Clock className="h-3 w-3" />
                                                    {activeConversation.ephemeral_duration}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleEphemeralCycle}
                                        className={cn("h-8 w-8", activeConversation?.ephemeral_duration ? "text-pink-500" : "text-zinc-500")}
                                        title="Toggle Disappearing Messages"
                                    >
                                        <Clock className="h-4 w-4" />
                                    </Button>
                                </>
                            ) : (
                                <div>
                                    <h2 className="font-bold text-lg">Mensajes</h2>
                                    <p className="text-xs text-zinc-400">Tus conversaciones activas</p>
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-hidden relative">
                            {activeConversationId ? (
                                // MESSAGES VIEW
                                <div className="h-full flex flex-col">
                                    <ScrollArea className="flex-1 p-4">
                                        <div className="space-y-4">
                                            {messages.map((msg) => {
                                                const isMe = user?.id === msg.sender_id
                                                return (
                                                    <div key={msg.id} className={cn("flex flex-col gap-1", isMe ? "items-end" : "items-start")}>
                                                        <div className={cn(
                                                            "max-w-[85%] rounded-2xl px-4 py-2 text-sm text-white",
                                                            isMe ? "bg-indigo-600 rounded-tr-sm" : "bg-zinc-800 rounded-tl-sm"
                                                        )}>
                                                            {msg.metadata?.type === 'product_card' ? (
                                                                <ProductCardMessage
                                                                    id={msg.metadata.product_id}
                                                                    name={msg.metadata.product_name}
                                                                    price={msg.metadata.product_price}
                                                                    imageUrl={msg.metadata.product_image}
                                                                />
                                                            ) : (
                                                                msg.content
                                                            )}
                                                        </div>
                                                        <span className="text-[10px] text-zinc-500 px-1">
                                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                )
                                            })}
                                            <div ref={scrollRef} />
                                        </div>
                                    </ScrollArea>

                                    {/* Input Area */}
                                    <div className="p-4 border-t border-white/10 bg-zinc-950">
                                        <div className="flex gap-2">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button size="icon" variant="ghost" className="text-zinc-500 hover:text-white shrink-0">
                                                        <Store className="h-5 w-5" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0 bg-transparent border-none" align="start" side="top">
                                                    <ProductSelector onSelect={handleProductSelect} />
                                                </PopoverContent>
                                            </Popover>
                                            <Input
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                                placeholder="Escribe un mensaje..."
                                                className="bg-zinc-900 border-white/10 text-white focus-visible:ring-indigo-500"
                                            />
                                            <Button onClick={handleSend} size="icon" className="bg-indigo-600 hover:bg-indigo-700 shrink-0">
                                                <Send className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // CONVERSATIONS LIST VIEW
                                <ScrollArea className="h-full">
                                    <div className="p-2 space-y-1">
                                        {conversations.length === 0 ? (
                                            <div className="text-center py-10 text-zinc-500 text-sm">
                                                No tienes mensajes aún.
                                            </div>
                                        ) : (
                                            conversations.map(conv => (
                                                <button
                                                    key={conv.id}
                                                    onClick={() => setActiveConversationId(conv.id)}
                                                    className="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-3 group"
                                                >
                                                    <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-zinc-700 transition-colors">
                                                        {conv.type === 'support' ? <User className="h-5 w-5" /> : <Store className="h-5 w-5" />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-baseline mb-1">
                                                            <span className="font-semibold text-sm truncate text-zinc-200">
                                                                {conv.title || (conv.type === 'support' ? 'Soporte' : 'Consulta')}
                                                            </span>
                                                            <span className="text-[10px] text-zinc-500">
                                                                {new Date(conv.updated_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-zinc-500 truncate">
                                                            Ver conversación...
                                                        </p>
                                                    </div>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </ScrollArea>
                            )}
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    )
}
