'use client'
// Force rebuild for HMR reliability

import { useState, useEffect } from 'react'
import { ArrowLeft, ChevronLeft, LayoutDashboard, MessageSquare, Search, Home } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ChatLayout from "@/components/chat/chat-layout"
import ConversationList from "@/components/chat/conversation-list"
import MessageThread from "@/components/chat/message-thread"
import { useChat } from '@/providers/chat-provider'

export default function ChatPage() {
    const { setActiveConversationId } = useChat()
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
    const [mobileView, setMobileView] = useState<'list' | 'chat'>('list')

    const handleSelectConversation = (id: string) => {
        setSelectedConversationId(id)
        setActiveConversationId(id)
        setMobileView('chat')
    }

    const handleBack = () => {
        setMobileView('list')
        setSelectedConversationId(null)
        setActiveConversationId(null)
    }

    return (
        <ChatLayout>
            <div className="flex w-full h-screen bg-[#020203] relative overflow-hidden">
                {/* Background Glows */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

                {/* LEFT: Conversation List Pane */}
                <div className={`
                    w-full md:w-[400px] border-r border-white/5 bg-black/40 backdrop-blur-3xl flex flex-col z-10
                    ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}
                `}>
                    <div className="h-20 px-6 flex items-center justify-between border-b border-white/5 bg-white/5 backdrop-blur-xl shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.4)]">
                                <MessageSquare className="h-4 w-4 text-white" />
                            </div>
                            <h1 className="text-sm font-black text-white uppercase tracking-[0.2em]">Mensajes</h1>
                        </div>

                        <Link href="/dashboard/vendor">
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl">
                                <LayoutDashboard className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>

                    <ConversationList
                        selectedId={selectedConversationId}
                        onSelect={handleSelectConversation}
                    />
                </div>

                {/* RIGHT: Message Thread Pane */}
                <div className={`
                    flex-1 bg-black/20 backdrop-blur-sm flex flex-col relative z-0
                    ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}
                `}>
                    {selectedConversationId ? (
                        <MessageThread
                            conversationId={selectedConversationId}
                            onBack={handleBack}
                        />
                    ) : (
                        <div className="hidden md:flex flex-col items-center justify-center h-full text-zinc-500 p-12 text-center">
                            <div className="max-w-md animate-in fade-in zoom-in duration-700">
                                <div className="h-20 w-20 bg-zinc-900/50 rounded-[30px] border border-white/5 flex items-center justify-center mx-auto mb-8 shadow-inner">
                                    <MessageSquare className="h-8 w-8 text-zinc-700" />
                                </div>
                                <h3 className="text-xl font-black text-white mb-3 uppercase tracking-widest">Centro de Comunicación</h3>
                                <p className="text-[11px] text-zinc-600 font-bold uppercase tracking-[0.2em] leading-relaxed">
                                    Selecciona un cliente para iniciar la gestión CRM Americana.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ChatLayout>
    )
}
