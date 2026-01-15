'use client'

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { usePathname } from 'next/navigation'

type Message = {
    id: string
    content: string
    sender_id: string
    created_at: string
    is_read: boolean
}

type Conversation = {
    id: string
    type: 'support' | 'inquiry'
    title?: string
    store_id?: string
    updated_at: string
    last_message?: string
    ephemeral_duration?: string // '1h', '24h', etc
}

type ChatContextType = {
    conversations: Conversation[]
    activeConversationId: string | null
    messages: Message[]
    isOpen: boolean
    isLoading: boolean
    setActiveConversationId: (id: string | null) => void
    setIsOpen: (open: boolean) => void
    sendMessage: (content: string) => Promise<void>
    startSupportChat: () => Promise<void>
    startInquiryChat: (storeId: string, productId?: string) => Promise<void>
    toggleEphemeralMode: (duration: string | null) => Promise<void>
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
    const supabase = createClient()
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [user, setUser] = useState<any>(null)
    const pathname = usePathname()

    // Create a ref for activeConversationId to use inside subscription callbacks
    const activeIdRef = useRef(activeConversationId)
    useEffect(() => {
        activeIdRef.current = activeConversationId
    }, [activeConversationId])

    // Load initial user and conversations
    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
            if (user) {
                fetchConversations()
            }
        }
        init()

        // Subscribe to NEW conversations
        const channel = supabase.channel('conversations_channel')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'conversations' },
                () => fetchConversations() // Refresh list on change
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase])

    // Load messages when active conversation changes
    useEffect(() => {
        if (!activeConversationId) {
            setMessages([])
            return
        }

        const fetchMessages = async () => {
            setIsLoading(true)
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', activeConversationId)
                .order('created_at', { ascending: true })

            if (data) setMessages(data)
            setIsLoading(false)
        }
        fetchMessages()

        // Realtime Subscription for Messages
        const channel = supabase.channel(`messages:${activeConversationId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${activeConversationId}`
                },
                (payload) => {
                    const newMessage = payload.new as Message
                    setMessages(prev => [...prev, newMessage])
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }

    }, [activeConversationId, supabase])


    const fetchConversations = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Fetch conversations where user is a participant
        // Note: We need to join with stores if needed, but for now simple select
        const { data: parts } = await supabase
            .from('conversation_participants')
            .select('conversation_id')
            .eq('user_id', user.id)

        if (!parts || parts.length === 0) {
            setConversations([])
            return
        }

        const ids = parts.map(p => p.conversation_id)
        const { data: convs } = await supabase
            .from('conversations')
            .select('*')
            .in('id', ids)
            .order('updated_at', { ascending: false })

        if (convs) setConversations(convs)
    }

    const sendMessage = async (content: string) => {
        if (!activeConversationId || !user) return

        const { error } = await supabase.from('messages').insert({
            conversation_id: activeConversationId,
            sender_id: user.id,
            content
        })

        if (error) {
            toast.error('Failed to send message')
            console.error(error)
        }
    }

    const startSupportChat = async () => {
        if (!user) {
            toast.error('Please login to chat with support')
            return
        }

        // Check if existing support chat exists
        // simplified logic: check local conversations
        const existing = conversations.find(c => c.type === 'support')
        if (existing) {
            console.log('Opening existing support chat', existing.id)
            setActiveConversationId(existing.id)
            setIsOpen(true)
            return
        }

        console.log('Creating new support chat for user', user.id)
        // Create new support conversation
        const { data: conv, error } = await supabase
            .from('conversations')
            .insert({
                type: 'support',
                title: 'Support Chat',
                created_by: user.id
            })
            .select()
            .single()

        if (error || !conv) {
            console.error('Error creating support chat:', error)
            toast.error('Could not start chat')
            return
        }

        // Add participant (User)
        // Note: RLS now allows us to see the conversation immediately because of created_by
        const { error: partError } = await supabase.from('conversation_participants').insert({
            conversation_id: conv.id,
            user_id: user.id,
            role: 'buyer'
        })

        if (partError) console.error('Error adding participant:', partError)

        await fetchConversations()
        setActiveConversationId(conv.id)
        setIsOpen(true)
    }

    const startInquiryChat = async (storeId: string, productId?: string) => {
        if (!user) {
            toast.error('Please login to inquire')
            return
        }

        // Check for existing inquiry
        // For now, simpler to just create new or check based on title/store combo?
        // Let's create new for distinct inquiries. Can optimize later.

        // Create new inquiry
        const { data: conv, error } = await supabase
            .from('conversations')
            .insert({
                type: 'inquiry',
                title: productId ? 'Product Inquiry' : 'Store Inquiry',
                store_id: storeId,
                product_id: productId || null,
                created_by: user.id
            })
            .select()
            .single()

        if (error || !conv) {
            console.error('Error starting inquiry:', error)
            toast.error('Could not start inquiry')
            return
        }

        // Add User Participant (Buyer)
        await supabase.from('conversation_participants').insert({
            conversation_id: conv.id,
            user_id: user.id,
            role: 'buyer'
        })

        // NOTE: The Vendor (Store Owner) needs to see this. 
        // Our 'is_store_owner_for_conversation' function handles this visibility.
        // We *could* insert them as a participant now if we knew their user_id, 
        // but RLS handles the view permission. 
        // Ideally, they join the chat layout when they reply.

        await fetchConversations()
        setActiveConversationId(conv.id)
        setIsOpen(true)
    }

    const toggleEphemeralMode = async (duration: string | null) => {
        if (!activeConversationId) return

        const { error } = await supabase
            .from('conversations')
            .update({ ephemeral_duration: duration })
            .eq('id', activeConversationId)

        if (error) {
            toast.error('Failed to update privacy settings')
        } else {
            toast.success(`Disappearing messages: ${duration ? 'ON' : 'OFF'}`)
            fetchConversations() // Refresh local state
        }
    }

    return (
        <ChatContext.Provider value={{
            conversations,
            activeConversationId,
            messages,
            isOpen,
            isLoading,
            setActiveConversationId,
            setIsOpen,
            sendMessage,
            startSupportChat,
            startInquiryChat,
            toggleEphemeralMode
        }}>
            {children}
        </ChatContext.Provider>
    )
}

export const useChat = () => {
    const context = useContext(ChatContext)
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider')
    }
    return context
}
