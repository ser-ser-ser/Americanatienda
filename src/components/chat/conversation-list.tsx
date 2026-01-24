'use client'

import React from "react"
import { Search } from "lucide-react"

interface ConversationListProps {
    selectedId: string | null
    onSelect: (id: string) => void
}

export function ConversationList({ selectedId, onSelect }: ConversationListProps) {
    // Mock Data for now
    const conversations = [
        { id: '1', name: 'Americana Support', preview: 'Welcome to the club. Let us know if you need anything.', time: '2m', unread: true, verified: true },
        { id: '2', name: 'Crypto Buyer #882', preview: 'Is the payment confirmed via Bitso?', time: '1h', unread: false, verified: false },
        { id: '3', name: 'Logistics', preview: 'Shipment #9910 has been delivered.', time: '1d', unread: false, verified: true },
    ]

    return (
        <div className="flex-1 overflow-y-auto">
            {/* Search Bar */}
            <div className="px-4 py-2">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-pink-500 transition-colors" />
                    <input
                        className="w-full bg-zinc-900/50 border border-transparent focus:border-pink-500/50 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:bg-black transition-all"
                        placeholder="Search Direct Messages"
                    />
                </div>
            </div>

            {/* List */}
            <div className="mt-2">
                {conversations.map((conv) => (
                    <div
                        key={conv.id}
                        onClick={() => onSelect(conv.id)}
                        className={`
                            px-4 py-3 cursor-pointer transition-colors border-b border-zinc-900/50 hover:bg-zinc-900/40
                            ${selectedId === conv.id ? "bg-zinc-900/60 border-r-2 border-r-pink-500" : ""}
                        `}
                    >
                        <div className="flex gap-3">
                            {/* Avatar */}
                            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-800 flex items-center justify-center shrink-0">
                                <span className="text-sm font-bold">{conv.name[0]}</span>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h4 className="font-bold text-sm text-white truncate flex items-center gap-1">
                                        {conv.name}
                                        {conv.verified && <div className="h-3 w-3 rounded-full bg-white text-black flex items-center justify-center text-[8px] font-black">✓</div>}
                                    </h4>
                                    <span className="text-xs text-zinc-500 whitespace-nowrap ml-2">{conv.time}</span>
                                </div>
                                <p className={`text-sm truncate ${conv.unread ? 'text-white font-medium' : 'text-zinc-500'}`}>
                                    {conv.preview}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
