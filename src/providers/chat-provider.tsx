'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { usePathname, useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import {
    generateChatKeyPair,
    encryptMessage,
    decryptMessage
} from '@/lib/crypto/chat-crypto'

type Message = {
    id: string
    content: string
    sender_id: string
    created_at: string
    is_read: boolean
    metadata?: any
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
    startInquiryChat: (storeId: string, productId?: string) => Promise<void>
    openContextualChat: (type: 'order' | 'product' | 'support', id: string, participants: string[], metadata?: any) => Promise<void>
    toggleEphemeralMode: (duration: string | null) => Promise<void>
    user: User | null
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
    const [supabase] = useState(() => createClient())
    const router = useRouter()
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [userPrivateKey, setUserPrivateKey] = useState<JsonWebKey | null>(null)
    const pathname = usePathname()

    // 1. Initialize Auth
    useEffect(() => {
        const initAuth = async () => {
            const { data: { user: initialUser } } = await supabase.auth.getUser()
            setUser(initialUser)
        }
        initAuth()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [supabase])

    const fetchConversations = useCallback(async (userId: string) => {
        const { data: convs } = await supabase
            .from('secure_conversations')
            .select('*')
            .contains('participants', [userId])
            .order('updated_at', { ascending: false })

        if (convs) setConversations(convs)
    }, [supabase])

    // 2. Initialize Security Keys & Conversations (depends on user)
    useEffect(() => {
        if (!user) {
            setConversations([])
            setMessages([])
            setUserPrivateKey(null)
            return
        }

        const initSecurity = async () => {
            // Check for existing keys in localStorage
            const storedPrivate = localStorage.getItem(`chat_priv_${user.id}`)
            const storedPublic = localStorage.getItem(`chat_pub_${user.id}`)

            if (storedPrivate && storedPublic) {
                setUserPrivateKey(JSON.parse(storedPrivate))
            } else {
                // Generate new keys
                console.log("Generating fresh E2EE identity for Americana...")
                try {
                    const keys = await generateChatKeyPair()
                    localStorage.setItem(`chat_priv_${user.id}`, JSON.stringify(keys.privateKey))
                    localStorage.setItem(`chat_pub_${user.id}`, JSON.stringify(keys.publicKey))
                    setUserPrivateKey(keys.privateKey)

                    // Sync Public Key to profiles for discovery
                    await supabase.from('profiles').update({
                        chat_public_key: keys.publicKey
                    }).eq('id', user.id)
                } catch (e) {
                    console.error("Key generation failed:", e)
                }
            }

            fetchConversations(user.id)
        }
        initSecurity()
    }, [user, supabase, fetchConversations])

    // Load messages when active conversation changes
    useEffect(() => {
        if (!activeConversationId) {
            setMessages([])
            return
        }

        const fetchAndDecryptMessages = async () => {
            setIsLoading(true)
            const { data } = await supabase
                .from('secure_messages')
                .select('*')
                .eq('conversation_id', activeConversationId)
                .order('created_at', { ascending: true })

            if (data && userPrivateKey) {
                // Decrypt each message if it has E2EE metadata
                const decrypted = await Promise.all(data.map(async (msg) => {
                    if (msg.metadata?.e2ee) {
                        const payload = user ? msg.metadata.e2ee[user.id] : null
                        if (payload) {
                            const clearText = await decryptMessage(payload, userPrivateKey)
                            return { ...msg, content: clearText }
                        }
                    }
                    return msg
                }))
                setMessages(decrypted)
            } else if (data) {
                setMessages(data)
            }
            setIsLoading(false)
        }
        fetchAndDecryptMessages()

        // Realtime Subscription
        const channel = supabase.channel(`secure_messages:${activeConversationId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'secure_messages', filter: `conversation_id=eq.${activeConversationId}` },
                async (payload) => {
                    const newMessage = payload.new as Message
                    if (newMessage.metadata?.e2ee && userPrivateKey) {
                        const e2eePayload = user ? newMessage.metadata.e2ee[user.id] : null
                        if (e2eePayload) {
                            const clearText = await decryptMessage(e2eePayload, userPrivateKey)
                            newMessage.content = clearText
                        }
                    }
                    setMessages(prev => [...prev, newMessage])
                }
            )
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [activeConversationId, userPrivateKey, user?.id, supabase, user])


    const sendMessage = async (content: string, metadata: any = {}) => {
        if (!activeConversationId || !user) return

        const activeConv = conversations.find(c => c.id === activeConversationId)
        if (!activeConv) return

        try {
            // E2EE Flow: Encrypt for all participants
            const e2eeMetadata: any = {}

            // 1. Get Public Keys for all participants
            const { data: participants } = await supabase
                .from('profiles')
                .select('id, chat_public_key')
                .in('id', activeConv.participants)

            if (participants && participants.length > 0) {
                const encryptionTasks = participants.map(async (p) => {
                    if (p.chat_public_key) {
                        const encrypted = await encryptMessage(content, p.chat_public_key)
                        e2eeMetadata[p.id] = encrypted
                    }
                })
                await Promise.all(encryptionTasks)
            }

            const { error } = await supabase.from('secure_messages').insert({
                conversation_id: activeConversationId,
                sender_id: user.id,
                content: "[Encrypted Message]", // Fallback for old clients
                metadata: { ...metadata, e2ee: e2eeMetadata }
            })

            if (error) throw error
        } catch (error) {
            toast.error('Identity Verification Failed or Network Error')
            console.error(error)
        }
    }

    const startInquiryChat = async (storeId: string, _productId?: string) => {
        if (!user) {
            router.push(`/login?next=${pathname}`)
            return
        }

        const { data: store } = await supabase.from('stores').select('owner_id').eq('id', storeId).single()
        if (!store) return

        const participants = [user.id, store.owner_id]

        // 2-step check for existing conversation
        const { data: existing } = await supabase
            .from('secure_conversations')
            .select('id')
            .contains('participants', participants)
            .eq('type', 'inquiry')
            .maybeSingle()

        if (existing) {
            setActiveConversationId(existing.id)
            setIsOpen(true)
            return
        }

        const { data: conv } = await supabase
            .from('secure_conversations')
            .insert({
                participants,
                type: 'inquiry',
                title: 'Product Inquiry',
                store_id: storeId
            })
            .select().single()

        if (conv) {
            setActiveConversationId(conv.id)
            setIsOpen(true)
            fetchConversations(user.id)
        }
    }

    const openContextualChat = async (type: 'order' | 'product' | 'support', id: string, participants: string[], metadata: any = {}) => {
        if (!user) {
            router.push(`/login?next=${pathname}`)
            return
        }

        // Add current user to participants if not present
        const finalParticipants = [...participants]
        if (!finalParticipants.includes(user.id)) {
            finalParticipants.push(user.id)
        }

        // 1. If SUPPORT: Automatically include all Admins
        if (type === 'support') {
            const { data: admins } = await supabase
                .from('profiles')
                .select('id')
                .eq('role', 'admin')

            if (admins) {
                admins.forEach(admin => {
                    if (!finalParticipants.includes(admin.id)) {
                        finalParticipants.push(admin.id)
                    }
                })
            }
        }

        // Check for existing conversation with this exact context
        const { data: existing } = await supabase
            .from('secure_conversations')
            .select('id')
            .eq('context_type', type)
            .eq('context_id', id)
            .maybeSingle()

        if (existing) {
            setActiveConversationId(existing.id)
            setIsOpen(true)
            return
        }

        // Create new contextual conversation
        const { data: conv, error } = await supabase
            .from('secure_conversations')
            .insert({
                participants: finalParticipants,
                context_type: type,
                context_id: id,
                type: type === 'support' ? 'support' : 'inquiry',
                title: metadata.title || `${type === 'order' ? 'Order' : 'Product'} Inquiry`,
                store_id: metadata.store_id
            })
            .select().single()

        if (conv) {
            setActiveConversationId(conv.id)
            setIsOpen(true)
            fetchConversations(user.id)
        } else if (error) {
            toast.error("Failed to initiate chat context")
            console.error("Contextual Chat Error:", error.message, error.details, error.hint)
        }
    }

    return (
        <ChatContext.Provider value={{
            conversations, activeConversationId, messages, isOpen, isLoading,
            isSecure: !!userPrivateKey,
            setActiveConversationId, setIsOpen, sendMessage,
            startSupportChat: async () => {
                // Generate a stable ID for general support or use user id
                await openContextualChat('support', user?.id || 'general', [user?.id].filter(Boolean) as string[], { title: 'Americana Support' })
            },
            startInquiryChat,
            openContextualChat,
            toggleEphemeralMode: async () => { }, // TODO
            user
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
