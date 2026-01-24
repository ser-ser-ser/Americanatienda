'use client'

import React, { useState } from "react"
import { ChatLayout } from "@/components/chat/chat-layout"
import { ConversationList } from "@/components/chat/conversation-list"
import { MessageThread } from "@/components/chat/message-thread"

export default function ChatPage() {
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
    const [mobileView, setMobileView] = useState<'list' | 'chat'>('list')

    const handleSelectConversation = (id: string) => {
        setSelectedConversationId(id)
        setMobileView('chat')
    }

    const handleBack = () => {
        setMobileView('list')
        setSelectedConversationId(null)
    }

    return (
        <ChatLayout>
            <div className="flex w-full h-full border-t border-zinc-900 md:border-t-0">

                {/* LEFT: Conversation List */}
                <div className={`
                    w-full md:w-[380px] md:border-r md:border-zinc-800 bg-black flex flex-col
                    ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}
                `}>
                    <div className="p-4 border-b border-zinc-800 flex justify-between items-center sticky top-0 bg-black/80 backdrop-blur-xl z-10">
                        <h1 className="text-xl font-bold text-white tracking-tight">Messages</h1>
                        {/* New Message Icon */}
                    </div>
                    <ConversationList
                        selectedId={selectedConversationId}
                        onSelect={handleSelectConversation}
                    />
                </div>

                {/* RIGHT: Message Thread */}
                <div className={`
                    flex-1 bg-black flex flex-col relative
                    ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}
                `}>
                    {selectedConversationId ? (
                        <MessageThread
                            conversationId={selectedConversationId}
                            onBack={handleBack}
                        />
                    ) : (
                        <div className="hidden md:flex flex-col items-center justify-center h-full text-zinc-500">
                            <div className="text-center p-8">
                                <h3 className="text-2xl font-bold text-white mb-2">Select a message</h3>
                                <p>Choose from your existing conversations, start a new one, or just keep swimming.</p>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </ChatLayout>
    )
}
