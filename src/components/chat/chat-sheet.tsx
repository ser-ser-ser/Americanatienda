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
import { ChatMessageBubble } from './chat-message-bubble'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChatLockScreen } from './chat-lock-screen'
import MessageThread from './message-thread'

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
        user,
        participantProfiles
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

    const otherParticipant = participantProfiles.find(p => p.id !== user?.id)

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent className="w-full sm:max-w-md p-0 flex flex-col bg-zinc-950/40 backdrop-blur-3xl border-l border-white/5 text-white shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />
                <SheetTitle className="sr-only">Americana CRM Chat</SheetTitle>
                <SheetDescription className="sr-only">Direct communication with your clients or stores</SheetDescription>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden relative flex flex-col h-full">
                    {activeConversationId ? (
                        <MessageThread
                            conversationId={activeConversationId}
                            onBack={() => setActiveConversationId(null)}
                        />
                    ) : (
                        <>
                            {/* List Header */}
                            <div className="p-5 border-b border-white/5 flex items-center gap-3 relative z-10 bg-white/5 backdrop-blur-md shrink-0">
                                <div className="py-2">
                                    <h2 className="font-black text-xl tracking-tighter uppercase italic">CRM Americana</h2>
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em]">Premier Business Suite</p>
                                </div>
                            </div>

                            {/* CONVERSATIONS LIST VIEW */}
                            <ScrollArea className="flex-1">
                                <div className="p-2 space-y-1">
                                    {!user ? (
                                        <div className="flex flex-col items-center justify-center py-20 px-6 text-center space-y-4">
                                            <div className="h-12 w-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500">
                                                <User className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white">Identity Required</h3>
                                                <p className="text-xs text-zinc-500 mt-1">You must be logged in to chat with boutiques and secure your data.</p>
                                            </div>
                                            <Button
                                                onClick={() => router.push(`/login?next=${pathname}`)}
                                                className="w-full bg-white text-black hover:bg-zinc-200"
                                            >
                                                Sign In to Americana
                                            </Button>
                                        </div>
                                    ) : conversations.length === 0 ? (
                                        <div className="text-center py-10 text-zinc-500 text-sm">
                                            No tienes mensajes aún.
                                        </div>
                                    ) : (
                                        conversations.map(conv => (
                                            <button
                                                key={conv.id}
                                                onClick={() => setActiveConversationId(conv.id)}
                                                className="w-full text-left p-3 rounded-xl hover:bg-white/5 transition-colors flex items-center gap-3 group border border-transparent hover:border-white/5"
                                            >
                                                <div className="relative">
                                                    <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-700 transition-colors">
                                                        {conv.type === 'support' ? <User className="h-5 w-5" /> : <Store className="h-5 w-5" />}
                                                    </div>
                                                    <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-zinc-950 bg-emerald-500 shadow-[0_0_5px_#10b981]" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-baseline mb-0.5">
                                                        <span className="font-bold text-xs truncate text-zinc-100 uppercase tracking-tighter">
                                                            {conv.title || (conv.type === 'support' ? 'Soporte Americana' : 'Consulta de Producto')}
                                                        </span>
                                                        <span className="text-[9px] font-bold text-zinc-600 uppercase">
                                                            {new Date(conv.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-zinc-500 truncate font-medium">
                                                        {conv.last_message_preview || 'Sin mensajes nuevos'}
                                                    </p>
                                                </div>
                                                {conv.last_message_preview && (
                                                    <div className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                                                )}
                                            </button>
                                        ))
                                    )}
                                </div>
                            </ScrollArea>
                        </>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}
