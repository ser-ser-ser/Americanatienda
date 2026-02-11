'use client'

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { usePathname, useRouter } from 'next/navigation'

type Message = {
    id: string
    conversation_id: string
    content: string
    sender_id: string
    created_at: string
    is_read: boolean
    metadata?: any // Computed property from payload or other sources
    payload?: any // Explicit column match for DB
}

type Conversation = {
    id: string
    type: 'support' | 'inquiry' | 'order' | 'product'
    context_type?: 'order' | 'product' | 'support'
    context_id?: string
    title?: string
    store_id?: string
    updated_at: string
    last_message_preview?: string
    ephemeral_duration?: string
    participants: string[]
    unread_count?: number
}

type ChatContextType = {
    conversations: Conversation[]
    activeConversationId: string | null
    messages: Message[]
    isOpen: boolean
    isLoading: boolean
    isSecure: boolean
    setActiveConversationId: (id: string | null) => void
    setIsOpen: (open: boolean) => void
    sendMessage: (content: string, metadata?: any) => Promise<void>
    startSupportChat: () => Promise<void>
    startInquiryChat: (storeId: string, productData?: any) => Promise<void>
    openContextualChat: (type: 'order' | 'product' | 'support', id: string, participants: string[], metadata?: any) => Promise<void>
    toggleEphemeralMode: (duration: string | null) => Promise<void>
    bubbleColors: { me: string, other: string }
    setBubbleColors: (colors: { me: string, other: string }) => void
    user: any
    participantProfiles: any[]
    activeOrder: any
    typingUsers: Record<string, boolean>
    setTyping: (isTyping: boolean) => Promise<void>
    startConversation: (targetUserId: string, metadata?: any) => Promise<void>
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
    const supabase = createClient()
    const router = useRouter()
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [bubbleColors, setBubbleColors] = useState({ me: 'bg-indigo-600', other: 'bg-white' })
    const [participantProfiles, setParticipantProfiles] = useState<any[]>([])
    const [activeOrder, setActiveOrder] = useState<any>(null)
    const pathname = usePathname()

    const isMounted = useRef(true)
    useEffect(() => {
        isMounted.current = true
        return () => { isMounted.current = false }
    }, [])

    // 1. Initialize User and Global Listener
    useEffect(() => {
        let channel: any;

        const initUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            const authUser = session?.user
            if (!authUser || !isMounted.current) return
            setUser(authUser)

            if (isMounted.current) fetchConversations(authUser.id)

            // Realtime subscription for NEW conversations where I am a participant
            channel = supabase.channel(`conversations:${authUser.id}`)
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'conversation_participants', filter: `user_id=eq.${authUser.id}` },
                    () => isMounted.current && fetchConversations(authUser.id)
                )
                .subscribe()
        }
        initUser()

        return () => { if (channel) supabase.removeChannel(channel) }
    }, [])

    const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({})
    const [presenceChannel, setPresenceChannel] = useState<any>(null)

    const conversationsRef = useRef<Conversation[]>([])
    useEffect(() => {
        conversationsRef.current = conversations
    }, [conversations])

    // 2. Global Message Listener (for sidebar & unread counts)
    useEffect(() => {
        if (!user) return

        const globalChannel = supabase.channel(`global_messages:${user.id}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages' },
                async (payload: any) => {
                    const newMessage = payload.new as Message

                    const currentConvs = conversationsRef.current
                    const isForMe = currentConvs.some(c => c.id === newMessage.conversation_id)

                    if (!isMounted.current) return

                    // Update Active Thread if it matches
                    if (newMessage.conversation_id === activeConversationId) {
                        setMessages(prev => {
                            const mergedMap = new Map()
                            prev.forEach((m: Message) => mergedMap.set(m.id, m))
                            // Map payload -> metadata for the new message
                            const msgWithMeta = { ...newMessage, metadata: newMessage.payload || newMessage.metadata }
                            mergedMap.set(newMessage.id, msgWithMeta)
                            return Array.from(mergedMap.values())
                                .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                        })
                        if (newMessage.sender_id !== user.id) {
                            await supabase.from('messages').update({ is_read: true }).eq('id', newMessage.id)
                        }
                    }

                    // Update Conversation List (Move to top, preview, unread count)
                    setConversations(prev => {
                        const filtered = prev.filter(c => c.id !== newMessage.conversation_id)
                        const active = prev.find(c => c.id === newMessage.conversation_id)
                        if (active) {
                            const isNewUnread = newMessage.sender_id !== user.id && newMessage.conversation_id !== activeConversationId
                            return [{
                                ...active,
                                last_message_preview: newMessage.content.slice(0, 60),
                                updated_at: newMessage.created_at,
                                unread_count: isNewUnread ? (active.unread_count || 0) + 1 : active.unread_count
                            }, ...filtered]
                        } else {
                            if (isMounted.current) fetchConversations(user.id)
                            return prev
                        }
                    })
                }
            )
            .subscribe()

        return () => { supabase.removeChannel(globalChannel) }
    }, [user?.id, activeConversationId])

    // 3. Active Conversation Logic (Fetch & Presence)
    useEffect(() => {
        if (!activeConversationId) {
            setMessages([])
            setTypingUsers({})
            return
        }

        const fetchMessagesAndContext = async () => {
            setIsLoading(true)
            const activeConv = conversations.find(c => c.id === activeConversationId)

            // 1. Fetch Profiles & Context
            if (activeConv) {
                const { data: profiles } = await supabase
                    .from('profiles')
                    .select('id, full_name, avatar_url, role')
                    .in('id', activeConv.participants)
                if (profiles && isMounted.current) setParticipantProfiles(profiles)

                try {
                    const { getContextualOrder } = await import('@/lib/chat/context-utils')
                    const order = await getContextualOrder(supabase, activeConversationId)
                    if (isMounted.current) setActiveOrder(order)
                } catch (e) { console.error("Context fetch failed:", e) }
            }

            // 2. Fetch Messages
            const { data } = await supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', activeConversationId)
                .order('created_at', { ascending: true })

            if (data) {
                if (!isMounted.current) return

                // Functional merge to avoid race with global listener & fix duplicate keys
                setMessages(current => {
                    const mergedMap = new Map()
                    current.forEach((m: Message) => mergedMap.set(m.id, m))
                    data.forEach((m: any) => {
                        // Map payload to metadata
                        const msg = { ...m, metadata: m.payload || m.metadata }
                        mergedMap.set(msg.id, msg)
                    })
                    return Array.from(mergedMap.values())
                        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                })

                // Mark all as read
                const unreadIds = data.filter((m: Message) => !m.is_read && m.sender_id !== user?.id).map((m: Message) => m.id)
                if (unreadIds.length > 0) {
                    await supabase.from('messages').update({ is_read: true }).in('id', unreadIds)
                    // Update local unread count for this conversation
                    if (isMounted.current) {
                        setConversations(prev => prev.map(c => c.id === activeConversationId ? { ...c, unread_count: 0 } : c))
                    }
                }
            }
            if (isMounted.current) setIsLoading(false)
        }

        fetchMessagesAndContext()

        // 2. Presence for this specific chat
        const pChannel = supabase.channel(`presence:${activeConversationId}`, {
            config: { presence: { key: user?.id } }
        })

        pChannel
            .on('presence', { event: 'sync' }, () => {
                const state = pChannel.presenceState()
                const typing: Record<string, boolean> = {}
                Object.keys(state).forEach(userId => {
                    if (userId !== user?.id) {
                        typing[userId] = (state[userId] as any).some((p: any) => p.isTyping)
                    }
                })
                setTypingUsers(typing)
            })
            .subscribe(async (status: string) => {
                if (status === 'SUBSCRIBED') { await pChannel.track({ isTyping: false }) }
            })

        setPresenceChannel(pChannel)

        return () => { supabase.removeChannel(pChannel) }
    }, [activeConversationId, user?.id])

    const setTyping = async (isTyping: boolean) => {
        if (presenceChannel) {
            await presenceChannel.track({ isTyping })
        }
    }

    const fetchConversations = async (userId: string) => {
        try {
            // 1. Get all conversation IDs where I am a participant OR creator
            // Resilience against race conditions where participants might not be added or visible yet
            const [partsRes, convsRes] = await Promise.all([
                supabase.from('conversation_participants').select('conversation_id').eq('user_id', userId),
                supabase.from('conversations').select('id').eq('created_by', userId)
            ])

            if (partsRes.error) console.error("Error fetching participations:", partsRes.error)
            if (convsRes.error) console.error("Error fetching owned conversations:", convsRes.error)

            const convoIds = Array.from(new Set([
                ...(partsRes.data || []).map((p: any) => p.conversation_id),
                ...(convsRes.data || []).map((c: any) => c.id)
            ]))

            if (convoIds.length === 0) {
                if (isMounted.current) setConversations([])
                return
            }

            // 2. Fetch those conversations
            const { data: convs, error: fetchErr } = await supabase
                .from('conversations')
                .select('*, conversation_participants(user_id, role)')
                .in('id', convoIds)
                .order('updated_at', { ascending: false })

            if (fetchErr) throw fetchErr

            if (convs) {
                // Map participants array for compatibility with types
                const processedConvs: Conversation[] = convs.map((c: any) => ({
                    ...c,
                    participants: (c.conversation_participants || []).map((p: any) => p.user_id)
                }))

                // 3. Fetch unread counts
                const { data: unreadCounts } = await supabase
                    .from('messages')
                    .select('conversation_id')
                    .eq('is_read', false)
                    .neq('sender_id', userId)
                    .in('conversation_id', convoIds)

                const countsMap = unreadCounts?.reduce((acc: any, msg: any) => {
                    acc[msg.conversation_id] = (acc[msg.conversation_id] || 0) + 1
                    return acc
                }, {}) || {}

                const convsWithCounts = processedConvs.map(c => ({
                    ...c,
                    unread_count: countsMap[c.id] || 0
                }))

                if (isMounted.current) setConversations(convsWithCounts)

                // 4. Bulk Fetch Profiles for Sidebar
                const allParticipants = new Set<string>()
                processedConvs.forEach((c: Conversation) => c.participants.forEach((p: string) => allParticipants.add(p)))

                if (allParticipants.size > 0) {
                    const { data: profiles } = await supabase
                        .from('profiles')
                        .select('id, full_name, avatar_url, role')
                        .in('id', Array.from(allParticipants))

                    if (profiles && isMounted.current) {
                        setParticipantProfiles(prev => {
                            const merged = [...prev]
                            profiles.forEach((p: any) => {
                                if (!merged.find((m: any) => m.id === p.id)) merged.push(p)
                            })
                            return merged
                        })
                    }
                }
            }
        } catch (error) {
            console.error("fetchConversations fatal error:", error)
        }
    }

    const sendMessage = async (content: string, metadata: any = {}) => {
        if (!activeConversationId || !user) return

        const activeConv = conversations.find(c => c.id === activeConversationId)
        if (!activeConv) return

        try {
            // 1. Optimistic Updates for instant feedback
            const optimisticId = crypto.randomUUID()
            const now = new Date().toISOString()
            const optimisticMsg: Message = {
                id: optimisticId,
                conversation_id: activeConversationId,
                sender_id: user.id,
                content: content,
                created_at: now,
                is_read: true,
                metadata: { ...metadata, is_crm: true, is_optimistic: true }
            }

            // Update messages thread immediately
            setMessages(prev => [...prev, optimisticMsg])

            // Update conversation list immediately (move to top, update preview)
            setConversations(prev => {
                const filtered = prev.filter(c => c.id !== activeConversationId)
                const active = prev.find(c => c.id === activeConversationId)
                if (active) {
                    return [{
                        ...active,
                        last_message_preview: content.slice(0, 60) + (content.length > 60 ? '...' : ''),
                        updated_at: now
                    }, ...filtered]
                }
                return prev
            })

            // 2. Persistent Save
            const { data: newMsg, error: msgError } = await supabase.from('messages').insert({
                conversation_id: activeConversationId,
                sender_id: user.id,
                content: content,
                is_read: false,
                payload: { ...metadata, is_crm: true, sender_name: user.email?.split('@')[0] }
            }).select().single()

            if (msgError) throw msgError

            // Replace optimistic with real message if needed (or just let realtime handle it)
            if (newMsg && isMounted.current) {
                setMessages(prev => prev.map(m => m.id === optimisticId ? newMsg : m))
            }

            // Persistent update for conversation preview
            await supabase.from('conversations')
                .update({
                    updated_at: now
                })
                .eq('id', activeConversationId)

            // 2. Notifications
            const recipients = activeConv.participants.filter(pId => pId !== user.id)
            if (recipients.length > 0) {
                await supabase.from('notifications').insert(recipients.map(rId => ({
                    user_id: rId,
                    type: 'chat_message',
                    title: `Nuevo mensaje de ${user.email?.split('@')[0] || 'Americana'}`,
                    message: content.length > 50 ? content.substring(0, 50) + '...' : content,
                    link: `/dashboard/chat?id=${activeConversationId}`
                })))
            }
        } catch (error: any) {
            toast.error(`Error de conexión: ${error.message}`)
            console.error("Chat Send Error:", error)
        }
    }



    const startInquiryChat = async (storeId: any, productData?: any) => {
        // 1. Validate Session (Double check to avoid false logouts)
        let currentUser = user
        if (!currentUser) {
            const { data } = await supabase.auth.getUser()
            currentUser = data.user
        }

        if (!currentUser) {
            console.warn("[Chat] Attempted to start chat without session")
            router.push(`/login?next=${pathname}`)
            return
        }
        const tid = toast.loading("Conectando con vendedor...")

        try {
            // 1. Llamada atómica a la DB (Busca o Crea en un solo paso)
            const { data: conversationId, error } = await supabase
                .rpc('get_or_create_conversation', {
                    p_store_id: storeId
                })

            if (error) throw error
            if (!conversationId) throw new Error('No conversation returned')

            // Fetch conversations to ensure UI list is updated immediately
            if (isMounted.current) await fetchConversations(currentUser.id)

            // 2. Si hay contexto de producto (Product Card), enviamos el mensaje
            if (productData) {
                // Ensure we have product data (could be ID string or object)
                let finalProduct = productData
                if (typeof productData === 'string') {
                    const { data } = await supabase.from('products').select('*').eq('id', productData).single()
                    finalProduct = data
                }

                // Ensure we have store slug for the link
                let storeSlug = finalProduct.storeSlug || finalProduct.store_slug || ''
                if (!storeSlug) {
                    const { data: store } = await supabase.from('stores').select('slug').eq('id', storeId).single()
                    storeSlug = store?.slug
                }

                if (finalProduct) {
                    const friendlyContent = `Consulta: ${finalProduct.name}`
                    const cardMetadata = {
                        type: 'product_card',
                        productId: finalProduct.id,
                        title: finalProduct.name,
                        image: Array.isArray(finalProduct.images) ? finalProduct.images[0] : (typeof finalProduct.images === 'string' ? finalProduct.images : ''),
                        price: Number(finalProduct.price || 0),
                        slug: finalProduct.slug,
                        storeSlug: storeSlug
                    }

                    await supabase.from('messages').insert({
                        conversation_id: conversationId,
                        sender_id: currentUser.id,
                        content: friendlyContent, // Clean content for notifications
                        is_read: false,
                        payload: {
                            ...cardMetadata,
                            is_crm: true,
                            is_auto: true,
                            sender_name: currentUser.email?.split('@')[0]
                        }
                    })
                }
            }

            // 3. Abrir el chat
            setActiveConversationId(conversationId)
            setIsOpen(true)
            toast.dismiss(tid)

        } catch (error: any) {
            console.error('Error starting chat:', error)
            toast.dismiss(tid)
            toast.error(`Could not connect with vendor: ${error.message}`)
        }
    }



    const openContextualChat = async (type: 'order' | 'product' | 'support', id: string, participants: string[], metadata: any = {}) => {
        if (metadata.store_id) {
            await startInquiryChat(metadata.store_id, type === 'product' ? id : null)
            return
        }
        setActiveConversationId(null)
        setIsOpen(true)
    }

    const startConversation = async (targetUserId: string, metadata: any = {}) => {
        setActiveConversationId(null)
        setIsOpen(true)
    }

    return (
        <ChatContext.Provider value={{
            conversations, activeConversationId, messages, isOpen, isLoading,
            isSecure: false,
            setActiveConversationId, setIsOpen, sendMessage,
            startSupportChat: async () => {
                await openContextualChat('support', user?.id || 'general', [user?.id].filter(Boolean) as string[], { title: 'Americana Support' })
            },
            startInquiryChat,
            openContextualChat,
            toggleEphemeralMode: async () => { },
            bubbleColors,
            setBubbleColors,
            user,
            participantProfiles,
            activeOrder,
            typingUsers,
            setTyping,
            startConversation
        }}>
            {children}
        </ChatContext.Provider>
    )
}

export const useChat = () => {
    const context = useContext(ChatContext)
    if (context === undefined) throw new Error('useChat must be used within a ChatProvider')
    return context
}
