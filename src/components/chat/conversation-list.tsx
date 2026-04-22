import React from "react"
import { Search } from "lucide-react"
import { useChat } from "@/providers/chat-provider"
import { formatDistanceToNow } from "date-fns"
import { useVendor } from "@/providers/vendor-provider"

interface ConversationListProps {
    selectedId: string | null
    onSelect: (id: string) => void
}

export default function ConversationList({ selectedId, onSelect }: ConversationListProps) {
    const { conversations, isLoading, user, participantProfiles } = useChat()
    const { activeStore } = useVendor()

    const filteredConversations = conversations.filter(c => {
        if (!activeStore) return true
        return c.store_id === activeStore.id
    })

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm">
                Loading conversations...
            </div>
        )
    }

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
            {/* Search Bar */}
            <div className="px-5 py-4">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-cyan-500 transition-colors" />
                    <input
                        className="w-full bg-white/5 border border-white/5 focus:border-cyan-500/50 rounded-2xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:bg-white/10 transition-all placeholder:text-zinc-600 font-medium shadow-inner"
                        placeholder="Search Lead / Customer..."
                    />
                </div>
            </div>

            {/* List */}
            <div className="px-2 pb-6 space-y-1">
                {filteredConversations.length === 0 ? (
                    <div className="p-12 text-center text-zinc-600 text-[10px] uppercase tracking-[0.3em] font-black">
                        {activeStore ? `Sin mensajes para ${activeStore.name}` : 'Sin mensajes aún'}
                    </div>
                ) : (
                    filteredConversations.map((conv) => {
                        const otherProfile = participantProfiles.find(p => conv.participants.includes(p.id) && p.id !== user?.id)
                        const displayName = otherProfile?.full_name || conv.title || 'Consulta Americana'
                        const isSelected = selectedId === conv.id

                        return (
                            <div
                                key={conv.id}
                                onClick={() => onSelect(conv.id)}
                                className={`
                                    group relative px-4 py-4 cursor-pointer transition-all rounded-2xl flex items-center gap-4
                                    ${isSelected
                                        ? "bg-white/10 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]"
                                        : "hover:bg-white/5 border border-transparent hover:border-white/5"
                                    }
                                `}
                            >
                                {/* Avatar with status */}
                                <div className="relative shrink-0">
                                    <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white overflow-hidden ring-1 ring-white/10 uppercase font-black text-xs transition-transform duration-500 ${isSelected ? 'scale-110' : 'group-hover:scale-105'}`}>
                                        {otherProfile?.avatar_url ? (
                                            <img src={otherProfile.avatar_url} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full bg-linear-to-br from-zinc-800 to-zinc-950 flex items-center justify-center">
                                                {displayName[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-zinc-950 shadow-[0_0_10px_#10b981]" />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h4 className={`font-bold text-xs truncate uppercase tracking-tight transition-colors ${isSelected ? 'text-white' : 'text-zinc-400 group-hover:text-white'}`}>
                                            {displayName}
                                        </h4>
                                        <span className="text-[8px] text-zinc-600 font-black uppercase tracking-tighter">
                                            {formatDistanceToNow(new Date(conv.updated_at), { addSuffix: false }).replace('about ', '')}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className={`text-[11px] truncate font-medium ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                                            {conv.last_message_preview || 'Abriendo canal de comunicación...'}
                                        </p>
                                        {(conv.unread_count ?? 0) > 0 && (
                                            <div className="h-4 min-w-[16px] px-1 rounded-full bg-cyan-500 text-black text-[8px] font-black flex items-center justify-center">
                                                {conv.unread_count}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Active Glow */}
                                {isSelected && (
                                    <div className="absolute -left-1 top-4 bottom-4 w-1 bg-cyan-500 rounded-full shadow-[0_0_15px_#06b6d4]" />
                                )}
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}
